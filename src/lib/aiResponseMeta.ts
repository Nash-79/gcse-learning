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
}

/** Safely extract meta from a parsed JSON response body */
export function extractMeta(data: Record<string, unknown> | null | undefined): AiResponseMeta | undefined {
  if (!data || typeof data !== "object") return undefined;
  const meta = data.meta as Record<string, unknown> | undefined;
  if (!meta || typeof meta !== "object") return undefined;
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
  };
}
