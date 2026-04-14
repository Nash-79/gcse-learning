import type { Request } from "express";
import { loadModelCatalogFromDb, saveModelCatalogToDb } from "./openrouterStore.js";
import {
  getOrderedPolicyCandidates,
  normalizePolicyInput,
  type RouteFallbackPolicyInput,
  type RouteKey,
  type SelectionIntent,
} from "./openrouterPolicy.js";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const OPENROUTER_MODELS_URL = "https://openrouter.ai/api/v1/models";
const LOVABLE_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";
const DEFAULT_MODEL = "google/gemma-3-4b-it:free";
const LOVABLE_FALLBACK_MODEL = "google/gemini-2.5-flash";
const LOVABLE_FALLBACK_MODEL_ID = "lovable/google/gemini-2.5-flash";
const MAX_RETRIES = 4;
const MODELS_CACHE_TTL_MS = 6 * 60 * 60 * 1000;
const REQUEST_TIMEOUT_MS = 8000;

export type RetryReason =
  | "rate_limit"
  | "timeout"
  | "empty_response"
  | "provider_error";

export interface OpenRouterModel {
  id: string;
  name: string;
  provider: string;
  description: string;
  contextWindow: number;
  maxOutput: number | null;
  inputPrice: string;
  outputPrice: string;
  tags: string[];
  architecture: string;
  tokenizer: string;
}

export interface AttemptMetadata {
  attemptIndex: number;
  modelId: string;
  elapsedMs: number;
  outcome: "success" | "rate_limit" | "timeout" | "provider_error" | "empty_response";
  statusCode?: number;
}

export interface OpenRouterExecutionMeta {
  routeKey: RouteKey;
  selectionIntent: SelectionIntent;
  attemptCount: number;
  usedFallback: boolean;
  degraded: boolean;
  elapsedMs: number;
  finalModelId: string;
  finalModelLabel: string;
  selectedPolicyModelIds: string[];
  policySource: "settings_saved" | "request_override" | "settings_generated";
  attempts: AttemptMetadata[];
}

export interface OpenRouterExecutionResult {
  response: Response;
  meta: OpenRouterExecutionMeta;
}

let modelsCache: { updatedAt: number; models: OpenRouterModel[] } = {
  updatedAt: 0,
  models: [],
};

export function resolveApiKey(req: Request): string {
  const userKey = (req.header("x-user-api-key") || "").trim();
  const envKey = (process.env.OPENROUTER_API_KEY || "").trim();
  return userKey || envKey;
}

export function resolveModel(requestedModel?: string): string {
  return (requestedModel || "").trim() || DEFAULT_MODEL;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function resolvePolicySource(policy?: RouteFallbackPolicyInput): OpenRouterExecutionMeta["policySource"] {
  if (!policy) return "settings_generated";
  if (policy.primaryModel || (policy.fallbackModelIds?.length || 0) > 0) {
    return "settings_saved";
  }
  return "settings_generated";
}

function logOpenRouterOutcome(meta: OpenRouterExecutionMeta, statusCode?: number) {
  console.info("[openrouter.policy]", JSON.stringify({
    routeKey: meta.routeKey,
    selectionIntent: meta.selectionIntent,
    policySource: meta.policySource,
    selectedPolicyModelIds: meta.selectedPolicyModelIds,
    attemptCount: meta.attemptCount,
    usedFallback: meta.usedFallback,
    degraded: meta.degraded,
    elapsedMs: meta.elapsedMs,
    finalModelId: meta.finalModelId,
    finalModelLabel: meta.finalModelLabel,
    statusCode,
    attempts: meta.attempts,
  }));
}

function buildHeaders(apiKey: string): Record<string, string> {
  const inferredHost =
    process.env.OPENROUTER_HTTP_REFERER ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://gcse-learning.vercel.app");
  const appTitle = process.env.OPENROUTER_X_TITLE || "GCSE Learning";

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
    "HTTP-Referer": inferredHost,
    "X-OpenRouter-Title": appTitle,
    "X-Title": appTitle,
  };
}

function buildBaseHeaders(): Record<string, string> {
  const inferredHost =
    process.env.OPENROUTER_HTTP_REFERER ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://gcse-learning.vercel.app");
  const appTitle = process.env.OPENROUTER_X_TITLE || "GCSE Learning";

  return {
    "Content-Type": "application/json",
    "HTTP-Referer": inferredHost,
    "X-OpenRouter-Title": appTitle,
    "X-Title": appTitle,
  };
}

function toDollar(value?: string): string {
  if (!value || Number.isNaN(Number(value))) return "$0.00";
  return `$${Number(value).toFixed(6)}`;
}

