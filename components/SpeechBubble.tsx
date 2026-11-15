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
      <div className={`mb-4 flex flex-col items-center animate-fade-in ${className}`}>
        <div className="relative px-4 py-1.5 rounded-full bg-[#121a2e] border border-[rgba(245,241,232,0.08)] text-center max-w-[280px]">
          <span className="text-xs text-[rgba(245,241,232,0.62)] font-body font-normal leading-relaxed">
            {message}
          </span>
        </div>
        <div className="flex flex-col items-center gap-1 mt-1">
          <div className="w-1.5 h-1.5 rounded-full bg-[#121a2e] border border-[rgba(245,241,232,0.08)]" />
          <div className="w-1 h-1 rounded-full bg-[#121a2e] border border-[rgba(245,241,232,0.08)]" />
        </div>
      </div>
    );
  }

  // Dialogue Speech Bubble
  if (resolvedStyle === "speech") {
    return (
      <div className={`mb-4 flex flex-col items-center animate-fade-in ${className}`}>
        <div className="relative px-4 py-1.5 rounded-[12px] bg-[#121a2e] border border-[rgba(245,241,232,0.08)] text-center max-w-[280px]">
          <span className="text-xs text-[rgba(245,241,232,0.62)] font-body font-normal leading-relaxed">
            {message}
          </span>
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#121a2e] border-b border-r border-[rgba(245,241,232,0.08)] rotate-45" />
        </div>
      </div>
    );
  }

  // Understated Status Pill
  return (
    <div className={`mb-4 flex flex-col items-center animate-fade-in ${className}`}>
      <div className="px-3.5 py-1 rounded-[12px] bg-[#121a2e] border border-[rgba(245,241,232,0.08)] text-center max-w-[280px] flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-[#c9a96a] shrink-0" />
        <span className="text-xs font-body text-[rgba(245,241,232,0.62)]">
          {message}
        </span>
      </div>
    </div>
  );
}
