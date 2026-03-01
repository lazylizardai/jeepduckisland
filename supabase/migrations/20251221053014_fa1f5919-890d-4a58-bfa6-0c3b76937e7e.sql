-- Add game score saving function
CREATE OR REPLACE FUNCTION public.save_game_score(
  p_user_id UUID,
  p_game_type TEXT,
  p_score INTEGER,
  p_duration INTEGER DEFAULT NULL,
  p_level INTEGER DEFAULT 1,
  p_ducks_caught INTEGER DEFAULT 0,
  p_accuracy DECIMAL DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_quack_reward INTEGER;
  v_session_id UUID;
BEGIN
  -- Calculate QUACK reward based on score
  v_quack_reward := GREATEST(1, FLOOR(p_score / 100));
  
  -- Insert game session
  INSERT INTO public.game_sessions (
    user_id, game_type, score, duration_seconds,
    level_reached, ducks_caught, accuracy, quack_earned
  )
  VALUES (
    p_user_id, p_game_type, p_score, p_duration,
    p_level, p_ducks_caught, p_accuracy, v_quack_reward
  )
  RETURNING id INTO v_session_id;
  
  -- Award QUACK tokens
  UPDATE public.profiles
  SET
    quack_tokens = quack_tokens + v_quack_reward,
    xp = xp + GREATEST(1, FLOOR(p_score / 50)),
    level = GREATEST(1, FLOOR((xp + GREATEST(1, FLOOR(p_score / 50))) / 1000) + 1),
    updated_at = NOW()
  WHERE id = p_user_id;
  
  RETURN jsonb_build_object(
    'success', true,
    'session_id', v_session_id,
    'quack_earned', v_quack_reward
  );
END;
$$;
