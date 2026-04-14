

# Frontend "Best-of-Both Merge" — Plan

## Summary

Fix the current build errors, then add three capabilities: per-route AI policy settings, response provenance display, and proper meta typing — all while keeping the app learner-focused.

---

## Build Error Fixes (prerequisite)

1. **`supabase/functions/ai-chat/index.ts` line 99-100**: The `delete lovableBody.response_format` fails because the spread `{ ...body, model: ... }` loses the type. Fix by typing `lovableBody` as `Record<string, unknown>` explicitly, or use destructuring with rest.

2. **`src/pages/Settings.tsx` lines 493/499/501**: `recommended` and `deprecated` don't exist on `OpenRouterModel`. Add these optional fields to the `OpenRouterModel` interface in `src/lib/useOpenRouterModels.ts`, or cast via the local `FreeModel` type already defined in Settings.

---

## 1. Per-Route Fallback Policy Settings

**Files**: `src/lib/useAiSettings.ts`, `src/pages/Settings.tsx`

- Extend `AiSettings` with an optional `routePolicies` map:
  ```
  routePolicies?: Record<RouteKey, {
    primaryModel: string;
    fallbackModelIds: string[];
    maxAttempts: number;
    retryOn: string[];
  }>
  ```
  where `RouteKey = "ai-chat" | "gcse-chat" | "mark-answer"`.

- Add a new collapsible "Advanced: Route Policies" section in Settings below the model picker. Each route gets: primary model dropdown, ordered fallback list (multi-select from available models), max attempts (1-4 slider), retry conditions (checkboxes: 429, 500, timeout).

- Persist in the same `localStorage` key, backwards-compatible (missing `routePolicies` = use global defaults).

- Export a `getRoutePolicy(routeKey)` helper from the hook.

## 2. API Meta Typing & Plumbing

**Files**: `src/lib/apiFetch.ts`, `src/pages/AiTutor.tsx`, `src/components/ai/AiHelper.tsx`

- Define `AiResponseMeta` interface:
  ```
  interface AiResponseMeta {
    finalModelId?: string;
    finalModelLabel?: string;
    usedFallback?: boolean;
    degraded?: boolean;
    attemptCount?: number;
    elapsedMs?: number;
  }
  ```

- In `AiTutor.tsx` `streamChat`: after stream completes, check for a final `event: meta` SSE event and extract metadata. Store meta per-message alongside content.

- For non-streaming routes (`ai-chat`, `mark-answer`): extract `meta` from JSON response body. Pass through to components.

- Include `policy` in request body when route policies are configured.

## 3. Response Provenance Display

**Files**: `src/components/chat/ChatMessage.tsx`

- Add optional `meta?: AiResponseMeta` prop to `ChatMessage`.

- Below `MessageActions`, render a subtle provenance line when meta exists:
  - Show model label (e.g., "Answered by Llama 3.3 70B")
  - If `usedFallback`, show a small info badge: "Fallback model used"
  - If `degraded`, show amber indicator
  - All styled as muted text, ~10px, non-intrusive

- When `meta` is absent, render nothing (graceful degradation).

## 4. Message Data Model Update

**Files**: `src/pages/AiTutor.tsx`

- Extend the `Message` interface to `{ role, content, meta?: AiResponseMeta }`.

- Thread `meta` through to `ChatMessage` component renders.

## 5. Tests

**Files**: `src/test/`

- **`aiSettings.test.ts`**: Test `loadSettings` with/without `routePolicies`, verify backwards compat, test `getRoutePolicy` returns defaults when no policy set.

- **`ChatMessage.test.tsx`**: Test provenance renders when meta provided, doesn't render when absent, shows fallback badge correctly.

- **`provenanceParsing.test.ts`**: Test meta extraction from SSE stream and JSON response.

## 6. Scope Guardrails

- No teacher/classroom features added.
- No compliance copy beyond the provenance line.
- Mobile-responsive: provenance line wraps gracefully on small screens.

---

## Technical Notes

- The `OpenRouterModel` interface needs `recommended?: boolean` and `deprecated?: string` added to fix existing build errors.
- The `callAI` function in `ai-chat/index.ts` needs `lovableBody` typed as `Record<string, unknown>` to fix the `delete` TS error.
- Route policy is sent as `policy` field in request JSON; backend already accepts this per the contracts spec.

