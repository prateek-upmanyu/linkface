"use client";

import React from "react";

interface BrandLogoProps {
  className?: string;
  size?: number;
}

export function BrandLogo({ className = "w-9 h-9" }: BrandLogoProps) {
  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 select-none group transition-all duration-300 hover:scale-105 drop-shadow-[0_2px_8px_rgba(243,156,18,0.22)] hover:drop-shadow-[0_4px_14px_rgba(243,156,18,0.36)] ${className}`}
      title="Linkface — Link Infrastructure"
    >
      <img
        src="/brand-logo-icon.png?v=6"
        alt="Linkface Logo"
        className="w-full h-full object-contain"
      />
    </div>
  );
}
