-- Create a SECURITY DEFINER seeding function
-- This bypasses RLS when called via the anon key

CREATE OR REPLACE FUNCTION public.seed_demo_data()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  seed_ducks JSONB := '[
    {"duck_id": "QJ-0001", "name": "Kwak de Ontdekker",     "type": "Gewone Duck"},
    {"duck_id": "QJ-0002", "name": "Sunny Surfer",           "type": "Gewone Duck"},
    {"duck_id": "QJ-0003", "name": "Beach Bum Bobby",        "type": "Gewone Duck"},
    {"duck_id": "QJ-0004", "name": "Reef Rider",             "type": "Gewone Duck"},
    {"duck_id": "QJ-0005", "name": "Wave Watcher",           "type": "Gewone Duck"},
    {"duck_id": "QJ-0006", "name": "Coral Queen",            "type": "Gewone Duck"},
    {"duck_id": "QJ-0007", "name": "Dushi Duck",             "type": "Gewone Duck"},
    {"duck_id": "QJ-0008", "name": "Bon Bini Buddy",         "type": "Gewone Duck"},
    {"duck_id": "QJ-0009", "name": "Playa Patito",           "type": "Gewone Duck"},
    {"duck_id": "QJ-0010", "name": "Kas di Kwak",            "type": "Gewone Duck"},
    {"duck_id": "QJ-0011", "name": "Handelskade Hero",       "type": "Gewone Duck"},
    {"duck_id": "QJ-0012", "name": "Punda Paddler",          "type": "Gewone Duck"},
    {"duck_id": "QJ-0013", "name": "Jan Thiel Jumper",       "type": "Gewone Duck"},
    {"duck_id": "QJ-0014", "name": "Mambo Mover",            "type": "Gewone Duck"},
    {"duck_id": "QJ-0015", "name": "Westpunt Wanderer",      "type": "Gewone Duck"},
    {"duck_id": "QJ-0016", "name": "Pietermaai Piraat",      "type": "Gewone Duck"},
    {"duck_id": "QJ-0017", "name": "Lagun Lurker",           "type": "Gewone Duck"},
    {"duck_id": "QJ-0018", "name": "Banda Abou Blaffer",     "type": "Gewone Duck"},
    {"duck_id": "QJ-0019", "name": "Knip Kwakker",           "type": "Gewone Duck"},
    {"duck_id": "QJ-0020", "name": "Willemstad Wapper",      "type": "Gewone Duck"},
    {"duck_id": "QJ-0021", "name": "Salina Swimmer",         "type": "Gewone Duck"},
    {"duck_id": "QJ-0022", "name": "Brievengat Baller",      "type": "Gewone Duck"},
    {"duck_id": "QJ-0023", "name": "Caracasbaai Cruiser",    "type": "Gewone Duck"},
    {"duck_id": "QJ-0024", "name": "Porto Mari Patrouille",  "type": "Gewone Duck"},
    {"duck_id": "QJ-0025", "name": "Sint Joris Surfer",      "type": "Gewone Duck"},
    {"duck_id": "QJ-0026", "name": "Bullenbaai Bijter",      "type": "Gewone Duck"},
    {"duck_id": "QJ-0027", "name": "Fuik Bay Flipper",       "type": "Gewone Duck"},
    {"duck_id": "QJ-0028", "name": "Rif Rambler",            "type": "Gewone Duck"},
    {"duck_id": "QJ-0029", "name": "Juliana Jumper",         "type": "Gewone Duck"},
    {"duck_id": "QJ-0030", "name": "Spaans Water Spetter",   "type": "Gewone Duck"},
    {"duck_id": "QJ-0031", "name": "Groot Knip Gapper",      "type": "Gewone Duck"},
    {"duck_id": "QJ-0032", "name": "Klein Knip Kwakker",     "type": "Gewone Duck"},
    {"duck_id": "QJ-0033", "name": "Sabana Abao Schipper",   "type": "Gewone Duck"},
    {"duck_id": "QJ-0034", "name": "Soto Surfer",            "type": "Gewone Duck"},
    {"duck_id": "QJ-0035", "name": "Kokomo Kwak",            "type": "Gewone Duck"},
    {"duck_id": "QJ-0036", "name": "Premium Patito",         "type": "Premium Duck"},
    {"duck_id": "QJ-0037", "name": "Gouden Gaper",           "type": "Premium Duck"},
    {"duck_id": "QJ-0038", "name": "Turquoise Tijger",       "type": "Premium Duck"},
    {"duck_id": "QJ-0039", "name": "Lagoen Leider",          "type": "Premium Duck"},
    {"duck_id": "QJ-0040", "name": "Divi Divi Ducky",        "type": "Premium Duck"},
    {"duck_id": "QJ-0041", "name": "Karibische Kroon",       "type": "Premium Duck"},
    {"duck_id": "QJ-0042", "name": "Flamingo Flapperaar",    "type": "Premium Duck"},
    {"duck_id": "QJ-0043", "name": "Aloe Admiraal",          "type": "Premium Duck"},
    {"duck_id": "QJ-0044", "name": "Watapana Wandelaar",     "type": "Premium Duck"},
    {"duck_id": "QJ-0045", "name": "Sonnenblume Supreme",    "type": "Premium Duck"},
    {"duck_id": "QJ-0046", "name": "Elite Emilio",           "type": "Elite Duck"},
    {"duck_id": "QJ-0047", "name": "Diamant Duiker",         "type": "Elite Duck"},
    {"duck_id": "QJ-0048", "name": "Goud en Glorie",         "type": "Elite Duck"},
    {"duck_id": "QJ-0049", "name": "Koninklijke Kwak",       "type": "Elite Duck"},
    {"duck_id": "QJ-0050", "name": "De Grote Patito",        "type": "Elite Duck"}
  ]';
  duck_rec JSONB;
  duck_count INTEGER;
  event_count INTEGER;
