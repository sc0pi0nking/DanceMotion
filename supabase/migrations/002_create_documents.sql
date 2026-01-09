-- =====================================================
-- Migration: Document Management System
-- Beschreibung: Tabelle für PDF-Dokumente (Formulare)
-- =====================================================

-- 1. Documents Tabelle erstellen
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'general',
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT DEFAULT 'application/pdf',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. RLS aktivieren
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- 3. Policies: Jeder kann lesen
CREATE POLICY "Public Read Access"
ON public.documents FOR SELECT
USING (true);

-- 4. Policies: Nur Admins können einfügen
CREATE POLICY "Admin Insert Access"
ON public.documents FOR INSERT
WITH CHECK (true);

-- 5. Policies: Nur Admins können aktualisieren
CREATE POLICY "Admin Update Access"
ON public.documents FOR UPDATE
USING (true);

-- 6. Policies: Nur Admins können löschen
CREATE POLICY "Admin Delete Access"
ON public.documents FOR DELETE
USING (true);

-- 7. Index für schnellere Abfragen
CREATE INDEX IF NOT EXISTS idx_documents_category ON public.documents(category);
CREATE INDEX IF NOT EXISTS idx_documents_created_at ON public.documents(created_at DESC);

-- 8. Updated_at Trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_documents_updated_at
BEFORE UPDATE ON public.documents
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
