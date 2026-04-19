

## Problem (from screenshot at 1300px viewport)

The interactive task area is squeezed into **3 narrow columns** because layouts compound:
- `TopicPage` content area + `SteppedLearning` sidebar (320px) → leaves ~700px for the task
- `SteppedLearning` then splits that into `2fr | 1fr` (editor stack | TaskAssistant)
- Inside the 2fr cell, `CodeRunner` ALSO splits horizontally `3/5 | 2/5` (editor | console)

Result: at this width every column is ~250px, "Run Code" overlaps the editor edge, the console is a tiny strip, and the TaskAssistant card looks orphaned. The fixed `h-[420px]` height makes it look like a tall narrow chimney.

## Solution

Stop forcing horizontal splits at medium widths. Stack thoughtfully and only go side-by-side when there's real room.

### 1. `CodeRunner.tsx` — stack editor over console until very wide

Change the split breakpoint from `md:flex-row` (768px) to `xl:flex-row` (1280px) AND only when the runner gets enough width via a container query feel (we'll just use xl). Below xl, editor sits on top (full width), console below at a shorter height. This kills the "two skinny panes" problem everywhere.

Also: remove the duplicate `${height}` on the console div (it currently forces console = editor height even when stacked, which wastes vertical space). Console gets its own sensible `min-h-[160px]` instead.

### 2. `SteppedLearning.tsx` — TaskAssistant goes BELOW the editor at this width

Switch the interactive-task grid from `lg:grid-cols-[2fr_1fr]` (kicks in at 1024px and is the main culprit) to `2xl:grid-cols-[minmax(0,1fr)_360px]` (only splits at ≥1536px when there's genuinely room).

Below 2xl: editor stacks on top full-width, TaskAssistant sits below as a slim horizontal bar (collapsed pill by default — already its default state). When expanded below the editor, it gets full width and looks like a proper panel rather than a cramped sidebar.

Also reduce editor `height` from `h-[420px]` to a responsive `h-[340px] lg:h-[400px]` so it doesn't dominate the page on shorter screens.

### 3. `TaskAssistant.tsx` — make collapsed pill horizontal-friendly + expanded panel work full-width

- Collapsed state already a horizontal pill — keep, but ensure it doesn't stretch awkwardly tall (already fine, just verify no `h-full` parent).
- Expanded state: change preset-buttons grid from `grid-cols-1` to `sm:grid-cols-3` so when it's full-width below the editor, the three actions (Explain / Plan / Hint) sit side-by-side instead of stacked. On narrow viewports they stack.
- Remove `h-full` from outer container so it sizes to content.

### 4. Settings — add "Clear cached AI explanations" control

New small card in `Settings.tsx` (place near AI Provider section) with one button. Wipes both localStorage keys:
- `pylearn-quiz-ai-explain:v1` (Quick Quiz "Why?")
- `pylearn-task-assistant:v1` (TaskAssistant)

Shows a toast/inline success message + count of entries cleared.

## Files

- **Edit** `src/components/code/CodeRunner.tsx` — stack until `xl`, drop forced equal-height on console
- **Edit** `src/components/learning/SteppedLearning.tsx` — `2xl` split only, responsive editor height
- **Edit** `src/components/learning/TaskAssistant.tsx` — `sm:grid-cols-3` preset buttons, drop `h-full`
- **Edit** `src/pages/Settings.tsx` — add Clear-Cache card

## Acceptance

- At 1300px (current viewport): editor is full-width on top with comfortable height; console sits below it at readable width; TaskAssistant collapsed pill sits below console as a single neat row. No overlapping "Run Code" button. No empty left gutter.
- At ≥1536px (`2xl`): TaskAssistant moves to right column at 360px wide; editor + console still stack inside the left column and look balanced.
- Below 768px (mobile): same vertical stack, everything readable.
- Settings page has a new "Cached AI explanations" card with a working Clear button.
- No new dependencies; no DB / endpoint changes; reused across Playground and `RunnableCode` automatically.

