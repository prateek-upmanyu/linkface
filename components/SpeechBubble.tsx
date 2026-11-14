"use client";

import React from "react";
import { Sparkles, Quote } from "lucide-react";

interface SpeechBubbleProps {
  message?: string | null;
  styleType?: "speech" | "cloud" | "pixel" | null;
  className?: string;
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
        {/* Soft Cloud Container with gold trim */}
        <div className="relative px-4 py-2 bg-gradient-to-r from-[#22070e]/95 via-[#300914]/95 to-[#22070e]/95 backdrop-blur-md text-[#faedd0] border border-[#d4af37]/40 shadow-[0_6px_20px_rgba(0,0,0,0.5),0_0_15px_rgba(212,175,55,0.12)] rounded-[22px] text-xs font-sans font-medium max-w-[250px] text-center leading-snug">
          <span>{message}</span>

          {/* Descending Thought Bubbles */}
          <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 flex flex-col items-center gap-0.5">
            <span className="w-2 h-2 rounded-full bg-[#2a0912] border border-[#d4af37]/50 block shadow-xs" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#22070e] border border-[#d4af37]/40 block shadow-xs" />
          </div>
        </div>
      </div>
    );
  }

  // 2. Elegant Speech Balloon with Tail Pointer
  if (mode === "speech") {
    return (
      <div className={`relative mb-4 flex flex-col items-center animate-fade-in ${className}`}>
        <div className="relative px-4 py-2 bg-[#1f070d]/95 backdrop-blur-md text-[#faedd0] border border-[#d4af37]/45 shadow-[0_6px_20px_rgba(0,0,0,0.6)] rounded-2xl text-xs font-sans font-medium max-w-[250px] text-center leading-snug">
          <span>{message}</span>

          {/* Triangular Tail Pointer */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-x-[6px] border-x-transparent border-t-[8px] border-t-[#d4af37]/45" />
          <div className="absolute -bottom-[7px] left-1/2 -translate-x-1/2 w-0 h-0 border-x-[5px] border-x-transparent border-t-[7px] border-t-[#1f070d]" />
        </div>
      </div>
    );
  }

  // 3. Luxury Quotation Plaque / Editorial Badge
  return (
    <div className={`relative mb-4 flex flex-col items-center animate-fade-in ${className}`}>
      <div className="relative px-4 py-2 bg-gradient-to-r from-[#170509] via-[#240810] to-[#170509] backdrop-blur-md text-[#faedd0] border border-[#d4af37]/50 shadow-[0_4px_20px_rgba(212,175,55,0.15)] rounded-lg text-xs font-serif italic max-w-[260px] text-center leading-relaxed flex items-center justify-center gap-1.5">
        <Quote className="w-3 h-3 text-[#d4af37] shrink-0 opacity-70 rotate-180" />
        <span className="font-medium tracking-wide">{message}</span>
        <Quote className="w-3 h-3 text-[#d4af37] shrink-0 opacity-70" />
      </div>
    </div>
  );
}
