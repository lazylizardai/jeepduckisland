-- Insert some sample ducks
INSERT INTO public.ducks (serial_number, name, rarity, zone, qr_code, emoji_code, message, is_active)
VALUES
  ('DUCK-001', 'Quacky McQuackface', 'Common', 'Beach Cove', 'DUCK-001', '🦆', 'Quack is the new black!', true),
  ('DUCK-042', 'Golden Quacker', 'Legendary', 'Jeep Depot', 'DUCK-042', '👑', 'I am the one who quacks.', true),
  ('DUCK-017', 'Surf Duck', 'Rare', 'Lagoon', 'DUCK-017', '🌊', 'Hang ten, quack on!', true),
  ('DUCK-099', 'Alpine Explorer', 'Epic', 'Mountain Pass', 'DUCK-099', '⛰️', 'The peaks are calling.', true)
ON CONFLICT (serial_number) DO NOTHING;
