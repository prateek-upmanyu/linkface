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

  // Thought Bubble
  if (resolvedStyle === "cloud") {
    return (
      <div className={`mb-3.5 flex flex-col items-center animate-fade-in ${className}`}>
        <div className="relative px-4 py-1.5 rounded-full bg-[#FFFFFF] border border-[#F4D03F] text-center max-w-[280px] shadow-sm">
          <span className="text-xs text-[#18181B] font-body font-semibold leading-relaxed">
            {message}
          </span>
        </div>
        <div className="flex flex-col items-center gap-0.5 mt-1">
          <div className="w-1.5 h-1.5 rounded-full bg-[#F4D03F]" />
          <div className="w-1 h-1 rounded-full bg-[#F9E79F]" />
        </div>
      </div>
    );
  }

  // Dialogue Speech Bubble
  if (resolvedStyle === "speech") {
    return (
      <div className={`mb-3.5 flex flex-col items-center animate-fade-in ${className}`}>
        <div className="relative px-4 py-1.5 rounded-[12px] bg-[#FFFFFF] border border-[#F4D03F] text-center max-w-[280px] shadow-sm">
          <span className="text-xs text-[#18181B] font-body font-semibold leading-relaxed">
            {message}
          </span>
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#FFFFFF] border-b border-r border-[#F4D03F] rotate-45" />
        </div>
      </div>
    );
  }

  // Understated Status Pill
  return (
    <div className={`mb-3.5 flex flex-col items-center animate-fade-in ${className}`}>
      <div className="px-3.5 py-1 rounded-[12px] bg-[#FFFDF5] border border-[#F4D03F] text-center max-w-[280px] flex items-center gap-2 shadow-sm">
        <span className="w-2 h-2 rounded-full bg-[#F39C12] shrink-0 animate-pulse" />
        <span className="text-xs font-body font-semibold text-[#18181B]">
          {message}
        </span>
      </div>
    </div>
  );
}
