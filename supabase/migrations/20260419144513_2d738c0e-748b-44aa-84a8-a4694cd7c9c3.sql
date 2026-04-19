-- 1. user_roles: add restrictive policy blocking UPDATE entirely
CREATE POLICY "Block all updates to user_roles"
  ON public.user_roles
  AS RESTRICTIVE
  FOR UPDATE
  TO public
  USING (false);

-- 2. app_logs: replace anon insert policy with one that forbids email/user_id spoofing
DROP POLICY IF EXISTS "Anyone can insert error logs" ON public.app_logs;

CREATE POLICY "Anonymous can insert error logs without identity"
  ON public.app_logs
  FOR INSERT
  TO anon
  WITH CHECK (
    event_type = 'client_error'
    AND user_id IS NULL
    AND user_email IS NULL
  );

-- 3. user_feedback: replace permissive insert with role-split policies
DROP POLICY IF EXISTS "Anyone can submit feedback" ON public.user_feedback;

CREATE POLICY "Authenticated users submit own feedback"
  ON public.user_feedback
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND (user_email IS NULL OR user_email = (auth.jwt() ->> 'email'))
  );

CREATE POLICY "Anonymous can submit feedback without identity"
  ON public.user_feedback
  FOR INSERT
  TO anon
  WITH CHECK (
    user_id IS NULL
    AND user_email IS NULL
  );