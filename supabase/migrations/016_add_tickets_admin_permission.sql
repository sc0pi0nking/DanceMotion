-- Add tickets_admin permission to support ticket management
-- Update admin roles to include ticket management capability

UPDATE public.admin_roles 
SET permissions = array_append(permissions, 'tickets_admin')
WHERE name = 'admin' AND NOT permissions @> '["tickets_admin"]';

-- Optional: Add to event-manager role as well (they handle user requests)
UPDATE public.admin_roles 
SET permissions = array_append(permissions, 'tickets_admin')
WHERE name = 'event-manager' AND NOT permissions @> '["tickets_admin"]';

-- Optional: Add to editor role
UPDATE public.admin_roles 
SET permissions = array_append(permissions, 'tickets_admin')
WHERE name = 'editor' AND NOT permissions @> '["tickets_admin"]';
