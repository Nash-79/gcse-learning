import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { requireAuthenticatedUser } from "../_shared/auth.ts";
import { STRUCTURED_OUTPUT_INSTRUCTION, STRUCTURED_USER_SUFFIX } from "../_shared/structuredContract.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

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
    const requestedModel = model || (preferLovable ? "google/gemini-3-flash-preview" : "meta-llama/llama-3.3-70b-instruct:free");
    const isOpenRouterModel = OPENROUTER_MODELS.has(requestedModel);

    // Append structured suffix to last user message
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

    let response: Response;
    let usedFallback = false;
    let finalModelId = requestedModel;
    let finalModelLabel = requestedModel.split("/").pop()?.replace(":free", "") || requestedModel;

    if (!preferLovable && isOpenRouterModel && OPENROUTER_API_KEY) {
      response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "HTTP-Referer": "https://lovable.dev",
        },
        body: JSON.stringify({
          model: requestedModel,
          messages: chatMessages,
          stream: true,
        }),
      });

      if (!response.ok && LOVABLE_API_KEY) {
        console.log("OpenRouter rate limited, falling back to Lovable AI");
        usedFallback = true;
        finalModelId = "google/gemini-3-flash-preview";
        finalModelLabel = "Gemini 3 Flash (Lovable AI)";
        response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-3-flash-preview",
            messages: chatMessages,
            stream: true,
          }),
        });
      }
    } else if (LOVABLE_API_KEY) {
      finalModelId = "google/gemini-3-flash-preview";
      finalModelLabel = "Gemini 3 Flash (Lovable AI)";
      response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: chatMessages,
          stream: true,
        }),
      });
    } else {
      throw new Error("No suitable AI provider available for the selected model");
    }

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit reached. Please wait a moment and try again." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please try again later." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI service unavailable" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Create a TransformStream to append meta event after the AI stream completes
    const metaEvent = `\ndata: ${JSON.stringify({ meta: { routeKey: "gcse-chat", finalModelId, finalModelLabel, usedFallback } })}\n\n`;
    const encoder = new TextEncoder();

    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();

    (async () => {
      const reader = response.body!.getReader();
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          await writer.write(value);
        }
        // Append meta event at the end of the stream
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
    console.error("gcse-chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
