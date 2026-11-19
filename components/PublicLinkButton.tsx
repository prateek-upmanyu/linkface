"use client";

import React, { useState } from "react";
import { LinkItem, ThemeId } from "@/types";
import { PLATFORMS, getPlatformBadgeStyle } from "@/lib/platforms";
import { PlatformIcon } from "@/components/PlatformIcon";
import { playClickSound } from "@/lib/sound-fx";
import { getTheme, ThemeConfig } from "@/lib/themes";
import { recordClickWithGeo } from "@/lib/client-geo";
import { ArrowRight } from "lucide-react";

interface PublicLinkButtonProps {
  link: LinkItem;
  themeId?: ThemeId | string;
  themeConfig?: ThemeConfig;
  isDark?: boolean;
}

export function PublicLinkButton({ link, themeId, themeConfig }: PublicLinkButtonProps) {
  const [clicked, setClicked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const theme = themeConfig || getTheme(themeId);
  const platform = PLATFORMS.find((p) => p.id === link.platform);
  const favicon =
    link.url && !platform
      ? `https://www.google.com/s2/favicons?domain=${
          link.url.replace(/^https?:\/\//i, "").split("/")[0]
        }&sz=128`
      : null;

  const isDemo = !link.url || link.url === "#" || link.url.startsWith("#") || link.id.startsWith("demo-");

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    playClickSound();
    setClicked(true);
    setTimeout(() => setClicked(false), 150);

    // If demo link, prevent any navigation/redirect
    if (isDemo) {
      e.preventDefault();
      return;
    }

    recordClickWithGeo({ linkId: link.id });
  };

  // Adaptive platform icon color ensuring WCAG AA contrast against theme surface
  const iconStyle = getPlatformBadgeStyle(platform?.brandColor, theme.isDark);

  return (
    <a
      href={isDemo ? "#" : link.url}
      target={isDemo ? undefined : "_blank"}
      rel={isDemo ? undefined : "noopener noreferrer"}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        backgroundColor: isHovered ? theme.surfaceRaised : theme.surface,
        borderColor: isHovered ? theme.accent : theme.border,
        borderRadius: theme.radiusCard,
        color: theme.text,
      }}
      className={`w-full h-14 min-h-[56px] px-4 flex items-center justify-between border transition-all duration-200 group text-decoration-none select-none relative z-10 cursor-pointer hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98] ${
        clicked ? "scale-[0.98]" : ""
      }`}
    >
      <div className="flex items-center gap-3.5 min-w-0 flex-1 mr-3">
        {/* Platform or Custom Icon Container */}
        <div
          className="w-8 h-8 rounded-[8px] flex items-center justify-center shrink-0 overflow-hidden bg-white/10"
          style={{
            backgroundColor: theme.isDark ? "rgba(255, 255, 255, 0.08)" : "#FFFFFF",
            color: iconStyle.color || theme.accent,
            border: theme.isDark ? "1px solid rgba(255, 255, 255, 0.12)" : "1px solid rgba(0, 0, 0, 0.06)",
          }}
        >
          {link.custom_icon ? (
            <img
              src={link.custom_icon}
              alt=""
              className={`w-full h-full ${link.custom_icon.startsWith("data:") ? "object-cover" : "object-contain p-1"} rounded-[8px]`}
            />
          ) : (
            <PlatformIcon
              iconName={platform?.icon}
              platformId={link.platform}
              faviconUrl={favicon}
              brandColor={iconStyle.color || theme.accent}
              className="w-4 h-4 object-contain"
              size={18}
            />
          )}
        </div>

        {/* Title: Left-aligned, crisp, high-contrast */}
        <span
          className="font-body font-medium text-sm sm:text-[15px] leading-tight tracking-tight truncate flex-1"
          style={{ color: theme.text }}
        >
          {link.title}
        </span>

        {/* Badge */}
        {link.badge && (
          <span
            className="px-2 py-0.5 text-[9px] font-mono uppercase tracking-[0.12em] rounded-full shrink-0 ml-1 font-semibold"
            style={{
              backgroundColor: `${theme.accent}18`,
              color: theme.accent,
              border: `1px solid ${theme.accent}40`,
            }}
          >
            {link.badge}
          </span>
        )}
      </div>

      {/* Right Arrow: Moves 4px (translate-x-1) on hover */}
      <ArrowRight
        className="w-4 h-4 shrink-0 transition-transform duration-200 group-hover:translate-x-1"
        style={{ color: isHovered ? theme.accent : theme.muted }}
        strokeWidth={1.75}
      />
    </a>
  );
}
