import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Models supported by OpenRouter free tier
const OPENROUTER_MODELS = new Set([
  "meta-llama/llama-3.3-70b-instruct:free",
  "google/gemma-3-27b-it:free",
  "qwen/qwen3-coder:free",
  "nvidia/nemotron-3-super-120b-a12b:free",
  "qwen/qwen3-next-80b-a3b-instruct:free",
  "openai/gpt-oss-120b:free",
  "stepfun/step-3.5-flash:free",
  "mistralai/mistral-small-3.1-24b-instruct:free",
  "arcee-ai/trinity-large-preview:free",
  "openai/gpt-oss-20b:free",
  "minimax/minimax-m2.5:free",
  "nvidia/nemotron-3-nano-30b-a3b:free",
  "nousresearch/hermes-3-llama-3.1-405b:free",
  "nvidia/nemotron-nano-12b-v2-vl:free",
  "nvidia/nemotron-nano-9b-v2:free",
  "z-ai/glm-4.5-air:free",
  "arcee-ai/trinity-mini:free",
  "google/gemma-3-12b-it:free",
  "google/gemma-3-4b-it:free",
  "qwen/qwen3-4b:free",
  "meta-llama/llama-3.2-3b-instruct:free",
  "meta-llama/llama-3.1-8b-instruct:free",
]);

async function callAI(apiKey: string, body: Record<string, unknown>, isOpenRouter: boolean): Promise<Response> {
  if (isOpenRouter) {
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
  // Lovable AI gateway - override model
  const lovableBody = { ...body, model: "google/gemini-2.5-flash" };
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

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, mode, topicTitle, code, taskDescription, systemPromptOverride, userPromptOverride, maxTokens, model, provider } = await req.json();

    const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY");
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!OPENROUTER_API_KEY && !LOVABLE_API_KEY) {
      throw new Error("No AI API keys configured");
    }

    const preferLovable = provider === "lovable";
    const requestedModel = model || (preferLovable ? "google/gemini-2.5-flash" : "meta-llama/llama-3.3-70b-instruct:free");
    const isOpenRouterModel = OPENROUTER_MODELS.has(requestedModel);

    let systemPrompt: string;
    let userMessages: Array<{ role: string; content: string }>;
    let wantJson = false;

    if (mode === "chat") {
      systemPrompt = `You are a GCSE Computer Science tutor helping a student learn Python. The current topic is "${topicTitle}". Keep explanations clear, concise, and appropriate for 14-16 year old students. Use Python code examples when helpful. Format code blocks with triple backticks.`;
      userMessages = messages;
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
      systemPrompt = systemPromptOverride || "";
      userMessages = userPromptOverride
        ? [{ role: "user", content: userPromptOverride }]
        : (messages || []);
      wantJson = true;
    } else {
      throw new Error("Invalid mode. Use 'chat', 'validate', or 'generate'.");
    }

    const requestBody: Record<string, unknown> = {
      model: requestedModel,
      messages: [
        { role: "system", content: systemPrompt },
        ...userMessages,
      ],
      max_tokens: maxTokens || 1000,
    };

    if (wantJson) {
      requestBody.response_format = { type: "json_object" };
    }

    // Route based on provider preference
    let response: Response | null = null;

    if (!preferLovable && isOpenRouterModel && OPENROUTER_API_KEY) {
      response = await callAI(OPENROUTER_API_KEY, requestBody, true);
      if (response.status === 429 && LOVABLE_API_KEY) {
        console.log("OpenRouter rate limited, falling back to Lovable AI");
        response = await callAI(LOVABLE_API_KEY, requestBody, false);
      }
    } else if (LOVABLE_API_KEY) {
      response = await callAI(LOVABLE_API_KEY, requestBody, false);
    } else if (OPENROUTER_API_KEY) {
      response = await callAI(OPENROUTER_API_KEY, requestBody, true);
    }

    if (!response || !response.ok) {
      const status = response?.status || 500;
      const errorText = response ? await response.text() : "No response";
      console.error("AI error:", status, errorText);
      throw new Error(`AI API error: ${status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    if (wantJson) {
      const jsonMatch = content.match(/[\[{][\s\S]*[\]}]/);
      if (jsonMatch) {
        return new Response(JSON.stringify({ content: jsonMatch[0] }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error("Could not parse AI JSON response");
    }

    return new Response(JSON.stringify({ content }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("ai-chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
