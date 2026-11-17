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
      <img
        src="/brand-logo-icon.png"
        alt="Linkface Logo"
        className="w-full h-full object-contain"
      />
    </div>
  );
}
