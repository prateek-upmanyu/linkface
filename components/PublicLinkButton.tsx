"use client";

import React, { useState } from "react";
import { LinkItem, ThemeId } from "@/types";
import { PLATFORMS, getPlatformBadgeStyle } from "@/lib/platforms";
import { PlatformIcon } from "@/components/PlatformIcon";
import { playClickSound } from "@/lib/sound-fx";
import { getTheme } from "@/lib/themes";
import { ArrowUpRight, ChevronRight } from "lucide-react";

interface PublicLinkButtonProps {
  link: LinkItem;
  themeId?: ThemeId | string;
  themeCardClass?: string;
  themeCardHoverClass?: string;
  themeButtonShadow?: string;
  isDark?: boolean;
}

export function PublicLinkButton({ link, themeId = "apple" }: PublicLinkButtonProps) {
  const [clicked, setClicked] = useState(false);
  const theme = getTheme(themeId);

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
    setTimeout(() => setClicked(false), 200);
  };

  const iconStyle = getPlatformBadgeStyle(platform?.brandColor, true);

  // 1. APPLE EDITION: Cupertino Frosted Glass & SF Typography
  if (theme.id === "apple") {
    return (
      <a
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className={`w-full py-3.5 px-4 sm:py-4 sm:px-5 flex items-center justify-between transition-all duration-150 group text-decoration-none select-none rounded-[16px] bg-white/[0.08] hover:bg-white/[0.14] active:bg-white/[0.22] border border-white/15 hover:border-white/30 backdrop-blur-xl shadow-sm ${
          clicked ? "scale-[0.99]" : ""
        }`}
      >
        <div className="flex items-center gap-3.5 min-w-0 flex-1 mr-2">
          <div
            className="w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0 border border-white/10"
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

          <span className="font-[-apple-system,BlinkMacSystemFont,'SF_Pro_Text','Helvetica_Neue',sans-serif] font-medium text-sm sm:text-base tracking-tight truncate flex-1 text-[#f5f5f7] group-hover:text-white transition-colors">
            {link.title}
          </span>

          {link.badge && (
            <span className="px-2.5 py-0.5 text-[10px] font-[-apple-system,sans-serif] font-medium tracking-wide uppercase rounded-full shrink-0 ml-1.5 bg-white/15 text-[#f5f5f7] border border-white/20">
              {link.badge}
            </span>
          )}
        </div>

        <ChevronRight className="w-4 h-4 text-[#86868b] group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
      </a>
    );
  }

  // 2. BMW M EDITION: Carbon Obsidian & Precision M Tricolor Accent
  if (theme.id === "bmw") {
    return (
      <a
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className={`relative w-full py-3.5 px-4 sm:py-4 sm:px-5 flex items-center justify-between transition-all duration-150 group text-decoration-none select-none rounded-[10px] bg-[#0d131f] hover:bg-[#141d2e] border-l-4 border-l-[#009ada] border-y border-r border-[#1e293b] hover:border-[#009ada]/70 shadow-[0_8px_30px_rgba(0,0,0,0.6)] ${
          clicked ? "scale-[0.99]" : ""
        }`}
      >
        {/* Subtle BMW M-Performance Tricolor Accent In Corner */}
        <div className="flex items-center gap-0.5 absolute top-2 right-2.5 opacity-40 group-hover:opacity-100 transition-opacity">
          <span className="w-1.5 h-1 bg-[#009ada] rounded-xs" />
          <span className="w-1.5 h-1 bg-[#003399] rounded-xs" />
          <span className="w-1.5 h-1 bg-[#e00000] rounded-xs" />
        </div>

        <div className="flex items-center gap-3.5 min-w-0 flex-1 mr-2">
          <div
            className="w-9 h-9 rounded-[6px] flex items-center justify-center shrink-0 border border-[#1e293b] bg-[#111726]"
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

          <span className="font-['Space_Grotesk',sans-serif] font-bold text-xs sm:text-sm tracking-wide uppercase truncate flex-1 text-[#f8fafc] group-hover:text-[#38bdf8] transition-colors">
            {link.title}
          </span>

          {link.badge && (
            <span className="px-2 py-0.5 text-[9px] font-['Space_Grotesk',sans-serif] font-bold tracking-wider uppercase rounded-[4px] shrink-0 ml-1.5 bg-[#009ada]/15 text-[#38bdf8] border border-[#009ada]/40">
              {link.badge}
            </span>
          )}
        </div>

        <ArrowUpRight
          strokeWidth={1.75}
          className="w-4 h-4 text-[#009ada] group-hover:text-[#38bdf8] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 ml-1"
        />
      </a>
    );
  }

  // 3. MINECRAFT EDITION: Authentic Voxel 3D Beveled Stone Block
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={`w-full py-3 px-4 flex items-center justify-between select-none rounded-none bg-[#2b2b2b] hover:bg-[#353535] border-2 border-t-[#666666] border-l-[#666666] border-b-[#111111] border-r-[#111111] active:border-t-[#111111] active:border-l-[#111111] active:border-b-[#666666] active:border-r-[#666666] shadow-[2px_2px_0px_#000000] text-decoration-none group ${
        clicked ? "translate-x-0.5 translate-y-0.5 shadow-none" : ""
      }`}
    >
      <div className="flex items-center gap-3 min-w-0 flex-1 mr-2">
        <div
          className="w-8 h-8 rounded-none flex items-center justify-center shrink-0 border border-black bg-[#1f1f1f]"
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
            className="w-3.5 h-3.5"
            size={16}
          />
        </div>

        <span className="font-['Silkscreen',monospace] font-bold text-[11px] sm:text-xs tracking-wider truncate flex-1 text-[#ffffff] group-hover:text-[#55ff55] transition-colors">
          {link.title}
        </span>

        {link.badge && (
          <span className="px-1.5 py-0.5 text-[8px] font-['Silkscreen',monospace] font-bold tracking-widest uppercase rounded-none shrink-0 ml-1 bg-[#1a381a] text-[#55ff55] border border-[#55ff55]/60">
            {link.badge}
          </span>
        )}
      </div>

      <ArrowUpRight
        strokeWidth={2}
        className="w-3.5 h-3.5 text-[#55ff55] group-hover:text-white transition-colors shrink-0 ml-1"
      />
    </a>
  );
}
