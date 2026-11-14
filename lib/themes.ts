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
  // Heritage Blue & Acid Lime Luxury Theme (Base Standard)
  "luxury-craft": {
    id: "luxury-craft",
    name: "Classic Showcase",
    shortName: "Classic",
    description: "Curated Heritage Blue surface with minimal Acid Lime accents.",
    isDark: true,
    previewBg: "linear-gradient(135deg, #001a3a 0%, #002e62 100%)",
    previewCard: "#002e62",
    previewText: "#f4f7fb",
    background: "bg-[#001a3a] text-[#f4f7fb] min-h-screen",
    card: "bg-[#002e62] text-[#f4f7fb] border border-[#8ea8c7]/20 hover:border-[#d0f600] shadow-[0_8px_30px_rgba(0,15,35,0.45)] rounded-2xl",
    cardHover: "hover:scale-[1.01] active:scale-[0.99] transition-all",
    cardText: "text-[#f4f7fb] group-hover:text-[#d0f600] font-medium font-body",
    cardSubtext: "text-[#8ea8c7] font-body",
    textPrimary: "font-heading text-[#f4f7fb] font-semibold",
    textSecondary: "text-[#8ea8c7] text-xs font-body",
    avatarRing: "ring-1 ring-[#8ea8c7]/30 shadow-[0_0_20px_rgba(208,246,0,0.15)] rounded-full",
    buttonShadow: "shadow-md shadow-black/40",
    badge: "bg-[rgba(208,246,0,0.12)] text-[#d0f600] border border-[#d0f600]/40 font-semibold font-body",
  },

  luxury: {
    id: "luxury",
    name: "Editorial",
    shortName: "Editorial",
    description: "Deep luxury layout with tight typography and fine borders.",
    isDark: true,
    previewBg: "linear-gradient(180deg, #001530 0%, #00224a 100%)",
    previewCard: "#002b5c",
    previewText: "#f4f7fb",
    background: "bg-gradient-to-b from-[#001530] via-[#001a3a] to-[#001229] text-[#f4f7fb] min-h-screen",
    card: "bg-[#002b5c]/95 text-[#f4f7fb] border border-[#8ea8c7]/20 hover:border-[#d0f600] shadow-[0_8px_30px_rgba(0,15,35,0.5)] rounded-2xl",
    cardHover: "hover:scale-[1.01] active:scale-[0.99] transition-all",
    cardText: "text-[#f4f7fb] group-hover:text-[#d0f600] font-medium font-body",
    cardSubtext: "text-[#8ea8c7] font-body",
    textPrimary: "font-heading text-[#f4f7fb] font-medium",
    textSecondary: "text-[#8ea8c7] text-xs font-body",
    avatarRing: "ring-1 ring-[#d0f600]/40 shadow-[0_0_20px_rgba(208,246,0,0.15)] rounded-full",
    buttonShadow: "shadow-md shadow-black/40",
    badge: "bg-[rgba(208,246,0,0.12)] text-[#d0f600] border border-[#d0f600]/40 font-body",
  },

  dark: {
    id: "dark",
    name: "Midnight",
    shortName: "Midnight",
    description: "Pure deep night canvas with high-fashion restraint.",
    isDark: true,
    previewBg: "#001229",
    previewCard: "#001a3a",
    previewText: "#f4f7fb",
    background: "bg-[#001229] text-[#f4f7fb] min-h-screen",
    card: "bg-[#001a3a]/95 text-[#f4f7fb] border border-[#8ea8c7]/18 hover:border-[#d0f600] shadow-md rounded-2xl",
    cardHover: "hover:scale-[1.01] active:scale-[0.99] transition-all",
    cardText: "text-[#f4f7fb] group-hover:text-[#d0f600] font-medium font-body",
    cardSubtext: "text-[#8ea8c7] font-body",
    textPrimary: "font-heading text-[#f4f7fb] font-bold",
    textSecondary: "text-[#8ea8c7] text-xs font-body",
    avatarRing: "ring-1 ring-[#8ea8c7]/30 shadow-[0_0_15px_rgba(208,246,0,0.12)] rounded-full",
    buttonShadow: "shadow-md shadow-black/50",
    badge: "bg-[rgba(208,246,0,0.12)] text-[#d0f600] border border-[#d0f600]/40 font-body",
  },

  minimal: {
    id: "minimal",
    name: "Refined",
    shortName: "Refined",
    description: "Minimalist structure with lots of breathing room.",
    isDark: true,
    previewBg: "#001a3a",
    previewCard: "#002e62",
    previewText: "#f4f7fb",
    background: "bg-[#001a3a] text-[#f4f7fb] min-h-screen",
    card: "bg-[#002e62] text-[#f4f7fb] border border-[#8ea8c7]/20 hover:border-[#d0f600] shadow-xs rounded-2xl",
    cardHover: "hover:scale-[1.01] active:scale-[0.99] transition-all",
    cardText: "text-[#f4f7fb] group-hover:text-[#d0f600] font-medium font-body",
    cardSubtext: "text-[#8ea8c7] font-body",
    textPrimary: "font-heading text-[#f4f7fb] font-bold",
    textSecondary: "text-[#8ea8c7] text-xs font-body",
    avatarRing: "ring-1 ring-[#8ea8c7]/30 rounded-full",
    buttonShadow: "shadow-xs hover:shadow-md",
    badge: "bg-[rgba(208,246,0,0.12)] text-[#d0f600] border border-[#d0f600]/30 font-body",
  },

  light: {
    id: "light",
    name: "Standard",
    shortName: "Standard",
    description: "Harmonious luxury layout tailored for creators.",
    isDark: true,
    previewBg: "#001a3a",
    previewCard: "#002e62",
    previewText: "#f4f7fb",
    background: "bg-[#001a3a] text-[#f4f7fb] min-h-screen",
    card: "bg-[#002e62] text-[#f4f7fb] border border-[#8ea8c7]/20 hover:border-[#d0f600] shadow-xs rounded-2xl",
    cardHover: "hover:scale-[1.01] active:scale-[0.99] transition-all",
    cardText: "text-[#f4f7fb] group-hover:text-[#d0f600] font-semibold font-body",
    cardSubtext: "text-[#8ea8c7] font-body",
    textPrimary: "font-heading text-[#f4f7fb] font-bold",
    textSecondary: "text-[#8ea8c7] text-xs font-body",
    avatarRing: "ring-1 ring-[#8ea8c7]/30 rounded-full",
    buttonShadow: "shadow-xs hover:shadow-md",
    badge: "bg-[rgba(208,246,0,0.12)] text-[#d0f600] border border-[#d0f600]/30 font-body",
  },

  minecraft: {
    id: "minecraft",
    name: "Architect",
    shortName: "Architect",
    description: "Structured architectural balance with clean lines.",
    isDark: true,
    previewBg: "#001733",
    previewCard: "#002957",
    previewText: "#f4f7fb",
    background: "bg-gradient-to-b from-[#001733] via-[#00224a] to-[#001229] text-[#f4f7fb] min-h-screen",
    card: "bg-[#002957]/95 text-[#f4f7fb] border border-[#8ea8c7]/20 hover:border-[#d0f600] rounded-2xl shadow-md",
    cardHover: "hover:scale-[1.01] active:scale-[0.99] transition-all",
    cardText: "text-[#f4f7fb] group-hover:text-[#d0f600] font-bold font-body",
    cardSubtext: "text-[#8ea8c7] font-body",
    textPrimary: "font-heading text-[#f4f7fb] font-bold",
    textSecondary: "text-[#8ea8c7] text-xs font-body",
    avatarRing: "ring-1 ring-[#d0f600]/40 rounded-full",
    buttonShadow: "shadow-md shadow-black/50",
    badge: "bg-[rgba(208,246,0,0.12)] text-[#d0f600] border border-[#d0f600]/40 font-body",
  },

  gradient: {
    id: "gradient",
    name: "Atmosphere",
    shortName: "Atmosphere",
    description: "Subtle blue-to-deep-blue gradient with soft shadows.",
    isDark: true,
    previewBg: "linear-gradient(135deg, #001a3a 0%, #00224a 100%)",
    previewCard: "#002e62",
    previewText: "#f4f7fb",
    background: "bg-gradient-to-br from-[#001a3a] via-[#00224a] to-[#00142e] text-[#f4f7fb] min-h-screen",
    card: "bg-[#002e62]/90 backdrop-blur-md text-[#f4f7fb] border border-[#8ea8c7]/20 hover:border-[#d0f600] shadow-lg rounded-2xl",
    cardHover: "hover:scale-[1.01] active:scale-[0.99] transition-all",
    cardText: "text-[#f4f7fb] group-hover:text-[#d0f600] font-medium font-body",
    cardSubtext: "text-[#8ea8c7] font-body",
    textPrimary: "font-heading text-[#f4f7fb] font-bold",
    textSecondary: "text-[#8ea8c7] text-xs font-body",
    avatarRing: "ring-1 ring-[#8ea8c7]/30 shadow-[0_0_20px_rgba(208,246,0,0.15)] rounded-full",
    buttonShadow: "shadow-lg shadow-black/40",
    badge: "bg-[rgba(208,246,0,0.12)] text-[#d0f600] border border-[#d0f600]/35 font-body",
  },

  colorful: {
    id: "colorful",
    name: "Radiant",
    shortName: "Radiant",
    description: "Heritage blue with refined lime hover highlights.",
    isDark: true,
    previewBg: "#001a3a",
    previewCard: "#002e62",
    previewText: "#d0f600",
    background: "bg-[#001a3a] text-[#f4f7fb] min-h-screen",
    card: "bg-[#002e62]/95 text-[#f4f7fb] border border-[#8ea8c7]/20 hover:border-[#d0f600] shadow-md rounded-2xl",
    cardHover: "hover:scale-[1.01] active:scale-[0.99] transition-all",
    cardText: "text-[#f4f7fb] group-hover:text-[#d0f600] font-medium font-body",
    cardSubtext: "text-[#8ea8c7] font-body",
    textPrimary: "font-heading text-[#f4f7fb] font-bold",
    textSecondary: "text-[#8ea8c7] text-xs font-body",
    avatarRing: "ring-1 ring-[#d0f600]/40 rounded-full",
    buttonShadow: "shadow-md shadow-black/50",
    badge: "bg-[rgba(208,246,0,0.12)] text-[#d0f600] border border-[#d0f600]/40 font-body",
  },
};

export const THEME_LIST = Object.values(THEMES);

export function isDarkTheme(themeId?: string): boolean {
  return true;
}
