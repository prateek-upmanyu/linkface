export type ThemeId =
  | "luxury"
  | "minecraft"
  | "luxury-craft"
  | "light"
  | "dark"
  | "gradient"
  | "minimal"
  | "colorful";

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
  featured_creators?: FeaturedCreator[] | null;
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
