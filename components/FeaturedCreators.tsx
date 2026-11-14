"use client";

import React from "react";
import { FeaturedCreator } from "@/types";
import { ExternalLink, Star } from "lucide-react";

interface FeaturedCreatorsProps {
  creators?: FeaturedCreator[] | null;
  isVoxel?: boolean;
  className?: string;
  isInteractive?: boolean;
  badgeClass?: string;
}

export function FeaturedCreators({
  creators,
  isVoxel = false,
  className = "",
  isInteractive = true,
  badgeClass = "",
}: FeaturedCreatorsProps) {
  if (!creators || creators.length === 0) return null;

  // Show up to 3 featured creators
  const activeCreators = creators.slice(0, 3);

  return (
    <div className={`w-full mt-5 pt-3.5 border-t border-white/10 ${className}`}>
      {/* Header Label */}
      <div className="flex items-center justify-between mb-2.5 px-1">
        <span className="text-[10px] font-pixel uppercase tracking-widest text-amber-400/90 flex items-center gap-1">
          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          Featured Spotlight
        </span>
        <span className="text-[9px] font-mono uppercase tracking-wider text-white/40">
          Promoted
        </span>
      </div>

      {/* 3-Column Creator Grid */}
      <div className="grid grid-cols-3 gap-2">
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
            className={`p-2 flex flex-col items-center text-center transition-all duration-150 group select-none relative ${
              isVoxel
                ? "luxury-craft-btn rounded-none border border-amber-500/30 hover:border-amber-400 shadow-[1px_1px_0_#000]"
                : "bg-white/10 hover:bg-white/15 border border-white/15 rounded-xl shadow-xs"
            }`}
          >
            {/* Creator Avatar / PFP */}
            <div className="relative mb-1.5 shrink-0">
              {creator.avatar_url ? (
                <img
                  src={creator.avatar_url}
                  alt={creator.name}
                  className={`w-9 h-9 sm:w-10 sm:h-10 object-cover ${
                    isVoxel ? "rounded-none border-2 border-black" : "rounded-full"
                  } group-hover:scale-105 transition-transform`}
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
              ) : (
                <div
                  className={`w-9 h-9 sm:w-10 sm:h-10 bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-xs uppercase ${
                    isVoxel ? "rounded-none border-2 border-black" : "rounded-full"
                  }`}
                >
                  {creator.name.charAt(0) || "U"}
                </div>
              )}

              {/* Tiny external link indicator on hover */}
              <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-black/80 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <ExternalLink className="w-2 h-2 text-amber-300" />
              </div>
            </div>

            {/* Creator Name */}
            <span className="font-mono text-[10px] sm:text-[11px] font-bold leading-tight truncate w-full text-white group-hover:text-amber-300 transition-colors">
              {creator.name}
            </span>

            {/* Optional Tagline / Role */}
            {creator.tagline ? (
              <span className="text-[8px] sm:text-[9px] font-mono text-white/50 truncate w-full mt-0.5">
                {creator.tagline}
              </span>
            ) : (
              <span className="text-[8px] font-mono text-amber-400/60 truncate w-full mt-0.5">
                Visit &rarr;
              </span>
            )}
          </a>
        ))}
      </div>
    </div>
  );
}
