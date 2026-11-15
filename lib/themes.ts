import { ThemeId } from "@/types";

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  isDark: boolean;
  previewBg: string;
  previewCard: string;
  previewAccent: string;
  fontFamily: string;
  fontHeadingClass: string;
  fontBodyClass: string;
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
  // 1. APPLE EDITION: Cupertino Minimalist & Frosted Glass
  apple: {
    id: "apple",
    name: "Apple Edition",
    shortName: "Apple",
    tagline: "Cupertino Minimalist",
    description: "San Francisco typography with refined frosted glass cards and iOS elegance.",
    isDark: true,
    previewBg: "linear-gradient(180deg, #161618 0%, #000000 100%)",
    previewCard: "rgba(255, 255, 255, 0.08)",
    previewAccent: "#0071e3",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', sans-serif",
    fontHeadingClass: "font-[-apple-system,BlinkMacSystemFont,'SF_Pro_Display','Helvetica_Neue',sans-serif] tracking-tight font-semibold",
    fontBodyClass: "font-[-apple-system,BlinkMacSystemFont,'SF_Pro_Text','Helvetica_Neue',sans-serif]",
    background: "bg-[#000000] text-[#f5f5f7] min-h-screen",
    card: "bg-white/[0.07] hover:bg-white/[0.12] active:bg-white/[0.18] backdrop-blur-xl border border-white/[0.14] hover:border-white/30 rounded-[18px] text-[#f5f5f7] shadow-[0_4px_24px_rgba(0,0,0,0.35)]",
    cardHover: "hover:scale-[1.01] active:scale-[0.99] transition-all duration-200",
    cardText: "text-[#f5f5f7] group-hover:text-white font-medium text-sm sm:text-base tracking-tight",
    cardSubtext: "text-[#86868b] text-xs font-normal",
    textPrimary: "text-[#f5f5f7] font-semibold tracking-tight",
    textSecondary: "text-[#86868b] text-xs",
    avatarRing: "ring-2 ring-white/20 shadow-[0_0_24px_rgba(255,255,255,0.08)] rounded-full",
    buttonShadow: "shadow-sm shadow-black/40",
    badge: "bg-white/[0.12] text-[#f5f5f7] border border-white/20 rounded-full font-medium text-[9px] tracking-wide",
    arrowColor: "text-[#86868b] group-hover:text-white",
    accentColor: "#0071e3",
  },

  // 2. BMW M EDITION: High-Performance Automotive Precision
  bmw: {
    id: "bmw",
    name: "BMW M Edition",
    shortName: "BMW M",
    tagline: "High-Performance Precision",
    description: "Obsidian carbon surfaces with BMW M-Power tricolor accents and aerodynamic precision.",
    isDark: true,
    previewBg: "linear-gradient(135deg, #080a0f 0%, #111726 100%)",
    previewCard: "#0d131f",
    previewAccent: "#009ada",
    fontFamily: "'Space Grotesk', -apple-system, sans-serif",
    fontHeadingClass: "font-['Space_Grotesk',sans-serif] tracking-wider uppercase font-bold",
    fontBodyClass: "font-['Space_Grotesk',sans-serif]",
    background: "bg-[#080a0f] text-[#f8fafc] min-h-screen",
    card: "relative bg-[#0d131f] hover:bg-[#141d2e] border-l-4 border-l-[#009ada] border-y border-r border-[#1e293b] hover:border-[#009ada]/70 rounded-[10px] text-[#f8fafc] shadow-[0_8px_30px_rgba(0,0,0,0.7)]",
    cardHover: "hover:scale-[1.01] active:scale-[0.99] transition-all duration-150",
    cardText: "text-[#f8fafc] group-hover:text-[#38bdf8] font-bold text-sm tracking-wide uppercase",
    cardSubtext: "text-[#64748b] text-xs font-mono",
    textPrimary: "text-[#f8fafc] font-bold tracking-wider uppercase",
    textSecondary: "text-[#64748b] text-xs font-mono uppercase tracking-widest",
    avatarRing: "ring-2 ring-[#009ada] shadow-[0_0_24px_rgba(0,154,218,0.35)] rounded-full",
    buttonShadow: "shadow-md shadow-black/80",
    badge: "bg-[#009ada]/15 text-[#38bdf8] border border-[#009ada]/40 rounded-[4px] font-mono font-bold text-[9px] uppercase tracking-wider",
    arrowColor: "text-[#009ada] group-hover:text-[#38bdf8]",
    accentColor: "#009ada",
  },

  // 3. MINECRAFT EDITION: Authentic Voxel Retro Sandbox
  minecraft: {
    id: "minecraft",
    name: "Minecraft Edition",
    shortName: "Minecraft",
    tagline: "Voxel Sandbox Retro",
    description: "Authentic 3D beveled block cards, retro pixel font, with diamond & emerald accents.",
    isDark: true,
    previewBg: "linear-gradient(180deg, #18181b 0%, #09090b 100%)",
    previewCard: "#2b2b2b",
    previewAccent: "#55ff55",
    fontFamily: "'Silkscreen', monospace",
    fontHeadingClass: "font-['Silkscreen',monospace] tracking-widest uppercase font-bold drop-shadow-[2px_2px_0px_#000000]",
    fontBodyClass: "font-['Silkscreen',monospace]",
    background: "bg-[#141416] text-[#e0e0e0] min-h-screen",
    card: "bg-[#2b2b2b] hover:bg-[#353535] border-2 border-t-[#666666] border-l-[#666666] border-b-[#111111] border-r-[#111111] active:border-t-[#111111] active:border-l-[#111111] active:border-b-[#666666] active:border-r-[#666666] rounded-none text-white shadow-[2px_2px_0px_#000000]",
    cardHover: "transition-none",
    cardText: "text-[#ffffff] group-hover:text-[#55ff55] font-bold text-xs tracking-wider",
    cardSubtext: "text-[#aaaaaa] text-[10px]",
    textPrimary: "text-[#ffffff] font-bold tracking-widest uppercase drop-shadow-[2px_2px_0px_#000000]",
    textSecondary: "text-[#55ff55] text-[10px] uppercase tracking-widest",
    avatarRing: "border-2 border-[#55ff55] rounded-none shadow-[2px_2px_0px_#000000]",
    buttonShadow: "shadow-[2px_2px_0px_#000000]",
    badge: "bg-[#1a381a] text-[#55ff55] border border-[#55ff55]/60 rounded-none font-bold text-[8px] uppercase tracking-widest",
    arrowColor: "text-[#55ff55] group-hover:text-white",
    accentColor: "#55ff55",
  },
};

// Primary 3 themes explicitly requested by user
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
  // Default to Apple Edition for any unspecified or legacy themes
  return THEMES.apple;
}

export function isDarkTheme(themeId?: string): boolean {
  return true;
}
