

## Goal
Three improvements to the AI follow-up chip experience:
1. **Loading shimmer on chips** — when a student taps a chip, show a subtle "thinking…" shimmer in the chip area immediately so it's clear something is happening.
2. **(Verification only)** — confirm chips render on `/ai-tutor` and topic AI Helper. Already implemented in the previous turn; user will manually verify.
3. **Track chip-click engagement** — log every chip click so admins can see which suggested questions actually drive next-step learning.

## Approach

### 1. Chip shimmer while loading
- Add an `isLoading?: boolean` prop to `FollowUpSuggestions`.
- When `isLoading` is true, render the chips with reduced opacity, disabled pointer events, and an animated `bg-shimmer` overlay (gradient sliding left→right) so it feels like the AI is processing the tap.
- Pipe `isLoading` from `ChatMessage` → `FollowUpSuggestions`. `ChatMessage` itself receives it via a new optional prop `isSuggestionsLoading`.
- In `AiTutor.tsx` and `AiHelper.tsx`, pass `isSuggestionsLoading={isLoading}` so chips shimmer the moment the user clicks one (because clicking immediately sets `isLoading=true`).

### 2. Verification (no code change)
Already wired in the previous turn:
- `AiTutor.tsx` passes `onSuggestionClick={send}` + `showHomeLink={true}` to `ChatMessage` for the last assistant message.
- `AiHelper.tsx` passes `onSuggestionClick={sendMessage}` + `showHomeLink={false}`.
User will verify in browser.

### 3. Track chip clicks for admin insights

**Logging path** (lightweight, reuses existing `app_logs` infrastructure):
- Add a new event type `ai_suggestion_click` to `LogEventType` in `src/lib/appLogger.ts`.
- In `FollowUpSuggestions`, when a chip is clicked, fire `appLog({ event_type: "ai_suggestion_click", origin, message: suggestion, details: { surface, topicSlug? } })` *before* calling `onSelect`.
- Pass an `origin` prop (e.g. `"ai_tutor"` or `"ai_helper:intro-to-python"`) from `ChatMessage` through to `FollowUpSuggestions`. `AiTutor` and `AiHelper` set this when rendering.
- In `AdminLogViewer.tsx`, register a label for the new event type: `ai_suggestion_click: "💬 Chip Click"` so it shows nicely in the existing log viewer.

**New admin insight panel** — `src/components/admin/AdminSuggestionInsights.tsx`:
- Queries `app_logs` filtered by `event_type = 'ai_suggestion_click'` (no schema change needed — RLS already restricts admin reads).
- Aggregates client-side: groups by `message` (the suggestion text), counts occurrences over the last 30 days, and ranks the top 20.
- Renders as a clean card list: rank, suggestion text, click count, last clicked timestamp, surface origin breakdown (tutor vs helper).
- Includes a 7d / 30d / all-time toggle and a CSV export button (matches the existing admin viewer aesthetic — same icons, badges, motion).
- Mounted in `Settings.tsx` next to `AdminLogViewer` / `AdminFeedbackViewer`, behind the same admin-role gate.

No database migration needed (we reuse `app_logs` with a new `event_type` value — `event_type` is `text`, not an enum in the DB).

## Files to change

- `src/lib/appLogger.ts` — add `"ai_suggestion_click"` to `LogEventType`.
- `src/components/chat/FollowUpSuggestions.tsx` — accept `isLoading`, `origin`; add shimmer style; log on click.
- `src/components/chat/ChatMessage.tsx` — accept and forward `isSuggestionsLoading` and `suggestionOrigin` props.
- `src/pages/AiTutor.tsx` — pass `isSuggestionsLoading={isLoading}` and `suggestionOrigin="ai_tutor"`.
- `src/components/ai/AiHelper.tsx` — pass `isSuggestionsLoading={isLoading}` and `suggestionOrigin={`ai_helper:${topicSlug}`}`.
- `src/components/admin/AdminLogViewer.tsx` — add label for `ai_suggestion_click` event.
- **New** `src/components/admin/AdminSuggestionInsights.tsx` — top suggestions panel with timeframe toggle + CSV export.
- `src/pages/Settings.tsx` — mount the new insights panel inside the admin section.

No DB schema changes. No backend changes. No new dependencies.

## Acceptance check
- Tap a chip → it dims with a subtle left-to-right shimmer until the next answer starts streaming.
- `/ai-tutor`: ask "RAM vs Storage" → 3 chips appear → tap one → next answer arrives.
- Topic AI Helper: same chip behaviour, no "Back to Home" link.
- Admin Settings → new "Suggestion Insights" panel shows ranked list of most-clicked suggestions with counts and timeframe toggle.

