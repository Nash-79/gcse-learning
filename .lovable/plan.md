

## Migration sync status

I compared every local migration file against the live DB schema and migration ledger.

### ✅ In sync (13 of 16)
All `2026031*` and `2026041914*`–`2026041921*` migrations match. The two re-runs from last turn (`…210612` archive + `…210648` leaderboard) succeeded — `archived_at`, the archive trigger, the purge function, the admin archive policy, the `leaderboard_scores` table and its sync trigger are all live.

### ❌ Drift detected (3 migrations never applied)

| Migration file | Issue | Impact |
|---|---|---|
| `20260325210500_openrouter_model_cache.sql` | `openrouter_model_cache` table missing | OpenRouter model catalog cache falls back to live API every cold start — no resilience, slower model lookups |
| `20260418164000_harden_app_logs.sql` | `populate_app_log_actor()` function + `set_app_log_actor` trigger missing; `Authenticated users can insert logs` policy lacks email check; `Anyone can insert error logs` anon policy missing (superseded by the broader `…185350` policy, which is fine) | Server can't auto-stamp `user_id`/`user_email` on logs — all logging relies on the client correctly attaching identity (which we just patched in `appLogger.ts`). Defence-in-depth gap. |
| `20260418150500_user_feedback.sql` | Table exists but live RLS policies have different names than the file (likely manually adjusted later). Schema columns match. | No functional impact — RLS still enforces correct rules. **Cosmetic drift only.** |

## Fix

**Re-run two migrations as new idempotent files** (originals can't be retroactively marked applied — Lovable's migration runner only tracks new submissions):

### Migration A — `openrouter_model_cache`
```sql
CREATE TABLE IF NOT EXISTS public.openrouter_model_cache (
  cache_key TEXT PRIMARY KEY,
  models JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  source TEXT NOT NULL DEFAULT 'openrouter'
);
ALTER TABLE public.openrouter_model_cache ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can read model cache" ON public.openrouter_model_cache;
CREATE POLICY "Anyone can read model cache"
  ON public.openrouter_model_cache FOR SELECT TO anon, authenticated USING (true);
```
(Original file had no RLS — adding read-only policy now since RLS is required for safety.)

### Migration B — `harden_app_logs` (re-runnable)
Re-applies the `populate_app_log_actor()` trigger so the DB itself stamps identity on every insert (defence-in-depth on top of the client fix). All statements use `OR REPLACE` / `IF EXISTS` / `IF NOT EXISTS` so safe to re-run.

### `user_feedback` policy drift
**Leave alone.** Live policies enforce correct security (admins read all, users read own, anon can insert without identity, authenticated insert their own). Renaming them would be churn with zero benefit.

## Acceptance

- `openrouter_model_cache` table exists with read policy → model catalog cache works.
- `set_app_log_actor` trigger exists on `app_logs` → server-side identity stamping active.
- All 3 future re-runs of these new migrations are no-ops (fully idempotent).
- No code changes required — both fixes are pure DB.
- Build still passes.

