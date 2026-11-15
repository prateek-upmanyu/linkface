import { ThemeId } from "@/types";

export type ProfileThemeId =
  | "receipt"
  | "press"
  | "ticket"
  | "vinyl"
  | "postage"
  | "gothic"
  | "sticker-bomb"
  | "archive"
  | "truck-art"
  | "deco"
  | "riso"
  | "y2k-chrome";

export interface ProfileThemeConfig {
  id: ProfileThemeId;
  name: string;
  concept: string;
  isDark: boolean;
  isPro: boolean;
  googleFontsUrl: string;
  headingFont: string;
  bodyFont: string;
  monoFont?: string;
  bg: string;
  cardBg: string;
  text: string;
  muted: string;
  accent: string;
  border: string;
  chipBg: string;
  chipBorder: string;
  chipText: string;
  avatarShape: "square" | "circle" | "ticket" | "vinyl" | "stamp" | "gothic-arch" | "sticker" | "catalog" | "truck-medallion" | "deco-octagon" | "riso-circle" | "chrome-ring";
  linkLayout: "stack" | "grid-2";
  paletteColors: string[];
}

export const PROFILE_THEMES: Record<ProfileThemeId, ProfileThemeConfig> = {
  // 1. RECEIPT: Thermal shop receipt on a dark desk
  receipt: {
    id: "receipt",
    name: "Receipt",
    concept: "Thermal shop receipt on dark desk",
    isDark: true,
    isPro: true,
    googleFontsUrl: "https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,400;0,500;1,400&display=swap",
    headingFont: "'DM Mono', monospace",
    bodyFont: "'DM Mono', monospace",
    monoFont: "'DM Mono', monospace",
    bg: "#1b1b1d",
    cardBg: "#f4f1e8",
    text: "#1a1a1a",
    muted: "#55524b",
    accent: "#d62828",
    border: "#d9d5c9",
    chipBg: "#ffffff",
    chipBorder: "#1a1a1a",
    chipText: "#1a1a1a",
    avatarShape: "square",
    linkLayout: "stack",
    paletteColors: ["#1b1b1d", "#f4f1e8", "#1a1a1a", "#d62828"],
  },

  // 2. PRESS: Tabloid newspaper front page
  press: {
    id: "press",
    name: "Press",
    concept: "Tabloid newspaper front page",
    isDark: false,
    isPro: true,
    googleFontsUrl: "https://fonts.googleapis.com/css2?family=Abril+Fatface&family=Libre+Franklin:wght@400;500;700;800&family=Special+Elite&display=swap",
    headingFont: "'Abril Fatface', Georgia, serif",
    bodyFont: "'Libre Franklin', sans-serif",
    monoFont: "'Special Elite', monospace",
    bg: "#dcd4c3",
    cardBg: "#ece4d3",
    text: "#141414",
    muted: "#3d3a36",
    accent: "#c1121f",
    border: "#141414",
    chipBg: "#ffffff",
    chipBorder: "#141414",
    chipText: "#141414",
    avatarShape: "square",
    linkLayout: "grid-2",
    paletteColors: ["#ece4d3", "#141414", "#c1121f", "#3d3a36"],
  },

  // 3. TICKET: Concert and cinema ticket stubs
  ticket: {
    id: "ticket",
    name: "Ticket",
    concept: "Concert and cinema ticket stubs",
    isDark: true,
    isPro: true,
    googleFontsUrl: "https://fonts.googleapis.com/css2?family=Anton&family=Bebas+Neue&family=Space+Mono:wght@400;700&display=swap",
    headingFont: "'Anton', sans-serif",
    bodyFont: "'Space Mono', monospace",
    monoFont: "'Space Mono', monospace",
    bg: "#09090b",
    cardBg: "#0f0f12",
    text: "#f3e9d2",
    muted: "#a89f8b",
    accent: "#e4572e",
    border: "rgba(243, 233, 210, 0.2)",
    chipBg: "#1e1e24",
    chipBorder: "#e4572e",
    chipText: "#f3e9d2",
    avatarShape: "ticket",
    linkLayout: "stack",
    paletteColors: ["#0f0f12", "#f3e9d2", "#e4572e", "#2a9d8f"],
  },

  // 4. VINYL: Record sleeve and turntable
  vinyl: {
    id: "vinyl",
    name: "Vinyl",
    concept: "Record sleeve and turntable",
    isDark: false,
    isPro: true,
    googleFontsUrl: "https://fonts.googleapis.com/css2?family=Shrikhand&family=DM+Mono:wght@400;500&family=Inter:wght@400;600&display=swap",
    headingFont: "'Shrikhand', cursive",
    bodyFont: "'Inter', sans-serif",
    monoFont: "'DM Mono', monospace",
    bg: "#e4d8bf",
    cardBg: "#f1e6d0",
    text: "#111111",
    muted: "#474136",
    accent: "#ff6b1a",
    border: "#292621",
    chipBg: "#ffffff",
    chipBorder: "#111111",
    chipText: "#111111",
    avatarShape: "vinyl",
    linkLayout: "stack",
    paletteColors: ["#f1e6d0", "#111111", "#ff6b1a", "#f2b134"],
  },

  // 5. POSTAGE: Airmail and postage stamps
  postage: {
    id: "postage",
    name: "Postage",
    concept: "Airmail and postage stamps",
    isDark: false,
    isPro: true,
    googleFontsUrl: "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,800;1,600&family=Special+Elite&family=Lato:wght@400;700&display=swap",
    headingFont: "'Playfair Display', Georgia, serif",
    bodyFont: "'Lato', sans-serif",
    monoFont: "'Special Elite', monospace",
    bg: "#e8dfce",
    cardBg: "#f5efe2",
    text: "#1c1c1c",
    muted: "#45433e",
    accent: "#d62839",
    border: "#d5cbba",
    chipBg: "#ffffff",
    chipBorder: "#1d4e89",
    chipText: "#1c1c1c",
    avatarShape: "stamp",
    linkLayout: "grid-2",
    paletteColors: ["#f5efe2", "#d62839", "#1d4e89", "#1c1c1c"],
  },

  // 6. GOTHIC: Blackletter tattoo flash and manuscripts
  gothic: {
    id: "gothic",
    name: "Gothic",
    concept: "Blackletter tattoo flash and manuscripts",
    isDark: true,
    isPro: true,
    googleFontsUrl: "https://fonts.googleapis.com/css2?family=UnifrakturCook:wght@700&family=Pirata+One&family=Cormorant+Garamond:ital,wght@0,500;0,700;1,500&display=swap",
    headingFont: "'UnifrakturCook', cursive",
    bodyFont: "'Cormorant Garamond', serif",
    monoFont: "'Pirata One', cursive",
    bg: "#050404",
    cardBg: "#0a0908",
    text: "#e9e0cf",
    muted: "#a89f91",
    accent: "#9b1d20",
    border: "#b08d57",
    chipBg: "#1a1614",
    chipBorder: "#b08d57",
    chipText: "#e9e0cf",
    avatarShape: "gothic-arch",
    linkLayout: "stack",
    paletteColors: ["#0a0908", "#e9e0cf", "#9b1d20", "#b08d57"],
  },

  // 7. STICKER BOMB: Die-cut vinyl stickers on a laptop lid
  "sticker-bomb": {
    id: "sticker-bomb",
    name: "Sticker Bomb",
    concept: "Die-cut vinyl stickers on laptop lid",
    isDark: true,
    isPro: true,
    googleFontsUrl: "https://fonts.googleapis.com/css2?family=Bagel+Fat+One&family=Inter:wght@500;700;800&display=swap",
    headingFont: "'Bagel Fat One', cursive",
    bodyFont: "'Inter', sans-serif",
    monoFont: "'Bagel Fat One', cursive",
    bg: "#141518",
    cardBg: "#1d1f24",
    text: "#ffffff",
    muted: "#d1d5db",
    accent: "#ffd23f",
    border: "#373a42",
    chipBg: "#ffffff",
    chipBorder: "#18181b",
    chipText: "#18181b",
    avatarShape: "sticker",
    linkLayout: "grid-2",
    paletteColors: ["#1d1f24", "#ffd23f", "#ff5d8f", "#3ddc97", "#4cc9f0"],
  },

  // 8. ARCHIVE: Library card catalog drawer
  archive: {
    id: "archive",
    name: "Archive",
    concept: "Library card catalog drawer",
    isDark: false,
    isPro: true,
    googleFontsUrl: "https://fonts.googleapis.com/css2?family=Young+Serif&family=Courier+Prime:ital,wght@0,400;0,700;1,400&display=swap",
    headingFont: "'Young Serif', Georgia, serif",
    bodyFont: "'Courier Prime', monospace",
    monoFont: "'Courier Prime', monospace",
    bg: "#20150d",
    cardBg: "#f3ead6",
    text: "#1b1b1b",
    muted: "#453f38",
    accent: "#c1403a",
    border: "#cfc1aa",
    chipBg: "#ffffff",
    chipBorder: "#1b1b1b",
    chipText: "#1b1b1b",
    avatarShape: "catalog",
    linkLayout: "stack",
    paletteColors: ["#2a1d14", "#f3ead6", "#1b1b1b", "#c1403a", "#6fa1c9"],
  },

  // 9. TRUCK ART: Indian highway truck art and painted signboards
  "truck-art": {
    id: "truck-art",
    name: "Truck Art",
    concept: "Highway truck art and painted signboards",
    isDark: true,
    isPro: true,
    googleFontsUrl: "https://fonts.googleapis.com/css2?family=Rozha+One&family=Yatra+One&family=Baloo+2:wght@500;700;800&display=swap",
    headingFont: "'Rozha One', serif",
    bodyFont: "'Baloo 2', cursive, sans-serif",
    monoFont: "'Yatra One', cursive",
    bg: "#050505",
    cardBg: "#0e0e0e",
    text: "#fff4d6",
    muted: "#f0d8a4",
    accent: "#f9a602",
    border: "#f9a602",
    chipBg: "#ffffff",
    chipBorder: "#d81b60",
    chipText: "#0e0e0e",
    avatarShape: "truck-medallion",
    linkLayout: "stack",
    paletteColors: ["#0e0e0e", "#f9a602", "#d81b60", "#00897b", "#fff4d6"],
  },

  // 10. DECO: 1920s Art Deco luxury
  deco: {
    id: "deco",
    name: "Deco",
    concept: "1920s Art Deco luxury",
    isDark: true,
    isPro: true,
    googleFontsUrl: "https://fonts.googleapis.com/css2?family=Limelight&family=Poiret+One&family=Josefin+Sans:wght@400;600;700&display=swap",
    headingFont: "'Limelight', cursive",
    bodyFont: "'Josefin Sans', sans-serif",
    monoFont: "'Poiret One', cursive",
    bg: "#040907",
    cardBg: "#07110e",
    text: "#f2e2b3",
    muted: "#c7b88e",
    accent: "#d4af37",
    border: "#d4af37",
    chipBg: "#07110e",
    chipBorder: "#d4af37",
    chipText: "#f2e2b3",
    avatarShape: "deco-octagon",
    linkLayout: "stack",
    paletteColors: ["#07110e", "#d4af37", "#f2e2b3", "#0f3b2e"],
  },

  // 11. RISO: Two-color risograph print with misregistration
  riso: {
    id: "riso",
    name: "Riso",
    concept: "Two-color risograph print misregistration",
    isDark: false,
    isPro: true,
    googleFontsUrl: "https://fonts.googleapis.com/css2?family=Rubik+Mono+One&family=Archivo+Black&family=Space+Grotesk:wght@500;700&display=swap",
    headingFont: "'Rubik Mono One', sans-serif",
    bodyFont: "'Space Grotesk', sans-serif",
    monoFont: "'Archivo Black', sans-serif",
    bg: "#e4dfd4",
    cardBg: "#f2efe6",
    text: "#1a1a1a",
    muted: "#3d3b38",
    accent: "#ff48b0",
    border: "#1a1a1a",
    chipBg: "#ffffff",
    chipBorder: "#1a1a1a",
    chipText: "#1a1a1a",
    avatarShape: "riso-circle",
    linkLayout: "stack",
    paletteColors: ["#f2efe6", "#ff48b0", "#0078bf", "#1a1a1a"],
  },

  // 12. Y2K CHROME: Early-2000s liquid chrome tech
  "y2k-chrome": {
    id: "y2k-chrome",
    name: "Y2K Chrome",
    concept: "Early-2000s liquid chrome tech",
    isDark: true,
    isPro: true,
    googleFontsUrl: "https://fonts.googleapis.com/css2?family=Unbounded:wght@600;700;800;900&family=Space+Grotesk:wght@400;600;700&display=swap",
    headingFont: "'Unbounded', sans-serif",
    bodyFont: "'Space Grotesk', sans-serif",
    monoFont: "'Unbounded', sans-serif",
    bg: "#050512",
    cardBg: "#0b0b1e",
    text: "#e6e8f0",
    muted: "#9ba0be",
    accent: "#3d5afe",
    border: "rgba(230, 232, 240, 0.25)",
    chipBg: "#ffffff",
    chipBorder: "#3d5afe",
    chipText: "#0b0b1e",
    avatarShape: "chrome-ring",
    linkLayout: "stack",
    paletteColors: ["#0b0b1e", "#e6e8f0", "#9aa0b4", "#3d5afe"],
  },
};

export const PROFILE_THEMES_ORDER: ProfileThemeId[] = [
  "receipt",
  "press",
  "ticket",
  "vinyl",
  "postage",
  "gothic",
  "sticker-bomb",
  "archive",
  "truck-art",
  "deco",
  "riso",
  "y2k-chrome",
];

export function isNewProfileTheme(themeId?: string | null): themeId is ProfileThemeId {
  if (!themeId) return false;
  return themeId in PROFILE_THEMES;
}

export function getProfileTheme(themeId?: string | null): ProfileThemeConfig {
  if (themeId && isNewProfileTheme(themeId)) {
    return PROFILE_THEMES[themeId];
  }
  // Default to receipt or midnight
  return PROFILE_THEMES["receipt"];
}
