import { Router, Request, Response } from "express";
import {
  executeOpenRouterPolicy,
  extractOpenRouterError,
  resolveApiKey,
  resolveModel,
} from "./openrouter.js";
import { GCSE_AI_USER_SUFFIX } from "../prompts/gcseAiOutputContract.js";
import { buildGcseTutorSystemPrompt } from "../prompts/gcseTutorPrompt.js";

const router = Router();

const SYSTEM_PROMPT = buildGcseTutorSystemPrompt();

router.post("/", async (req: Request, res: Response) => {
  try {
    const { messages, model, policy } = req.body;

    const apiKey = resolveApiKey(req);

    if (!apiKey) {
      res.status(500).json({ error: "No AI API key configured. Add your key in Settings or set OPENROUTER_API_KEY." });
      return;
    }

    const finalModel = resolveModel(model);

    const augmentedMessages = messages.map((m: { role: string; content: string }, i: number) => {
      if (i === messages.length - 1 && m.role === "user") {
        return { ...m, content: m.content + GCSE_AI_USER_SUFFIX };
      }
      return m;
    });

    const chatMessages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...augmentedMessages,
    ];

    const { response, meta } = await executeOpenRouterPolicy(apiKey, {
      model: finalModel,
      messages: chatMessages,
      stream: true,
    }, policy);

    if (!response.ok) {
      if (response.status === 429) {
        res.status(429).json({ error: "Rate limit reached on this model. Switch model or retry in 20-60 seconds.", meta });
        return;
      }
      if (response.status === 402) {
        res.status(402).json({ error: "OpenRouter credits/quota unavailable for this request.", meta });
        return;
      }
      const t = await extractOpenRouterError(response);
      console.error("AI gateway error:", response.status, t);
      res.status(response.status).json({ error: t || "AI service unavailable", meta });
      return;
    }

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.write(`event: meta\ndata: ${JSON.stringify({ state: meta.usedFallback ? "retrying" : "connecting", ...meta })}\n\n`);

    if (!response.body) {
      res.status(500).json({ error: "No response body" });
      return;
    }

    const streamBody = response.body as ReadableStream<Uint8Array>;
    const reader = streamBody.getReader();
    const decoder = new TextDecoder();

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        res.write(chunk);
      }
      res.write(`event: meta\ndata: ${JSON.stringify({ state: "completed", ...meta })}\n\n`);
    } finally {
      res.end();
    }
  } catch (e: unknown) {
    console.error("gcse-chat error:", e);
    if (!res.headersSent) {
      res.status(500).json({ error: e instanceof Error ? e.message : "Unknown error" });
    }
  }
});

export { router as gcseChatRouter };
