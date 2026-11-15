import React from "react";

interface BrandLogoProps {
  className?: string;
  size?: number;
}

export function BrandLogo({ className = "w-8 h-8" }: BrandLogoProps) {
  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 select-none group transition-all duration-300 hover:scale-105 ${className}`}
      title="Linklet"
    >
      <svg
        viewBox="0 0 44 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full filter drop-shadow-[0_2px_8px_rgba(243,156,18,0.35)]"
      >
        <defs>
          {/* Main Radiant Sunlit Amber/Orange Gradient */}
          <linearGradient id="brandGrad" x1="8" y1="8" x2="36" y2="36" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="30%" stopColor="#F59E0B" />
            <stop offset="70%" stopColor="#EA580C" />
            <stop offset="100%" stopColor="#C2410C" />
          </linearGradient>

          {/* Core Accent Dot Gradient */}
          <radialGradient id="dotGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="60%" stopColor="#FDE047" />
            <stop offset="100%" stopColor="#F59E0B" />
          </radialGradient>
        </defs>

        {/* 1. App Icon Squircle Container with High-Gloss Border */}
        <rect
          x="1"
          y="1"
          width="42"
          height="42"
          rx="12"
          fill="#18181B"
        />
        <rect
          x="1"
          y="1"
          width="42"
          height="42"
          rx="12"
          stroke="url(#brandGrad)"
          strokeWidth="1.2"
          strokeOpacity="0.45"
        />

        {/* 2. Stylized Iconic "L-Chain" Ribbon */}
        {/* Vertical Loop (The Spine of 'L') */}
        <path
          d="M16 11C12.7 11 10 13.7 10 17V24C10 27.3 12.7 30 16 30C19.3 30 22 27.3 22 24V17C22 13.7 19.3 11 16 11Z"
          stroke="url(#brandGrad)"
          strokeWidth="3.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Interlocking Horizontal Loop (The Foot of 'L' forming the Link) */}
        <path
          d="M27 22C23.7 22 21 24.7 21 28C21 31.3 23.7 34 27 34H31C34.3 34 37 31.3 37 28C37 24.7 34.3 22 31 22H27Z"
          stroke="url(#brandGrad)"
          strokeWidth="3.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Interlinking Diagonal Bridge Bar */}
        <path
          d="M17 25L26 21"
          stroke="#FDE047"
          strokeWidth="2.8"
          strokeLinecap="round"
        />

        {/* 3. The Nexus Glow Point (Central connection focal dot) */}
        <circle cx="21.5" cy="23" r="2.8" fill="url(#dotGrad)" />
        <circle cx="21.5" cy="23" r="1.2" fill="#18181B" />
      </svg>
    </div>
  );
}
