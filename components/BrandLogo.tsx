import React from "react";

interface BrandLogoProps {
  className?: string;
  size?: number;
}

export function BrandLogo({ className = "w-8 h-8" }: BrandLogoProps) {
  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 select-none group transition-all duration-300 hover:scale-105 rounded-[10px] overflow-hidden shadow-xs border border-amber-500/25 ${className}`}
      title="Linklet — The Digital Link Colophon"
    >
      <img
        src="/brand-logo.jpg"
        alt="Linklet Logo"
        className="w-full h-full object-cover rounded-[10px]"
      />
    </div>
  );
}
