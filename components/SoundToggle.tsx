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
      className={`p-1.5 rounded-lg border border-white/20 bg-black/40 hover:bg-black/60 text-white transition-all backdrop-blur-xs select-none ${className}`}
      title={muted ? "Unmute sound effects" : "Mute sound effects"}
      aria-label={muted ? "Unmute sound effects" : "Mute sound effects"}
    >
      {muted ? (
        <VolumeX className="w-3.5 h-3.5 opacity-60 hover:opacity-100" />
      ) : (
        <Volume2 className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
      )}
    </button>
  );
}
