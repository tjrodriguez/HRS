-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  type TEXT,
  location TEXT,
  description TEXT,
  target_audience TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create holidays table (pre-populated)
CREATE TABLE IF NOT EXISTS public.holidays (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  date DATE NOT NULL,
  description TEXT,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create campaigns table
CREATE TABLE IF NOT EXISTS public.campaigns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  holiday_id TEXT NOT NULL REFERENCES public.holidays(id),
  content JSONB NOT NULL DEFAULT '{"instagram":"","email":"","hashtags":[]}',
  platforms JSONB DEFAULT '{"instagram":true,"facebook":false,"twitter":false}',
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'posted', 'archived')),
  scheduled_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT user_holiday_unique UNIQUE(user_id, holiday_id)
);

-- Create analytics table
CREATE TABLE IF NOT EXISTS public.analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('view', 'click', 'share', 'engagement')),
  platform TEXT,
  metrics JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for campaigns
CREATE POLICY "Users can view own campaigns" ON public.campaigns
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own campaigns" ON public.campaigns
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own campaigns" ON public.campaigns
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own campaigns" ON public.campaigns
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for analytics
CREATE POLICY "Users can view own analytics" ON public.analytics
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own analytics" ON public.analytics
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_campaigns_user_id ON public.campaigns(user_id);
CREATE INDEX idx_campaigns_holiday_id ON public.campaigns(holiday_id);
CREATE INDEX idx_campaigns_status ON public.campaigns(status);
CREATE INDEX idx_campaigns_scheduled_date ON public.campaigns(scheduled_date);
CREATE INDEX idx_analytics_user_id ON public.analytics(user_id);
CREATE INDEX idx_analytics_campaign_id ON public.analytics(campaign_id);
CREATE INDEX idx_analytics_created_at ON public.analytics(created_at);

-- Insert holidays
INSERT INTO public.holidays (id, name, date, description, category) VALUES
('new-year', 'New Year', '2026-01-01', 'Start the year with fresh beginnings', 'Seasonal'),
('valentine', "Valentine's Day", '2026-02-14', 'Celebrate love and relationships', 'Love'),
('stpatrick', "St. Patrick's Day", '2026-03-17', 'Celebrate Irish heritage and culture', 'Cultural'),
('easter', 'Easter', '2026-04-05', 'Celebrate the Easter season', 'Religious'),
('earthday', 'Earth Day', '2026-04-22', 'Celebrate and protect our planet', 'Environmental'),
('mothersday', "Mother's Day", '2026-05-10', 'Honor and celebrate mothers', 'Family'),
('juneteenth', 'Juneteenth', '2026-06-19', 'Celebrate freedom and independence', 'Historical'),
('summersol', 'Summer Solstice', '2026-06-21', 'Celebrate the longest day of the year', 'Seasonal'),
('independence', 'Independence Day', '2026-07-04', 'Celebrate national independence', 'National'),
('laborday', 'Labor Day', '2026-09-07', 'Honor the labor movement', 'Historical'),
('halloween', 'Halloween', '2026-10-31', 'Celebrate spooky season', 'Seasonal'),
('thanksgiving', 'Thanksgiving', '2026-11-26', 'Give thanks and celebrate together', 'Family'),
('blackfriday', 'Black Friday', '2026-11-27', 'Start holiday shopping season', 'Shopping'),
('cybermonday', 'Cyber Monday', '2026-12-01', 'Online shopping extravaganza', 'Shopping'),
('christmas', 'Christmas', '2026-12-25', 'Celebrate the holiday season', 'Religious'),
('newyearseve', "New Year's Eve", '2026-12-31', 'Ring in the new year', 'Seasonal')
ON CONFLICT (id) DO NOTHING;
