-- =====================================================
-- Emergency Fix: Reset Team System & Apply Clean Migration
-- WARNUNG: Löscht ALLE Daten und erstellt neu!
-- =====================================================

-- 1. ALLES löschen was es gibt
DROP TABLE IF EXISTS public.team_members CASCADE;

-- 2. Trigger-Funktion muss existieren (sollte aus 001_create_tables existieren)
-- Falls nicht, hier erstellen:
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 3. Neue saubere Tabelle
CREATE TABLE public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  bio TEXT,
  image_url TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  social_links JSONB DEFAULT '{}'::jsonb,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. RLS aktivieren
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- 5. ALLE alten Policies löschen
DROP POLICY IF EXISTS "team_public_read" ON public.team_members;
DROP POLICY IF EXISTS "team_admin_read" ON public.team_members;
DROP POLICY IF EXISTS "team_admin_insert" ON public.team_members;
DROP POLICY IF EXISTS "team_admin_update" ON public.team_members;
DROP POLICY IF EXISTS "team_admin_delete" ON public.team_members;
DROP POLICY IF EXISTS "Public can read published team members" ON public.team_members;
DROP POLICY IF EXISTS "Authenticated read all team members" ON public.team_members;
DROP POLICY IF EXISTS "Authenticated insert team members" ON public.team_members;
DROP POLICY IF EXISTS "Authenticated update team members" ON public.team_members;
DROP POLICY IF EXISTS "Authenticated delete team members" ON public.team_members;
DROP POLICY IF EXISTS "Admin full access to all team members" ON public.team_members;
DROP POLICY IF EXISTS "Admins can do everything with team members" ON public.team_members;

-- 6. NEUE RLS Policies - SUPER SIMPEL
-- Policy 1: Jeder kann published=true sehen (PUBLIC)
CREATE POLICY "public_read_published"
ON public.team_members FOR SELECT
USING (published = true);

-- Policy 2: Service Role (API/Admin) kann ALLES sehen, einfügen, ändern, löschen
CREATE POLICY "service_role_full_access"
ON public.team_members FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- Policy 3: Authenticated Users können alles
CREATE POLICY "authenticated_full_access"
ON public.team_members FOR ALL
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- 7. Indizes
CREATE INDEX idx_team_order ON public.team_members(order_index);
CREATE INDEX idx_team_published ON public.team_members(published);

-- 8. Trigger für updated_at
CREATE TRIGGER update_team_members_updated_at
BEFORE UPDATE ON public.team_members
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- 9. Neue saubere Beispiel-Daten
INSERT INTO public.team_members (name, role, bio, order_index, social_links, published)
VALUES
  (
    'Sarah Müller',
    'Trainerin Hip-Hop & Jazz',
    'Mit über 10 Jahren Tanzerfahrung bringt Sarah Energie und Leidenschaft in jede Stunde.',
    1,
    '{"instagram": "sarah_dancemotion", "email": "sarah@dancemotion.de"}'::jsonb,
    true
  ),
  (
    'Michael Schmidt',
    'Geschäftsführung & Choreograph',
    'Kreativer Kopf hinter DanceMotion mit begeisternden Choreographien.',
    2,
    '{"facebook": "michael.dm", "email": "michael@dancemotion.de"}'::jsonb,
    true
  ),
  (
    'Lisa Wagner',
    'Trainerin Ballett & Modern Dance',
    'Hat klassisches Ballett studiert und gibt ihre Leidenschaft mit Geduld weiter.',
    3,
    '{"instagram": "lisa_ballett", "email": "lisa@dancemotion.de"}'::jsonb,
    true
  ),
  (
    'Tom Becker',
    'Trainer Breakdance & Urban Styles',
    'Seit seiner Jugend in der Breakdance-Szene aktiv.',
    4,
    '{"instagram": "tom_breaker", "facebook": "tom.becker.dance"}'::jsonb,
    true
  );

-- Test Query
SELECT COUNT(*) FROM public.team_members;
