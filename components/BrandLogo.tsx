import React from "react";

export function BrandLogo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <div
      className={`relative flex items-center justify-center shrink-0 rounded-xl bg-gradient-to-br from-[#380812] to-[#120306] border border-[#d97706]/40 shadow-[0_4px_15px_rgba(0,0,0,0.6)] ${className}`}
      title="Linklet"
    >
      {/* Refined Linklet Monogram Emblem: Interlocking Modern Rings in Dark Amber */}
      <svg
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-3/5 h-3/5 drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]"
      >
        <path
          d="M11 11C13.2 8.8 16.8 8.8 19 11L21 13C23.2 15.2 23.2 18.8 21 21C18.8 23.2 15.2 23.2 13 21"
          stroke="url(#linkletAmber)"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <path
          d="M21 21C18.8 23.2 15.2 23.2 13 21L11 19C8.8 16.8 8.8 13.2 11 11C13.2 8.8 16.8 8.8 19 11"
          stroke="#ffffff"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeOpacity="0.85"
        />
        <circle cx="16" cy="16" r="1.5" fill="#d97706" />

        <defs>
          <linearGradient id="linkletAmber" x1="8" y1="8" x2="24" y2="24" gradientUnits="userSpaceOnUse">
            <stop stopColor="#f59e0b" />
            <stop offset="1" stopColor="#b45309" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
