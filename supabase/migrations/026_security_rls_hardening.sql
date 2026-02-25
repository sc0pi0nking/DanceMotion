-- =====================================================
-- SECURITY MIGRATION: RLS Policy Hardening
-- Author: Security Agent
-- Date: 2026-02-25
-- KRITISCH: Diese Migration schließt schwere Sicherheitslücken
-- =====================================================

-- =====================================================
-- KRITISCHE SICHERHEITSLÜCKE #1: admin_users
-- Problem: Jeder kann Passwort-Hashes und Admin-Daten lesen!
-- =====================================================

-- Alte unsichere Policies löschen
DROP POLICY IF EXISTS "Users can read themselves" ON public.admin_users;
DROP POLICY IF EXISTS "Admins can modify users" ON public.admin_users;

-- NEUE SICHERE POLICIES:
-- Nur der service_role kann auf admin_users zugreifen
-- Dies wird über den Backend-Server mit dem service_role_key gehandhabt
CREATE POLICY "Service role only - admin_users select"
ON public.admin_users FOR SELECT
TO service_role
USING (true);

CREATE POLICY "Service role only - admin_users insert"
ON public.admin_users FOR INSERT
TO service_role
WITH CHECK (true);

CREATE POLICY "Service role only - admin_users update"
ON public.admin_users FOR UPDATE
TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "Service role only - admin_users delete"
ON public.admin_users FOR DELETE
TO service_role
USING (true);


-- =====================================================
-- KRITISCHE SICHERHEITSLÜCKE #2: event_requests (PII!)
-- Problem: Jeder kann persönliche Daten (Name, Email, Phone) lesen!
-- =====================================================

-- Alte unsichere Policies löschen
DROP POLICY IF EXISTS "Public can insert requests" ON public.event_requests;
DROP POLICY IF EXISTS "Admins can read all requests" ON public.event_requests;
DROP POLICY IF EXISTS "Admins can update requests" ON public.event_requests;
DROP POLICY IF EXISTS "Admins can delete requests" ON public.event_requests;

-- NEUE SICHERE POLICIES:
-- Öffentlich: Nur INSERT (Anfragen einreichen)
CREATE POLICY "Public can submit event requests"
ON public.event_requests FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Nur service_role für Lesen/Ändern/Löschen (Backend-Auth)
CREATE POLICY "Service role only - event_requests select"
ON public.event_requests FOR SELECT
TO service_role
USING (true);

CREATE POLICY "Service role only - event_requests update"
ON public.event_requests FOR UPDATE
TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "Service role only - event_requests delete"
ON public.event_requests FOR DELETE
TO service_role
USING (true);


-- =====================================================
-- KRITISCHE SICHERHEITSLÜCKE #3: admin_roles
-- Problem: Jeder kann Rollen-Configs lesen und ändern!
-- =====================================================

DROP POLICY IF EXISTS "Admin can read roles" ON public.admin_roles;
DROP POLICY IF EXISTS "Admin can modify roles" ON public.admin_roles;

-- Nur service_role kann Rollen verwalten
CREATE POLICY "Service role only - admin_roles select"
ON public.admin_roles FOR SELECT
TO service_role
USING (true);

CREATE POLICY "Service role only - admin_roles all"
ON public.admin_roles FOR ALL
TO service_role
USING (true)
WITH CHECK (true);


-- =====================================================
-- KRITISCHE SICHERHEITSLÜCKE #4: admin_audit_log
-- Problem: Jeder kann Audit-Logs lesen!
-- =====================================================

DROP POLICY IF EXISTS "Admins can read audit log" ON public.admin_audit_log;
DROP POLICY IF EXISTS "System can insert audit log" ON public.admin_audit_log;

-- Nur service_role für Audit-Logs
CREATE POLICY "Service role only - audit_log select"
ON public.admin_audit_log FOR SELECT
TO service_role
USING (true);

CREATE POLICY "Service role only - audit_log insert"
ON public.admin_audit_log FOR INSERT
TO service_role
WITH CHECK (true);


-- =====================================================
-- SICHERHEITSLÜCKE #5: documents
-- Problem: Jeder kann Dokumente einfügen/ändern/löschen!
-- =====================================================

DROP POLICY IF EXISTS "Public Read Access" ON public.documents;
DROP POLICY IF EXISTS "Admin Insert Access" ON public.documents;
DROP POLICY IF EXISTS "Admin Update Access" ON public.documents;
DROP POLICY IF EXISTS "Admin Delete Access" ON public.documents;

-- Public: Nur aktive Dokumente lesen
CREATE POLICY "Public read active documents"
ON public.documents FOR SELECT
TO anon, authenticated
USING (is_active = true);

