-- Create sponsors table
CREATE TABLE IF NOT EXISTS sponsors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  logo_url TEXT,
  website_url TEXT,
  category TEXT DEFAULT 'general' CHECK (category IN ('venue', 'equipment', 'media', 'partner', 'general')),
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  CONSTRAINT valid_url_website CHECK (website_url IS NULL OR website_url ~ '^https?://'),
  CONSTRAINT valid_url_logo CHECK (logo_url IS NULL OR logo_url ~ '^https?://')
);

-- Index for sorting
CREATE INDEX IF NOT EXISTS idx_sponsors_sort ON sponsors(is_active DESC, sort_order ASC);
CREATE INDEX IF NOT EXISTS idx_sponsors_category ON sponsors(category);
CREATE INDEX IF NOT EXISTS idx_sponsors_created_by ON sponsors(created_by);

-- Enable RLS
ALTER TABLE sponsors ENABLE ROW LEVEL SECURITY;

-- RLS Policies for sponsors
DROP POLICY IF EXISTS "Anyone can view active sponsors" ON sponsors;
CREATE POLICY "Anyone can view active sponsors" ON sponsors
  FOR SELECT
  USING (is_active = true OR auth.jwt() ->> 'role' = 'authenticated');

DROP POLICY IF EXISTS "Only authenticated users can insert sponsors" ON sponsors;
CREATE POLICY "Only authenticated users can insert sponsors" ON sponsors
  FOR INSERT
  WITH CHECK (auth.jwt() ->> 'role' = 'authenticated');

DROP POLICY IF EXISTS "Only creator or admin can update sponsors" ON sponsors;
CREATE POLICY "Only creator or admin can update sponsors" ON sponsors
  FOR UPDATE
  USING (auth.jwt() ->> 'sub' = created_by::text OR 
         auth.jwt() ->> 'role' = 'authenticated');

DROP POLICY IF EXISTS "Only creator or admin can delete sponsors" ON sponsors;
CREATE POLICY "Only creator or admin can delete sponsors" ON sponsors
  FOR DELETE
  USING (auth.jwt() ->> 'sub' = created_by::text OR 
         auth.jwt() ->> 'role' = 'authenticated');

-- Comments
COMMENT ON TABLE sponsors IS 'Sponsors and partners of DanceMotion';
COMMENT ON COLUMN sponsors.category IS 'Sponsor category: venue, equipment, media, partner, general';
COMMENT ON COLUMN sponsors.sort_order IS 'Display order (lower numbers first)';
COMMENT ON COLUMN sponsors.is_active IS 'Only active sponsors appear on public pages';
