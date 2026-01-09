-- =====================================================
-- Migration: Event Requests System + Admin Roles
-- Beschreibung: Event-Anfragen und Rollen-Verwaltung
-- =====================================================

-- 1. Admin Roles Tabelle
CREATE TABLE IF NOT EXISTS public.admin_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  permissions JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Standard-Rollen einfügen
INSERT INTO public.admin_roles (name, description, permissions) VALUES
  ('admin', 'Voller Zugriff auf alle Bereiche', '["content", "events", "gallery", "documents", "event-requests", "team", "faq", "settings"]'::jsonb),
  ('event-manager', 'Verwaltung von Event-Anfragen', '["event-requests"]'::jsonb),
  ('editor', 'Content und Medien verwalten', '["content", "gallery", "documents"]'::jsonb)
ON CONFLICT (name) DO NOTHING;

-- 2. Admin Users erweitern (role_id statt hardcoded role)
ALTER TABLE IF EXISTS public.admin_users 
  ADD COLUMN IF NOT EXISTS role_id UUID REFERENCES public.admin_roles(id);

-- Falls admin_users noch nicht existiert, erstellen
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT,
  role_id UUID REFERENCES public.admin_roles(id),
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Event Requests Tabelle
CREATE TABLE IF NOT EXISTS public.event_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  event_type TEXT NOT NULL, -- z.B. 'Hochzeit', 'Firmenfeier', 'Geburtstag', 'Show'
  event_date DATE,
  guest_count INTEGER,
  message TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'in-progress', 'completed', 'rejected')),
  notes TEXT, -- Interne Notizen vom Event-Manager
  assigned_to TEXT, -- TEXT weil admin_users.id als TEXT existiert
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. RLS aktivieren
ALTER TABLE public.admin_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_requests ENABLE ROW LEVEL SECURITY;

-- 5. Policies für admin_roles (nur Admins können lesen/ändern)
CREATE POLICY "Admin can read roles"
ON public.admin_roles FOR SELECT
USING (true);

CREATE POLICY "Admin can modify roles"
ON public.admin_roles FOR ALL
USING (true);

-- 6. Policies für admin_users
CREATE POLICY "Users can read themselves"
ON public.admin_users FOR SELECT
USING (true);

CREATE POLICY "Admins can modify users"
ON public.admin_users FOR ALL
USING (true);

-- 7. Policies für event_requests
CREATE POLICY "Public can insert requests"
ON public.event_requests FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admins can read all requests"
ON public.event_requests FOR SELECT
USING (true);

CREATE POLICY "Admins can update requests"
ON public.event_requests FOR UPDATE
USING (true);

CREATE POLICY "Admins can delete requests"
ON public.event_requests FOR DELETE
USING (true);

-- 8. Indizes
CREATE INDEX IF NOT EXISTS idx_event_requests_status ON public.event_requests(status);
CREATE INDEX IF NOT EXISTS idx_event_requests_created_at ON public.event_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_event_requests_assigned_to ON public.event_requests(assigned_to);
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON public.admin_users(email);

-- 9. Updated_at Trigger für event_requests
CREATE TRIGGER update_event_requests_updated_at
BEFORE UPDATE ON public.event_requests
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- 10. Updated_at Trigger für admin_users
CREATE TRIGGER update_admin_users_updated_at
BEFORE UPDATE ON public.admin_users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
