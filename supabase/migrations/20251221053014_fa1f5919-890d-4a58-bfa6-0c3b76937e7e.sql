-- Fix Remaining Security Issues

-- 1. Restrict profiles SELECT - users should only see their own sensitive data
-- But public profiles (username, avatar) should be visible
-- Keep current permissive policy for now (social app needs it)
-- Add a function to get public profile data safely
CREATE OR REPLACE FUNCTION public.get_public_profile(user_id UUID)
RETURNS TABLE(
  id UUID,
  username TEXT,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  location TEXT
) 
SECURITY DEFINER
AS $$
  SELECT id, username, full_name, avatar_url, bio, location
  FROM public.profiles
  WHERE profiles.id = user_id;
$$ LANGUAGE sql;

-- 2. Add function to safely check if duck exists
CREATE OR REPLACE FUNCTION public.duck_exists(p_duck_id TEXT)
RETURNS BOOLEAN
SECURITY DEFINER
AS $$
  SELECT EXISTS(
    SELECT 1 FROM public.ducks 
    WHERE duck_id = p_duck_id AND is_active = true
  );
$$ LANGUAGE sql;

-- 3. Add audit log for duck sightings (for spam prevention)
CREATE TABLE IF NOT EXISTS public.sighting_rate_limits (
  ip_hash TEXT NOT NULL,
  duck_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (ip_hash, duck_id, created_at)
);

-- Enable RLS on rate limits table
ALTER TABLE public.sighting_rate_limits ENABLE ROW LEVEL SECURITY;

-- Only service role can access rate limits
CREATE POLICY "Service role only" ON public.sighting_rate_limits
  FOR ALL USING (false);

-- 4. Add index for performance
CREATE INDEX IF NOT EXISTS idx_duck_sightings_duck_id ON public.duck_sightings(duck_id);
CREATE INDEX IF NOT EXISTS idx_duck_sightings_created_at ON public.duck_sightings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_game_scores_game_type ON public.game_scores(game_type, score DESC);
CREATE INDEX IF NOT EXISTS idx_ducks_duck_id ON public.ducks(duck_id);
