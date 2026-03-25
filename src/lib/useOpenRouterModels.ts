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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        setLoading(true);
        const response = await apiFetch("/api/openrouter/models");
        const data = await response.json();
        if (!response.ok || data?.error) {
          throw new Error(data?.error || "Failed to load models");
        }
        const nextModels = Array.isArray(data?.models) ? data.models as OpenRouterModel[] : [];
        if (!cancelled && nextModels.length > 0) {
          setModels(nextModels);
          saveCache(nextModels);
        }
      } catch (err: any) {
        if (!cancelled) {
          void appLog({
            event_type: "api_error",
            origin: "useOpenRouterModels.run",
            message: err?.message || "Failed to load OpenRouter models",
            severity: "warning",
          });
          setError(err?.message || "Failed to load models");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };
    void run();
    return () => {
      cancelled = true;
    };
  }, []);

  const freeModels = useMemo(
    () => models.filter((m) => m.id.endsWith(":free")),
    [models]
  );

  return { models, freeModels, loading, error };
}
