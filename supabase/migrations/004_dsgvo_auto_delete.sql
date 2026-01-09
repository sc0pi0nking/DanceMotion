-- =====================================================
-- Migration: DSGVO Auto-Delete für Event-Anfragen
-- Beschreibung: Automatisches Löschen nach 90 Tagen
-- =====================================================

-- 1. Spalte für Einwilligungszeitpunkt hinzufügen
ALTER TABLE public.event_requests 
  ADD COLUMN IF NOT EXISTS consent_given_at TIMESTAMPTZ DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS consent_ip TEXT; -- Optional: IP-Adresse für Audit

-- 2. Funktion: Auto-Delete nach 90 Tagen ohne Status-Änderung
CREATE OR REPLACE FUNCTION auto_delete_old_event_requests()
RETURNS void AS $$
BEGIN
  -- Lösche Anfragen die älter als 90 Tage sind UND Status 'completed' oder 'rejected'
  DELETE FROM public.event_requests
  WHERE status IN ('completed', 'rejected')
    AND updated_at < NOW() - INTERVAL '90 days';
  
  -- Lösche unbearbeitete Anfragen älter als 180 Tage
  DELETE FROM public.event_requests
  WHERE status IN ('new', 'read')
    AND created_at < NOW() - INTERVAL '180 days';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Cron-Job Extension aktivieren (falls noch nicht vorhanden)
-- Achtung: Benötigt Superuser-Rechte in Supabase!
-- In Supabase Dashboard: Database > Extensions > pg_cron aktivieren

-- 4. KOMMENTAR für manuelle Ausführung:
-- Falls pg_cron nicht verfügbar: Manuell in Supabase SQL Editor ausführen:
-- SELECT cron.schedule(
--   'auto-delete-old-event-requests',
--   '0 3 * * *', -- Täglich um 3 Uhr morgens
--   $$ SELECT auto_delete_old_event_requests(); $$
-- );

-- Alternative: Manuelle Trigger-basierte Lösung (ohne Cron)
-- Wird bei jedem INSERT/UPDATE geprüft:
CREATE OR REPLACE FUNCTION cleanup_old_requests_trigger()
RETURNS TRIGGER AS $$
BEGIN
  -- Führe Cleanup bei jedem neuen Insert aus
  PERFORM auto_delete_old_event_requests();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_cleanup_old_requests ON public.event_requests;
CREATE TRIGGER trigger_cleanup_old_requests
  AFTER INSERT ON public.event_requests
  FOR EACH STATEMENT
  EXECUTE FUNCTION cleanup_old_requests_trigger();

-- 5. Kommentar-Feld für DSGVO-Löschvermerk
COMMENT ON COLUMN public.event_requests.consent_given_at IS 'DSGVO: Zeitpunkt der Einwilligungserklärung';
COMMENT ON FUNCTION auto_delete_old_event_requests IS 'DSGVO: Löscht Event-Anfragen nach 90 Tagen (completed/rejected) bzw. 180 Tagen (new/read)';
