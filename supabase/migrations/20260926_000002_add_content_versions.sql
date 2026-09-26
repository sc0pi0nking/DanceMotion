-- Content-Versionierung: Historie früherer Content-Werte
-- Jede Änderung an `content` schreibt den VORHERIGEN Wert als Snapshot hierher.
-- Wiederherstellen setzt den aktuellen Wert zurück (und schnappschusst den dann-aktuellen Wert).

CREATE TABLE IF NOT EXISTS content_versions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_key TEXT NOT NULL,
  value       JSONB,
  section     TEXT,
  updated_by  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Schnellster Zugriff auf die Historie eines Keys (neueste zuerst)
CREATE INDEX IF NOT EXISTS idx_content_versions_key_created
  ON content_versions (content_key, created_at DESC);

-- RLS aktivieren. Zugriff läuft ausschließlich über den Service-Role-Key
-- (supabaseServer in den Admin-Routen), der RLS umgeht. Für anon/authenticated
-- gibt es KEINE Policy -> Default-Deny.
ALTER TABLE content_versions ENABLE ROW LEVEL SECURITY;
