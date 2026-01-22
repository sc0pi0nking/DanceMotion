-- Add per-image metadata support to gallery
-- Change images from simple array to array of objects with metadata
-- Each image becomes: { "url": "...", "title": "", "description": "", "is_hidden": false }

UPDATE gallery
SET images = (
  SELECT jsonb_agg(
    jsonb_build_object(
      'url', url_value,
      'title', '',
      'description', '',
      'is_hidden', false
    )
  )
  FROM (
    SELECT jsonb_array_elements_text(gallery.images) AS url_value
  ) t
)
WHERE images IS NOT NULL AND images != '[]'::jsonb AND images != 'null'::jsonb;

-- For empty or null galleries, ensure empty array
UPDATE gallery SET images = '[]'::jsonb WHERE images IS NULL OR images = 'null'::jsonb OR images = '[]'::jsonb;

-- Add comment for clarity
COMMENT ON COLUMN gallery.images IS 'Array of image objects: { url, title, description, is_hidden }';
