import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { requireAuthenticatedUser } from "../_shared/auth.ts";
import { STRUCTURED_OUTPUT_INSTRUCTION, STRUCTURED_USER_SUFFIX } from "../_shared/structuredContract.ts";
import {
  OPENROUTER_CHAIN,
  OPENROUTER_MODELS,
  LOVABLE_JSON_MODEL,
  type AiAttempt,
  type AiFallbackReason,
  type ProviderName,
  isRetryableStatus,
  modelLabel,
  parseRetryWaitMs,
  sanitizeSnippet,
  shouldLogUpstreamFailure,
  sleep,
} from "../_shared/aiProviders.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const MAX_RETRIES_PER_MODEL = 1; // +1 initial = 2 attempts per model
const ROUTE_KEY = "ai-chat";

async function callProvider(
  provider: ProviderName,
  model: string,
  apiKey: string,
  body: Record<string, unknown>,
): Promise<Response> {
  if (provider === "openrouter") {
    return fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": "https://lovable.dev",
      },
      body: JSON.stringify({ ...body, model }),
    });
  }
  // Lovable AI doesn't honour response_format
  const lovableBody: Record<string, unknown> = { ...body, model };
  delete lovableBody.response_format;
  return fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(lovableBody),
  });
}

interface AttemptContext {
  provider: ProviderName;
  model: string;
  apiKey: string;
}

interface AttemptResult {
  response: Response;
  attempts: AiAttempt[];
  fallbackReason: AiFallbackReason | null;
}

