-- =====================================================
-- Migration: Create team-images Bucket
-- Beschreibung: Erstellt das Storage Bucket für Team-Bilder
-- =====================================================

-- WICHTIG: Dies muss manuell in Supabase Dashboard ausgeführt werden!
-- Storage > Create Bucket > Name: "team-images" > Public: true

-- Alternative via SQL (funktioniert aber in manchen Umgebungen nicht):
-- SELECT storage.create_bucket('team-images', true);

-- RLS Policies für team-images Bucket
-- Jeder kann Bilder lesen (public)
CREATE POLICY "Public can read team images"
ON storage.objects FOR SELECT
USING (bucket_id = 'team-images');

-- Authentifizierte User können Bilder hochladen
CREATE POLICY "Authenticated users can upload team images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'team-images'
  AND auth.role() = 'authenticated'
);

-- Authentifizierte User können ihre Bilder löschen
CREATE POLICY "Users can delete their own team images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'team-images'
  AND auth.role() = 'authenticated'
);
