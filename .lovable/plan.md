

## Goal

Make every AI response in the app look as polished and well-structured as Claude/OpenAI — clear hierarchy, proper section breaks, consistent emoji headings, and breathing room between blocks. Apply consistently across **all** AI surfaces: AI Tutor (`/ai-tutor`), per-topic AI Helper, and any inline AI response.

## Root cause

Two problems compound to make output look flat (as in your screenshot):

1. **Edge function prompts are weak.** `supabase/functions/ai-chat/index.ts` and `supabase/functions/gcse-chat/index.ts` use a stripped-down structured-output contract — no emoji rules, no style guidance, no `suggestions` field, no minimum-section guarantee. The good contract (`server/prompts/gcseAiOutputContract.ts`) only runs in the Express dev backend, which the published site doesn't use. So in production, Lovable AI returns short, single-section JSON with bolded inline labels mashed together → flat output.
2. **Frontend headings are too subtle.** In `ChatMessage.tsx`, `h2` is `text-[15px]` with a barely-visible border, and `h3` blends into body text. Section spacing (`mt-7`) is fine but headings don't *feel* like headings.

## Plan

### 1. Centralize the structured-output contract (one source of truth)
- Create `supabase/functions/_shared/structuredContract.ts` exporting the **rich** contract (the one in `server/prompts/gcseAiOutputContract.ts`): emoji-prefixed headings, mandatory 2-4 sections, mandatory 3 progressive suggestions, table/code/bullet style rules, GCSE tone.
- Replace the inline `STRUCTURED_OUTPUT_INSTRUCTION` in both `ai-chat/index.ts` and `gcse-chat/index.ts` with an import from this shared file. Keep the `STRUCTURED_USER_SUFFIX` consistent too.
- Result: Lovable AI and OpenRouter models both get the same strict, emoji-aware, multi-section instructions.

### 2. Strengthen the JSON contract enforcement
- In the contract, require: minimum **2 sections**, each section's `content` ≤ ~60 words, each section MUST start a new visual block (no inline `**Bold:**` mini-headings — promote those to their own section instead).
- Explicitly ban: dumping multiple labelled subtopics into a single section's `content` (which is exactly what produced the screenshot).

### 3. Polish `ChatMessage.tsx` markdown rendering
- Make `h2` larger and bolder: `text-[17px]`, stronger border, clear top margin.
- Make `h3` distinct from body: `text-[14px]` uppercase tracked, accent color.
- Add stronger paragraph spacing so the eye can rest between sections.
- Improve summary callout: keep the 🎯 chip but give it a clearer card-like background.
- Ensure bullets, tables, code blocks all have the same generous breathing room as Claude.
- Promote any `**Label:**` patterns at the start of a paragraph into a small inline definition-list style (so models that still inline subtopics render cleanly).

### 4. Improve the structured→markdown converter (`parseAssistantOutput.ts`)
- When a section's `content` contains multiple `**Label:** value` patterns separated by line breaks, auto-split them into a definition list (`<dl>` style via markdown table or styled bullets) so they render as visually separated rows instead of a wall of text. This is a defensive fix for models that ignore the "no inline subheadings" rule.
- Always add a blank line before/after fenced code blocks and tables when assembling markdown.

### 5. Verify consistency across all AI surfaces
Audit and confirm all three entry points use `ChatMessage`:
- `src/pages/AiTutor.tsx` ✓ (already does)
- `src/components/ai/AiHelper.tsx` ✓ (already does)
- Anywhere else AI output is shown → confirm or migrate

### 6. Out of scope
- The `mark-answer` edge function (uses its own JSON schema for grading, not chat output)
- Streaming behaviour in `gcse-chat` (already works; only the prompt changes)
- Any model selection / settings UI (separate concern)

## Files to change

- `supabase/functions/_shared/structuredContract.ts` — **new**, central rich contract
- `supabase/functions/ai-chat/index.ts` — import shared contract
- `supabase/functions/gcse-chat/index.ts` — import shared contract
- `src/components/chat/ChatMessage.tsx` — heading sizes, spacing, summary callout, inline-label promotion
- `src/lib/parseAssistantOutput.ts` — split inline `**Label:**` patterns into clean rows; tighter markdown assembly

No DB changes. No new dependencies.

## Acceptance check

After deploy, ask the AI a multi-part question (like the RAM vs Storage one in your screenshot). Expected:
- 2-4 clearly separated sections, each with an emoji heading visible at a glance
- "RAM" and "Storage" become their own sections (not bolded labels inside one paragraph)
- Generous spacing between sections, comfortable line height
- 3 follow-up suggestions appear as clickable chips
- Looks consistent on `/ai-tutor` and inside any topic page's AI Helper

