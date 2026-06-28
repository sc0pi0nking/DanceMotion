-- =====================================================
-- Migration: Trial Bookings (Probestunden-Buchung)
-- Sprint 2 / Feature 2 — DSGVO: 90-Tage-Auto-Delete
-- =====================================================

-- Geteilte updated_at-Triggerfunktion (idempotent)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 1. Tabelle
CREATE TABLE IF NOT EXISTS public.trial_bookings (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name             TEXT NOT NULL,
  email            TEXT NOT NULL,
  phone            TEXT,
  group_slug       TEXT NOT NULL REFERENCES public.groups(slug) ON UPDATE CASCADE,
  preferred_date   DATE,
  message          TEXT,
  status           TEXT DEFAULT 'new' CHECK (status IN ('new', 'confirmed', 'rejected', 'completed')),
  notes            TEXT,
  consent_given_at TIMESTAMPTZ NOT NULL,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Indizes
CREATE INDEX IF NOT EXISTS idx_trial_bookings_status     ON public.trial_bookings(status);
CREATE INDEX IF NOT EXISTS idx_trial_bookings_created_at ON public.trial_bookings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_trial_bookings_group      ON public.trial_bookings(group_slug);

-- 3. RLS — öffentliches Formular darf einreichen, lesen nur Admins
ALTER TABLE public.trial_bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can submit trial bookings" ON public.trial_bookings;
CREATE POLICY "Public can submit trial bookings" ON public.trial_bookings
  FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated can read trial bookings" ON public.trial_bookings;
CREATE POLICY "Authenticated can read trial bookings" ON public.trial_bookings
  FOR SELECT
  USING (auth.jwt() ->> 'role' = 'authenticated');

DROP POLICY IF EXISTS "Authenticated can update trial bookings" ON public.trial_bookings;
CREATE POLICY "Authenticated can update trial bookings" ON public.trial_bookings
  FOR UPDATE
  USING (auth.jwt() ->> 'role' = 'authenticated');

DROP POLICY IF EXISTS "Authenticated can delete trial bookings" ON public.trial_bookings;
CREATE POLICY "Authenticated can delete trial bookings" ON public.trial_bookings
  FOR DELETE
  USING (auth.jwt() ->> 'role' = 'authenticated');

-- 4. updated_at-Trigger
DROP TRIGGER IF EXISTS update_trial_bookings_updated_at ON public.trial_bookings;
CREATE TRIGGER update_trial_bookings_updated_at
  BEFORE UPDATE ON public.trial_bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 5. DSGVO: Auto-Delete (analog event_requests, Migration 004)
CREATE OR REPLACE FUNCTION auto_delete_old_trial_bookings()
RETURNS void AS $$
BEGIN
  -- Bearbeitete Buchungen nach 90 Tagen löschen
  DELETE FROM public.trial_bookings
  WHERE status IN ('completed', 'rejected')
    AND updated_at < NOW() - INTERVAL '90 days';

  -- Unbearbeitete Buchungen nach 180 Tagen löschen
  DELETE FROM public.trial_bookings
  WHERE status IN ('new', 'confirmed')
    AND created_at < NOW() - INTERVAL '180 days';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger-basiertes Cleanup bei jedem INSERT (kein pg_cron nötig)
CREATE OR REPLACE FUNCTION cleanup_old_trial_bookings_trigger()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM auto_delete_old_trial_bookings();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_cleanup_old_trial_bookings ON public.trial_bookings;
CREATE TRIGGER trigger_cleanup_old_trial_bookings
  AFTER INSERT ON public.trial_bookings
  FOR EACH STATEMENT
  EXECUTE FUNCTION cleanup_old_trial_bookings_trigger();

-- 6. Kommentare
COMMENT ON TABLE  public.trial_bookings                  IS 'Probestunden-Buchungen (öffentliches Formular je Gruppe)';
COMMENT ON COLUMN public.trial_bookings.group_slug       IS 'Referenz auf groups.slug';
COMMENT ON COLUMN public.trial_bookings.consent_given_at IS 'DSGVO: Zeitpunkt der Einwilligungserklärung';
COMMENT ON FUNCTION auto_delete_old_trial_bookings       IS 'DSGVO: Löscht Buchungen nach 90 Tagen (completed/rejected) bzw. 180 Tagen (new/confirmed)';
