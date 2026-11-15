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

  // THOUGHT CLOUD BUBBLE: Crisp pill contour with clean descending thought circles
  if (resolvedStyle === "cloud") {
    return (
      <div className={`mb-3 flex flex-col items-center animate-fade-in ${className}`}>
        <div className="relative px-5 py-2 rounded-full bg-[#111827] border border-white/20 text-center max-w-[280px] shadow-md">
          <span className="text-xs text-[#f3f4f6] font-medium leading-relaxed">
            {message}
          </span>
        </div>
        {/* Clean descending thought dots pointing directly to avatar */}
        <div className="flex flex-col items-center gap-1 mt-1">
          <div className="w-2 h-2 rounded-full bg-[#111827] border border-white/20" />
          <div className="w-1.2 h-1.2 rounded-full bg-[#111827] border border-white/20" />
        </div>
      </div>
    );
  }

  // DIALOGUE SPEECH BUBBLE: Smooth conversational balloon with centered downward tail
  if (resolvedStyle === "speech") {
    return (
      <div className={`mb-3 flex flex-col items-center animate-fade-in ${className}`}>
        <div className="relative px-4 py-2 rounded-[14px] bg-[#111827] border border-white/20 text-center max-w-[280px] shadow-md">
          <span className="text-xs text-[#f3f4f6] font-medium leading-relaxed">
            {message}
          </span>
          {/* Centered Downward Speech Pointer */}
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#111827] border-b border-r border-white/20 rotate-45" />
        </div>
      </div>
    );
  }

  // EDITORIAL / RETRO PLAQUE: Sleek status badge
  return (
    <div className={`mb-3 flex flex-col items-center animate-fade-in ${className}`}>
      <div className="px-3.5 py-1.5 rounded-[6px] bg-[#111827] border border-white/20 text-center max-w-[280px] flex items-center gap-2 shadow-sm">
        <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8] shrink-0 animate-pulse" />
        <span className="text-xs font-mono tracking-wide text-[#f3f4f6]">
          {message}
        </span>
      </div>
    </div>
  );
}
