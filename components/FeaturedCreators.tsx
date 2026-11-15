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

  return (
    <div className={`w-full mt-8 pt-6 border-t border-[rgba(245,241,232,0.08)] ${className}`}>
      {/* Subtle Label 'COLLABORATORS' */}
      <div className="flex items-center justify-between mb-3.5 px-1 text-[11px] font-body uppercase tracking-[0.14em] text-[rgba(245,241,232,0.38)]">
        <span>Collaborators</span>
        <span className="font-mono text-[10px] text-[rgba(245,241,232,0.3)]">
          0{activeCreators.length}
        </span>
      </div>

      {/* Row of Collaborators */}
      <div className="flex items-center justify-center gap-3 w-full">
        {activeCreators.map((creator, idx) => {
          const finalUrl = normalizeUrl(creator.url);
          const initials = (creator.name || "C")
            .split(" ")
            .map((n) => n[0])
            .slice(0, 2)
            .join("")
            .toUpperCase();

          const cardContent = (
            <div className="flex items-center gap-2.5 px-3 py-2 rounded-[12px] bg-[#121a2e] border border-[rgba(245,241,232,0.08)] hover:border-[rgba(201,169,106,0.5)] transition-all duration-200 group">
              {/* Circular Avatar */}
              <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 border border-[rgba(201,169,106,0.3)] bg-[#18223a] flex items-center justify-center">
                {creator.avatar_url ? (
                  <img
                    src={creator.avatar_url}
                    alt={creator.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-[11px] font-medium text-[#f5f1e8]">
                    {initials}
                  </span>
                )}
              </div>

              {/* Creator Name */}
              <div className="flex flex-col text-left min-w-0 pr-1">
                <span className="text-xs font-normal text-[#f5f1e8] truncate max-w-[90px] group-hover:text-white transition-colors">
                  {creator.name}
                </span>
                {creator.tagline && (
                  <span className="text-[10px] text-[rgba(245,241,232,0.38)] truncate max-w-[90px]">
                    {creator.tagline}
                  </span>
                )}
              </div>

              <ArrowUpRight className="w-3 h-3 text-[rgba(245,241,232,0.38)] group-hover:text-[#c9a96a] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
            </div>
          );

          if (!isInteractive) {
            return (
              <div key={idx} className="cursor-default">
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
              className="text-decoration-none"
            >
              {cardContent}
            </a>
          );
        })}
      </div>
    </div>
  );
}
