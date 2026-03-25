import type { Request } from "express";
import { loadModelCatalogFromDb, saveModelCatalogToDb } from "./openrouterStore.js";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const OPENROUTER_MODELS_URL = "https://openrouter.ai/api/v1/models";
const DEFAULT_MODEL = "meta-llama/llama-3.3-70b-instruct:free";
const MAX_RETRIES = 4;
const MODELS_CACHE_TTL_MS = 6 * 60 * 60 * 1000;

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

export async function callOpenRouterWithRetry(
  apiKey: string,
  body: Record<string, unknown>
): Promise<Response> {
  const requestedModel = typeof body.model === "string" ? body.model : DEFAULT_MODEL;
  let fallbackModels: string[] = [];
  try {
    fallbackModels = (await fetchOpenRouterModels({ apiKey, freeOnly: true }))
      .map((m) => m.id)
      .filter((id) => id !== requestedModel)
      .slice(0, 3);
  } catch {
    fallbackModels = [
      "google/gemma-3-4b-it:free",
      "qwen/qwen3-4b:free",
      "meta-llama/llama-3.2-3b-instruct:free",
    ];
  }
  const modelCandidates = [requestedModel, ...fallbackModels].filter((model, index, arr) => arr.indexOf(model) === index);
  let lastResponse: Response | null = null;
  let lastError: unknown = null;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt += 1) {
    const model = modelCandidates[Math.min(attempt, modelCandidates.length - 1)];
    const requestBody: Record<string, unknown> = { ...body, model };

    try {
      const response = await fetch(OPENROUTER_URL, {
        method: "POST",
        headers: buildHeaders(apiKey),
        body: JSON.stringify(requestBody),
      });

      if (response.status !== 429) {
        return response;
      }

      lastResponse = response;
      await sleep(2 ** attempt * 250);
    } catch (error) {
      lastError = error;
      await sleep(2 ** attempt * 250);
    }
  }

  if (lastResponse) {
    return lastResponse;
  }

  throw new Error(
    `OpenRouter unavailable after ${MAX_RETRIES} attempts` +
      (lastError ? `: ${String(lastError)}` : "")
  );
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
