-- Add per-image metadata support to gallery
-- Change images from simple array to array of objects with metadata

ALTER TABLE gallery
ADD COLUMN images_new JSONB NOT NULL DEFAULT '[]';

-- Migrate existing images to new format
-- Each image becomes: { "url": "...", "title": "", "description": "", "is_hidden": false }
UPDATE gallery
SET images_new = CASE
  WHEN images::text = '[]' THEN '[]'::jsonb
  ELSE jsonb_agg(
    jsonb_build_object(
      'url', value::text,
      'title', '',
      'description', '',
      'is_hidden', false
    )
  )
END
FROM (SELECT id, jsonb_array_elements(images) as value FROM gallery) AS img_data
WHERE gallery.id = img_data.id;

-- Drop old column and rename
ALTER TABLE gallery DROP COLUMN images;
ALTER TABLE gallery RENAME COLUMN images_new TO images;

-- Add comment for clarity
COMMENT ON COLUMN gallery.images IS 'Array of image objects: { url, title, description, is_hidden }';
