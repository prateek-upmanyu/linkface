export type ProfileThemeId =
  | "notebook"
  | "pastel"
  | "console"
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
    | "notebook-tape"
    | "pastel-ring"
    | "console-square"
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
  // FREE THEME 1 (DEFAULT): NOTEBOOK (Light)
  // School notebook page with ruled lines & tape strip
  notebook: {
    id: "notebook",
    name: "Notebook",
    concept: "School notebook page with ruled lines",
    isDark: false,
    isPro: false,
    googleFontsUrl: "https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&family=Patrick+Hand&family=Inter:wght@400;500;600;700&display=swap",
    headingFont: "'Caveat', cursive",
    bodyFont: "'Inter', sans-serif",
    monoFont: "'Patrick Hand', cursive",
    bg: "#fbf8ef",
    cardBg: "#fbf8ef",
    text: "#26303b",
    muted: "#5a6878",
    accent: "#2f6fdb",
    border: "rgba(38, 48, 59, 0.15)",
    chipBg: "#ffffff",
    chipBorder: "#2f6fdb",
    chipText: "#26303b",
    avatarShape: "notebook-tape",
    linkLayout: "stack",
    paletteColors: ["#fbf8ef", "#c9d8ee", "#e07a7a", "#26303b", "#2f6fdb"],
  },

  // FREE THEME 2: PASTEL (Light)
  // Soft pastel blocks, friendly and calm
  pastel: {
    id: "pastel",
    name: "Pastel",
    concept: "Soft pastel blocks, friendly and calm",
    isDark: false,
    isPro: false,
    googleFontsUrl: "https://fonts.googleapis.com/css2?family=Poppins:wght@600;700&family=Nunito:wght@400;600;700;800&display=swap",
    headingFont: "'Poppins', sans-serif",
    bodyFont: "'Nunito', sans-serif",
    monoFont: "'Poppins', sans-serif",
    bg: "#faf7f5",
    cardBg: "#ffffff",
    text: "#2d2a32",
    muted: "#635f69",
    accent: "#2d2a32",
    border: "transparent",
    chipBg: "#ffffff",
    chipBorder: "transparent",
    chipText: "#2d2a32",
    avatarShape: "pastel-ring",
    linkLayout: "stack",
    paletteColors: ["#faf7f5", "#ffd9e0", "#d7ecff", "#e2f5d8", "#fff0c7"],
  },

  // FREE THEME 3: CONSOLE (Dark)
  // Friendly code editor window
  console: {
    id: "console",
    name: "Console",
    concept: "Friendly code editor window",
    isDark: true,
    isPro: false,
    googleFontsUrl: "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@500;600;700&family=Inter:wght@400;500;600&display=swap",
    headingFont: "'JetBrains Mono', monospace",
    bodyFont: "'Inter', sans-serif",
    monoFont: "'JetBrains Mono', monospace",
    bg: "#0f1115",
    cardBg: "#171a21",
    text: "#e6e9ef",
    muted: "#94a3b8",
    accent: "#4ade80",
    border: "#20242d",
    chipBg: "#20242d",
    chipBorder: "#4ade80",
    chipText: "#e6e9ef",
    avatarShape: "console-square",
    linkLayout: "stack",
    paletteColors: ["#0f1115", "#171a21", "#20242d", "#e6e9ef", "#4ade80"],
  },

  // 1. CASSETTE (Pro Theme)
  // Retro mixtape cassette. Deck bg #1c1a17, tape shell cream #f0e6cf, label orange #9c3400 (WCAG AA 5.8:1), ink #1a1a1a
  cassette: {
    id: "cassette",
    name: "Cassette",
    concept: "Retro mixtape cassette",
    isDark: true,
    isPro: true,
    googleFontsUrl: "https://fonts.googleapis.com/css2?family=Rubik+Mono+One&family=DM+Mono:ital,wght@0,400;0,500;1,400&family=Inter:wght@400;500;600;700&display=swap",
    headingFont: "'DM Mono', monospace",
    bodyFont: "'Inter', sans-serif",
    monoFont: "'DM Mono', monospace",
    bg: "#1c1a17",
    cardBg: "#f0e6cf",
    text: "#1a1a1a",
    muted: "#524d45",
    accent: "#9c3400",
    border: "#1a1a1a",
    chipBg: "#ffffff",
    chipBorder: "#2a9d8f",
    chipText: "#1a1a1a",
    avatarShape: "cassette-window",
    linkLayout: "stack",
    paletteColors: ["#1c1a17", "#f0e6cf", "#f26b21", "#2a9d8f", "#1a1a1a"],
  },

  // 2. PRESS (Pro)
  // Tabloid newspaper front page. Newsprint #ece4d3, ink #141414, red #b30f1b (WCAG AA 5.5:1).
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
    accent: "#b30f1b",
    border: "#141414",
    chipBg: "#ffffff",
    chipBorder: "#141414",
    chipText: "#141414",
    avatarShape: "press-square",
    linkLayout: "grid-2",
    paletteColors: ["#ece4d3", "#141414", "#c1121f", "#3d3a36"],
  },

  // 3. VINYL (Pro - Fixed Avatar 68% & 24s spin)
  // Record sleeve and turntable. Shrikhand, DM Mono, Inter. Cream #f1e6d0, black #111, rich rust #a83800 (WCAG AA 5.1:1).
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
    accent: "#a83800",
    border: "#292621",
    chipBg: "#ffffff",
    chipBorder: "#111111",
    chipText: "#111111",
    avatarShape: "vinyl-disc",
    linkLayout: "stack",
    paletteColors: ["#f1e6d0", "#111111", "#ff6b1a", "#f2b134"],
  },

  // 4. POSTAGE (Pro)
  // Airmail and postage stamps. Playfair Display, Special Elite, Lato. Envelope #f5efe2, crimson #b81d2c (WCAG AA 5.6:1), ink #1c1c1c.
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
    accent: "#b81d2c",
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
  // Library card catalog drawer. Young Serif, Courier Prime. Dark wood #2a1d14, card cream #f3ead6, ink #1b1b1b, red rule #a82c26 (WCAG AA 5.7:1).
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
    accent: "#a82c26",
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
  // Two-color risograph print misregistration. Rubik Mono One, Archivo Black, Space Grotesk. Paper #f2efe6, deep magenta #b8006b (WCAG AA 5.6:1), blue #0078bf.
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
    accent: "#b8006b",
    border: "#1a1a1a",
    chipBg: "#ffffff",
    chipBorder: "#1a1a1a",
    chipText: "#1a1a1a",
    avatarShape: "riso-circle",
    linkLayout: "stack",
    paletteColors: ["#f2efe6", "#ff48b0", "#0078bf", "#1a1a1a"],
  },

  // 9. COMIC (Pro)
  // Pop-art comic book page. Bangers, Comic Neue. Paper #fff8e7, ink #111, yellow #ffd400, bold red #c21827 (WCAG AA 6.0:1), blue #1d70f5.
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
    accent: "#c21827",
    border: "#111111",
    chipBg: "#ffffff",
    chipBorder: "#111111",
    chipText: "#111111",
    avatarShape: "comic-burst",
    linkLayout: "stack",
    paletteColors: ["#fff8e7", "#111111", "#ffd400", "#e63946", "#1d70f5"],
  },

  // 10. BAUHAUS (Pro)
  // Bauhaus geometric poster. Jost, Archivo Black. Paper #f3ede0, black #151515, rich crimson #b81912 (WCAG AA 5.6:1), yellow #f2b705, blue #1f4fa3.
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
    accent: "#b81912",
    border: "#151515",
    chipBg: "#ffffff",
    chipBorder: "#151515",
    chipText: "#151515",
    avatarShape: "bauhaus-quad",
    linkLayout: "stack",
    paletteColors: ["#f3ede0", "#151515", "#d7261e", "#f2b705", "#1f4fa3"],
  },

  // 11. HERBARIUM (Pro - Replaces Star Chart)
  // Pressed flowers on archival paper. Cormorant Garamond, Lora, Inter. Paper #f4efe3, ink #2b2a26, deep forest sage #3e5c32 (WCAG AA 6.6:1), rose #c98a8a.
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
    accent: "#3e5c32",
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
    accent: "#ff6584",
    border: "transparent",
    chipBg: "#fffdf7",
    chipBorder: "#ef476f",
    chipText: "#1b1b2f",
    avatarShape: "papercut-ring",
    linkLayout: "stack",
    paletteColors: ["#2b2d42", "#ef476f", "#ffd166", "#06d6a0", "#118ab2"],
  },
};

export const FREE_THEME_IDS: ProfileThemeId[] = [
  "notebook",
  "pastel",
  "console",
];

export const PRO_THEME_IDS: ProfileThemeId[] = [
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

export const PROFILE_THEMES_ORDER: ProfileThemeId[] = [
  ...FREE_THEME_IDS,
  ...PRO_THEME_IDS,
];

export const DEFAULT_FREE_THEME: ProfileThemeId = "notebook";

export function isNewProfileTheme(themeId?: string | null): themeId is ProfileThemeId {
  if (!themeId) return false;
  return themeId in PROFILE_THEMES;
}

export function isFreeProfileTheme(themeId?: string | null): boolean {
  return themeId === "notebook" || themeId === "pastel" || themeId === "console";
}

export function getProfileTheme(themeId?: string | null): ProfileThemeConfig {
  if (themeId && isNewProfileTheme(themeId)) {
    return PROFILE_THEMES[themeId];
  }
  // Default free theme is Notebook
  return PROFILE_THEMES["notebook"];
}
