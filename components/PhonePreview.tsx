"use client";

import React from "react";
import { Profile, LinkItem } from "@/types";
import { PLATFORMS, getPlatformBadgeStyle } from "@/lib/platforms";
import { PlatformIcon } from "@/components/PlatformIcon";
import { SpeechBubble } from "@/components/SpeechBubble";
import { FeaturedCreators } from "@/components/FeaturedCreators";
import { SoundToggle } from "@/components/SoundToggle";
import { playClickSound } from "@/lib/sound-fx";
import { ArrowUpRight } from "lucide-react";

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
      className={`mx-auto w-full max-w-[360px] rounded-[12px] p-4 border border-[var(--border-soft)] bg-[#001a3a] select-none ${className}`}
    >
      {/* Editorial Profile Frame Header */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-[var(--border-soft)] text-[10px] font-body tracking-[0.2em] uppercase text-[var(--color-text-subtle)]">
        <span>Curated Colophon</span>
        <SoundToggle />
      </div>

      <div className="flex flex-col justify-between min-h-[520px]">
        {/* Profile Header */}
        <div className="flex flex-col items-center text-center px-2 mb-4 shrink-0">
          {/* Status Message */}
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
                className="w-20 h-20 rounded-full object-cover ring-1 ring-[var(--border-soft)]"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
            ) : (
              <div className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-heading font-medium bg-[#002e62] text-[var(--color-text-offwhite)] ring-1 ring-[var(--border-soft)]">
                {profile.display_name?.charAt(0) || profile.username?.charAt(0) || "A"}
              </div>
            )}
          </div>

          {/* Name & Handle: Bodoni Moda & Manrope */}
          <h2 className="text-2xl font-heading leading-tight font-medium tracking-tight text-[var(--color-text-offwhite)]">
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
        <div className="flex-1 w-full flex flex-col gap-2.5">
          {visibleLinks.length === 0 ? (
            <div className="my-auto py-8 text-center px-4 rounded-[12px] border border-dashed border-[var(--border-soft)] opacity-60">
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
                  className="w-full py-3.5 px-4 rounded-[12px] flex items-center justify-between text-left transition-all duration-150 group relative bg-[#002e62] hover:bg-[#0a3d7a] border border-[var(--border-soft)] hover:border-[#d0f600]"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1 mr-2">
                    <div
                      className="w-8 h-8 rounded-[8px] flex items-center justify-center shrink-0 border border-white/10"
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
                        size={16}
                      />
                    </div>
                    {/* High-Contrast Off-White Text */}
                    <span className="font-body text-xs sm:text-[13px] font-medium leading-snug truncate flex-1 transition-colors text-[var(--color-text-offwhite)] group-hover:text-white">
                      {link.title || "Untitled Link"}
                    </span>
                    {link.badge && (
                      <span className="px-2 py-0.5 text-[8px] font-body font-semibold tracking-[0.14em] uppercase rounded-full shrink-0 ml-1 bg-[rgba(208,246,0,0.1)] text-[#d0f600] border border-[#d0f600]/30">
                        {link.badge}
                      </span>
                    )}
                  </div>
                  <ArrowUpRight
                    strokeWidth={1.5}
                    className="w-3.5 h-3.5 transition-transform duration-150 shrink-0 ml-1 text-[var(--color-text-muted)] group-hover:text-[#d0f600] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
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

        {/* Footer Brand Colophon */}
        <div className="shrink-0 text-center pt-5 pb-1 border-t border-[var(--border-soft)] mt-4">
          <span className="text-[10px] font-body tracking-[0.18em] uppercase text-[var(--color-text-subtle)]">
            Linklet / Editorial Profile
          </span>
        </div>
      </div>
    </div>
  );
}
