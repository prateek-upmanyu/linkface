-- ==============================================================================
-- Supabase Schema for Linktree MVP
-- Profiles, Links, Row-Level Security (RLS), and Helper RPC Functions
-- ==============================================================================

-- 1. Create PROFILES table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  theme TEXT NOT NULL DEFAULT 'light',
  page_views INTEGER NOT NULL DEFAULT 0,
  featured_creators JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Constraints on username (lowercase alphanumeric + underscore, 3-20 chars)
ALTER TABLE public.profiles 
  DROP CONSTRAINT IF EXISTS username_format_check;
ALTER TABLE public.profiles 
  ADD CONSTRAINT username_format_check 
  CHECK (username ~ '^[a-z0-9_]{3,20}$');

-- Block reserved usernames at database level
ALTER TABLE public.profiles 
  DROP CONSTRAINT IF EXISTS username_not_reserved;
ALTER TABLE public.profiles 
  ADD CONSTRAINT username_not_reserved 
  CHECK (username NOT IN (
    'admin', 'administrator', 'root', 'login', 'signup', 'signin', 'auth', 
    'api', 'dashboard', 'settings', 'account', 'profile', 'user', 'help', 
    'support', 'terms', 'privacy', 'explore', 'about', 'contact', 'billing'
  ));

-- 2. Create LINKS table
CREATE TABLE IF NOT EXISTS public.links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  platform TEXT,
  position INTEGER NOT NULL DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  click_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. Indexes for fast query lookups
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);
CREATE INDEX IF NOT EXISTS idx_links_user_id ON public.links(user_id);
CREATE INDEX IF NOT EXISTS idx_links_position ON public.links(user_id, position ASC);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.links ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies for PROFILES
-- Anyone can view profiles (public link-in-bio)
CREATE POLICY "Public profiles are viewable by everyone."
  ON public.profiles FOR SELECT
  USING (true);

-- Authenticated users can insert their own profile
CREATE POLICY "Users can insert their own profile."
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Authenticated users can update their own profile
CREATE POLICY "Users can update own profile."
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Authenticated users can delete own profile
CREATE POLICY "Users can delete own profile."
  ON public.profiles FOR DELETE
  USING (auth.uid() = id);

-- 6. RLS Policies for LINKS
-- Anyone can view visible links for a profile
CREATE POLICY "Anyone can view visible links."
  ON public.links FOR SELECT
  USING (is_visible = true OR auth.uid() = user_id);

-- Authenticated users can insert their own links
CREATE POLICY "Users can insert their own links."
  ON public.links FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Authenticated users can update their own links
CREATE POLICY "Users can update their own links."
  ON public.links FOR UPDATE
  USING (auth.uid() = user_id);

-- Authenticated users can delete their own links
CREATE POLICY "Users can delete their own links."
  ON public.links FOR DELETE
  USING (auth.uid() = user_id);

-- 7. Secure RPC Functions for Public Counters (Atomic Increments)
-- Increments link click count securely without needing write privileges to the links table
CREATE OR REPLACE FUNCTION public.increment_link_clicks(link_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.links
  SET click_count = click_count + 1
  WHERE id = link_id;
END;
$$;

-- Increments profile page view counter securely
CREATE OR REPLACE FUNCTION public.increment_page_views(profile_username TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.profiles
  SET page_views = page_views + 1
  WHERE username = LOWER(profile_username);
END;
$$;

-- 8. Optional: Trigger to auto-create profile stub on Supabase Auth signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  initial_username TEXT;
  clean_name TEXT;
BEGIN
  -- Extract prefix from email or auth metadata
  clean_name := split_part(new.email, '@', 1);
  -- Keep alphanumeric and underscore
  initial_username := regexp_replace(lower(clean_name), '[^a-z0-9_]', '', 'g');
  
  -- If empty or too short, fallback to user_ + first 6 chars of id
  IF length(initial_username) < 3 THEN
    initial_username := 'user_' || substr(new.id::text, 1, 6);
  END IF;

  -- Ensure not reserved
  IF initial_username IN ('admin', 'login', 'api', 'dashboard', 'settings', 'auth', 'signup') THEN
    initial_username := initial_username || '_' || substr(new.id::text, 1, 4);
  END IF;

  -- Attempt insert with fallback if unique constraint conflicts
  BEGIN
    INSERT INTO public.profiles (id, username, display_name, avatar_url, theme)
    VALUES (
      new.id,
      initial_username,
      coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', clean_name),
      coalesce(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture', null),
      'light'
    );
  EXCEPTION WHEN unique_violation THEN
    -- Append unique suffix on collision
    INSERT INTO public.profiles (id, username, display_name, avatar_url, theme)
    VALUES (
      new.id,
      initial_username || '_' || substr(new.id::text, 1, 4),
      clean_name,
      null,
      'light'
    );
  END;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Ensure featured_creators column exists on profiles table
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS featured_creators JSONB DEFAULT '[]'::jsonb;

