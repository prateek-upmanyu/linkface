-- ==============================================================================
-- LINKFACE SPOTLIGHT & REAL-WORLD GEOLOCATION LINK CLICK ANALYTICS MIGRATION
-- ==============================================================================
-- Run this in Supabase Dashboard -> SQL Editor -> Run
-- Adds real-time click tracking with timestamp, country, and state/region,
-- plus Spotlight showcase database support.
-- ==============================================================================

-- 1. Ensure profiles table has spotlight_creators column
ALTER TABLE IF EXISTS public.profiles
  ADD COLUMN IF NOT EXISTS spotlight_creators JSONB DEFAULT '[]'::jsonb;

-- 2. Create link_clicks table for timestamp and real-life location analytics
CREATE TABLE IF NOT EXISTS public.link_clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  link_id UUID REFERENCES public.links(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  country_code VARCHAR(10) DEFAULT 'IN',
  country_name VARCHAR(100) DEFAULT 'India',
  region_state VARCHAR(100) DEFAULT 'Maharashtra',
  city VARCHAR(100) DEFAULT 'Mumbai',
  referrer TEXT DEFAULT NULL,
  user_agent TEXT DEFAULT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Indexes for fast dashboard query performance
CREATE INDEX IF NOT EXISTS idx_link_clicks_user_created ON public.link_clicks(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_link_clicks_link_created ON public.link_clicks(link_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_link_clicks_country ON public.link_clicks(country_name);
CREATE INDEX IF NOT EXISTS idx_link_clicks_state ON public.link_clicks(region_state);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.link_clicks ENABLE ROW LEVEL SECURITY;

-- 5. Policies
-- Visitors (unauthenticated or authenticated) can insert click records
DROP POLICY IF EXISTS "Public can record link clicks" ON public.link_clicks;
CREATE POLICY "Public can record link clicks"
  ON public.link_clicks FOR INSERT
  WITH CHECK (true);

-- Authenticated creators can view click analytics for their own links
DROP POLICY IF EXISTS "Users can view their own link click analytics" ON public.link_clicks;
CREATE POLICY "Users can view their own link click analytics"
  ON public.link_clicks FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);
