-- Add attachments column to tickets table for image uploads
-- Stores array of image URLs attached during ticket creation

ALTER TABLE tickets ADD COLUMN IF NOT EXISTS attachments TEXT[] DEFAULT '{}';

-- Note: admin_notes JSONB entries can also contain an "attachments" array field
-- Format: { note: string, created_by: string, created_at: string, attachments?: string[] }
