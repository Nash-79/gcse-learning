/**
 * Shared AI response cache (single source of truth for all chat surfaces).
 *
 * Backed by localStorage under `pylearn-ai-cache:v1:<namespace>`. Each
 * namespace is an LRU map (default cap 50) with a 7-day TTL. Cache hits are
 * also re-written on read so the entry is "fresh" in LRU terms.
 *
 * Bypass: when localStorage["pylearn-ai-cache-disabled"] === "1", `get`
 * returns null and `set` is a no-op. Callers can also pass `bypass: true`
 * to `get` for one-off skips (Alt+Send, refresh-icon).
 */
import type { AiResponseMeta } from "@/lib/aiResponseMeta";

export type CacheNamespace = "task-assistant" | "topic-explainer" | "ai-tutor";

export interface CacheEntry {
  content: string;
  meta?: AiResponseMeta;
  model?: string;
  createdAt: number;
  hits: number;
}

const KEY_PREFIX = "pylearn-ai-cache:v1:";
const DISABLED_KEY = "pylearn-ai-cache-disabled";
const DEFAULT_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const DEFAULT_CAP = 50;

const NAMESPACE_CAPS: Record<CacheNamespace, number> = {
  "task-assistant": 80,
  "topic-explainer": 50,
  "ai-tutor": 40,
};

type Bucket = Record<string, CacheEntry>;

function lsKey(ns: CacheNamespace): string {
  return KEY_PREFIX + ns;
}

export function isCachingDisabled(): boolean {
  try {
    return localStorage.getItem(DISABLED_KEY) === "1";
  } catch {
    return false;
  }
}

export function setCachingDisabled(disabled: boolean): void {
  try {
    if (disabled) localStorage.setItem(DISABLED_KEY, "1");
    else localStorage.removeItem(DISABLED_KEY);
  } catch { /* ignore */ }
}

function readBucket(ns: CacheNamespace): Bucket {
  try {
    const raw = localStorage.getItem(lsKey(ns));
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? (parsed as Bucket) : {};
  } catch {
    return {};
  }
}

function writeBucket(ns: CacheNamespace, bucket: Bucket): void {
  try {
    localStorage.setItem(lsKey(ns), JSON.stringify(bucket));
  } catch {
    // Quota exceeded — drop oldest 25% and retry once.
    try {
      const entries = Object.entries(bucket).sort(
        ([, a], [, b]) => (a.createdAt || 0) - (b.createdAt || 0),
      );
      const dropCount = Math.max(1, Math.floor(entries.length / 4));
      const trimmed: Bucket = {};
      for (const [k, v] of entries.slice(dropCount)) trimmed[k] = v;
      localStorage.setItem(lsKey(ns), JSON.stringify(trimmed));
    } catch { /* give up silently */ }
  }
}

function enforceCap(bucket: Bucket, cap: number): Bucket {
  const keys = Object.keys(bucket);
  if (keys.length <= cap) return bucket;
  // Evict oldest by createdAt.
  const sorted = keys
    .map((k) => ({ k, t: bucket[k]?.createdAt || 0 }))
    .sort((a, b) => a.t - b.t);
  const toDrop = sorted.slice(0, keys.length - cap);
  const next: Bucket = { ...bucket };
  for (const { k } of toDrop) delete next[k];
  return next;
}

export interface GetOptions {
  maxAgeMs?: number;
  bypass?: boolean;
}

function isExpired(entry: CacheEntry, maxAgeMs: number): boolean {
  if (!entry?.createdAt) return true;
  return Date.now() - entry.createdAt > maxAgeMs;
}

