-- Migration: Convert event_requests.assigned_to from TEXT to UUID + add FK
--
-- assigned_to was stored as TEXT and had no referential integrity. It should
-- reference admin_users(id) (UUID). This migration cleans dirty data, converts
-- the column type, and adds a foreign key with ON DELETE SET NULL.

-- 1. Null-out values that are not a valid UUID string (text comparison).
UPDATE public.event_requests
SET assigned_to = NULL
WHERE assigned_to IS NOT NULL
  AND assigned_to !~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';

-- 2. Convert column type TEXT -> UUID (rebuilds the dependent index automatically).
ALTER TABLE public.event_requests
  ALTER COLUMN assigned_to TYPE UUID USING assigned_to::uuid;

-- 3. Null-out orphaned references that don't point to an existing admin user.
UPDATE public.event_requests er
SET assigned_to = NULL
WHERE er.assigned_to IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM public.admin_users u WHERE u.id = er.assigned_to
  );

-- 4. Add the foreign key (idempotent).
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'event_requests_assigned_to_fkey'
  ) THEN
    ALTER TABLE public.event_requests
      ADD CONSTRAINT event_requests_assigned_to_fkey
      FOREIGN KEY (assigned_to) REFERENCES public.admin_users(id) ON DELETE SET NULL;
  END IF;
END $$;
