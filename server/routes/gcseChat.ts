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

router.post("/", async (req: Request, res: Response) => {
  try {
    const { messages, model, provider } = req.body;

    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

    if (!OPENROUTER_API_KEY) {
      res.status(500).json({ error: "No AI API key configured. Please add OPENROUTER_API_KEY to your environment." });
      return;
    }

    const requestedModel = model || "meta-llama/llama-3.3-70b-instruct:free";
    const isOpenRouterModel = OPENROUTER_MODELS.has(requestedModel);
    const finalModel = isOpenRouterModel ? requestedModel : "meta-llama/llama-3.3-70b-instruct:free";

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

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": "https://pylearn.app",
      },
      body: JSON.stringify({
        model: finalModel,
        messages: chatMessages,
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        res.status(429).json({ error: "Rate limit reached. Please wait a moment and try again." });
        return;
      }
      if (response.status === 402) {
        res.status(402).json({ error: "AI credits exhausted. Please try again later." });
        return;
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      res.status(500).json({ error: "AI service unavailable" });
      return;
    }

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    if (!response.body) {
      res.status(500).json({ error: "No response body" });
      return;
    }

    const reader = (response.body as any).getReader();
    const decoder = new TextDecoder();

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        res.write(chunk);
      }
    } finally {
      res.end();
    }
  } catch (e: any) {
    console.error("gcse-chat error:", e);
    if (!res.headersSent) {
      res.status(500).json({ error: e?.message || "Unknown error" });
    }
  }
});

export { router as gcseChatRouter };
