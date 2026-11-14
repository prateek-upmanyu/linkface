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
    <div className={`w-full mt-7 pt-4 border-t border-[#d97706]/20 ${className}`}>
      {/* Refined Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <span className="text-xs font-serif uppercase tracking-wider text-white flex items-center gap-1.5 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-[#d97706]" />
          Featured Trio
        </span>
        <span className="text-[10px] font-sans uppercase tracking-wider text-slate-400">
          Spotlight
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
            className="p-3 flex flex-col items-center text-center transition-all duration-200 group select-none relative bg-gradient-to-b from-[#1c060d]/95 to-[#120307]/95 backdrop-blur-md rounded-2xl border border-[#d97706]/25 hover:border-[#d97706]/60 hover:-translate-y-1 shadow-[0_4px_16px_rgba(0,0,0,0.6)]"
          >
            {/* Creator Avatar with dark amber ring */}
            <div className="relative mb-2 shrink-0">
              {creator.avatar_url ? (
                <img
                  src={creator.avatar_url}
                  alt={creator.name}
                  className="w-11 h-11 object-cover rounded-full ring-1 ring-[#d97706]/60 group-hover:ring-[#d97706] shadow-sm group-hover:scale-105 transition-all"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
              ) : (
                <div className="w-11 h-11 bg-gradient-to-br from-[#380812] to-[#1a050b] text-white flex items-center justify-center font-serif text-sm font-semibold rounded-full ring-1 ring-[#d97706]/60">
                  {creator.name.charAt(0) || "U"}
                </div>
              )}

              {/* Tiny external link badge */}
              <div className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#140307] text-[#d97706] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity border border-[#d97706]/40 shadow-xs">
                <ExternalLink className="w-2.5 h-2.5" />
              </div>
            </div>

            {/* Creator Name: Clean readable white */}
            <span className="font-serif text-xs font-semibold leading-tight truncate w-full text-white group-hover:text-amber-200 transition-colors">
              {creator.name}
            </span>

            {/* Tagline / Role: Clean readable soft slate */}
            {creator.tagline ? (
              <span className="text-[10px] font-sans text-slate-300 truncate w-full mt-0.5">
                {creator.tagline}
              </span>
            ) : (
              <span className="text-[10px] font-sans text-slate-400 truncate w-full mt-0.5">
                Visit &rarr;
              </span>
            )}
          </a>
        ))}
      </div>
    </div>
  );
}
