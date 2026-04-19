

The user wants two things:
1. Verify the AI tutor renders RAM vs Storage as separate sections (testing) — but I'm in plan mode, can't open browser. The real actionable item is #2.
2. Make the 3 follow-up suggestion bullets render as clickable pill chips.

Let me check current state. Looking at `AiTutor.tsx`: it uses `extractFollowUps()` to strip the "🔗" suggestions block from the assistant content and renders them via `<FollowUpSuggestions>` component as pill chips. Good — that part works *if* the model emits the markdown 🔗 block.

But after the recent contract change, the edge functions return JSON with a `suggestions: [...]` array, which `parseAssistantOutput.ts` converts to markdown. I need to check how the suggestions get rendered in markdown form, and whether `extractFollowUps` picks them up.

Let me inspect.

## Investigation needed

- `src/lib/parseAssistantOutput.ts` — how does it serialize `suggestions[]` into markdown? Does it prefix with 🔗?
- `src/components/ai/AiHelper.tsx` — does the topic-page AI helper also extract & render follow-ups as chips? Likely NOT (only AiTutor does).
- `ChatMessage.tsx` — currently renders the suggestions as a plain bulleted list inside the markdown, which is the "plain list" the user is complaining about.

## Hypothesis

The JSON `suggestions` array → `parseAssistantOutput` writes them as a markdown bullet list under a "🔗 Try next" heading (or similar). On `/ai-tutor`, `extractFollowUps` strips them out and renders chips ✓. On topic AI Helper (`AiHelper.tsx`), no such extraction happens → suggestions render as a plain bulleted list ✗. That's the inconsistency.

Plus: even on `/ai-tutor`, if the markdown emoji prefix doesn't match `extractFollowUps` regex (`/^\*?\*?🔗/`), chips won't appear and they fall through as a plain list.

## Plan

### 1. Inspect & align the markdown shape
Read `parseAssistantOutput.ts` to see exactly how `suggestions` are serialized. Confirm the prefix matches what `extractFollowUps` expects. Tweak whichever is mismatched so chips reliably appear.

### 2. Extract follow-up rendering into a shared concern
Right now chip rendering lives inside `AiTutor.tsx` (`extractFollowUps` + `<FollowUpSuggestions>`). Move it so **`ChatMessage.tsx`** (or a thin wrapper) handles it for every surface:
- Add a `onSuggestionClick?: (q: string) => void` prop to `ChatMessage`.
- Inside `ChatMessage`, run `extractFollowUps` on the content, strip the suggestions from the rendered markdown, and render `<FollowUpSuggestions>` below if `onSuggestionClick` is provided.
- Remove the duplicated extraction logic from `AiTutor.tsx`.

### 3. Wire AiHelper to use the same chips
In `src/components/ai/AiHelper.tsx`, pass an `onSuggestionClick` callback to `ChatMessage` that re-submits the question. So topic pages get the same Claude-style clickable follow-ups.

### 4. Polish chip styling (`FollowUpSuggestions.tsx`)
Current chips look fine but tighten:
- Slightly bigger tap target (`py-2 px-3.5`)
- Subtle hover scale + accent ring
- Show "💡 Continue learning" label with a thin divider above
- Make the "Back to Home" link optional and default to off inside topic-page contexts

### 5. Defensive: if model returns markdown bullets without 🔗 marker
Update `extractFollowUps` to also detect a trailing `## 💡 Suggestions` or `## 🔗 ...` heading produced by `parseAssistantOutput`, so chips work regardless of which path the data took.

## Files to change

- `src/lib/parseAssistantOutput.ts` — confirm/normalize the suggestions block prefix to `🔗` so extraction works
- `src/components/chat/ChatMessage.tsx` — accept `onSuggestionClick`, extract & render chips internally
- `src/components/chat/FollowUpSuggestions.tsx` — chip styling polish, make `showHomeLink` default `false`
- `src/pages/AiTutor.tsx` — remove local `extractFollowUps`/chip rendering, pass `onSuggestionClick={send}` to `ChatMessage`, keep `showHomeLink` on for the tutor page
- `src/components/ai/AiHelper.tsx` — pass `onSuggestionClick` so topic AI Helper also gets clickable chips

No backend, no DB, no data changes.

## Acceptance check

- `/ai-tutor` → ask "RAM vs Storage" → 2+ emoji-headed sections + 3 clickable pill chips below the answer (no plain bullet list). Clicking a chip submits it as the next question.
- Open any topic page → AI Helper → ask anything → same 3 chips appear and are clickable.
- "Back to Home" link still appears on `/ai-tutor` but not inside topic AI Helper.

