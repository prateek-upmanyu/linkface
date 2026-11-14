"use client";

import React from "react";
import { Profile, LinkItem } from "@/types";
import { THEMES, isDarkTheme } from "@/lib/themes";
import { PlatformIcon } from "@/components/PlatformIcon";
import { PLATFORMS, getPlatformBadgeStyle } from "@/lib/platforms";
import { FeaturedCreators } from "@/components/FeaturedCreators";
import { SpeechBubble } from "@/components/SpeechBubble";
import { SoundToggle } from "@/components/SoundToggle";
import { AmbientParticles } from "@/components/AmbientParticles";
import { playClickSound } from "@/lib/sound-fx";
import { Wifi, Battery, ExternalLink } from "lucide-react";

interface PhonePreviewProps {
  profile: Partial<Profile>;
  links: LinkItem[];
  onLinkClick?: (link: LinkItem) => void;
  className?: string;
  isInteractive?: boolean;
}

export function PhonePreview({
  profile,
  links,
  onLinkClick,
  className = "",
  isInteractive = true,
}: PhonePreviewProps) {
  const currentTheme = THEMES[profile.theme || "luxury-craft"] || THEMES["luxury-craft"];
  const visibleLinks = links.filter((l) => l.is_visible);
  const isDark = isDarkTheme(currentTheme.id);

  return (
    <div
      className={`relative mx-auto w-full max-w-[360px] rounded-[48px] p-3.5 shadow-[0_25px_70px_-15px_rgba(0,0,0,0.95),0_0_35px_rgba(212,175,55,0.18)] transition-all duration-300 border-[6px] border-[#1e070e] ring-1 ring-[#d4af37]/40 bg-[#0c0305] select-none ${className}`}
    >
      {/* Dynamic Island / Speaker */}
      <div className="absolute top-4.5 left-1/2 -translate-x-1/2 w-24 h-4.5 bg-black rounded-full z-30 flex items-center justify-between px-3 border border-white/5">
        <div className="w-2 h-2 rounded-full bg-[#1c080f] border border-[#d4af37]/30" />
        <div className="w-1.5 h-1.5 rounded-full bg-[#d4af37]/40" />
      </div>

      {/* Screen Frame Container */}
      <div
        className={`relative w-full rounded-[36px] overflow-hidden overflow-y-auto flex flex-col justify-between p-4 pt-8 transition-colors duration-300 min-h-[590px] ${currentTheme.background}`}
      >
        {/* Soft Ambient Particles */}
        <AmbientParticles themeId={currentTheme.id} />

        {/* Status Bar */}
        <div className="flex items-center justify-between px-2 text-[11px] font-sans font-medium text-[#faedd0]/70 mb-4 shrink-0 relative z-10">
          <span>9:41</span>
          <div className="flex items-center gap-2">
            <SoundToggle />
            <Wifi className="w-3 h-3" />
            <Battery className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Profile Header */}
        <div className="flex flex-col items-center text-center px-2 mb-4 shrink-0 relative z-10">
          {/* Floating Speech/Cloud Bubble Message */}
          <SpeechBubble
            message={profile.status_message}
            styleType={profile.status_style}
          />

          {/* Avatar with Radiance Ring */}
          <div className="relative mb-3.5">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.display_name || "Profile"}
                className={`w-20 h-20 rounded-full object-cover ${currentTheme.avatarRing}`}
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
            ) : (
              <div
                className={`w-20 h-20 rounded-full bg-gradient-to-br from-[#3b0d18] to-[#1a050b] text-[#faedd0] flex items-center justify-center text-2xl font-serif font-bold uppercase ${currentTheme.avatarRing}`}
              >
                {profile.display_name?.charAt(0) || profile.username?.charAt(0) || "A"}
              </div>
            )}
          </div>

          {/* Name & Username */}
          <h2 className={`text-xl font-serif leading-tight font-semibold tracking-normal ${currentTheme.textPrimary}`}>
            {profile.display_name || (profile.username ? `@${profile.username}` : "Your Name")}
          </h2>
          {profile.username && profile.display_name && (
            <p className={`text-xs mt-0.5 ${currentTheme.textSecondary}`}>
              @{profile.username}
            </p>
          )}

          {/* Bio */}
          {profile.bio && (
            <p className="text-xs mt-2 max-w-[260px] leading-relaxed line-clamp-3 text-[#faedd0]/75 font-sans">
              {profile.bio}
            </p>
          )}
        </div>

        {/* Links List */}
        <div className="flex-1 w-full flex flex-col gap-2.5 relative z-10">
          {visibleLinks.length === 0 ? (
            <div className="my-auto py-8 text-center px-4 rounded-2xl border border-dashed border-[#d4af37]/25 opacity-60">
              <p className="text-xs font-serif text-[#faedd0]">No links shared yet</p>
              <p className="text-[11px] text-[#d4af37]/60 mt-0.5">Links will appear here</p>
            </div>
          ) : (
            visibleLinks.map((link) => {
              const platform = PLATFORMS.find((p) => p.id === link.platform);
              const favicon =
                link.url && !platform
                  ? `https://www.google.com/s2/favicons?domain=${
                      link.url.replace(/^https?:\/\//i, "").split("/")[0]
                    }&sz=64`
                  : null;

              const iconStyle = getPlatformBadgeStyle(platform?.brandColor, isDark);

              return (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => {
                    playClickSound();
                    if (isInteractive && onLinkClick) {
                      onLinkClick(link);
                    } else if (isInteractive && link.url) {
                      window.open(link.url, "_blank", "noopener,noreferrer");
                    }
                  }}
                  className={`w-full py-3 px-3.5 rounded-2xl flex items-center justify-between text-left transition-all duration-200 group relative ${currentTheme.card} ${currentTheme.cardHover} ${currentTheme.buttonShadow}`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1 mr-2">
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border border-white/10 shadow-xs transition-transform group-hover:scale-105"
                      style={{
                        backgroundColor: iconStyle.bgColor,
                        color: iconStyle.color,
                      }}
                    >
                      <PlatformIcon
                        iconName={platform?.icon}
                        platformId={link.platform}
                        faviconUrl={favicon}
                        brandColor={iconStyle.color}
                        className="w-4 h-4"
                        size={17}
                      />
                    </div>
                    <span className="font-sans text-xs sm:text-[13px] font-medium leading-snug truncate flex-1 text-[#faedd0] group-hover:text-white transition-colors">
                      {link.title || "Untitled Link"}
                    </span>
                    {link.badge && (
                      <span className="px-2 py-0.5 text-[8px] font-sans font-semibold tracking-wider uppercase bg-[#3a0d16] text-[#f7e7b4] border border-[#d4af37]/45 rounded-full shadow-[0_0_10px_rgba(212,175,55,0.2)] shrink-0 ml-1">
                        {link.badge}
                      </span>
                    )}
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-[#d4af37]/60 group-hover:text-[#faedd0] transition-colors shrink-0 ml-1" />
                </button>
              );
            })
          )}

          {/* Featured Creators / Sponsors (Trio Spotlight) */}
          <FeaturedCreators
            creators={profile.featured_creators}
            isInteractive={isInteractive}
          />
        </div>

        {/* Footer Brand Tag */}
        <div className="shrink-0 text-center pt-4 pb-1 relative z-10">
          <span
            className={`inline-block text-[10px] font-serif tracking-widest uppercase px-3 py-1 rounded-full ${currentTheme.badge}`}
          >
            AURUM &bull; LinkinBio
          </span>
        </div>
      </div>
    </div>
  );
}
