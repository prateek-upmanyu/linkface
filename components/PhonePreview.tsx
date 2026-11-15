"use client";

import React from "react";
import { Profile, LinkItem } from "@/types";
import { SpeechBubble } from "@/components/SpeechBubble";
import { FeaturedCreators } from "@/components/FeaturedCreators";
import { PublicLinkButton } from "@/components/PublicLinkButton";
import { SoundToggle } from "@/components/SoundToggle";
import { getTheme } from "@/lib/themes";

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
  className = "",
  isInteractive = true,
}: PhonePreviewProps) {
  const visibleLinks = links.filter((l) => l.is_visible);
  const theme = getTheme(profile.theme);

  // Background and frame styling per theme
  let frameBg = "bg-[#090a0f] border-white/10";
  let titleClass = "font-[-apple-system,BlinkMacSystemFont,'SF_Pro_Display','Helvetica_Neue',sans-serif] font-semibold text-2xl tracking-tight text-white";
  let bioClass = "font-[-apple-system,sans-serif] text-xs text-[#86868b]";
  let avatarRing = "ring-2 ring-white/20";

  if (theme.id === "bmw") {
    frameBg = "bg-[#080a0f] border-[#1e293b]";
    titleClass = "font-['Space_Grotesk',sans-serif] font-bold text-xl tracking-wider uppercase text-[#f8fafc]";
    bioClass = "font-['Space_Grotesk',sans-serif] text-xs text-[#64748b]";
    avatarRing = "ring-2 ring-[#009ada] shadow-[0_0_20px_rgba(0,154,218,0.3)]";
  } else if (theme.id === "minecraft") {
    frameBg = "bg-[#141416] border-[#333333]";
    titleClass = "font-['Silkscreen',monospace] font-bold text-base tracking-widest uppercase text-white drop-shadow-[2px_2px_0px_#000]";
    bioClass = "font-['Silkscreen',monospace] text-[11px] text-[#aaaaaa]";
    avatarRing = "border-2 border-[#55ff55] rounded-none";
  }

  return (
    <div
      className={`mx-auto w-full max-w-[360px] rounded-[24px] p-4 border select-none transition-colors duration-200 ${frameBg} ${className}`}
    >
      {/* Phone Mockup Header */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10 text-[10px] font-mono tracking-[0.16em] uppercase text-white/50">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#009ada] animate-pulse" />
          {theme.name}
        </span>
        <SoundToggle />
      </div>

      <div className="flex flex-col justify-between min-h-[520px]">
        {/* Profile Header */}
        <div className="flex flex-col items-center text-center px-2 mb-4 shrink-0">
          {/* Status Message / Thought / Speech */}
          <SpeechBubble
            message={profile.status_message}
            styleType={profile.status_style}
          />

          {/* Avatar */}
          <div className="relative mb-3.5">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.display_name || "Profile"}
                className={`w-20 h-20 object-cover rounded-full ${avatarRing}`}
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
            ) : (
              <div
                className={`w-20 h-20 flex items-center justify-center text-2xl font-semibold bg-white/10 text-white rounded-full ${avatarRing}`}
              >
                {profile.display_name?.charAt(0) || profile.username?.charAt(0) || "U"}
              </div>
            )}
          </div>

          {/* Display Name ONLY - No cut-off @email username underneath */}
          <h2 className={`leading-tight ${titleClass}`}>
            {profile.display_name || profile.username || "Your Name"}
          </h2>

          {/* Bio */}
          {profile.bio && (
            <p className={`mt-2 max-w-[260px] leading-relaxed line-clamp-3 ${bioClass}`}>
              {profile.bio}
            </p>
          )}
        </div>

        {/* Links List */}
        <div className="flex-1 w-full flex flex-col gap-2.5">
          {visibleLinks.length === 0 ? (
            <div className="my-auto py-8 text-center px-4 rounded-[12px] border border-dashed border-white/15 opacity-60">
              <p className="text-xs text-white">No links shared yet</p>
              <p className="text-[11px] text-white/50 mt-0.5">Add your first link in the studio</p>
            </div>
          ) : (
            visibleLinks.map((link) => (
              <PublicLinkButton
                key={link.id}
                link={link}
                themeId={profile.theme}
              />
            ))
          )}
        </div>

        {/* Spotlight Trio Collaborators */}
        <FeaturedCreators
          creators={profile.featured_creators}
          themeId={profile.theme}
          isInteractive={isInteractive}
        />
      </div>
    </div>
  );
}
