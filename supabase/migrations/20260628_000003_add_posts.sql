-- =====================================================
-- Migration: Posts (Blog / News)
-- Sprint 2 / Feature 5 — Markdown-Content
-- =====================================================

-- Geteilte updated_at-Triggerfunktion (idempotent)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 1. Tabelle
CREATE TABLE IF NOT EXISTS public.posts (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug         TEXT NOT NULL UNIQUE,
  title        TEXT NOT NULL,
  content      TEXT NOT NULL,
  cover_image  TEXT,
  tags         TEXT[] DEFAULT '{}',
  published_at TIMESTAMPTZ,
  created_by   UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Indizes
CREATE INDEX IF NOT EXISTS idx_posts_published_at ON public.posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_created_by   ON public.posts(created_by);
CREATE INDEX IF NOT EXISTS idx_posts_tags         ON public.posts USING GIN (tags);

-- 3. RLS — öffentlich nur veröffentlichte Posts
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view published posts" ON public.posts;
CREATE POLICY "Anyone can view published posts" ON public.posts
  FOR SELECT
  USING (
    (published_at IS NOT NULL AND published_at <= NOW())
    OR auth.jwt() ->> 'role' = 'authenticated'
  );

DROP POLICY IF EXISTS "Authenticated can insert posts" ON public.posts;
CREATE POLICY "Authenticated can insert posts" ON public.posts
  FOR INSERT
  WITH CHECK (auth.jwt() ->> 'role' = 'authenticated');

DROP POLICY IF EXISTS "Authenticated can update posts" ON public.posts;
CREATE POLICY "Authenticated can update posts" ON public.posts
  FOR UPDATE
  USING (auth.jwt() ->> 'role' = 'authenticated');

DROP POLICY IF EXISTS "Authenticated can delete posts" ON public.posts;
CREATE POLICY "Authenticated can delete posts" ON public.posts
  FOR DELETE
  USING (auth.jwt() ->> 'role' = 'authenticated');

-- 4. updated_at-Trigger
DROP TRIGGER IF EXISTS update_posts_updated_at ON public.posts;
CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON public.posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 5. Kommentare
COMMENT ON TABLE  public.posts              IS 'Blog-/News-Beiträge (Markdown), öffentliche Route /news';
COMMENT ON COLUMN public.posts.slug         IS 'URL-Segment, eindeutig — Basis für /news/[slug]';
COMMENT ON COLUMN public.posts.content      IS 'Beitragstext als Markdown';
COMMENT ON COLUMN public.posts.published_at IS 'NULL = Entwurf; gesetzt und <= now() = öffentlich sichtbar';
COMMENT ON COLUMN public.posts.tags         IS 'Freie Schlagworte (GIN-indiziert)';
