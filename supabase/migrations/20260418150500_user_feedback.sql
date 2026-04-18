-- User feedback table (popup feedback + admin review)
CREATE TABLE IF NOT EXISTS public.user_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  user_email text,
  page_path text NOT NULL,
  section_key text NOT NULL DEFAULT 'unknown',
  feedback_type text NOT NULL DEFAULT 'general',
  status text NOT NULL DEFAULT 'new',
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS user_feedback_created_at_idx ON public.user_feedback (created_at DESC);
CREATE INDEX IF NOT EXISTS user_feedback_page_path_idx ON public.user_feedback (page_path);
CREATE INDEX IF NOT EXISTS user_feedback_section_key_idx ON public.user_feedback (section_key);

ALTER TABLE public.user_feedback ENABLE ROW LEVEL SECURITY;

-- Any authenticated user can submit feedback tied to their own user_id
CREATE POLICY "Authenticated users can insert feedback"
  ON public.user_feedback FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Allow anon feedback submissions (no user_id)
CREATE POLICY "Anonymous users can insert feedback"
  ON public.user_feedback FOR INSERT TO anon
  WITH CHECK (user_id IS NULL);

-- Only admins can read feedback
CREATE POLICY "Admins can read all feedback"
  ON public.user_feedback FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
