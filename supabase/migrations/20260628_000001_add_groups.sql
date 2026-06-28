-- =====================================================
-- Migration: Groups (Tanzgruppen aus der Datenbank)
-- Sprint 2 / Feature 1 — ersetzt hardcoded lib/site-data.ts
-- =====================================================

-- Geteilte updated_at-Triggerfunktion (idempotent, existiert ab 003)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 1. Tabelle
CREATE TABLE IF NOT EXISTS public.groups (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        TEXT NOT NULL UNIQUE,
  name        TEXT NOT NULL,
  short_desc  TEXT,
  logo_url    TEXT,
  color       TEXT DEFAULT '#2EC4C6',
  sort_order  INT DEFAULT 0,
  is_active   BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT groups_color_hex CHECK (color ~ '^#[0-9A-Fa-f]{6}$')
);

-- 2. Indizes
CREATE INDEX IF NOT EXISTS idx_groups_sort ON public.groups(is_active DESC, sort_order ASC);

-- 3. RLS
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view active groups" ON public.groups;
CREATE POLICY "Anyone can view active groups" ON public.groups
  FOR SELECT
  USING (is_active = true OR auth.jwt() ->> 'role' = 'authenticated');

DROP POLICY IF EXISTS "Authenticated can insert groups" ON public.groups;
CREATE POLICY "Authenticated can insert groups" ON public.groups
  FOR INSERT
  WITH CHECK (auth.jwt() ->> 'role' = 'authenticated');

DROP POLICY IF EXISTS "Authenticated can update groups" ON public.groups;
CREATE POLICY "Authenticated can update groups" ON public.groups
  FOR UPDATE
  USING (auth.jwt() ->> 'role' = 'authenticated');

DROP POLICY IF EXISTS "Authenticated can delete groups" ON public.groups;
CREATE POLICY "Authenticated can delete groups" ON public.groups
  FOR DELETE
  USING (auth.jwt() ->> 'role' = 'authenticated');

-- 4. updated_at-Trigger
DROP TRIGGER IF EXISTS update_groups_updated_at ON public.groups;
CREATE TRIGGER update_groups_updated_at
  BEFORE UPDATE ON public.groups
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 5. Seed: die 3 bestehenden Gruppen (aus lib/site-data.ts migriert)
INSERT INTO public.groups (slug, name, short_desc, logo_url, sort_order) VALUES
  ('little-joys', 'Little Joys', 'Tanzen für die Kleinsten — spielerisch und mit viel Freude.', '/logos/littlejoys.png', 1),
  ('smileys',     'Smileys',     'Fröhliche Gruppe für Kinder mit Bewegung und Musik.',        '/logos/smileys.png',    2),
  ('emotion',     'Emotion',     'Ausdrucksstarker Tanz für Jugendliche und Erwachsene.',      '/logos/emotion.png',    3)
ON CONFLICT (slug) DO NOTHING;

-- 6. Kommentare
COMMENT ON TABLE  public.groups            IS 'Tanzgruppen (ersetzt hardcoded lib/site-data.ts) — dynamische Route /gruppen/[slug]';
COMMENT ON COLUMN public.groups.slug       IS 'URL-Segment, eindeutig — Basis für /gruppen/[slug] und iCal-Feed';
COMMENT ON COLUMN public.groups.color      IS 'Markierungsfarbe (Hex), Default = Markenfarbe #2EC4C6';
COMMENT ON COLUMN public.groups.sort_order IS 'Anzeigereihenfolge (kleiner = weiter vorne)';
COMMENT ON COLUMN public.groups.is_active  IS 'Nur aktive Gruppen erscheinen öffentlich';
