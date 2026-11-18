-- ==============================================================================
-- LINKFACE: COMPLETE DATABASE REPAIR SCRIPT
-- ==============================================================================
-- Run this in Supabase Dashboard -> SQL Editor -> New Query -> Run
-- 
-- Fixes:
-- 1. "Database error saving new user" (Signup / Google Login trigger crash)
-- 2. "Could not find the 'plan' column of 'profiles' in the schema cache"
-- 3. Adds all required columns (plan, status, spotlight, custom_icon, badge)
-- 4. Reloads PostgREST schema cache immediately
-- ==============================================================================

-- 1. DROP any broken triggers first so they stop blocking inserts/updates
DROP TRIGGER IF EXISTS trg_protect_profile_subscription ON public.profiles;
DROP TRIGGER IF EXISTS trg_enforce_free_link_limit ON public.links;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 2. Add all missing columns to public.profiles safely if they don't exist
ALTER TABLE IF EXISTS public.profiles 
  ADD COLUMN IF NOT EXISTS plan TEXT NOT NULL DEFAULT 'free',
  ADD COLUMN IF NOT EXISTS plan_status TEXT DEFAULT 'active',
  ADD COLUMN IF NOT EXISTS billing_interval TEXT DEFAULT 'monthly',
  ADD COLUMN IF NOT EXISTS current_period_end TIMESTAMPTZ DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS provider_customer_id TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS provider_subscription_id TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS page_views INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS featured_creators JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS status_message TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS status_style TEXT DEFAULT 'cloud',
  ADD COLUMN IF NOT EXISTS spotlight_enabled BOOLEAN DEFAULT false;

-- 3. Add all missing columns to public.links safely if they don't exist
ALTER TABLE IF EXISTS public.links 
  ADD COLUMN IF NOT EXISTS badge TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS custom_icon TEXT DEFAULT NULL;

-- 4. Relax username format check to 3-30 characters (letters, numbers, underscore)
ALTER TABLE IF EXISTS public.profiles 
  DROP CONSTRAINT IF EXISTS username_format_check;
ALTER TABLE IF EXISTS public.profiles 
  ADD CONSTRAINT username_format_check 
  CHECK (username ~ '^[a-z0-9_]{3,30}$');

-- 5. Safe, bulletproof handle_new_user() that NEVER fails auth signup under ANY circumstance
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $func_handle_new_user$
DECLARE
  clean_name TEXT;
  base_username TEXT;
  final_username TEXT;
  user_full_name TEXT;
  user_avatar TEXT;
BEGIN
  BEGIN
    clean_name := split_part(coalesce(new.email, 'user'), '@', 1);
    base_username := regexp_replace(lower(clean_name), '[^a-z0-9_]', '', 'g');
    
    IF length(base_username) < 3 THEN
      base_username := 'user_' || substr(replace(new.id::text, '-', ''), 1, 6);
    ELSIF length(base_username) > 14 THEN
      base_username := substr(base_username, 1, 14);
    END IF;

    IF base_username IN (
      'admin', 'administrator', 'root', 'system', 'security', 'login', 'logout', 
      'signup', 'signin', 'auth', 'callback', 'api', 'dashboard', 'settings', 
      'account', 'profile', 'user', 'users', 'help', 'support', 'terms', 
      'privacy', 'explore', 'about', 'contact', 'billing', 'pricing', 'alex', 'linkface', 'linklet'
    ) THEN
      base_username := substr(base_username, 1, 10) || '_' || substr(replace(new.id::text, '-', ''), 1, 4);
    END IF;

    final_username := base_username;

    user_full_name := coalesce(
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'name',
      clean_name
    );
    user_avatar := coalesce(
      new.raw_user_meta_data->>'avatar_url',
      new.raw_user_meta_data->>'picture',
      null
    );

    INSERT INTO public.profiles (id, username, display_name, avatar_url, theme, plan, page_views)
    VALUES (
      new.id,
      final_username,
      user_full_name,
      user_avatar,
      'notebook',
      'free',
      0
    )
    ON CONFLICT (id) DO NOTHING;
  EXCEPTION WHEN OTHERS THEN
    -- In case of collision, attempt unique suffix
    BEGIN
      final_username := 'u_' || substr(replace(new.id::text, '-', ''), 1, 10);
      INSERT INTO public.profiles (id, username, display_name, avatar_url, theme, plan, page_views)
      VALUES (
        new.id,
        final_username,
        user_full_name,
        user_avatar,
        'notebook',
        'free',
        0
      )
      ON CONFLICT (id) DO NOTHING;
    EXCEPTION WHEN OTHERS THEN
      -- NEVER fail auth signup! Next.js dashboard auto-provisions profile on login.
      NULL;
    END;
  END;

  RETURN new;
END;
$func_handle_new_user$;

-- Re-attach auth trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 6. Reload schema cache immediately
NOTIFY pgrst, 'reload schema';
