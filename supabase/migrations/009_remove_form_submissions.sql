-- =====================================================
-- Migration: Remove Deprecated form_submissions Table
-- Beschreibung: Die form_submissions Tabelle wird nicht mehr verwendet.
--               Kontaktanfragen werden jetzt via SMTP-Email versandt (DSGVO-konform).
--               Diese Migration entfernt die veraltete Tabelle.
-- =====================================================

-- 1. Policies dropppen
DROP POLICY IF EXISTS "Submissions read by admin" ON public.form_submissions;
DROP POLICY IF EXISTS "Submissions insert public" ON public.form_submissions;

-- 2. Indices dropppen
DROP INDEX IF EXISTS public.idx_submissions_form;
DROP INDEX IF EXISTS public.idx_submissions_created;

-- 3. Tabelle dropppen
DROP TABLE IF EXISTS public.form_submissions;

-- Documentation of removed structure (for reference):
-- The form_submissions table previously had:
--   id: uuid (primary key)
--   form_id: text
--   data: jsonb
--   created_at: timestamp
--   is_read: boolean
--   
-- This data is no longer collected due to DSGVO compliance requirements.
-- Contact form submissions are now sent directly via email and not persisted in the database.
