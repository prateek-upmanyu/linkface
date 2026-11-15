"use client";

import React from "react";

interface SpeechBubbleProps {
  message?: string | null;
  styleType?: "speech" | "cloud" | "pixel" | null;
  className?: string;
  isDark?: boolean;
}

export function SpeechBubble({
  message,
  styleType = "speech",
  className = "",
}: SpeechBubbleProps) {
  if (!message || !message.trim()) return null;

  const resolvedStyle = styleType || "speech";

  // CLOUD / THOUGHT BUBBLE (Distinct puffy cloud lobes + trailing thought circles)
  if (resolvedStyle === "cloud") {
    return (
      <div className={`mb-3 flex flex-col items-center animate-fade-in ${className}`}>
        <div className="relative px-5 py-2.5 rounded-[20px] bg-[#001a3a] border border-[#d0f600]/40 text-center max-w-[280px]">
          {/* Subtle cloud scallops to give authentic puffy cloud contour */}
          <div className="absolute -top-1.5 left-5 w-4 h-4 rounded-full bg-[#001a3a] border-t border-[#d0f600]/40 pointer-events-none" />
          <div className="absolute -top-2.5 right-6 w-5 h-5 rounded-full bg-[#001a3a] border-t border-[#d0f600]/40 pointer-events-none" />
          <div className="absolute -bottom-1 left-9 w-3.5 h-3.5 rounded-full bg-[#001a3a] border-b border-[#d0f600]/40 pointer-events-none" />
          <span className="relative z-10 text-xs text-[var(--color-text-offwhite)] font-body leading-relaxed">
            {message}
          </span>
        </div>
        {/* Thought Bubble Trailing Circles pointing downward to avatar */}
        <div className="flex flex-col items-center gap-1 mt-1">
          <div className="w-2.5 h-2.5 rounded-full bg-[#001a3a] border border-[#d0f600]/40" />
          <div className="w-1.5 h-1.5 rounded-full bg-[#001a3a] border border-[#d0f600]/40" />
        </div>
      </div>
    );
  }

  // SPEECH BUBBLE (Classic conversational dialogue bubble with downward pointing tail)
  if (resolvedStyle === "speech") {
    return (
      <div className={`mb-3 flex flex-col items-center animate-fade-in ${className}`}>
        <div className="relative px-4 py-2 rounded-[14px] bg-[#00224a] border border-[var(--border-soft)] text-center max-w-[280px]">
          <span className="text-xs text-[var(--color-text-offwhite)] font-body leading-relaxed">
            {message}
          </span>
          {/* Speech tail pointer pointing to avatar */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-x-[6px] border-x-transparent border-t-[8px] border-t-[#00224a]" />
          {/* Subtle border outline for tail */}
          <div className="absolute -bottom-[9px] left-1/2 -translate-x-1/2 w-0 h-0 border-x-[6px] border-x-transparent border-t-[8px] border-t-[var(--border-soft)] -z-10" />
        </div>
      </div>
    );
  }

  // EDITORIAL PLAQUE (Sleek minimalist rectangular plaque with lime accent)
  return (
    <div className={`mb-3 flex flex-col items-center animate-fade-in ${className}`}>
      <div className="px-3.5 py-1.5 rounded-[4px] bg-[#001a3a] border border-[var(--border-soft)] border-t-[#d0f600] text-center max-w-[280px] flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-[#d0f600] shrink-0" />
        <span className="text-xs font-mono tracking-wide text-[var(--color-text-offwhite)]">
          {message}
        </span>
      </div>
    </div>
  );
}
