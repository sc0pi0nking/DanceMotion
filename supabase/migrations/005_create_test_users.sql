-- =====================================================
-- Test-User: Event-Manager Rolle
-- Beschreibung: Anleitung zum Erstellen von Test-Usern
-- =====================================================

-- WICHTIG: Da Supabase Auth verwendet wird, müssen User
-- über das Supabase Dashboard angelegt werden!

-- SCHRITT 1: User in Supabase Auth anlegen
-- =========================================
-- 1. Supabase Dashboard öffnen
-- 2. Authentication > Users > "Add User"
-- 3. Email: eventmanager@dancemotion-test.de
-- 4. Passwort: EventManager2026! (oder eigenes sicheres Passwort)
-- 5. "Auto Confirm User": JA ankreuzen
-- 6. "Create User" klicken

-- SCHRITT 2: User-Rolle in admin_users setzen
-- ============================================
-- Nach dem Anlegen im Dashboard diesen SQL Code ausführen:

DO $$
DECLARE
  event_manager_role_id UUID;
  auth_user_id UUID;
BEGIN
  -- Rolle-ID holen
  SELECT id INTO event_manager_role_id 
  FROM public.admin_roles 
  WHERE name = 'event-manager';

  -- User-ID aus auth.users holen
  SELECT id INTO auth_user_id
  FROM auth.users
  WHERE email = 'eventmanager@dancemotion-test.de';

  -- Falls User existiert, in admin_users eintragen
  IF auth_user_id IS NOT NULL THEN
    INSERT INTO public.admin_users (
      id,
      email,
      name,
      role_id,
      is_active
    ) VALUES (
      auth_user_id,
      'eventmanager@dancemotion-test.de',
      'Event Manager (Test)',
      event_manager_role_id,
      true
    )
    ON CONFLICT (id) DO UPDATE
    SET 
      role_id = event_manager_role_id,
      name = 'Event Manager (Test)',
      is_active = true;

    RAISE NOTICE 'Test-User verbunden: eventmanager@dancemotion-test.de';
  ELSE
    RAISE NOTICE 'FEHLER: User nicht in auth.users gefunden. Bitte zuerst über Dashboard anlegen!';
  END IF;
END $$;

-- SCHRITT 3: Weitere Test-User (Optional)
-- ========================================

-- Admin-User (falls noch nicht vorhanden):
-- Email: admin@dancemotion-eschweiler.de
-- Role: admin (voller Zugriff)

-- Editor-User (Optional):
-- Email: editor@dancemotion-test.de  
-- Role: editor (Inhalte, Galerie, Dokumente)

-- PRÜFUNG: Alle User mit ihren Rollen anzeigen
-- =============================================
SELECT 
  u.id,
  u.email,
  u.name,
  r.name as role,
  r.permissions,
  u.is_active,
  u.created_at
FROM public.admin_users u
LEFT JOIN public.admin_roles r ON u.role_id = r.id
ORDER BY u.created_at DESC;

