

## Diagnosis: signup is actually working backend-side

I tested signup directly against the auth API — it succeeded (HTTP 200, profile auto-created via `on_auth_user_created` trigger). 3 real users exist in the database. So the issue you're seeing is **not** the auth backend.

There are however **two real frontend problems** that explain why your UI feels broken:

### Problem 1 — `src/integrations/supabase/client.ts` has wrong fallback values
```ts
const SUPABASE_URL = _rawUrl.startsWith("http") ? _rawUrl : "https://eneaikataseigolavizw.supabase.co";  // WRONG project ref
const SUPABASE_PUBLISHABLE_KEY = _rawKey || "sb_publishable_TL1mLqQ1...";  // wrong format placeholder
```
If `.env` ever fails to load (cold preview start, prod build env miss), the client points at a non-existent project and every signup silently fails. The correct project ref is `eikcwvugoofralsrqjfs`.

### Problem 2 — `FeedbackDialog.tsx` line 115 is a TypeScript build error
```ts
toast.error(`Failed to submit feedback: ${result.error}`);  // result is narrowed to {ok:true} on this branch — needs !result.ok guard fix
```
This blocks the production typecheck/build. In dev it still renders, but on the deployed site (`gcse-pylearn.lovable.app`) the build fails → users get a stale or broken bundle → signup form may not work.

### Problem 3 (related) — preview is throwing 404 on `/`
Network logs show: `GET / → 404 "Not found"` at 15:40:48. The dev server is up but the published site is failing. This is consistent with the typecheck failure breaking the production build.

There are also unrelated existing TS errors in `paper1Theory.ts`, `paper2Theory.ts`, and `useTopics.ts` (`string` vs `string[]` and `ExamBoard` enum mismatches) — these have been there a while and also block the production build.

---

## Fix plan

| # | File | Change |
|---|---|---|
| 1 | `src/integrations/supabase/client.ts` | Replace bad fallback URL `eneaikataseigolavizw` → `eikcwvugoofralsrqjfs` and fallback publishable key with the real anon JWT, so signup works even if `.env` is missed. |
| 2 | `src/components/feedback/FeedbackDialog.tsx` line 113-117 | Narrow correctly: `if (!result.ok) { toast.error(\`Failed to submit feedback: ${result.error}\`); return; }` — the `!result.ok` guard already exists; just make TS happy by reading `result.error` *inside* the narrowed branch (it currently is, but TS can't infer because of how the early return is structured — small refactor). |
| 3 | `src/data/questionBank/paper1Theory.ts` (8 spots) and `paper2Theory.ts` (5 spots) | Wrap bare `examBoards: "OCR"` strings as arrays: `examBoards: ["OCR"]`. |
| 4 | `src/hooks/useTopics.ts` line ~86 | Cast/narrow the produced array items so `examBoards: string[]` becomes `examBoards: ExamBoard[]` (e.g. `as Topic[]` after filtering, or use `satisfies`). |
| 5 | After fixes — quick sanity: re-run a signup against the live app (you, in the browser) and confirm "Check your email" toast appears. |

### Out of scope (not touching)
- Auth flow itself (works), `useAuth.tsx`, `Auth.tsx`, the `handle_new_user` trigger — all correct.
- AI reliability / provenance work from prior plan.

### Acceptance
- `npm run build` (typecheck) passes with zero errors.
- Published site at `gcse-pylearn.lovable.app` returns 200 on `/`.
- A new user can complete the signup form on the Auth page and receive the confirmation email.

