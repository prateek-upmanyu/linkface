-- ==============================================================================
-- LINKLET PRODUCTION SECURITY HARDENING & ROW LEVEL SECURITY (RLS) MIGRATION
-- ==============================================================================
-- Execute this entire script in your Supabase SQL Editor:
-- Dashboard -> SQL Editor -> New Query -> Paste & Run
-- ==============================================================================

-- 1. Ensure required columns exist
ALTER TABLE IF EXISTS public.profiles
  ADD COLUMN IF NOT EXISTS featured_creators JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS status_message TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS status_style TEXT DEFAULT 'cloud';

ALTER TABLE IF EXISTS public.links
  ADD COLUMN IF NOT EXISTS badge TEXT DEFAULT NULL;

-- 2. Enforce strict username constraints
ALTER TABLE IF EXISTS public.profiles 
  DROP CONSTRAINT IF EXISTS username_format_check;
ALTER TABLE IF EXISTS public.profiles 
  ADD CONSTRAINT username_format_check 
  CHECK (username ~ '^[a-z0-9_]{3,20}$');

ALTER TABLE IF EXISTS public.profiles 
  DROP CONSTRAINT IF EXISTS username_not_reserved;
ALTER TABLE IF EXISTS public.profiles 
  ADD CONSTRAINT username_not_reserved 
  CHECK (username NOT IN (
    'admin', 'administrator', 'root', 'system', 'security', 'login', 'logout', 
    'signup', 'signin', 'auth', 'callback', 'api', 'dashboard', 'settings', 
    'account', 'profile', 'user', 'users', 'help', 'support', 'terms', 
    'privacy', 'explore', 'about', 'contact', 'billing', 'pricing', 'alex', 'linklet'
  ));

-- 3. ENABLE ROW LEVEL SECURITY ON EVERY TABLE
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.links ENABLE ROW LEVEL SECURITY;

-- 4. CLEANUP EXISTING POLICIES TO AVOID DUPLICATES OR CONFLICTS
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;
DROP POLICY IF EXISTS "Users can delete own profile." ON public.profiles;
DROP POLICY IF EXISTS "Anyone can view visible links." ON public.links;
DROP POLICY IF EXISTS "Users can insert their own links." ON public.links;
DROP POLICY IF EXISTS "Users can update their own links." ON public.links;
DROP POLICY IF EXISTS "Users can delete their own links." ON public.links;

-- 5. HARDENED POLICIES FOR PROFILES
-- Public SELECT: anyone can view profile details for rendering public pages
CREATE POLICY "Public profiles are viewable by everyone."
  ON public.profiles FOR SELECT
  USING (true);

-- Authenticated INSERT: users can only create a profile with their own auth.uid()
CREATE POLICY "Users can insert their own profile."
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Authenticated UPDATE: users can only update their own profile row
CREATE POLICY "Users can update own profile."
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Authenticated DELETE: users can only delete their own profile
CREATE POLICY "Users can delete own profile."
  ON public.profiles FOR DELETE
  TO authenticated
  USING (auth.uid() = id);

-- 6. HARDENED POLICIES FOR LINKS
-- Public SELECT: unauthenticated visitors only see is_visible = true; owners see all their links
CREATE POLICY "Anyone can view visible links."
  ON public.links FOR SELECT
  USING (is_visible = true OR auth.uid() = user_id);

-- Authenticated INSERT: links must belong to the authenticated user
CREATE POLICY "Users can insert their own links."
  ON public.links FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Authenticated UPDATE: only owners can update their own links
CREATE POLICY "Users can update own links."
  ON public.links FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Authenticated DELETE: only owners can delete their own links
CREATE POLICY "Users can delete own links."
  ON public.links FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- 7. SECURE RPC INCREMENT FUNCTIONS (ATOMIC & TAMPER-PROOF)
-- These allow unauthenticated visitors to trigger increment counters without direct table WRITE access.
CREATE OR REPLACE FUNCTION public.increment_link_clicks(link_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.links
  SET click_count = click_count + 1
  WHERE id = link_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.increment_page_views(profile_username TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.profiles
  SET page_views = page_views + 1
  WHERE username = LOWER(TRIM(profile_username));
END;
$$;

-- Grant EXECUTE permission on RPC functions to anon and authenticated
GRANT EXECUTE ON FUNCTION public.increment_link_clicks(UUID) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.increment_page_views(TEXT) TO anon, authenticated;

-- 8. STORAGE BUCKET CREATION & USER FOLDER ISOLATION POLICIES
-- Create avatars bucket with size limit (2MB) and allowed image types
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true,
  2097152, -- 2MB
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 2097152,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp'];

-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Clean storage policies
DROP POLICY IF EXISTS "Public avatars are viewable by everyone" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own avatar" ON storage.objects;

-- Storage Policy: Public Read
CREATE POLICY "Public avatars are viewable by everyone"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

-- Storage Policy: Authenticated users can only upload into their own folder: avatars/<user_id>/*
CREATE POLICY "Users can upload their own avatar"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'avatars' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Storage Policy: Users can only update their own avatars
CREATE POLICY "Users can update their own avatar"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'avatars' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Storage Policy: Users can only delete their own avatars
CREATE POLICY "Users can delete their own avatar"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'avatars' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );
