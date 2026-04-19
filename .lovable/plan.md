

## Root cause of the messy output

The user's pasted response was:
```json
{"mode":"json","summary":"...","sections":[{...},{...}]}
```

**Missing `next_step` field.** `parseAssistantOutput` requires `summary` (string), `sections` (array), AND `next_step` (string) to qualify the response as `type: "json"`. Without `next_step`, it falls through to `type: "raw"` and `<ChatMessage />` renders the raw JSON string as plain text — exactly what the user is seeing.

The ChatMessage rendering pipeline already works correctly (proven by AI Tutor). The problem is purely the **schema validator being too strict** combined with the **model occasionally omitting `next_step`** in `mode: "generate"` requests.

## Fix — 4 small, surgical changes

### 1. Make `parseAssistantOutput` resilient to missing optional fields

In `src/lib/parseAssistantOutput.ts`, relax the validator: accept the response as `type: "json"` whenever `summary` (string) and `sections` (non-empty array) are present. Default `next_step` to `""` and `suggestions` to `[]` if missing. Same for `mode`.

This is a 5-line change in `isStructured` + the JSON path. Instantly fixes every "raw JSON appears on screen" case across **all** chat surfaces (TaskAssistant, AiHelper, AI Tutor) — single source of truth.

### 2. Strengthen the schema enforcement on the way out (defence in depth)

In `supabase/functions/ai-chat/index.ts` (and dev-server `server/routes/aiChat.ts`), after `JSON.parse` of the model output:
- If `summary` + `sections` exist but `next_step` is missing → inject `next_step: ""`.
- If `suggestions` missing → inject `suggestions: []`.
- Re-stringify before sending `content` back.

So the client always receives a schema-conformant JSON string.

### 3. Add a model picker to TaskAssistant (consistency with AiHelper)

In `src/components/learning/TaskAssistant.tsx`:
- Add a `chatModel` local state initialised from `useAiSettings().model` (or the per-route `ai-chat` policy's `primaryModel`).
- Add a small `<ChevronDown>` model dropdown in the header (mirroring `AiHelper`'s implementation): Lovable AI optgroup + OpenRouter free optgroup, refresh button via `useOpenRouterModels`.
- Send the selected `chatModel` instead of `aiModel` to `/api/ai-chat`.
- Persist last selection per task in `localStorage` under `pylearn-task-assistant-model:v1` so it sticks across sessions.

This gives users the same per-component model control AiHelper has — consistent across the board.

### 4. Centralise the JSON-rendering "system" (real "structured output service")

Create `src/lib/structuredAiRenderer.tsx` that exports a single `<StructuredAiResponse content={raw} onSuggestionClick={…} meta={…} />` component. Internally it just delegates to `<ChatMessage role="assistant" />` (which already does parse → blocks → markdown/trace). 

Then both `TaskAssistant` and `AiHelper` import this one component instead of `ChatMessage` directly. This is the "system provider that structures JSON output to look like Claude / OpenAI / Gemini" the user asked for — one renderer, used everywhere, identical look-and-feel guaranteed forever.

(No new dependencies, no DB changes, no edge-function deploys beyond #2.)

## Files

- **Edit** `src/lib/parseAssistantOutput.ts` — relax validator, default optional fields
- **Edit** `supabase/functions/ai-chat/index.ts` — backfill `next_step` / `suggestions` before returning
- **Edit** `server/routes/aiChat.ts` — same backfill for dev parity
- **Edit** `src/components/learning/TaskAssistant.tsx` — model picker in header, use new renderer
- **Edit** `src/components/ai/AiHelper.tsx` — switch to new renderer (one-line import swap)
- **New** `src/lib/structuredAiRenderer.tsx` — single shared renderer component

## Acceptance

- Paste the user's exact buggy response into a test → it now renders as `## 🎯 Goal` heading + `## 🐍 Step-by-step plan` heading with proper sections, NOT raw JSON text.
- TaskAssistant header now shows a model picker dropdown matching AiHelper's; selecting a different model is honoured on the next request and persists.
- All AI chat surfaces (TaskAssistant, AiHelper, AI Tutor) render through the same `<StructuredAiResponse />` — visually identical.
- Backend always returns a schema-complete JSON object (`next_step` and `suggestions` never missing).
- No regressions on cached responses (parser is more permissive, so old caches upgrade automatically).

