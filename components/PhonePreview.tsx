"use client";

import React from "react";
import { Profile, LinkItem } from "@/types";
import { SpeechBubble } from "@/components/SpeechBubble";
import { FeaturedCreators } from "@/components/FeaturedCreators";
import { PublicLinkButton } from "@/components/PublicLinkButton";
import { SoundToggle } from "@/components/SoundToggle";
import { ProfileSpotlight } from "@/components/ProfileSpotlight";
import { getTheme } from "@/lib/themes";
import { isNewProfileTheme, ProfileThemeId } from "@/lib/profile-themes-config";
import { ThemedPublicProfileView } from "@/components/ThemedPublicProfileView";
import { motion } from "framer-motion";

interface PhonePreviewProps {
  profile: Profile;
  links: LinkItem[];
  onLinkClick?: (link: LinkItem) => void;
  className?: string;
  isInteractive?: boolean;
  floating?: boolean;
}

export function PhonePreview({
  profile,
  links,
  className = "",
  isInteractive = true,
  floating = false,
}: PhonePreviewProps) {
  const isPro = profile.plan === "pro";
  const activeThemeId = isPro
    ? (profile.theme || "notebook")
    : (profile.theme === "notebook" || profile.theme === "pastel" || profile.theme === "console")
    ? profile.theme
    : "notebook";

  // If one of the 12 bespoke themes, render in phone chassis with natural scrolling
  if (isNewProfileTheme(activeThemeId)) {
    return (
      <div
        className={`relative mx-auto w-full max-w-[340px] sm:max-w-[360px] rounded-[48px] border-[6px] border-[#18181B] shadow-[0_24px_64px_rgba(0,0,0,0.5)] select-none transition-all duration-300 overflow-hidden ${
          floating ? "animate-phone-float" : ""
        } ${className}`}
      >
        {/* Dynamic Island */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-5 bg-[#18181B] rounded-full z-30 pointer-events-none" />
        
        {/* Inner Device Screen with smooth native vertical scroll */}
        <div
          tabIndex={0}
          className="h-[640px] max-h-[640px] overflow-y-auto overflow-x-hidden focus:outline-none scroll-smooth touch-pan-y"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(150,150,150,0.3) transparent",
          }}
        >
          <ThemedPublicProfileView
            profile={profile}
            links={links}
            themeId={activeThemeId as ProfileThemeId}
          />
        </div>
      </div>
    );
  }

  const theme = getTheme(activeThemeId);

  const visibleLinks = links.filter((l) => l.is_visible);
  const displayedLinks = isPro ? visibleLinks : visibleLinks.slice(0, 3);

  const initials = (profile.display_name || profile.username || "U")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const cleanHandle = (profile.username || "alex").split("@")[0].replace(/[^a-z0-9_]/gi, "").toLowerCase();

  return (
    <div
      className={`relative mx-auto w-full max-w-[340px] sm:max-w-[360px] rounded-[48px] p-4 sm:p-5 border-[6px] border-[#18181B] shadow-[0_24px_64px_rgba(0,0,0,0.5)] select-none transition-all duration-300 overflow-hidden ${
        floating ? "animate-phone-float" : ""
      } ${className}`}
      style={{
        backgroundColor: theme.bg,
        color: theme.text,
        background: theme.bgTint ? `${theme.bgTint}, ${theme.bg}` : theme.bg,
      }}
    >
      {/* 60fps Spotlight Effect if enabled and Pro */}
      {isPro && profile.spotlight_enabled && (
        <ProfileSpotlight accentColor={theme.accent} opacity={0.1} />
      )}

      {/* Speaker / Dynamic Island Pill */}
      <div className="flex items-center justify-between mb-5 px-3 relative z-10">
        <div className="w-20 h-4 rounded-full bg-[#18181B] mx-auto flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-[#27272A]" />
        </div>
        <div className="absolute right-5 top-4">
          <SoundToggle className="w-7 h-7 p-1 border-white/10 bg-black/25 hover:bg-black/45 text-white/80 hover:text-white" />
        </div>
      </div>

      <div className="flex flex-col justify-between min-h-[480px] w-full max-w-full overflow-hidden relative z-10">
        {/* Profile Header */}
        <div className="flex flex-col items-center text-center px-1 mb-5 shrink-0">
          {/* Status Message / Thought Bubble */}
          <SpeechBubble
            message={profile.status_message}
            styleType={profile.status_style}
          />

          {/* Avatar with Theme Accent Ring */}
          <div className="relative mb-3.5">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.display_name || "Profile"}
                className="w-20 h-20 sm:w-22 sm:h-22 object-cover rounded-full p-0.5 shadow-sm"
                style={{ boxShadow: `0 0 0 2px ${theme.accent}` }}
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
            ) : (
              <div
                className="w-20 h-20 sm:w-22 sm:h-22 flex items-center justify-center text-2xl font-bold rounded-full shadow-sm"
                style={{
                  backgroundColor: theme.surfaceRaised,
                  color: theme.accent,
                  boxShadow: `0 0 0 2px ${theme.accent}`,
                  fontFamily: theme.headingFontFamily,
                }}
              >
                {initials}
              </div>
            )}
          </div>

          {/* Display Name with Theme Heading Font */}
          <h2
            className="text-2xl sm:text-3xl font-normal tracking-tight leading-tight break-words hyphens-auto max-w-full text-center"
            style={{
              fontFamily: theme.headingFontFamily,
              color: theme.text,
            }}
          >
            {profile.display_name || profile.username || "Alex Rivera"}
          </h2>

          {/* Handle */}
          <p
            className="text-xs font-mono font-semibold mt-0.5"
            style={{ color: theme.accent }}
          >
            @{cleanHandle}
          </p>

          {/* Bio */}
          {profile.bio && (
            <p
              className="mt-2 text-xs sm:text-[13px] max-w-[280px] leading-relaxed line-clamp-3 font-medium"
              style={{ color: theme.muted }}
            >
              {profile.bio}
            </p>
          )}
        </div>

        {/* Links List with Stagger */}
        <div className="flex-1 w-full max-w-full flex flex-col gap-2.5">
          {displayedLinks.length === 0 ? (
            <div
              className="p-6 text-center text-xs rounded-[12px] border border-dashed"
              style={{
                backgroundColor: theme.surface,
                borderColor: theme.border,
                color: theme.muted,
              }}
            >
              No links shared yet.
            </div>
          ) : (
            displayedLinks.map((link, idx) => (
              <motion.div
                key={link.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.25,
                  delay: idx * 0.04,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="w-full min-w-0"
              >
                <PublicLinkButton link={link} themeConfig={theme} />
              </motion.div>
            ))
          )}
        </div>

        {/* Notice for Free users if extra links exist */}
        {!isPro && visibleLinks.length > 3 && (
          <p className="mt-2 text-[10px] text-center" style={{ color: theme.muted }}>
            Free plan: only first 3 links shown publicly.
          </p>
        )}

        {/* Spotlight Showcase */}
        <div className="w-full max-w-full shrink-0 mt-3">
          <FeaturedCreators
            creators={profile.featured_creators}
            themeId={theme.id}
            isInteractive={isInteractive}
          />
        </div>

        {/* Quiet Footer */}
        <div
          className="mt-5 pt-3 text-center border-t"
          style={{ borderColor: theme.border }}
        >
          <span
            className="text-[10px] tracking-[0.14em] uppercase font-bold"
            style={{ color: theme.muted }}
          >
            Made with Linkface
          </span>
        </div>
      </div>
    </div>
  );
}
