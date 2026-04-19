import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { requireAuthenticatedUser } from "../_shared/auth.ts";
import { STRUCTURED_OUTPUT_INSTRUCTION, STRUCTURED_USER_SUFFIX } from "../_shared/structuredContract.ts";
import {
  OPENROUTER_CHAIN,
  OPENROUTER_MODELS,
  LOVABLE_STREAM_MODEL,
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

const ROUTE_KEY = "gcse-chat";
const MAX_RETRIES_PER_MODEL = 1;

const SYSTEM_PROMPT = `You are **PyLearn AI** — a dedicated GCSE Computer Science tutor specialising in Python programming for the OCR J277 and AQA 8525 specifications.

## Your Personality
- Friendly, encouraging, and patient — like a great teacher
- You celebrate effort and guide students to the answer rather than just giving it

## CRITICAL: Simple Python Only
- Use ONLY simple Python suitable for GCSE students (age 14-16)
- ALWAYS use: print(), input(), variables, if/elif/else, for loops, while loops, simple string concatenation with +
- NEVER use: f-strings, try/except, classes, list comprehensions, lambda, decorators, generators, walrus operator, type hints
- For string output use: print("Hello " + name) NOT print(f"Hello {name}")
- For number in string use: print("Age: " + str(age)) NOT print(f"Age: {age}")
- Only show advanced syntax if the student explicitly asks for it

## Response Rules
1. **Keep explanations short** — 2-3 sentences max per point, age-appropriate for 14-16 year olds
2. **Reference exam context** — mention mark schemes, common exam patterns, command words (State, Describe, Explain, Evaluate)
3. **When showing code**, always include clear comments on every significant line
4. **For debugging help**: identify the error, explain WHY it is wrong, show the fix
5. **For exam questions**: break down the marks available, suggest a structure, highlight keywords

## Follow-Up Questions
At the END of EVERY response, include a section:

---
**Want to keep going?**

Then list exactly 3 short follow-up questions as bullet points that naturally extend from the topic just discussed. Make them progressively harder.

## Topics You Cover
- Python basics: variables, data types, casting, input/output
- Operators: arithmetic, comparison, logical (AND, OR, NOT)
- Selection: if/elif/else, nested selection
- Iteration: for loops, while loops, nested loops
- Data structures: lists, 2D arrays, dictionaries
- String handling: slicing, methods, concatenation
- Subprograms: functions, procedures, parameters, return values
- File handling: read, write, append (CSV and text)
- Robust programming: validation, authentication, testing
- Algorithms: searching (linear, binary), sorting (bubble, merge, insertion)
- SQL basics: SELECT, INSERT, UPDATE, DELETE, WHERE, ORDER BY
- Boolean logic: truth tables, logic gates, De Morgan's Law

## What You Don't Do
- Don't help with topics outside GCSE Computer Science
- Don't write full coursework solutions — guide the student instead
- If asked something off-topic, gently redirect` + STRUCTURED_OUTPUT_INSTRUCTION;

async function callProvider(
  provider: ProviderName,
  model: string,
  apiKey: string,
  chatMessages: Array<{ role: string; content: string }>,
): Promise<Response> {
  const body = { model, messages: chatMessages, stream: true };
  if (provider === "openrouter") {
    return fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": "https://lovable.dev",
      },
      body: JSON.stringify(body),
    });
  }
  return fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

interface AttemptOutcome {
  response: Response;
  attempts: AiAttempt[];
  fallbackReason: AiFallbackReason | null;
}

