-- Add game_sessions table for tracking game plays
CREATE TABLE IF NOT EXISTS public.game_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id),
  game_type TEXT NOT NULL,
  score INTEGER DEFAULT 0,
  duration_seconds INTEGER,
  level_reached INTEGER DEFAULT 1,
  ducks_caught INTEGER DEFAULT 0,
  accuracy DECIMAL,
  quack_earned INTEGER DEFAULT 0,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.game_sessions ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view all game sessions" ON public.game_sessions
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own game sessions" ON public.game_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Add leaderboard view
CREATE OR REPLACE VIEW public.leaderboard AS
SELECT
  p.id,
  p.username,
  p.avatar_emoji,
  p.quack_tokens,
  p.ducks_spotted,
  p.level,
  p.xp,
  RANK() OVER (ORDER BY p.quack_tokens DESC, p.ducks_spotted DESC) as rank_position
FROM public.profiles p
WHERE p.username IS NOT NULL
ORDER BY rank_position;

-- Grant access
GRANT SELECT ON public.leaderboard TO anon, authenticated;
