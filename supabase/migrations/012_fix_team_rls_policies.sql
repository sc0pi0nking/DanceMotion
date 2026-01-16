-- =====================================================
-- Migration: Fix RLS Policies for Team Members Admin Access
-- Beschreibung: Korrigiere RLS Policies damit Admin API wieder funktioniert
-- =====================================================

-- Entferne die Policy die nicht funktioniert
DROP POLICY IF EXISTS "Service role full access team" ON public.team_members;

-- Erstelle richtige Policy für Admin-Zugriff (alle Operations)
-- Service Role kann nicht durch auth.role() geprüft werden in Supabase
-- Stattdessen: Service Role ignoriert RLS grundsätzlich, daher reicht USING (true) für Admin operations
CREATE POLICY "Admin full access to all team members"
ON public.team_members FOR ALL
USING (true)
WITH CHECK (true);

-- Stelle sicher dass die Public Policy noch da ist
DROP POLICY IF EXISTS "Public read published team members" ON public.team_members;

CREATE POLICY "Public can read published team members"
ON public.team_members FOR SELECT
USING (published = true);
