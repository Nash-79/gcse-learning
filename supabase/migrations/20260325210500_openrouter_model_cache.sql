CREATE TABLE IF NOT EXISTS public.openrouter_model_cache (
  cache_key TEXT PRIMARY KEY,
  models JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  source TEXT NOT NULL DEFAULT 'openrouter'
);

COMMENT ON TABLE public.openrouter_model_cache IS 'Server-side cached OpenRouter model catalog for resilient startup and reduced API calls.';
COMMENT ON COLUMN public.openrouter_model_cache.cache_key IS 'Catalog variant key, e.g. free_models or all_models.';
