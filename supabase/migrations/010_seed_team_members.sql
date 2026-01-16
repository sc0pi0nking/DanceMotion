-- =====================================================
-- Migration: Fix Team Members RLS & Seed Data
-- Beschreibung: Korrigiere RLS-Policies und stelle sicher dass Team-Daten vorhanden sind
-- =====================================================

-- 1. WICHTIG: Fix der RLS Policies - die alte "Admins can do everything" Policy war nicht sicher
-- Entferne die unsichere alte Policy
DROP POLICY IF EXISTS "Admins can do everything with team members" ON public.team_members;

-- 2. Neue sichere RLS Policies:
-- Public kann nur veröffentlichte Team-Mitglieder lesen
CREATE POLICY "Public read published team members"
ON public.team_members FOR SELECT
USING (published = true);

-- Service Role (Admin API) hat vollen Zugriff
-- Note: Service Role ignoriert ohnehin RLS, daher ist dies mehr für Dokumentation
CREATE POLICY "Service role full access team"
ON public.team_members FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- 3. Stelle sicher, dass die Beispiel-Daten vorhanden sind
INSERT INTO public.team_members (id, name, role, bio, order_index, social_links, published)
VALUES
  (
    gen_random_uuid(),
    'Sarah Müller',
    'Trainerin Hip-Hop & Jazz',
    'Mit über 10 Jahren Tanzerfahrung bringt Sarah Energie und Leidenschaft in jede Stunde.',
    1,
    '{"instagram": "sarah_dancemotion", "email": "sarah@dancemotion-eschweiler.de"}'::jsonb,
    true
  ),
  (
    gen_random_uuid(),
    'Michael Schmidt',
    'Geschäftsführung & Choreograph',
    'Kreativer Kopf hinter DanceMotion mit begeisternden Choreographien.',
    2,
    '{"facebook": "michael.schmidt.dm", "email": "michael@dancemotion-eschweiler.de"}'::jsonb,
    true
  ),
  (
    gen_random_uuid(),
    'Lisa Wagner',
    'Trainerin Ballett & Modern Dance',
    'Klassisches Ballett mit viel Geduld und Leidenschaft.',
    3,
    '{"instagram": "lisa_ballett", "email": "lisa@dancemotion-eschweiler.de"}'::jsonb,
    true
  ),
  (
    gen_random_uuid(),
    'Tom Becker',
    'Trainer Breakdance & Urban Styles',
    'Authentischer Street-Dance aus der Breakdance-Szene.',
    4,
    '{"instagram": "tom_breaker", "facebook": "tom.becker.dance"}'::jsonb,
    true
  )
ON CONFLICT (id) DO NOTHING;
