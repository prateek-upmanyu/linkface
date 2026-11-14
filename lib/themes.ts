import { ThemeId } from "@/types";

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  shortName: string;
  description: string;
  previewBg: string;
  previewCard: string;
  previewText: string;
  background: string;
  card: string;
  cardHover: string;
  textPrimary: string;
  textSecondary: string;
  avatarRing: string;
  buttonShadow: string;
  badge: string;
}

export const THEMES: Record<ThemeId, ThemeConfig> = {
  "luxury-craft": {
    id: "luxury-craft",
    name: "Royal Crimson & Gold",
    shortName: "Royal Crimson",
    description: "Deep noir-crimson velvet with brushed 24k gold borders and warm champagne radiance.",
    previewBg: "linear-gradient(135deg, #18050a 0%, #300913 50%, #0d0205 100%)",
    previewCard: "rgba(38, 11, 18, 0.85)",
    previewText: "#faedd0",
    background: "bg-gradient-to-b from-[#140407] via-[#1f070d] to-[#0a0204] text-[#faedd0] min-h-screen",
    card: "luxury-link-card bg-[#1c080f]/80 text-[#faedd0] border border-[#d4af37]/30 hover:border-[#d4af37]/70 rounded-2xl",
    cardHover: "hover:scale-[1.015] active:scale-[0.99]",
    textPrimary: "font-serif text-[#faedd0] tracking-normal font-semibold",
    textSecondary: "text-[#d4af37]/80 text-xs",
    avatarRing: "ring-2 ring-[#d4af37]/70 shadow-[0_0_25px_rgba(212,175,55,0.28)] rounded-full",
    buttonShadow: "shadow-[0_8px_24px_rgba(0,0,0,0.6)]",
    badge: "bg-[#250910]/90 border border-[#d4af37]/40 text-[#f7e7b4] text-[10px] tracking-widest",
  },
  luxury: {
    id: "luxury",
    name: "Noir Velvet & Gold",
    shortName: "Noir Gold",
    description: "Refined midnight velvet with brushed champagne gold accents and subtle warm glow.",
    previewBg: "linear-gradient(180deg, #110508 0%, #050102 100%)",
    previewCard: "rgba(28, 9, 14, 0.9)",
    previewText: "#f7e7b4",
    background: "bg-gradient-to-b from-[#0f0407] via-[#14060a] to-[#070203] text-[#f7e7b4] min-h-screen",
    card: "bg-[#18070d]/80 text-[#faedd0] border border-[#d4af37]/25 hover:border-[#d4af37]/65 shadow-[0_8px_25px_rgba(0,0,0,0.7)] hover:shadow-[0_0_25px_rgba(212,175,55,0.2)] rounded-2xl",
    cardHover: "hover:scale-[1.015] active:scale-[0.99]",
    textPrimary: "font-serif text-[#faedd0] tracking-normal font-medium",
    textSecondary: "text-[#d4af37]/75 text-xs",
    avatarRing: "ring-2 ring-[#d4af37]/60 shadow-[0_0_30px_rgba(212,175,55,0.25)] rounded-full",
    buttonShadow: "shadow-[0_8px_20px_rgba(0,0,0,0.6)]",
    badge: "bg-[#1f0910]/90 border border-[#d4af37]/35 text-[#d4af37]",
  },
  minecraft: {
    id: "minecraft",
    name: "Imperial Burgundy",
    shortName: "Burgundy",
    description: "Opulent rich burgundy with satin gold frames and polished lustrous bevels.",
    previewBg: "linear-gradient(135deg, #260810 0%, #450c1b 100%)",
    previewCard: "#330a14",
    previewText: "#faedd0",
    background: "bg-gradient-to-b from-[#1a050b] via-[#240810] to-[#0e0306] text-[#faedd0] min-h-screen",
    card: "luxury-link-card bg-[#280a13]/80 text-[#faedd0] border border-[#d4af37]/35 hover:border-[#e6c86e] rounded-2xl",
    cardHover: "hover:scale-[1.015] active:scale-[0.99]",
    textPrimary: "font-serif text-[#faedd0] tracking-wide font-bold",
    textSecondary: "text-[#e6c86e]/80 text-xs",
    avatarRing: "ring-2 ring-[#e6c86e]/80 shadow-[0_0_30px_rgba(230,200,110,0.3)] rounded-full",
    buttonShadow: "shadow-[0_8px_25px_rgba(0,0,0,0.65)]",
    badge: "bg-[#330c18] border border-[#d4af37]/50 text-[#faedd0] text-[10px]",
  },
  light: {
    id: "light",
    name: "Ivory & Soft Gold",
    shortName: "Ivory Gold",
    description: "Warm champagne ivory background with rich goldenrod accents and soft shadows.",
    previewBg: "#fbf8f2",
    previewCard: "#ffffff",
    previewText: "#2a0a12",
    background: "bg-gradient-to-b from-[#fbf8f2] via-[#f7f2e7] to-[#ede4d3] text-[#2a0a12] min-h-screen",
    card: "bg-white/90 text-[#2a0a12] border border-[#d4af37]/35 hover:border-[#d4af37] shadow-[0_6px_20px_rgba(212,175,55,0.12)] rounded-2xl",
    cardHover: "hover:scale-[1.015] active:scale-[0.99]",
    textPrimary: "font-serif text-[#2a0a12] font-semibold",
    textSecondary: "text-[#8a1427]/80 text-xs",
    avatarRing: "ring-2 ring-[#d4af37] shadow-[0_0_20px_rgba(212,175,55,0.25)] rounded-full",
    buttonShadow: "shadow-sm hover:shadow-md",
    badge: "bg-[#f5ebd7] border border-[#d4af37]/40 text-[#6f1225]",
  },
  dark: {
    id: "dark",
    name: "Midnight Ruby",
    shortName: "Midnight",
    description: "Deep obsidian velvet with crimson undertones and brilliant gold edge lighting.",
    previewBg: "#080204",
    previewCard: "#160509",
    previewText: "#faedd0",
    background: "bg-gradient-to-b from-[#090204] via-[#100407] to-[#040102] text-[#faedd0] min-h-screen",
    card: "luxury-link-card bg-[#140408]/85 text-[#faedd0] border border-[#d4af37]/25 hover:border-[#d4af37]/70 rounded-2xl",
    cardHover: "hover:scale-[1.015] active:scale-[0.99]",
    textPrimary: "font-serif text-[#faedd0] font-medium",
    textSecondary: "text-[#d4af37]/70 text-xs",
    avatarRing: "ring-2 ring-[#d4af37]/70 shadow-[0_0_30px_rgba(212,175,55,0.25)] rounded-full",
    buttonShadow: "shadow-[0_8px_25px_rgba(0,0,0,0.8)]",
    badge: "bg-[#180509] border border-[#d4af37]/30 text-[#d4af37]",
  },
  gradient: {
    id: "gradient",
    name: "Crimson Velvet Glow",
    shortName: "Velvet Glow",
    description: "Rich royal crimson-to-burgundy gradient with warm frosted gold glass cards.",
    previewBg: "linear-gradient(135deg, #460c18 0%, #6f1225 50%, #1a0409 100%)",
    previewCard: "rgba(250, 237, 208, 0.12)",
    previewText: "#ffffff",
    background: "bg-gradient-to-br from-[#3b0914] via-[#520d1c] to-[#120306] text-white min-h-screen",
    card: "bg-white/10 backdrop-blur-md text-[#faedd0] border border-[#d4af37]/30 hover:bg-white/15 hover:border-[#d4af37]/70 shadow-lg rounded-2xl",
    cardHover: "hover:scale-[1.015] active:scale-[0.99]",
    textPrimary: "font-serif text-white",
    textSecondary: "text-[#faedd0]/80 text-xs",
    avatarRing: "ring-2 ring-[#d4af37] shadow-[0_0_35px_rgba(212,175,55,0.35)] rounded-full",
    buttonShadow: "shadow-lg shadow-black/40",
    badge: "bg-white/15 border border-[#d4af37]/40 text-[#faedd0]",
  },
  minimal: {
    id: "minimal",
    name: "Haute Couture Gold",
    shortName: "Haute Gold",
    description: "Minimalist editorial design with hairline gold borders and pure typographic elegance.",
    previewBg: "#0a0305",
    previewCard: "#120508",
    previewText: "#faedd0",
    background: "bg-[#0a0305] text-[#faedd0] min-h-screen",
    card: "bg-transparent text-[#faedd0] border border-[#d4af37]/40 hover:border-[#d4af37] hover:bg-[#1a070e]/40 transition-colors duration-200 rounded-xl",
    cardHover: "transition-all",
    textPrimary: "font-serif text-[#faedd0] tracking-wide",
    textSecondary: "text-[#d4af37]/70 text-xs",
    avatarRing: "ring-1 ring-[#d4af37]/80 rounded-full",
    buttonShadow: "",
    badge: "bg-[#17060b] border border-[#d4af37]/40 text-[#faedd0]",
  },
  colorful: {
    id: "colorful",
    name: "Rose Champagne & Gold",
    shortName: "Rose Gold",
    description: "Sophisticated dusty rose-crimson ambiance with shimmering champagne gold highlights.",
    previewBg: "linear-gradient(135deg, #2b0c16 0%, #4a1526 100%)",
    previewCard: "rgba(250, 237, 208, 0.15)",
    previewText: "#faedd0",
    background: "bg-gradient-to-br from-[#240912] via-[#330c1a] to-[#120409] text-[#faedd0] min-h-screen",
    card: "bg-[#2d0e19]/80 text-[#faedd0] border border-[#e6c86e]/30 hover:border-[#e6c86e]/70 shadow-md rounded-2xl",
    cardHover: "hover:scale-[1.015] active:scale-[0.99]",
    textPrimary: "font-serif text-[#faedd0]",
    textSecondary: "text-[#faedd0]/70 text-xs",
    avatarRing: "ring-2 ring-[#e6c86e]/80 shadow-[0_0_25px_rgba(230,200,110,0.3)] rounded-full",
    buttonShadow: "shadow-md shadow-black/50",
    badge: "bg-[#38101f] border border-[#e6c86e]/40 text-[#faedd0]",
  },
};

export const THEME_LIST = Object.values(THEMES);

export function isDarkTheme(themeId?: string): boolean {
  return themeId !== "light";
}
