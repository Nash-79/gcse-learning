export type RouteKey =
  | "tutor_stream"
  | "helper_chat"
  | "challenge_generate"
  | "challenge_answer"
  | "exam_validate"
  | "question_generate"
  | "settings_test";

export type RetryReason =
  | "rate_limit"
  | "timeout"
  | "empty_response"
  | "provider_error";

export type SelectionIntent =
  | "balanced"
  | "fastest"
  | "python_gcse"
  | "reasoning_first";

export interface RouteFallbackPolicyInput {
  routeKey?: RouteKey;
  selectionIntent?: SelectionIntent;
  primaryModel?: string;
  fallbackModelIds?: string[];
  maxAttempts?: number;
  slowThresholdMs?: number;
  retryOn?: RetryReason[];
}

function uniqueModelIds(ids: string[]): string[] {
  const seen = new Set<string>();
  const next: string[] = [];
  for (const id of ids) {
    const value = id.trim();
    if (!value || seen.has(value)) continue;
    seen.add(value);
    next.push(value);
  }
  return next;
}

function getIntent(routeKey: RouteKey): SelectionIntent {
  if (routeKey === "helper_chat") return "reasoning_first";
  if (routeKey === "settings_test") return "fastest";
  return "python_gcse";
}

export function getOrderedPolicyCandidates(
  requestedModel: string,
  policy?: RouteFallbackPolicyInput
): string[] {
  return uniqueModelIds([
    policy?.primaryModel || requestedModel,
    ...(policy?.fallbackModelIds || []),
  ]);
}

export function normalizePolicyInput(
  requestedModel: string,
  policy?: RouteFallbackPolicyInput,
  maxRetries = 4
): Required<RouteFallbackPolicyInput> {
  const routeKey = policy?.routeKey || "helper_chat";
  const selectionIntent = policy?.selectionIntent || getIntent(routeKey);
  const orderedCandidates = getOrderedPolicyCandidates(requestedModel, policy);
  const boundedAttempts = Math.max(1, Math.min(Number(policy?.maxAttempts || orderedCandidates.length || 1), maxRetries));

  return {
    routeKey,
    selectionIntent,
    primaryModel: orderedCandidates[0] || requestedModel,
    fallbackModelIds: orderedCandidates.slice(1, 4),
    maxAttempts: boundedAttempts,
    slowThresholdMs: Math.max(1000, Number(policy?.slowThresholdMs || (routeKey === "settings_test" ? 2500 : 4000))),
    retryOn: policy?.retryOn?.length ? [...new Set(policy.retryOn)] : ["rate_limit", "timeout", "provider_error"],
  };
}
