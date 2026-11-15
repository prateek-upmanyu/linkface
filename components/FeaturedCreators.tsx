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
}

function normalizeUrl(url?: string | null): string {
  if (!url) return "#";
  const trimmed = url.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export function FeaturedCreators({
  creators,
  themeId = "midnight",
  className = "",
  isInteractive = true,
}: FeaturedCreatorsProps) {
  const theme = getTheme(themeId);

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
    <div
      className={`w-full max-w-full overflow-hidden mt-6 pt-4 border-t ${className}`}
      style={{ borderColor: theme.border }}
    >
      {/* Subtle Label 'COLLABORATORS' */}
      <div className="flex items-center justify-between mb-2.5 px-0.5 text-[10px] font-body uppercase font-bold tracking-[0.14em]">
        <span style={{ color: theme.muted }}>Collaborators</span>
        <span className="font-mono text-[10px]" style={{ color: theme.muted }}>
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
            <div
              className="w-full min-w-0 flex items-center gap-1.5 p-1.5 rounded-[10px] border shadow-2xs transition-all duration-150 group"
              style={{
                backgroundColor: theme.surface,
                borderColor: theme.border,
                borderRadius: theme.radiusCard,
                color: theme.text,
              }}
            >
              {/* Circular Avatar */}
              <div
                className="relative w-6 h-6 rounded-full overflow-hidden shrink-0 border flex items-center justify-center"
                style={{
                  borderColor: `${theme.accent}60`,
                  backgroundColor: theme.surfaceRaised,
                }}
              >
                {creator.avatar_url ? (
                  <img
                    src={creator.avatar_url}
                    alt={creator.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span
                    className="text-[9px] font-bold"
                    style={{ color: theme.accent }}
                  >
                    {initials}
                  </span>
                )}
              </div>

              {/* Creator Name & Tagline */}
              <div className="flex flex-col text-left min-w-0 flex-1">
                <span
                  className="text-[11px] font-semibold truncate leading-tight transition-colors"
                  style={{ color: theme.text }}
                >
                  {creator.name}
                </span>
                {creator.tagline && (
                  <span
                    className="text-[9px] truncate leading-tight"
                    style={{ color: theme.muted }}
                  >
                    {creator.tagline}
                  </span>
                )}
              </div>

              <ArrowUpRight
                className="w-2.5 h-2.5 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                style={{ color: theme.muted }}
              />
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
