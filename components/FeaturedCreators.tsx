"use client";

import React from "react";
import { FeaturedCreator, ThemeId } from "@/types";
import { getTheme } from "@/lib/themes";
import { ArrowUpRight } from "lucide-react";

interface FeaturedCreatorsProps {
  creators?: FeaturedCreator[] | null;
  themeId?: ThemeId | string;
  className?: string;
  isInteractive?: boolean;
  isDark?: boolean;
}

function normalizeUrl(url?: string | null): string {
  if (!url) return "#";
  const trimmed = url.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export function FeaturedCreators({
  creators,
  themeId = "apple",
  className = "",
  isInteractive = true,
}: FeaturedCreatorsProps) {
  // Parse creators if delivered as stringified JSONB
  let parsedCreators: FeaturedCreator[] = [];
  if (Array.isArray(creators)) {
    parsedCreators = creators;
  } else if (typeof creators === "string") {
    try {
      parsedCreators = JSON.parse(creators);
    } catch {
      parsedCreators = [];
    }
  }

  // Filter only slots that have both name and destination URL
  const activeCreators = parsedCreators
    .filter((c) => c && Boolean(c.name?.trim()) && Boolean(c.url?.trim()))
    .slice(0, 3);

  // If 0 creators filled, hide the section completely
  if (activeCreators.length === 0) return null;

  const count = activeCreators.length;
  const theme = getTheme(themeId);

  // Dynamic Card Styling per Theme
  let cardClass =
    "rounded-[14px] bg-[#2C2C2E] hover:bg-[#3A3A3C] border border-[#AAAAAA]/25 hover:border-[#007AFF]/60 text-[#F5F5F7]";
  let avatarRing = "ring-1 ring-[#AAAAAA]/30";
  let titleClass = "font-medium text-xs text-[#F5F5F7] tracking-tight font-[-apple-system,sans-serif]";
  let subtitleClass = "text-[10px] text-[#AAAAAA]";

  if (theme.id === "bmw") {
    cardClass =
      "rounded-[8px] bg-[#0D0D0D] hover:bg-[#161616] border border-[#4AA5D2]/40 hover:border-[#4AA5D2] text-[#FFFFFF]";
    avatarRing = "ring-1 ring-[#4AA5D2]";
    titleClass = "font-['Helvetica_Neue',Helvetica,Arial,sans-serif] font-bold text-xs uppercase tracking-wider text-[#FFFFFF]";
    subtitleClass = "font-['Helvetica_Neue',Helvetica,Arial,sans-serif] text-[10px] text-[#4AA5D2]";
  } else if (theme.id === "minecraft") {
    cardClass =
      "rounded-none bg-[#2B2B2B] hover:bg-[#353535] border-2 border-t-[#666666] border-l-[#666666] border-b-[#111111] border-r-[#111111] text-white shadow-[2px_2px_0px_#000000]";
    avatarRing = "border border-[#55FF55] rounded-none";
    titleClass = "font-['Silkscreen',monospace] font-bold text-[10px] tracking-wider text-[#FFFFFF]";
    subtitleClass = "font-['Silkscreen',monospace] text-[9px] text-[#55FF55]";
  }

  // Dynamic grid class based on 1, 2, or 3 creators
  let gridLayoutClass = "grid grid-cols-3 gap-2.5 w-full";
  if (count === 1) {
    gridLayoutClass = "grid grid-cols-1 max-w-[220px] mx-auto w-full";
  } else if (count === 2) {
    gridLayoutClass = "grid grid-cols-2 gap-3 max-w-[340px] mx-auto w-full";
  }

  return (
    <div className={`w-full mt-7 pt-5 border-t border-white/10 ${className}`}>
      {/* Dynamic Header */}
      <div className="flex items-center justify-between mb-3 px-1 text-[10px] font-mono tracking-[0.16em] uppercase text-white/50">
        <span>
          {count === 1
            ? "Featured Collaborator"
            : count === 2
            ? "Spotlight Duet"
            : "Spotlight Trio"}
        </span>
        <span className="text-white/60">
          0{count} {count === 1 ? "Slot" : "Slots"}
        </span>
      </div>

      {/* Dynamic Grid: 1, 2, or 3 slots */}
      <div className={gridLayoutClass}>
        {activeCreators.map((creator, idx) => {
          const finalUrl = normalizeUrl(creator.url);

          return (
            <a
              key={creator.id || idx}
              href={isInteractive ? finalUrl : undefined}
              target={isInteractive ? "_blank" : undefined}
              rel={isInteractive ? "noopener noreferrer" : undefined}
              onClick={(e) => {
                if (!isInteractive) {
                  e.preventDefault();
                }
              }}
              className={`p-3 flex flex-col items-center text-center transition-all duration-150 group select-none relative ${cardClass}`}
            >
              {/* Creator Avatar */}
              <div className="relative mb-2 shrink-0">
                {creator.avatar_url ? (
                  <img
                    src={creator.avatar_url}
                    alt={creator.name}
                    className={`w-11 h-11 object-cover rounded-full group-hover:scale-105 transition-all ${avatarRing}`}
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                ) : (
                  <div
                    className={`w-11 h-11 flex items-center justify-center font-heading text-sm font-semibold rounded-full bg-white/10 text-white ${avatarRing}`}
                  >
                    {creator.name.charAt(0) || "U"}
                  </div>
                )}

                {/* Tiny arrow badge on hover */}
                <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 text-white border border-white/20">
                  <ArrowUpRight strokeWidth={1.5} className="w-2.5 h-2.5" />
                </div>
              </div>

              {/* Creator Name */}
              <span className={`w-full truncate ${titleClass}`}>
                {creator.name}
              </span>

              {/* Tagline / Role */}
              {creator.tagline ? (
                <span className={`w-full truncate mt-0.5 ${subtitleClass}`}>
                  {creator.tagline}
                </span>
              ) : (
                <span className={`w-full truncate mt-0.5 ${subtitleClass}`}>
                  Visit &rarr;
                </span>
              )}
            </a>
          );
        })}
      </div>
    </div>
  );
}
