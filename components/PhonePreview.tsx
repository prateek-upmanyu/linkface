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
  let frameBg = "bg-[#1D1D1F] border-[#AAAAAA]/20";
  let titleClass =
    "font-[-apple-system,BlinkMacSystemFont,'SF_Pro_Display','SF_Pro','Helvetica_Neue',sans-serif] font-semibold text-2xl tracking-tight text-[#F5F5F7]";
  let bioClass = "font-[-apple-system,sans-serif] text-xs text-[#AAAAAA]";
  let avatarRing = "ring-2 ring-[#AAAAAA]/30 shadow-[0_0_20px_rgba(0,122,255,0.2)]";

  if (theme.id === "bmw") {
    frameBg = "bg-[#000000] border-[#4AA5D2]/30 shadow-[0_0_40px_rgba(74,165,210,0.15)]";
    titleClass =
      "font-['Helvetica_Neue',Helvetica,Arial,sans-serif] font-bold text-xl tracking-tight uppercase text-[#FFFFFF]";
    bioClass = "font-['Helvetica_Neue',Helvetica,Arial,sans-serif] text-xs text-[#4AA5D2]/80";
    avatarRing = "ring-2 ring-[#4AA5D2] shadow-[0_0_24px_rgba(74,165,210,0.45)]";
  } else if (theme.id === "minecraft") {
    frameBg = "bg-[#141416] border-[#333333]";
    titleClass =
      "font-['Silkscreen',monospace] font-bold text-base tracking-widest uppercase text-white drop-shadow-[2px_2px_0px_#000]";
    bioClass = "font-['Silkscreen',monospace] text-[11px] text-[#aaaaaa]";
    avatarRing = "border-2 border-[#55FF55] rounded-none";
  }

  return (
    <div
      className={`mx-auto w-full max-w-[360px] rounded-[24px] p-4 border select-none transition-colors duration-200 ${frameBg} ${className}`}
    >
      {/* Phone Mockup Header */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10 text-[10px] font-mono tracking-[0.16em] uppercase text-white/50">
        <span className="flex items-center gap-1.5">
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: theme.accentColor }}
          />
          <span className="text-white/80 font-medium">{theme.name}</span>
          <span className="text-white/40">&bull; {theme.fontName}</span>
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
