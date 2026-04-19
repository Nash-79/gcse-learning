-- Extend anonymous insert policy on app_logs to also allow
-- ai_suggestion_click events without identity, in addition to client_error.
DROP POLICY IF EXISTS "Anonymous can insert error logs without identity" ON public.app_logs;

CREATE POLICY "Anonymous can insert error and suggestion logs without identity"
ON public.app_logs
FOR INSERT
TO anon
WITH CHECK (
  event_type IN ('client_error', 'ai_suggestion_click')
  AND user_id IS NULL
  AND user_email IS NULL
);