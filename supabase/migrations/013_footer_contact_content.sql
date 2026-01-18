-- ============================================
-- Footer Contact Information as Editable Content
-- Erlaubt es, Kontaktinfos im Admin Panel zu bearbeiten
-- ============================================

-- Insert default footer contact information into content table
INSERT INTO public.site_content (key, section, description, value, is_public, sort_order)
VALUES 
  (
    'footer_email',
    'Footer',
    'E-Mail Adresse im Footer',
    'info@dancemotion-eschweiler.de',
    true,
    1
  ),
  (
    'footer_phone',
    'Footer',
    'Telefonnummer im Footer',
    '+49 (0) 2405 87 51',
    true,
    2
  ),
  (
    'footer_location',
    'Footer',
    'Standort/Stadt im Footer',
    'Eschweiler, NRW',
    true,
    3
  )
ON CONFLICT (key) DO NOTHING;

-- Verify the content was inserted
SELECT key, section, description, value FROM public.site_content WHERE section = 'Footer' ORDER BY sort_order;
