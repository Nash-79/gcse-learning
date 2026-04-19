-- ============================================================
-- Migration A: openrouter_model_cache
-- ============================================================
CREATE TABLE IF NOT EXISTS public.openrouter_model_cache (
  cache_key TEXT PRIMARY KEY,
  models JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  source TEXT NOT NULL DEFAULT 'openrouter'
);

ALTER TABLE public.openrouter_model_cache ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read model cache" ON public.openrouter_model_cache;
CREATE POLICY "Anyone can read model cache"
  ON public.openrouter_model_cache
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- ============================================================
-- Migration B: harden_app_logs (server-side identity stamping)
-- ============================================================
CREATE OR REPLACE FUNCTION public.populate_app_log_actor()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  jwt_email TEXT;
BEGIN
  -- Only stamp identity for authenticated inserts; leave anon rows untouched
  IF auth.uid() IS NOT NULL THEN
    NEW.user_id := auth.uid();

    BEGIN
      jwt_email := NULLIF(BTRIM((auth.jwt() ->> 'email')), '');
    EXCEPTION WHEN OTHERS THEN
      jwt_email := NULL;
    END;

    IF jwt_email IS NOT NULL THEN
      NEW.user_email := jwt_email;
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_app_log_actor ON public.app_logs;
CREATE TRIGGER set_app_log_actor
  BEFORE INSERT ON public.app_logs
  FOR EACH ROW
  EXECUTE FUNCTION public.populate_app_log_actor();