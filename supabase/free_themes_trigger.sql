-- ==============================================================================
-- LINKFACE: UPDATE FREE THEME ENFORCEMENT TRIGGER (NOTEBOOK, PASTEL, CONSOLE)
-- ==============================================================================
-- Run this in Supabase Dashboard -> SQL Editor -> Run
-- Ensures free accounts and downgraded accounts are strictly restricted to
-- 'notebook', 'pastel', or 'console', defaulting to 'notebook'.
-- ==============================================================================

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

    -- Enforce: Free users cannot set Pro themes (default fallback to notebook)
    IF OLD.plan = 'free' AND NEW.theme NOT IN ('notebook', 'pastel', 'console') THEN
      NEW.theme := 'notebook';
    END IF;

    -- Enforce: Free users cannot enable cursor glow / spotlight
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
