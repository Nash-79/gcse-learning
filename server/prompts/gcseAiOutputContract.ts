export const GCSE_AI_OUTPUT_CONTRACT = `
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
- Output valid JSON only
- No markdown, no backticks, no comments, no extra keys
- Always include: mode, summary, sections, next_step
- Set "mode" to "json"
- summary must be 1 to 2 short sentences
- sections must contain 1 to 4 items
- each section must include "heading"
- content and bullets are optional
- use short content and bullets for lists, steps, and comparisons
- For code examples, put code in content as a plain string
- next_step may be an empty string

STYLE:
- Use simple language suitable for GCSE
- Keep output concise and easy to scan

FOLLOW-UP QUESTIONS:
- Include one section titled "Want to keep going?"
- Add exactly 3 short follow-up questions as bullets
- Make them progressively harder

FALLBACK MODE: MARKDOWN

If JSON is not reliable, output this exact structure:
MODE: markdown
SUMMARY:
<1 to 2 sentence answer>

## <Section Heading>
<short paragraph>
- <bullet>

## Want to keep going?
- <easy follow-up question>
- <medium follow-up question>
- <hard follow-up question>

NEXT STEP:
<one short practical next step, or leave blank>

Prefer JSON. Use Markdown fallback only if JSON reliability is uncertain. Never mix formats.
`;

export const GCSE_AI_USER_SUFFIX =
  "\n\nReturn JSON if possible. If not, use the Markdown fallback exactly.";

