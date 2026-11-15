"use client";

import React, { useState, useEffect } from "react";
import { isAudioMuted, toggleAudioMuted } from "@/lib/sound-fx";
import { Volume2, VolumeX } from "lucide-react";

export function SoundToggle({ className = "" }: { className?: string }) {
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    setMuted(isAudioMuted());
  }, []);

  const handleToggle = () => {
    const next = toggleAudioMuted();
    setMuted(next);
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={`p-2 rounded-full border border-black/10 dark:border-white/10 bg-white/60 dark:bg-black/40 hover:bg-white/90 dark:hover:bg-black/60 text-current transition-all shadow-xs backdrop-blur-md select-none flex items-center justify-center opacity-75 hover:opacity-100 ${className}`}
      title={muted ? "Unmute sound effects" : "Mute sound effects"}
      aria-label={muted ? "Unmute sound effects" : "Mute sound effects"}
    >
      {muted ? (
        <VolumeX className="w-3.5 h-3.5" />
      ) : (
        <Volume2 className="w-3.5 h-3.5 text-[#E67E22] animate-pulse" />
      )}
    </button>
  );
}
