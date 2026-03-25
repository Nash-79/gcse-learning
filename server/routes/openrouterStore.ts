const CACHE_TABLE = "public.openrouter_model_cache";

type PgPool = {
  query: (sql: string, params?: any[]) => Promise<{
    rowCount: number;
    rows: any[];
  }>;
};

let pool: PgPool | null | undefined;
let tableEnsured = false;

async function getPool(): Promise<PgPool | null> {
  if (pool !== undefined) return pool;
  const connectionString = (process.env.DATABASE_URL || "").trim();
  if (!connectionString) {
    pool = null;
    return pool;
  }
  try {
    const pg = await import("pg");
    const PoolCtor = (pg as any).default?.Pool || (pg as any).Pool;
    if (!PoolCtor) {
      pool = null;
      return pool;
    }
    pool = new PoolCtor({ connectionString }) as PgPool;
  } catch {
    pool = null;
  }
  return pool;
}

async function ensureTable(): Promise<void> {
  if (tableEnsured) return;
  const db = await getPool();
  if (!db) return;
  await db.query(`
    CREATE TABLE IF NOT EXISTS ${CACHE_TABLE} (
      cache_key TEXT PRIMARY KEY,
      models JSONB NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      source TEXT NOT NULL DEFAULT 'openrouter'
    )
  `);
  tableEnsured = true;
}

export async function loadModelCatalogFromDb(cacheKey: string): Promise<{
  models: any[];
  updatedAt: number;
} | null> {
  try {
    const db = await getPool();
    if (!db) return null;
    await ensureTable();
    const result = await db.query(
      `SELECT models, EXTRACT(EPOCH FROM updated_at) * 1000 AS updated_at_ms
       FROM ${CACHE_TABLE}
       WHERE cache_key = $1
       LIMIT 1`,
      [cacheKey]
    );
    if (result.rowCount === 0) return null;
    const row = result.rows[0];
    return {
      models: Array.isArray(row.models) ? row.models : [],
      updatedAt: Number(row.updated_at_ms || 0),
    };
  } catch {
    return null;
  }
}

export async function saveModelCatalogToDb(
  cacheKey: string,
  models: any[]
): Promise<void> {
  try {
    const db = await getPool();
    if (!db) return;
    await ensureTable();
    await db.query(
      `INSERT INTO ${CACHE_TABLE} (cache_key, models, updated_at, source)
       VALUES ($1, $2::jsonb, NOW(), 'openrouter')
       ON CONFLICT (cache_key)
       DO UPDATE SET models = EXCLUDED.models, updated_at = EXCLUDED.updated_at, source = EXCLUDED.source`,
      [cacheKey, JSON.stringify(models)]
    );
  } catch {
    // Best-effort persistence; ignore failures.
  }
}
