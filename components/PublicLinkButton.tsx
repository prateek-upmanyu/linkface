"use client";

import React, { useState } from "react";
import { LinkItem } from "@/types";
import { PLATFORMS, getPlatformBadgeStyle } from "@/lib/platforms";
import { PlatformIcon } from "@/components/PlatformIcon";
import { playClickSound } from "@/lib/sound-fx";
import { ArrowUpRight } from "lucide-react";

interface PublicLinkButtonProps {
  link: LinkItem;
  themeCardClass?: string;
  themeCardHoverClass?: string;
  themeButtonShadow?: string;
  isDark?: boolean;
}

export function PublicLinkButton({ link }: PublicLinkButtonProps) {
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
    setTimeout(() => setClicked(false), 250);
  };

  const iconStyle = getPlatformBadgeStyle(platform?.brandColor, true);

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={`w-full py-4 px-5 flex items-center justify-between transition-all duration-150 group text-decoration-none select-none rounded-[12px] bg-[#002e62] hover:bg-[#0a3d7a] border border-[var(--border-soft)] hover:border-[#d0f600] ${
        clicked ? "scale-[0.99]" : ""
      }`}
    >
      <div className="flex items-center gap-3.5 min-w-0 flex-1 mr-2">
        {/* Subtle Line Platform Icon Tile */}
        <div
          className="w-9 h-9 rounded-[8px] flex items-center justify-center shrink-0 border border-white/10"
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
            size={18}
          />
        </div>

        {/* Clean Manrope Typography */}
        <span className="font-body font-medium text-sm sm:text-base tracking-normal truncate flex-1 transition-colors text-[var(--color-text-offwhite)] group-hover:text-white">
          {link.title}
        </span>

        {/* Subtle Badge */}
        {link.badge && (
          <span className="px-2 py-0.5 text-[9px] font-body font-semibold tracking-[0.14em] uppercase rounded-full shrink-0 ml-1.5 bg-[rgba(208,246,0,0.1)] text-[#d0f600] border border-[#d0f600]/30">
            {link.badge}
          </span>
        )}
      </div>

      <ArrowUpRight
        strokeWidth={1.5}
        className="w-4 h-4 transition-transform duration-150 shrink-0 ml-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-[var(--color-text-muted)] group-hover:text-[#d0f600]"
      />
    </a>
  );
}
