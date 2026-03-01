-- Create profiles table for user data
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create ducks table for QR duck registry
CREATE TABLE IF NOT EXISTS public.ducks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  duck_id TEXT UNIQUE NOT NULL, -- e.g. QJ-0001
  owner_name TEXT,
  owner_id UUID REFERENCES auth.users(id),
  description TEXT,
  rarity TEXT DEFAULT 'common',
  series TEXT DEFAULT 'series-1',
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create duck_sightings table for tourist check-ins
CREATE TABLE IF NOT EXISTS public.duck_sightings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  duck_id TEXT NOT NULL, -- references ducks.duck_id
  user_id UUID REFERENCES auth.users(id),
  location_name TEXT,
  location_lat DECIMAL,
  location_lng DECIMAL,
  note TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create game_scores table for leaderboards  
CREATE TABLE IF NOT EXISTS public.game_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_type TEXT NOT NULL, -- e.g. 'duck-shot', 'duck-memory'
  user_id UUID REFERENCES auth.users(id),
  nickname TEXT NOT NULL,
  score INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ducks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.duck_sightings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_scores ENABLE ROW LEVEL SECURITY;

-- Profiles RLS policies
CREATE POLICY "Users can view all profiles" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Ducks RLS policies
CREATE POLICY "Anyone can view ducks" ON public.ducks
  FOR SELECT USING (true);

CREATE POLICY "Owners can update their ducks" ON public.ducks
  FOR UPDATE USING (auth.uid() = owner_id);

-- Duck sightings RLS policies  
CREATE POLICY "Anyone can view sightings" ON public.duck_sightings
  FOR SELECT USING (true);

CREATE POLICY "Anyone can create sightings" ON public.duck_sightings
  FOR INSERT WITH CHECK (true);

-- Game scores RLS policies
CREATE POLICY "Anyone can view scores" ON public.game_scores
  FOR SELECT USING (true);

CREATE POLICY "Anyone can insert scores" ON public.game_scores
  FOR INSERT WITH CHECK (true);

-- Function to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name)
  VALUES (
    NEW.id,
    SPLIT_PART(NEW.email, '@', 1),
    NEW.raw_user_meta_data ->> 'full_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create profile
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
