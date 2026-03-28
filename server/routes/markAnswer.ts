import { Router, Request, Response } from "express";
import {
  callOpenRouterWithRetry,
  extractOpenRouterError,
  resolveApiKey,
} from "./openrouter.js";
import { buildMarkAnswerUserPrompt, MARK_ANSWER_SYSTEM_PROMPT } from "../prompts/markAnswerContract.js";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const { question, studentAnswer, markScheme, modelAnswer, marks, questionType } = req.body;

    const apiKey = resolveApiKey(req);

    if (!apiKey) {
      res.status(500).json({ error: "No AI API key configured. Add your key in Settings or set OPENROUTER_API_KEY." });
      return;
    }

    const userPrompt = buildMarkAnswerUserPrompt({
      question,
      studentAnswer,
      markScheme,
      modelAnswer,
      marks,
      questionType,
    });

    const response = await callOpenRouterWithRetry(apiKey, {
      model: "meta-llama/llama-3.3-70b-instruct:free",
      messages: [
        { role: "system", content: MARK_ANSWER_SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
      max_tokens: 1000,
    });

    if (!response.ok) {
      if (response.status === 429) {
        res.status(429).json({ error: "Rate limit exceeded. Please wait a moment and try again." });
        return;
      }
      if (response.status === 402) {
        res.status(402).json({ error: "AI credits exhausted. Please add funds in Settings." });
        return;
      }
      const errorText = await extractOpenRouterError(response);
      console.error("AI gateway error:", response.status, errorText);
      res.status(response.status).json({ error: errorText || `AI gateway error: ${response.status}` });
      return;
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    let parsed: unknown;
    try {
      parsed = JSON.parse(content);
    } catch {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          parsed = JSON.parse(jsonMatch[0]);
        } catch {
          res.status(500).json({ error: "Could not parse AI response" });
          return;
        }
      } else {
        res.status(500).json({ error: "Could not parse AI response" });
        return;
      }
    }

    res.json(parsed);
  } catch (e: unknown) {
    console.error("mark-answer error:", e);
    res.status(500).json({ error: e instanceof Error ? e.message : "Unknown error" });
  }
});

export { router as markAnswerRouter };
