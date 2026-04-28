-- Create activity_logs table for tracking all simulation activity
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Activity type categorization
  activity_type TEXT NOT NULL CHECK (activity_type IN (
    'caption_generated',
    'caption_regenerated',
    'post_simulated',
    'campaign_scheduled',
    'campaign_created',
    'template_saved',
    'account_connected',
    'account_disconnected'
  )),
  
  -- Platform information (for posting activities)
  platform TEXT CHECK (platform IN ('instagram', 'facebook', 'both', null)),
  
  -- Related entities
  campaign_id UUID REFERENCES public.campaigns(id) ON DELETE SET NULL,
  holiday_id TEXT,
  holiday_name TEXT,
  
  -- Content tracking
  caption TEXT,
  hashtags TEXT[],
  content_preview TEXT, -- Truncated version for display
  
  -- Simulation results (for posting)
  simulation_results JSONB,
  post_ids JSONB,
  
  -- Metadata
  status TEXT DEFAULT 'success' CHECK (status IN ('success', 'error', 'pending')),
  error_message TEXT,
  metadata JSONB DEFAULT '{}', -- Flexible field for additional data
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for activity_logs
CREATE POLICY "Users can view own activity logs" ON public.activity_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own activity logs" ON public.activity_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own activity logs" ON public.activity_logs
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own activity logs" ON public.activity_logs
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_activity_logs_user_id ON public.activity_logs(user_id);
CREATE INDEX idx_activity_logs_activity_type ON public.activity_logs(activity_type);
CREATE INDEX idx_activity_logs_platform ON public.activity_logs(platform);
CREATE INDEX idx_activity_logs_created_at ON public.activity_logs(created_at DESC);
CREATE INDEX idx_activity_logs_campaign_id ON public.activity_logs(campaign_id);
CREATE INDEX idx_activity_logs_holiday_id ON public.activity_logs(holiday_id);

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_activity_logs_updated_at ON public.activity_logs;
CREATE TRIGGER update_activity_logs_updated_at
  BEFORE UPDATE ON public.activity_logs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create view for activity statistics
CREATE OR REPLACE VIEW public.activity_stats AS
SELECT 
  user_id,
  activity_type,
  platform,
  COUNT(*) as count,
  DATE_TRUNC('day', created_at) as date
FROM public.activity_logs
GROUP BY user_id, activity_type, platform, DATE_TRUNC('day', created_at);
