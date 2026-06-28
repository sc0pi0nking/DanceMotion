-- =====================================================
-- Migration: Site Settings
-- Sprint 2 — System-Settings aus content auslagern
-- =====================================================

-- Geteilte updated_at-Triggerfunktion (idempotent)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 1. Tabelle (Key-Value, JSONB)
CREATE TABLE IF NOT EXISTS public.site_settings (
  key        TEXT PRIMARY KEY,
  value      JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. RLS — Schreiben nur Admins; Lesen ebenfalls Admins
--    (Konfiguration kann sensibel sein; öffentliche Settings werden
--     serverseitig via Service-Role gelesen und gezielt durchgereicht.)
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated can read site settings" ON public.site_settings;
CREATE POLICY "Authenticated can read site settings" ON public.site_settings
  FOR SELECT
  USING (auth.jwt() ->> 'role' = 'authenticated');

DROP POLICY IF EXISTS "Authenticated can write site settings" ON public.site_settings;
CREATE POLICY "Authenticated can write site settings" ON public.site_settings
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'authenticated')
  WITH CHECK (auth.jwt() ->> 'role' = 'authenticated');

-- 3. updated_at-Trigger
DROP TRIGGER IF EXISTS update_site_settings_updated_at ON public.site_settings;
CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 4. Kommentare
COMMENT ON TABLE  public.site_settings       IS 'System-/Site-Einstellungen (Key-Value, JSONB) — löst content.section=settings ab';
COMMENT ON COLUMN public.site_settings.key   IS 'Eindeutiger Einstellungs-Schlüssel';
COMMENT ON COLUMN public.site_settings.value IS 'Wert als JSONB (beliebige Struktur)';

-- Hinweis: Datenmigration aus content (section = 'settings') entfällt im
-- frischen v2-Projekt. Sobald Altdaten vorliegen, separate Daten-Migration.