async function tryWithRetries(
  provider: ProviderName,
  model: string,
  apiKey: string,
  chatMessages: Array<{ role: string; content: string }>,
): Promise<AttemptOutcome> {
  const attempts: AiAttempt[] = [];
  let fallbackReason: AiFallbackReason | null = null;
  let response: Response | null = null;

  for (let attempt = 0; attempt <= MAX_RETRIES_PER_MODEL; attempt++) {
    const t0 = Date.now();
    response = await callProvider(provider, model, apiKey, chatMessages);
    const ms = Date.now() - t0;
    attempts.push({ model, provider, status: response.status, ms });

    if (response.ok) return { response, attempts, fallbackReason };
    if (!isRetryableStatus(response.status)) {
      return { response, attempts, fallbackReason };
    }

    if (!fallbackReason) {
      const snippet = sanitizeSnippet(await response.clone().text());
      fallbackReason = {
        status: response.status,
        message: snippet || response.statusText || "Upstream error",
        model,
        provider,
      };
    }

    if (attempt < MAX_RETRIES_PER_MODEL) {
      await sleep(parseRetryWaitMs(response.headers, attempt));
    }
  }

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

    const { messages, model, provider } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY");

    if (!LOVABLE_API_KEY && !OPENROUTER_API_KEY) {
      throw new Error("No AI API keys configured");
    }

    const preferLovable = provider === "lovable";
    const requestedModel = model || (preferLovable ? LOVABLE_STREAM_MODEL : OPENROUTER_CHAIN[0]);
    const isOpenRouterModel = OPENROUTER_MODELS.has(requestedModel);

    const augmentedMessages = messages.map((m: { role: string; content: string }, i: number) => {
      if (i === messages.length - 1 && m.role === "user") {
        return { ...m, content: m.content + STRUCTURED_USER_SUFFIX };
      }
      return m;
    });

    const chatMessages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...augmentedMessages,
    ];

    // Build candidate chain.
    const candidates: Array<{ provider: ProviderName; model: string; apiKey: string }> = [];
    const seen = new Set<string>();
    const addOr = (m: string) => {
      if (!OPENROUTER_API_KEY || seen.has(`or:${m}`)) return;
      seen.add(`or:${m}`);
      candidates.push({ provider: "openrouter", model: m, apiKey: OPENROUTER_API_KEY });
    };
    const addLovable = () => {
      if (!LOVABLE_API_KEY || seen.has(`lv:${LOVABLE_STREAM_MODEL}`)) return;
      seen.add(`lv:${LOVABLE_STREAM_MODEL}`);
      candidates.push({ provider: "lovable", model: LOVABLE_STREAM_MODEL, apiKey: LOVABLE_API_KEY });
    };

    if (preferLovable) {
      addLovable();
      for (const m of OPENROUTER_CHAIN) addOr(m);
    } else if (isOpenRouterModel) {
      addOr(requestedModel);
      for (const m of OPENROUTER_CHAIN) addOr(m);
      addLovable();
    } else {
      addLovable();
      for (const m of OPENROUTER_CHAIN) addOr(m);
    }

    if (candidates.length === 0) {
      throw new Error("No AI provider available");
    }

    const allAttempts: AiAttempt[] = [];
    let fallbackReason: AiFallbackReason | null = null;
    let finalResponse: Response | null = null;
    let finalCandidate = candidates[0];

    for (const candidate of candidates) {
      const outcome = await tryWithRetries(candidate.provider, candidate.model, candidate.apiKey, chatMessages);
      allAttempts.push(...outcome.attempts);
      if (!fallbackReason && outcome.fallbackReason) fallbackReason = outcome.fallbackReason;
      finalResponse = outcome.response;
      finalCandidate = candidate;
      if (outcome.response.ok) break;
      if (shouldLogUpstreamFailure({ origin: ROUTE_KEY, status: outcome.response.status, model: candidate.model })) {
        console.error(`[${ROUTE_KEY}] upstream ${outcome.response.status} from ${candidate.provider}/${candidate.model}`);
      }
    }

    if (!finalResponse || !finalResponse.ok) {
      const status = finalResponse?.status || 500;
      if (status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit reached. Please wait a moment and try again." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please try again later." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorBody = finalResponse ? sanitizeSnippet(await finalResponse.text()) : "No response";
      console.error(`[${ROUTE_KEY}] all candidates failed:`, status, errorBody);
      return new Response(JSON.stringify({ error: "AI service unavailable" }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const intendedFirst = candidates[0];
    const usedFallback = finalCandidate.model !== intendedFirst.model || finalCandidate.provider !== intendedFirst.provider;

    const meta = {
      routeKey: ROUTE_KEY,
      finalModelId: finalCandidate.model,
      finalModelLabel: modelLabel(finalCandidate.model, finalCandidate.provider),
      usedFallback,
      attemptCount: allAttempts.length,
      fallbackReason,
      attempts: allAttempts,
    };

    const metaEvent = `\ndata: ${JSON.stringify({ meta })}\n\n`;
    const encoder = new TextEncoder();

    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();

    (async () => {
      const reader = finalResponse!.body!.getReader();
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          await writer.write(value);
        }
        await writer.write(encoder.encode(metaEvent));
      } catch (e) {
        console.error("Stream relay error:", e);
      } finally {
        await writer.close();
      }
    })();

    return new Response(readable, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error(`[${ROUTE_KEY}] error:`, e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