// Try a single provider/model with retries on 429/5xx. Returns the final
// response (ok or not) plus the attempts made.
async function tryWithRetries(
  ctx: AttemptContext,
  body: Record<string, unknown>,
): Promise<AttemptResult> {
  const attempts: AiAttempt[] = [];
  let fallbackReason: AiFallbackReason | null = null;
  let response: Response | null = null;

  for (let attempt = 0; attempt <= MAX_RETRIES_PER_MODEL; attempt++) {
    const t0 = Date.now();
    response = await callProvider(ctx.provider, ctx.model, ctx.apiKey, body);
    const elapsed = Date.now() - t0;
    attempts.push({ model: ctx.model, provider: ctx.provider, status: response.status, ms: elapsed });

    if (response.ok) return { response, attempts, fallbackReason };

    if (!isRetryableStatus(response.status)) {
      // Non-retryable (4xx other than 429) — return immediately so the outer
      // chain walker can decide whether to try the next model.
      return { response, attempts, fallbackReason };
    }

    // Capture the first non-success response as the fallback reason.
    if (!fallbackReason) {
      const snippet = sanitizeSnippet(await response.clone().text());
      fallbackReason = {
        status: response.status,
        message: snippet || response.statusText || "Upstream error",
        model: ctx.model,
        provider: ctx.provider,
      };
    }

    if (attempt < MAX_RETRIES_PER_MODEL) {
      await sleep(parseRetryWaitMs(response.headers, attempt));
    }
  }

  // All retries exhausted.
  return { response: response!, attempts, fallbackReason };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authResult = await requireAuthenticatedUser(req);
    if (authResult instanceof Response) {
      return new Response(await authResult.text(), {
        status: authResult.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { messages, mode, topicTitle, code, taskDescription, systemPromptOverride, userPromptOverride, maxTokens, model, provider } = await req.json();

    const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY");
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!OPENROUTER_API_KEY && !LOVABLE_API_KEY) {
      throw new Error("No AI API keys configured");
    }

    const preferLovable = provider === "lovable";
    const requestedModel = model || (preferLovable ? LOVABLE_JSON_MODEL : OPENROUTER_CHAIN[0]);
    const isOpenRouterModel = OPENROUTER_MODELS.has(requestedModel);

    let systemPrompt: string;
    let userMessages: Array<{ role: string; content: string }>;
    let wantJson = false;

    if (mode === "chat") {
      systemPrompt = `You are a GCSE Computer Science tutor helping a student learn Python. The current topic is "${topicTitle}".

IMPORTANT CODING STYLE RULES:
- Use ONLY simple Python suitable for 14-16 year old GCSE students
- Use: print(), input(), variables, if/elif/else, for loops, while loops, simple string concatenation with +
- NEVER use: f-strings, try/except, classes, list comprehensions, lambda, decorators, generators, walrus operator
- For string joining, use: print("Hello " + name) NOT print(f"Hello {name}")
- Keep explanations short (2-3 sentences max per point)
- Use simple vocabulary appropriate for 14-16 year olds
- Comment every significant line of code
- Format code blocks with triple backticks` + STRUCTURED_OUTPUT_INSTRUCTION;
      userMessages = messages.map((m: { role: string; content: string }, i: number) => {
        if (i === messages.length - 1 && m.role === "user") {
          return { ...m, content: m.content + STRUCTURED_USER_SUFFIX };
        }
        return m;
      });
    } else if (mode === "validate") {
      systemPrompt = `You are an OCR GCSE Computer Science exam marker. Grade Python code submissions for the topic "${topicTitle}".

Return ONLY a JSON object with:
- score (0-10 integer)
- maxScore (always 10)
- grade ("A*"|"A"|"B"|"C"|"D"|"U")
- feedback (2-3 sentence overall feedback as an encouraging teacher)
- strengths (array of 2-3 things done well)
- improvements (array of 1-3 things to improve)
- examTips (array of 1-2 OCR exam-specific tips relevant to this code)

Be encouraging but honest. Reference OCR J277 exam expectations where relevant.`;
      userMessages = [{
        role: "user",
        content: `Topic: ${topicTitle}\n${taskDescription ? `Task: ${taskDescription}\n` : ""}Student code:\n\`\`\`python\n${code}\n\`\`\``
      }];
      wantJson = true;
    } else if (mode === "generate") {
      systemPrompt = (systemPromptOverride || "") + STRUCTURED_OUTPUT_INSTRUCTION;
      userMessages = userPromptOverride
        ? [{ role: "user", content: userPromptOverride + STRUCTURED_USER_SUFFIX }]
        : (messages || []);
      wantJson = true;
    } else {
      throw new Error("Invalid mode. Use 'chat', 'validate', or 'generate'.");
    }

    const requestBody: Record<string, unknown> = {
      messages: [
        { role: "system", content: systemPrompt },
        ...userMessages,
      ],
      max_tokens: maxTokens || 1000,
    };

    if (wantJson) {
      requestBody.response_format = { type: "json_object" };
    }

    // Build the ordered candidate list. If a specific model was requested,
    // start there; then continue through the OpenRouter chain (deduped); then
    // drop to Lovable as final fallback.
    const candidates: Array<{ provider: ProviderName; model: string; apiKey: string }> = [];
    const seen = new Set<string>();

    const addOr = (m: string) => {
      if (!OPENROUTER_API_KEY || seen.has(`or:${m}`)) return;
      seen.add(`or:${m}`);
      candidates.push({ provider: "openrouter", model: m, apiKey: OPENROUTER_API_KEY });
    };
    const addLovable = () => {
      if (!LOVABLE_API_KEY || seen.has(`lv:${LOVABLE_JSON_MODEL}`)) return;
      seen.add(`lv:${LOVABLE_JSON_MODEL}`);
      candidates.push({ provider: "lovable", model: LOVABLE_JSON_MODEL, apiKey: LOVABLE_API_KEY });
    };

    if (preferLovable) {
      addLovable();
      for (const m of OPENROUTER_CHAIN) addOr(m);
    } else if (isOpenRouterModel) {
      addOr(requestedModel);
      for (const m of OPENROUTER_CHAIN) addOr(m);
      addLovable();
    } else {
      // Unknown model — try Lovable first, then OpenRouter chain.
      addLovable();
      for (const m of OPENROUTER_CHAIN) addOr(m);
    }

    if (candidates.length === 0) {
      throw new Error("No AI provider available");
    }

    const startTime = Date.now();
    const allAttempts: AiAttempt[] = [];
    let fallbackReason: AiFallbackReason | null = null;
    let finalResponse: Response | null = null;
    let finalCandidate = candidates[0];

    for (const candidate of candidates) {
      const result = await tryWithRetries(candidate, requestBody);
      allAttempts.push(...result.attempts);
      if (!fallbackReason && result.fallbackReason) {
        fallbackReason = result.fallbackReason;
      }
      finalResponse = result.response;
      finalCandidate = candidate;
      if (result.response.ok) break;

      // Log upstream failure once per (origin, status, model) per minute.
      if (shouldLogUpstreamFailure({ origin: ROUTE_KEY, status: result.response.status, model: candidate.model })) {
        console.error(`[${ROUTE_KEY}] upstream ${result.response.status} from ${candidate.provider}/${candidate.model}`);
      }
    }

    if (!finalResponse || !finalResponse.ok) {
      const status = finalResponse?.status || 500;
      const elapsedMs = Date.now() - startTime;
      const errorBody = finalResponse ? sanitizeSnippet(await finalResponse.text()) : "No response";
      console.error(`[${ROUTE_KEY}] all candidates failed:`, status, errorBody);
      return new Response(
        JSON.stringify({
          error: "AI service unavailable",
          meta: {
            routeKey: ROUTE_KEY,
            finalModelId: finalCandidate.model,
            finalModelLabel: modelLabel(finalCandidate.model, finalCandidate.provider),
            usedFallback: allAttempts.length > 1,
            degraded: true,
            attemptCount: allAttempts.length,
            elapsedMs,
            fallbackReason,
            attempts: allAttempts,
          },
        }),
        { status: status === 402 || status === 429 ? status : 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await finalResponse.json();
    const content = data.choices?.[0]?.message?.content || "";
    const elapsedMs = Date.now() - startTime;
    const intendedFirst = candidates[0];
    const usedFallback = finalCandidate.model !== intendedFirst.model || finalCandidate.provider !== intendedFirst.provider;

    const meta = {
      routeKey: ROUTE_KEY,
      finalModelId: finalCandidate.model,
      finalModelLabel: modelLabel(finalCandidate.model, finalCandidate.provider),
      usedFallback,
      attemptCount: allAttempts.length,
      elapsedMs,
      fallbackReason,
      attempts: allAttempts,
    };

    if (wantJson) {
      const jsonMatch = content.match(/[\[{][\s\S]*[\]}]/);
      if (jsonMatch) {
        return new Response(JSON.stringify({ content: jsonMatch[0], meta }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error("Could not parse AI JSON response");
    }

    return new Response(JSON.stringify({ content, meta }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error(`[${ROUTE_KEY}] error:`, e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
