-- =====================================================
-- Migration: Document Versioning System
-- Beschreibung: Ermöglicht Versionierung von Dokumenten
--               Alte Versionen können deaktiviert werden,
--               ohne sie zu löschen
-- =====================================================

-- 1. is_active Spalte zur documents Tabelle hinzufügen
ALTER TABLE IF EXISTS public.documents
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- 2. Index für schnellere Abfragen von aktiven Dokumenten
CREATE INDEX IF NOT EXISTS idx_documents_is_active ON public.documents(is_active);

-- 3. Updated_at Trigger (falls nicht schon vorhanden)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger für documents (falls nicht schon vorhanden)
DROP TRIGGER IF EXISTS update_documents_updated_at ON public.documents;
CREATE TRIGGER update_documents_updated_at
BEFORE UPDATE ON public.documents
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- 4. Alte Policies dropppen und neu erstellen
DROP POLICY IF EXISTS "Public Read Access" ON public.documents;
DROP POLICY IF EXISTS "Admin Insert Access" ON public.documents;
DROP POLICY IF EXISTS "Admin Update Access" ON public.documents;
DROP POLICY IF EXISTS "Admin Delete Access" ON public.documents;

-- 5. Neue Policies mit is_active Kontrolle
-- Public: Nur aktive Dokumente sehen
CREATE POLICY "Public Read Access"
ON public.documents FOR SELECT
USING (is_active = true);

-- Admins: Alles sehen (auch inaktive)
CREATE POLICY "Admin Insert Access"
ON public.documents FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admin Update Access"
ON public.documents FOR UPDATE
USING (true);

CREATE POLICY "Admin Delete Access"
ON public.documents FOR DELETE
USING (true);
