-- =====================================================
-- Team Images Storage Bucket & Policies
-- =====================================================

-- Bucket erstellen (falls nicht vorhanden) mit MIME-Type Whitelist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'team-images', 
  'team-images', 
  true,
  5242880,  -- 5MB max
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/jpg']::text[]
)
ON CONFLICT (id) DO UPDATE SET
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/jpg']::text[];

-- RLS Policies für team-images Bucket

-- 1. Jeder kann Bilder lesen
DROP POLICY IF EXISTS "Public can read team images" ON storage.objects;
CREATE POLICY "Public can read team images"
ON storage.objects FOR SELECT
USING (bucket_id = 'team-images');

-- 2. Authenticated User können hochladen
DROP POLICY IF EXISTS "Authenticated can upload to team-images" ON storage.objects;
CREATE POLICY "Authenticated can upload to team-images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'team-images'
);

-- 3. Authenticated User können aktualisieren
DROP POLICY IF EXISTS "Authenticated can update team images" ON storage.objects;
CREATE POLICY "Authenticated can update team images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'team-images')
WITH CHECK (bucket_id = 'team-images');

-- 4. Authenticated User können löschen
DROP POLICY IF EXISTS "Authenticated can delete team images" ON storage.objects;
CREATE POLICY "Authenticated can delete team images"
ON storage.objects FOR DELETE
USING (bucket_id = 'team-images');

-- Verification
SELECT id, name, public FROM storage.buckets WHERE id = 'team-images';