-- Service role: Voller Zugriff für Admin-Backend
CREATE POLICY "Service role - documents all"
ON public.documents FOR ALL
TO service_role
USING (true)
WITH CHECK (true);


-- =====================================================
-- SICHERHEITSLÜCKE #6: team_members
-- Problem: Jeder kann Team-Daten ändern!
-- =====================================================

DROP POLICY IF EXISTS "select_published_only" ON public.team_members;
DROP POLICY IF EXISTS "select_all_authenticated" ON public.team_members;
DROP POLICY IF EXISTS "insert_authenticated" ON public.team_members;
DROP POLICY IF EXISTS "update_authenticated" ON public.team_members;
DROP POLICY IF EXISTS "delete_authenticated" ON public.team_members;

-- Public: Nur veröffentlichte Team Members
CREATE POLICY "Public read published team"
ON public.team_members FOR SELECT
TO anon, authenticated
USING (published = true);

-- Service role: Voller Zugriff
CREATE POLICY "Service role - team_members all"
ON public.team_members FOR ALL
TO service_role
USING (true)
WITH CHECK (true);


-- =====================================================
-- SICHERHEITSLÜCKE #7: events
-- Problem: Jeder kann Events einfügen/ändern/löschen!
-- =====================================================

DROP POLICY IF EXISTS "Events are public" ON events;
DROP POLICY IF EXISTS "Events admin insert" ON events;
DROP POLICY IF EXISTS "Events admin update" ON events;
DROP POLICY IF EXISTS "Events admin delete" ON events;

-- Public: Nur veröffentlichte Events lesen
CREATE POLICY "Public read published events"
ON events FOR SELECT
TO anon, authenticated
USING (is_published = true);

-- Service role: Voller Zugriff
CREATE POLICY "Service role - events all"
ON events FOR ALL
TO service_role
USING (true)
WITH CHECK (true);


-- =====================================================
-- SICHERHEITSLÜCKE #8: content
-- Problem: Jeder kann Content ändern (Website-Defacement!)
-- =====================================================

DROP POLICY IF EXISTS "Content is public" ON content;
DROP POLICY IF EXISTS "Content admin insert" ON content;
DROP POLICY IF EXISTS "Content admin update" ON content;
DROP POLICY IF EXISTS "Content admin delete" ON content;

-- Public: Content lesen OK
CREATE POLICY "Public read content"
ON content FOR SELECT
TO anon, authenticated
USING (true);

-- Service role: Voller Zugriff
CREATE POLICY "Service role - content all"
ON content FOR ALL
TO service_role
USING (true)
WITH CHECK (true);


-- =====================================================
-- SICHERHEITSLÜCKE #9: gallery
-- Problem: Jeder kann Galerie-Bilder ändern!
-- =====================================================

DROP POLICY IF EXISTS "Gallery is public" ON gallery;
DROP POLICY IF EXISTS "Gallery admin insert" ON gallery;
DROP POLICY IF EXISTS "Gallery admin update" ON gallery;
DROP POLICY IF EXISTS "Gallery admin delete" ON gallery;

-- Public: Nur veröffentlichte Galerien
CREATE POLICY "Public read published gallery"
ON gallery FOR SELECT
TO anon, authenticated
USING (is_published = true);

-- Service role: Voller Zugriff
CREATE POLICY "Service role - gallery all"
ON gallery FOR ALL
TO service_role
USING (true)
WITH CHECK (true);


-- =====================================================
-- SICHERHEITSLÜCKE #10: faqs
-- Problem: Jeder kann FAQs ändern!
-- =====================================================

DROP POLICY IF EXISTS "Public can read published FAQs" ON public.faqs;
DROP POLICY IF EXISTS "Admins can do everything with FAQs" ON public.faqs;

-- Public: Nur veröffentlichte FAQs
CREATE POLICY "Public read published faqs"
ON public.faqs FOR SELECT
TO anon, authenticated
USING (published = true);

-- Service role: Voller Zugriff
CREATE POLICY "Service role - faqs all"
ON public.faqs FOR ALL
TO service_role
USING (true)
WITH CHECK (true);


-- =====================================================
-- SICHERHEITSLÜCKE #11: analytics_pageviews
-- Problem: Jeder kann Analytics lesen!
-- =====================================================

DROP POLICY IF EXISTS "Anyone can insert pageviews" ON public.analytics_pageviews;
DROP POLICY IF EXISTS "Admins can read pageviews" ON public.analytics_pageviews;

