"use client";

import React from "react";
import { Profile, LinkItem } from "@/types";
import { THEMES, isDarkTheme } from "@/lib/themes";
import { PlatformIcon } from "@/components/PlatformIcon";
import { PLATFORMS, getPlatformBadgeStyle } from "@/lib/platforms";
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
  const currentTheme = THEMES[profile.theme || "light"] || THEMES.light;
  const visibleLinks = links.filter((l) => l.is_visible);
  const isDark = isDarkTheme(currentTheme.id);
  const isVoxel = currentTheme.card.includes("rounded-none") || currentTheme.avatarRing.includes("rounded-none");

  return (
    <div
      className={`relative mx-auto w-full max-w-[330px] aspect-[9/18.5] rounded-[44px] p-3 shadow-2xl transition-all duration-200 border-[6px] border-neutral-900 dark:border-neutral-800 bg-neutral-900 select-none ${className}`}
    >
      {/* Dynamic Island / Speaker */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-4.5 bg-black rounded-full z-30 flex items-center justify-between px-3">
        <div className="w-2 h-2 rounded-full bg-neutral-900 border border-neutral-800" />
        <div className="w-1.5 h-1.5 rounded-full bg-neutral-700" />
      </div>

      {/* Screen Frame Container */}
      <div
        className={`relative w-full h-full rounded-[34px] overflow-hidden overflow-y-auto flex flex-col justify-between p-4 pt-9 transition-colors duration-200 ${currentTheme.background}`}
      >
        {/* Status Bar */}
        <div className="flex items-center justify-between px-3 text-[11px] font-medium opacity-60 mb-4 shrink-0">
          <span>9:41</span>
          <div className="flex items-center gap-1.5">
            <Wifi className="w-3 h-3" />
            <Battery className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Profile Header */}
        <div className="flex flex-col items-center text-center px-2 mb-4 shrink-0">
          {/* Avatar */}
          <div className="relative mb-3">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.display_name || "Profile"}
                className={`w-20 h-20 ${
                  currentTheme.avatarRing.includes("rounded-none") ? "rounded-none" : "rounded-full"
                } object-cover ${currentTheme.avatarRing}`}
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
            ) : (
              <div
                className={`w-20 h-20 ${
                  currentTheme.avatarRing.includes("rounded-none") ? "rounded-none" : "rounded-full"
                } bg-neutral-800 text-white flex items-center justify-center text-xl font-bold uppercase ${currentTheme.avatarRing}`}
              >
                {profile.display_name?.charAt(0) || profile.username?.charAt(0) || "U"}
              </div>
            )}
          </div>

          {/* Name & Username */}
          <h2 className={`font-semibold text-base leading-tight tracking-tight ${currentTheme.textPrimary}`}>
            {profile.display_name || (profile.username ? `@${profile.username}` : "Your Name")}
          </h2>
          {profile.username && profile.display_name && (
            <p className={`text-xs mt-0.5 opacity-60 ${currentTheme.textSecondary}`}>
              @{profile.username}
            </p>
          )}

          {/* Bio */}
          {profile.bio && (
            <p className={`text-xs mt-2 max-w-[240px] leading-relaxed line-clamp-3 opacity-80 ${currentTheme.textSecondary}`}>
              {profile.bio}
            </p>
          )}
        </div>

        {/* Links List */}
        <div className="flex-1 w-full flex flex-col gap-2.5 pb-6">
          {visibleLinks.length === 0 ? (
            <div className="my-auto py-8 text-center px-4 rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-700 opacity-50">
              <p className="text-xs font-medium">No links added</p>
              <p className="text-[10px] mt-0.5">Links will appear here</p>
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
                    if (isInteractive && onLinkClick) {
                      onLinkClick(link);
                    } else if (isInteractive && link.url) {
                      window.open(link.url, "_blank", "noopener,noreferrer");
                    }
                  }}
                  className={`w-full py-2.5 sm:py-3 px-3 sm:px-3.5 ${
                    isVoxel ? "rounded-none" : "rounded-xl"
                  } flex items-center justify-between text-left transition-all duration-150 group ${currentTheme.card} ${currentTheme.cardHover} ${currentTheme.buttonShadow}`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1 mr-2">
                    <div
                      className={`w-7 h-7 sm:w-8 sm:h-8 ${
                        isVoxel ? "rounded-none" : "rounded-lg"
                      } flex items-center justify-center shrink-0`}
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
                    <span className="font-mono text-xs sm:text-[13px] font-medium leading-tight truncate flex-1">
                      {link.title || "Untitled Link"}
                    </span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 opacity-30 group-hover:opacity-100 transition-opacity shrink-0 ml-1" />
                </button>
              );
            })
          )}
        </div>

        {/* Footer Brand Tag - Responsive voxel/pill styling */}
        <div className="shrink-0 text-center pt-2 pb-1">
          <span
            className={`inline-block text-[9px] font-mono tracking-widest uppercase px-3 py-1 ${
              isVoxel ? "rounded-none" : "rounded-full"
            } ${currentTheme.badge} opacity-75`}
          >
            CraftLink
          </span>
        </div>
      </div>
    </div>
  );
}
