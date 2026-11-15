"use client";

import React from "react";

interface BrandLogoProps {
  className?: string;
  size?: number;
}

export function BrandLogo({ className = "w-9 h-9" }: BrandLogoProps) {
  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 select-none group transition-all duration-300 hover:scale-105 rounded-[12px] p-1.5 bg-gradient-to-b from-[#FFFFFF] to-[#FFFDF9] border border-[#F4D03F]/80 shadow-[0_2px_8px_rgba(243,156,18,0.12)] hover:border-[#F39C12] hover:shadow-[0_4px_12px_rgba(243,156,18,0.22)] ${className}`}
      title="Linkface — Link Infrastructure"
    >
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_1px_2px_rgba(230,126,34,0.25)]"
      >
        <defs>
          <linearGradient id="brandLogoGrad" x1="10" y1="10" x2="38" y2="38" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="50%" stopColor="#F39C12" />
            <stop offset="100%" stopColor="#E67E22" />
          </linearGradient>
        </defs>

        {/* Top-Right Loop */}
        <path
          d="M23 15L27 11C29.7 8.3 34.3 8.3 37 11C39.7 13.7 39.7 18.3 37 21L33 25C30.3 27.7 25.7 27.7 23 25"
          stroke="url(#brandLogoGrad)"
          strokeWidth="4.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Bottom-Left Loop */}
        <path
          d="M25 33L21 37C18.3 39.7 13.7 39.7 11 37C8.3 34.3 8.3 29.7 11 27L15 23C17.7 20.3 22.3 20.3 25 23"
          stroke="url(#brandLogoGrad)"
          strokeWidth="4.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Interlocking Diagonal Center */}
        <path
          d="M19.5 28.5L28.5 19.5"
          stroke="url(#brandLogoGrad)"
          strokeWidth="4.4"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
