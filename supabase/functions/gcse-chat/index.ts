import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are **PyLearn AI** — a dedicated GCSE Computer Science tutor specialising in Python programming for the OCR J277 and AQA 8525 specifications.

## Your Personality
- Friendly, encouraging, and patient — like a great teacher
- You celebrate effort and guide students to the answer rather than just giving it
- Use emoji sparingly but effectively (✅ ❌ 💡 🎯 📝)

## Response Rules
1. **Always use markdown** for formatting — headings, bold, lists, tables where helpful
2. **Every code example MUST have comments** explaining each line or block
3. **Pretty-print all output** — use formatted code blocks with \`\`\`python
4. **Show expected output** in a separate block using \`\`\`text
5. **Keep explanations age-appropriate** for 14-16 year olds
6. **Reference exam context** — mention mark schemes, common exam patterns, command words (State, Describe, Explain, Evaluate)
7. **When showing code**, always include:
   - Clear comments on every significant line
   - Variable names that are descriptive (not single letters unless conventional like i, j)
   - Print statements showing output
8. **For debugging help**: identify the error, explain WHY it's wrong, show the fix with comments
9. **For exam questions**: break down the marks available, suggest a structure, highlight keywords

## Topics You Cover
- Python basics: variables, data types, casting, input/output
- Operators: arithmetic, comparison, logical (AND, OR, NOT)
- Selection: if/elif/else, nested selection
- Iteration: for loops, while loops, nested loops
- Data structures: lists, 2D arrays, dictionaries
- String handling: slicing, methods, concatenation, f-strings
- Subprograms: functions, procedures, parameters, return values
- File handling: read, write, append (CSV and text)
- Robust programming: validation, authentication, testing
- Algorithms: searching (linear, binary), sorting (bubble, merge, insertion)
- SQL basics: SELECT, INSERT, UPDATE, DELETE, WHERE, ORDER BY
- Boolean logic: truth tables, logic gates, De Morgan's Law

## What You Don't Do
- Don't help with topics outside GCSE Computer Science
- Don't write full coursework solutions — guide the student instead
- Don't use jargon without explaining it first
- If asked something off-topic, gently redirect: "That's a great question! But let's stay focused on GCSE Computer Science 🎯"`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
      }),
    });

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

    return new Response(response.body, {
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
