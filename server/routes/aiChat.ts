import { Router, Request, Response } from "express";
import {
  callOpenRouterWithRetry,
  extractOpenRouterError,
  resolveApiKey,
  resolveModel,
} from "./openrouter.js";

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

router.post("/", async (req: Request, res: Response) => {
  try {
    const { messages, mode, topicTitle, code, taskDescription, systemPromptOverride, userPromptOverride, maxTokens, model, provider } = req.body;

    const apiKey = resolveApiKey(req);

    if (!apiKey) {
      res.status(500).json({ error: "No AI API key configured. Add your key in Settings or set OPENROUTER_API_KEY." });
      return;
    }

    const finalModel = resolveModel(model);

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
      model: finalModel,
      messages: [
        { role: "system", content: systemPrompt },
        ...userMessages,
      ],
      max_tokens: maxTokens || 1000,
    };

    if (wantJson) {
      requestBody.response_format = { type: "json_object" };
    }

    const response = await callOpenRouterWithRetry(apiKey, requestBody);

    if (!(response as any).ok) {
      const status = (response as any).status || 500;
      const errorText = await extractOpenRouterError(response as unknown as Response);
      console.error("AI error:", status, errorText);
      if (status === 429) {
        res.status(429).json({ error: "Rate limit reached on this model. Switch model or retry in 20-60 seconds." });
        return;
      }
      if (status === 402) {
        res.status(402).json({ error: "OpenRouter credits/quota unavailable for this request." });
        return;
      }
      res.status(status).json({ error: errorText || `AI API error: ${status}` });
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
