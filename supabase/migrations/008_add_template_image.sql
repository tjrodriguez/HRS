-- Migration: Add image_url column to templates table
-- Created: 2026-05-02

-- Add image_url column for storing associated template images
ALTER TABLE templates ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Add index for performance when querying templates with images
CREATE INDEX IF NOT EXISTS idx_templates_image_url ON templates(image_url) WHERE image_url IS NOT NULL;
