-- Create ducks table
CREATE TABLE IF NOT EXISTS public.ducks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  serial_number TEXT UNIQUE,
  name TEXT,
  description TEXT,
  rarity TEXT DEFAULT 'Common',
  zone TEXT,
  qr_code TEXT UNIQUE,
  nft_token_id TEXT,
  image_url TEXT,
  emoji_code TEXT DEFAULT '🦆',
  message TEXT,
  current_owner_id UUID REFERENCES public.profiles(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.ducks ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Ducks are viewable by everyone" ON public.ducks
  FOR SELECT USING (true);

CREATE POLICY "Only admins can insert ducks" ON public.ducks
  FOR INSERT WITH CHECK (false);

CREATE POLICY "Only admins can update ducks" ON public.ducks
  FOR UPDATE WITH CHECK (false);

-- Create duck_sightings table
CREATE TABLE IF NOT EXISTS public.duck_sightings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  duck_id UUID REFERENCES public.ducks(id),
  user_id UUID REFERENCES public.profiles(id),
  location_name TEXT,
  latitude DECIMAL,
  longitude DECIMAL,
  image_url TEXT,
  notes TEXT,
  rarity TEXT,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.duck_sightings ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Sightings are viewable by everyone" ON public.duck_sightings
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own sightings" ON public.duck_sightings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sightings" ON public.duck_sightings
  FOR UPDATE USING (auth.uid() = user_id);
