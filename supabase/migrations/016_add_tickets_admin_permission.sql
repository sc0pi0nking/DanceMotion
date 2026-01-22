-- Add tickets_admin permission to support ticket management
-- Update admin roles to include ticket management capability

UPDATE public.admin_roles 
SET permissions = permissions || '"tickets_admin"'::jsonb
WHERE name = 'admin' AND NOT permissions @> '"tickets_admin"'::jsonb;

-- Optional: Add to event-manager role as well (they handle user requests)
UPDATE public.admin_roles 
SET permissions = permissions || '"tickets_admin"'::jsonb
WHERE name = 'event-manager' AND NOT permissions @> '"tickets_admin"'::jsonb;

-- Optional: Add to editor role
UPDATE public.admin_roles 
SET permissions = permissions || '"tickets_admin"'::jsonb
WHERE name = 'editor' AND NOT permissions @> '"tickets_admin"'::jsonb;
