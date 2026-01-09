-- =====================================================
-- Migration: Team System
-- Beschreibung: Team-Mitglieder mit Bildern und Social Links
-- =====================================================

-- 1. Team Members Tabelle erstellen
CREATE TABLE IF NOT EXISTS public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT NOT NULL, -- z.B. 'Trainerin Hip-Hop', 'Geschäftsführung', etc.
  bio TEXT, -- Kurze Beschreibung
  image_url TEXT, -- URL zum Bild in Supabase Storage
  order_index INTEGER NOT NULL DEFAULT 0,
  social_links JSONB DEFAULT '{}'::jsonb, -- { "instagram": "...", "facebook": "...", "email": "..." }
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. RLS aktivieren
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- 3. Policies: Public kann nur veröffentlichte Team-Mitglieder lesen
CREATE POLICY "Public can read published team members"
ON public.team_members FOR SELECT
USING (published = true);

-- 4. Policies: Admins können alles
CREATE POLICY "Admins can do everything with team members"
ON public.team_members FOR ALL
USING (true);

-- 5. Indizes für Performance
CREATE INDEX IF NOT EXISTS idx_team_order ON public.team_members(order_index);
CREATE INDEX IF NOT EXISTS idx_team_published ON public.team_members(published);

-- 6. Updated_at Trigger
CREATE TRIGGER update_team_members_updated_at
BEFORE UPDATE ON public.team_members
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- 7. Storage Bucket für Team-Bilder (falls noch nicht vorhanden)
-- WICHTIG: Dies muss im Supabase Dashboard ausgeführt werden!
-- Storage > Create Bucket > Name: "team-images" > Public: true

-- 8. Beispiel Team-Mitglieder einfügen
INSERT INTO public.team_members (name, role, bio, order_index, social_links, published) VALUES
  (
    'Sarah Müller',
    'Trainerin Hip-Hop & Jazz',
    'Mit über 10 Jahren Tanzerfahrung bringt Sarah Energie und Leidenschaft in jede Stunde. Sie liebt es, ihre Schüler zu motivieren und gemeinsam mit ihnen zu wachsen.',
    1,
    '{"instagram": "sarah_dancemotion", "email": "sarah@dancemotion-eschweiler.de"}'::jsonb,
    true
  ),
  (
    'Michael Schmidt',
    'Geschäftsführung & Choreograph',
    'Michael ist der kreative Kopf hinter DanceMotion. Seine Choreographien begeistern regelmäßig bei Shows und Events.',
    2,
    '{"facebook": "michael.schmidt.dm", "email": "michael@dancemotion-eschweiler.de"}'::jsonb,
    true
  ),
  (
    'Lisa Wagner',
    'Trainerin Ballett & Modern Dance',
    'Lisa hat klassisches Ballett studiert und gibt ihre Leidenschaft für elegante Bewegungen mit viel Geduld an ihre Schüler weiter.',
    3,
    '{"instagram": "lisa_ballett", "email": "lisa@dancemotion-eschweiler.de"}'::jsonb,
    true
  ),
  (
    'Tom Becker',
    'Trainer Breakdance & Urban Styles',
    'Tom ist seit seiner Jugend in der Breakdance-Szene aktiv. Er bringt Street-Dance-Kultur authentisch ins Studio.',
    4,
    '{"instagram": "tom_breaker", "facebook": "tom.becker.dance"}'::jsonb,
    true
  )
ON CONFLICT DO NOTHING;

-- 9. Kommentare für Dokumentation
COMMENT ON TABLE public.team_members IS 'Team System: Mitarbeiter/Trainer mit Bildern und Social Media Links';
COMMENT ON COLUMN public.team_members.role IS 'Rolle/Position im Team (z.B. Trainerin Hip-Hop, Geschäftsführung)';
COMMENT ON COLUMN public.team_members.social_links IS 'JSONB mit Social Media Links: instagram, facebook, email, etc.';
COMMENT ON COLUMN public.team_members.image_url IS 'URL zum Profilbild in Supabase Storage (team-images bucket)';
COMMENT ON COLUMN public.team_members.order_index IS 'Sortierung auf der Team-Seite (niedrigere Zahlen zuerst)';
