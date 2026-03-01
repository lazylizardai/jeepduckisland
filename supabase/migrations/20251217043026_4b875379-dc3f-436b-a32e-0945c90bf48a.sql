-- Create storage bucket for duckshots
INSERT INTO storage.buckets (id, name, public) 
VALUES ('duckshots', 'duckshots', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage bucket for avatars
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for duckshots
CREATE POLICY "Anyone can view duckshots" ON storage.objects
  FOR SELECT USING (bucket_id = 'duckshots');

CREATE POLICY "Authenticated users can upload duckshots" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'duckshots' AND auth.role() = 'authenticated');

CREATE POLICY "Anyone can upload duckshots" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'duckshots');

-- Storage policies for avatars
CREATE POLICY "Anyone can view avatars" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own avatar" ON storage.objects
  FOR UPDATE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
