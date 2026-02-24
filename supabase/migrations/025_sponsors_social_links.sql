-- Migration: Add social_links to sponsors table
-- Allows sponsors to have social media links (Instagram, Facebook, TikTok, YouTube)

ALTER TABLE sponsors ADD COLUMN IF NOT EXISTS social_links JSONB DEFAULT '{}'::jsonb;

COMMENT ON COLUMN sponsors.social_links IS 'JSON object with social media links: {instagram, facebook, tiktok, youtube}';
