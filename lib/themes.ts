import { ThemeId } from "@/types";

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  shortName: string;
  description: string;
  isDark: boolean;
  previewBg: string;
  previewCard: string;
  previewText: string;
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
}

export const THEMES: Record<ThemeId, ThemeConfig> = {
  // 1. Blinkit Signature Yellow Minimal (Light)
  light: {
    id: "light",
    name: "Blinkit Yellow Minimal",
    shortName: "Blinkit Light",
    description: "Iconic Blinkit warm yellow & clean charcoal on minimal crisp white.",
    isDark: false,
    previewBg: "#f8f9fa",
    previewCard: "#ffffff",
    previewText: "#111827",
    background: "bg-[#f8f9fa] text-neutral-900 min-h-screen",
    card: "bg-white text-neutral-900 border border-neutral-200/90 hover:border-[#f8cb46] shadow-xs rounded-2xl",
    cardHover: "hover:scale-[1.01] active:scale-[0.99] transition-all",
    cardText: "text-neutral-900 group-hover:text-black font-semibold",
    cardSubtext: "text-neutral-500",
    textPrimary: "font-serif text-neutral-900 font-bold",
    textSecondary: "text-neutral-600 text-xs font-sans",
    avatarRing: "ring-2 ring-[#f8cb46] shadow-[0_0_16px_rgba(248,203,70,0.35)] rounded-full",
    buttonShadow: "shadow-xs hover:shadow-md",
    badge: "bg-[#f8cb46] text-neutral-950 font-semibold border border-[#eab308]",
  },

  // 2. Blinkit Dark Midnight (Minimal Dark)
  dark: {
    id: "dark",
    name: "Blinkit Midnight Dark",
    shortName: "Blinkit Dark",
    description: "Deep carbon background with clean cards and signature Blinkit yellow accents.",
    isDark: true,
    previewBg: "#0f172a",
    previewCard: "#1e293b",
    previewText: "#ffffff",
    background: "bg-[#0f172a] text-white min-h-screen",
    card: "bg-[#1e293b]/95 text-white border border-slate-700/70 hover:border-[#f8cb46]/80 shadow-md rounded-2xl",
    cardHover: "hover:scale-[1.01] active:scale-[0.99] transition-all",
    cardText: "text-white group-hover:text-amber-200 font-medium",
    cardSubtext: "text-slate-400",
    textPrimary: "font-serif text-white font-bold",
    textSecondary: "text-slate-300 text-xs font-sans",
    avatarRing: "ring-2 ring-[#f8cb46] shadow-[0_0_20px_rgba(248,203,70,0.3)] rounded-full",
    buttonShadow: "shadow-md shadow-black/40",
    badge: "bg-[#1e293b] text-[#f8cb46] border border-[#f8cb46]/50",
  },

  // 3. Dark Red & Amber (Blinkit Minimal Wine)
  "luxury-craft": {
    id: "luxury-craft",
    name: "Dark Red & Amber",
    shortName: "Dark Red",
    description: "Deep rich wine red background with minimal warm yellow accents.",
    isDark: true,
    previewBg: "linear-gradient(135deg, #1c050c 0%, #2e0712 100%)",
    previewCard: "#22050e",
    previewText: "#ffffff",
    background: "bg-gradient-to-b from-[#120306] via-[#1a050b] to-[#0a0103] text-white min-h-screen",
    card: "bg-[#1c060d]/95 text-white border border-[#f8cb46]/25 hover:border-[#f8cb46]/60 shadow-md rounded-2xl",
    cardHover: "hover:scale-[1.01] active:scale-[0.99] transition-all",
    cardText: "text-white group-hover:text-amber-200 font-medium",
    cardSubtext: "text-slate-300",
    textPrimary: "font-serif text-white font-bold",
    textSecondary: "text-slate-300 text-xs font-sans",
    avatarRing: "ring-2 ring-[#f8cb46]/75 shadow-[0_0_20px_rgba(248,203,70,0.25)] rounded-full",
    buttonShadow: "shadow-md shadow-black/60",
    badge: "bg-[#25060f] border border-[#f8cb46]/40 text-slate-100",
  },

  // 4. Fresh Emerald Green & White (Blinkit Fresh Grocers)
  minimal: {
    id: "minimal",
    name: "Fresh Emerald Minimal",
    shortName: "Emerald Fresh",
    description: "Minimal pure white with signature Blinkit emerald green and yellow highlights.",
    isDark: false,
    previewBg: "#f9fafb",
    previewCard: "#ffffff",
    previewText: "#0c831f",
    background: "bg-[#f9fafb] text-neutral-900 min-h-screen",
    card: "bg-white text-neutral-900 border border-neutral-200 hover:border-[#0c831f] shadow-xs rounded-2xl",
    cardHover: "hover:scale-[1.01] active:scale-[0.99] transition-all",
    cardText: "text-neutral-900 group-hover:text-[#0c831f] font-semibold",
    cardSubtext: "text-neutral-500",
    textPrimary: "font-serif text-neutral-900 font-bold",
    textSecondary: "text-neutral-600 text-xs font-sans",
    avatarRing: "ring-2 ring-[#0c831f] shadow-[0_0_16px_rgba(12,131,31,0.25)] rounded-full",
    buttonShadow: "shadow-xs hover:shadow-md",
    badge: "bg-[#e8f7ec] text-[#0c831f] border border-[#0c831f]/40 font-semibold",
  },

  // 5. Bordeaux & Amber (Deep Minimal Velvet)
  luxury: {
    id: "luxury",
    name: "Bordeaux & Dark Yellow",
    shortName: "Bordeaux",
    description: "Refined dark bordeaux surface with warm amber borders and clean typography.",
    isDark: true,
    previewBg: "linear-gradient(180deg, #170409 0%, #0d0205 100%)",
    previewCard: "#20050d",
    previewText: "#ffffff",
    background: "bg-gradient-to-b from-[#140307] via-[#1a050a] to-[#0b0103] text-white min-h-screen",
    card: "bg-[#1c050c]/95 text-white border border-[#f8cb46]/20 hover:border-[#f8cb46]/55 shadow-md rounded-2xl",
    cardHover: "hover:scale-[1.01] active:scale-[0.99] transition-all",
    cardText: "text-white group-hover:text-amber-200 font-medium",
    cardSubtext: "text-slate-300",
    textPrimary: "font-serif text-white font-medium",
    textSecondary: "text-slate-300 text-xs font-sans",
    avatarRing: "ring-2 ring-[#f8cb46]/60 shadow-[0_0_25px_rgba(248,203,70,0.2)] rounded-full",
    buttonShadow: "shadow-md shadow-black/60",
    badge: "bg-[#24060f] border border-[#f8cb46]/35 text-slate-100",
  },

  // 6. Imperial Wine
  minecraft: {
    id: "minecraft",
    name: "Imperial Wine",
    shortName: "Wine",
    description: "Opulent rich dark wine tone with dark yellow frames and high contrast text.",
    isDark: true,
    previewBg: "linear-gradient(135deg, #24060f 0%, #3d0918 100%)",
    previewCard: "#2d0812",
    previewText: "#ffffff",
    background: "bg-gradient-to-b from-[#18040a] via-[#24060f] to-[#0e0206] text-white min-h-screen",
    card: "bg-[#250711]/95 text-white border border-[#f8cb46]/30 hover:border-[#f8cb46] rounded-2xl shadow-md",
    cardHover: "hover:scale-[1.01] active:scale-[0.99] transition-all",
    cardText: "text-white group-hover:text-amber-200 font-bold",
    cardSubtext: "text-slate-300",
    textPrimary: "font-serif text-white tracking-wide font-bold",
    textSecondary: "text-slate-300 text-xs font-sans",
    avatarRing: "ring-2 ring-[#f8cb46]/80 shadow-[0_0_25px_rgba(248,203,70,0.25)] rounded-full",
    buttonShadow: "shadow-md shadow-black/65",
    badge: "bg-[#2f0814] border border-[#f8cb46]/40 text-white",
  },

  // 7. Velvet Red Minimal
  gradient: {
    id: "gradient",
    name: "Velvet Red Minimal",
    shortName: "Velvet",
    description: "Deep velvet crimson gradient with sleek dark cards and clean borders.",
    isDark: true,
    previewBg: "linear-gradient(135deg, #300610 0%, #480a18 100%)",
    previewCard: "#22050e",
    previewText: "#ffffff",
    background: "bg-gradient-to-br from-[#24050d] via-[#380713] to-[#120206] text-white min-h-screen",
    card: "bg-[#1c050c]/90 backdrop-blur-md text-white border border-[#f8cb46]/25 hover:border-[#f8cb46]/60 shadow-lg rounded-2xl",
    cardHover: "hover:scale-[1.01] active:scale-[0.99] transition-all",
    cardText: "text-white group-hover:text-amber-200 font-medium",
    cardSubtext: "text-slate-300",
    textPrimary: "font-serif text-white font-bold",
    textSecondary: "text-slate-300 text-xs font-sans",
    avatarRing: "ring-2 ring-[#f8cb46] shadow-[0_0_25px_rgba(248,203,70,0.25)] rounded-full",
    buttonShadow: "shadow-lg shadow-black/40",
    badge: "bg-[#25060f] border border-[#f8cb46]/35 text-white",
  },

  // 8. Sunny Amber Minimal
  colorful: {
    id: "colorful",
    name: "Sunny Amber Minimal",
    shortName: "Sunny",
    description: "Minimalist slate with radiant Blinkit yellow accents and crisp contrast.",
    isDark: true,
    previewBg: "#111827",
    previewCard: "#1f2937",
    previewText: "#f8cb46",
    background: "bg-[#111827] text-white min-h-screen",
    card: "bg-[#1f2937]/95 text-white border border-[#f8cb46]/35 hover:border-[#f8cb46] shadow-md rounded-2xl",
    cardHover: "hover:scale-[1.01] active:scale-[0.99] transition-all",
    cardText: "text-white group-hover:text-[#f8cb46] font-medium",
    cardSubtext: "text-slate-300",
    textPrimary: "font-serif text-white font-bold",
    textSecondary: "text-slate-300 text-xs font-sans",
    avatarRing: "ring-2 ring-[#f8cb46] shadow-[0_0_20px_rgba(248,203,70,0.3)] rounded-full",
    buttonShadow: "shadow-md shadow-black/50",
    badge: "bg-[#283548] border border-[#f8cb46]/40 text-[#f8cb46]",
  },
};

export const THEME_LIST = Object.values(THEMES);

export function isDarkTheme(themeId?: string): boolean {
  if (!themeId) return true;
  const th = THEMES[themeId as ThemeId];
  return th ? th.isDark : true;
}
