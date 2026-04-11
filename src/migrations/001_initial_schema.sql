-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  niche TEXT NOT NULL,
  tone TEXT NOT NULL,
  type TEXT,
  description TEXT,
  location TEXT,
  target_audience TEXT,
  social_platforms TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create holidays table
CREATE TABLE IF NOT EXISTS holidays (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL,
  date DATE NOT NULL,
  type TEXT NOT NULL,
  description TEXT,
  category TEXT,
  reminder_sent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create engagement_data table
CREATE TABLE IF NOT EXISTS engagement_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  holiday_id INTEGER REFERENCES holidays(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  platform TEXT NOT NULL,
  holiday_name TEXT NOT NULL,
  views INTEGER DEFAULT 0,
  interactions INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  reach INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create posts table
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  holiday_id INTEGER REFERENCES holidays(id) ON DELETE CASCADE,
  platforms TEXT[] DEFAULT ARRAY[]::TEXT[],
  caption TEXT NOT NULL,
  hashtags TEXT[] DEFAULT ARRAY[]::TEXT[],
  scheduled_at TIMESTAMP WITH TIME ZONE,
  posted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_holidays_date ON holidays(date);
CREATE INDEX IF NOT EXISTS idx_engagement_data_user_id ON engagement_data(user_id);
CREATE INDEX IF NOT EXISTS idx_engagement_data_holiday_id ON engagement_data(holiday_id);
CREATE INDEX IF NOT EXISTS idx_engagement_data_date ON engagement_data(date);
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_holiday_id ON posts(holiday_id);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE engagement_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for engagement_data
CREATE POLICY "Users can view their own engagement data"
  ON engagement_data FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own engagement data"
  ON engagement_data FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own engagement data"
  ON engagement_data FOR UPDATE
  USING (auth.uid() = user_id);

-- Create RLS policies for posts
CREATE POLICY "Users can view their own posts"
  ON posts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own posts"
  ON posts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own posts"
  ON posts FOR UPDATE
  USING (auth.uid() = user_id);

-- Allow public read access to holidays (not user-specific)
ALTER TABLE holidays DISABLE ROW LEVEL SECURITY;

-- Insert sample holidays
INSERT INTO holidays (name, date, type, description, category) VALUES
  ('New Year', '2026-01-01', 'Federal', 'Start of the year', 'Holiday'),
  ('Valentine''s Day', '2026-02-14', 'Observance', 'Day of love and affection', 'Holiday'),
  ('St. Patrick''s Day', '2026-03-17', 'Observance', 'Irish cultural celebration', 'Holiday'),
  ('Easter', '2026-04-05', 'Religious', 'Christian holiday', 'Holiday'),
  ('Mother''s Day', '2026-05-10', 'Observance', 'Day to celebrate mothers', 'Holiday'),
  ('Father''s Day', '2026-06-21', 'Observance', 'Day to celebrate fathers', 'Holiday'),
  ('Independence Day', '2026-07-04', 'Federal', 'US Independence Day', 'Holiday'),
  ('Labor Day', '2026-09-07', 'Federal', 'Day celebrating workers', 'Holiday'),
  ('Halloween', '2026-10-31', 'Observance', 'Day of costumes and treats', 'Holiday'),
  ('Thanksgiving', '2026-11-26', 'Federal', 'Day of gratitude', 'Holiday'),
  ('Christmas', '2026-12-25', 'Federal', 'Christian holiday celebrating Jesus''s birth', 'Holiday'),
  ('Cyber Monday', '2026-11-30', 'Commercial', 'Online shopping event', 'Sales')
ON CONFLICT DO NOTHING;
