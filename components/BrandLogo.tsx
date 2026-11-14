import React from "react";

export function BrandLogo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <div
      className={`relative flex items-center justify-center shrink-0 rounded-xl bg-gradient-to-br from-[#2a0c14] to-[#120407] border border-[#d4af37]/40 shadow-[0_4px_15px_rgba(212,175,55,0.2)] ${className}`}
      title="AURUM | Luxury Bio"
    >
      {/* Elegant Gold Monogram Emblem */}
      <svg
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-3/5 h-3/5 drop-shadow-[0_1px_4px_rgba(212,175,55,0.4)]"
      >
        {/* Diamond Outer Frame */}
        <path
          d="M16 3L28 16L16 29L4 16L16 3Z"
          stroke="url(#goldGradient)"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        {/* Intersecting Luxury Links / Chevron */}
        <path
          d="M16 8L23 16L16 23L9 16L16 8Z"
          stroke="url(#goldGradient)"
          strokeWidth="1"
          strokeOpacity="0.6"
        />
        {/* Core Radiance Dot */}
        <circle cx="16" cy="16" r="2" fill="url(#goldGradient)" />

        <defs>
          <linearGradient id="goldGradient" x1="4" y1="3" x2="28" y2="29" gradientUnits="userSpaceOnUse">
            <stop stopColor="#faedd0" />
            <stop offset="0.5" stopColor="#d4af37" />
            <stop offset="1" stopColor="#aa821e" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
