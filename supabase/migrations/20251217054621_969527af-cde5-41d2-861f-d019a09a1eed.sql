-- Create game_scores table for Duck Shot leaderboard
CREATE TABLE IF NOT EXISTS public.game_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_type TEXT NOT NULL,
  nickname TEXT NOT NULL,
  score INTEGER NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.game_scores ENABLE ROW LEVEL SECURITY;

-- Anyone can view scores (for leaderboard)
CREATE POLICY IF NOT EXISTS "Anyone can view scores" ON public.game_scores
  FOR SELECT USING (true);

-- Anyone can insert scores (even anonymous)
CREATE POLICY IF NOT EXISTS "Anyone can insert scores" ON public.game_scores
  FOR INSERT WITH CHECK (true);
