export type ThemeId =
  | "cassette"
  | "press"
  | "vinyl"
  | "postage"
  | "sticker-bomb"
  | "archive"
  | "truck-art"
  | "riso"
  | "comic"
  | "bauhaus"
  | "star-chart"
  | "papercut"
  | "midnight"
  | "receipt"
  | "ticket"
  | "deco"
  | "gothic"
  | "y2k-chrome"
  | "ivory"
  | "obsidian"
  | "forest"
  | "burgundy"
  | "sand"
  | "slate"
  | "blush"
  | "ocean"
  | "graphite"
  | "plum"
  | "paper"
  | "apple"
  | "bmw"
  | "minecraft"
  | "luxury-craft"
  | "luxury"
  | "light"
  | "dark"
  | "gradient"
  | "minimal"
  | "colorful";

export type UserPlan = "free" | "pro";
export type PlanStatus = "active" | "cancelled" | "past_due" | "expired";
export type BillingInterval = "monthly" | "yearly";

export interface FeaturedCreator {
  id: string;
  name: string;
  url: string;
  avatar_url?: string | null;
  tagline?: string | null;
}

export interface Profile {
  id: string; // uuid matches auth.users.id
  username: string;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  theme: ThemeId;
  page_views: number;
  status_message?: string | null;
  status_style?: "speech" | "cloud" | "pixel" | null;
  featured_creators?: FeaturedCreator[] | null;
  plan: UserPlan;
  plan_status?: PlanStatus | null;
  billing_interval?: BillingInterval | null;
  current_period_end?: string | null;
  provider_customer_id?: string | null;
  provider_subscription_id?: string | null;
  spotlight_enabled?: boolean | null;
  created_at: string;
}

export interface LinkItem {
  id: string;
  user_id: string;
  url: string;
  title: string;
  platform: string | null;
  position: number;
  is_visible: boolean;
  click_count: number;
  badge?: string | null;
  custom_icon?: string | null;
  created_at: string;
}

export interface PlatformDefinition {
  id: string;
  name: string;
  domains: string[];
  icon: string;
  brandColor: string;
  textColor?: string;
  placeholder?: string;
}

export interface DetectedPlatform {
  platformId: string | null;
  name: string;
  icon: string;
  brandColor: string;
  textColor?: string;
  faviconUrl: string | null;
  normalizedUrl: string;
  isValid: boolean;
  domain: string;
}
