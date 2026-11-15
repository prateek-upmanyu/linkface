import { ThemeId } from "@/types";

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  isDark: boolean;
  isPro: boolean;
  bg: string;
  surface: string;
  surfaceRaised: string;
  border: string;
  borderStrong: string;
  text: string;
  muted: string;
  accent: string;
  accentHover: string;
  radiusCard: string;
  headingFont: string;
  headingFontFamily: string;
  bgTint?: string;
  // Visual preview helpers
  paletteColors: string[];
}

export const THEMES: Record<string, ThemeConfig> = {
  // 1. MIDNIGHT (Free, Default)
  midnight: {
    id: "midnight",
    name: "Midnight",
    isDark: true,
    isPro: false,
    bg: "#0a0f1c",
    surface: "#121a2e",
    surfaceRaised: "#18223a",
    border: "rgba(245, 241, 232, 0.08)",
    borderStrong: "rgba(201, 169, 106, 0.35)",
    text: "#f5f1e8",
    muted: "rgba(245, 241, 232, 0.62)",
    accent: "#c9a96a",
    accentHover: "#d9bb80",
    radiusCard: "14px",
    headingFont: "Instrument Serif",
    headingFontFamily: "'Instrument Serif', Georgia, serif",
    bgTint: "radial-gradient(circle at 50% 0%, rgba(201, 169, 106, 0.06) 0%, transparent 60%)",
    paletteColors: ["#0a0f1c", "#121a2e", "#c9a96a", "#f5f1e8"],
  },

  // 2. IVORY (Light)
  ivory: {
    id: "ivory",
    name: "Ivory",
    isDark: false,
    isPro: true,
    bg: "#f6f3ee",
    surface: "#ffffff",
    surfaceRaised: "#fbf9f5",
    border: "rgba(20, 17, 15, 0.08)",
    borderStrong: "rgba(28, 58, 46, 0.25)",
    text: "#14110f",
    muted: "rgba(20, 17, 15, 0.6)",
    accent: "#1c3a2e",
    accentHover: "#284f3f",
    radiusCard: "14px",
    headingFont: "Instrument Serif",
    headingFontFamily: "'Instrument Serif', Georgia, serif",
    bgTint: "radial-gradient(circle at 50% 0%, rgba(28, 58, 46, 0.04) 0%, transparent 60%)",
    paletteColors: ["#f6f3ee", "#ffffff", "#1c3a2e", "#14110f"],
  },

  // 3. OBSIDIAN
  obsidian: {
    id: "obsidian",
    name: "Obsidian",
    isDark: true,
    isPro: true,
    bg: "#0b0b0c",
    surface: "#161618",
    surfaceRaised: "#1d1d20",
    border: "rgba(244, 241, 234, 0.07)",
    borderStrong: "rgba(184, 148, 106, 0.3)",
    text: "#f4f1ea",
    muted: "rgba(244, 241, 234, 0.6)",
    accent: "#b8946a",
    accentHover: "#cbb08d",
    radiusCard: "12px",
    headingFont: "Cormorant Garamond",
    headingFontFamily: "'Cormorant Garamond', Garamond, Georgia, serif",
    bgTint: "radial-gradient(circle at 50% 0%, rgba(184, 148, 106, 0.05) 0%, transparent 60%)",
    paletteColors: ["#0b0b0c", "#161618", "#b8946a", "#f4f1ea"],
  },

  // 4. FOREST
  forest: {
    id: "forest",
    name: "Forest",
    isDark: true,
    isPro: true,
    bg: "#0c1a15",
    surface: "#13261f",
    surfaceRaised: "#193027",
    border: "rgba(242, 238, 228, 0.08)",
    borderStrong: "rgba(200, 178, 122, 0.3)",
    text: "#f2eee4",
    muted: "rgba(242, 238, 228, 0.62)",
    accent: "#c8b27a",
    accentHover: "#d9c798",
    radiusCard: "14px",
    headingFont: "Fraunces",
    headingFontFamily: "'Fraunces', Georgia, serif",
    bgTint: "radial-gradient(circle at 50% 0%, rgba(200, 178, 122, 0.05) 0%, transparent 60%)",
    paletteColors: ["#0c1a15", "#13261f", "#c8b27a", "#f2eee4"],
  },

  // 5. BURGUNDY
  burgundy: {
    id: "burgundy",
    name: "Burgundy",
    isDark: true,
    isPro: true,
    bg: "#140a0d",
    surface: "#201216",
    surfaceRaised: "#2a181d",
    border: "rgba(243, 236, 230, 0.08)",
    borderStrong: "rgba(199, 154, 122, 0.3)",
    text: "#f3ece6",
    muted: "rgba(243, 236, 230, 0.6)",
    accent: "#c79a7a",
    accentHover: "#d7b093",
    radiusCard: "14px",
    headingFont: "Playfair Display",
    headingFontFamily: "'Playfair Display', Georgia, serif",
    bgTint: "radial-gradient(circle at 50% 0%, rgba(199, 154, 122, 0.05) 0%, transparent 60%)",
    paletteColors: ["#140a0d", "#201216", "#c79a7a", "#f3ece6"],
  },

  // 6. SAND (Light)
  sand: {
    id: "sand",
    name: "Sand",
    isDark: false,
    isPro: true,
    bg: "#efe8dc",
    surface: "#f8f3ea",
    surfaceRaised: "#fffaf1",
    border: "rgba(42, 33, 24, 0.08)",
    borderStrong: "rgba(138, 106, 59, 0.25)",
    text: "#2a2118",
    muted: "rgba(42, 33, 24, 0.62)",
    accent: "#8a6a3b",
    accentHover: "#a37e49",
    radiusCard: "14px",
    headingFont: "Cormorant Garamond",
    headingFontFamily: "'Cormorant Garamond', Garamond, Georgia, serif",
    bgTint: "radial-gradient(circle at 50% 0%, rgba(138, 106, 59, 0.04) 0%, transparent 60%)",
    paletteColors: ["#efe8dc", "#f8f3ea", "#8a6a3b", "#2a2118"],
  },

  // 7. SLATE
  slate: {
    id: "slate",
    name: "Slate",
    isDark: true,
    isPro: true,
    bg: "#11151a",
    surface: "#1a2028",
    surfaceRaised: "#212934",
    border: "rgba(232, 236, 240, 0.08)",
    borderStrong: "rgba(143, 163, 184, 0.3)",
    text: "#e8ecf0",
    muted: "rgba(232, 236, 240, 0.6)",
    accent: "#8fa3b8",
    accentHover: "#a9bccf",
    radiusCard: "12px",
    headingFont: "DM Serif Display",
    headingFontFamily: "'DM Serif Display', Georgia, serif",
    bgTint: "radial-gradient(circle at 50% 0%, rgba(143, 163, 184, 0.05) 0%, transparent 60%)",
    paletteColors: ["#11151a", "#1a2028", "#8fa3b8", "#e8ecf0"],
  },

  // 8. BLUSH (Light)
  blush: {
    id: "blush",
    name: "Blush",
    isDark: false,
    isPro: true,
    bg: "#f5ece8",
    surface: "#ffffff",
    surfaceRaised: "#fcf6f3",
    border: "rgba(43, 29, 29, 0.08)",
    borderStrong: "rgba(183, 110, 121, 0.25)",
    text: "#2b1d1d",
    muted: "rgba(43, 29, 29, 0.6)",
    accent: "#b76e79",
    accentHover: "#cb858f",
    radiusCard: "16px",
    headingFont: "Fraunces",
    headingFontFamily: "'Fraunces', Georgia, serif",
    bgTint: "radial-gradient(circle at 50% 0%, rgba(183, 110, 121, 0.04) 0%, transparent 60%)",
    paletteColors: ["#f5ece8", "#ffffff", "#b76e79", "#2b1d1d"],
  },

  // 9. OCEAN
  ocean: {
    id: "ocean",
    name: "Ocean",
    isDark: true,
    isPro: true,
    bg: "#08141c",
    surface: "#0f212d",
    surfaceRaised: "#152b3a",
    border: "rgba(233, 241, 245, 0.08)",
    borderStrong: "rgba(127, 181, 201, 0.3)",
    text: "#e9f1f5",
    muted: "rgba(233, 241, 245, 0.6)",
    accent: "#7fb5c9",
    accentHover: "#99ccde",
    radiusCard: "14px",
    headingFont: "Instrument Serif",
    headingFontFamily: "'Instrument Serif', Georgia, serif",
    bgTint: "radial-gradient(circle at 50% 0%, rgba(127, 181, 201, 0.05) 0%, transparent 60%)",
    paletteColors: ["#08141c", "#0f212d", "#7fb5c9", "#e9f1f5"],
  },

  // 10. GRAPHITE (Monochrome)
  graphite: {
    id: "graphite",
    name: "Graphite",
    isDark: true,
    isPro: true,
    bg: "#101010",
    surface: "#1a1a1a",
    surfaceRaised: "#222222",
    border: "rgba(237, 237, 237, 0.08)",
    borderStrong: "rgba(255, 255, 255, 0.35)",
    text: "#ededed",
    muted: "rgba(237, 237, 237, 0.58)",
    accent: "#ffffff",
    accentHover: "#f0f0f0",
    radiusCard: "10px",
    headingFont: "Bodoni Moda",
    headingFontFamily: "'Bodoni Moda', Georgia, serif",
    bgTint: "radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 0.04) 0%, transparent 60%)",
    paletteColors: ["#101010", "#1a1a1a", "#ffffff", "#ededed"],
  },

  // 11. PLUM
  plum: {
    id: "plum",
    name: "Plum",
    isDark: true,
    isPro: true,
    bg: "#130d1a",
    surface: "#1e1529",
    surfaceRaised: "#271c35",
    border: "rgba(239, 232, 245, 0.08)",
    borderStrong: "rgba(183, 154, 209, 0.3)",
    text: "#efe8f5",
    muted: "rgba(239, 232, 245, 0.6)",
    accent: "#b79ad1",
    accentHover: "#cbb2e2",
    radiusCard: "14px",
    headingFont: "Playfair Display",
    headingFontFamily: "'Playfair Display', Georgia, serif",
    bgTint: "radial-gradient(circle at 50% 0%, rgba(183, 154, 209, 0.05) 0%, transparent 60%)",
    paletteColors: ["#130d1a", "#1e1529", "#b79ad1", "#efe8f5"],
  },

  // 12. PAPER (Light Monochrome)
  paper: {
    id: "paper",
    name: "Paper",
    isDark: false,
    isPro: true,
    bg: "#fafafa",
    surface: "#ffffff",
    surfaceRaised: "#f3f3f3",
    border: "rgba(17, 17, 17, 0.08)",
    borderStrong: "rgba(17, 17, 17, 0.25)",
    text: "#111111",
    muted: "rgba(17, 17, 17, 0.58)",
    accent: "#111111",
    accentHover: "#333333",
    radiusCard: "8px",
    headingFont: "Instrument Serif",
    headingFontFamily: "'Instrument Serif', Georgia, serif",
    bgTint: "radial-gradient(circle at 50% 0%, rgba(17, 17, 17, 0.03) 0%, transparent 60%)",
    paletteColors: ["#fafafa", "#ffffff", "#111111", "#111111"],
  },

  // 13. APPLE (Modern Light, San Francisco Font)
  apple: {
    id: "apple",
    name: "Apple Modern",
    isDark: false,
    isPro: true,
    bg: "#f5f5f7",
    surface: "#ffffff",
    surfaceRaised: "#ededf0",
    border: "rgba(29, 29, 31, 0.1)",
    borderStrong: "rgba(0, 122, 255, 0.4)",
    text: "#1d1d1f",
    muted: "#86868b",
    accent: "#007aff",
    accentHover: "#0062cc",
    radiusCard: "18px",
    headingFont: "San Francisco",
    headingFontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif",
    bgTint: "radial-gradient(circle at 50% 0%, rgba(0, 122, 255, 0.05) 0%, transparent 60%)",
    paletteColors: ["#f5f5f7", "#1d1d1f", "#aaaaaa", "#007aff"],
  },

  // 14. BMW (Performance Black & M Blue, Helvetica Bold)
  bmw: {
    id: "bmw",
    name: "BMW Performance",
    isDark: true,
    isPro: true,
    bg: "#000000",
    surface: "#0f0f11",
    surfaceRaised: "#18181b",
    border: "rgba(255, 255, 255, 0.12)",
    borderStrong: "rgba(74, 165, 210, 0.6)",
    text: "#ffffff",
    muted: "rgba(255, 255, 255, 0.65)",
    accent: "#4aa5d2",
    accentHover: "#3994c1",
    radiusCard: "8px",
    headingFont: "Helvetica Bold",
    headingFontFamily: "'Helvetica Neue', Helvetica, 'Arial Black', Arial, sans-serif",
    bgTint: "radial-gradient(circle at 50% 0%, rgba(74, 165, 210, 0.08) 0%, transparent 60%)",
    paletteColors: ["#000000", "#4aa5d2", "#ffffff", "#18181b"],
  },

  // 15. MINECRAFT (8-Bit Blocky Voxel, Diamond Cyan & Grass Green)
  minecraft: {
    id: "minecraft",
    name: "Minecraft Voxel",
    isDark: true,
    isPro: true,
    bg: "#151413",
    surface: "#26211b",
    surfaceRaised: "#352e25",
    border: "rgba(85, 168, 50, 0.4)",
    borderStrong: "#4dedf4",
    text: "#ffffff",
    muted: "rgba(255, 255, 255, 0.65)",
    accent: "#4dedf4",
    accentHover: "#2fe0d8",
    radiusCard: "4px",
    headingFont: "Silkscreen",
    headingFontFamily: "'Silkscreen', 'Courier New', monospace",
    bgTint: "radial-gradient(circle at 50% 0%, rgba(77, 237, 244, 0.07) 0%, transparent 60%)",
    paletteColors: ["#151413", "#26211b", "#55a832", "#4dedf4"],
  },
};

