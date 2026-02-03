-- Migration: Sponsor Images Storage Bucket
-- Creates a bucket for sponsor logos and images

-- 1. Create bucket (if not exists - handled by Supabase)
INSERT INTO storage.buckets (id, name, public)
VALUES ('sponsor-images', 'sponsor-images', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Public Read Policy
DROP POLICY IF EXISTS "Public can read sponsor-images" ON storage.objects;
CREATE POLICY "Public can read sponsor-images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'sponsor-images');

-- 3. Authenticated Upload Policy
DROP POLICY IF EXISTS "Authenticated can upload sponsor-images" ON storage.objects;
CREATE POLICY "Authenticated can upload sponsor-images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'sponsor-images');

-- 4. Authenticated Update Policy
DROP POLICY IF EXISTS "Authenticated can update sponsor-images" ON storage.objects;
CREATE POLICY "Authenticated can update sponsor-images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'sponsor-images');

-- 5. Authenticated Delete Policy
DROP POLICY IF EXISTS "Authenticated can delete sponsor-images" ON storage.objects;
CREATE POLICY "Authenticated can delete sponsor-images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'sponsor-images');
