-- Migration: Force Password Change on First Login
-- Adds force_password_change column to admin_users table
-- When true, user must change password after login

-- 1. Add column to admin_users
ALTER TABLE public.admin_users 
  ADD COLUMN IF NOT EXISTS force_password_change BOOLEAN DEFAULT true;

-- 2. Set existing users to NOT require password change (they already have valid passwords)
UPDATE public.admin_users 
SET force_password_change = false 
WHERE force_password_change IS NULL OR force_password_change = true;

-- 3. Update the view to include force_password_change
CREATE OR REPLACE VIEW public.admin_users_with_roles AS
SELECT 
  u.id,
  u.email,
  u.name,
  u.avatar_url,
  u.phone,
  u.is_active,
  u.last_login,
  u.created_at,
  u.updated_at,
  u.force_password_change,
  r.id as role_id,
  r.name as role_name,
  r.description as role_description,
  r.permissions
FROM public.admin_users u
LEFT JOIN public.admin_roles r ON u.role_id = r.id;

-- 4. Comment for documentation
COMMENT ON COLUMN public.admin_users.force_password_change IS 'If true, user must change password on next login';
