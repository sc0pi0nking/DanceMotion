-- ============================================
-- User & Role Management System
-- Erweiterte Permissions mit granularer Kontrolle
-- ============================================

-- 1. Alle verfügbaren Permissions definieren
-- Diese werden in admin_roles.permissions als JSONB-Array gespeichert
-- Verfügbare Permissions:
--   - dashboard: Zugriff auf Admin-Dashboard
--   - events: Termine verwalten
--   - recurring: Wiederkehrende Termine
--   - content: Inhalte bearbeiten
--   - gallery: Galerie verwalten
--   - documents: Dokumente verwalten
--   - faqs: FAQs verwalten
--   - team: Team-Mitglieder verwalten
--   - wiki_admin: Admin Wiki (Non-Technical) Zugriff
--   - wiki_dev: Dev Wiki (Technical) Zugriff
--   - social: Social Media Links
--   - users: Benutzer verwalten
--   - roles: Rollen verwalten
--   - analytics: Analytics einsehen
--   - audit: Audit Logs einsehen
--   - settings: System-Einstellungen

-- 2. Standard-Rollen aktualisieren mit erweiterten Permissions
UPDATE public.admin_roles 
SET permissions = '["dashboard", "events", "recurring", "content", "gallery", "documents", "faqs", "team", "wiki_admin", "wiki_dev", "social", "users", "roles", "analytics", "audit", "settings"]'::jsonb
WHERE name = 'admin';

UPDATE public.admin_roles 
SET permissions = '["dashboard", "events", "recurring", "wiki_admin"]'::jsonb,
    description = 'Verwaltung von Terminen und Event-Anfragen'
WHERE name = 'event-manager';

UPDATE public.admin_roles 
SET permissions = '["dashboard", "content", "gallery", "documents", "faqs", "team", "wiki_admin", "social"]'::jsonb,
    description = 'Content und Medien verwalten'
WHERE name = 'editor';

-- 3. Neue Rollen aktualisieren/hinzufügen
UPDATE public.admin_roles
SET permissions = '["dashboard", "analytics", "wiki_admin"]'::jsonb
WHERE name = 'viewer';

UPDATE public.admin_roles
SET permissions = '["dashboard", "social", "gallery", "wiki_admin"]'::jsonb
WHERE name = 'social-manager';

-- Developer Role: Zugriff auf Dev Wiki
INSERT INTO public.admin_roles (name, description, permissions) VALUES
  ('developer', 'Entwickler-Zugriff mit technischer Dokumentation', '["dashboard", "users", "roles", "audit", "settings", "wiki_dev", "analytics"]'::jsonb)
ON CONFLICT (name) DO NOTHING;

-- Support Role: Admin Wiki für Support-Team
INSERT INTO public.admin_roles (name, description, permissions) VALUES
  ('support', 'Support-Team mit Admin Wiki Zugriff', '["dashboard", "wiki_admin", "analytics"]'::jsonb)
ON CONFLICT (name) DO NOTHING;

-- 4. Sicherstellen dass admin_users die richtigen Spalten hat
ALTER TABLE public.admin_users 
  ADD COLUMN IF NOT EXISTS avatar_url TEXT,
  ADD COLUMN IF NOT EXISTS phone TEXT;

-- 5. Index für schnellere Rollen-Lookups
CREATE INDEX IF NOT EXISTS idx_admin_users_role_id ON public.admin_users(role_id);
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON public.admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_is_active ON public.admin_users(is_active);

-- 6. View für einfaches User+Role Lookup
CREATE OR REPLACE VIEW public.admin_users_with_roles AS
SELECT 
  u.id,
  u.email,
  u.name,
  u.avatar_url,
  u.phone,
  u.is_active,
  u.last_login,
  u.created_at,
  u.updated_at,
  r.id as role_id,
  r.name as role_name,
  r.description as role_description,
  r.permissions
FROM public.admin_users u
LEFT JOIN public.admin_roles r ON u.role_id = r.id;

-- 7. Funktion zum Prüfen von Permissions
CREATE OR REPLACE FUNCTION public.user_has_permission(user_id UUID, required_permission TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  user_permissions JSONB;
BEGIN
  SELECT r.permissions INTO user_permissions
  FROM public.admin_users u
  JOIN public.admin_roles r ON u.role_id = r.id
  WHERE u.id = user_id AND u.is_active = true;
  
  IF user_permissions IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Admin hat immer Zugriff
  IF user_permissions ? 'roles' AND user_permissions ? 'users' THEN
    RETURN TRUE;
  END IF;
  
  RETURN user_permissions ? required_permission;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Funktion zum Abrufen aller Permissions eines Users
CREATE OR REPLACE FUNCTION public.get_user_permissions(user_id UUID)
RETURNS JSONB AS $$
DECLARE
  user_permissions JSONB;
BEGIN
  SELECT r.permissions INTO user_permissions
  FROM public.admin_users u
  JOIN public.admin_roles r ON u.role_id = r.id
  WHERE u.id = user_id AND u.is_active = true;
  
  RETURN COALESCE(user_permissions, '[]'::jsonb);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. Updated_at Trigger für admin_users (falls nicht vorhanden)
DROP TRIGGER IF EXISTS trigger_admin_users_updated_at ON public.admin_users;
CREATE TRIGGER trigger_admin_users_updated_at
  BEFORE UPDATE ON public.admin_users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 10. Audit Log für User-Änderungen (optional aber empfohlen)
CREATE TABLE IF NOT EXISTS public.admin_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT, -- TEXT weil admin_users.id als TEXT definiert ist (kommt aus auth.users)
  action TEXT NOT NULL, -- 'create', 'update', 'delete', 'login', 'logout', 'permission_change'
  target_type TEXT, -- 'user', 'role', 'content', etc.
  target_id TEXT,
  details JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index für Audit-Abfragen
CREATE INDEX IF NOT EXISTS idx_audit_log_user_id ON public.admin_audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON public.admin_audit_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_log_action ON public.admin_audit_log(action);

-- RLS für Audit Log
ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read audit log"
ON public.admin_audit_log FOR SELECT
USING (true);

CREATE POLICY "System can insert audit log"
ON public.admin_audit_log FOR INSERT
WITH CHECK (true);

-- 11. Prüfung: Zeige aktuelle Rollen
SELECT name, description, permissions FROM public.admin_roles ORDER BY name;
