-- ============================================
-- Footer Contact Information as Editable Content
-- Erlaubt es, Kontaktinfos im Admin Panel zu bearbeiten
-- ============================================

-- Insert default footer contact information into content table
INSERT INTO content (key, section, description, value)
VALUES 
  (
    'footer_email',
    'Footer',
    'E-Mail Adresse im Footer',
    jsonb_build_object('text', 'info@dancemotion-eschweiler.de')
  ),
  (
    'footer_phone',
    'Footer',
    'Telefonnummer im Footer',
    jsonb_build_object('text', '+49 (0) 2405 87 51')
  ),
  (
    'footer_location',
    'Footer',
    'Standort/Stadt im Footer',
    jsonb_build_object('text', 'Eschweiler, NRW')
  )
ON CONFLICT (key) DO UPDATE SET
  section = EXCLUDED.section,
  description = EXCLUDED.description,
  updated_at = NOW();

-- Verify the content was inserted
SELECT key, section, description, value FROM content WHERE section = 'Footer' ORDER BY key;
