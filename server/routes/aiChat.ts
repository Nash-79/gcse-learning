import { Router, Request, Response } from "express";

const router = Router();

const STRUCTURED_OUTPUT_INSTRUCTION = `

====================
OUTPUT FORMAT RULES
====================

Your first priority is to return a valid JSON object.
If you cannot reliably produce valid JSON, then return clean Markdown using the fallback format below.
Do not return anything except:
1. valid JSON matching the schema below, OR
2. the exact Markdown fallback structure below.

PRIMARY MODE: JSON
Return this exact JSON shape:
{
  "mode": "json",
  "summary": "string",
  "sections": [
    {
      "heading": "string",
      "content": "string",
      "bullets": ["string"]
    }
  ],
  "next_step": "string"
}
JSON rules:
- Output valid JSON only, no markdown, no backticks, no comments, no extra keys
- Always include: mode, summary, sections, next_step
- Set "mode" to "json"
- summary must be 1 to 2 sentences
- sections must contain 1 to 4 items
- each section must include "heading" and optionally "content" and/or "bullets"
- use short content and bullets for lists, steps, comparisons
- For code examples, put code in content as a plain string
- next_step may be an empty string

FALLBACK MODE: MARKDOWN
If you cannot produce valid JSON, output this exact structure:
MODE: markdown
SUMMARY:
<1 to 2 sentence direct answer>
## <Section Heading>
<short paragraph>
- <bullet>
NEXT STEP:
<one short practical next step, or leave blank>

STYLE: Be concise, use simple language, avoid filler and repetition, keep output easy to scan.
DECISION: Prefer JSON. Use Markdown fallback only if JSON reliability is uncertain. Never mix formats.`;

const STRUCTURED_USER_SUFFIX = "\n\nReturn JSON if possible. If not, use the Markdown fallback exactly.";

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

async function callOpenRouter(apiKey: string, body: Record<string, unknown>): Promise<Response> {
  return fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "HTTP-Referer": "https://replit.com/@Nash-21",
      "X-Title": "PyLearn Replit App",
    },
    body: JSON.stringify(body),
  }) as unknown as Response;
}

router.post("/", async (req: Request, res: Response) => {
  try {
    const { messages, mode, topicTitle, code, taskDescription, systemPromptOverride, userPromptOverride, maxTokens, model, provider } = req.body;

    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

    if (!OPENROUTER_API_KEY) {
      res.status(500).json({ error: "No AI API key configured. Please add OPENROUTER_API_KEY to your environment." });
      return;
    }

    const requestedModel = model || "meta-llama/llama-3.3-70b-instruct:free";
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
      res.status(400).json({ error: "Invalid mode. Use 'chat', 'validate', or 'generate'." });
      return;
    }

    const requestBody: Record<string, unknown> = {
      model: isOpenRouterModel ? requestedModel : "meta-llama/llama-3.3-70b-instruct:free",
      messages: [
        { role: "system", content: systemPrompt },
        ...userMessages,
      ],
      max_tokens: maxTokens || 1000,
    };

    if (wantJson) {
      requestBody.response_format = { type: "json_object" };
    }

    const response = await callOpenRouter(OPENROUTER_API_KEY, requestBody);

    if (!(response as any).ok) {
      const status = (response as any).status || 500;
      const errorText = await (response as any).text();
      console.error("AI error:", status, errorText);
      res.status(status).json({ error: `AI API error: ${status}` });
      return;
    }

    const data = await (response as any).json();
    const content = data.choices?.[0]?.message?.content || "";

    if (wantJson) {
      const jsonMatch = content.match(/[\[{][\s\S]*[\]}]/);
      if (jsonMatch) {
        res.json({ content: jsonMatch[0] });
        return;
      }
      res.status(500).json({ error: "Could not parse AI JSON response" });
      return;
    }

    res.json({ content });
  } catch (e: any) {
    console.error("ai-chat error:", e);
    res.status(500).json({ error: e?.message || "Unknown error" });
  }
});

export { router as aiChatRouter };
