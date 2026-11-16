"use client";

import React, { useState } from "react";
import { Profile, ThemeId } from "@/types";
import {
  PROFILE_THEMES,
  PROFILE_THEMES_ORDER,
  ProfileThemeConfig,
} from "@/lib/profile-themes-config";
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
  const [selectedId, setSelectedId] = useState<string>(profile.theme || "receipt");
  const [modalOpen, setModalOpen] = useState(false);
  const [targetThemeName, setTargetThemeName] = useState<string>("");

  const handleSelectTheme = async (theme: ProfileThemeConfig) => {
    if (!isPro) {
      setTargetThemeName(theme.name);
      setModalOpen(true);
      return;
    }

    setSelectedId(theme.id);
    await onUpdateProfile({ theme: theme.id as ThemeId });
  };

  return (
    <>
      <div className="p-6 sm:p-8 rounded-[20px] bg-[#FFFFFF] border border-[#E5E7EB] shadow-xs space-y-6 font-body text-[#18181B]">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E5E7EB] gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono tracking-[0.16em] uppercase text-[#B9770E] font-bold px-2 py-0.5 rounded-full bg-[#F9E79F]/40 border border-[#F4D03F]">
                Bespoke Pro Worlds
              </span>
              <span className="text-[#9CA3AF] text-xs">&mdash;</span>
              <h3 className="font-heading text-2xl font-bold text-[#18181B]">
                12 Characterful Themes
              </h3>
            </div>
            <p className="text-xs text-[#4B5563] leading-relaxed">
              Every theme restyles the whole card: avatar shape, typography, speech bubble, link shape, spotlight showcase, and custom footer.
            </p>
          </div>

          {!isPro && (
            <button
              type="button"
              onClick={() => {
                setTargetThemeName("12 Bespoke Pro Themes");
                setModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#FFFDF9] border border-[#F4D03F] text-[#B9770E] text-xs font-bold hover:bg-[#F9E79F]/30 transition-colors self-start sm:self-auto shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#F39C12]" />
              <span>Unlock all 12 Themes ($3/mo) →</span>
            </button>
          )}
        </div>

        {/* 12 Bespoke Themes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PROFILE_THEMES_ORDER.map((themeKey) => {
            const t = PROFILE_THEMES[themeKey];
            const isSelected = selectedId === t.id;
            const isLocked = !isPro;

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
                className={`group relative p-4 rounded-[16px] cursor-pointer transition-all duration-200 border text-left flex flex-col justify-between select-none shadow-xs hover:shadow-md ${
                  isSelected
                    ? "border-[#F39C12] ring-2 ring-[#F39C12] shadow-[0_4px_20px_rgba(243,156,18,0.25)]"
                    : "border-[#E5E7EB] hover:border-[#F4D03F]"
                }`}
                style={{
                  backgroundColor: t.cardBg,
                  color: t.text,
                }}
              >
                {/* Top Info Bar */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="font-bold text-base tracking-tight truncate"
                      style={{
                        fontFamily: t.headingFont,
                      }}
                    >
                      {t.name}
                    </span>
                    <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded-sm bg-black/10 text-current font-bold">
                      {t.isDark ? "Dark" : "Light"}
                    </span>
                  </div>

                  {/* Status Indicator: Active or Lock */}
                  {isSelected ? (
                    <span className="w-5 h-5 rounded-full bg-[#F39C12] text-white flex items-center justify-center shrink-0 shadow-xs">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                  ) : isLocked ? (
                    <span
                      className="w-5 h-5 rounded-full bg-black/40 border border-white/20 text-white flex items-center justify-center shrink-0"
                      title="Pro Theme"
                    >
                      <Lock className="w-2.5 h-2.5" />
                    </span>
                  ) : null}
                </div>

                <p className="text-[11px] leading-tight mb-3 line-clamp-1 opacity-80">
                  {t.concept}
                </p>

                {/* Typography & Palette preview */}
                <div className="pt-2 border-t border-current/15 flex items-center justify-between text-[10px] font-mono">
                  <span className="truncate max-w-[130px] opacity-75">{t.headingFont.split(",")[0].replace(/'/g, "")}</span>
                  <div className="flex items-center gap-1">
                    {t.paletteColors.slice(0, 4).map((c, i) => (
                      <span
                        key={i}
                        className="w-2.5 h-2.5 rounded-full border border-black/20"
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
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
