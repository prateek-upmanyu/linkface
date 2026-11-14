"use client";

import React, { useState } from "react";
import { LinkItem } from "@/types";
import { PLATFORMS, getPlatformBadgeStyle } from "@/lib/platforms";
import { PlatformIcon } from "@/components/PlatformIcon";
import { playClickSound } from "@/lib/sound-fx";
import { ExternalLink } from "lucide-react";

interface PublicLinkButtonProps {
  link: LinkItem;
  themeCardClass: string;
  themeCardHoverClass: string;
  themeButtonShadow: string;
  isDark?: boolean;
}

export function PublicLinkButton({
  link,
  themeCardClass,
  themeCardHoverClass,
  themeButtonShadow,
  isDark: propIsDark,
}: PublicLinkButtonProps) {
  const [clicked, setClicked] = useState(false);

  const platform = PLATFORMS.find((p) => p.id === link.platform);
  const favicon =
    link.url && !platform
      ? `https://www.google.com/s2/favicons?domain=${
          link.url.replace(/^https?:\/\//i, "").split("/")[0]
        }&sz=64`
      : null;

  const handleClick = () => {
    playClickSound();

    fetch("/api/click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ linkId: link.id }),
    }).catch((err) => console.error("Click track error:", err));

    setClicked(true);
    setTimeout(() => setClicked(false), 300);
  };

  const isDark =
    typeof propIsDark === "boolean"
      ? propIsDark
      : !themeCardClass.includes("bg-white") &&
        !themeCardClass.includes("bg-neutral") &&
        !themeCardClass.includes("text-neutral-900");

  const iconStyle = getPlatformBadgeStyle(platform?.brandColor, isDark);

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={`w-full py-4 px-5 flex items-center justify-between transition-all duration-200 group text-decoration-none select-none rounded-2xl ${themeCardClass} ${themeCardHoverClass} ${themeButtonShadow} ${
        clicked ? "scale-[0.985] brightness-110" : ""
      }`}
    >
      <div className="flex items-center gap-3.5 min-w-0 flex-1 mr-2">
        {/* Platform Icon Tile */}
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 duration-200 shadow-xs border ${
            isDark ? "border-white/10" : "border-neutral-200/80"
          }`}
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
            className="w-5 h-5"
            size={20}
          />
        </div>

        {/* Dynamic, High-Contrast Text (Never Hidden on White Themes) */}
        <span
          className={`font-sans font-medium text-sm sm:text-base tracking-normal leading-snug truncate flex-1 transition-colors ${
            isDark
              ? "text-white group-hover:text-amber-200"
              : "text-neutral-900 group-hover:text-black font-semibold"
          }`}
        >
          {link.title}
        </span>

        {/* Feature Badge */}
        {link.badge && (
          <span
            className={`px-2.5 py-0.5 text-[10px] font-sans font-semibold tracking-wider uppercase rounded-full shrink-0 ml-1.5 ${
              isDark
                ? "bg-[#380812] text-white border border-[#f8cb46]/50"
                : "bg-[#f8cb46] text-neutral-950 border border-[#eab308]"
            }`}
          >
            {link.badge}
          </span>
        )}
      </div>

      <ExternalLink
        className={`w-4 h-4 transition-all shrink-0 ml-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${
          isDark
            ? "text-slate-400 group-hover:text-white"
            : "text-neutral-400 group-hover:text-neutral-900"
        }`}
      />
    </a>
  );
}
