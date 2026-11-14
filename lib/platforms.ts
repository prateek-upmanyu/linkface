import { PlatformDefinition, DetectedPlatform } from "@/types";

/**
 * 55+ Supported Platforms with domains, official brand colors, and icon identifiers.
 * This file is isolated and simple to extend with new platforms.
 */
export const PLATFORMS: PlatformDefinition[] = [
  // Social Media
  {
    id: "instagram",
    name: "Instagram",
    domains: ["instagram.com", "instagr.am"],
    icon: "Instagram",
    brandColor: "#E1306C",
  },
  {
    id: "youtube",
    name: "YouTube",
    domains: ["youtube.com", "youtu.be"],
    icon: "Youtube",
    brandColor: "#FF0000",
  },
  {
    id: "twitter",
    name: "X (Twitter)",
    domains: ["twitter.com", "x.com"],
    icon: "Twitter",
    brandColor: "#000000",
  },
  {
    id: "facebook",
    name: "Facebook",
    domains: ["facebook.com", "fb.com", "fb.me"],
    icon: "Facebook",
    brandColor: "#1877F2",
  },
  {
    id: "threads",
    name: "Threads",
    domains: ["threads.net"],
    icon: "AtSign",
    brandColor: "#000000",
  },
  {
    id: "tiktok",
    name: "TikTok",
    domains: ["tiktok.com"],
    icon: "Video",
    brandColor: "#000000",
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    domains: ["linkedin.com"],
    icon: "Linkedin",
    brandColor: "#0A66C2",
  },
  {
    id: "snapchat",
    name: "Snapchat",
    domains: ["snapchat.com"],
    icon: "Ghost",
    brandColor: "#FFFC00",
    textColor: "#000000",
  },
  {
    id: "pinterest",
    name: "Pinterest",
    domains: ["pinterest.com", "pin.it"],
    icon: "Pin",
    brandColor: "#E60023",
  },
  {
    id: "reddit",
    name: "Reddit",
    domains: ["reddit.com"],
    icon: "MessageSquare",
    brandColor: "#FF4500",
  },

  // Messaging & Community
  {
    id: "whatsapp",
    name: "WhatsApp",
    domains: ["whatsapp.com", "wa.me", "api.whatsapp.com"],
    icon: "PhoneCall",
    brandColor: "#25D366",
  },
  {
    id: "telegram",
    name: "Telegram",
    domains: ["telegram.org", "t.me", "telegram.me"],
    icon: "Send",
    brandColor: "#26A5E4",
  },
  {
    id: "discord",
    name: "Discord",
    domains: ["discord.com", "discord.gg"],
    icon: "Headphones",
    brandColor: "#5865F2",
  },
  {
    id: "twitch",
    name: "Twitch",
    domains: ["twitch.tv"],
    icon: "Tv",
    brandColor: "#9146FF",
  },
  {
    id: "slack",
    name: "Slack",
    domains: ["slack.com"],
    icon: "Hash",
    brandColor: "#4A154B",
  },

  // Music & Audio
  {
    id: "spotify",
    name: "Spotify",
    domains: ["spotify.com", "open.spotify.com"],
    icon: "Music",
    brandColor: "#1DB954",
  },
  {
    id: "apple-music",
    name: "Apple Music",
    domains: ["music.apple.com"],
    icon: "Music2",
    brandColor: "#FC3C44",
  },
  {
    id: "soundcloud",
    name: "SoundCloud",
    domains: ["soundcloud.com"],
    icon: "Volume2",
    brandColor: "#FF5500",
  },
  {
    id: "bandcamp",
    name: "Bandcamp",
    domains: ["bandcamp.com"],
    icon: "Disc",
    brandColor: "#1DA0C3",
  },

  // Code & Developer
  {
    id: "github",
    name: "GitHub",
    domains: ["github.com"],
    icon: "Github",
    brandColor: "#24292F",
  },
  {
    id: "gitlab",
    name: "GitLab",
    domains: ["gitlab.com"],
    icon: "GitBranch",
    brandColor: "#FC6D26",
  },
  {
    id: "stackoverflow",
    name: "Stack Overflow",
    domains: ["stackoverflow.com"],
    icon: "Layers",
    brandColor: "#F48024",
  },

  // Design & Creative
  {
    id: "figma",
    name: "Figma",
    domains: ["figma.com"],
    icon: "Figma",
    brandColor: "#F24E1E",
  },
  {
    id: "behance",
    name: "Behance",
    domains: ["behance.net"],
    icon: "Palette",
    brandColor: "#1769FF",
  },
  {
    id: "dribbble",
    name: "Dribbble",
    domains: ["dribbble.com"],
    icon: "Dribbble",
    brandColor: "#EA4C89",
  },
  {
    id: "artstation",
    name: "ArtStation",
    domains: ["artstation.com"],
    icon: "Image",
    brandColor: "#13AFF0",
  },

  // Writing & Publishing
  {
    id: "medium",
    name: "Medium",
    domains: ["medium.com"],
    icon: "BookOpen",
    brandColor: "#000000",
  },
  {
    id: "substack",
    name: "Substack",
    domains: ["substack.com"],
    icon: "Bookmark",
    brandColor: "#FF6719",
  },
  {
    id: "notion",
    name: "Notion",
    domains: ["notion.so", "notion.site"],
    icon: "FileText",
    brandColor: "#000000",
  },
  {
    id: "hashnode",
    name: "Hashnode",
    domains: ["hashnode.com", "hashnode.dev"],
    icon: "Feather",
    brandColor: "#2962FF",
  },

  // Tech & Discovery
  {
    id: "producthunt",
    name: "Product Hunt",
    domains: ["producthunt.com"],
    icon: "Flame",
    brandColor: "#DA552F",
  },

  // App Stores
  {
    id: "app-store",
    name: "App Store",
    domains: ["apps.apple.com"],
    icon: "Smartphone",
    brandColor: "#0070C9",
  },
  {
    id: "google-play",
    name: "Google Play",
    domains: ["play.google.com"],
    icon: "PlaySquare",
    brandColor: "#01875F",
  },
  {
    id: "microsoft-store",
    name: "Microsoft Store",
    domains: ["microsoft.com/store", "apps.microsoft.com"],
    icon: "Monitor",
    brandColor: "#0078D7",
  },

  // Creator Economy & Monetization
  {
    id: "patreon",
    name: "Patreon",
    domains: ["patreon.com"],
    icon: "HeartHandshake",
    brandColor: "#FF424D",
  },
  {
    id: "buymeacoffee",
    name: "Buy Me a Coffee",
    domains: ["buymeacoffee.com"],
    icon: "Coffee",
    brandColor: "#FFDD00",
    textColor: "#000000",
  },
  {
    id: "kofi",
    name: "Ko-fi",
    domains: ["ko-fi.com"],
    icon: "Coffee",
    brandColor: "#13C3FF",
  },
  {
    id: "gumroad",
    name: "Gumroad",
    domains: ["gumroad.com"],
    icon: "ShoppingBag",
    brandColor: "#FF90E8",
    textColor: "#000000",
  },
  {
    id: "paypal",
    name: "PayPal",
    domains: ["paypal.com", "paypal.me"],
    icon: "CreditCard",
    brandColor: "#003087",
  },
  {
    id: "kickstarter",
    name: "Kickstarter",
    domains: ["kickstarter.com"],
    icon: "Sparkles",
    brandColor: "#05CE78",
  },

  // Freelance & Commerce
  {
    id: "fiverr",
    name: "Fiverr",
    domains: ["fiverr.com"],
    icon: "Briefcase",
    brandColor: "#1DBF73",
  },
  {
    id: "upwork",
    name: "Upwork",
    domains: ["upwork.com"],
    icon: "Briefcase",
    brandColor: "#14A800",
  },
  {
    id: "etsy",
    name: "Etsy",
    domains: ["etsy.com"],
    icon: "Tag",
    brandColor: "#F1641E",
  },
  {
    id: "amazon",
    name: "Amazon",
    domains: ["amazon.com", "amzn.to", "amazon.co.uk", "amazon.in"],
    icon: "ShoppingCart",
    brandColor: "#FF9900",
    textColor: "#000000",
  },
  {
    id: "flipkart",
    name: "Flipkart",
    domains: ["flipkart.com"],
    icon: "ShoppingBag",
    brandColor: "#2874F0",
  },
  {
    id: "shopify",
    name: "Shopify Store",
    domains: ["shopify.com", "myshopify.com"],
    icon: "Store",
    brandColor: "#95BF47",
  },

  // Cloud & Productivity
  {
    id: "googledrive",
    name: "Google Drive",
    domains: ["drive.google.com"],
    icon: "HardDrive",
    brandColor: "#4285F4",
  },
  {
    id: "dropbox",
    name: "Dropbox",
    domains: ["dropbox.com"],
    icon: "Box",
    brandColor: "#0061FF",
  },
  {
    id: "linktree",
    name: "Linktree",
    domains: ["linktr.ee"],
    icon: "Link2",
    brandColor: "#43E660",
    textColor: "#000000",
  },
  {
    id: "cal",
    name: "Cal.com / Calendly",
    domains: ["cal.com", "calendly.com"],
    icon: "Calendar",
    brandColor: "#111827",
  },

  // Communication Protocols
  {
    id: "email",
    name: "Email",
    domains: ["mailto:"],
    icon: "Mail",
    brandColor: "#EA4335",
  },
  {
    id: "phone",
    name: "Phone",
    domains: ["tel:"],
    icon: "Phone",
    brandColor: "#34A853",
  },
  {
    id: "sms",
    name: "SMS",
    domains: ["sms:"],
    icon: "MessageCircle",
    brandColor: "#00B0FF",
  },
  {
    id: "podcast",
    name: "Podcast",
    domains: ["podcasts.apple.com", "anchor.fm", "overcast.fm"],
    icon: "Mic",
    brandColor: "#872EC4",
  },
  {
    id: "steam",
    name: "Steam",
    domains: ["store.steampowered.com", "steamcommunity.com"],
    icon: "Gamepad2",
    brandColor: "#171A21",
  },
  {
    id: "gitlab",
    name: "GitLab",
    domains: ["gitlab.com"],
    icon: "GitBranch",
    brandColor: "#E24329",
  },
];

