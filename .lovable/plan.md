

## Context

- No `.github/workflows/` exists — project deploys via Lovable / Replit, not GitHub Actions.
- Migrations live in `supabase/migrations/*.sql`. Each one creates known objects (tables, functions, triggers, policies).
- The "drift" we keep hitting: a migration file exists locally but was never executed against the live DB. There's no automatic detector.
- Build is `vite build` (frontend) + `node build-server.mjs` (server bundle). No pre-build hook today.

## Approach

A pure Node script that runs as part of the build (and locally via `npm run migrations:check`). It does **not** need DB credentials at build time — instead it uses the **generated `src/integrations/supabase/types.ts`** as the source of truth for the live schema (Lovable regenerates this file from the live DB after every migration). If a migration file references a table/function that doesn't appear in `types.ts`, the migration hasn't been applied → fail the build.

This is the only viable check in this environment because:
- Lovable doesn't expose live DB credentials to the build sandbox.
- `types.ts` IS the live-schema mirror, regenerated server-side.
- It catches exactly the drift class we hit 3 times today (`archived_at` missing, `openrouter_model_cache` missing, `populate_app_log_actor` missing).

## What the script does

`scripts/checkMigrationDrift.ts`:

1. Read every `supabase/migrations/*.sql` file.
2. For each, parse out declared objects via regex:
   - `CREATE TABLE [IF NOT EXISTS] public.<name>` → table
   - `ALTER TABLE public.<name> ADD COLUMN [IF NOT EXISTS] <col>` → table.column
   - `CREATE [OR REPLACE] FUNCTION public.<name>` → function
3. Read `src/integrations/supabase/types.ts` and extract:
   - All table names from the `Tables: { … }` block
   - All column names per table from the `Row: { … }` blocks
   - All function names from the `Functions: { … }` block
4. For each declared object in a migration, check it exists in `types.ts`. If missing → record drift.
5. Print a clean report. Exit `1` if any drift found.

**Allowlist** for known-acceptable cases (e.g. triggers/policies aren't in `types.ts`, so we only check tables/columns/functions — those are the high-signal indicators).

**Wiring**:
- `package.json` → add `"migrations:check": "tsx scripts/checkMigrationDrift.ts"`
- `package.json` → change `"build"` to `"npm run migrations:check && vite build"` so Lovable's build fails fast on drift.
- Also runnable standalone: `npm run migrations:check`.

## Files

- **Create** `scripts/checkMigrationDrift.ts` (~120 lines, no new deps — uses `node:fs` + `node:path`)
- **Edit** `package.json` — add script + chain into `build`

## Acceptance

- Running `npm run migrations:check` against the current repo passes (all 17 migrations are now in sync after today's fixes).
- If someone adds a new migration creating `public.foo` without it being applied, `npm run build` fails with: `Drift detected: table "foo" declared in 20260420…sql is missing from live schema (types.ts).`
- Zero false positives on triggers/policies (deliberately excluded — `types.ts` doesn't expose them).
- No new npm dependencies.

