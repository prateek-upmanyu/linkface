import React from "react";

interface BrandLogoProps {
  className?: string;
  size?: number;
}

export function BrandLogo({ className = "w-8 h-8" }: BrandLogoProps) {
  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 select-none group transition-transform duration-200 hover:scale-105 ${className}`}
      title="Linklet — The Digital Link Colophon"
    >
      <svg
        viewBox="0 0 44 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_2px_8px_rgba(230,126,34,0.32)]"
      >
        <defs>
          {/* Main Background Radiant Sunlit Gradient */}
          <linearGradient id="linkletBgGrad" x1="4" y1="4" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#F9E79F" />
            <stop offset="35%" stopColor="#F4D03F" />
            <stop offset="70%" stopColor="#F39C12" />
            <stop offset="100%" stopColor="#E67E22" />
          </linearGradient>

          {/* Top Link Gloss Gradient */}
          <linearGradient id="linkWhiteGrad" x1="12" y1="12" x2="32" y2="32" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#FFF8E7" />
          </linearGradient>

          {/* Shadow Filter for Dimensional Interlock */}
          <filter id="linkShadow" x="-10%" y="-10%" width="130%" height="130%">
            <feDropShadow dx="0" dy="1.5" stdDeviation="1" floodColor="#B9770E" floodOpacity="0.45" />
          </filter>
        </defs>

        {/* 1. Squircle Frame with Bevel and Inner Glow */}
        <rect
          x="1"
          y="1"
          width="42"
          height="42"
          rx="12"
          fill="url(#linkletBgGrad)"
        />
        {/* Subtle Inner Glass Rim */}
        <rect
          x="1.5"
          y="1.5"
          width="41"
          height="41"
          rx="11.5"
          stroke="#FFFFFF"
          strokeWidth="1.2"
          strokeOpacity="0.5"
        />

        {/* 2. Primary Interlocking Link Ring (Tilted 45deg, top-left to bottom-right) */}
        {/* Under-pass loop */}
        <path
          d="M17.5 13.5C15 11 11 11 8.5 13.5C6 16 6 20 8.5 22.5L14.5 28.5C17 31 21 31 23.5 28.5C26 26 26 22 23.5 19.5L20.5 16.5"
          stroke="url(#linkWhiteGrad)"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          transform="translate(5, 1)"
          filter="url(#linkShadow)"
        />

        {/* 3. Intersecting Counter Link Ring (interlocking through the center) */}
        <path
          d="M26.5 30.5C29 33 33 33 35.5 30.5C38 28 38 24 35.5 21.5L29.5 15.5C27 13 23 13 20.5 15.5C18 18 18 22 20.5 24.5L23.5 27.5"
          stroke="#FFFFFF"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          transform="translate(-5, -1)"
        />

        {/* 4. Connection Nexus Center Node (The glowing connection point) */}
        <circle cx="22" cy="22" r="2.2" fill="#FFFFFF" />
        <circle cx="22" cy="22" r="1.1" fill="#E67E22" />
      </svg>
    </div>
  );
}
