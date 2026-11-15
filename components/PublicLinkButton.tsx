"use client";

import React, { useState } from "react";
import { LinkItem, ThemeId } from "@/types";
import { PLATFORMS, getPlatformBadgeStyle } from "@/lib/platforms";
import { PlatformIcon } from "@/components/PlatformIcon";
import { playClickSound } from "@/lib/sound-fx";
import { ChevronRight } from "lucide-react";

interface PublicLinkButtonProps {
  link: LinkItem;
  themeId?: ThemeId | string;
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
    setTimeout(() => setClicked(false), 150);
  };

  const iconStyle = getPlatformBadgeStyle(platform?.brandColor, true);

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={`w-full min-h-[52px] px-4 py-2.5 flex items-center justify-between rounded-[12px] bg-[#FFFFFF] hover:bg-[#FFFDF9] border border-[#E5E7EB] hover:border-[#F39C12] shadow-sm hover:shadow-[0_4px_16px_rgba(243,156,18,0.12)] transition-all duration-150 group text-decoration-none select-none ${
        clicked ? "scale-[0.99]" : ""
      }`}
    >
      <div className="flex items-center gap-3 min-w-0 flex-1 mr-2">
        {/* Platform Icon Container */}
        <div
          className="w-8 h-8 rounded-[8px] flex items-center justify-center shrink-0 border border-gray-100 bg-[#FFFDF5] text-[#18181B]"
          style={{
            backgroundColor: platform?.brandColor ? `${platform.brandColor}12` : "#FFFDF5",
            color: iconStyle.color || "#F39C12",
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

        {/* Title: Bold, crisp, legible */}
        <span className="font-body font-semibold text-sm sm:text-[15px] leading-tight tracking-tight truncate flex-1 text-[#18181B] group-hover:text-[#E67E22] transition-colors">
          {link.title}
        </span>

        {/* Badge in Sunlit Yellow */}
        {link.badge && (
          <span className="px-2 py-0.5 text-[10px] font-body font-bold uppercase tracking-wider rounded-full shrink-0 ml-1 bg-[#F9E79F] text-[#B9770E] border border-[#F4D03F]">
            {link.badge}
          </span>
        )}
      </div>

      {/* Tiny arrow right */}
      <ChevronRight className="w-4 h-4 text-[#9CA3AF] group-hover:text-[#F39C12] group-hover:translate-x-1 transition-all duration-150 shrink-0" />
    </a>
  );
}
