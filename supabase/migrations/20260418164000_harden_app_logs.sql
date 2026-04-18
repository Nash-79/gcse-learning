CREATE OR REPLACE FUNCTION public.populate_app_log_actor()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    NEW.user_id := NULL;
    NEW.user_email := NULL;
  ELSE
    NEW.user_id := auth.uid();
    NEW.user_email := COALESCE(auth.jwt() ->> 'email', NULL);
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_app_log_actor ON public.app_logs;

CREATE TRIGGER set_app_log_actor
  BEFORE INSERT ON public.app_logs
  FOR EACH ROW
  EXECUTE FUNCTION public.populate_app_log_actor();

DROP POLICY IF EXISTS "Authenticated users can insert logs" ON public.app_logs;
CREATE POLICY "Authenticated users can insert logs"
  ON public.app_logs FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND user_email = COALESCE(auth.jwt() ->> 'email', NULL)
  );

DROP POLICY IF EXISTS "Anyone can insert error logs" ON public.app_logs;
CREATE POLICY "Anyone can insert error logs"
  ON public.app_logs FOR INSERT TO anon
  WITH CHECK (
    event_type = 'client_error'
    AND user_id IS NULL
    AND user_email IS NULL
  );
