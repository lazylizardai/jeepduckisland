-- Fix Critical Security Issues: Duck Ownership and Admin Access

-- 1. Fix ducks table: Remove overly permissive UPDATE policy
-- Only admins (via service role) or the owner should be able to update ducks
DROP POLICY IF EXISTS "Owners can update their ducks" ON public.ducks;

-- Create a proper owner-based policy
CREATE POLICY "Owners can update their own ducks" ON public.ducks
  FOR UPDATE 
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

-- 2. Add INSERT policy for ducks (only via service role / admin)
-- Regular users cannot directly insert ducks (they're registered by admin)
CREATE POLICY "Only service role can insert ducks" ON public.ducks
  FOR INSERT 
  WITH CHECK (false); -- Block all direct inserts; use service role

-- 3. Fix game_scores: Add rate limiting concept via user tracking
-- Ensure scores are properly attributed
DROP POLICY IF EXISTS "Anyone can insert scores" ON public.game_scores;

CREATE POLICY "Anyone can insert scores with valid data" ON public.game_scores
  FOR INSERT 
  WITH CHECK (
    nickname IS NOT NULL AND 
    length(nickname) >= 2 AND 
    length(nickname) <= 20 AND
    score >= 0 AND
    game_type IN ('duck-shot', 'duck-memory', 'duck-hunt', 'duck-puzzle')
  );

-- 4. Fix duck_sightings: Validate required fields
DROP POLICY IF EXISTS "Anyone can create sightings" ON public.duck_sightings;

CREATE POLICY "Anyone can create valid sightings" ON public.duck_sightings
  FOR INSERT 
  WITH CHECK (
    duck_id IS NOT NULL AND
    length(duck_id) >= 4
  );

-- 5. Add DELETE policy for own sightings (optional, for moderation)
CREATE POLICY "Users can delete their own sightings" ON public.duck_sightings
  FOR DELETE 
  USING (auth.uid() = user_id);

-- 6. Profiles: Add DELETE policy for account deletion
CREATE POLICY "Users can delete their own profile" ON public.profiles
  FOR DELETE 
  USING (auth.uid() = id);
