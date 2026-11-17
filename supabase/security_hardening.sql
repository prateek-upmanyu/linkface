-- ==============================================================================
-- LINKFACE ROW LEVEL SECURITY (RLS) & RPC HARDENING
-- ==============================================================================
-- Run this in your Supabase Dashboard -> SQL Editor
-- All functions use explicit tags ($click_body$, $view_body$) to prevent parser errors.
-- ==============================================================================

-- 1. Ensure required columns exist
ALTER TABLE IF EXISTS public.profiles
  ADD COLUMN IF NOT EXISTS featured_creators JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS status_message TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS status_style TEXT DEFAULT 'cloud';

ALTER TABLE IF EXISTS public.links
  ADD COLUMN IF NOT EXISTS badge TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS custom_icon TEXT DEFAULT NULL;

-- 2. Enforce username constraints and block reserved system keywords
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
    'privacy', 'explore', 'about', 'contact', 'billing', 'pricing', 'alex', 'linkface', 'linklet'
  ));

-- 3. ENABLE ROW LEVEL SECURITY ON EVERY TABLE
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.links ENABLE ROW LEVEL SECURITY;

-- 4. CLEANUP EXISTING POLICIES
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;
DROP POLICY IF EXISTS "Users can delete own profile." ON public.profiles;
DROP POLICY IF EXISTS "Anyone can view visible links." ON public.links;
DROP POLICY IF EXISTS "Users can insert their own links." ON public.links;
DROP POLICY IF EXISTS "Users can update their own links." ON public.links;
DROP POLICY IF EXISTS "Users can delete their own links." ON public.links;

-- 5. HARDENED POLICIES FOR PROFILES
CREATE POLICY "Public profiles are viewable by everyone."
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile."
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile."
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete own profile."
  ON public.profiles FOR DELETE
  TO authenticated
  USING (auth.uid() = id);

-- 6. HARDENED POLICIES FOR LINKS
CREATE POLICY "Anyone can view visible links."
  ON public.links FOR SELECT
  USING (is_visible = true OR auth.uid() = user_id);

CREATE POLICY "Users can insert their own links."
  ON public.links FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own links."
  ON public.links FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own links."
  ON public.links FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- 7. SECURE ATOMIC RPC COUNTERS (NO DIRECT TABLE WRITE NEEDED)
-- Explicitly tagged with $click_body$ and $view_body$ to prevent "unterminated dollar-quoted string" errors
CREATE OR REPLACE FUNCTION public.increment_link_clicks(link_id UUID)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $click_body$
  UPDATE public.links
  SET click_count = click_count + 1
  WHERE id = link_id;
$click_body$;

CREATE OR REPLACE FUNCTION public.increment_page_views(profile_username TEXT)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $view_body$
  UPDATE public.profiles
  SET page_views = page_views + 1
  WHERE username = LOWER(TRIM(profile_username));
$view_body$;

-- Grant execution permissions to visitors and members
GRANT EXECUTE ON FUNCTION public.increment_link_clicks(UUID) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.increment_page_views(TEXT) TO anon, authenticated;
