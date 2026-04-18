import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { requireAuthenticatedUser } from "../_shared/auth.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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

    const { question, studentAnswer, markScheme, modelAnswer, marks, questionType } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
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

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "submit_marking",
              description: "Submit the marking result for a student answer",
              parameters: {
                type: "object",
                properties: {
                  marksAwarded: { type: "number", description: "Marks awarded (0 to total)" },
                  totalMarks: { type: "number", description: "Total marks available" },
                  feedback: { type: "string", description: "2-3 sentences of constructive feedback" },
                  markBreakdown: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        point: { type: "string" },
                        awarded: { type: "boolean" },
                        comment: { type: "string" },
                      },
                      required: ["point", "awarded", "comment"],
                    },
                  },
                  grade: { type: "string", enum: ["Excellent", "Good", "Satisfactory", "Needs Improvement"] },
                  improvementTip: { type: "string", description: "One specific tip to improve" },
                },
                required: ["marksAwarded", "totalMarks", "feedback", "markBreakdown", "grade", "improvementTip"],
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "submit_marking" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please wait a moment and try again." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds in Settings." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();

    // Extract tool call result
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (toolCall?.function?.arguments) {
      const result = typeof toolCall.function.arguments === "string"
        ? JSON.parse(toolCall.function.arguments)
        : toolCall.function.arguments;

      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fallback: try to parse from content
    const content = data.choices?.[0]?.message?.content || "";
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return new Response(jsonMatch[0], {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    throw new Error("Could not parse AI response");
  } catch (e) {
    console.error("mark-answer error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
