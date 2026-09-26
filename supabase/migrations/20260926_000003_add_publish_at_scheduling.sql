-- Geplantes Veröffentlichen für Events (Termine) und Galerie.
-- publish_at = Zeitpunkt ab dem der Eintrag öffentlich sichtbar wird.
-- NULL = sofort sichtbar (sofern is_published = true).

ALTER TABLE events  ADD COLUMN IF NOT EXISTS publish_at TIMESTAMPTZ;
ALTER TABLE gallery ADD COLUMN IF NOT EXISTS publish_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_events_publish_at  ON events  (publish_at);
CREATE INDEX IF NOT EXISTS idx_gallery_publish_at ON gallery (publish_at);

-- Öffentliche RLS-Policies um den Zeitplan-Check erweitern.
-- (Policy-Namen entsprechen dem Stand aus Migration 026.)

DROP POLICY IF EXISTS "Public read published events" ON events;
CREATE POLICY "Public read published events"
ON events FOR SELECT
TO anon, authenticated
USING (is_published = true AND (publish_at IS NULL OR publish_at <= now()));

DROP POLICY IF EXISTS "Public read published gallery" ON gallery;
CREATE POLICY "Public read published gallery"
ON gallery FOR SELECT
TO anon, authenticated
USING (is_published = true AND (publish_at IS NULL OR publish_at <= now()));
