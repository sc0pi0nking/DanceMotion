-- =====================================================
-- Migration: Drop Trial Bookings (Probestunden-Buchung)
-- Feature wurde verworfen — Tabelle, Trigger und Funktionen entfernen.
-- Idempotent (IF EXISTS überall).
-- =====================================================

-- Trigger zuerst (hängen an der Tabelle)
DROP TRIGGER IF EXISTS trigger_cleanup_old_trial_bookings ON public.trial_bookings;
DROP TRIGGER IF EXISTS update_trial_bookings_updated_at    ON public.trial_bookings;

-- Tabelle inkl. Indizes und RLS-Policies
DROP TABLE IF EXISTS public.trial_bookings CASCADE;

-- Nur für Trial-Bookings genutzte Funktionen entfernen
-- (update_updated_at_column bleibt — wird von anderen Tabellen genutzt)
DROP FUNCTION IF EXISTS cleanup_old_trial_bookings_trigger();
DROP FUNCTION IF EXISTS auto_delete_old_trial_bookings();
