-- Remove the overly permissive UPDATE policy on ducks
DROP POLICY IF EXISTS "Owners can update their ducks" ON public.ducks;
