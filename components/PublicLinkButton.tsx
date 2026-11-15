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

  // Quiet Luxury Link Button (56px tall, #121a2e background, 12px radius, 4px hover slide arrow)
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={`w-full h-[56px] px-4 flex items-center justify-between rounded-[12px] bg-[#121a2e] hover:bg-[#18223a] border border-[rgba(245,241,232,0.08)] hover:border-[#c9a96a]/60 transition-all duration-200 group text-decoration-none select-none ${
        clicked ? "scale-[0.99]" : ""
      }`}
    >
      <div className="flex items-center gap-3.5 min-w-0 flex-1 mr-3">
        {/* Small muted icon container (18px icon size) */}
        <div
          className="w-8 h-8 rounded-[8px] flex items-center justify-center shrink-0 border border-white/[0.06] bg-[#0a0f1c]/70 text-[#f5f1e8]/70 group-hover:text-[#f5f1e8] transition-colors"
          style={{
            color: iconStyle.color || "rgba(245,241,232,0.7)",
          }}
        >
          <PlatformIcon
            iconName={platform?.icon}
            platformId={link.platform}
            faviconUrl={favicon}
            brandColor={iconStyle.color}
            className="w-4 h-4 opacity-80 group-hover:opacity-100 transition-opacity"
            size={18}
          />
        </div>

        {/* Title in Inter 15px */}
        <span className="font-body font-normal text-[15px] leading-tight tracking-[-0.01em] truncate flex-1 text-[#f5f1e8] group-hover:text-white transition-colors">
          {link.title}
        </span>

        {/* Optional Pill Badge */}
        {link.badge && (
          <span className="px-2 py-0.5 text-[10px] font-body uppercase tracking-[0.12em] rounded-full shrink-0 ml-1.5 bg-[#c9a96a]/10 text-[#c9a96a] border border-[#c9a96a]/30">
            {link.badge}
          </span>
        )}
      </div>

      {/* Tiny arrow right that shifts 4px on hover */}
      <ChevronRight className="w-4 h-4 text-[rgba(245,241,232,0.38)] group-hover:text-[#c9a96a] group-hover:translate-x-1 transition-all duration-200 shrink-0" />
    </a>
  );
}
