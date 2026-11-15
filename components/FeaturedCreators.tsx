"use client";

import React from "react";
import { FeaturedCreator, ThemeId } from "@/types";
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

  return (
    <div className={`w-full max-w-full overflow-hidden mt-6 pt-4 border-t border-[#E5E7EB] ${className}`}>
      {/* Subtle Label 'COLLABORATORS' */}
      <div className="flex items-center justify-between mb-2.5 px-0.5 text-[10px] font-body uppercase font-bold tracking-[0.14em] text-[#6B7280]">
        <span>Collaborators</span>
        <span className="font-mono text-[10px] text-[#9CA3AF]">
          0{count}
        </span>
      </div>

      {/* Grid: 1, 2, or 3 columns strictly contained */}
      <div
        className={`w-full max-w-full grid gap-1.5 ${
          count === 1
            ? "grid-cols-1 max-w-[180px] mx-auto"
            : count === 2
            ? "grid-cols-2"
            : "grid-cols-3"
        }`}
      >
        {activeCreators.map((creator, idx) => {
          const finalUrl = normalizeUrl(creator.url);
          const initials = (creator.name || "C")
            .split(" ")
            .map((n) => n[0])
            .slice(0, 2)
            .join("")
            .toUpperCase();

          const cardContent = (
            <div className="w-full min-w-0 flex items-center gap-1.5 p-1.5 rounded-[10px] bg-[#FFFFFF] border border-[#E5E7EB] hover:border-[#F39C12] hover:bg-[#FFFDF9] shadow-sm transition-all duration-150 group">
              {/* Circular Avatar */}
              <div className="relative w-6 h-6 rounded-full overflow-hidden shrink-0 border border-[#F4D03F] bg-[#FFFDF5] flex items-center justify-center">
                {creator.avatar_url ? (
                  <img
                    src={creator.avatar_url}
                    alt={creator.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-[9px] font-bold text-[#E67E22]">
                    {initials}
                  </span>
                )}
              </div>

              {/* Creator Name & Tagline (strictly truncated) */}
              <div className="flex flex-col text-left min-w-0 flex-1">
                <span className="text-[11px] font-bold text-[#18181B] truncate group-hover:text-[#E67E22] transition-colors leading-tight">
                  {creator.name}
                </span>
                {creator.tagline && (
                  <span className="text-[9px] text-[#6B7280] truncate leading-tight">
                    {creator.tagline}
                  </span>
                )}
              </div>

              <ArrowUpRight className="w-2.5 h-2.5 text-[#9CA3AF] group-hover:text-[#F39C12] shrink-0" />
            </div>
          );

          if (!isInteractive) {
            return (
              <div key={idx} className="min-w-0 w-full cursor-default">
                {cardContent}
              </div>
            );
          }

          return (
            <a
              key={idx}
              href={finalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="min-w-0 w-full text-decoration-none block"
            >
              {cardContent}
            </a>
          );
        })}
      </div>
    </div>
  );
}
