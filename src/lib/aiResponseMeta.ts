export interface AiAttempt {
  model: string;
  provider: "openrouter" | "lovable";
  status: number;
  ms: number;
}

export interface AiFallbackReason {
  status: number;
  message: string;
  model: string;
  provider: "openrouter" | "lovable";
}

/** Metadata returned by backend AI reliability layer */
export interface AiResponseMeta {
  routeKey?: string;
  finalModelId?: string;
  finalModelLabel?: string;
  usedFallback?: boolean;
  degraded?: boolean;
  attemptCount?: number;
  elapsedMs?: number;
  selectionIntent?: string;
  policySource?: string;
  /** First non-success upstream response that triggered fallback or chain walk. */
  fallbackReason?: AiFallbackReason;
  /** Ordered list of upstream attempts (including successes). */
  attempts?: AiAttempt[];
}

function isAttempt(value: unknown): value is AiAttempt {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.model === "string" &&
    (v.provider === "openrouter" || v.provider === "lovable") &&
    typeof v.status === "number" &&
    typeof v.ms === "number"
  );
}

function isFallbackReason(value: unknown): value is AiFallbackReason {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.status === "number" &&
    typeof v.message === "string" &&
    typeof v.model === "string" &&
    (v.provider === "openrouter" || v.provider === "lovable")
  );
}

/** Safely extract meta from a parsed JSON response body */
export function extractMeta(data: Record<string, unknown> | null | undefined): AiResponseMeta | undefined {
  if (!data || typeof data !== "object") return undefined;
  const meta = data.meta as Record<string, unknown> | undefined;
  if (!meta || typeof meta !== "object") return undefined;
  const attempts = Array.isArray(meta.attempts) ? meta.attempts.filter(isAttempt) : undefined;
  return {
    routeKey: typeof meta.routeKey === "string" ? meta.routeKey : undefined,
    finalModelId: typeof meta.finalModelId === "string" ? meta.finalModelId : undefined,
    finalModelLabel: typeof meta.finalModelLabel === "string" ? meta.finalModelLabel : undefined,
    usedFallback: typeof meta.usedFallback === "boolean" ? meta.usedFallback : undefined,
    degraded: typeof meta.degraded === "boolean" ? meta.degraded : undefined,
    attemptCount: typeof meta.attemptCount === "number" ? meta.attemptCount : undefined,
    elapsedMs: typeof meta.elapsedMs === "number" ? meta.elapsedMs : undefined,
    selectionIntent: typeof meta.selectionIntent === "string" ? meta.selectionIntent : undefined,
    policySource: typeof meta.policySource === "string" ? meta.policySource : undefined,
    fallbackReason: isFallbackReason(meta.fallbackReason) ? meta.fallbackReason : undefined,
    attempts: attempts && attempts.length > 0 ? attempts : undefined,
  };
}
