"use client";

import React from "react";
import { LinkItem } from "@/types";
import { detectPlatform } from "@/lib/platforms";
import { PlatformIcon } from "@/components/PlatformIcon";
import { playClickSound } from "@/lib/sound-fx";
import { recordClickWithGeo } from "@/lib/client-geo";

interface HeaderQuickLinksProps {
  links: LinkItem[];
  className?: string;
  size?: number;
}

export function HeaderQuickLinks({
  links,
  className = "",
  size = 22,
}: HeaderQuickLinksProps) {
  // Only display links that are published & visible
  const activeLinks = (links || []).filter(
    (l) => l && l.is_visible && l.url && l.url.trim() !== ""
  );

  if (activeLinks.length === 0) {
    return null;
  }

  return (
    <div
      className={`flex items-center justify-center flex-wrap gap-3 sm:gap-4 max-w-sm mx-auto pt-2 pb-0.5 px-2 select-none ${className}`}
      aria-label="Quick links"
    >
      {activeLinks.map((link) => {
        const isDemo =
          !link.url ||
          link.url === "#" ||
          link.url.startsWith("#") ||
          link.id.startsWith("demo-");

        const detected = detectPlatform(link.url);
        const platformId = link.platform || detected.platformId;

        const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
          playClickSound();

          if (isDemo) {
            e.preventDefault();
            return;
          }

          recordClickWithGeo({ linkId: link.id });
        };

        return (
          <a
            key={link.id}
            href={isDemo ? "#" : link.url}
            target={isDemo ? undefined : "_blank"}
            rel={isDemo ? undefined : "noopener noreferrer"}
            onClick={handleClick}
            title={link.title}
            aria-label={link.title}
            className="inline-flex items-center justify-center p-1 rounded-full text-current/80 hover:text-current hover:scale-115 active:scale-95 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current/40 group relative shrink-0"
          >
            {link.custom_icon ? (
              <img
                src={link.custom_icon}
                alt={link.title}
                className="w-5 h-5 sm:w-5.5 sm:h-5.5 rounded-full object-cover shrink-0"
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                }}
              />
            ) : (
              <PlatformIcon
                platformId={platformId}
                iconName={detected.icon}
                faviconUrl={detected.faviconUrl}
                size={size}
                className="shrink-0 transition-transform duration-150"
              />
            )}
          </a>
        );
      })}
    </div>
  );
}
