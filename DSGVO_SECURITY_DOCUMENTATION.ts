/**
 * DSGVO & Security Documentation
 * =================================
 * 
 * DSGVO-COMPLIANCE ✅
 * -------------------
 * 1. ✅ Einwilligungspflicht: Checkbox mit Link zur Datenschutzerklärung
 * 2. ✅ Informationspflicht: Hinweistext über Speicherdauer und Widerrufsrecht
 * 3. ✅ Datensparsamkeit: Nur notwendige Felder werden erhoben
 * 4. ✅ Zweckbindung: Daten nur für Event-Anfragen verwendet
 * 5. ✅ Speicherbegrenzung: Auto-Delete nach 90/180 Tagen
 * 6. ✅ Widerrufsrecht: Kann jederzeit per E-Mail widerrufen werden
 * 7. ✅ Verschlüsselung: HTTPS für Übertragung, Supabase RLS für Zugriff
 * 8. ✅ Auskunftsrecht: Admin kann auf Anfrage Daten exportieren
 * 9. ✅ Löschrecht: Admin kann Daten manuell löschen
 * 
 * SQL INJECTION SCHUTZ ✅
 * -----------------------
 * 1. ✅ Supabase verwendet automatisch Prepared Statements
 * 2. ✅ Alle Inputs werden validiert (Typ, Länge, Format)
 * 3. ✅ Event-Type Whitelist (nur erlaubte Werte)
 * 4. ✅ Email-Validierung mit strenger Regex
 * 5. ✅ Zahlen-Validierung (guest_count: 1-10000)
 * 6. ✅ Datums-Validierung (nur zukünftige Daten)
 * 7. ✅ Längen-Limits für alle String-Felder
 * 8. ✅ XSS-Schutz durch React (automatisches Escaping)
 * 
 * WEITERE SECURITY-MASSNAHMEN ✅
 * ------------------------------
 * 1. ✅ RLS Policies: Public kann nur INSERT, Admins alles
 * 2. ✅ HTTPS-Verschlüsselung (enforced in production)
 * 3. ✅ Rate Limiting: Supabase Standard (60 requests/minute)
 * 4. ✅ Service Role nur im Backend (nicht im Frontend)
 * 5. ✅ httpOnly Cookies für Admin-Sessions
 * 6. ✅ Rollen-basierte Zugriffskontrolle (RBAC)
 * 
 * DATENBANK-STRUKTUR
 * ------------------
 * Tabelle: event_requests
 * - id (UUID, Primary Key)
 * - name (TEXT, max 100 Zeichen)
 * - email (TEXT, max 255 Zeichen, validiert)
 * - phone (TEXT, max 30 Zeichen, optional)
 * - event_type (TEXT, Whitelist: wedding/corporate/birthday/show/workshop/other)
 * - event_date (DATE, nur Zukunft, optional)
 * - guest_count (INTEGER, 1-10000, optional)
 * - message (TEXT, max 2000 Zeichen, optional)
 * - status (TEXT, CHECK: new/read/in-progress/completed/rejected)
 * - notes (TEXT, nur für Admins)
 * - assigned_to (TEXT, Admin-ID)
 * - consent_given_at (TIMESTAMPTZ, Einwilligungszeitpunkt)
 * - consent_ip (TEXT, optional, für Audit)
 * - created_at (TIMESTAMPTZ)
 * - updated_at (TIMESTAMPTZ)
 * 
 * AUTO-DELETE LOGIC
 * -----------------
 * - Status 'completed' oder 'rejected': Löschen nach 90 Tagen ab updated_at
 * - Status 'new' oder 'read': Löschen nach 180 Tagen ab created_at
 * - Trigger wird bei jedem INSERT ausgeführt (cleanup_old_requests_trigger)
 * 
 * MIGRATIONEN
 * -----------
 * - 003_event_requests_and_roles.sql: Event-Anfragen + Rollen-System
 * - 004_dsgvo_auto_delete.sql: Auto-Delete + Einwilligungsspalten
 * - 005_create_test_users.sql: Test-User Anleitung
 * 
 * TEST-USER ANLEGEN
 * -----------------
 * Da Supabase Auth verwendet wird, müssen User über das Supabase Dashboard angelegt werden:
 * 
 * 1. Supabase Dashboard öffnen
 * 2. Authentication > Users > Add User
 * 3. Email: eventmanager@dancemotion-test.de
 * 4. Passwort: EventManager2026! (oder eigenes sicheres Passwort)
 * 5. Auto Confirm User: JA
 * 6. Anschließend in SQL Editor:
 *    
 *    INSERT INTO public.admin_users (id, email, name, role_id)
 *    SELECT 
 *      auth.users.id,
 *      'eventmanager@dancemotion-test.de',
 *      'Event Manager (Test)',
 *      (SELECT id FROM admin_roles WHERE name = 'event-manager')
 *    FROM auth.users
 *    WHERE email = 'eventmanager@dancemotion-test.de';
 * 
 * DEPLOYMENT CHECKLIST
 * --------------------
 * [ ] Migration 004 in Supabase ausführen (DSGVO Auto-Delete)
 * [ ] Datenschutzerklärung aktualisiert
 * [ ] Event-Anfrage Modal mit Checkbox getestet
 * [ ] Input-Validierung getestet (SQL Injection Versuche)
 * [ ] Test-User angelegt und Rollen-Filterung getestet
 * [ ] Auto-Delete Funktion getestet (manuell: SELECT auto_delete_old_event_requests())
 * [ ] HTTPS in Production aktiv
 * [ ] Alte Test-Daten gelöscht
 * 
 * NÄCHSTE SCHRITTE
 * ----------------
 * 1. Code committen
 * 2. Auf Server deployen
 * 3. Migration 004 in Supabase SQL Editor ausführen
 * 4. Test-User über Supabase Dashboard anlegen
 * 5. Funktionstest durchführen
 * 6. Live gehen ✅
 */

// This file serves as documentation only
export {};
