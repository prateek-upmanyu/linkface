"use client";

import React, { useState } from "react";
import { Profile, LinkItem, FeaturedCreator } from "@/types";
import { ProfileThemeId, getProfileTheme } from "@/lib/profile-themes-config";
import { ThemedLinkButton } from "@/components/ThemedLinkButton";
import { BrandLogo } from "@/components/BrandLogo";
import Link from "next/link";
import { ExternalLink, Star, Sparkles } from "lucide-react";

interface ThemedPublicProfileViewProps {
  profile: Profile;
  links: LinkItem[];
  themeId: ProfileThemeId;
}

export function ThemedPublicProfileView({
  profile,
  links,
  themeId,
}: ThemedPublicProfileViewProps) {
  const theme = getProfileTheme(themeId);
  const [vinylPaused, setVinylPaused] = useState(false);

  const cleanHandle = (profile.username || "creator")
    .split("@")[0]
    .replace(/[^a-z0-9_]/gi, "")
    .toLowerCase();

  const displayName = profile.display_name || `@${cleanHandle}`;

  const initials = displayName
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const activeCreators: FeaturedCreator[] = Array.isArray(profile.featured_creators)
    ? profile.featured_creators.filter((c) => c && c.name?.trim() && c.url?.trim())
    : [];

  const visibleLinks = links.filter((l) => l.is_visible);

  // 1. DEDICATED AVATAR RENDERER PER THEME
  const renderThemedAvatar = () => {
    // FREE 1. NOTEBOOK: Circle avatar with CSS tape strip on top
    if (themeId === "notebook") {
      return (
        <div className="relative inline-block select-none my-1">
          {/* Tape strip on top (CSS) */}
          <div
            className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-5.5 z-20 pointer-events-none rounded-xs border-t border-b border-white/60 shadow-xs"
            style={{
              backgroundColor: "rgba(238, 230, 210, 0.85)",
              transform: "translateX(-50%) rotate(-4deg)",
              backdropFilter: "blur(1px)",
            }}
          />
          {/* Circle Avatar */}
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-[#26303b]/20 bg-white shadow-md flex items-center justify-center relative z-10">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={displayName}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="font-bold text-[#26303b] text-2xl" style={{ fontFamily: "'Caveat', cursive" }}>
                {initials}
              </span>
            )}
          </div>
        </div>
      );
    }

    // FREE 2. PASTEL: Circle avatar with thick pastel ring
    if (themeId === "pastel") {
      return (
        <div className="relative inline-block select-none my-1">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1.5 bg-[#ffd9e0] shadow-sm flex items-center justify-center">
            <div className="w-full h-full rounded-full overflow-hidden border-2 border-white bg-white flex items-center justify-center">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={displayName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="font-bold text-[#2d2a32] text-xl" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  {initials}
                </span>
              )}
            </div>
          </div>
        </div>
      );
    }

    // FREE 3. CONSOLE: Square avatar with small radius
    if (themeId === "console") {
      return (
        <div className="relative inline-block select-none my-1">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden border-2 border-[#20242d] bg-[#171a21] shadow-md flex items-center justify-center">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={displayName}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="font-bold text-[#4ade80] text-xl font-mono">
                {initials}
              </span>
            )}
          </div>
        </div>
      );
    }

    // 1. VINYL (FIXED): Avatar fills 65% of the disc diameter (label area). Whole disc spins together slowly (24s linear), pauses on hover and touch. Grooves and center hole visible.
    if (themeId === "vinyl") {
      return (
        <div
          onMouseEnter={() => setVinylPaused(true)}
          onMouseLeave={() => setVinylPaused(false)}
          onTouchStart={() => setVinylPaused(true)}
          onTouchEnd={() => setVinylPaused(false)}
          className="relative w-36 h-36 rounded-full bg-[#111111] p-2 shadow-[0_12px_36px_rgba(0,0,0,0.5)] flex items-center justify-center cursor-pointer select-none group"
        >
          {/* Subtle Outer Grooves (Spinning Together) */}
          <div
            className="w-full h-full rounded-full border-4 border-[#222222] border-dashed flex items-center justify-center"
            style={{
              animation: "spin 24s linear infinite",
              animationPlayState: vinylPaused ? "paused" : "running",
            }}
          >
            {/* 65% Diameter Center Label with Large Avatar */}
            <div className="w-[68%] h-[68%] rounded-full border-2 border-[#ff6b1a] overflow-hidden bg-[#ff6b1a] relative flex items-center justify-center shadow-inner">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={displayName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="font-bold text-[#111111] text-2xl font-mono">
                  {initials}
                </span>
              )}
              {/* Spindle Center Hole dot over the avatar */}
              <div className="absolute w-3.5 h-3.5 rounded-full bg-[#111111] border border-white/60 shadow-sm pointer-events-none" />
            </div>
          </div>
        </div>
      );
    }

    // 2. CASSETTE (Free): Avatar sits in the cassette window with rotating reels on both sides
    if (themeId === "cassette") {
      return (
        <div className="relative w-full max-w-[280px] h-24 rounded-2xl bg-[#1c1a17] border-4 border-[#1a1a1a] shadow-inner p-1.5 flex items-center justify-between mx-auto overflow-hidden">
          {/* Left Rotating Reel */}
          <div className="w-10 h-10 rounded-full border-2 border-[#f0e6cf] bg-white flex items-center justify-center animate-[spin_8s_linear_infinite] shrink-0">
            <div className="w-4 h-4 rounded-full border border-[#1a1a1a] bg-[#1c1a17]" />
          </div>

          {/* Center Clear Window with Avatar */}
          <div className="w-20 h-20 rounded-xl border-2 border-[#f26b21] overflow-hidden bg-white/90 flex items-center justify-center shadow-md relative z-10">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={displayName}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xl font-bold text-[#1a1a1a] font-mono">{initials}</span>
            )}
          </div>

          {/* Right Rotating Reel */}
          <div className="w-10 h-10 rounded-full border-2 border-[#f0e6cf] bg-white flex items-center justify-center animate-[spin_8s_linear_infinite] shrink-0">
            <div className="w-4 h-4 rounded-full border border-[#1a1a1a] bg-[#1c1a17]" />
          </div>
        </div>
      );
    }

    // 3. COMIC: Circle with thick black outline & pop halftone shadow
    if (themeId === "comic") {
      return (
        <div className="relative p-1 bg-[#ffd400] rounded-full border-[3px] border-[#111111] shadow-[5px_5px_0_#111111] rotate-[-1.5deg]">
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[#111111] bg-white flex items-center justify-center">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={displayName}
                className="w-full h-full object-cover contrast-125"
              />
            ) : (
              <span className="text-3xl font-black text-[#111111]" style={{ fontFamily: "'Bangers', cursive" }}>
                {initials}
              </span>
            )}
          </div>
        </div>
      );
    }

    // 4. BAUHAUS: Circle cropped inside square with colored quarter-circle corner
    if (themeId === "bauhaus") {
      return (
        <div className="relative w-28 h-28 bg-[#f3ede0] border-[3px] border-[#151515] shadow-[6px_6px_0_#d7261e] p-2 flex items-center justify-center">
          {/* Quarter Circle Corner Accent */}
          <div className="absolute top-0 right-0 w-8 h-8 bg-[#1f4fa3] rounded-bl-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-8 h-8 bg-[#f2b705] rounded-tr-full pointer-events-none" />
          <div className="w-20 h-20 rounded-full border-2 border-[#151515] overflow-hidden bg-white flex items-center justify-center relative z-10">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={displayName}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-2xl font-black text-[#151515]" style={{ fontFamily: "'Archivo Black', sans-serif" }}>
                {initials}
              </span>
            )}
          </div>
        </div>
      );
    }

    // 5. HERBARIUM: Oval frame with a thin sage border
    if (themeId === "herbarium") {
      return (
        <div className="relative w-28 h-36 rounded-[50%/60%] border-2 border-[#7a8f6b] p-1 flex items-center justify-center bg-[#fdfbf7] shadow-sm">
          <div className="w-full h-full rounded-[50%/60%] overflow-hidden bg-[#efebe1] flex items-center justify-center">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={displayName}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-2xl font-normal italic text-[#2b2a26]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                {initials}
              </span>
            )}
          </div>
        </div>
      );
    }

    // 6. PAPERCUT: Layered paper ring of two paper colors with soft shadows
    if (themeId === "papercut") {
      return (
        <div className="relative p-2 rounded-full bg-[#ef476f] shadow-[0_8px_20px_rgba(0,0,0,0.3)]">
          <div className="p-1.5 rounded-full bg-[#ffd166] shadow-sm">
            <div className="w-22 h-22 rounded-full border-[3px] border-[#fffdf7] overflow-hidden bg-white flex items-center justify-center">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={displayName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-2xl font-bold text-[#1b1b2f]" style={{ fontFamily: "'Fredoka', cursive" }}>
                  {initials}
                </span>
              )}
            </div>
          </div>
        </div>
      );
    }

    // 7. POSTAGE: Scalloped postage stamp
    if (themeId === "postage") {
      return (
        <div className="relative p-2 bg-white shadow-[0_4px_16px_rgba(0,0,0,0.15)] border-2 border-dashed border-[#1d4e89] rotate-[-2deg]">
          <div className="w-24 h-28 bg-[#f5efe2] border border-[#d62839] overflow-hidden flex flex-col items-center justify-between p-1">
            <span className="text-[9px] font-mono font-bold text-[#d62839] w-full text-left">
              USA 55¢
            </span>
            <div className="w-16 h-16 rounded-sm overflow-hidden bg-white/70 flex items-center justify-center border border-[#1d4e89]">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={displayName}
                  className="w-full h-full object-cover sepia-[0.3]"
                />
              ) : (
                <span className="text-lg font-bold text-[#1d4e89]">{initials}</span>
              )}
            </div>
            <span className="text-[8px] font-mono tracking-widest text-[#1d4e89] uppercase">
              POSTAGE PAID
            </span>
          </div>
        </div>
      );
    }

    // 8. TRUCK ART: Scalloped medallion with marigold petals
    if (themeId === "truck-art") {
      return (
        <div className="relative w-28 h-28 rounded-full bg-[#f9a602] p-1.5 shadow-[0_8px_0_#d81b60] border-2 border-[#fff4d6] flex items-center justify-center">
          <div className="w-full h-full rounded-full border-2 border-dashed border-[#d81b60] p-1 flex items-center justify-center bg-[#0e0e0e]">
            <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={displayName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-2xl font-bold text-[#f9a602]" style={{ fontFamily: "'Rozha One', serif" }}>
                  {initials}
                </span>
              )}
            </div>
          </div>
        </div>
      );
    }

    // 9. RISO: Halftone circle with offset duplicate ring
    if (themeId === "riso") {
      return (
        <div className="relative w-24 h-24 mb-1">
          <div className="absolute inset-0 translate-x-1.5 translate-y-1.5 rounded-full border-4 border-[#0078bf] pointer-events-none" />
          <div className="relative w-full h-full rounded-full border-4 border-[#ff48b0] overflow-hidden bg-white flex items-center justify-center">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={displayName}
                className="w-full h-full object-cover contrast-150"
              />
            ) : (
              <span className="text-xl font-black text-[#1a1a1a]" style={{ fontFamily: "'Rubik Mono One', sans-serif" }}>
                {initials}
              </span>
            )}
          </div>
        </div>
      );
    }

    // 10. PRESS: Halftone newsprint photo with caption
    if (themeId === "press") {
      return (
        <div className="p-1.5 bg-white border-2 border-[#141414] shadow-[4px_4px_0_#141414] rotate-[-1deg]">
          <div className="w-24 h-24 bg-[#ece4d3] border border-[#141414] overflow-hidden flex items-center justify-center">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={displayName}
                className="w-full h-full object-cover grayscale contrast-125"
              />
            ) : (
              <span className="text-2xl font-bold text-[#141414] font-serif">{initials}</span>
            )}
          </div>
          <span className="text-[9px] font-mono tracking-tight text-[#141414] block text-center mt-1 uppercase font-bold">
            FIG. 01 — {cleanHandle}
          </span>
        </div>
      );
    }

    // 11. STICKER BOMB: Peeling round laptop sticker
    if (themeId === "sticker-bomb") {
      return (
        <div className="relative w-26 h-26 rounded-full border-[4px] border-white shadow-[0_8px_0_rgba(0,0,0,0.35)] overflow-hidden bg-[#ffd23f] p-1 flex items-center justify-center rotate-[3deg] hover:rotate-0 transition-transform">
          <div className="w-full h-full rounded-full overflow-hidden bg-white flex items-center justify-center">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={displayName}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-2xl font-black text-[#18181b]" style={{ fontFamily: "'Bagel Fat One', cursive" }}>
                {initials}
              </span>
            )}
          </div>
        </div>
      );
    }

    // 12. ARCHIVE: Clean catalog square
    return (
      <div className="w-24 h-24 rounded-none border-2 border-current p-1 flex items-center justify-center bg-white shadow-xs">
        {profile.avatar_url ? (
          <img
            src={profile.avatar_url}
            alt={displayName}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-xl font-bold text-current font-mono">{initials}</span>
        )}
      </div>
    );
  };

  // 2. DEDICATED SPEECH BUBBLE PER THEME
  const renderThemedSpeechBubble = () => {
    if (!profile.status_message?.trim()) return null;
    const msg = profile.status_message.trim();

    // FREE 1. NOTEBOOK: Sticky note
    if (themeId === "notebook") {
      return (
        <div
          className="mb-4 px-4 py-2 bg-[#fff8b8] text-[#26303b] text-xs sm:text-sm font-bold shadow-[2px_3px_8px_rgba(0,0,0,0.12)] border border-[#e6db74] max-w-[280px] text-center relative z-20"
          style={{
            fontFamily: "'Patrick Hand', cursive",
            transform: "rotate(-1.5deg)",
          }}
        >
          {msg}
        </div>
      );
    }

    // FREE 2. PASTEL: Rounded pastel bubble
    if (themeId === "pastel") {
      return (
        <div
          className="mb-3 px-4 py-1.5 rounded-2xl bg-[#fff0c7] text-[#2d2a32] text-xs font-semibold shadow-xs border border-[#f3dfa2] text-center max-w-[280px]"
          style={{ fontFamily: "'Nunito', sans-serif" }}
        >
          {msg}
        </div>
      );
    }

    // FREE 3. CONSOLE: Comment line style ("// hello")
    if (themeId === "console") {
      return (
        <div
          className="mb-3 px-3 py-1 rounded bg-[#171a21] border border-[#20242d] text-xs font-mono text-[#60a5fa] text-center max-w-[280px] truncate"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          <span className="text-[#94a3b8]">//</span> {msg}
        </div>
      );
    }

    if (themeId === "cassette") {
      return (
        <div className="mb-3 px-3 py-1 rounded-sm bg-[#f26b21] text-white text-[11px] font-mono font-bold uppercase tracking-wider shadow-xs rotate-[-1deg] border border-[#1a1a1a]">
          SIDE A: {msg}
        </div>
      );
    }

    if (themeId === "comic") {
      return (
        <div className="mb-3 relative px-4 py-1.5 rounded-2xl bg-white border-2 border-[#111111] shadow-[3px_3px_0_#111111] text-center max-w-[280px]">
          <span className="text-xs font-bold text-[#111111]" style={{ fontFamily: "'Comic Neue', cursive" }}>
            {msg}
          </span>
          {/* Comic speech tail */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-b-2 border-r-2 border-[#111111] rotate-45" />
        </div>
      );
    }

    if (themeId === "bauhaus") {
      return (
        <div className="mb-3 px-4 py-1.5 bg-[#d7261e] text-white text-xs font-black uppercase tracking-wider border-2 border-[#151515] shadow-[3px_3px_0_#151515]">
          {msg}
        </div>
      );
    }

    if (themeId === "herbarium") {
      return (
        <div className="mb-3 px-3 py-0.5 rounded-sm bg-[#fdfbf7] text-[#2b2a26] text-[11px] tracking-wide border border-[#7a8f6b] shadow-2xs italic font-serif">
          {msg}
        </div>
      );
    }

    if (themeId === "papercut") {
      return (
        <div className="mb-3 px-3.5 py-1 rounded-md bg-[#ffd166] text-[#1b1b2f] text-xs font-bold shadow-md rotate-1">
          {msg}
        </div>
      );
    }

    if (themeId === "press") {
      return (
        <div className="mb-3 px-3 py-1 bg-[#c1121f] text-white text-xs font-mono font-bold uppercase tracking-widest border border-[#141414] shadow-[2px_2px_0_#141414] animate-pulse">
          BREAKING: {msg}
        </div>
      );
    }

    if (themeId === "vinyl") {
      return (
        <div className="mb-3 px-3 py-1 rounded-sm bg-[#ff6b1a] text-white text-[11px] font-mono font-bold uppercase tracking-wider rotate-[2deg] shadow-sm">
          NOW SPINNING: {msg}
        </div>
      );
    }

    if (themeId === "postage") {
      return (
        <div className="mb-3 px-3 py-1 bg-[#1d4e89] text-white text-[10px] font-mono font-bold tracking-widest uppercase border border-[#d62839]">
          PAR AVION: {msg}
        </div>
      );
    }

    if (themeId === "truck-art") {
      return (
        <div className="mb-3 px-4 py-1 rounded-xl bg-[#d81b60] text-[#fff4d6] text-xs font-bold uppercase tracking-wider border-2 border-[#f9a602] shadow-[0_3px_0_#00897b]">
          HORN OK PLEASE: {msg}
        </div>
      );
    }

    if (themeId === "riso") {
      return (
        <div className="mb-3 px-3 py-1 bg-[#ff48b0] text-[#1a1a1a] text-xs font-mono font-black uppercase tracking-wider border-2 border-[#1a1a1a] shadow-[3px_3px_0_#0078bf]">
          {msg}
        </div>
      );
    }

    if (themeId === "sticker-bomb") {
      return (
        <div className="mb-3 px-3.5 py-1 rounded-full bg-[#111111] text-[#ffffff] border-2 border-white shadow-[0_4px_0_rgba(0,0,0,0.4)] text-xs font-black tracking-wide rotate-[-2deg]">
          ★ {msg} ★
        </div>
      );
    }

    // Default bubble
    return (
      <div className="mb-3 px-3.5 py-1 rounded-lg bg-[#18181b] text-white border border-white/20 text-xs font-mono shadow-xs">
        {msg}
      </div>
    );
  };

  // 3. DEDICATED SPOTLIGHT ROW PER THEME
  const renderThemedSpotlight = () => {
    if (activeCreators.length === 0) return null;

    // FREE 1. NOTEBOOK: Star sticker style chips
    if (themeId === "notebook") {
      return (
        <section className="w-full mt-8 pt-6 border-t border-[#c9d8ee] text-center select-none">
          <h4
            className="text-xs uppercase font-bold tracking-widest text-[#5a6878] mb-3"
            style={{ fontFamily: "'Patrick Hand', cursive" }}
          >
            ★ SPOTLIGHT ★
          </h4>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {activeCreators.map((c, i) => (
              <a
                key={c.id || i}
                href={c.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  try {
                    fetch("/api/click", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ spotlightId: c.id || c.url }),
                      keepalive: true,
                    }).catch(() => {});
                  } catch {}
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[#26303b]/25 bg-white text-xs font-bold text-[#26303b] shadow-xs hover:border-[#2f6fdb] hover:shadow-sm transition-all"
                style={{ fontFamily: "'Patrick Hand', cursive" }}
              >
                <span className="text-[#2f6fdb]">★</span>
                {c.avatar_url ? (
                  <img src={c.avatar_url} alt={c.name} className="w-4 h-4 rounded-full object-cover shrink-0" />
                ) : null}
                <span className="truncate max-w-[120px]">{c.name}</span>
                <ExternalLink className="w-3 h-3 text-[#2f6fdb]" />
              </a>
            ))}
          </div>
        </section>
      );
    }

    // FREE 2. PASTEL: Small pastel pills
    if (themeId === "pastel") {
      const PASTEL_PILLS = ["#ffd9e0", "#d7ecff", "#e2f5d8", "#fff0c7"];
      return (
        <section className="w-full mt-8 pt-6 border-t border-black/5 text-center select-none">
          <h4
            className="text-[11px] uppercase font-bold tracking-wider text-[#635f69] mb-3"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Spotlight
          </h4>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {activeCreators.map((c, i) => (
              <a
                key={c.id || i}
                href={c.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  try {
                    fetch("/api/click", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ spotlightId: c.id || c.url }),
                      keepalive: true,
                    }).catch(() => {});
                  } catch {}
                }}
                style={{ backgroundColor: PASTEL_PILLS[i % PASTEL_PILLS.length] }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold text-[#2d2a32] shadow-2xs hover:shadow-xs hover:-translate-y-0.5 transition-all"
              >
                {c.avatar_url ? (
                  <img src={c.avatar_url} alt={c.name} className="w-4 h-4 rounded-full object-cover shrink-0 border border-white" />
                ) : null}
                <span className="truncate max-w-[120px]" style={{ fontFamily: "'Poppins', sans-serif" }}>{c.name}</span>
                <ExternalLink className="w-3 h-3 opacity-60" />
              </a>
            ))}
          </div>
        </section>
      );
    }

    // FREE 3. CONSOLE: Featured list with small tags
    if (themeId === "console") {
      return (
        <section className="w-full mt-8 pt-6 border-t border-[#20242d] text-center font-mono select-none">
          <h4 className="text-[10px] uppercase font-bold tracking-widest text-[#94a3b8] mb-3">
            <span className="text-[#4ade80]">&lt;</span>Spotlight /<span className="text-[#4ade80]">&gt;</span>
          </h4>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {activeCreators.map((c, i) => (
              <a
                key={c.id || i}
                href={c.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  try {
                    fetch("/api/click", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ spotlightId: c.id || c.url }),
                      keepalive: true,
                    }).catch(() => {});
                  } catch {}
                }}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#171a21] border border-[#20242d] hover:border-[#4ade80] text-xs font-mono text-[#e6e9ef] transition-colors"
              >
                <span className="text-[#4ade80] text-[10px]">[feat]</span>
                {c.avatar_url ? (
                  <img src={c.avatar_url} alt={c.name} className="w-4 h-4 rounded-xs object-cover shrink-0" />
                ) : null}
                <span className="truncate max-w-[120px]">{c.name}</span>
                <ExternalLink className="w-3 h-3 text-[#60a5fa]" />
              </a>
            ))}
          </div>
        </section>
      );
    }

    return (
      <section className="w-full mt-8 pt-6 border-t border-current/20 text-center">
        <h4 className="text-[10px] uppercase font-mono font-bold tracking-widest opacity-80 mb-3">
          {themeId === "cassette" && "MIX BY / SPOTLIGHT"}
          {themeId === "comic" && "FEATURING IN THIS ISSUE"}
          {themeId === "bauhaus" && "COLLECTIVE FELLOWS"}
          {themeId === "herbarium" && "BOTANICAL SPECIMEN CONTRIBUTORS"}
          {themeId === "papercut" && "LAYER SPOTLIGHT"}
          {themeId === "press" && "EDITORIAL CONTRIBUTORS"}
          {themeId === "vinyl" && "FEATURING CREDITS"}
          {themeId === "postage" && "ADDRESSED CO-PILOTS"}
          {themeId === "sticker-bomb" && "CREW STICKERS"}
          {themeId === "archive" && "SEE ALSO / REFERENCES"}
          {themeId === "truck-art" && "HUMSAFAR / CREW"}
          {themeId === "riso" && "PRINT EDITION CO-AUTHORS"}
        </h4>

        <div className="flex flex-wrap items-center justify-center gap-2.5">
          {activeCreators.map((c, i) => (
            <a
              key={c.id || i}
              href={c.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                try {
                  fetch("/api/click", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ spotlightId: c.id || c.url }),
                    keepalive: true,
                  }).catch(() => {});
                } catch {}
              }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-current/30 hover:border-current bg-current/5 hover:bg-current/10 transition-all text-xs font-semibold select-none group"
            >
              {c.avatar_url ? (
                <img
                  src={c.avatar_url}
                  alt={c.name}
                  className="w-5 h-5 rounded-full object-cover shrink-0 border border-current/40"
                />
              ) : (
                <div className="w-5 h-5 rounded-full bg-current/20 flex items-center justify-center text-[10px] font-bold">
                  {c.name.slice(0, 1)}
                </div>
              )}
              <span className="truncate max-w-[120px]">{c.name}</span>
              <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100 transition-opacity" />
            </a>
          ))}
        </div>
      </section>
    );
  };

  // 4. DEDICATED FOOTER PER THEME
  const renderThemedFooter = () => {
    return (
      <footer className="w-full mt-10 pt-6 border-t border-dashed border-current/25 flex flex-col items-center gap-2 text-center select-none">
        {/* Vintage flavor slogans (displayed above canonical Made with Linkface link) */}
        {themeId === "cassette" && (
          <div className="px-3 py-1 rounded bg-[#f0e6cf] border border-[#1a1a1a] text-[10px] font-mono font-bold tracking-wider text-[#1a1a1a] uppercase shadow-2xs">
            STEREO MIXTAPE // SIDE A
          </div>
        )}

        {themeId === "comic" && (
          <div className="px-3 py-1 rounded-lg bg-[#ffd400] border-2 border-[#111111] shadow-[2px_2px_0_#111111] text-[11px] font-black uppercase text-[#111111]" style={{ fontFamily: "'Bangers', cursive" }}>
            END OF CHAPTER!
          </div>
        )}

        {themeId === "bauhaus" && (
          <div className="text-[10px] font-mono font-black tracking-[0.2em] text-[#151515] uppercase border-t-2 border-[#151515] pt-2 w-full">
            FORM FOLLOWS FUNCTION
          </div>
        )}

        {themeId === "herbarium" && (
          <div className="text-xs italic text-[#7a8f6b] tracking-wider" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
            Pressed Specimen Archive
          </div>
        )}

        {themeId === "papercut" && (
          <div className="px-4 py-1 rounded bg-[#fffdf7] text-[#1b1b2f] text-xs font-bold shadow-sm" style={{ fontFamily: "'Fredoka', cursive" }}>
            Crafted with layers
          </div>
        )}

        {themeId === "press" && (
          <div className="text-[10px] font-mono tracking-wider uppercase text-[#3d3a36]">
            VOL. CIV • NO. 42 • PUBLISHED DAILY
          </div>
        )}

        {themeId === "vinyl" && (
          <div className="text-[10px] font-mono tracking-wider uppercase text-[#111111]">
            CATALOGUE #LF-33RPM • STEREO RECORDING
          </div>
        )}

        {themeId === "truck-art" && (
          <div className="text-xs font-bold text-[#f9a602] tracking-wider" style={{ fontFamily: "'Yatra One', cursive" }}>
            बुरी नज़र वाले तेरा मुँह काला
          </div>
        )}

        {themeId === "riso" && (
          <div className="text-[10px] font-mono font-bold tracking-widest text-[#1a1a1a] uppercase">
            PRINTED IN 2 SPOT COLORS
          </div>
        )}

        {/* Canonical Single "Made with Linkface" Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold hover:opacity-100 opacity-70 transition-opacity mt-1"
          style={{
            fontFamily:
              themeId === "notebook"
                ? "'Patrick Hand', cursive"
                : themeId === "console"
                ? "monospace"
                : themeId === "pastel"
                ? "'Poppins', sans-serif"
                : undefined,
          }}
        >
          <BrandLogo className="w-4 h-4 shadow-none" />
          <span>Made with Linkface</span>
        </Link>
      </footer>
    );
  };

  return (
    <div
      className="min-h-screen min-h-[100dvh] w-full flex flex-col items-center justify-center py-8 sm:py-12 px-3 sm:px-6 relative overflow-x-hidden select-none"
      style={{
        backgroundColor: theme.bg,
        color: theme.text,
        fontFamily: theme.bodyFont,
      }}
    >
      {/* Dynamic Google Fonts Loader for this specific theme */}
      <link rel="stylesheet" href={theme.googleFontsUrl} />

      {/* Global CSS Keyframes for Motion (Respects reduced motion) */}
      <style>{`
        @keyframes notebookSlideIn {
          from { opacity: 0; transform: translateX(-10px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes pastelRise {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes consoleTypeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          * {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>

      {/* Notebook Ruled Lines Background (Behind content only, spans entire viewport) */}
      {themeId === "notebook" && (
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none">
          {/* Repeating horizontal ruled lines */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "linear-gradient(transparent 31px, #c9d8ee 31px, #c9d8ee 32px)",
              backgroundSize: "100% 32px",
            }}
          />
        </div>
      )}

      {/* Comic Halftone Background Accents (Behind content only) */}
      {themeId === "comic" && (
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: "radial-gradient(#111 1.5px, transparent 1.5px)",
            backgroundSize: "16px 16px",
          }}
        />
      )}

      {/* Herbarium Pressed Flower & Leaf Botanical SVG Accents (Inside Card or Screen View, Behind content only) */}
      {themeId === "herbarium" && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
          <svg className="w-full h-full" viewBox="0 0 500 800" fill="none" preserveAspectRatio="xMidYMid meet">
            <defs>
              <linearGradient id="herbPetalRose" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#e5a9a9" stopOpacity="0.75" />
                <stop offset="100%" stopColor="#b26d6d" stopOpacity="0.85" />
              </linearGradient>
              <linearGradient id="herbPetalAmber" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#edd892" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#cfa152" stopOpacity="0.8" />
              </linearGradient>
              <linearGradient id="herbStemSage" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8da37d" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#5a6e4d" stopOpacity="0.9" />
              </linearGradient>
            </defs>

            {/* TOP-LEFT PRESSED WILDFLOWER SPECIMEN */}
            <g transform="translate(15, 25) rotate(6)">
              {/* Stem with leaf nodes */}
              <path d="M 35 180 Q 45 100 70 30" stroke="url(#herbStemSage)" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M 42 130 Q 25 118 18 124 Q 28 135 42 130 Z" fill="url(#herbStemSage)" />
              <path d="M 55 90 Q 75 78 82 85 Q 68 96 55 90 Z" fill="url(#herbStemSage)" />

              {/* Realistic 5-Petal Pressed Rose Anemone Flower */}
              <g transform="translate(70, 30)">
                <path d="M 0 0 C -12 -20, -22 -22, -16 -34 C -10 -42, 10 -42, 16 -34 C 22 -22, 12 -20, 0 0 Z" fill="url(#herbPetalRose)" stroke="#8e5353" strokeWidth="0.8" strokeOpacity="0.5" />
                <path d="M 0 0 C 18 -12, 26 -8, 35 -2 C 44 6, 38 24, 28 27 C 16 30, 11 16, 0 0 Z" fill="url(#herbPetalRose)" stroke="#8e5353" strokeWidth="0.8" strokeOpacity="0.5" transform="rotate(72)" />
                <path d="M 0 0 C 18 -12, 26 -8, 35 -2 C 44 6, 38 24, 28 27 C 16 30, 11 16, 0 0 Z" fill="url(#herbPetalRose)" stroke="#8e5353" strokeWidth="0.8" strokeOpacity="0.5" transform="rotate(144)" />
                <path d="M 0 0 C 18 -12, 26 -8, 35 -2 C 44 6, 38 24, 28 27 C 16 30, 11 16, 0 0 Z" fill="url(#herbPetalRose)" stroke="#8e5353" strokeWidth="0.8" strokeOpacity="0.5" transform="rotate(216)" />
                <path d="M 0 0 C 18 -12, 26 -8, 35 -2 C 44 6, 38 24, 28 27 C 16 30, 11 16, 0 0 Z" fill="url(#herbPetalRose)" stroke="#8e5353" strokeWidth="0.8" strokeOpacity="0.5" transform="rotate(288)" />
                {/* Flower center pistil & pressed stamens */}
                <circle cx="0" cy="0" r="6" fill="#6d5830" opacity="0.85" />
                <circle cx="0" cy="0" r="3.5" fill="#3f3219" opacity="0.9" />
                <circle cx="-1.5" cy="-1.5" r="1" fill="#fff" opacity="0.6" />
              </g>
            </g>

            {/* TOP-RIGHT PRESSED CHAMOMILE / DAISY SPECIMEN */}
            <g transform="translate(410, 25) rotate(-10)">
              <path d="M 45 160 Q 30 95 15 25" stroke="url(#herbStemSage)" strokeWidth="2.2" strokeLinecap="round" />
              <path d="M 35 110 Q 50 100 58 104 Q 46 116 35 110 Z" fill="url(#herbStemSage)" />
              <g transform="translate(15, 25)">
                {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
                  <ellipse
                    key={deg}
                    cx="0"
                    cy="-18"
                    rx="3.8"
                    ry="12"
                    fill="url(#herbPetalAmber)"
                    stroke="#99732a"
                    strokeWidth="0.6"
                    strokeOpacity="0.45"
                    transform={`rotate(${deg})`}
                  />
                ))}
                <circle cx="0" cy="0" r="7.5" fill="#b0842f" opacity="0.85" />
                <circle cx="0" cy="0" r="4.5" fill="#755315" opacity="0.9" />
              </g>
            </g>

            {/* BOTTOM-LEFT BOTANICAL FERN FROND */}
            <g transform="translate(15, 580) rotate(-12)">
              <path d="M 10 180 Q 50 100 100 10" stroke="url(#herbStemSage)" strokeWidth="2.2" strokeLinecap="round" />
              {[
                { x: 25, y: 145, rot: -40, w: 18 },
                { x: 30, y: 140, rot: 35, w: 18 },
                { x: 45, y: 110, rot: -45, w: 22 },
                { x: 52, y: 105, rot: 35, w: 22 },
                { x: 68, y: 75, rot: -45, w: 20 },
                { x: 74, y: 70, rot: 40, w: 20 },
                { x: 88, y: 38, rot: -40, w: 15 },
                { x: 92, y: 34, rot: 35, w: 15 },
              ].map((pin, i) => (
                <path
                  key={i}
                  d={`M ${pin.x} ${pin.y} Q ${pin.x + pin.w} ${pin.y - 10} ${pin.x + pin.w * 1.2} ${pin.y - 3} Q ${pin.x + pin.w * 0.5} ${pin.y + 3} ${pin.x} ${pin.y} Z`}
                  fill="url(#herbStemSage)"
                  transform={`rotate(${pin.rot} ${pin.x} ${pin.y})`}
                />
              ))}
            </g>

            {/* BOTTOM-RIGHT PRESSED ROSEBUD & LAVENDER SPECIMEN */}
            <g transform="translate(410, 600) rotate(8)">
              <path d="M 45 170 Q 35 100 25 25" stroke="url(#herbStemSage)" strokeWidth="2" strokeLinecap="round" />
              <path d="M 38 120 Q 20 110 15 116 Q 25 125 38 120 Z" fill="url(#herbStemSage)" />
              <g transform="translate(25, 25)">
                <path d="M 0 0 C -10 -15, -15 -18, -11 -28 C -6 -36, 6 -36, 11 -28 C 15 -18, 10 -15, 0 0 Z" fill="url(#herbPetalRose)" stroke="#8e5353" strokeWidth="0.6" strokeOpacity="0.5" />
                <path d="M 0 0 C 15 -10, 20 -6, 23 2 C 24 11, 15 18, 0 0 Z" fill="url(#herbPetalRose)" stroke="#8e5353" strokeWidth="0.6" strokeOpacity="0.5" transform="rotate(60)" />
                <path d="M 0 0 C -15 -10, -20 -6, -23 2 C -24 11, -15 18, 0 0 Z" fill="url(#herbPetalRose)" stroke="#8e5353" strokeWidth="0.6" strokeOpacity="0.5" transform="rotate(-60)" />
                <circle cx="0" cy="0" r="4.5" fill="#5c441b" opacity="0.8" />
              </g>
            </g>
          </svg>
        </div>
      )}

      {/* Papercut Wavy Stacked Layers Background (Behind content only) */}
      {themeId === "papercut" && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
          <div className="absolute top-0 left-0 right-0 h-40 bg-[#ef476f] rounded-b-[60px]" />
          <div className="absolute top-24 left-0 right-0 h-40 bg-[#ffd166] rounded-b-[80px]" />
          <div className="absolute top-48 left-0 right-0 h-40 bg-[#06d6a0] rounded-b-[100px]" />
        </div>
      )}

      {/* Main Container Card */}
      <main
        className={`w-full max-w-[460px] mx-auto p-5 sm:p-8 relative z-10 transition-all duration-300 my-auto ${
          themeId === "press"
            ? "border-4 border-[#141414] shadow-[8px_8px_0_#141414]"
            : themeId === "comic"
            ? "border-[3.5px] border-[#111111] shadow-[8px_8px_0_#111111] rounded-3xl"
            : themeId === "bauhaus"
            ? "border-[3px] border-[#151515] shadow-[8px_8px_0_#151515] rounded-none"
            : themeId === "herbarium"
            ? "border border-[#7a8f6b]/40 shadow-sm rounded-2xl relative overflow-hidden"
            : themeId === "notebook"
            ? "border border-[#c9d8ee] shadow-[0_8px_30px_rgba(47,111,219,0.08)] rounded-2xl relative overflow-hidden"
            : "rounded-3xl shadow-lg"
        }`}
        style={{
          backgroundColor: theme.cardBg,
          color: theme.text,
        }}
      >
        {/* Notebook Card Interior Ruled Lines & Red Left Margin (Inside sheet) */}
        {themeId === "notebook" && (
          <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none">
            {/* Ruled lines inside the card */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: "linear-gradient(transparent 31px, #c9d8ee 31px, #c9d8ee 32px)",
                backgroundSize: "100% 32px",
              }}
            />
            {/* Red margin line on the left inside the sheet */}
            <div
              className="absolute top-0 bottom-0 w-[2px] bg-[#e07a7a] opacity-80 left-7 sm:left-10"
            />
          </div>
        )}
        {/* Herbarium In-Card Pressed Botanical Corner Florals (Guaranteed visible in both full desktop and phone preview) */}
        {themeId === "herbarium" && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
            {/* Top-right dried botanical stem */}
            <svg className="absolute -top-4 -right-4 w-36 h-36 opacity-60" viewBox="0 0 140 140" fill="none">
              <path d="M 120 10 Q 70 50 20 120" stroke="#7a8f6b" strokeWidth="2" strokeLinecap="round" />
              <path d="M 90 35 Q 110 30 115 40 Q 98 48 90 35 Z" fill="#7a8f6b" opacity="0.8" />
              <path d="M 65 65 Q 45 55 40 62 Q 55 72 65 65 Z" fill="#7a8f6b" opacity="0.8" />
              {/* Top-right mini pressed wild rose */}
              <circle cx="118" cy="12" r="14" fill="#e5a9a9" opacity="0.75" />
              <circle cx="118" cy="12" r="10" fill="#c98a8a" opacity="0.85" />
              <circle cx="118" cy="12" r="4.5" fill="#5c441b" opacity="0.9" />
            </svg>

            {/* Bottom-left dried pressed flower & leaf */}
            <svg className="absolute -bottom-4 -left-4 w-36 h-36 opacity-60" viewBox="0 0 140 140" fill="none">
              <path d="M 15 130 Q 60 90 110 20" stroke="#7a8f6b" strokeWidth="2" strokeLinecap="round" />
              <path d="M 45 105 Q 25 100 20 110 Q 38 118 45 105 Z" fill="#7a8f6b" opacity="0.8" />
              <path d="M 75 75 Q 95 65 100 72 Q 85 82 75 75 Z" fill="#7a8f6b" opacity="0.8" />
              {/* Bottom-left chamomile pressed flower */}
              <circle cx="18" cy="125" r="13" fill="#edd892" opacity="0.75" />
              <circle cx="18" cy="125" r="9" fill="#cfa152" opacity="0.85" />
              <circle cx="18" cy="125" r="4" fill="#755315" opacity="0.9" />
            </svg>
          </div>
        )}
        {/* Console Editor Header Bar */}
        {themeId === "console" && (
          <div className="w-full bg-[#20242d] rounded-t-xl px-3 sm:px-4 py-2 border border-[#2b303c] flex items-center justify-between gap-2 mb-5 select-none font-mono text-xs overflow-hidden">
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
            </div>
            <div className="min-w-0 flex-1 text-center px-1">
              <span className="text-[11px] text-[#e6e9ef] font-bold truncate block">
                ~/@{cleanHandle}.sh
              </span>
            </div>
            <span className="text-[10px] text-[#4ade80] font-bold shrink-0 whitespace-nowrap flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] animate-pulse" />
              READY
            </span>
          </div>
        )}

        {/* Cassette Tape Header Strip */}
        {themeId === "cassette" && (
          <div className="w-full text-center pb-3 border-b-2 border-[#1a1a1a] mb-5">
            <div className="inline-block px-4 py-1 rounded bg-[#ffffff] border-2 border-[#1a1a1a] shadow-xs">
              <span
                className="text-xs font-mono font-bold tracking-widest uppercase text-[#1a1a1a]"
                style={{ fontFamily: "'DM Mono', monospace" }}
              >
                ★ MIXTAPE // STEREO CASSETTE ★
              </span>
            </div>
          </div>
        )}

        {/* Press Masthead Line */}
        {themeId === "press" && (
          <div className="w-full text-center pb-3 border-b-4 border-double border-[#141414] mb-6">
            <h2
              className="text-4xl sm:text-5xl font-black tracking-tight text-[#141414] uppercase leading-none"
              style={{ fontFamily: "'Abril Fatface', Georgia, serif" }}
            >
              THE LINKFACE DISPATCH
            </h2>
            <div className="flex items-center justify-between border-t border-b border-[#141414] py-1 mt-2 text-[10px] font-mono uppercase font-bold text-[#141414]">
              <span>EDITION NO. 42</span>
              <span>SPECIAL CREATOR REPORT</span>
              <span>PRICE $0.00</span>
            </div>
          </div>
        )}

        {/* Comic Title Burst */}
        {themeId === "comic" && (
          <div className="w-full text-center mb-4">
            <span
              className="inline-block px-4 py-1 bg-[#ffd400] text-[#111111] border-2 border-[#111111] shadow-[3px_3px_0_#111111] text-xs font-black uppercase tracking-widest rotate-[-1deg]"
              style={{ fontFamily: "'Bangers', cursive" }}
            >
              ★ ACTION ISSUE #01 ★
            </span>
          </div>
        )}

        {/* Speech Bubble */}
        <div className="flex justify-center">
          {renderThemedSpeechBubble()}
        </div>

        {/* Avatar */}
        <div className="flex justify-center mb-5">
          {renderThemedAvatar()}
        </div>

        {/* Name Header */}
        <div className="text-center space-y-2.5 mb-7 max-w-full overflow-hidden px-2">
          <h1
            className="text-xl sm:text-3xl md:text-4xl font-bold leading-normal tracking-tight text-current break-words hyphens-auto"
            style={{
              fontFamily: theme.headingFont,
              wordBreak: "break-word",
              overflowWrap: "anywhere",
            }}
          >
            {displayName}
          </h1>

          <div className="pt-0.5">
            <span
              className="inline-block text-xs sm:text-sm font-mono font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-current/5 border border-current/15 max-w-full truncate"
              style={{ color: theme.accent }}
            >
              @{cleanHandle}
            </span>
          </div>

          {profile.bio && (
            <p
              className="text-xs sm:text-sm font-medium leading-relaxed max-w-sm mx-auto pt-1 break-words opacity-90"
              style={{
                color: theme.muted,
                fontFamily: theme.bodyFont,
              }}
            >
              {profile.bio}
            </p>
          )}
        </div>

        {/* Links Stack or 2-Column Grid */}
        <div
          className={`w-full ${
            theme.linkLayout === "grid-2"
              ? "grid grid-cols-1 sm:grid-cols-2 gap-3"
              : "flex flex-col gap-3"
          }`}
        >
          {visibleLinks.length === 0 ? (
            <div className="py-8 text-center border-2 border-dashed border-current/30 rounded-xl">
              <p className="text-xs font-mono">No links published yet.</p>
            </div>
          ) : (
            visibleLinks.map((link, idx) => (
              <ThemedLinkButton
                key={link.id}
                link={link}
                themeId={themeId}
                index={idx}
              />
            ))
          )}
        </div>

        {/* Spotlight Row */}
        {renderThemedSpotlight()}

        {/* Custom Themed Footer */}
        {renderThemedFooter()}
      </main>
    </div>
  );
}