function mapModel(raw: any): OpenRouterModel {
  return {
    id: String(raw?.id || ""),
    name: String(raw?.name || raw?.id || "Unknown"),
    provider: String(raw?.top_provider?.name || raw?.provider?.name || "OpenRouter"),
    description: String(raw?.description || ""),
    contextWindow: Number(raw?.context_length || 0),
    maxOutput: typeof raw?.top_provider?.max_completion_tokens === "number"
      ? raw.top_provider.max_completion_tokens
      : null,
    inputPrice: toDollar(raw?.pricing?.prompt),
    outputPrice: toDollar(raw?.pricing?.completion),
    tags: Array.isArray(raw?.architecture?.modality) ? raw.architecture.modality : [],
    architecture: String(raw?.architecture?.input_modalities?.join("+") || "text -> text"),
    tokenizer: String(raw?.architecture?.tokenizer || "Unknown"),
  };
}

function isFreeModel(raw: any): boolean {
  const id = String(raw?.id || "");
  const prompt = Number(raw?.pricing?.prompt ?? NaN);
  const completion = Number(raw?.pricing?.completion ?? NaN);
  if (id.endsWith(":free")) return true;
  if (!Number.isNaN(prompt) && !Number.isNaN(completion)) {
    return prompt === 0 && completion === 0;
  }
  return false;
}

function getModelLabel(modelId: string, models: OpenRouterModel[]): string {
  return models.find((model) => model.id === modelId)?.name || modelId.split("/").pop()?.replace(":free", "") || modelId;
}

async function fetchWithTimeout(
  apiKey: string,
  body: Record<string, unknown>
): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    return await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: buildHeaders(apiKey),
      body: JSON.stringify(body),
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchLovableFallback(
  apiKey: string,
  body: Record<string, unknown>
): Promise<Response> {
  const lovableBody: Record<string, unknown> = {
    ...body,
    model: LOVABLE_FALLBACK_MODEL,
  };
  delete lovableBody.response_format;

  return fetch(LOVABLE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(lovableBody),
  });
}

export async function fetchOpenRouterModels(options?: {
  apiKey?: string;
  refresh?: boolean;
  freeOnly?: boolean;
}): Promise<OpenRouterModel[]> {
  const freeOnly = options?.freeOnly ?? true;
  const cacheKey = freeOnly ? "free_models" : "all_models";
  const now = Date.now();
  if (!options?.refresh && now - modelsCache.updatedAt < MODELS_CACHE_TTL_MS && modelsCache.models.length > 0) {
    return modelsCache.models;
  }

  let dbStaleFallback: OpenRouterModel[] | null = null;
  if (!options?.refresh) {
    const persisted = await loadModelCatalogFromDb(cacheKey);
    if (persisted && persisted.models.length > 0) {
      const persistedModels = persisted.models as OpenRouterModel[];
      if (now - persisted.updatedAt < MODELS_CACHE_TTL_MS) {
        modelsCache = { updatedAt: persisted.updatedAt, models: persistedModels };
        return persistedModels;
      }
      dbStaleFallback = persistedModels;
    }
  }

  const headers: Record<string, string> = buildBaseHeaders();
  if (options?.apiKey) {
    headers.Authorization = `Bearer ${options.apiKey}`;
  }

  const response = await fetch(OPENROUTER_MODELS_URL, { headers });
  if (!response.ok) {
    if (dbStaleFallback && dbStaleFallback.length > 0) {
      modelsCache = { updatedAt: now, models: dbStaleFallback };
      return dbStaleFallback;
    }
    if (modelsCache.models.length > 0) return modelsCache.models;
    throw new Error(`OpenRouter models API failed: ${response.status}`);
  }

  const payload = await response.json();
  const rawModels = Array.isArray(payload?.data) ? payload.data : [];
  const filtered = freeOnly ? rawModels.filter(isFreeModel) : rawModels;
  const mapped = filtered
    .map(mapModel)
    .filter((m) => m.id);

  modelsCache = { updatedAt: now, models: mapped };
  await saveModelCatalogToDb(cacheKey, mapped);
  return mapped;
}