export const aiCache = {
  get(ns: CacheNamespace, key: string, opts: GetOptions = {}): CacheEntry | null {
    if (opts.bypass || isCachingDisabled()) return null;
    const bucket = readBucket(ns);
    const entry = bucket[key];
    if (!entry) return null;
    const maxAge = opts.maxAgeMs ?? DEFAULT_MAX_AGE_MS;
    if (isExpired(entry, maxAge)) {
      delete bucket[key];
      writeBucket(ns, bucket);
      return null;
    }
    // Bump hits (LRU-ish recency hint, used by stats only).
    entry.hits = (entry.hits || 0) + 1;
    bucket[key] = entry;
    writeBucket(ns, bucket);
    return entry;
  },

  set(ns: CacheNamespace, key: string, entry: Omit<CacheEntry, "hits" | "createdAt"> & Partial<Pick<CacheEntry, "createdAt" | "hits">>): void {
    if (isCachingDisabled()) return;
    if (!entry?.content) return;
    const bucket = readBucket(ns);
    const full: CacheEntry = {
      content: entry.content,
      meta: entry.meta,
      model: entry.model,
      createdAt: entry.createdAt ?? Date.now(),
      hits: entry.hits ?? 0,
    };
    bucket[key] = full;
    const cap = NAMESPACE_CAPS[ns] ?? DEFAULT_CAP;
    writeBucket(ns, enforceCap(bucket, cap));
  },

  invalidate(ns: CacheNamespace, key: string): void {
    const bucket = readBucket(ns);
    if (key in bucket) {
      delete bucket[key];
      writeBucket(ns, bucket);
    }
  },

  clearNamespace(ns: CacheNamespace): number {
    const bucket = readBucket(ns);
    const count = Object.keys(bucket).length;
    try { localStorage.removeItem(lsKey(ns)); } catch { /* ignore */ }
    return count;
  },

  clearAll(): number {
    let total = 0;
    for (const ns of Object.keys(NAMESPACE_CAPS) as CacheNamespace[]) {
      total += this.clearNamespace(ns);
    }
    return total;
  },

  stats(ns: CacheNamespace): { count: number; bytes: number; oldest: number | null } {
    try {
      const raw = localStorage.getItem(lsKey(ns)) || "";
      const bucket = readBucket(ns);
      const entries = Object.values(bucket);
      const oldest = entries.length > 0 ? Math.min(...entries.map((e) => e.createdAt || Date.now())) : null;
      return { count: entries.length, bytes: raw.length, oldest };
    } catch {
      return { count: 0, bytes: 0, oldest: null };
    }
  },

  allStats(): Record<CacheNamespace, { count: number; bytes: number; oldest: number | null }> {
    const out = {} as Record<CacheNamespace, { count: number; bytes: number; oldest: number | null }>;
    for (const ns of Object.keys(NAMESPACE_CAPS) as CacheNamespace[]) {
      out[ns] = this.stats(ns);
    }
    return out;
  },
};

/** djb2 hash → base36, stable across JS engines. */
export function djb2(str: string): string {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i);
    hash = hash & 0xffffffff;
  }
  return (hash >>> 0).toString(36);
}

/** Build a stable cache key. Order-independent components → identical hash. */
export function buildKey(parts: Array<string | number | undefined | null>): string {
  return parts
    .map((p) => (p == null ? "" : String(p)))
    .map((p) => p.trim().toLowerCase().replace(/\s+/g, " "))
    .join("|");
}

/** Format "served from cache" pill timestamp. */
export function formatCachedAgo(createdAt: number): string {
  const diff = Date.now() - createdAt;
  if (diff < 60_000) return "just now";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  const days = Math.floor(diff / 86_400_000);
  return days === 1 ? "1 day ago" : `${days} days ago`;
}

/** One-off lazy migration of pre-existing surface caches. Idempotent. */
export function migrateLegacyCaches(): void {
  try {
    const flag = "pylearn-ai-cache:migrated:v1";
    if (localStorage.getItem(flag) === "1") return;
    const legacyTask = localStorage.getItem("pylearn-task-assistant:v1");
    if (legacyTask) {
      try {
        const parsed = JSON.parse(legacyTask) as Record<string, string>;
        if (parsed && typeof parsed === "object") {
          const bucket = readBucket("task-assistant");
          for (const [k, v] of Object.entries(parsed)) {
            if (typeof v === "string" && !(k in bucket)) {
              bucket[k] = { content: v, createdAt: Date.now(), hits: 0 };
            }
          }
          writeBucket("task-assistant", enforceCap(bucket, NAMESPACE_CAPS["task-assistant"]));
        }
      } catch { /* ignore */ }
    }
    localStorage.setItem(flag, "1");
  } catch { /* ignore */ }
}
