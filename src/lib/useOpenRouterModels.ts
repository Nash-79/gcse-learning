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
}

const CACHE_KEY = "pylearn-openrouter-models-cache";
const CACHE_TTL_MS = 6 * 60 * 60 * 1000;

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

export function useOpenRouterModels() {
  const [models, setModels] = useState<OpenRouterModel[]>(() => loadCache());
  const [loading, setLoading] = useState(models.length === 0);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<number | null>(() => loadCacheUpdatedAt());

  const fetchModels = async (forceRefresh = false): Promise<void> => {
    if (forceRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      setError(null);
      const response = await apiFetch(forceRefresh ? "/api/openrouter/models?refresh=1" : "/api/openrouter/models");
      const data = await response.json();
      if (!response.ok || data?.error) {
        throw new Error(data?.error || "Failed to load models");
      }
      const nextModels = Array.isArray(data?.models) ? data.models as OpenRouterModel[] : [];
      if (nextModels.length > 0) {
        setModels(nextModels);
        saveCache(nextModels);
        setLastUpdatedAt(Date.now());
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
    } finally {
      if (forceRefresh) setRefreshing(false);
      else setLoading(false);
    }
  };

  useEffect(() => {
    void fetchModels(false);
  }, []);

  const freeModels = useMemo(
    () => models.filter((m) => m.id.endsWith(":free")),
    [models]
  );

  return { models, freeModels, loading, refreshing, error, lastUpdatedAt, refreshModels: () => fetchModels(true) };
}
