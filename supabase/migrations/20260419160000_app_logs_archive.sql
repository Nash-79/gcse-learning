-- Adds archive support to app_logs: an archived_at timestamp + an admin UPDATE
-- policy that only permits writes to that single column (enforced column-wise
-- via a trigger that rejects UPDATE statements which touch any other column).

ALTER TABLE public.app_logs
  ADD COLUMN IF NOT EXISTS archived_at timestamptz;

CREATE INDEX IF NOT EXISTS app_logs_archived_at_idx
  ON public.app_logs (archived_at);

CREATE INDEX IF NOT EXISTS app_logs_severity_created_idx
  ON public.app_logs (severity, created_at DESC);

-- Trigger enforces that only archived_at can change via UPDATE. Any other
-- column diff raises a plain SQL error (RLS would allow row-level updates but
-- we want column-level safety here).
CREATE OR REPLACE FUNCTION public.enforce_app_log_archive_only_updates()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.id IS DISTINCT FROM OLD.id
     OR NEW.user_id IS DISTINCT FROM OLD.user_id
     OR NEW.user_email IS DISTINCT FROM OLD.user_email
     OR NEW.event_type IS DISTINCT FROM OLD.event_type
     OR NEW.origin IS DISTINCT FROM OLD.origin
     OR NEW.message IS DISTINCT FROM OLD.message
     OR NEW.details IS DISTINCT FROM OLD.details
     OR NEW.error_stack IS DISTINCT FROM OLD.error_stack
     OR NEW.severity IS DISTINCT FROM OLD.severity
     OR NEW.created_at IS DISTINCT FROM OLD.created_at
  THEN
    RAISE EXCEPTION 'app_logs updates may only modify archived_at';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS enforce_app_log_archive_only ON public.app_logs;

CREATE TRIGGER enforce_app_log_archive_only
  BEFORE UPDATE ON public.app_logs
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_app_log_archive_only_updates();

-- Row-level policy: only admins can update (and the trigger above column-locks
-- them to archived_at).
DROP POLICY IF EXISTS "Admins can archive logs" ON public.app_logs;
CREATE POLICY "Admins can archive logs"
  ON public.app_logs
  FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Retention: auto-purge archived rows older than 90 days. Invoke via a
-- scheduled job (pg_cron or an edge function) — this function is the target.
CREATE OR REPLACE FUNCTION public.purge_archived_app_logs()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  removed integer;
BEGIN
  DELETE FROM public.app_logs
  WHERE archived_at IS NOT NULL
    AND archived_at < now() - interval '90 days';
  GET DIAGNOSTICS removed = ROW_COUNT;
  RETURN removed;
END;
$$;
