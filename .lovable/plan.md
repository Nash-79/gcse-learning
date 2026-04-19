

## Goal

Add intelligent, app-wide response caching for all AI chat surfaces (TaskAssistant, AiHelper, AI Tutor) with a clear "bypass cache" escape hatch so users never feel stuck on a stale answer.

## Today's state

- **TaskAssistant** already caches per-task in `localStorage` under `pylearn-task-assistant:v1` keyed by `taskId::kind::hash(input)`.
- **AiHelper** caches per-topic explanations under its own key.
- **AI Tutor** has **no caching** — every send hits the model.
- No shared cache layer, no TTL, no size cap, no UI to bypass or clear, no provenance ("served from cache").
- Result: inconsistent behaviour, silent staleness, no user control.

## Design — one shared cache + consistent UI

### 1. New module `src/lib/aiResponseCache.ts` (single source of truth)

```ts
type CacheEntry = {
  content: string;
  meta?: AiResponseMeta;
  model?: string;
  createdAt: number;   // ms epoch
  hits: number;
};

aiCache.get(namespace, key, { maxAgeMs })   // returns entry or null (TTL-aware)
aiCache.set(namespace, key, entry)          // writes + enforces per-namespace LRU cap
aiCache.invalidate(namespace, key)          // single-entry bust
aiCache.clearNamespace(namespace)           // wipe per-surface
aiCache.stats(namespace)                    // { count, bytes, oldest }
```

- Backed by `localStorage` under `pylearn-ai-cache:v1:<namespace>`.
- Per-namespace LRU cap (default 50 entries) + 7-day TTL (configurable per call).
- Stable key built via `djb2(model + normalised(prompt) + scopeContext)` so changing model OR prompt OR task auto-misses.
- Safe JSON, quota-exceeded fallback (drops oldest entries).

### 2. Bypass mechanisms (the "not stuck" guarantee)

Three independent ways for the user to skip cache, surfaced consistently across all three components:

1. **🔄 Refresh icon button** next to every cached response — re-runs the same prompt with `bypassCache: true` and overwrites the entry. Tooltip: "Regenerate (skip cache)".
2. **⌥/Alt + Send** keyboard modifier on the input box → bypass cache for that one send. Hint shown in placeholder when held.
3. **"Served from cache · 2 days ago" pill** on cached messages with a tiny inline "regenerate" link — makes it obvious WHY a response appeared instantly and gives one-click escape.

The existing `onRegenerate` prop on `<ChatMessage />` already handles re-asks; we just thread `bypassCache` through.

### 3. Wire all three surfaces through the same cache

- **TaskAssistant**: replace its bespoke `pylearn-task-assistant:v1` lookup with `aiCache.get('task-assistant', key)`. Migrate old keys lazily on first read so users don't lose existing cache.
- **AiHelper**: same treatment, namespace `'topic-explainer'`. Lazy-migrate.
- **AI Tutor** (`src/pages/AiTutor.tsx`): wrap `streamChat` — before opening the stream, compute key from `(chatModel, last user message, prior turn summary hash)`; if hit and not bypassed, replay cached content into the message with a `[cached]` meta flag and skip the network call. Otherwise stream normally and `aiCache.set` on `onDone`.

For streaming, we cache only the **final assembled content + meta** (not partial deltas). On replay we render the full text instantly — no fake typewriter (which would feel deceptive).

### 4. Settings page — "Cached AI responses" card

Add to `src/pages/Settings.tsx`:
- Total entries + size across all 3 namespaces.
- Per-namespace breakdown with individual "Clear" buttons.
- Global "Clear all cached AI responses" button.
- Toggle: "Disable AI response caching" (sets `pylearn-ai-cache-disabled = '1'` → `aiCache.get` always returns null, `set` becomes no-op).

### 5. Visual consistency via `<StructuredAiResponse />`

The shared renderer added in the previous turn already standardises the look. We extend its props with optional `cachedAt?: number` and `onBypassCache?: () => void` — when present it renders the "Served from cache" pill + refresh icon in the message header. Zero per-surface UI work after that.

## Files

- **New** `src/lib/aiResponseCache.ts` — namespaced LRU + TTL cache module
- **Edit** `src/lib/structuredAiRenderer.tsx` — add `cachedAt` / `onBypassCache` props, render pill + refresh
- **Edit** `src/components/learning/TaskAssistant.tsx` — swap to shared cache, add bypass wiring + Alt+Send
- **Edit** `src/components/ai/AiHelper.tsx` — same swap + bypass wiring
- **Edit** `src/pages/AiTutor.tsx` — add cache check around `streamChat`, replay cached on hit, bypass wiring
- **Edit** `src/pages/Settings.tsx` — new "Cached AI responses" card with stats + clear + disable toggle
- **New** `src/test/aiResponseCache.test.ts` — unit tests for TTL, LRU eviction, bypass, disable toggle, key stability

## Acceptance

- Ask same question twice in any of TaskAssistant / AiHelper / AI Tutor → 2nd answer is instant with a "Served from cache · just now" pill and a refresh icon.
- Click refresh icon → fresh model call, cache entry replaced, pill timestamp resets.
- Hold Alt while pressing Send → bypasses cache for that send only.
- Settings → "Cached AI responses" card shows accurate counts; "Clear all" empties every namespace; "Disable caching" makes all sends bypass.
- Changing model or task auto-misses (different key).
- Old `pylearn-task-assistant:v1` entries migrate transparently on first read — no user-visible regression.
- TTL = 7 days; oldest entries evicted at >50 per namespace; `localStorage` quota errors handled gracefully.
- No new dependencies, no DB changes, no edge function changes.

