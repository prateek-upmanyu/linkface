"use client";

import React from "react";
import { Quote } from "lucide-react";

interface SpeechBubbleProps {
  message?: string | null;
  styleType?: "speech" | "cloud" | "pixel" | null;
  className?: string;
  isDark?: boolean;
}

export function SpeechBubble({
  message,
  styleType = "cloud",
  className = "",
}: SpeechBubbleProps) {
  if (!message || !message.trim()) return null;

  const mode = styleType || "cloud";

  // 1. Refined Thought Cloud (Matching comic cloud with descending circles)
  if (mode === "cloud") {
    return (
      <div className={`relative mb-4 flex flex-col items-center animate-fade-in ${className}`}>
        <div className="relative px-4 py-2 backdrop-blur-md rounded-[22px] text-xs font-body font-medium max-w-[260px] text-center leading-snug bg-[#002e62]/95 text-[var(--color-text-offwhite)] border border-[var(--border-soft)] shadow-[var(--shadow-card)]">
          <span>{message}</span>

          {/* Descending Thought Bubbles */}
          <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 flex flex-col items-center gap-0.5">
            <span className="w-2 h-2 rounded-full block shadow-xs bg-[#00224a] border border-[var(--border-soft)]" />
            <span className="w-1.5 h-1.5 rounded-full block shadow-xs bg-[#001a3a] border border-[var(--border-soft)]" />
          </div>
        </div>
      </div>
    );
  }

  // 2. Elegant Speech Balloon with Tail Pointer
  if (mode === "speech") {
    return (
      <div className={`relative mb-4 flex flex-col items-center animate-fade-in ${className}`}>
        <div className="relative px-4 py-2 backdrop-blur-md rounded-2xl text-xs font-body font-medium max-w-[260px] text-center leading-snug bg-[#002e62]/95 text-[var(--color-text-offwhite)] border border-[var(--border-soft)] shadow-[var(--shadow-card)]">
          <span>{message}</span>

          {/* Triangular Tail Pointer */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-x-[6px] border-x-transparent border-t-[8px] border-t-[var(--border-soft)]" />
          <div className="absolute -bottom-[7px] left-1/2 -translate-x-1/2 w-0 h-0 border-x-[5px] border-x-transparent border-t-[7px] border-t-[#002e62]" />
        </div>
      </div>
    );
  }

  // 3. Editorial Quote Plaque / Citation Badge
  return (
    <div className={`relative mb-4 flex flex-col items-center animate-fade-in ${className}`}>
      <div className="relative px-4 py-2 backdrop-blur-md rounded-lg text-xs font-heading italic max-w-[260px] text-center leading-relaxed flex items-center justify-center gap-1.5 bg-[#002e62]/95 text-[var(--color-text-offwhite)] border border-[var(--border-soft)] shadow-[var(--shadow-card)]">
        <Quote className="w-3 h-3 shrink-0 opacity-80 rotate-180 text-[var(--color-acid-lime)]" />
        <span className="font-medium tracking-wide">{message}</span>
        <Quote className="w-3 h-3 shrink-0 opacity-80 text-[var(--color-acid-lime)]" />
      </div>
    </div>
  );
}
