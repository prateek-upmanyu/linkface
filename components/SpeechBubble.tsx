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
  className = "",
}: SpeechBubbleProps) {
  if (!message || !message.trim()) return null;

  return (
    <div className={`mb-3.5 flex flex-col items-center animate-fade-in ${className}`}>
      <div className="px-3.5 py-1.5 rounded-[12px] bg-[#00224a] border border-[var(--border-soft)] text-center max-w-[280px]">
        <span className="text-xs text-[var(--color-text-offwhite)] font-body leading-relaxed">
          {message}
        </span>
      </div>
    </div>
  );
}