export async function executeOpenRouterPolicy(
  apiKey: string,
  body: Record<string, unknown>,
  policy?: RouteFallbackPolicyInput
): Promise<OpenRouterExecutionResult> {
  const requestedModel = typeof body.model === "string" ? body.model : DEFAULT_MODEL;
  const normalized = normalizePolicyInput(requestedModel, policy, MAX_RETRIES);
  let catalog: OpenRouterModel[] = [];

  try {
    catalog = await fetchOpenRouterModels({ apiKey, freeOnly: true });
  } catch {
    catalog = [];
  }

  const candidates = getOrderedPolicyCandidates(requestedModel, normalized).slice(0, normalized.maxAttempts);

  const attempts: AttemptMetadata[] = [];
  const startedAt = Date.now();
  let lastResponse: Response | null = null;
  let finalModelId = requestedModel;
  const policySource = resolvePolicySource(policy);

  for (let attemptIndex = 0; attemptIndex < candidates.length; attemptIndex += 1) {
    const modelId = candidates[attemptIndex];
    finalModelId = modelId;
    const attemptStartedAt = Date.now();
    const requestBody = { ...body, model: modelId };

    try {
      const response = await fetchWithTimeout(apiKey, requestBody);
      const elapsedMs = Date.now() - attemptStartedAt;

      if (response.ok) {
        attempts.push({
          attemptIndex,
          modelId,
          elapsedMs,
          outcome: "success",
          statusCode: response.status,
        });

        const meta = {
          routeKey: normalized.routeKey,
          selectionIntent: normalized.selectionIntent,
          attemptCount: attempts.length,
          usedFallback: attemptIndex > 0,
          degraded: Date.now() - startedAt > normalized.slowThresholdMs,
          elapsedMs: Date.now() - startedAt,
          finalModelId: modelId,
          finalModelLabel: getModelLabel(modelId, catalog),
          selectedPolicyModelIds: candidates,
          policySource,
          attempts,
        } satisfies OpenRouterExecutionMeta;
        logOpenRouterOutcome(meta, response.status);
        return {
          response,
          meta,
        };
      }

      lastResponse = response;
      const outcome: AttemptMetadata["outcome"] = response.status === 429 ? "rate_limit" : "provider_error";
      attempts.push({
        attemptIndex,
        modelId,
        elapsedMs,
        outcome,
        statusCode: response.status,
      });

      const shouldRetry = response.status === 429
        ? normalized.retryOn.includes("rate_limit")
        : normalized.retryOn.includes("provider_error");
      if (!shouldRetry) {
        break;
      }
      await sleep(2 ** attemptIndex * 200);
    } catch (error) {
      const elapsedMs = Date.now() - attemptStartedAt;
      const outcome: AttemptMetadata["outcome"] = error instanceof Error && error.name === "AbortError"
        ? "timeout"
        : "provider_error";
      attempts.push({
        attemptIndex,
        modelId,
        elapsedMs,
        outcome,
      });

      const shouldRetry = outcome === "timeout"
        ? normalized.retryOn.includes("timeout")
        : normalized.retryOn.includes("provider_error");
      if (!shouldRetry) {
        throw error;
      }
      await sleep(2 ** attemptIndex * 200);
    }
  }

  if (lastResponse) {
    const lovableApiKey = (process.env.LOVABLE_API_KEY || "").trim();
    if (lovableApiKey) {
      const lovableResponse = await fetchLovableFallback(lovableApiKey, body);
      if (lovableResponse.ok) {
        attempts.push({
          attemptIndex: attempts.length,
          modelId: LOVABLE_FALLBACK_MODEL_ID,
          elapsedMs: 0,
          outcome: "success",
          statusCode: lovableResponse.status,
        });
        const meta = {
          routeKey: normalized.routeKey,
          selectionIntent: normalized.selectionIntent,
          attemptCount: attempts.length,
          usedFallback: true,
          degraded: Date.now() - startedAt > normalized.slowThresholdMs,
          elapsedMs: Date.now() - startedAt,
          finalModelId: LOVABLE_FALLBACK_MODEL_ID,
          finalModelLabel: "Lovable Gemini 2.5 Flash",
          selectedPolicyModelIds: [...candidates, LOVABLE_FALLBACK_MODEL_ID],
          policySource,
          attempts,
        } satisfies OpenRouterExecutionMeta;
        logOpenRouterOutcome(meta, lovableResponse.status);
        return {
          response: lovableResponse,
          meta,
        };
      }
    }

    const meta = {
      routeKey: normalized.routeKey,
      selectionIntent: normalized.selectionIntent,
      attemptCount: attempts.length,
      usedFallback: attempts.length > 1,
      degraded: Date.now() - startedAt > normalized.slowThresholdMs,
      elapsedMs: Date.now() - startedAt,
      finalModelId,
      finalModelLabel: getModelLabel(finalModelId, catalog),
      selectedPolicyModelIds: candidates,
      policySource,
      attempts,
    } satisfies OpenRouterExecutionMeta;
    logOpenRouterOutcome(meta, lastResponse.status);
    return {
      response: lastResponse,
      meta,
    };
  }

  throw new Error(`OpenRouter unavailable after ${attempts.length || 0} attempts`);
}

export async function callOpenRouterWithRetry(
  apiKey: string,
  body: Record<string, unknown>,
  policy?: RouteFallbackPolicyInput
): Promise<Response> {
  const result = await executeOpenRouterPolicy(apiKey, body, policy);
  return result.response;
}

export async function extractOpenRouterError(response: Response): Promise<string> {
  try {
    const text = await response.text();
    if (!text) return `AI API error: ${response.status}`;
    try {
      const parsed = JSON.parse(text);
      if (parsed?.error?.message) return String(parsed.error.message);
      if (parsed?.error) return String(parsed.error);
      if (parsed?.message) return String(parsed.message);
    } catch {
      // plain text fallback below
    }
    return text.slice(0, 240);
  } catch {
    return `AI API error: ${response.status}`;
  }
}
