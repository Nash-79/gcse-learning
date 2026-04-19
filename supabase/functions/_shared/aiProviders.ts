// Shared resiliency primitives used by ai-chat and gcse-chat edge functions.
// Exports an ordered OpenRouter fallback chain, a Lovable descriptor, and
// helpers for retrying with backoff, sanitizing upstream body snippets, and
// deduplicating app_logs writes.

export type ProviderName = "openrouter" | "lovable";

export interface AiAttempt {
  model: string;
  provider: ProviderName;
  status: number;
  ms: number;
}

export interface AiFallbackReason {
  status: number;
  message: string;
  model: string;
  provider: ProviderName;
}

// Ordered OpenRouter chain. First entry is the default; chain walk proceeds in
// order on 429/5xx. Kept small to bound latency when everything is rate-limited.
export const OPENROUTER_CHAIN: string[] = [
  "meta-llama/llama-3.3-70b-instruct:free",
  "google/gemma-3-27b-it:free",
  "qwen/qwen3-next-80b-a3b-instruct:free",
  "openai/gpt-oss-120b:free",
  "mistralai/mistral-small-3.1-24b-instruct:free",
];

export const OPENROUTER_MODELS = new Set([
  ...OPENROUTER_CHAIN,
  "qwen/qwen3-coder:free",
  "nvidia/nemotron-3-super-120b-a12b:free",
  "stepfun/step-3.5-flash:free",
  "arcee-ai/trinity-large-preview:free",
  "openai/gpt-oss-20b:free",
  "minimax/minimax-m2.5:free",
  "nvidia/nemotron-3-nano-30b-a3b:free",
  "nousresearch/hermes-3-llama-3.1-405b:free",
  "nvidia/nemotron-nano-12b-v2-vl:free",
  "nvidia/nemotron-nano-9b-v2:free",
  "z-ai/glm-4.5-air:free",
  "arcee-ai/trinity-mini:free",
  "google/gemma-3-12b-it:free",
  "google/gemma-3-4b-it:free",
  "qwen/qwen3-4b:free",
  "meta-llama/llama-3.2-3b-instruct:free",
  "meta-llama/llama-3.1-8b-instruct:free",
]);

export const LOVABLE_STREAM_MODEL = "google/gemini-3-flash-preview";
export const LOVABLE_JSON_MODEL = "google/gemini-2.5-flash";

// Redact Bearer tokens, API keys and email addresses before persisting a body
// snippet to logs or returning it to the client. Caps length at 400 chars.
export function sanitizeSnippet(input: string, max = 400): string {
  if (!input) return "";
  const cleaned = input
    .replace(/Bearer\s+[\w.-]+/gi, "Bearer ***")
    .replace(/sk-[A-Za-z0-9_-]{10,}/g, "sk-***")
    .replace(/"api[_-]?key"\s*:\s*"[^"]+"/gi, '"api_key":"***"')
    .replace(/[\w.+-]+@[\w-]+\.[\w.-]+/g, "***@***");
  return cleaned.slice(0, max);
}

// Parse Retry-After (seconds or HTTP date) and X-RateLimit-Reset (epoch seconds
// or epoch ms) into a millisecond wait. Capped to avoid function timeout.
export function parseRetryWaitMs(headers: Headers, attempt: number, max = 6000): number {
  const retryAfter = headers.get("retry-after");
  if (retryAfter) {
    const asSeconds = Number(retryAfter);
    if (Number.isFinite(asSeconds) && asSeconds >= 0) {
      return Math.min(asSeconds * 1000, max);
    }
    const asDate = Date.parse(retryAfter);
    if (Number.isFinite(asDate)) {
      return Math.min(Math.max(asDate - Date.now(), 0), max);
    }
  }
  const reset = headers.get("x-ratelimit-reset");
  if (reset) {
    const n = Number(reset);
    if (Number.isFinite(n)) {
      const asMs = n > 1e12 ? n : n * 1000;
      return Math.min(Math.max(asMs - Date.now(), 0), max);
    }
  }
  // Exponential backoff with jitter: 400ms, 800ms, 1600ms
  const base = 400 * Math.pow(2, attempt);
  const jitter = Math.random() * 150;
  return Math.min(base + jitter, max);
}

export function isRetryableStatus(status: number): boolean {
  return status === 429 || (status >= 500 && status < 600);
}

export async function sleep(ms: number): Promise<void> {
  if (ms <= 0) return;
  await new Promise((resolve) => setTimeout(resolve, ms));
}

export function modelLabel(modelId: string, provider: ProviderName): string {
  const short = modelId.split("/").pop()?.replace(":free", "") || modelId;
  if (provider === "lovable") return `${short} (Lovable AI)`;
  return short;
}

// ───────── App log dedupe ─────────
// Keyed by (origin, status, model). Values are last-logged timestamps. Old
// entries age out on access — no background sweep needed.
const logDedupe = new Map<string, number>();
const DEDUP_WINDOW_MS = 60_000;

export function shouldLogUpstreamFailure(key: { origin: string; status: number; model: string }): boolean {
  const compound = `${key.origin}|${key.status}|${key.model}`;
  const now = Date.now();
  const last = logDedupe.get(compound);
  if (last !== undefined && now - last < DEDUP_WINDOW_MS) return false;
  logDedupe.set(compound, now);
  // Age out opportunistically to keep the map small.
  if (logDedupe.size > 200) {
    for (const [k, t] of logDedupe) {
      if (now - t > DEDUP_WINDOW_MS) logDedupe.delete(k);
    }
  }
  return true;
}
