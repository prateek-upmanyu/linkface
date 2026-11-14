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
    name: "Dark Red & Amber",
    shortName: "Dark Red",
    description: "Deep burgundy wine background with subtle dark yellow accents and crisp white typography.",
    previewBg: "linear-gradient(135deg, #1c050c 0%, #300813 50%, #100206 100%)",
    previewCard: "#26060f",
    previewText: "#ffffff",
    background: "bg-gradient-to-b from-[#120306] via-[#1a050b] to-[#0a0103] text-white min-h-screen",
    card: "luxury-link-card bg-[#1c060d]/90 text-white border border-[#d97706]/25 hover:border-[#d97706]/60 rounded-2xl",
    cardHover: "hover:scale-[1.015] active:scale-[0.99]",
    textPrimary: "font-serif text-white tracking-normal font-semibold",
    textSecondary: "text-slate-300 text-xs",
    avatarRing: "ring-2 ring-[#d97706]/70 shadow-[0_0_20px_rgba(217,119,6,0.22)] rounded-full",
    buttonShadow: "shadow-[0_6px_20px_rgba(0,0,0,0.6)]",
    badge: "bg-[#25060f] border border-[#d97706]/40 text-slate-200 text-[11px]",
  },
  luxury: {
    id: "luxury",
    name: "Bordeaux & Dark Yellow",
    shortName: "Bordeaux",
    description: "Refined dark bordeaux surface with warm amber borders and clean legible text.",
    previewBg: "linear-gradient(180deg, #170409 0%, #0d0205 100%)",
    previewCard: "#22060e",
    previewText: "#ffffff",
    background: "bg-gradient-to-b from-[#140307] via-[#1a050a] to-[#0b0103] text-white min-h-screen",
    card: "bg-[#1c050c]/90 text-white border border-[#d97706]/20 hover:border-[#d97706]/55 shadow-[0_6px_20px_rgba(0,0,0,0.7)] rounded-2xl",
    cardHover: "hover:scale-[1.015] active:scale-[0.99]",
    textPrimary: "font-serif text-white tracking-normal font-medium",
    textSecondary: "text-slate-300 text-xs",
    avatarRing: "ring-2 ring-[#d97706]/60 shadow-[0_0_25px_rgba(217,119,6,0.2)] rounded-full",
    buttonShadow: "shadow-[0_6px_20px_rgba(0,0,0,0.6)]",
    badge: "bg-[#24060f] border border-[#d97706]/35 text-slate-200",
  },
  minecraft: {
    id: "minecraft",
    name: "Imperial Wine",
    shortName: "Wine",
    description: "Opulent rich dark wine tone with dark yellow frames and high contrast white text.",
    previewBg: "linear-gradient(135deg, #24060f 0%, #3d0918 100%)",
    previewCard: "#2d0812",
    previewText: "#ffffff",
    background: "bg-gradient-to-b from-[#18040a] via-[#24060f] to-[#0e0206] text-white min-h-screen",
    card: "luxury-link-card bg-[#250711]/90 text-white border border-[#d97706]/30 hover:border-[#f59e0b]/70 rounded-2xl",
    cardHover: "hover:scale-[1.015] active:scale-[0.99]",
    textPrimary: "font-serif text-white tracking-wide font-bold",
    textSecondary: "text-slate-300 text-xs",
    avatarRing: "ring-2 ring-[#d97706]/80 shadow-[0_0_25px_rgba(217,119,6,0.25)] rounded-full",
    buttonShadow: "shadow-[0_6px_20px_rgba(0,0,0,0.65)]",
    badge: "bg-[#2f0814] border border-[#d97706]/40 text-white text-[11px]",
  },
  light: {
    id: "light",
    name: "Warm Ivory & Wine",
    shortName: "Ivory",
    description: "Clean champagne ivory background with dark wine text and warm amber highlights.",
    previewBg: "#fbf8f2",
    previewCard: "#ffffff",
    previewText: "#1c0409",
    background: "bg-gradient-to-b from-[#fbf8f2] via-[#f7f2e7] to-[#ede4d3] text-[#1c0409] min-h-screen",
    card: "bg-white/95 text-[#1c0409] border border-[#d97706]/25 hover:border-[#d97706]/60 shadow-[0_4px_16px_rgba(0,0,0,0.08)] rounded-2xl",
    cardHover: "hover:scale-[1.015] active:scale-[0.99]",
    textPrimary: "font-serif text-[#1c0409] font-semibold",
    textSecondary: "text-[#540c1c] text-xs font-medium",
    avatarRing: "ring-2 ring-[#d97706] shadow-[0_0_20px_rgba(217,119,6,0.2)] rounded-full",
    buttonShadow: "shadow-xs hover:shadow-md",
    badge: "bg-[#f5ebd7] border border-[#d97706]/30 text-[#540c1c]",
  },
  dark: {
    id: "dark",
    name: "Midnight Crimson",
    shortName: "Midnight",
    description: "Deep obsidian charcoal with subtle crimson undertones and dark yellow borders.",
    previewBg: "#0a0204",
    previewCard: "#140407",
    previewText: "#ffffff",
    background: "bg-gradient-to-b from-[#0c0205] via-[#120307] to-[#060102] text-white min-h-screen",
    card: "luxury-link-card bg-[#140408]/90 text-white border border-[#d97706]/25 hover:border-[#d97706]/60 rounded-2xl",
    cardHover: "hover:scale-[1.015] active:scale-[0.99]",
    textPrimary: "font-serif text-white font-medium",
    textSecondary: "text-slate-300 text-xs",
    avatarRing: "ring-2 ring-[#d97706]/70 shadow-[0_0_25px_rgba(217,119,6,0.2)] rounded-full",
    buttonShadow: "shadow-[0_6px_20px_rgba(0,0,0,0.8)]",
    badge: "bg-[#180409] border border-[#d97706]/30 text-slate-200",
  },
  gradient: {
    id: "gradient",
    name: "Velvet Red Glow",
    shortName: "Velvet",
    description: "Deep velvet crimson gradient with sleek dark cards and dark yellow borders.",
    previewBg: "linear-gradient(135deg, #3d0814 0%, #5e0d1f 50%, #170308 100%)",
    previewCard: "rgba(255, 255, 255, 0.08)",
    previewText: "#ffffff",
    background: "bg-gradient-to-br from-[#300610] via-[#480a18] to-[#120206] text-white min-h-screen",
    card: "bg-[#1c050c]/85 backdrop-blur-md text-white border border-[#d97706]/25 hover:border-[#d97706]/60 shadow-lg rounded-2xl",
    cardHover: "hover:scale-[1.015] active:scale-[0.99]",
    textPrimary: "font-serif text-white",
    textSecondary: "text-slate-300 text-xs",
    avatarRing: "ring-2 ring-[#d97706] shadow-[0_0_30px_rgba(217,119,6,0.25)] rounded-full",
    buttonShadow: "shadow-lg shadow-black/40",
    badge: "bg-[#25060f] border border-[#d97706]/35 text-white",
  },
  minimal: {
    id: "minimal",
    name: "Minimalist Crimson",
    shortName: "Minimal",
    description: "Sleek dark red canvas with thin dark yellow borderlines and clean typography.",
    previewBg: "#0c0205",
    previewCard: "#140308",
    previewText: "#ffffff",
    background: "bg-[#0c0205] text-white min-h-screen",
    card: "bg-[#140308]/80 text-white border border-[#d97706]/30 hover:border-[#d97706] transition-colors duration-200 rounded-xl",
    cardHover: "transition-all",
    textPrimary: "font-serif text-white tracking-wide",
    textSecondary: "text-slate-300 text-xs",
    avatarRing: "ring-1 ring-[#d97706]/80 rounded-full",
    buttonShadow: "",
    badge: "bg-[#1c050c] border border-[#d97706]/35 text-slate-200",
  },
  colorful: {
    id: "colorful",
    name: "Ruby & Amber",
    shortName: "Ruby",
    description: "Rich dark ruby atmosphere with warm amber accents and crisp white text.",
    previewBg: "linear-gradient(135deg, #2b0812 0%, #480e1e 100%)",
    previewCard: "#22060e",
    previewText: "#ffffff",
    background: "bg-gradient-to-br from-[#1f050b] via-[#2c0811] to-[#100205] text-white min-h-screen",
    card: "bg-[#24060f]/90 text-white border border-[#d97706]/25 hover:border-[#d97706]/60 shadow-md rounded-2xl",
    cardHover: "hover:scale-[1.015] active:scale-[0.99]",
    textPrimary: "font-serif text-white",
    textSecondary: "text-slate-300 text-xs",
    avatarRing: "ring-2 ring-[#d97706]/80 shadow-[0_0_20px_rgba(217,119,6,0.25)] rounded-full",
    buttonShadow: "shadow-md shadow-black/50",
    badge: "bg-[#2d0713] border border-[#d97706]/35 text-slate-200",
  },
};

export const THEME_LIST = Object.values(THEMES);

export function isDarkTheme(themeId?: string): boolean {
  return themeId !== "light";
}
