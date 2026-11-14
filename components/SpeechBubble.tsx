"use client";

import React from "react";

interface SpeechBubbleProps {
  message?: string | null;
  styleType?: "speech" | "cloud" | "pixel" | null;
  className?: string;
  isVoxel?: boolean;
}

export function SpeechBubble({
  message,
  styleType = "cloud",
  className = "",
  isVoxel = false,
}: SpeechBubbleProps) {
  if (!message || !message.trim()) return null;

  const mode = styleType || (isVoxel ? "pixel" : "cloud");

  // 1. Pixel/Voxel Chat Balloon (Minecraft Style)
  if (mode === "pixel" || isVoxel) {
    return (
      <div className={`relative mb-3 flex flex-col items-center animate-fade-in ${className}`}>
        <div className="relative px-3 py-1.5 bg-[#ffffff] text-[#000000] border-2 border-black shadow-[2px_2px_0px_#000000] text-[11px] font-mono font-bold max-w-[240px] text-center leading-tight tracking-tight">
          {message}
          {/* Stepped pixel tail */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex flex-col items-center">
            <div className="w-2.5 h-1 bg-black" />
            <div className="w-1.5 h-1 bg-black" />
          </div>
        </div>
      </div>
    );
  }

  // 2. Comic Thought / Cloud Bubble (Matching User Image with descending circles)
  if (mode === "cloud") {
    return (
      <div className={`relative mb-3.5 flex flex-col items-center animate-fade-in ${className}`}>
        {/* Main Cloud Body */}
        <div className="relative px-4 py-2 bg-white text-neutral-900 border-2 border-black shadow-[2px_3px_0px_rgba(0,0,0,0.85)] rounded-[20px] text-[11px] font-sans font-bold max-w-[240px] text-center leading-snug tracking-tight">
          {message}

          {/* Cloud Bubble Circles Tail (Thought bubble dots from user image) */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex flex-col items-center gap-0.5">
            <span className="w-2 h-2 rounded-full bg-white border border-black inline-block shadow-xs" />
            <span className="w-1.5 h-1.5 rounded-full bg-white border border-black inline-block shadow-xs" />
          </div>
        </div>
      </div>
    );
  }

  // 3. Classic Comic Speech Bubble with Tail
  return (
    <div className={`relative mb-3 flex flex-col items-center animate-fade-in ${className}`}>
      <div className="relative px-4 py-1.5 bg-white text-neutral-900 border-2 border-black shadow-[2px_2px_0px_#000000] rounded-2xl text-[11px] font-mono font-bold max-w-[240px] text-center leading-tight">
        {message}
        {/* Speech tail pointer */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-x-[5px] border-x-transparent border-t-[8px] border-t-black" />
        <div className="absolute -bottom-[6px] left-1/2 -translate-x-1/2 w-0 h-0 border-x-[4px] border-x-transparent border-t-[7px] border-t-white" />
      </div>
    </div>
  );
}
