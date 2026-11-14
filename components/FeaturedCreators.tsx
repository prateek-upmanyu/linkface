"use client";

import React from "react";
import { FeaturedCreator } from "@/types";
import { ExternalLink, Sparkles } from "lucide-react";

interface FeaturedCreatorsProps {
  creators?: FeaturedCreator[] | null;
  className?: string;
  isInteractive?: boolean;
  isDark?: boolean;
}

export function FeaturedCreators({
  creators,
  className = "",
  isInteractive = true,
}: FeaturedCreatorsProps) {
  if (!creators || creators.length === 0) return null;

  const activeCreators = creators.slice(0, 3);

  return (
    <div
      className={`w-full mt-7 pt-4 border-t border-[var(--border-soft)] ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <span className="text-xs font-heading tracking-wide flex items-center gap-1.5 font-medium text-[var(--color-text-offwhite)]">
          <Sparkles className="w-3.5 h-3.5 text-[var(--color-acid-lime)]" />
          Featured Trio
        </span>
        <span className="text-[10px] font-body uppercase tracking-wider text-[var(--color-text-muted)]">
          Spotlight
        </span>
      </div>

      {/* 3-Column Creator Grid */}
      <div className="grid grid-cols-3 gap-2.5">
        {activeCreators.map((creator) => (
          <a
            key={creator.id}
            href={isInteractive ? creator.url : undefined}
            target={isInteractive ? "_blank" : undefined}
            rel={isInteractive ? "noopener noreferrer" : undefined}
            onClick={(e) => {
              if (!isInteractive) {
                e.preventDefault();
              }
            }}
            className="p-3 flex flex-col items-center text-center transition-all duration-200 group select-none relative rounded-2xl bg-[#002e62]/90 hover:bg-[#0a3d7a] text-[var(--color-text-offwhite)] border border-[var(--border-soft)] hover:border-[#d0f600] hover:-translate-y-1 shadow-[0_4px_16px_rgba(0,15,35,0.4)]"
          >
            {/* Creator Avatar */}
            <div className="relative mb-2 shrink-0">
              {creator.avatar_url ? (
                <img
                  src={creator.avatar_url}
                  alt={creator.name}
                  className="w-11 h-11 object-cover rounded-full shadow-sm group-hover:scale-105 transition-all ring-1 ring-[var(--border-soft)] group-hover:ring-[#d0f600]"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
              ) : (
                <div className="w-11 h-11 flex items-center justify-center font-heading text-sm font-semibold rounded-full bg-[#001a3a] text-[var(--color-text-offwhite)] ring-1 ring-[var(--border-soft)] group-hover:ring-[#d0f600]">
                  {creator.name.charAt(0) || "U"}
                </div>
              )}

              {/* Tiny external link badge */}
              <div className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-xs bg-[#001a3a] text-[#d0f600] border border-[#d0f600]/40">
                <ExternalLink className="w-2.5 h-2.5" />
              </div>
            </div>

            {/* Creator Name */}
            <span className="font-heading text-xs font-semibold leading-tight truncate w-full transition-colors text-[var(--color-text-offwhite)] group-hover:text-[#d0f600]">
              {creator.name}
            </span>

            {/* Tagline / Role */}
            {creator.tagline ? (
              <span className="text-[10px] font-body truncate w-full mt-0.5 text-[var(--color-text-muted)]">
                {creator.tagline}
              </span>
            ) : (
              <span className="text-[10px] font-body truncate w-full mt-0.5 text-[var(--color-text-subtle)]">
                Visit &rarr;
              </span>
            )}
          </a>
        ))}
      </div>
    </div>
  );
}
