-- Migration: Fix Sponsors RLS Policies for Admin Access
-- Allows any authenticated user to manage sponsors (will be restricted by app-level permissions)

-- Drop old restrictive policies
DROP POLICY IF EXISTS "Only authenticated users can insert sponsors" ON sponsors;
DROP POLICY IF EXISTS "Only creator or admin can update sponsors" ON sponsors;
DROP POLICY IF EXISTS "Only creator or admin can delete sponsors" ON sponsors;

-- Drop new policies if they exist (for re-running migration)
DROP POLICY IF EXISTS "Authenticated users can insert sponsors" ON sponsors;
DROP POLICY IF EXISTS "Authenticated users can update sponsors" ON sponsors;
DROP POLICY IF EXISTS "Authenticated users can delete sponsors" ON sponsors;

-- Create new policies that allow any authenticated user
-- (App-level permission checking handles the actual authorization)

-- INSERT: Any authenticated user can insert
CREATE POLICY "Authenticated users can insert sponsors" ON sponsors
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- UPDATE: Any authenticated user can update
CREATE POLICY "Authenticated users can update sponsors" ON sponsors
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- DELETE: Any authenticated user can delete
CREATE POLICY "Authenticated users can delete sponsors" ON sponsors
  FOR DELETE
  TO authenticated
  USING (true);

-- SELECT policy remains unchanged (public can see active, authenticated can see all)