BEGIN
  -- Upsert all 50 ducks
  FOR duck_rec IN SELECT * FROM jsonb_array_elements(seed_ducks)
  LOOP
    INSERT INTO public.ducks (duck_id, name, type, chain_count, current_owner_id)
    VALUES (
      duck_rec->>'duck_id',
      duck_rec->>'name',
      duck_rec->>'type',
      0,
      NULL
    )
    ON CONFLICT (duck_id) DO UPDATE SET
      name = EXCLUDED.name,
      type = EXCLUDED.type;
  END LOOP;

  -- Seed duckchain_events (only insert if not already seeded)
  SELECT COUNT(*) INTO event_count FROM public.duckchain_events;
  IF event_count = 0 THEN
    INSERT INTO public.duckchain_events (duck_id, nickname, island_area) VALUES
      ('QJ-0001', 'Michi', '\U0001f4cd Mambo Beach'),
      ('QJ-0001', 'Renzo', '\U0001f3d6\ufe0f Strand'),
      ('QJ-0002', 'Anoniem', '\U0001f4cd Punda'),
      ('QJ-0002', 'Lisa van Curazao', '\U0001f3d9\ufe0f Stad'),
      ('QJ-0003', 'Tommy', '\U0001f4cd Jan Thiel'),
      ('QJ-0003', 'Anoniem', '\U0001f4cd Westpunt'),
      ('QJ-0004', 'Carlos', '\U0001f3d6\ufe0f Strand'),
      ('QJ-0004', 'Bianca', '\U0001f4cd Pietermaai'),
      ('QJ-0005', 'DuckFan99', '\U0001f4cd Mambo Beach'),
      ('QJ-0005', 'Anoniem', '\U0001f3d9\ufe0f Stad'),
      ('QJ-0006', 'Jeep Squad', '\U0001f4cd Jan Thiel'),
      ('QJ-0007', 'Kwakker', '\U0001f4cd Punda'),
      ('QJ-0007', 'Anoniem', '\U0001f3d6\ufe0f Strand'),
      ('QJ-0008', 'Susy', '\U0001f4cd Westpunt'),
      ('QJ-0009', 'Marco', '\U0001f4cd Pietermaai'),
      ('QJ-0009', 'Anoniem', '\U0001f3d9\ufe0f Stad'),
      ('QJ-0010', 'Dushi', '\U0001f4cd Mambo Beach'),
      ('QJ-0010', 'Anoniem', '\U0001f4cd Jan Thiel');
  END IF;

  -- Update chain_count for ducks with events
  UPDATE public.ducks SET chain_count = 2 WHERE duck_id IN ('QJ-0001','QJ-0002','QJ-0003','QJ-0004','QJ-0005','QJ-0007','QJ-0009','QJ-0010');
  UPDATE public.ducks SET chain_count = 1 WHERE duck_id IN ('QJ-0006','QJ-0008');

  SELECT COUNT(*) INTO duck_count FROM public.ducks;
  RETURN 'Seeded ' || duck_count || ' ducks and events';
END;
$$;

-- Grant execute to anon so it can be called via REST
GRANT EXECUTE ON FUNCTION public.seed_demo_data() TO anon;
