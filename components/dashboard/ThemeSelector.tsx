"use client";

import React, { useState } from "react";
import { Profile, ThemeId } from "@/types";
import { PRIMARY_THEMES, getTheme } from "@/lib/themes";
import { Check } from "lucide-react";

interface ThemeSelectorProps {
  profile: Profile;
  onUpdateProfile: (updated: Partial<Profile>) => Promise<void>;
  isLoading?: boolean;
}

export function ThemeSelector({
  profile,
  onUpdateProfile,
  isLoading = false,
}: ThemeSelectorProps) {
  const currentTheme = getTheme(profile.theme);
  const [selectedId, setSelectedId] = useState<string>(currentTheme.id);
  const [savingId, setSavingId] = useState<string | null>(null);

  const handleSelectTheme = async (themeId: ThemeId) => {
    setSelectedId(themeId);
    setSavingId(themeId);
    try {
      await onUpdateProfile({ theme: themeId });
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="p-6 luxury-card border border-[var(--border-soft)] space-y-6 font-body">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--border-soft)] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#38bdf8]">
              03 Official Themes
            </span>
            <span className="text-[var(--color-text-subtle)] text-xs">&mdash;</span>
            <h3 className="font-heading text-base font-medium text-[var(--color-text-offwhite)]">
              Card & Typography Theme
            </h3>
          </div>
          <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
            Select between Apple Modern, BMW Edition, and Minecraft Retro. Applies official fonts and exact color palettes.
          </p>
        </div>
      </div>

      {/* 3 Themes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {PRIMARY_THEMES.map((t) => {
          const isSelected = selectedId === t.id;
          const isSavingThis = savingId === t.id;

          return (
            <div
              key={t.id}
              onClick={() => handleSelectTheme(t.id)}
              className={`p-4 rounded-[14px] cursor-pointer transition-all duration-200 border-2 flex flex-col justify-between space-y-4 relative group ${
                isSelected
                  ? "bg-[#FFFDF9] border-[#F39C12] shadow-[0_4px_20px_rgba(243,156,18,0.15)]"
                  : "bg-[#FFFFFF] border-[#E5E7EB] hover:border-[#F39C12]/50 hover:bg-[#FFFDF5]"
              }`}
            >
              {/* Top Row: Name + Selected Tag */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-heading font-bold text-[#18181B]">
                    {t.name}
                  </span>
                  {isSelected && (
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#B9770E] bg-[#F9E79F]/40 border border-[#F4D03F] px-2 py-0.5 rounded-full flex items-center gap-1 font-bold">
                      <Check className="w-3 h-3 text-[#E67E22]" /> Active
                    </span>
                  )}
                </div>

                {/* Font Indicator */}
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-[10px] font-mono text-[#F39C12] uppercase tracking-wider font-bold">
                    Font:
                  </span>
                  <span
                    className="text-xs text-[#4B5563] font-semibold truncate"
                    style={{ fontFamily: t.fontFamily }}
                  >
                    {t.fontName}
                  </span>
                </div>
              </div>

              {/* Color Palette Swatches */}
              <div className="space-y-1.5">
                <span className="text-[9px] font-mono uppercase tracking-wider text-[#6B7280] block font-semibold">
                  Color Palette
                </span>
                <div className="flex items-center gap-2">
                  {t.paletteColors.map((hex) => (
                    <div
                      key={hex}
                      className="group/swatch relative flex flex-col items-center"
                    >
                      <div
                        className="w-7 h-7 rounded-full border border-black/10 shadow-2xs"
                        style={{ backgroundColor: hex }}
                        title={hex}
                      />
                      <span className="text-[8px] font-mono text-[#6B7280] mt-0.5 font-medium">
                        {hex}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mini Card Preview */}
              <div
                className="w-full p-3 rounded-[10px] border flex items-center justify-between select-none shadow-2xs"
                style={{
                  background: t.previewBg,
                  borderColor: isSelected ? t.previewAccent : "#E5E7EB",
                }}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className="w-6 h-6 rounded-md flex items-center justify-center shrink-0 text-[10px] font-bold"
                    style={{
                      background: t.previewAccent,
                      color: "#000",
                    }}
                  >
                    ●
                  </div>
                  <div className="min-w-0">
                    <p
                      className="text-xs font-semibold truncate"
                      style={{
                        fontFamily: t.fontFamily,
                        color: t.id === "apple" ? "#1d1d1f" : "#fff",
                      }}
                    >
                      Portfolio Link
                    </p>
                    <p className="text-[9px] opacity-60 font-mono">linklet.bio</p>
                  </div>
                </div>

                <div
                  className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 text-xs font-bold"
                  style={{ color: t.previewAccent }}
                >
                  →
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                disabled={isLoading || isSavingThis}
                className={`w-full py-2 px-3 text-xs font-bold rounded-full transition-all flex items-center justify-center gap-1.5 ${
                  isSelected
                    ? "bg-[#F39C12] text-white shadow-xs"
                    : "border-2 border-[#E5E7EB] text-[#18181B] hover:border-[#F39C12] hover:text-[#E67E22] bg-white"
                }`}
              >
                {isSelected ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    Selected
                  </>
                ) : (
                  <>
                    Apply Theme →
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
