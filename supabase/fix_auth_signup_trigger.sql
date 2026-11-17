-- ==============================================================================
-- FIX FOR "Database error saving new user" IN SUPABASE AUTH
-- ==============================================================================
-- Run this in Supabase Dashboard -> SQL Editor -> Run
-- ==============================================================================

-- 1. Relax username constraint to 3-30 chars to match application code
ALTER TABLE IF EXISTS public.profiles 
  DROP CONSTRAINT IF EXISTS username_format_check;
ALTER TABLE IF EXISTS public.profiles 
  ADD CONSTRAINT username_format_check 
  CHECK (username ~ '^[a-z0-9_]{3,30}$');

-- 2. Bulletproof handle_new_user function that NEVER fails auth.users signup
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
  -- Extract prefix from email or auth metadata
  clean_name := split_part(coalesce(new.email, 'user'), '@', 1);
  -- Keep alphanumeric and underscore
  base_username := regexp_replace(lower(clean_name), '[^a-z0-9_]', '', 'g');
  
  -- Truncate base to 14 chars so suffix fits safely within 30 chars
  IF length(base_username) < 3 THEN
    base_username := 'user_' || substr(replace(new.id::text, '-', ''), 1, 6);
  ELSIF length(base_username) > 14 THEN
    base_username := substr(base_username, 1, 14);
  END IF;

  -- Ensure not reserved
  IF base_username IN (
    'admin', 'administrator', 'root', 'system', 'security', 'login', 'logout', 
    'signup', 'signin', 'auth', 'callback', 'api', 'dashboard', 'settings', 
    'account', 'profile', 'user', 'users', 'help', 'support', 'terms', 
    'privacy', 'explore', 'about', 'contact', 'billing', 'pricing', 'alex', 'linkface', 'linklet'
  ) THEN
    base_username := substr(base_username, 1, 10) || '_' || substr(replace(new.id::text, '-', ''), 1, 4);
  END IF;

  final_username := base_username;

  -- Extract display name and avatar
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

  -- Safe insert with automatic collision resolution & catch-all
  BEGIN
    INSERT INTO public.profiles (id, username, display_name, avatar_url, theme)
    VALUES (
      new.id,
      final_username,
      user_full_name,
      user_avatar,
      'notebook'
    )
    ON CONFLICT (id) DO NOTHING;
  EXCEPTION 
    WHEN unique_violation THEN
      -- On username collision, append unique short suffix
      BEGIN
        final_username := substr(base_username, 1, 12) || '_' || substr(replace(new.id::text, '-', ''), 1, 6);
        INSERT INTO public.profiles (id, username, display_name, avatar_url, theme)
        VALUES (
          new.id,
          final_username,
          user_full_name,
          user_avatar,
          'notebook'
        )
        ON CONFLICT (id) DO NOTHING;
      EXCEPTION WHEN OTHERS THEN
        -- Even if profile insert fails here, NEVER fail the auth signup!
        -- Next.js dashboard auto-provisions missing profile on login.
        NULL;
      END;
    WHEN OTHERS THEN
      -- NEVER abort the auth transaction!
      NULL;
  END;

  RETURN new;
END;
$func_handle_new_user$;

-- 3. Re-attach trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