/**
 * Clean & normalize input URL.
 * - Auto-prepends 'https://' if scheme is missing (unless mailto:, tel:, sms:)
 * - Rejects 'javascript:' or dangerous schemes
 */
export function normalizeUrl(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";

  // Check protocols
  if (
    trimmed.startsWith("mailto:") ||
    trimmed.startsWith("tel:") ||
    trimmed.startsWith("sms:")
  ) {
    return trimmed;
  }

  // Reject malicious schemes
  if (/^javascript:/i.test(trimmed) || /^data:/i.test(trimmed) || /^vbscript:/i.test(trimmed)) {
    return "";
  }

  if (!/^https?:\/\//i.test(trimmed)) {
    return `https://${trimmed}`;
  }

  return trimmed;
}

/**
 * Validates whether string is a safe, usable URL
 */
export function isValidUrl(raw: string): boolean {
  const normalized = normalizeUrl(raw);
  if (!normalized) return false;

  if (
    normalized.startsWith("mailto:") ||
    normalized.startsWith("tel:") ||
    normalized.startsWith("sms:")
  ) {
    return normalized.length > 5;
  }

  try {
    const parsed = new URL(normalized);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Extract clean hostname stripping "www." and "m." prefixes
 */
export function extractCleanHostname(rawUrl: string): string {
  const normalized = normalizeUrl(rawUrl);
  if (!normalized) return "";

  if (normalized.startsWith("mailto:")) return "Email";
  if (normalized.startsWith("tel:")) return "Phone";
  if (normalized.startsWith("sms:")) return "SMS";

  try {
    const url = new URL(normalized);
    let host = url.hostname.toLowerCase();
    if (host.startsWith("www.")) host = host.substring(4);
    if (host.startsWith("m.")) host = host.substring(2);
    return host;
  } catch {
    return "";
  }
}

/**
 * Auto-detect platform, name, icon, brand color, and fallback favicon.
 */
export function detectPlatform(rawUrl: string): DetectedPlatform {
  const normalized = normalizeUrl(rawUrl);
  const isValid = isValidUrl(rawUrl);

  if (!isValid || !normalized) {
    return {
      platformId: null,
      name: "Link",
      icon: "Globe",
      brandColor: "#4B5563",
      faviconUrl: null,
      normalizedUrl: rawUrl,
      isValid: false,
      domain: "",
    };
  }

  // Handle special schemes
  if (normalized.startsWith("mailto:")) {
    const emailPlatform = PLATFORMS.find((p) => p.id === "email")!;
    return {
      platformId: "email",
      name: "Email Me",
      icon: emailPlatform.icon,
      brandColor: emailPlatform.brandColor,
      textColor: emailPlatform.textColor,
      faviconUrl: null,
      normalizedUrl: normalized,
      isValid: true,
      domain: "mailto",
    };
  }

  if (normalized.startsWith("tel:")) {
    const phonePlatform = PLATFORMS.find((p) => p.id === "phone")!;
    return {
      platformId: "phone",
      name: "Call Me",
      icon: phonePlatform.icon,
      brandColor: phonePlatform.brandColor,
      textColor: phonePlatform.textColor,
      faviconUrl: null,
      normalizedUrl: normalized,
      isValid: true,
      domain: "tel",
    };
  }

  let host = "";
  let fullPath = "";
  try {
    const parsed = new URL(normalized);
    host = parsed.hostname.toLowerCase();
    if (host.startsWith("www.")) host = host.substring(4);
    if (host.startsWith("m.")) host = host.substring(2);
    fullPath = (host + parsed.pathname).toLowerCase();
  } catch {
    // Should not happen if isValid was true
  }

  // Match against platform list
  for (const platform of PLATFORMS) {
    for (const domain of platform.domains) {
      const cleanDomain = domain.toLowerCase();
      if (cleanDomain.includes("/")) {
        // e.g. microsoft.com/store
        if (fullPath.includes(cleanDomain)) {
          return {
            platformId: platform.id,
            name: platform.name,
            icon: platform.icon,
            brandColor: platform.brandColor,
            textColor: platform.textColor,
            faviconUrl: `https://www.google.com/s2/favicons?domain=${host}&sz=64`,
            normalizedUrl: normalized,
            isValid: true,
            domain: host,
          };
        }
      } else {
        if (host === cleanDomain || host.endsWith(`.${cleanDomain}`)) {
          return {
            platformId: platform.id,
            name: platform.name,
            icon: platform.icon,
            brandColor: platform.brandColor,
            textColor: platform.textColor,
            faviconUrl: `https://www.google.com/s2/favicons?domain=${host}&sz=64`,
            normalizedUrl: normalized,
            isValid: true,
            domain: host,
          };
        }
      }
    }
  }

  // Unknown link fallback: domain name formatted as title + Google Favicon
  const prettyDomain = host ? host.charAt(0).toUpperCase() + host.slice(1) : "Website";
  return {
    platformId: null,
    name: prettyDomain,
    icon: "Globe",
    brandColor: "#1F2937",
    faviconUrl: host ? `https://www.google.com/s2/favicons?domain=${host}&sz=64` : null,
    normalizedUrl: normalized,
    isValid: true,
    domain: host,
  };
}

/**
 * Computes high-contrast badge styling for platform icons on both light and dark theme cards.
 * Automatically lifts dark/black brand colors (GitHub, X, Threads, Steam, Notion) to crisp white
 * with frosted backdrop when rendered on dark cards.
 */
export function getPlatformBadgeStyle(
  brandColor?: string | null,
  isDarkCard: boolean = true
): { color: string; bgColor: string; borderColor: string } {
  if (!brandColor) {
    return {
      color: isDarkCard ? "#ffffff" : "#18181b",
      bgColor: isDarkCard ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.06)",
      borderColor: isDarkCard ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.08)",
    };
  }

  const darkHexes = [
    "#000000",
    "#0A0A0A",
    "#111111",
    "#121212",
    "#171A21",
    "#18181B",
    "#1E1E1E",
    "#1F2937",
    "#24292F",
    "#252525",
  ];
  const isNearBlack = darkHexes.includes(brandColor.toUpperCase());

  if (isNearBlack) {
    if (isDarkCard) {
      return {
        color: "#ffffff",
        bgColor: "rgba(255, 255, 255, 0.14)",
        borderColor: "rgba(255, 255, 255, 0.22)",
      };
    } else {
      return {
        color: "#18181b",
        bgColor: "rgba(0, 0, 0, 0.06)",
        borderColor: "rgba(0, 0, 0, 0.12)",
      };
    }
  }

  // Vibrant brand colors (Instagram, Spotify, YouTube, Discord, BuyMeACoffee, etc.)
  return {
    color: brandColor,
    bgColor: `${brandColor}22`,
    borderColor: `${brandColor}40`,
  };
}

