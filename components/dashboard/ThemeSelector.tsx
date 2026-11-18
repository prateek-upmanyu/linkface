"use client";

import React, { useState, useEffect } from "react";
import { Profile, ThemeId } from "@/types";
import {
  PROFILE_THEMES,
  FREE_THEME_IDS,
  PRO_THEME_IDS,
  ProfileThemeConfig,
  isFreeProfileTheme,
} from "@/lib/profile-themes-config";
import {
  Check,
  Lock,
  Sparkles,
  Wand2,
  Save,
  ExternalLink,
  Loader2,
  CheckCircle2,
  Eye,
} from "lucide-react";
import { UpgradeModal } from "@/components/UpgradeModal";

interface ThemeSelectorProps {
  profile: Profile;
  onUpdateProfile: (updated: Partial<Profile>) => Promise<void>;
  isLoading?: boolean;
  onPreviewTheme?: (themeId: ThemeId) => void;
}

export function ThemeSelector({
  profile,
  onUpdateProfile,
  isLoading = false,
  onPreviewTheme,
}: ThemeSelectorProps) {
  const isPro = profile.plan === "pro";

  // Active theme resolution: Free users restricted to notebook, pastel, console (default notebook)
  const savedThemeId = isPro
    ? (profile.theme || "notebook")
    : isFreeProfileTheme(profile.theme)
    ? profile.theme!
    : "notebook";

  const [selectedId, setSelectedId] = useState<string>(savedThemeId);
  const [isSavingTheme, setIsSavingTheme] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [targetThemeName, setTargetThemeName] = useState<string>("");

  useEffect(() => {
    setSelectedId(savedThemeId);
  }, [profile.theme, isPro, savedThemeId]);

  const selectedConfig = PROFILE_THEMES[selectedId as keyof typeof PROFILE_THEMES] || PROFILE_THEMES.notebook;
  const savedConfig = PROFILE_THEMES[savedThemeId as keyof typeof PROFILE_THEMES] || PROFILE_THEMES.notebook;
  const hasUnsavedChanges = selectedId !== savedThemeId;

  const publicUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/${profile.username}`
      : `/${profile.username}`;

  const handleSelectTheme = async (theme: ProfileThemeConfig) => {
    // If it's a Pro theme and user is on Free plan, trigger upgrade modal
    if (theme.isPro && !isPro) {
      setTargetThemeName(theme.name);
      setModalOpen(true);
      return;
    }

    setSelectedId(theme.id);
    setSaveSuccess(false);

    // Update the live preview immediately so user sees their page in real-time
    if (onPreviewTheme) {
      onPreviewTheme(theme.id as ThemeId);
    }

    // Auto-save immediately to database
    try {
      setIsSavingTheme(true);
      await onUpdateProfile({ theme: theme.id as ThemeId });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to auto-save theme:", err);
    } finally {
      setIsSavingTheme(false);
    }
  };

  const handleSaveTheme = async () => {
    if (isSavingTheme || isLoading) return;

    const targetTheme = PROFILE_THEMES[selectedId as keyof typeof PROFILE_THEMES];
    if (targetTheme?.isPro && !isPro) {
      setTargetThemeName(targetTheme.name);
      setModalOpen(true);
      return;
    }

    setIsSavingTheme(true);
    setSaveSuccess(false);

    try {
      await onUpdateProfile({ theme: selectedId as ThemeId });
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
      }, 4000);
    } catch (err) {
      console.error("Failed to save theme:", err);
    } finally {
      setIsSavingTheme(false);
    }
  };

  const renderThemeCard = (themeKey: string) => {
    const t = PROFILE_THEMES[themeKey as keyof typeof PROFILE_THEMES];
    if (!t) return null;

    const isSelected = selectedId === t.id;
    const isSavedActive = savedThemeId === t.id;
    const isLocked = t.isPro && !isPro;

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
            ? "border-[#F39C12] ring-2 ring-[#F39C12] shadow-[0_4px_20px_rgba(243,156,18,0.25)] scale-[1.01]"
            : "border-[#E5E7EB] hover:border-[#F4D03F]"
        }`}
        style={{
          backgroundColor: t.cardBg,
          color: t.text,
        }}
      >
        {/* Top Info Bar: Name on left, Status Icon on right */}
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <span
            className="font-bold text-base tracking-tight truncate min-w-0"
            style={{
              fontFamily: t.headingFont,
            }}
          >
            {t.name}
          </span>

          {/* Status Indicator */}
          <div className="flex items-center gap-1.5 shrink-0">
            {isSavedActive && (
              <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#166534] text-white shrink-0 shadow-2xs">
                Live
              </span>
            )}
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
        </div>

        {/* Badges Row: Clear separation, zero crowding */}
        <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
          <span
            className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded-sm font-bold ${
              t.isDark
                ? "bg-white/15 text-white border border-white/20"
                : "bg-black/10 text-[#18181B] border border-black/10"
            }`}
          >
            {t.isDark ? "Dark" : "Light"}
          </span>
          {!t.isPro ? (
            <span
              className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded-sm font-bold ${
                t.isDark
                  ? "bg-[#22c55e]/20 text-[#4ade80] border border-[#22c55e]/30"
                  : "bg-[#4ade80]/20 text-[#166534] border border-[#166534]/20"
              }`}
            >
              Free
            </span>
          ) : (
            <span
              className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded-sm font-bold ${
                t.isDark
                  ? "bg-[#F39C12]/20 text-[#fbbf24] border border-[#F39C12]/30"
                  : "bg-[#F9E79F]/40 text-[#B9770E] border border-[#F4D03F]"
              }`}
            >
              Pro
            </span>
          )}
        </div>

        <p className="text-[11px] leading-tight mb-3 line-clamp-1 opacity-80">
          {t.concept}
        </p>

        {/* Typography & Palette preview */}
        <div className="pt-2 border-t border-current/15 flex items-center justify-between text-[10px] font-mono">
          <span className="truncate max-w-[110px] opacity-75">
            {t.headingFont.split(",")[0].replace(/'/g, "")}
          </span>
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
  };

  return (
    <>
      <div className="p-5 sm:p-8 rounded-[20px] bg-[#FFFFFF] border border-[#E5E7EB] shadow-xs space-y-6 sm:space-y-8 font-body text-[#18181B]">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E5E7EB] gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono tracking-[0.16em] uppercase text-[#166534] font-bold px-2 py-0.5 rounded-full bg-[#dcfce7] border border-[#86efac]">
                3 Free Themes + 12 Pro Worlds
              </span>
              <span className="text-[#9CA3AF] text-xs">&mdash;</span>
              <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#18181B]">
                Profile Themes
              </h3>
            </div>
            <p className="text-xs text-[#4B5563] leading-relaxed">
              Choose a theme below, preview it live on the right, and click <strong className="text-[#18181B]">Save Theme</strong> to publish it immediately to your public profile.
            </p>
          </div>

          {!isPro && (
            <button
              type="button"
              onClick={() => {
                setTargetThemeName("12 Bespoke Pro Themes");
                setModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#FFFDF9] border border-[#F4D03F] text-[#B9770E] text-xs font-bold hover:bg-[#F9E79F]/30 transition-colors self-start sm:self-auto shadow-2xs cursor-pointer shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#F39C12]" />
              <span>Unlock all 12 Themes ($3/mo) →</span>
            </button>
          )}
        </div>

        {/* PRIMARY SAVE & LIVE STATUS CONTROL PANEL */}
        <div className="p-4 sm:p-5 rounded-[16px] bg-gradient-to-br from-[#FFFDF9] to-[#FFFFFF] border-2 border-[#F4D03F] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-[#18181B] flex items-center gap-1.5">
                <span
                  className="w-3 h-3 rounded-full border border-black/20 shrink-0"
                  style={{ backgroundColor: selectedConfig.cardBg }}
                />
                Selected: <span className="font-heading font-extrabold text-sm">{selectedConfig.name}</span>
              </span>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-black/5 font-semibold text-[#4B5563]">
                {selectedConfig.isPro ? "Pro Theme" : "Free Theme"}
              </span>
              {hasUnsavedChanges ? (
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#FEF3C7] text-[#92400E] border border-[#FCD34D] animate-pulse">
                  Unsaved Changes
                </span>
              ) : (
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#DCFCE7] text-[#166534] border border-[#86EFAC] flex items-center gap-1">
                  <Check className="w-3 h-3 stroke-[3]" />
                  Active on Live Profile
                </span>
              )}
            </div>

            <p className="text-xs text-[#6B7280]">
              {hasUnsavedChanges
                ? "You selected a new theme! Click \"Save Theme\" to make it live for visitors."
                : saveSuccess
                ? "✓ Theme saved successfully! Your public page is updated in real-time."
                : `Currently live on linkface.in/${profile.username || "your-handle"}`}
            </p>
          </div>

          {/* Action Buttons: Save & View Live */}
          <div className="flex items-center gap-2.5 shrink-0 flex-wrap sm:flex-nowrap">
            <button
              type="button"
              disabled={isSavingTheme || isLoading}
              onClick={handleSaveTheme}
              className={`h-11 px-6 rounded-full font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer select-none ${
                saveSuccess
                  ? "bg-[#166534] text-white border-2 border-[#166534]"
                  : hasUnsavedChanges
                  ? "btn-champagne scale-100 hover:scale-[1.02] active:scale-[0.98] ring-2 ring-[#F39C12]/40"
                  : "bg-white hover:bg-[#FFFDF9] border-2 border-[#E5E7EB] hover:border-[#F4D03F] text-[#18181B]"
              }`}
            >
              {isSavingTheme || isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-current" />
                  <span>Saving Theme...</span>
                </>
              ) : saveSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  <span>Saved & Live!</span>
                </>
              ) : hasUnsavedChanges ? (
                <>
                  <Save className="w-4 h-4 text-[#18181B]" />
                  <span>Save Theme</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 text-[#166534]" strokeWidth={2.5} />
                  <span>Save Theme (Live)</span>
                </>
              )}
            </button>

            <a
              href={publicUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="h-11 px-4 rounded-full border border-[#E5E7EB] hover:border-[#F4D03F] bg-white hover:bg-[#FFFDF9] text-xs font-bold text-[#18181B] flex items-center justify-center gap-1.5 transition-all shadow-2xs shrink-0"
              title="Open public profile in new tab"
            >
              <span>View Live</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#9CA3AF]" />
            </a>
          </div>
        </div>

        {/* Section 1: Free Themes (Notebook, Pastel, Console) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-[#18181B] flex items-center gap-1.5">
                <Wand2 className="w-4 h-4 text-[#166534]" />
                Free Themes (Included for Everyone)
              </h4>
              <p className="text-xs text-[#6B7280]">
                Clean, friendly themes with distinct visual identities. Free users default to Notebook.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-[#166534] bg-[#dcfce7] px-2.5 py-0.5 rounded-full shrink-0">
              3 Available
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FREE_THEME_IDS.map(renderThemeCard)}
          </div>
        </div>

        {/* Section 2: Pro Bespoke Luxury Themes */}
        <div className="space-y-3 pt-4 border-t border-[#E5E7EB]">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-[#18181B] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#F39C12]" />
                12 Bespoke Pro Themes
              </h4>
              <p className="text-xs text-[#6B7280]">
                Maximalist, handcrafted aesthetic worlds with custom animations, sound effects & layouts.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-[#B9770E] bg-[#F9E79F]/40 border border-[#F4D03F] px-2.5 py-0.5 rounded-full shrink-0">
              {isPro ? "Unlocked" : "Pro Only"}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {PRO_THEME_IDS.map(renderThemeCard)}
          </div>
        </div>
      </div>

      {/* FLOATING STICKY SAVE BAR (Visible when scrolling & unsaved changes exist) */}
      {hasUnsavedChanges && (
        <div className="fixed bottom-5 left-4 right-4 sm:left-auto sm:right-8 sm:max-w-md z-50 p-3.5 rounded-[18px] bg-[#FFFFFF]/95 backdrop-blur-md border-2 border-[#F39C12] shadow-[0_12px_36px_rgba(243,156,18,0.3)] flex items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="min-w-0 pr-1">
            <div className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full border border-black/20 shrink-0"
                style={{ backgroundColor: selectedConfig.cardBg }}
              />
              <span className="font-heading font-bold text-xs text-[#18181B] truncate">
                {selectedConfig.name}
              </span>
              <span className="text-[9px] font-mono uppercase px-1 py-0.2 rounded-sm bg-black/5 text-[#6B7280] font-bold">
                {selectedConfig.isPro ? "Pro" : "Free"}
              </span>
            </div>
            <p className="text-[10px] text-[#B9770E] font-medium truncate mt-0.5">
              Theme selected. Click Save to publish.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              disabled={isSavingTheme || isLoading}
              onClick={handleSaveTheme}
              className="btn-champagne h-9 px-4 rounded-full font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-xs hover:shadow-md hover:-translate-y-0.5 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
            >
              {isSavingTheme || isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Theme</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      <UpgradeModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        triggerReason="locked_theme"
        themeName={targetThemeName}
      />
    </>
  );
}
