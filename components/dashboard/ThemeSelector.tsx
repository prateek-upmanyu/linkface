"use client";

import React, { useState } from "react";
import { Profile, ThemeId } from "@/types";
import { THEMES_LIST, getTheme, ThemeConfig } from "@/lib/themes";
import { Check, Lock, Sparkles } from "lucide-react";
import { UpgradeModal } from "@/components/UpgradeModal";

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
  const isPro = profile.plan === "pro";
  const currentTheme = getTheme(profile.theme);
  const [selectedId, setSelectedId] = useState<string>(currentTheme.id);
  const [modalOpen, setModalOpen] = useState(false);
  const [targetThemeName, setTargetThemeName] = useState<string>("");

  const handleSelectTheme = async (theme: ThemeConfig) => {
    // If user is Free and clicks a Pro theme, show UpgradeModal
    if (!isPro && theme.isPro) {
      setTargetThemeName(theme.name);
      setModalOpen(true);
      return;
    }

    setSelectedId(theme.id);
    await onUpdateProfile({ theme: theme.id });
  };

  return (
    <>
      <div className="p-6 sm:p-8 rounded-[20px] bg-[#121a2e] border border-[rgba(245,241,232,0.08)] space-y-6 font-body text-[#f5f1e8]">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[rgba(245,241,232,0.08)] gap-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono tracking-[0.16em] uppercase text-[#c9a96a] font-semibold">
                Curated Palettes
              </span>
              <span className="text-[rgba(245,241,232,0.3)] text-xs">&mdash;</span>
              <h3 className="font-heading text-xl font-normal text-[#f5f1e8]">
                Luxury Profile Themes
              </h3>
            </div>
            <p className="text-xs text-[rgba(245,241,232,0.62)] leading-relaxed">
              Curated architectural palettes including Apple Modern & BMW Performance. Applies real typography and surface variables instantly.
            </p>
          </div>

          {!isPro && (
            <button
              type="button"
              onClick={() => {
                setTargetThemeName("All Premium Themes");
                setModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#18223a] border border-[#c9a96a]/30 text-[#c9a96a] text-xs font-semibold hover:border-[#c9a96a] transition-colors self-start sm:self-auto"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Unlock all themes with Pro</span>
            </button>
          )}
        </div>

        {/* 12 Themes Grid (calm phone-shaped tiles) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {THEMES_LIST.map((t) => {
            const isSelected = selectedId === t.id;
            const isLocked = !isPro && t.isPro;

            return (
              <div
                key={t.id}
                role="button"
                tabIndex={0}
                onClick={() => handleSelectTheme(t)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleSelectTheme(t);
                  }
                }}
                className={`group relative p-4 rounded-[16px] cursor-pointer transition-all duration-200 border text-left flex flex-col justify-between select-none ${
                  isSelected
                    ? "border-[#c9a96a] ring-1 ring-[#c9a96a] shadow-[0_4px_24px_rgba(201,169,106,0.15)]"
                    : "border-[rgba(245,241,232,0.08)] hover:border-[rgba(245,241,232,0.25)]"
                }`}
                style={{ backgroundColor: t.bg }}
              >
                {/* Top Info Bar */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className="font-normal text-base tracking-tight truncate"
                      style={{
                        fontFamily: t.headingFontFamily,
                        color: t.text,
                      }}
                    >
                      {t.name}
                    </span>
                    {t.isDark ? (
                      <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded-sm bg-white/10 text-white/70">
                        Dark
                      </span>
                    ) : (
                      <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded-sm bg-black/10 text-black/70">
                        Light
                      </span>
                    )}
                  </div>

                  {/* Status Indicator: Active or Lock */}
                  {isSelected ? (
                    <span className="w-5 h-5 rounded-full bg-[#c9a96a] text-[#0a0f1c] flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                  ) : isLocked ? (
                    <span className="w-5 h-5 rounded-full bg-black/40 border border-white/20 text-white/80 flex items-center justify-center shrink-0" title="Pro Theme">
                      <Lock className="w-2.5 h-2.5" />
                    </span>
                  ) : null}
                </div>

                {/* Typography info */}
                <div className="mb-3 flex items-center justify-between text-[11px]" style={{ color: t.muted }}>
                  <span>{t.headingFont}</span>
                  <div className="flex items-center gap-1">
                    {t.paletteColors.map((c, i) => (
                      <span
                        key={i}
                        className="w-2.5 h-2.5 rounded-full border border-black/10"
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>

                {/* Mini Link Button Preview */}
                <div
                  className="w-full h-11 px-3 rounded-[10px] flex items-center justify-between text-xs transition-transform duration-150 group-hover:scale-[1.01]"
                  style={{
                    backgroundColor: t.surface,
                    color: t.text,
                    border: `1px solid ${t.border}`,
                    borderRadius: t.radiusCard,
                  }}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: t.accent }}
                    />
                    <span className="font-medium truncate">Selected Works</span>
                  </div>
                  <span style={{ color: t.accent }}>→</span>
                </div>

                {/* Action Footer Button */}
                <div className="mt-3 pt-2.5 border-t flex items-center justify-between text-[11px]" style={{ borderColor: t.border }}>
                  <span style={{ color: t.muted }}>
                    {isSelected ? "Active on public link" : isLocked ? "Requires Pro" : "Free theme"}
                  </span>
                  <span
                    className="font-medium font-mono text-[10px] uppercase tracking-wider"
                    style={{ color: t.accent }}
                  >
                    {isSelected ? "Selected" : isLocked ? "Unlock →" : "Apply"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <UpgradeModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        triggerReason="locked_theme"
        themeName={targetThemeName}
      />
    </>
  );
}