-- Anon: Nur INSERT (für Tracking)
CREATE POLICY "Public insert pageviews"
ON public.analytics_pageviews FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Service role: Lesen für Admin-Dashboard
CREATE POLICY "Service role - pageviews select"
ON public.analytics_pageviews FOR SELECT
TO service_role
USING (true);


-- =====================================================
-- SICHERHEITSLÜCKE #12: analytics_daily
-- Problem: Jeder kann Analytics lesen und ändern!
-- =====================================================

DROP POLICY IF EXISTS "Admins can read daily analytics" ON public.analytics_daily;
DROP POLICY IF EXISTS "System can manage daily analytics" ON public.analytics_daily;

-- Service role only
CREATE POLICY "Service role - analytics_daily all"
ON public.analytics_daily FOR ALL
TO service_role
USING (true)
WITH CHECK (true);


-- =====================================================
-- SICHERHEITSLÜCKE #13: tickets
-- Problem: Jeder mit 'authenticated' kann alle Tickets sehen
-- (weniger kritisch, aber sollte service_role sein)
-- =====================================================

DROP POLICY IF EXISTS "Allow anyone to create tickets" ON tickets;
DROP POLICY IF EXISTS "Allow admins to manage tickets" ON tickets;
DROP POLICY IF EXISTS "Allow admins to update tickets" ON tickets;
DROP POLICY IF EXISTS "Allow admins to delete tickets" ON tickets;

-- Public: Nur INSERT (anonyme Tickets)
CREATE POLICY "Public insert tickets"
ON tickets FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Service role: Voller Zugriff
CREATE POLICY "Service role - tickets all"
ON tickets FOR ALL
TO service_role
USING (true)
WITH CHECK (true);


-- =====================================================
-- SICHERHEITSLÜCKE #14: forms
-- Problem: Jeder kann Forms ändern!
-- =====================================================

DROP POLICY IF EXISTS "Forms visible when active" ON forms;
DROP POLICY IF EXISTS "Forms admin insert" ON forms;
DROP POLICY IF EXISTS "Forms admin update" ON forms;
DROP POLICY IF EXISTS "Forms admin delete" ON forms;

-- Public: Nur aktive Forms sichtbar
CREATE POLICY "Public read active forms"
ON forms FOR SELECT
TO anon, authenticated
USING (is_active = true);

-- Service role: Voller Zugriff
CREATE POLICY "Service role - forms all"
ON forms FOR ALL
TO service_role
USING (true)
WITH CHECK (true);


-- =====================================================
-- SICHERHEITSLÜCKE #15: form_submissions (PII!)
-- Problem: Jeder kann Submissions einfügen (ok), aber 
-- 'authenticated' ist zu permissiv für SELECT
-- =====================================================

DROP POLICY IF EXISTS "Submissions read by admin" ON form_submissions;
DROP POLICY IF EXISTS "Submissions insert public" ON form_submissions;

-- Public: Nur INSERT
CREATE POLICY "Public insert form submissions"
ON form_submissions FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Service role: Lesen für Admin
CREATE POLICY "Service role - form_submissions select"
ON form_submissions FOR SELECT
TO service_role
USING (true);

CREATE POLICY "Service role - form_submissions update"
ON form_submissions FOR UPDATE
TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "Service role - form_submissions delete"
ON form_submissions FOR DELETE
TO service_role
USING (true);


-- =====================================================
-- SICHERHEITSLÜCKE #16: sponsors
-- Die policies in 024_fix_sponsors_rls.sql sind besser,
-- aber immer noch zu permissiv. Nur authenticated ist
-- nicht genug - sollte service_role sein.
-- =====================================================

DROP POLICY IF EXISTS "Authenticated users can insert sponsors" ON sponsors;
DROP POLICY IF EXISTS "Authenticated users can update sponsors" ON sponsors;
DROP POLICY IF EXISTS "Authenticated users can delete sponsors" ON sponsors;
DROP POLICY IF EXISTS "Anyone can view active sponsors" ON sponsors;

-- Public: Nur aktive Sponsoren sichtbar
CREATE POLICY "Public read active sponsors"
ON sponsors FOR SELECT
TO anon, authenticated
USING (is_active = true);

-- Service role: Voller Zugriff für Admin
CREATE POLICY "Service role - sponsors all"
ON sponsors FOR ALL
TO service_role
USING (true)
WITH CHECK (true);


-- =====================================================
-- VERIFICATION: Show all policies after migration
-- =====================================================
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- =====================================================
-- SUMMARY
-- =====================================================
SELECT 'SECURITY: RLS Policies hardened. All admin operations now require service_role.' AS status;
