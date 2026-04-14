import { Router, type Request, type Response as ExpressResponse } from "express";
import {
  executeOpenRouterPolicy,
  extractOpenRouterError,
  resolveApiKey,
  resolveModel,
} from "./openrouter.js";
import { GCSE_AI_OUTPUT_CONTRACT, GCSE_AI_USER_SUFFIX } from "../prompts/gcseAiOutputContract.js";
import { buildGcseTutorSystemPrompt } from "../prompts/gcseTutorPrompt.js";

const router = Router();

interface OpenRouterChatCompletion {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
}

router.post("/", async (req: Request, res: ExpressResponse) => {
  try {
    const { messages, mode, topicTitle, code, taskDescription, systemPromptOverride, userPromptOverride, maxTokens, model, provider, policy } = req.body;

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
      systemPrompt = buildGcseTutorSystemPrompt(topicTitle);

      userMessages = messages.map((m: { role: string; content: string }, i: number) => {
        if (i === messages.length - 1 && m.role === "user") {
          return { ...m, content: m.content + GCSE_AI_USER_SUFFIX };
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
      systemPrompt = (systemPromptOverride || "") + GCSE_AI_OUTPUT_CONTRACT;
      userMessages = userPromptOverride
        ? [{ role: "user", content: userPromptOverride + GCSE_AI_USER_SUFFIX }]
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

    const { response, meta } = await executeOpenRouterPolicy(apiKey, requestBody, policy);

    if (!response.ok) {
      const status = response.status || 500;
      const errorText = await extractOpenRouterError(response);
      console.error("AI error:", status, errorText);
      if (status === 429) {
        res.status(429).json({
          error: "Rate limit reached on this model. Switch model or retry in 20-60 seconds.",
          meta,
        });
        return;
      }
      if (status === 402) {
        res.status(402).json({ error: "OpenRouter credits/quota unavailable for this request.", meta });
        return;
      }
      res.status(status).json({ error: errorText || `AI API error: ${status}`, meta });
      return;
    }

    const data = (await response.json()) as OpenRouterChatCompletion;
    const content = data.choices?.[0]?.message?.content || "";

    if (wantJson) {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        res.json({ content: jsonMatch[0], meta });
        return;
      }
      res.status(500).json({ error: "Could not parse AI JSON response", meta });
      return;
    }

    res.json({ content, meta });
  } catch (e: unknown) {
    console.error("ai-chat error:", e);
    res.status(500).json({ error: e instanceof Error ? e.message : "Unknown error" });
  }
});

export { router as aiChatRouter };
