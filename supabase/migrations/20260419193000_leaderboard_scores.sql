CREATE TABLE public.leaderboard_scores (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL DEFAULT 'Student',
  total_xp INTEGER NOT NULL DEFAULT 0 CHECK (total_xp >= 0),
  level INTEGER NOT NULL DEFAULT 1 CHECK (level >= 1),
  current_streak INTEGER NOT NULL DEFAULT 0 CHECK (current_streak >= 0),
  longest_streak INTEGER NOT NULL DEFAULT 0 CHECK (longest_streak >= 0),
  completed_topics INTEGER NOT NULL DEFAULT 0 CHECK (completed_topics >= 0),
  total_topics INTEGER NOT NULL DEFAULT 0 CHECK (total_topics >= 0),
  quizzes_passed INTEGER NOT NULL DEFAULT 0 CHECK (quizzes_passed >= 0),
  bronze_topics INTEGER NOT NULL DEFAULT 0 CHECK (bronze_topics >= 0),
  silver_topics INTEGER NOT NULL DEFAULT 0 CHECK (silver_topics >= 0),
  gold_topics INTEGER NOT NULL DEFAULT 0 CHECK (gold_topics >= 0),
  overall_best_score INTEGER,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.leaderboard_scores ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.sync_leaderboard_score_metadata()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  profile_display_name TEXT;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  NEW.user_id := auth.uid();

  SELECT NULLIF(BTRIM(display_name), '')
  INTO profile_display_name
  FROM public.profiles
  WHERE id = auth.uid();

  NEW.display_name := COALESCE(profile_display_name, 'Student');
  NEW.updated_at := now();

  RETURN NEW;
END;
$$;

CREATE TRIGGER sync_leaderboard_score_metadata
  BEFORE INSERT OR UPDATE ON public.leaderboard_scores
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_leaderboard_score_metadata();

CREATE POLICY "Anyone can read leaderboard scores"
  ON public.leaderboard_scores
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Users can insert own leaderboard score"
  ON public.leaderboard_scores
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own leaderboard score"
  ON public.leaderboard_scores
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX leaderboard_scores_total_xp_idx
  ON public.leaderboard_scores (total_xp DESC, completed_topics DESC, gold_topics DESC, updated_at ASC);
