-- =====================================================
-- Migration: Volltextsuche-Indizes (Sprint 4 / Feature 5)
-- Beschleunigt die seitenweite Suche über Events, Posts,
-- Gruppen und FAQs via Trigram-GIN-Indizes (ILIKE-fähig).
-- =====================================================

-- Trigram-Erweiterung für schnelle Teilstring-/ILIKE-Suche
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Events: Titel, Ort, Stadt, Notiz
CREATE INDEX IF NOT EXISTS idx_events_search_trgm
  ON public.events
  USING GIN (
    (
      coalesce(title, '') || ' ' ||
      coalesce(location, '') || ' ' ||
      coalesce(city, '') || ' ' ||
      coalesce(note, '')
    ) gin_trgm_ops
  );

-- Posts: Titel + Inhalt
CREATE INDEX IF NOT EXISTS idx_posts_search_trgm
  ON public.posts
  USING GIN (
    (coalesce(title, '') || ' ' || coalesce(content, '')) gin_trgm_ops
  );

-- Gruppen: Name + Kurzbeschreibung
CREATE INDEX IF NOT EXISTS idx_groups_search_trgm
  ON public.groups
  USING GIN (
    (coalesce(name, '') || ' ' || coalesce(short_desc, '')) gin_trgm_ops
  );

-- FAQs: Frage + Antwort
CREATE INDEX IF NOT EXISTS idx_faqs_search_trgm
  ON public.faqs
  USING GIN (
    (coalesce(question, '') || ' ' || coalesce(answer, '')) gin_trgm_ops
  );

COMMENT ON EXTENSION pg_trgm IS 'Trigram-Matching für die seitenweite Volltextsuche (/api/search)';
