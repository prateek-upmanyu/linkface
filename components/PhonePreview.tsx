"use client";

import React from "react";
import { Profile, LinkItem } from "@/types";
import { THEMES } from "@/lib/themes";
import { PlatformIcon } from "@/components/PlatformIcon";
import { PLATFORMS } from "@/lib/platforms";
import { Wifi, Battery, ExternalLink, Sparkles } from "lucide-react";

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

  return (
    <div
      className={`relative mx-auto w-full max-w-[340px] aspect-[9/18.5] rounded-[48px] p-3 shadow-2xl transition-all duration-300 border-[7px] border-slate-900 dark:border-zinc-800 bg-slate-900 select-none ${className}`}
    >
      {/* Dynamic Island / Speaker */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-30 flex items-center justify-between px-3">
        <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800" />
        <div className="w-2 h-2 rounded-full bg-emerald-500/80 animate-pulse" />
      </div>

      {/* Screen Frame Container */}
      <div
        className={`relative w-full h-full rounded-[38px] overflow-hidden overflow-y-auto flex flex-col justify-between p-4 pt-10 transition-colors duration-300 ${currentTheme.background}`}
      >
        {/* Status Bar */}
        <div className="flex items-center justify-between px-3 text-[11px] font-medium opacity-80 mb-4 shrink-0">
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
                className={`w-20 h-20 rounded-full object-cover ${currentTheme.avatarRing}`}
                onError={(e) => {
                  // Fallback on broken image
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
            ) : (
              <div
                className={`w-20 h-20 rounded-full bg-indigo-600 text-white flex items-center justify-center text-2xl font-bold uppercase ${currentTheme.avatarRing}`}
              >
                {profile.display_name?.charAt(0) || profile.username?.charAt(0) || "U"}
              </div>
            )}
          </div>

          {/* Name & Username */}
          <h2 className={`font-bold text-lg leading-tight ${currentTheme.textPrimary}`}>
            {profile.display_name || (profile.username ? `@${profile.username}` : "Your Name")}
          </h2>
          {profile.username && profile.display_name && (
            <p className={`text-xs mt-0.5 ${currentTheme.textSecondary}`}>
              @{profile.username}
            </p>
          )}

          {/* Bio */}
          {profile.bio && (
            <p className={`text-xs mt-2 max-w-[240px] leading-relaxed line-clamp-3 ${currentTheme.textSecondary}`}>
              {profile.bio}
            </p>
          )}
        </div>

        {/* Links List */}
        <div className="flex-1 w-full flex flex-col gap-2.5 pb-6">
          {visibleLinks.length === 0 ? (
            <div className="my-auto py-8 text-center px-4 rounded-2xl border border-dashed border-slate-300/60 dark:border-zinc-700/60 opacity-60">
              <Sparkles className="w-6 h-6 mx-auto mb-2 text-indigo-500" />
              <p className="text-xs font-medium">No links added yet.</p>
              <p className="text-[10px] mt-0.5">Add your first link in the dashboard.</p>
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
                  className={`w-full py-3 px-4 rounded-xl flex items-center justify-between text-left transition-all duration-200 group ${currentTheme.card} ${currentTheme.cardHover} ${currentTheme.buttonShadow}`}
                >
                  <div className="flex items-center gap-3 truncate min-w-0">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-110"
                      style={{
                        backgroundColor: platform?.brandColor ? `${platform.brandColor}18` : undefined,
                        color: platform?.brandColor || "currentColor",
                      }}
                    >
                      <PlatformIcon
                        iconName={platform?.icon}
                        platformId={link.platform}
                        faviconUrl={favicon}
                        brandColor={platform?.brandColor}
                        className="w-4 h-4"
                        size={18}
                      />
                    </div>
                    <span className="font-medium text-xs truncate">
                      {link.title || "Untitled Link"}
                    </span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 transition-opacity shrink-0 ml-1" />
                </button>
              );
            })
          )}
        </div>

        {/* Footer Brand Tag */}
        <div className="shrink-0 text-center pt-2 pb-1">
          <span className={`inline-flex items-center gap-1 text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full ${currentTheme.badge} opacity-75`}>
            🔗 LinkinBio
          </span>
        </div>
      </div>
    </div>
  );
}
