-- Function to record a duck scan and award points
CREATE OR REPLACE FUNCTION public.record_duck_scan(
  p_duck_qr_code TEXT,
  p_user_id UUID,
  p_location TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_duck public.ducks%ROWTYPE;
  v_points INTEGER;
  v_xp INTEGER;
BEGIN
  -- Get duck
  SELECT * INTO v_duck FROM public.ducks WHERE qr_code = p_duck_qr_code AND is_active = true;
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Duck not found');
  END IF;
  
  -- Calculate points based on rarity
  v_points := CASE v_duck.rarity
    WHEN 'Common' THEN 10
    WHEN 'Uncommon' THEN 25
    WHEN 'Rare' THEN 100
    WHEN 'Epic' THEN 250
    WHEN 'Legendary' THEN 500
    ELSE 10
  END;
  
  v_xp := v_points * 2;
  
  -- Record sighting
  INSERT INTO public.duck_sightings (duck_id, user_id, location_name, rarity, verified)
  VALUES (v_duck.id, p_user_id, p_location, v_duck.rarity, true);
  
  -- Award points to user
  UPDATE public.profiles
  SET 
    quack_tokens = quack_tokens + v_points,
    ducks_spotted = ducks_spotted + 1,
    xp = xp + v_xp,
    level = GREATEST(1, FLOOR((xp + v_xp) / 1000) + 1),
    updated_at = NOW()
  WHERE id = p_user_id;
  
  RETURN jsonb_build_object(
    'success', true,
    'duck', row_to_json(v_duck),
    'points_earned', v_points,
    'xp_earned', v_xp
  );
END;
$$;
