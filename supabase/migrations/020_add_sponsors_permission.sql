-- Migration: Add sponsors permission to admin roles
-- This migration adds the 'sponsors' permission to appropriate admin roles

-- Update admin role to include sponsors permission
UPDATE public.admin_roles
SET permissions = COALESCE(permissions, '[]'::jsonb) || '["sponsors"]'::jsonb
WHERE name = 'admin' AND NOT permissions @> '["sponsors"]'::jsonb;

-- Update manager role to include sponsors permission
UPDATE public.admin_roles
SET permissions = COALESCE(permissions, '[]'::jsonb) || '["sponsors"]'::jsonb
WHERE name = 'manager' AND NOT permissions @> '["sponsors"]'::jsonb;

-- Update any other manager-like roles
UPDATE public.admin_roles
SET permissions = COALESCE(permissions, '[]'::jsonb) || '["sponsors"]'::jsonb
WHERE (name LIKE '%manager%' OR name LIKE '%admin%') 
  AND NOT permissions @> '["sponsors"]'::jsonb;
