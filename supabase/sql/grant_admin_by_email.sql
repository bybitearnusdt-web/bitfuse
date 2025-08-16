-- Grant admin role to a user by email.
-- Usage:
-- 1) Register the user through your app (or create in Supabase Auth).
-- 2) Replace the email below with that user's email.
-- 3) Run this script in the Supabase SQL Editor.

DO $$
DECLARE
  v_user_id uuid;
BEGIN
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = 'REPLACE_WITH_YOUR_ADMIN_EMAIL';

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'No auth user found with that email';
  END IF;

  INSERT INTO admin_roles (user_id, role)
  VALUES (v_user_id, 'admin')
  ON CONFLICT (user_id) DO UPDATE SET role = EXCLUDED.role;
END $$;
