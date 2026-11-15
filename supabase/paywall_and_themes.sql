-- ==============================================================================
-- LINKLET FREE VS PRO PAYWALL & 12 THEMES SECURITY MIGRATION
-- ==============================================================================
-- Execute this script in your Supabase Dashboard -> SQL Editor
-- Enforces server-side limits, RLS policies, and prevents tampering with subscription plans.
-- ==============================================================================

-- 1. Add subscription columns to public.profiles
ALTER TABLE IF EXISTS public.profiles
  ADD COLUMN IF NOT EXISTS plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro')),
  ADD COLUMN IF NOT EXISTS plan_status TEXT DEFAULT 'active',
  ADD COLUMN IF NOT EXISTS billing_interval TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS current_period_end TIMESTAMPTZ DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS provider_customer_id TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS provider_subscription_id TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS spotlight_enabled BOOLEAN DEFAULT false;

-- 2. Add custom_icon and badge to public.links
ALTER TABLE IF EXISTS public.links
  ADD COLUMN IF NOT EXISTS custom_icon TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS badge TEXT DEFAULT NULL;

-- 3. Security Trigger: Protect Subscription Columns
-- Prevents regular authenticated users from elevating their own plan to 'pro'.
-- Only the service_role (webhooks/admin) is authorized to modify plan fields.
CREATE OR REPLACE FUNCTION public.protect_profile_subscription_fields()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $sub_protect_body$
BEGIN
  -- If not running as service_role, retain existing plan fields
  IF auth.role() IS DISTINCT FROM 'service_role' THEN
    NEW.plan := OLD.plan;
    NEW.plan_status := OLD.plan_status;
    NEW.billing_interval := OLD.billing_interval;
    NEW.current_period_end := OLD.current_period_end;
    NEW.provider_customer_id := OLD.provider_customer_id;
    NEW.provider_subscription_id := OLD.provider_subscription_id;

    -- Enforce: Free users cannot set Pro themes (reset to midnight)
    IF OLD.plan = 'free' AND NEW.theme NOT IN ('midnight', 'apple') THEN
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

-- 4. Database-level Enforcement: Max 3 Links on Free Plan
-- Rejects direct API insert attempts beyond 3 links for free users.
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
      RAISE EXCEPTION 'Free plan is limited to 3 links. Upgrade to Pro for unlimited links.'
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

-- 5. Fast index lookups
CREATE INDEX IF NOT EXISTS idx_profiles_plan ON public.profiles(plan);
CREATE INDEX IF NOT EXISTS idx_profiles_customer_id ON public.profiles(provider_customer_id);
