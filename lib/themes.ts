import { ThemeId } from "@/types";

export interface ThemeConfig {
  id: ThemeId;
  name: string;
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
  light: {
    id: "light",
    name: "Clean Light",
    description: "Crisp white slate with modern subtle shadows and deep slate accents.",
    previewBg: "#f8fafc",
    previewCard: "#ffffff",
    previewText: "#0f172a",
    background: "bg-slate-50 text-slate-900",
    card: "bg-white text-slate-800 border border-slate-200/80 hover:border-slate-300 hover:bg-slate-50 shadow-sm",
    cardHover: "hover:scale-[1.015] active:scale-[0.99]",
    textPrimary: "text-slate-900",
    textSecondary: "text-slate-500",
    avatarRing: "ring-4 ring-white shadow-md",
    buttonShadow: "shadow-sm hover:shadow-md",
    badge: "bg-slate-200 text-slate-700",
  },
  dark: {
    id: "dark",
    name: "Onyx Dark",
    description: "Deep obsidian dark mode with subtle zinc borders and sleek contrast.",
    previewBg: "#09090b",
    previewCard: "#18181b",
    previewText: "#fafafa",
    background: "bg-zinc-950 text-zinc-100",
    card: "bg-zinc-900/90 text-zinc-100 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/90 shadow-sm",
    cardHover: "hover:scale-[1.015] active:scale-[0.99]",
    textPrimary: "text-zinc-100",
    textSecondary: "text-zinc-400",
    avatarRing: "ring-4 ring-zinc-800 shadow-xl",
    buttonShadow: "shadow-sm hover:shadow-zinc-900/50",
    badge: "bg-zinc-800 text-zinc-300",
  },
  gradient: {
    id: "gradient",
    name: "Cosmic Sunset",
    description: "Rich violet-to-indigo gradient background with frosted glass buttons.",
    previewBg: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #db2777 100%)",
    previewCard: "rgba(255, 255, 255, 0.15)",
    previewText: "#ffffff",
    background: "bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 text-white min-h-screen",
    card: "bg-white/15 backdrop-blur-md text-white border border-white/20 hover:bg-white/25 hover:border-white/40 shadow-lg",
    cardHover: "hover:scale-[1.015] active:scale-[0.99]",
    textPrimary: "text-white",
    textSecondary: "text-pink-100/80",
    avatarRing: "ring-4 ring-white/30 shadow-2xl",
    buttonShadow: "shadow-lg shadow-purple-950/40",
    badge: "bg-white/20 text-white",
  },
  minimal: {
    id: "minimal",
    name: "Monochrome Outline",
    description: "Brutalist clean monochrome design with sharp borders and zero distractions.",
    previewBg: "#ffffff",
    previewCard: "#ffffff",
    previewText: "#000000",
    background: "bg-white text-black",
    card: "bg-white text-black border-2 border-black hover:bg-black hover:text-white transition-colors duration-150 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]",
    cardHover: "transition-all",
    textPrimary: "text-black",
    textSecondary: "text-neutral-600",
    avatarRing: "ring-2 ring-black",
    buttonShadow: "",
    badge: "bg-black text-white",
  },
  colorful: {
    id: "colorful",
    name: "Vibrant Pop",
    description: "Energetic pastel aura with warm candy highlights and cheerful gradients.",
    previewBg: "linear-gradient(135deg, #fbcfe8 0%, #fed7aa 50%, #fef08a 100%)",
    previewCard: "#ffffff",
    previewText: "#1e1b4b",
    background: "bg-gradient-to-br from-amber-50 via-rose-50 to-indigo-50 text-slate-900",
    card: "bg-white/90 text-slate-800 border-2 border-indigo-100 hover:border-indigo-300 hover:bg-white shadow-md shadow-indigo-100/50",
    cardHover: "hover:scale-[1.02] active:scale-[0.99]",
    textPrimary: "text-indigo-950",
    textSecondary: "text-indigo-600/80",
    avatarRing: "ring-4 ring-pink-300 shadow-xl",
    buttonShadow: "shadow-md shadow-indigo-200/50 hover:shadow-lg",
    badge: "bg-indigo-100 text-indigo-700",
  },
};

export const THEME_LIST = Object.values(THEMES);
