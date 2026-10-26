-- New Supabase projects may not grant table access by default. The central
-- API reads only the verified user's profile with their authenticated JWT.
-- Keep the existing "Users can read own profile" RLS policy unchanged.
grant select on table public.profiles to authenticated;
