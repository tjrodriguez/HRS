-- Migration: Add templates table for Content Library feature
-- Created: 2026-04-27

-- Templates table: stores saved captions and content for reuse
CREATE TABLE IF NOT EXISTS templates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Content fields
    name VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    hashtags TEXT[] DEFAULT '{}',
    
    -- Categorization
    category VARCHAR(100) DEFAULT 'general',
    holiday_name VARCHAR(255),
    business_type VARCHAR(100),
    tone VARCHAR(50),
    platforms TEXT[] DEFAULT '{}',
    
    -- User preferences
    is_favorite BOOLEAN DEFAULT false,
    usage_count INTEGER DEFAULT 0,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_templates_user_id ON templates(user_id);
CREATE INDEX IF NOT EXISTS idx_templates_category ON templates(category);
CREATE INDEX IF NOT EXISTS idx_templates_favorite ON templates(user_id, is_favorite);
CREATE INDEX IF NOT EXISTS idx_templates_created_at ON templates(user_id, created_at DESC);

-- Enable RLS
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own templates" 
    ON templates FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own templates" 
    ON templates FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own templates" 
    ON templates FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own templates" 
    ON templates FOR DELETE 
    USING (auth.uid() = user_id);

-- Function to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_templates_updated_at
    BEFORE UPDATE ON templates
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

