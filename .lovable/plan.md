

## Diagnosis

The existing `20260419160000_app_logs_archive.sql` is **already fully re-runnable**:
- `ADD COLUMN IF NOT EXISTS archived_at`
- `CREATE INDEX IF NOT EXISTS` (×2)
- `CREATE OR REPLACE FUNCTION` (×2)
- `DROP TRIGGER IF EXISTS` then `CREATE TRIGGER`
- `DROP POLICY IF EXISTS` then `CREATE POLICY`

No re-runnability changes needed. The file is correct — it just was never executed against the live DB (confirmed: `app_logs` has only 10 columns, no `archived_at`; neither helper function exists).

## Fix

### 1. Apply the archive migration to the live DB
Re-submit the same SQL via the migration tool. Because every statement is guarded, a future re-run is also safe.

### 2. Fix TS2589 in `src/hooks/usePendingApprovalCount.ts`
Narrow the select to collapse generic depth:
```ts
.select("id", { count: "exact", head: true })
```
(line 26, replacing `"*"` with `"id"`)

## Why no other changes

- The two `AdminLogViewer.tsx` TS2353 errors auto-resolve once the column exists and `src/integrations/supabase/types.ts` regenerates.
- The anon chip-click policy migration (`20260419185350_…`) is already live — verified.

## Acceptance

- `app_logs.archived_at` column + `enforce_app_log_archive_only` trigger + `"Admins can archive logs"` policy + `purge_archived_app_logs()` all present.
- All 3 TS errors gone, build passes.
- Migration safe to re-run any number of times.
- Admin Logs archive/restore works end-to-end.

