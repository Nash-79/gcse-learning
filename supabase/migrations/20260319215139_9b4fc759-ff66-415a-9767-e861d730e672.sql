
-- Admin roles enum and table
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles (avoids recursive RLS)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Only admins can read user_roles
CREATE POLICY "Admins can read all roles"
  ON public.user_roles FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- App logs table
CREATE TABLE public.app_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  user_email text,
  event_type text NOT NULL,
  origin text NOT NULL,
  message text NOT NULL,
  details jsonb DEFAULT '{}'::jsonb,
  error_stack text,
  severity text NOT NULL DEFAULT 'info',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.app_logs ENABLE ROW LEVEL SECURITY;

-- Any authenticated user can insert logs
CREATE POLICY "Authenticated users can insert logs"
  ON public.app_logs FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Only admins can read all logs
CREATE POLICY "Admins can read all logs"
  ON public.app_logs FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Allow anon inserts for error logging before auth
CREATE POLICY "Anyone can insert error logs"
  ON public.app_logs FOR INSERT TO anon
  WITH CHECK (event_type = 'client_error');
