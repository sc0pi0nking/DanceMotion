-- =====================================================
-- Migration: Fix Team Members RLS for Authenticated Users
-- Beschreibung: Ermöglicht authentifizierten Usern, Team-Mitglieder zu bearbeiten
-- =====================================================

-- Alte Policies löschen
DROP POLICY IF EXISTS "Public can read published team members" ON public.team_members;
DROP POLICY IF EXISTS "Admins can do everything with team members" ON public.team_members;

-- Neue Policies:

-- 1. Jeder kann veröffentlichte Team-Mitglieder lesen
CREATE POLICY "Public read published team members"
ON public.team_members FOR SELECT
USING (published = true);

-- 2. Authentifizierte User können alle Team-Mitglieder sehen
CREATE POLICY "Authenticated read all team members"
ON public.team_members FOR SELECT
USING (auth.role() = 'authenticated');

-- 3. Authentifizierte User können Team-Mitglieder einfügen
CREATE POLICY "Authenticated insert team members"
ON public.team_members FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

-- 4. Authentifizierte User können Team-Mitglieder aktualisieren
CREATE POLICY "Authenticated update team members"
ON public.team_members FOR UPDATE
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- 5. Authentifizierte User können Team-Mitglieder löschen
CREATE POLICY "Authenticated delete team members"
ON public.team_members FOR DELETE
USING (auth.role() = 'authenticated');
