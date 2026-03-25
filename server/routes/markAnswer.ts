import { Router, Request, Response } from "express";
import {
  callOpenRouterWithRetry,
  extractOpenRouterError,
  resolveApiKey,
} from "./openrouter.js";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const { question, studentAnswer, markScheme, modelAnswer, marks, questionType } = req.body;

    const apiKey = resolveApiKey(req);

    if (!apiKey) {
      res.status(500).json({ error: "No AI API key configured. Add your key in Settings or set OPENROUTER_API_KEY." });
      return;
    }

    const systemPrompt = `You are an expert OCR GCSE Computer Science examiner marking student answers against official mark schemes. You must be fair, encouraging, and educational.

Rules:
- Award marks ONLY for points that match the mark scheme criteria
- Be generous with alternative correct phrasing but strict on accuracy
- For code questions, check logic correctness even if syntax varies slightly
- For multiple-choice, simply check if the answer matches
- Always provide specific, constructive feedback
- Reference the mark scheme points the student hit or missed
- Use a supportive, educational tone suitable for GCSE students (age 14-16)`;

    const userPrompt = `Mark this student's answer:

**Question (${marks} marks, type: ${questionType}):**
${question}

**Student's Answer:**
${studentAnswer}

**Mark Scheme:**
${markScheme.map((m: string, i: number) => `${i + 1}. ${m}`).join("\n")}

**Model Answer:**
${modelAnswer}

Please respond using this exact JSON structure:
{
  "marksAwarded": <number 0-${marks}>,
  "totalMarks": ${marks},
  "feedback": "<2-3 sentences of specific feedback>",
  "markBreakdown": [
    {"point": "<mark scheme point>", "awarded": true/false, "comment": "<brief explanation>"}
  ],
  "grade": "<one of: Excellent, Good, Satisfactory, Needs Improvement>",
  "improvementTip": "<one specific tip to improve their answer>"
}`;

    const response = await callOpenRouterWithRetry(apiKey, {
      model: "meta-llama/llama-3.3-70b-instruct:free",
      messages: [
        { role: "system", content: systemPrompt },
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
  } catch (e: any) {
    console.error("mark-answer error:", e);
    res.status(500).json({ error: e?.message || "Unknown error" });
  }
});

export { router as markAnswerRouter };
