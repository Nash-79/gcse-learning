INSERT INTO public.user_roles (user_id, role)
SELECT 'c3bc4c90-c91f-4669-a30f-77c8a4d54cef', 'admin'
WHERE EXISTS (
  SELECT 1
  FROM auth.users
  WHERE id = 'c3bc4c90-c91f-4669-a30f-77c8a4d54cef'
);
