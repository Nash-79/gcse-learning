import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "./apiFetch";
import { appLog } from "./appLogger";

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
  recommended?: boolean;
  deprecated?: string;
}

export type ModelsStatus = "loading" | "ready" | "fallback" | "error";

const CACHE_KEY = "pylearn-openrouter-models-cache";
const CACHE_TTL_MS = 6 * 60 * 60 * 1000;

/**
 * Hardcoded fallback free models. Ensures the AI model picker is never
 * empty even when the OpenRouter catalog fetch fails. Keep this list short
 * and conservative — models that have been reliably available on the free
 * tier for months.
 */
const SAFE_DEFAULT_MODELS: OpenRouterModel[] = [
  {
    id: "google/gemma-3-4b-it:free",
    name: "Gemma 3 4B (Free)",
    provider: "google",
    description: "Google's Gemma 3 4B instruct model on the free tier.",
    contextWindow: 8192,
    maxOutput: null,
    inputPrice: "0",
    outputPrice: "0",
    tags: ["free"],
    architecture: "text",
    tokenizer: "gemma",
    recommended: true,
  },
  {
    id: "meta-llama/llama-3.3-70b-instruct:free",
    name: "Llama 3.3 70B Instruct (Free)",
    provider: "meta",
    description: "Meta's Llama 3.3 70B instruct on the free tier.",
    contextWindow: 131072,
    maxOutput: null,
    inputPrice: "0",
    outputPrice: "0",
    tags: ["free"],
    architecture: "text",
    tokenizer: "llama3",
  },
  {
    id: "meta-llama/llama-3.2-3b-instruct:free",
    name: "Llama 3.2 3B Instruct (Free)",
    provider: "meta",
    description: "Small, fast Llama 3.2 3B on the free tier.",
    contextWindow: 131072,
    maxOutput: null,
    inputPrice: "0",
    outputPrice: "0",
    tags: ["free"],
    architecture: "text",
    tokenizer: "llama3",
  },
  {
    id: "mistralai/mistral-7b-instruct:free",
    name: "Mistral 7B Instruct (Free)",
    provider: "mistralai",
    description: "Mistral 7B instruct model on the free tier.",
    contextWindow: 32768,
    maxOutput: null,
    inputPrice: "0",
    outputPrice: "0",
    tags: ["free"],
    architecture: "text",
    tokenizer: "mistral",
  },
];

function mergeWithDefaults(models: OpenRouterModel[]): OpenRouterModel[] {
  // Live list wins — only backfill defaults whose id isn't present.
  const seen = new Set(models.map((m) => m.id));
  const extras = SAFE_DEFAULT_MODELS.filter((m) => !seen.has(m.id));
  return [...models, ...extras];
}

function loadCache(): OpenRouterModel[] {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed?.models)) return [];
    if (Date.now() - Number(parsed?.updatedAt || 0) > CACHE_TTL_MS) return [];
    return parsed.models as OpenRouterModel[];
  } catch {
    return [];
  }
}

function loadCacheUpdatedAt(): number | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    const updatedAt = Number(parsed?.updatedAt || 0);
    return Number.isFinite(updatedAt) && updatedAt > 0 ? updatedAt : null;
  } catch {
    return null;
  }
}

function saveCache(models: OpenRouterModel[]) {
  try {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ updatedAt: Date.now(), models })
    );
  } catch {
    // no-op
  }
}

export async function readModelsResponse(response: Response): Promise<{ models: OpenRouterModel[]; error?: string }> {
  const raw = await response.text();
  let parsed: unknown = {};

  try {
    parsed = raw ? JSON.parse(raw) : {};
  } catch {
    const looksLikeHtml = raw.trimStart().startsWith("<") || raw.includes("<!DOCTYPE");
    return {
      models: [],
      error: looksLikeHtml
        ? "Model API route not reachable. Check VITE_API_BASE_URL and backend deployment."
        : "Model API returned a non-JSON response.",
    };
  }

  const payload = parsed as { models?: unknown; error?: unknown };
  return {
    models: Array.isArray(payload?.models) ? (payload.models as OpenRouterModel[]) : [],
    error: typeof payload?.error === "string" ? payload.error : undefined,
  };
}

export function useOpenRouterModels() {
  const [models, setModels] = useState<OpenRouterModel[]>(() => loadCache());
  const [loading, setLoading] = useState(models.length === 0);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<number | null>(() => loadCacheUpdatedAt());
  const [status, setStatus] = useState<ModelsStatus>(models.length > 0 ? "ready" : "loading");

  const fetchModels = async (forceRefresh = false): Promise<void> => {
    if (forceRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      setError(null);
      const response = await apiFetch(forceRefresh ? "/api/openrouter/models?refresh=1" : "/api/openrouter/models");
      const { models: nextModels, error: responseError } = await readModelsResponse(response);
      if (!response.ok || responseError) {
        throw new Error(responseError || `Failed to load models (${response.status})`);
      }
      if (nextModels.length > 0) {
        setModels(nextModels);
        saveCache(nextModels);
        setLastUpdatedAt(Date.now());
        setStatus("ready");
      } else {
        // Server returned 200 with an empty list — fall back so picker isn't empty.
        setStatus("fallback");
      }
    } catch (err: any) {
      void appLog({
        event_type: "api_error",
        origin: "useOpenRouterModels.fetchModels",
        message: err?.message || "Failed to load OpenRouter models",
        details: { forceRefresh },
        severity: "warning",
      });
      setError(err?.message || "Failed to load models");
      setStatus(models.length > 0 ? "ready" : "fallback");
    } finally {
      if (forceRefresh) setRefreshing(false);
      else setLoading(false);
    }
  };

  useEffect(() => {
    void fetchModels(false);
    // One silent retry after 4s — handles cold-start and transient network blips
    // without making the user click refresh.
    const retryTimer = window.setTimeout(() => {
      if (models.length === 0) void fetchModels(false);
    }, 4000);
    return () => window.clearTimeout(retryTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const effectiveModels = useMemo(() => mergeWithDefaults(models), [models]);
  const freeModels = useMemo(
    () => effectiveModels.filter((m) => m.id.endsWith(":free")),
    [effectiveModels]
  );

  return {
    models: effectiveModels,
    freeModels,
    loading,
    refreshing,
    error,
    status,
    lastUpdatedAt,
    refreshModels: () => fetchModels(true),
  };
}
