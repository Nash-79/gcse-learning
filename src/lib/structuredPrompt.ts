/** The structured output instruction appended to all AI system prompts */
export const STRUCTURED_OUTPUT_INSTRUCTION = `

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
- use short content
- use bullets for lists, steps, comparisons, or options
- if both content and bullets are unnecessary, include at least content
- next_step may be an empty string
- For code examples, put code in content as a plain string
- For steps, use bullets written as Step 1, Step 2, Step 3

FALLBACK MODE: MARKDOWN
If you cannot produce valid JSON, output this exact structure:
MODE: markdown
SUMMARY:
<1 to 2 sentence direct answer>
## <Section Heading>
<short paragraph>
- <bullet>
## <Section Heading>
<short paragraph>
- <bullet>
NEXT STEP:
<one short practical next step, or leave blank>

STYLE: Be concise, use simple language, avoid filler and repetition, no emojis, keep output easy to scan.
DECISION: Prefer JSON. Use Markdown fallback only if JSON reliability is uncertain. Never mix formats.`;

/** Per-message instruction for better compliance */
export const STRUCTURED_USER_SUFFIX = "\n\nReturn JSON if possible. If not, use the Markdown fallback exactly.";
