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
}

export function PublicLinkButton({
  link,
  themeCardClass,
  themeCardHoverClass,
  themeButtonShadow,
}: PublicLinkButtonProps) {
  const [clicked, setClicked] = useState(false);

  const platform = PLATFORMS.find((p) => p.id === link.platform);
  const favicon =
    link.url && !platform
      ? `https://www.google.com/s2/favicons?domain=${
          link.url.replace(/^https?:\/\//i, "").split("/")[0]
        }&sz=64`
      : null;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    playClickSound();

    // Record click count asynchronously
    fetch("/api/click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ linkId: link.id }),
    }).catch((err) => console.error("Click track error:", err));

    setClicked(true);
    setTimeout(() => setClicked(false), 500);
  };

  const hasCustomRounding = themeCardClass.includes("rounded-");
  const isVoxel = themeCardClass.includes("rounded-none");
  const isDark = !themeCardClass.includes("bg-white") && !themeCardClass.includes("bg-slate-50");
  const iconStyle = getPlatformBadgeStyle(platform?.brandColor, isDark);

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={`w-full py-3.5 sm:py-4 px-4 sm:px-5 flex items-center justify-between transition-all duration-150 group text-decoration-none select-none ${
        hasCustomRounding ? "" : "rounded-2xl"
      } ${themeCardClass} ${themeCardHoverClass} ${themeButtonShadow} ${
        clicked ? "scale-[0.98]" : ""
      }`}
    >
      <div className="flex items-center gap-3.5 min-w-0 flex-1 mr-2">
        {/* Platform Icon with brand accent tint & contrast safety */}
        <div
          className={`w-9 h-9 sm:w-10 sm:h-10 ${
            isVoxel ? "rounded-none" : "rounded-xl"
          } flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 duration-150`}
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
            size={22}
          />
        </div>

        <span className="font-mono font-medium text-xs sm:text-sm tracking-tight leading-tight truncate flex-1">
          {link.title}
        </span>
        {link.badge && (
          <span className="px-2 py-0.5 text-[9px] font-mono font-bold uppercase bg-amber-400 text-black border border-black shadow-[1px_1px_0_#000] shrink-0 ml-1.5">
            {link.badge}
          </span>
        )}
      </div>

      <ExternalLink className="w-4 h-4 opacity-30 group-hover:opacity-100 transition-opacity shrink-0 ml-1" />
    </a>
  );
}
