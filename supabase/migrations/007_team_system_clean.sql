-- =====================================================
-- Migration: Team System (Fresh Start)
-- Beschreibung: Komplett sauberes Team-Member System mit Bildern und Social Links
-- =====================================================

-- 1. Team Members Tabelle erstellen
CREATE TABLE IF NOT EXISTS public.team_members (
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

-- 2. RLS aktivieren
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- 3. Existierende Policies löschen (falls vorhanden)
DROP POLICY IF EXISTS "Public can read published team members" ON public.team_members;
DROP POLICY IF EXISTS "Authenticated read all team members" ON public.team_members;
DROP POLICY IF EXISTS "Authenticated insert team members" ON public.team_members;
DROP POLICY IF EXISTS "Authenticated update team members" ON public.team_members;
DROP POLICY IF EXISTS "Authenticated delete team members" ON public.team_members;
DROP POLICY IF EXISTS "Admin full access to all team members" ON public.team_members;
DROP POLICY IF EXISTS "Admins can do everything with team members" ON public.team_members;
DROP POLICY IF EXISTS "Public read published team members" ON public.team_members;
DROP POLICY IF EXISTS "Service role full access team" ON public.team_members;

-- 4. Neue saubere RLS Policies
-- Policy 1: Jeder kann veröffentlichte Team-Mitglieder lesen (PUBLIC)
CREATE POLICY "team_public_read"
ON public.team_members FOR SELECT
USING (published = true);

-- Policy 2: Admin/Authenticated können alle Mitglieder lesen (auch unveröffentlichte)
CREATE POLICY "team_admin_read"
ON public.team_members FOR SELECT
USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- Policy 3: Admin können einfügen
CREATE POLICY "team_admin_insert"
ON public.team_members FOR INSERT
WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- Policy 4: Admin können aktualisieren
CREATE POLICY "team_admin_update"
ON public.team_members FOR UPDATE
USING (auth.role() = 'authenticated' OR auth.role() = 'service_role')
WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- Policy 5: Admin können löschen
CREATE POLICY "team_admin_delete"
ON public.team_members FOR DELETE
USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- 5. Indizes für Performance
CREATE INDEX IF NOT EXISTS idx_team_order ON public.team_members(order_index);
CREATE INDEX IF NOT EXISTS idx_team_published ON public.team_members(published);

-- 6. Trigger für updated_at
DROP TRIGGER IF EXISTS update_team_members_updated_at ON public.team_members;
CREATE TRIGGER update_team_members_updated_at
BEFORE UPDATE ON public.team_members
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- 7. Beispiel-Daten einfügen
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
  )
ON CONFLICT DO NOTHING;

-- 8. Dokumentation
COMMENT ON TABLE public.team_members IS 'Team-Mitglieder mit Bildern und Social Media Links';
COMMENT ON COLUMN public.team_members.order_index IS 'Sortierungsindex (niedrigere Zahlen zuerst)';
COMMENT ON COLUMN public.team_members.social_links IS 'JSONB mit {instagram, facebook, email, etc.}';
COMMENT ON COLUMN public.team_members.published IS 'true = öffentlich sichtbar auf der Website';
