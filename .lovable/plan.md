

## Problem

Three real issues from the screenshot at `/topic/variables-constants`:

1. **TaskAssistant output is messy** — raw JSON-shaped text or unstructured prose appears instead of the clean Claude-style markdown/sections used everywhere else in the app. The component is calling the AI but **not running the response through `parseAssistantOutput` + `structuredJsonToBlocks` + `<ChatMessage />`** like `AiHelper` does.

2. **Look & feel inconsistent with AI Tutor** — `AiHelper` (used on Theory tab and via "Ask AI Tutor" button) has polished structured output with emoji headings, summary callout, follow-up suggestions. `TaskAssistant` reinvents its own renderer and looks foreign.

3. **No task pre-loading** — the user wants the assistant to be **scoped to the specific task** so the AI always knows what's being asked, even on free-form questions. Right now task context is only injected for the three preset buttons, not for follow-ups.

4. **Layout nit** — user is open to console-below-editor (already the case at <xl per last change, but worth confirming the experience on Variables & Constants specifically).

## Solution

Reuse the existing AI Tutor rendering pipeline instead of TaskAssistant having its own. Pre-load every request with the task context so the AI is task-locked.

### 1. Render TaskAssistant responses through the shared pipeline

In `src/components/learning/TaskAssistant.tsx`:

- Import `parseAssistantOutput`, `structuredJsonToBlocks`, `structuredJsonToMarkdown` from `@/lib/parseAssistantOutput`.
- Import `<ChatMessage />` from `@/components/chat/ChatMessage` (the same one `AiHelper` uses).
- Replace the current "raw text in a div" rendering with: parse → if JSON → render each `StructuredBlock` (markdown blocks via `<ChatMessage />`, trace blocks via `<TraceTable />`). Fallback: render markdown via `<ChatMessage />`.
- Cache the **raw response text** (already does) — parsing happens at render time, so old cached entries upgrade automatically.

This gives identical look-and-feel to AI Tutor: emoji headings, summary callout, bulleted sections, syntax-highlighted code, follow-up suggestions chips.

### 2. Task-lock every AI call

Currently the system prompt only includes task context for the 3 preset buttons. Change it so **every** call (presets + free-form follow-ups) sends:

```
You are helping a GCSE student with this SPECIFIC coding task on topic "${topicTitle}":

TASK:
${taskInstruction}

STARTER CODE:
${starterCode}

STUDENT'S CURRENT CODE:
${currentCode}

Stay focused on this task. Do not give the full solution unless explicitly asked.
```

Then append the student's question (preset or free-form). This makes the assistant a task-scoped tutor instead of a general chat.

Also tighten the preset prompts to explicitly request the JSON contract so the renderer always gets structured output:
- "Explain the task" → "Explain this task in 2-3 short sentences. What is being asked, and what concepts will they use? Do NOT give a solution."
- "Step-by-step plan" → "Give a numbered step-by-step plan in pseudocode. No full Python solution."
- "Hint on my code" → "Look at the student's current code and give ONE specific next-step hint. Do not write the full solution."

The edge function (`supabase/functions/ai-chat`) already injects `STRUCTURED_OUTPUT_INSTRUCTION`, so the JSON contract is enforced server-side — we just need to render it properly client-side.

### 3. Free-form box pre-fills with task pointer

When the assistant is opened, seed the free-form input placeholder with `Ask anything about this task...` and prepend the task instruction silently to every user message via the system prompt (already covered in #2). No extra UI clutter, just guaranteed scope.

### 4. Layout sanity check

`CodeRunner` already stacks console under editor below `xl` (1280px) per last change — at the user's 1300px viewport this *just barely* triggers side-by-side. To match the user's stated preference ("console output below code"), bump the breakpoint from `xl:flex-row` → `2xl:flex-row` so console always sits below editor unless the viewport is genuinely wide (≥1536px). Single one-line change in `src/components/code/CodeRunner.tsx`.

## Files

- **Edit** `src/components/learning/TaskAssistant.tsx` — render via `<ChatMessage />` + structured blocks; task-lock every call; tighten preset prompts
- **Edit** `src/components/code/CodeRunner.tsx` — `xl:` → `2xl:` so console stacks below editor at most viewports

## Acceptance

- Click any preset on `/topic/variables-constants` Learn tab → response renders with emoji headings, summary callout, clean sections, code blocks with syntax highlighting (matching AI Tutor look exactly).
- Free-form question like "what's a constant?" → AI replies in same structured format, scoped to the current task (mentions the PI/gravity context).
- Cached responses re-render the same way (no regression for old cached entries).
- Console sits below editor at 1300px viewport.
- No new dependencies, no DB changes, no edge function changes.

