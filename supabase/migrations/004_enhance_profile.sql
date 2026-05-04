-- Migration: Add enhanced profile fields for contact info and brand customization
-- Created: 2026-05-02

-- Add contact information fields
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS website_url TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS contact_email TEXT,
ADD COLUMN IF NOT EXISTS business_hours JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS brand_colors TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS brand_voice TEXT,
ADD COLUMN IF NOT EXISTS logo_url TEXT;

-- Add comment for documentation
COMMENT ON COLUMN public.profiles.website_url IS 'Business website URL for contact and captions';
COMMENT ON COLUMN public.profiles.phone IS 'Business phone number for customer contact';
COMMENT ON COLUMN public.profiles.contact_email IS 'Business contact email (may differ from auth email)';
COMMENT ON COLUMN public.profiles.business_hours IS 'JSON object with day/hours schedule';
COMMENT ON COLUMN public.profiles.brand_colors IS 'Array of brand color hex codes (up to 3)';
COMMENT ON COLUMN public.profiles.brand_voice IS 'Description of brand personality for AI prompts';
COMMENT ON COLUMN public.profiles.logo_url IS 'URL to business logo image';
