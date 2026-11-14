"use client";

import React from "react";
import { Profile, LinkItem } from "@/types";
import { PLATFORMS, getPlatformBadgeStyle } from "@/lib/platforms";
import { PlatformIcon } from "@/components/PlatformIcon";
import { SpeechBubble } from "@/components/SpeechBubble";
import { FeaturedCreators } from "@/components/FeaturedCreators";
import { AmbientParticles } from "@/components/AmbientParticles";
import { SoundToggle } from "@/components/SoundToggle";
import { playClickSound } from "@/lib/sound-fx";
import { ExternalLink, Wifi, Battery } from "lucide-react";

interface PhonePreviewProps {
  profile: Profile;
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
  const visibleLinks = links.filter((l) => l.is_visible);

  return (
    <div
      className={`relative mx-auto w-full max-w-[360px] rounded-[48px] p-3.5 shadow-[0_25px_70px_-15px_rgba(0,15,35,0.95)] transition-all duration-300 border-[6px] border-[#00142b] ring-1 ring-[var(--border-soft)] bg-[#001a3a] select-none ${className}`}
    >
      {/* Dynamic Island / Speaker */}
      <div className="absolute top-4.5 left-1/2 -translate-x-1/2 w-24 h-4.5 bg-[#001124] rounded-full z-30 flex items-center justify-between px-3 border border-[var(--border-soft)]">
        <div className="w-2 h-2 rounded-full bg-[#001a3a] border border-[#8ea8c7]/30" />
        <div className="w-1.5 h-1.5 rounded-full bg-[#d0f600]/40" />
      </div>

      {/* Screen Frame Container */}
      <div className="relative w-full rounded-[36px] overflow-hidden overflow-y-auto flex flex-col justify-between p-4 pt-8 transition-colors duration-300 min-h-[590px] bg-gradient-to-b from-[#001a3a] via-[#00224a] to-[#001a3a] text-[var(--color-text-offwhite)]">
        {/* Soft Ambient Particles */}
        <AmbientParticles />

        {/* Status Bar */}
        <div className="flex items-center justify-between px-2 text-[11px] font-body font-medium mb-4 shrink-0 relative z-10 text-[var(--color-text-muted)]">
          <span>9:41</span>
          <div className="flex items-center gap-2">
            <SoundToggle />
            <Wifi className="w-3 h-3 text-[var(--color-text-muted)]" />
            <Battery className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
          </div>
        </div>

        {/* Profile Header */}
        <div className="flex flex-col items-center text-center px-2 mb-4 shrink-0 relative z-10">
          {/* Floating Speech/Cloud Bubble Message */}
          <SpeechBubble
            message={profile.status_message}
            styleType={profile.status_style}
          />

          {/* Avatar with Subtle Ring */}
          <div className="relative mb-3.5">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.display_name || "Profile"}
                className="w-20 h-20 rounded-full object-cover ring-1 ring-[var(--border-soft)] shadow-md"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
            ) : (
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-heading font-medium bg-[#002e62] text-[var(--color-text-offwhite)] ring-1 ring-[var(--border-soft)] shadow-md"
              >
                {profile.display_name?.charAt(0) || profile.username?.charAt(0) || "A"}
              </div>
            )}
          </div>

          {/* Name & Username: Bodoni Moda & Manrope */}
          <h2 className="text-xl sm:text-2xl font-heading leading-tight font-medium tracking-tight text-[var(--color-text-offwhite)]">
            {profile.display_name || (profile.username ? `@${profile.username}` : "Your Name")}
          </h2>
          {profile.username && profile.display_name && (
            <p className="text-xs mt-0.5 text-[var(--color-text-muted)] font-body">
              @{profile.username}
            </p>
          )}

          {/* Bio */}
          {profile.bio && (
            <p className="text-xs mt-2 max-w-[260px] leading-relaxed line-clamp-3 text-[var(--color-text-muted)] font-body">
              {profile.bio}
            </p>
          )}
        </div>

        {/* Links List */}
        <div className="flex-1 w-full flex flex-col gap-2.5 relative z-10">
          {visibleLinks.length === 0 ? (
            <div className="my-auto py-8 text-center px-4 rounded-2xl border border-dashed border-[var(--border-soft)] opacity-60">
              <p className="text-xs font-heading text-[var(--color-text-offwhite)]">No links shared yet</p>
              <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5 font-body">Links will appear here</p>
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

              const iconStyle = getPlatformBadgeStyle(platform?.brandColor, true);

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
                  className="w-full py-3.5 px-4 rounded-2xl flex items-center justify-between text-left transition-all duration-200 group relative bg-[#002e62]/90 hover:bg-[#0a3d7a] border border-[var(--border-soft)] hover:border-[#d0f600] shadow-[0_4px_16px_rgba(0,15,35,0.4)]"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1 mr-2">
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-xs transition-transform group-hover:scale-105 border border-white/10"
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
                    {/* High-Contrast Off-White Text with Lime hover */}
                    <span className="font-body text-xs sm:text-[13px] font-medium leading-snug truncate flex-1 transition-colors text-[var(--color-text-offwhite)] group-hover:text-[#d0f600]">
                      {link.title || "Untitled Link"}
                    </span>
                    {link.badge && (
                      <span className="px-2 py-0.5 text-[8px] font-body font-semibold tracking-wider uppercase rounded-full shrink-0 ml-1 bg-[rgba(208,246,0,0.12)] text-[#d0f600] border border-[#d0f600]/40">
                        {link.badge}
                      </span>
                    )}
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 transition-colors shrink-0 ml-1 text-[var(--color-text-muted)] group-hover:text-[#d0f600]" />
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
        <div className="shrink-0 text-center pt-5 pb-1 relative z-10">
          <span className="inline-block text-[11px] font-body tracking-wide px-3 py-1 rounded-full bg-[#001e42] border border-[var(--border-soft)] text-[var(--color-text-muted)] shadow-xs">
            Linklet
          </span>
        </div>
      </div>
    </div>
  );
}
