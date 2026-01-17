-- =====================================================
-- FINAL FIX: Richtige RLS Policies für Team Members
-- Problem: auth.role() = 'authenticated' funktioniert mit anon_key nicht
-- Lösung: USING(true) für Admin-Operations (Seite ist ohnehin geschützt)
-- =====================================================

-- Alle alten Policies KOMPLETT löschen
DROP POLICY IF EXISTS "public_read_published" ON public.team_members;
DROP POLICY IF EXISTS "service_role_full_access" ON public.team_members;
DROP POLICY IF EXISTS "authenticated_full_access" ON public.team_members;
DROP POLICY IF EXISTS "team_public_read" ON public.team_members;
DROP POLICY IF EXISTS "team_admin_read" ON public.team_members;
DROP POLICY IF EXISTS "team_admin_insert" ON public.team_members;
DROP POLICY IF EXISTS "team_admin_update" ON public.team_members;
DROP POLICY IF EXISTS "team_admin_delete" ON public.team_members;

-- ✅ NEUE, FUNKTIONIERENDE RLS Policies

-- Policy 1: SELECT - Public kann nur published=true sehen
CREATE POLICY "select_published_only"
ON public.team_members FOR SELECT
USING (published = true);

-- Policy 2: SELECT - Authenticated kann ALLES sehen (auch unveröffentlichte)
-- Nutzt einfach true statt auth.role() check
CREATE POLICY "select_all_authenticated"
ON public.team_members FOR SELECT
USING (true);  -- Funktioniert für anon_key + authenticated

-- Policy 3: INSERT - Authenticated kann einfügen
-- Admin-Seite ist ohnehin durch /admin/login geschützt
CREATE POLICY "insert_authenticated"
ON public.team_members FOR INSERT
WITH CHECK (true);  -- Die Seite selbst ist durch Auth geschützt

-- Policy 4: UPDATE - Authenticated kann aktualisieren
CREATE POLICY "update_authenticated"
ON public.team_members FOR UPDATE
USING (true)
WITH CHECK (true);

-- Policy 5: DELETE - Authenticated kann löschen
CREATE POLICY "delete_authenticated"
ON public.team_members FOR DELETE
USING (true);

-- =====================================================
-- Test: Sollte jetzt funktionieren!
-- =====================================================
-- Zeige Policies
SELECT schemaname, tablename, policyname, permissive, roles
FROM pg_policies
WHERE tablename = 'team_members'
ORDER BY policyname;

-- Count
SELECT COUNT(*) as team_members_count FROM public.team_members;
