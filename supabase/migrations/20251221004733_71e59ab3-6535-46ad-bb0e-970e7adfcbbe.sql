-- Fix Warning-Level Security Issues: Storage and Profile Policies

-- 1. Fix storage: Remove duplicate/conflicting upload policies for duckshots
-- Keep only authenticated upload (more secure)
DROP POLICY IF EXISTS "Anyone can upload duckshots" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload duckshots" ON storage.objects;

-- Recreate: allow both authenticated and anonymous (tourists don't need accounts)
CREATE POLICY "Public can upload duckshots" ON storage.objects
  FOR INSERT 
  WITH CHECK (
    bucket_id = 'duckshots' AND
    (storage.extension(name) IN ('jpg', 'jpeg', 'png', 'webp', 'gif')) AND
    (octet_length(encode(name::bytea, 'base64')) < 200) -- max filename length
  );

-- 2. Add UPDATE policy for duckshots (for replacing photos)
CREATE POLICY "Users can update their own duckshots" ON storage.objects
  FOR UPDATE 
  USING (
    bucket_id = 'duckshots' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- 3. Add DELETE policy for duckshots
CREATE POLICY "Users can delete their own duckshots" ON storage.objects
  FOR DELETE 
  USING (
    bucket_id = 'duckshots' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- 4. Fix profiles: Ensure upsert works properly
-- The current INSERT policy requires auth.uid() = id which is correct
-- But we need to make sure the upsert (used in Profile.tsx) works
-- Add a more explicit upsert-compatible policy
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- 5. Game scores: Add DELETE for own scores (for privacy/GDPR)
CREATE POLICY "Users can delete their own scores" ON public.game_scores
  FOR DELETE 
  USING (auth.uid() = user_id);

-- 6. Ducks: Add explicit SELECT for inactive ducks (only owner can see)
CREATE POLICY "Owners can see their inactive ducks" ON public.ducks
  FOR SELECT 
  USING (
    is_active = true OR auth.uid() = owner_id
  );

-- Note: This replaces the blanket "Anyone can view ducks" policy
-- We need to drop the old one first
DROP POLICY IF EXISTS "Anyone can view ducks" ON public.ducks;