export const THEMES_LIST: ThemeConfig[] = [
  THEMES.midnight,
  THEMES.apple,
  THEMES.bmw,
  THEMES.minecraft,
  THEMES.ivory,
  THEMES.obsidian,
  THEMES.forest,
  THEMES.burgundy,
  THEMES.sand,
  THEMES.slate,
  THEMES.blush,
  THEMES.ocean,
  THEMES.graphite,
  THEMES.plum,
  THEMES.paper,
];

/**
 * Returns the theme config for a given theme id.
 * Defaults safely to "midnight" if the id is missing or unlisted.
 */
export function getTheme(id?: string | null): ThemeConfig {
  if (!id) return THEMES.midnight;
  return THEMES[id] || THEMES.midnight;
}

/**
 * Determines whether a theme requires a Pro subscription.
 */
export function isProTheme(id?: string | null): boolean {
  if (!id) return false;
  const theme = THEMES[id];
  return Boolean(theme?.isPro);
}

/**
 * Generates the CSS custom properties style object for a given theme.
 * Applied directly to the profile wrapper and live preview container.
 */
export function getThemeStyles(theme: ThemeConfig): React.CSSProperties {
  return {
    "--theme-bg": theme.bg,
    "--theme-surface": theme.surface,
    "--theme-surface-raised": theme.surfaceRaised,
    "--theme-border": theme.border,
    "--theme-border-strong": theme.borderStrong,
    "--theme-text": theme.text,
    "--theme-muted": theme.muted,
    "--theme-accent": theme.accent,
    "--theme-accent-hover": theme.accentHover,
    "--theme-radius-card": theme.radiusCard,
    "--theme-heading-font": theme.headingFontFamily,
    backgroundColor: theme.bg,
    color: theme.text,
  } as React.CSSProperties;
}
