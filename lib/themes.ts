import { ThemeId } from "@/types";

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  shortName: string;
  tagline: string;
  fontName: string;
  fontFamily: string;
  fontHeadingClass: string;
  fontBodyClass: string;
  isDark: boolean;
  paletteColors: string[];
  previewBg: string;
  previewCard: string;
  previewAccent: string;
  background: string;
  card: string;
  cardHover: string;
  cardText: string;
  cardSubtext: string;
  textPrimary: string;
  textSecondary: string;
  avatarRing: string;
  buttonShadow: string;
  badge: string;
  arrowColor: string;
  accentColor: string;
}

export const THEMES: Record<string, ThemeConfig> = {
  // 1. APPLE MODERN: San Francisco font + #F5F5F7 / #1D1D1F / #AAAAAA / #007AFF
  apple: {
    id: "apple",
    name: "Apple Modern",
    shortName: "Apple",
    tagline: "San Francisco • #1D1D1F / #F5F5F7 / #007AFF",
    fontName: "San Francisco",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', sans-serif",
    fontHeadingClass: "font-[-apple-system,BlinkMacSystemFont,'SF_Pro_Display','SF_Pro','Helvetica_Neue',sans-serif] tracking-tight font-semibold text-[#F5F5F7]",
    fontBodyClass: "font-[-apple-system,BlinkMacSystemFont,'SF_Pro_Text','SF_Pro','Helvetica_Neue',sans-serif]",
    isDark: true,
    paletteColors: ["#F5F5F7", "#1D1D1F", "#AAAAAA", "#007AFF"],
    previewBg: "#1D1D1F",
    previewCard: "#2C2C2E",
    previewAccent: "#007AFF",
    background: "bg-[#1D1D1F] text-[#F5F5F7] min-h-screen",
    card: "bg-[#2C2C2E] hover:bg-[#3A3A3C] active:bg-[#48484A] border border-[#AAAAAA]/25 hover:border-[#007AFF]/70 rounded-[18px] text-[#F5F5F7] shadow-sm",
    cardHover: "hover:scale-[1.01] active:scale-[0.99] transition-all duration-200",
    cardText: "text-[#F5F5F7] group-hover:text-white font-medium text-sm sm:text-base tracking-tight",
    cardSubtext: "text-[#AAAAAA] text-xs font-normal",
    textPrimary: "text-[#F5F5F7] font-semibold tracking-tight",
    textSecondary: "text-[#AAAAAA] text-xs",
    avatarRing: "ring-2 ring-[#AAAAAA]/30 shadow-[0_0_24px_rgba(0,122,255,0.25)] rounded-full",
    buttonShadow: "shadow-sm shadow-black/40",
    badge: "bg-[#007AFF]/15 text-[#007AFF] border border-[#007AFF]/35 rounded-full font-medium text-[9px] tracking-wide",
    arrowColor: "text-[#AAAAAA] group-hover:text-[#007AFF]",
    accentColor: "#007AFF",
  },

  // 2. BMW: Helvetica Bold + #FFFFFF / #4AA5D2 / #000000
  bmw: {
    id: "bmw",
    name: "BMW Edition",
    shortName: "BMW",
    tagline: "Helvetica Bold • #000000 / #4AA5D2 / #FFFFFF",
    fontName: "Helvetica Bold",
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    fontHeadingClass: "font-['Helvetica_Neue',Helvetica,Arial,sans-serif] font-bold tracking-tight text-[#FFFFFF] uppercase",
    fontBodyClass: "font-['Helvetica_Neue',Helvetica,Arial,sans-serif]",
    isDark: true,
    paletteColors: ["#FFFFFF", "#4AA5D2", "#000000"],
    previewBg: "#000000",
    previewCard: "#0D0D0D",
    previewAccent: "#4AA5D2",
    background: "bg-[#000000] text-[#FFFFFF] min-h-screen",
    card: "relative bg-[#0D0D0D] hover:bg-[#161616] border border-[#4AA5D2]/40 hover:border-[#4AA5D2] rounded-[10px] text-[#FFFFFF] shadow-[0_8px_30px_rgba(0,0,0,0.85)]",
    cardHover: "hover:scale-[1.01] active:scale-[0.99] transition-all duration-150",
    cardText: "text-[#FFFFFF] group-hover:text-[#4AA5D2] font-bold text-sm tracking-wide uppercase",
    cardSubtext: "text-[#4AA5D2]/80 text-xs",
    textPrimary: "text-[#FFFFFF] font-bold tracking-tight uppercase",
    textSecondary: "text-[#4AA5D2] text-xs font-semibold tracking-wider uppercase",
    avatarRing: "ring-2 ring-[#4AA5D2] shadow-[0_0_24px_rgba(74,165,210,0.45)] rounded-full",
    buttonShadow: "shadow-md shadow-black/90",
    badge: "bg-[#4AA5D2]/15 text-[#4AA5D2] border border-[#4AA5D2]/50 rounded-[4px] font-bold text-[9px] uppercase tracking-wider",
    arrowColor: "text-[#4AA5D2] group-hover:text-white",
    accentColor: "#4AA5D2",
  },

  // 3. MINECRAFT EDITION: Silkscreen Voxel Retro Sandbox
  minecraft: {
    id: "minecraft",
    name: "Minecraft Edition",
    shortName: "Minecraft",
    tagline: "Silkscreen Pixel • Voxel Retro",
    fontName: "Silkscreen",
    fontFamily: "'Silkscreen', monospace",
    fontHeadingClass: "font-['Silkscreen',monospace] tracking-widest uppercase font-bold drop-shadow-[2px_2px_0px_#000000]",
    fontBodyClass: "font-['Silkscreen',monospace]",
    isDark: true,
    paletteColors: ["#2B2B2B", "#55FF55", "#55FFFF", "#000000"],
    previewBg: "#141416",
    previewCard: "#2B2B2B",
    previewAccent: "#55FF55",
    background: "bg-[#141416] text-[#E0E0E0] min-h-screen",
    card: "bg-[#2B2B2B] hover:bg-[#353535] border-2 border-t-[#666666] border-l-[#666666] border-b-[#111111] border-r-[#111111] active:border-t-[#111111] active:border-l-[#111111] active:border-b-[#666666] active:border-r-[#666666] rounded-none text-white shadow-[2px_2px_0px_#000000]",
    cardHover: "transition-none",
    cardText: "text-[#FFFFFF] group-hover:text-[#55FF55] font-bold text-xs tracking-wider",
    cardSubtext: "text-[#AAAAAA] text-[10px]",
    textPrimary: "text-[#FFFFFF] font-bold tracking-widest uppercase drop-shadow-[2px_2px_0px_#000000]",
    textSecondary: "text-[#55FF55] text-[10px] uppercase tracking-widest",
    avatarRing: "border-2 border-[#55FF55] rounded-none shadow-[2px_2px_0px_#000000]",
    buttonShadow: "shadow-[2px_2px_0px_#000000]",
    badge: "bg-[#1A381A] text-[#55FF55] border border-[#55FF55]/60 rounded-none font-bold text-[8px] uppercase tracking-widest",
    arrowColor: "text-[#55FF55] group-hover:text-white",
    accentColor: "#55FF55",
  },
};

// 3 Core selectable themes
export const PRIMARY_THEMES: ThemeConfig[] = [
  THEMES.apple,
  THEMES.bmw,
  THEMES.minecraft,
];

export const THEME_LIST = PRIMARY_THEMES;

export function getTheme(themeId?: string | null): ThemeConfig {
  if (themeId && THEMES[themeId]) {
    return THEMES[themeId];
  }
  return THEMES.apple;
}

export function isDarkTheme(themeId?: string): boolean {
  return true;
}
