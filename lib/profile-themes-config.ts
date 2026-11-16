export type ProfileThemeId =
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
  | "herbarium"
  | "papercut";

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
  avatarShape:
    | "cassette-window"
    | "press-square"
    | "vinyl-disc"
    | "stamp"
    | "sticker"
    | "catalog"
    | "truck-medallion"
    | "riso-circle"
    | "comic-burst"
    | "bauhaus-quad"
    | "herbarium-oval"
    | "papercut-ring";
  linkLayout: "stack" | "grid-2";
  paletteColors: string[];
}

export const PROFILE_THEMES: Record<ProfileThemeId, ProfileThemeConfig> = {
  // 1. CASSETTE (FREE THEME - Replaces Receipt)
  // Retro mixtape cassette. Deck bg #1c1a17, tape shell cream #f0e6cf, label orange #f26b21, label teal #2a9d8f, ink #1a1a1a
  cassette: {
    id: "cassette",
    name: "Cassette",
    concept: "Retro mixtape cassette",
    isDark: true,
    isPro: false, // FREE THEME
    googleFontsUrl: "https://fonts.googleapis.com/css2?family=Rubik+Mono+One&family=DM+Mono:ital,wght@0,400;0,500;1,400&family=Inter:wght@400;500;600;700&display=swap",
    headingFont: "'DM Mono', monospace",
    bodyFont: "'Inter', sans-serif",
    monoFont: "'DM Mono', monospace",
    bg: "#1c1a17",
    cardBg: "#f0e6cf",
    text: "#1a1a1a",
    muted: "#524d45",
    accent: "#f26b21",
    border: "#1a1a1a",
    chipBg: "#ffffff",
    chipBorder: "#2a9d8f",
    chipText: "#1a1a1a",
    avatarShape: "cassette-window",
    linkLayout: "stack",
    paletteColors: ["#1c1a17", "#f0e6cf", "#f26b21", "#2a9d8f", "#1a1a1a"],
  },

  // 2. PRESS (Pro)
  // Tabloid newspaper front page. Newsprint #ece4d3, ink #141414, red #c1121f.
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
    avatarShape: "press-square",
    linkLayout: "grid-2",
    paletteColors: ["#ece4d3", "#141414", "#c1121f", "#3d3a36"],
  },

  // 3. VINYL (Pro - Fixed Avatar 68% & 24s spin)
  // Record sleeve and turntable. Shrikhand, DM Mono, Inter. Cream #f1e6d0, black #111, orange #ff6b1a, mustard #f2b134.
  vinyl: {
    id: "vinyl",
    name: "Vinyl",
    concept: "Record sleeve and turntable",
    isDark: false,
    isPro: true,
    googleFontsUrl: "https://fonts.googleapis.com/css2?family=Shrikhand&family=DM+Mono:wght@400;500&family=Inter:wght@400;600;700&display=swap",
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
    avatarShape: "vinyl-disc",
    linkLayout: "stack",
    paletteColors: ["#f1e6d0", "#111111", "#ff6b1a", "#f2b134"],
  },

  // 4. POSTAGE (Pro)
  // Airmail and postage stamps. Playfair Display, Special Elite, Lato. Envelope #f5efe2, red #d62839, blue #1d4e89, ink #1c1c1c.
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

  // 5. STICKER BOMB (Pro - FIXED WCAG AA contrast & 2px dark border on chips)
  // Die-cut vinyl stickers on a laptop lid. Bagel Fat One, Inter.
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
    chipBorder: "#111111",
    chipText: "#111111",
    avatarShape: "sticker",
    linkLayout: "grid-2",
    paletteColors: ["#1d1f24", "#ffd23f", "#ff5d8f", "#3ddc97", "#4cc9f0"],
  },

  // 6. ARCHIVE (Pro)
  // Library card catalog drawer. Young Serif, Courier Prime. Dark wood #2a1d14, card cream #f3ead6, ink #1b1b1b, red rule #c1403a.
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

  // 7. TRUCK ART (Pro)
  // Indian highway truck art. Rozha One, Yatra One, Baloo 2. Marigold #f9a602, magenta #d81b60, teal #00897b, cream #fff4d6.
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

  // 8. RISO (Pro)
  // Two-color risograph print misregistration. Rubik Mono One, Archivo Black, Space Grotesk. Paper #f2efe6, pink #ff48b0, blue #0078bf.
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

  // 9. COMIC (Pro)
  // Pop-art comic book page. Bangers, Comic Neue. Paper #fff8e7, ink #111, yellow #ffd400, red #e63946, blue #1d70f5.
  comic: {
    id: "comic",
    name: "Comic",
    concept: "Pop-art comic book page",
    isDark: false,
    isPro: true,
    googleFontsUrl: "https://fonts.googleapis.com/css2?family=Bangers&family=Comic+Neue:wght@400;700&display=swap",
    headingFont: "'Bangers', cursive",
    bodyFont: "'Comic Neue', cursive, sans-serif",
    monoFont: "'Bangers', cursive",
    bg: "#ece4ce",
    cardBg: "#fff8e7",
    text: "#111111",
    muted: "#3d3930",
    accent: "#e63946",
    border: "#111111",
    chipBg: "#ffffff",
    chipBorder: "#111111",
    chipText: "#111111",
    avatarShape: "comic-burst",
    linkLayout: "stack",
    paletteColors: ["#fff8e7", "#111111", "#ffd400", "#e63946", "#1d70f5"],
  },

  // 10. BAUHAUS (Pro)
  // Bauhaus geometric poster. Jost, Archivo Black. Paper #f3ede0, black #151515, red #d7261e, yellow #f2b705, blue #1f4fa3.
  bauhaus: {
    id: "bauhaus",
    name: "Bauhaus",
    concept: "Bauhaus geometric poster",
    isDark: false,
    isPro: true,
    googleFontsUrl: "https://fonts.googleapis.com/css2?family=Archivo+Black&family=Jost:wght@400;600;700;800;900&display=swap",
    headingFont: "'Archivo Black', sans-serif",
    bodyFont: "'Jost', sans-serif",
    monoFont: "'Jost', sans-serif",
    bg: "#ded7c8",
    cardBg: "#f3ede0",
    text: "#151515",
    muted: "#47433c",
    accent: "#d7261e",
    border: "#151515",
    chipBg: "#ffffff",
    chipBorder: "#151515",
    chipText: "#151515",
    avatarShape: "bauhaus-quad",
    linkLayout: "stack",
    paletteColors: ["#f3ede0", "#151515", "#d7261e", "#f2b705", "#1f4fa3"],
  },

  // 11. HERBARIUM (Pro - Replaces Star Chart)
  // Pressed flowers on archival paper. Cormorant Garamond, Lora, Inter. Paper #f4efe3, ink #2b2a26, sage #7a8f6b, rose #c98a8a.
  herbarium: {
    id: "herbarium",
    name: "Herbarium",
    concept: "Pressed flowers on archival paper",
    isDark: false,
    isPro: true,
    googleFontsUrl: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@1,500;1,700&family=Lora:ital,wght@0,400;0,600;1,400&family=Inter:wght@500;600&display=swap",
    headingFont: "'Cormorant Garamond', Georgia, serif",
    bodyFont: "'Lora', Georgia, serif",
    monoFont: "'Inter', sans-serif",
    bg: "#e8e2d4",
    cardBg: "#f4efe3",
    text: "#2b2a26",
    muted: "#5e5b52",
    accent: "#7a8f6b",
    border: "rgba(43, 42, 38, 0.15)",
    chipBg: "#ffffff",
    chipBorder: "#7a8f6b",
    chipText: "#2b2a26",
    avatarShape: "herbarium-oval",
    linkLayout: "stack",
    paletteColors: ["#f4efe3", "#2b2a26", "#7a8f6b", "#c98a8a"],
  },

  // 12. PAPERCUT (Pro)
  // Layered paper-cut art. Fredoka, Nunito. Base #2b2d42, layers #ef476f, #ffd166, #06d6a0, #118ab2, paper white #fffdf7.
  papercut: {
    id: "papercut",
    name: "Papercut",
    concept: "Layered paper-cut art",
    isDark: true,
    isPro: true,
    googleFontsUrl: "https://fonts.googleapis.com/css2?family=Fredoka:wght@600;700&family=Nunito:wght@400;600;700;800&display=swap",
    headingFont: "'Fredoka', cursive, sans-serif",
    bodyFont: "'Nunito', sans-serif",
    monoFont: "'Fredoka', cursive, sans-serif",
    bg: "#1e202f",
    cardBg: "#2b2d42",
    text: "#fffdf7",
    muted: "#d8dae6",
    accent: "#ef476f",
    border: "transparent",
    chipBg: "#fffdf7",
    chipBorder: "#ef476f",
    chipText: "#1b1b2f",
    avatarShape: "papercut-ring",
    linkLayout: "stack",
    paletteColors: ["#2b2d42", "#ef476f", "#ffd166", "#06d6a0", "#118ab2"],
  },
};

export const PROFILE_THEMES_ORDER: ProfileThemeId[] = [
  "cassette",
  "press",
  "vinyl",
  "postage",
  "sticker-bomb",
  "archive",
  "truck-art",
  "riso",
  "comic",
  "bauhaus",
  "herbarium",
  "papercut",
];

export function isNewProfileTheme(themeId?: string | null): themeId is ProfileThemeId {
  if (!themeId) return false;
  return themeId in PROFILE_THEMES;
}

export function getProfileTheme(themeId?: string | null): ProfileThemeConfig {
  if (themeId && isNewProfileTheme(themeId)) {
    return PROFILE_THEMES[themeId];
  }
  // Default free theme is Cassette
  return PROFILE_THEMES["cassette"];
}
