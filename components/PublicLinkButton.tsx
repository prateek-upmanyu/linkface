"use client";

import React, { useState } from "react";
import { LinkItem } from "@/types";
import { PLATFORMS } from "@/lib/platforms";
import { PlatformIcon } from "@/components/PlatformIcon";
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

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={`w-full py-4 px-5 flex items-center justify-between transition-all duration-150 group text-decoration-none select-none ${
        hasCustomRounding ? "" : "rounded-2xl"
      } ${themeCardClass} ${themeCardHoverClass} ${themeButtonShadow} ${
        clicked ? "scale-[0.98]" : ""
      }`}
    >
      <div className="flex items-center gap-3.5 truncate min-w-0">
        {/* Platform Icon with brand accent tint */}
        <div
          className={`w-10 h-10 ${
            themeCardClass.includes("rounded-none") ? "rounded-none" : "rounded-xl"
          } flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 duration-150`}
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
            className="w-5 h-5"
            size={22}
          />
        </div>

        <span className="font-semibold text-sm sm:text-base tracking-tight truncate">
          {link.title}
        </span>
      </div>

      <ExternalLink className="w-4 h-4 opacity-30 group-hover:opacity-100 transition-opacity shrink-0 ml-2" />
    </a>
  );
}
