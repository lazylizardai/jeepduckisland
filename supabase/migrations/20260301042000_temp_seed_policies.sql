-- Temporarily allow anon INSERT for seeding purposes
-- This migration adds INSERT policy for anon on ducks and duckchain_events

-- Allow anon to insert ducks (for seeding)
CREATE POLICY "Allow anon insert for seeding"
ON public.ducks FOR INSERT
WITH CHECK (true);

-- Allow anon to insert duckchain_events (for seeding, overriding auth requirement)
DROP POLICY IF EXISTS "Authenticated users can add validated duckchain events" ON public.duckchain_events;

CREATE POLICY "Allow anon insert for seeding events"
ON public.duckchain_events FOR INSERT
WITH CHECK (
  duck_id IS NOT NULL AND
  LENGTH(COALESCE(nickname, '')) <= 30 AND
  LENGTH(COALESCE(island_area, '')) <= 100
);

-- Also allow anon to update ducks (for chain_count updates)
CREATE POLICY "Allow anon update ducks for seeding"
ON public.ducks FOR UPDATE
USING (true)
WITH CHECK (true);
