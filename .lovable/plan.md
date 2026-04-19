

## Plan

Two small, additive enhancements to `QuizComponent` (and a tiny prop wire-up in `TopicPage`).

### 1. Cache AI explanations in localStorage

**Key**: `pylearn-quiz-ai-explain:v1` → `Record<string, string>` where the inner key is a stable hash per question+wrong-choice combo:
```
`${topicSlug}::${djb2(question)}::${selectedOption}`
```
(djb2 is a 10-line pure function — no deps. Question text + chosen wrong index uniquely identifies the explanation context.)

Flow inside `explainWithAi`:
1. Build cache key.
2. If cache has entry → set `aiExplanation` from cache, skip network. Show small "Cached" pill.
3. Else fetch as today, then write to cache on success.

Eviction: simple cap at 200 entries (FIFO drop oldest) to stop unbounded growth. Wrap all `localStorage` access in try/catch (private mode safe).

### 2. "Send to AI Tutor chat" link

Add a new optional prop to `QuizComponent`:
```ts
onSendToAiTutor?: (prompt: string) => void;
```

Render a small link/button under the AI explanation block (only when `aiExplanation` exists AND prop provided):
> 💬 Continue in AI Tutor →

When clicked, calls `onSendToAiTutor(prompt)` with a follow-up seed like:
```
I just got this quiz question wrong: "${question}". Can you walk me through it in more detail and ask me a similar follow-up question?
```

Then in `TopicPage.tsx` wire it up using existing `handleUseAiPrompt`:
```tsx
<QuizComponent
  topicSlug={slug}
  questions={allQuestions}
  onSendToAiTutor={handleUseAiPrompt}
/>
```
`handleUseAiPrompt` already opens the `AiHelper` panel, switches to the lesson tab, and seeds the prompt — perfect fit, no new logic needed.

### Files

- **Edit** `src/components/quiz/QuizComponent.tsx` — add cache helpers, cache check in `explainWithAi`, "Cached" pill, `onSendToAiTutor` prop + button.
- **Edit** `src/pages/TopicPage.tsx` — pass `onSendToAiTutor={handleUseAiPrompt}` to `<QuizComponent>`.

### Acceptance

- Click "Why?" once → AI call made, explanation cached.
- Click "Why?" again on same wrong answer (after navigating away & back, or restart) → instant render, no network call, "Cached" badge visible.
- Click "Continue in AI Tutor →" → AiHelper panel opens above tabs with the seed prompt pre-filled in the input box (existing behaviour).
- Cache survives reloads, capped at 200 entries, safe in private/incognito mode.
- No new dependencies, no DB changes.

