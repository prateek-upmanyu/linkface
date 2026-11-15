"use client";

import React, { useState } from "react";
import { Profile, ThemeId } from "@/types";
import { PRIMARY_THEMES, getTheme } from "@/lib/themes";
import { Check, Layers, ArrowRight } from "lucide-react";

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
              03 Editions
            </span>
            <span className="text-[var(--color-text-subtle)] text-xs">&mdash;</span>
            <h3 className="font-heading text-base font-medium text-[var(--color-text-offwhite)]">
              Card & Profile Theme
            </h3>
          </div>
          <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
            Choose your signature showcase aesthetic. Updates your public page and link cards instantly.
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
              className={`p-4 rounded-[14px] cursor-pointer transition-all duration-200 border flex flex-col justify-between space-y-4 relative group ${
                isSelected
                  ? "bg-[#0c1322] border-[#38bdf8] shadow-[0_0_24px_rgba(56,189,248,0.2)]"
                  : "bg-[#001a3a] border-[var(--border-soft)] hover:border-white/30 hover:bg-[#00224a]"
              }`}
            >
              {/* Top Row: Name + Selected Tag */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-heading font-semibold text-white">
                    {t.name}
                  </span>
                  {isSelected && (
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#38bdf8] bg-[#38bdf8]/10 border border-[#38bdf8]/30 px-2 py-0.5 rounded-full flex items-center gap-1 font-medium">
                      <Check className="w-3 h-3" /> Active
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-[var(--color-text-muted)] leading-snug">
                  {t.tagline}
                </p>
              </div>

              {/* Mini Card Preview */}
              <div
                className="w-full p-3 rounded-[10px] border flex items-center justify-between select-none"
                style={{
                  background: t.previewBg,
                  borderColor: isSelected ? t.previewAccent : "rgba(255,255,255,0.12)",
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
                        color: "#fff",
                      }}
                    >
                      Portfolio Link
                    </p>
                    <p className="text-[9px] opacity-60 font-mono">linklet.bio</p>
                  </div>
                </div>

                <div
                  className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 text-xs"
                  style={{ color: t.previewAccent }}
                >
                  &rarr;
                </div>
              </div>

              {/* Description */}
              <p className="text-[10px] text-[var(--color-text-subtle)] leading-relaxed">
                {t.description}
              </p>

              {/* Action Button */}
              <button
                type="button"
                disabled={isLoading || isSavingThis}
                className={`w-full py-1.5 px-3 text-xs font-medium rounded-full transition-all flex items-center justify-center gap-1.5 ${
                  isSelected
                    ? "bg-[#38bdf8] text-[#001a3a] font-semibold"
                    : "border border-white/20 text-white/80 group-hover:border-white/40 group-hover:text-white"
                }`}
              >
                {isSelected ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    Selected
                  </>
                ) : (
                  <>
                    Apply Theme &rarr;
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
