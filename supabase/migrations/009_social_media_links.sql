-- ============================================
-- Social Media Links System
-- Admin-editable social media links for footer
-- ============================================

-- Create social_links table
CREATE TABLE IF NOT EXISTS public.social_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform TEXT NOT NULL,  -- 'instagram', 'facebook', 'youtube', 'tiktok', 'twitter', etc.
  url TEXT NOT NULL,
  icon TEXT NOT NULL,      -- Lucide icon name: 'instagram', 'facebook', 'youtube', etc.
  label TEXT NOT NULL,     -- Display label/title
  sort_order INTEGER DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;

-- Public read access for visible links
CREATE POLICY "social_links_public_read" ON public.social_links
  FOR SELECT USING (is_visible = true);

-- Admin full access
CREATE POLICY "social_links_admin_all" ON public.social_links
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'superadmin')
    )
  );

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_social_links_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_social_links_updated_at
  BEFORE UPDATE ON public.social_links
  FOR EACH ROW
  EXECUTE FUNCTION update_social_links_updated_at();

-- Insert default social links (placeholder URLs)
INSERT INTO public.social_links (platform, url, icon, label, sort_order, is_visible) VALUES
  ('instagram', 'https://instagram.com/dancemotion_eschweiler', 'instagram', 'Instagram', 1, true),
  ('facebook', 'https://facebook.com/DanceMotionEschweiler', 'facebook', 'Facebook', 2, true),
  ('youtube', 'https://youtube.com/@dancemotion', 'youtube', 'YouTube', 3, true)
ON CONFLICT DO NOTHING;
