-- Cache recent AI generations so repeated requests can reuse results across server restarts.
CREATE TABLE IF NOT EXISTS public.content_generation_cache (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  cache_key TEXT NOT NULL,
  mode TEXT NOT NULL CHECK (mode IN ('full', 'caption')),
  payload JSONB NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT content_generation_cache_user_key_unique UNIQUE (user_id, cache_key)
);

ALTER TABLE public.content_generation_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own generation cache" ON public.content_generation_cache
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own generation cache" ON public.content_generation_cache
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own generation cache" ON public.content_generation_cache
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own generation cache" ON public.content_generation_cache
  FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX idx_content_generation_cache_user_id ON public.content_generation_cache(user_id);
CREATE INDEX idx_content_generation_cache_expires_at ON public.content_generation_cache(expires_at);