

## Problem

Looking at the screenshot on `/topic/input-output-casting` "Learn" tab:

1. **Wasted left gutter** when the Learning Steps sidebar collapses (or on narrow content), the Code Editor sits in the middle with a huge empty left band.
2. **Cramped editor** — `CodeRunner` inside `SteppedLearning` is forced into `h-[250px]` and shares a row with a narrow Console (`md:w-1/3`), making real coding awkward.
3. **No AI assistance** next to the task. Students currently have to leave the editor, open the AI Tutor panel, paste their code, and re-explain the task. There's no reusable "guide me through THIS task" component.
4. **Inconsistency** — `CodeRunner` is used in three places (`SteppedLearning`, `Playground`, `RunnableCode`) and each looks/sized slightly differently.

## Solution

Three coordinated changes — all in existing files, no new dependencies.

### 1. Reusable `<TaskAssistant>` component (new file)

`src/components/learning/TaskAssistant.tsx` — small, self-contained side panel built on top of the same `/api/ai-chat` endpoint and the same localStorage cache pattern already used by `QuizComponent` (`pylearn-task-assistant:v1`).

Props:
```ts
{
  taskId: string;          // stable key for caching ("topic-slug::step-index")
  taskInstruction: string; // the YOUR TASK text
  starterCode: string;     // shown to the AI for context
  currentCode: string;     // live editor contents (so hints reflect their attempt)
  topicTitle: string;
}
```

UI: collapsed by default as a slim "🤖 Need help with this task?" pill. When expanded, shows three one-click prompts that hit the AI:
- **Explain the task** — plain-English breakdown
- **Step-by-step plan** — numbered pseudocode, no full solution
- **Hint on my code** — feeds `currentCode` to AI, returns ONE next-step nudge

Plus a small free-text box for follow-up questions. Responses render with the existing `ChatMessage` styling (markdown + code blocks). Cached per `taskId + prompt-type` so re-opening doesn't re-bill tokens. Strict GCSE-Python system prompt (no f-strings, no try/except, no comprehensions) — reuses the constraint already baked into `ai-chat`.

### 2. Bigger, consistent code editor inside `SteppedLearning`

In `src/components/learning/SteppedLearning.tsx`:

- Change the Code Editor section from a single full-width `CodeRunner` to a 2-column grid: **editor + console on the left (2/3), TaskAssistant on the right (1/3)** at `lg:` breakpoint. On mobile they stack.
- Bump `CodeRunner` height from `h-[250px]` → `h-[420px]` so multi-line answers (the user's "ask name + birth year + age" task needs ~10 lines) breathe.
- Have `CodeRunner` accept and forward an `onCodeChange` callback (already exists) so `SteppedLearning` can mirror code into `TaskAssistant` for the "Hint on my code" button.

### 3. Consistency pass on `CodeRunner`

In `src/components/code/CodeRunner.tsx`:

- Make the editor/console split responsive on its own (`md:flex-row` already there). Drop the hard-coded `md:w-1/3` console; use `md:w-2/5` so the console is readable but the editor still dominates.
- Ensure the editor textarea uses the `height` prop properly for both panes (currently only the textarea uses it; the console card has its own `min-h-[200px]` — align them so they're equal height).

This means every place `CodeRunner` is used (`SteppedLearning`, `Playground`, `RunnableCode`) gets the same proportions automatically.

## Files

- **Create** `src/components/learning/TaskAssistant.tsx` (~180 lines)
- **Edit** `src/components/learning/SteppedLearning.tsx` — wrap Code Editor in 2-col grid, mount `<TaskAssistant>`, taller editor
- **Edit** `src/components/code/CodeRunner.tsx` — equal heights, 2/5 console width, forward `onCodeChange` (already there, keep)

No data model changes. No new endpoints. No new deps. Reuses existing `/api/ai-chat`, existing markdown chat rendering, existing localStorage cache pattern.

## Acceptance

- On `/topic/input-output-casting` → Learn tab → step with `interactiveTask`: editor takes 2/3 width, console is taller, TaskAssistant appears on the right at `lg+` and below the editor on mobile.
- Clicking "Step-by-step plan" returns a numbered GCSE-Python plan (no full solution).
- Clicking the same prompt twice on same task = second click is instant + shows "Cached" pill.
- Same proportions visible in Playground and inline `RunnableCode` blocks across every topic — one source of truth.
- No regressions to existing code-run reward tracking or step navigation.

