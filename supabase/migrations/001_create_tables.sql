-- Events Table
CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  date DATE NOT NULL,
  time TIME,
  location TEXT NOT NULL,
  city TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Auftritt', 'Workshop', 'Training', 'Event')),
  groups TEXT[] DEFAULT '{}',
  note TEXT,
  href TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by TEXT,
  is_published BOOLEAN DEFAULT true
);

CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
CREATE INDEX IF NOT EXISTS idx_events_category ON events(category);

-- Content Table (für alle Texte)
CREATE TABLE IF NOT EXISTS content (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL,
  section TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_content_section ON content(section);

-- Forms Table (Future)
CREATE TABLE IF NOT EXISTS forms (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL CHECK (type IN ('membership', 'contact', 'newsletter')),
  description TEXT,
  fields JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true,
  redirect_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by TEXT
);

-- Form Submissions Table (Future)
CREATE TABLE IF NOT EXISTS form_submissions (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  form_id TEXT NOT NULL REFERENCES forms(id) ON DELETE CASCADE,
  data JSONB NOT NULL,
  email TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_submissions_form ON form_submissions(form_id);
CREATE INDEX IF NOT EXISTS idx_submissions_created ON form_submissions(created_at);

-- Gallery Table (Future)
CREATE TABLE IF NOT EXISTS gallery (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  description TEXT,
  images JSONB NOT NULL DEFAULT '[]',
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_gallery_category ON gallery(category);

-- Admin Users Table
CREATE TABLE IF NOT EXISTS admin_users (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  role TEXT DEFAULT 'editor' CHECK (role IN ('admin', 'editor')),
  last_login TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS (Row Level Security)
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE content ENABLE ROW LEVEL SECURITY;
ALTER TABLE forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for idempotency)
DROP POLICY IF EXISTS "Events are public" ON events;
DROP POLICY IF EXISTS "Events admin insert" ON events;
DROP POLICY IF EXISTS "Events admin update" ON events;
DROP POLICY IF EXISTS "Events admin delete" ON events;

DROP POLICY IF EXISTS "Content is public" ON content;
DROP POLICY IF EXISTS "Content admin insert" ON content;
DROP POLICY IF EXISTS "Content admin update" ON content;
DROP POLICY IF EXISTS "Content admin delete" ON content;

DROP POLICY IF EXISTS "Gallery is public" ON gallery;
DROP POLICY IF EXISTS "Gallery admin insert" ON gallery;
DROP POLICY IF EXISTS "Gallery admin update" ON gallery;
DROP POLICY IF EXISTS "Gallery admin delete" ON gallery;

DROP POLICY IF EXISTS "Forms visible when active" ON forms;
DROP POLICY IF EXISTS "Forms admin insert" ON forms;
DROP POLICY IF EXISTS "Forms admin update" ON forms;
DROP POLICY IF EXISTS "Forms admin delete" ON forms;

DROP POLICY IF EXISTS "Submissions read by admin" ON form_submissions;
DROP POLICY IF EXISTS "Submissions insert public" ON form_submissions;

-- RLS Policies: Allow public read, admin write

-- Events policies
CREATE POLICY "Events are public" ON events
  FOR SELECT USING (is_published = true);

CREATE POLICY "Events admin insert" ON events
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Events admin update" ON events
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Events admin delete" ON events
  FOR DELETE USING (auth.role() = 'authenticated');

-- Content policies
CREATE POLICY "Content is public" ON content
  FOR SELECT USING (true);

CREATE POLICY "Content admin insert" ON content
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Content admin update" ON content
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Content admin delete" ON content
  FOR DELETE USING (auth.role() = 'authenticated');

-- Gallery policies
CREATE POLICY "Gallery is public" ON gallery
  FOR SELECT USING (is_published = true);

CREATE POLICY "Gallery admin insert" ON gallery
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Gallery admin update" ON gallery
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Gallery admin delete" ON gallery
  FOR DELETE USING (auth.role() = 'authenticated');

-- Forms policies
CREATE POLICY "Forms visible when active" ON forms
  FOR SELECT USING (is_active = true);

CREATE POLICY "Forms admin insert" ON forms
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Forms admin update" ON forms
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Forms admin delete" ON forms
  FOR DELETE USING (auth.role() = 'authenticated');

-- Form submissions policies
CREATE POLICY "Submissions read by admin" ON form_submissions
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Submissions insert public" ON form_submissions
  FOR INSERT WITH CHECK (true);
