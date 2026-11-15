import React from "react";

interface BrandLogoProps {
  className?: string;
  size?: number;
}

export function BrandLogo({ className = "w-8 h-8" }: BrandLogoProps) {
  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 select-none group transition-all duration-300 hover:scale-105 rounded-full overflow-hidden shadow-xs ring-1 ring-amber-400/30 ${className}`}
      title="Linklet — Link Infrastructure"
    >
      <img
        src="/brand-logo.png"
        alt="Linklet Logo"
        className="w-full h-full object-contain rounded-full"
      />
    </div>
  );
}
