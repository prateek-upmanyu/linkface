"use client";

import React from "react";
import { FeaturedCreator } from "@/types";
import { ExternalLink, Sparkles } from "lucide-react";

interface FeaturedCreatorsProps {
  creators?: FeaturedCreator[] | null;
  className?: string;
  isInteractive?: boolean;
}

export function FeaturedCreators({
  creators,
  className = "",
  isInteractive = true,
}: FeaturedCreatorsProps) {
  if (!creators || creators.length === 0) return null;

  const activeCreators = creators.slice(0, 3);

  return (
    <div className={`w-full mt-7 pt-4 border-t border-[#d4af37]/20 ${className}`}>
      {/* Refined Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <span className="text-[11px] font-serif uppercase tracking-widest text-[#f7e7b4] flex items-center gap-1.5 font-medium">
          <Sparkles className="w-3 h-3 text-[#d4af37]" />
          Featured Spotlight
        </span>
        <span className="text-[9px] font-sans uppercase tracking-wider text-[#d4af37]/60">
          Curated
        </span>
      </div>

      {/* 3-Column Luxury Creator Grid */}
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
            className="p-3 flex flex-col items-center text-center transition-all duration-200 group select-none relative bg-gradient-to-b from-[#1f070e]/80 to-[#120408]/90 backdrop-blur-md rounded-2xl border border-[#d4af37]/25 hover:border-[#d4af37]/65 hover:-translate-y-1 shadow-[0_4px_18px_rgba(0,0,0,0.5)] hover:shadow-[0_8px_25px_rgba(212,175,55,0.18)]"
          >
            {/* Creator Avatar with gold ring */}
            <div className="relative mb-2 shrink-0">
              {creator.avatar_url ? (
                <img
                  src={creator.avatar_url}
                  alt={creator.name}
                  className="w-11 h-11 object-cover rounded-full ring-1 ring-[#d4af37]/60 group-hover:ring-[#d4af37] shadow-sm group-hover:scale-105 transition-all"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
              ) : (
                <div className="w-11 h-11 bg-gradient-to-br from-[#3b0d18] to-[#1f070e] text-[#f7e7b4] flex items-center justify-center font-serif text-sm font-semibold rounded-full ring-1 ring-[#d4af37]/60">
                  {creator.name.charAt(0) || "U"}
                </div>
              )}

              {/* Tiny external link badge */}
              <div className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#140408] text-[#d4af37] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity border border-[#d4af37]/40 shadow-xs">
                <ExternalLink className="w-2.5 h-2.5" />
              </div>
            </div>

            {/* Creator Name */}
            <span className="font-serif text-xs font-semibold leading-tight truncate w-full text-[#faedd0] group-hover:text-white transition-colors">
              {creator.name}
            </span>

            {/* Tagline / Role */}
            {creator.tagline ? (
              <span className="text-[10px] font-sans text-[#d4af37]/75 truncate w-full mt-0.5">
                {creator.tagline}
              </span>
            ) : (
              <span className="text-[9px] font-sans text-[#d4af37]/50 truncate w-full mt-0.5 group-hover:text-[#d4af37]/90">
                Explore &rarr;
              </span>
            )}
          </a>
        ))}
      </div>
    </div>
  );
}
