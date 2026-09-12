-- Migration: Drop dead column admin_users.password_hash
--
-- Authentication runs entirely through Supabase Auth (auth.users). The
-- password_hash column on admin_users is never read or written by the app and
-- was NOT NULL, forcing dummy values on insert. Remove it.

ALTER TABLE public.admin_users
  DROP COLUMN IF EXISTS password_hash;
