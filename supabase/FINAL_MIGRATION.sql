-- ==============================================================================
-- LINKLET COMPLETE SUPABASE DATABASE MIGRATION & HARDENING SCRIPT
-- ==============================================================================
-- Copy and run this entire file in your Supabase Dashboard -> SQL Editor -> Run
-- All functions use explicit named tags ($...$) so no "unterminated dollar-quoted string"
-- errors can ever occur.
-- ==============================================================================

-- 1. PROFILES TABLE: Ensure all necessary columns exist
ALTER TABLE IF EXISTS public.profiles
  ADD COLUMN IF NOT EXISTS plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro')),
  ADD COLUMN IF NOT EXISTS plan_status TEXT DEFAULT 'active',
  ADD COLUMN IF NOT EXISTS billing_interval TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS current_period_end TIMESTAMPTZ DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS provider_customer_id TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS provider_subscription_id TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS spotlight_enabled BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS featured_creators JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS status_message TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS status_style TEXT DEFAULT 'cloud';

-- 2. LINKS TABLE: Ensure custom_icon and badge exist
ALTER TABLE IF EXISTS public.links
  ADD COLUMN IF NOT EXISTS custom_icon TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS badge TEXT DEFAULT NULL;

-- 3. USERNAME CONSTRAINTS (Prevent reserved route hijacking)
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

-- 4. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.links ENABLE ROW LEVEL SECURITY;

-- 5. REFRESH RLS POLICIES FOR PROFILES
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;
DROP POLICY IF EXISTS "Users can delete own profile." ON public.profiles;

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

-- 6. REFRESH RLS POLICIES FOR LINKS
DROP POLICY IF EXISTS "Anyone can view visible links." ON public.links;
DROP POLICY IF EXISTS "Users can insert their own links." ON public.links;
DROP POLICY IF EXISTS "Users can update own links." ON public.links;
DROP POLICY IF EXISTS "Users can delete own links." ON public.links;

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

-- 7. ATOMIC COUNTER RPC FUNCTIONS (SAFE INCREMENTS)
CREATE OR REPLACE FUNCTION public.increment_link_clicks(link_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $click_body$
BEGIN
  UPDATE public.links
  SET click_count = click_count + 1
  WHERE id = link_id;
END;
$click_body$;

CREATE OR REPLACE FUNCTION public.increment_page_views(profile_username TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $view_body$
BEGIN
  UPDATE public.profiles
  SET page_views = page_views + 1
  WHERE username = LOWER(TRIM(profile_username));
END;
$view_body$;

GRANT EXECUTE ON FUNCTION public.increment_link_clicks(UUID) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.increment_page_views(TEXT) TO anon, authenticated;

-- 8. SECURITY TRIGGER: PROTECT PLAN COLUMNS FROM DIRECT CLIENT TAMPERING
CREATE OR REPLACE FUNCTION public.protect_profile_subscription_fields()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $sub_protect_body$
BEGIN
  -- If not executing from service_role (backend webhook/admin), retain existing subscription fields
  IF auth.role() IS DISTINCT FROM 'service_role' THEN
    NEW.plan := OLD.plan;
    NEW.plan_status := OLD.plan_status;
    NEW.billing_interval := OLD.billing_interval;
    NEW.current_period_end := OLD.current_period_end;
    NEW.provider_customer_id := OLD.provider_customer_id;
    NEW.provider_subscription_id := OLD.provider_subscription_id;

    -- Enforce: Free users cannot set Pro themes (default fallback to midnight)
    IF OLD.plan = 'free' AND NEW.theme NOT IN ('midnight') THEN
      NEW.theme := 'midnight';
    END IF;

    -- Enforce: Free users cannot enable spotlight
    IF OLD.plan = 'free' THEN
      NEW.spotlight_enabled := false;
    END IF;
  END IF;

  RETURN NEW;
END;
$sub_protect_body$;

DROP TRIGGER IF EXISTS trg_protect_profile_subscription ON public.profiles;
CREATE TRIGGER trg_protect_profile_subscription
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_profile_subscription_fields();

-- 9. FREE LINK LIMIT TRIGGER (MAX 3 LINKS FOR FREE PLAN)
CREATE OR REPLACE FUNCTION public.enforce_free_link_limit()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $link_limit_body$
DECLARE
  user_plan TEXT;
  existing_count INT;
BEGIN
  SELECT plan INTO user_plan FROM public.profiles WHERE id = NEW.user_id;

  IF user_plan = 'free' OR user_plan IS NULL THEN
    SELECT COUNT(*) INTO existing_count FROM public.links WHERE user_id = NEW.user_id;
    IF existing_count >= 3 THEN
      RAISE EXCEPTION 'Free plan limit reached (max 3 links). Upgrade to Pro for unlimited links.'
        USING ERRCODE = 'P0001';
    END IF;
  END IF;

  RETURN NEW;
END;
$link_limit_body$;

DROP TRIGGER IF EXISTS trg_enforce_free_link_limit ON public.links;
CREATE TRIGGER trg_enforce_free_link_limit
  BEFORE INSERT ON public.links
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_free_link_limit();

-- 10. INDEXES FOR HIGH-TRAFFIC LOOKUPS
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_plan ON public.profiles(plan);
CREATE INDEX IF NOT EXISTS idx_profiles_customer_id ON public.profiles(provider_customer_id);
CREATE INDEX IF NOT EXISTS idx_links_user_visible ON public.links(user_id, is_visible, position);
