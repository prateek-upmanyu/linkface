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

    // Default bubble
    return (
      <div className="mb-3 px-3.5 py-1 rounded-lg bg-white border border-current text-xs font-mono">
        {msg}
      </div>
    );
  };

  // 3. DEDICATED COLLABORATORS ROW PER THEME
  const renderThemedCollaborators = () => {
    if (activeCreators.length === 0) return null;

    return (
      <section className="w-full mt-8 pt-6 border-t border-current/20 text-center">
        <h4 className="text-[10px] uppercase font-mono font-bold tracking-widest opacity-80 mb-3">
          {themeId === "cassette" && "MIX BY / COLLABORATORS"}
          {themeId === "comic" && "FEATURING IN THIS ISSUE"}
          {themeId === "bauhaus" && "COLLECTIVE FELLOWS"}
          {themeId === "herbarium" && "BOTANICAL SPECIMEN CONTRIBUTORS"}
          {themeId === "papercut" && "LAYER COLLABORATORS"}
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
        {themeId === "cassette" && (
          <div className="px-3 py-1 rounded bg-[#f0e6cf] border border-[#1a1a1a] text-[10px] font-mono font-bold tracking-wider text-[#1a1a1a] uppercase shadow-2xs">
            MADE WITH LINKFACE • STEREO MIXTAPE
          </div>
        )}

        {themeId === "comic" && (
          <div className="px-3 py-1 rounded-lg bg-[#ffd400] border-2 border-[#111111] shadow-[2px_2px_0_#111111] text-[11px] font-black uppercase text-[#111111]" style={{ fontFamily: "'Bangers', cursive" }}>
            MADE WITH LINKFACE • END OF CHAPTER!
          </div>
        )}

        {themeId === "bauhaus" && (
          <div className="text-[10px] font-mono font-black tracking-[0.2em] text-[#151515] uppercase border-t-2 border-[#151515] pt-2 w-full">
            FORM FOLLOWS FUNCTION • MADE WITH LINKFACE
          </div>
        )}

        {themeId === "herbarium" && (
          <div className="text-xs italic text-[#7a8f6b] tracking-wider" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
            Pressed Specimen Archive • Made with Linkface
          </div>
        )}

        {themeId === "papercut" && (
          <div className="px-4 py-1 rounded bg-[#fffdf7] text-[#1b1b2f] text-xs font-bold shadow-sm" style={{ fontFamily: "'Fredoka', cursive" }}>
            Crafted with layers • Made with Linkface
          </div>
        )}

        {themeId === "press" && (
          <div className="text-[10px] font-mono tracking-wider uppercase text-[#3d3a36]">
            VOL. CIV • NO. 42 • PUBLISHED DAILY IN LUXURY INK
          </div>
        )}

        {themeId === "vinyl" && (
          <div className="text-[10px] font-mono tracking-wider uppercase text-[#111111]">
            CATALOGUE #LF-33RPM • STEREO RECORDING • 2026
          </div>
        )}

        {themeId === "truck-art" && (
          <div className="text-xs font-bold text-[#f9a602] tracking-wider" style={{ fontFamily: "'Yatra One', cursive" }}>
            बुरी नज़र वाले तेरा मुँह काला • LINKFACE
          </div>
        )}

        {themeId === "riso" && (
          <div className="text-[10px] font-mono font-bold tracking-widest text-[#1a1a1a] uppercase">
            PRINTED IN 2 SPOT COLORS: CYAN & MAGENTA
          </div>
        )}

        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold hover:opacity-100 opacity-70 transition-opacity mt-2"
        >
          <BrandLogo className="w-4 h-4 shadow-none" />
          <span>Made with Linkface</span>
        </Link>
      </footer>
    );
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-between py-10 px-4 sm:px-6 relative overflow-x-hidden select-none"
      style={{
        backgroundColor: theme.bg,
        color: theme.text,
        fontFamily: theme.bodyFont,
      }}
    >
      {/* Dynamic Google Fonts Loader for this specific theme */}
      <link rel="stylesheet" href={theme.googleFontsUrl} />

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

      {/* Herbarium Pressed Flower & Leaf Botanical SVG Accents (Behind content only) */}
      {themeId === "herbarium" && (
        <div className="absolute inset-0 pointer-events-none opacity-25 overflow-hidden">
          <svg className="w-full h-full text-[#7a8f6b]" viewBox="0 0 600 800" fill="none" stroke="currentColor">
            {/* Top-left botanical branch */}
            <path d="M 40 40 Q 90 90 120 180" strokeWidth="1.5" />
            <path d="M 65 65 Q 110 50 125 75 Q 100 90 65 65 Z" fill="currentColor" fillOpacity="0.15" strokeWidth="1" />
            <path d="M 95 125 Q 140 115 150 140 Q 120 155 95 125 Z" fill="currentColor" fillOpacity="0.15" strokeWidth="1" />
            
            {/* Bottom-right pressed flower / fern */}
            <path d="M 560 760 Q 510 710 470 620" strokeWidth="1.5" />
            <path d="M 535 735 Q 490 745 480 720 Q 510 705 535 735 Z" fill="currentColor" fillOpacity="0.15" strokeWidth="1" />
            <path d="M 500 670 Q 450 675 445 650 Q 480 640 500 670 Z" fill="currentColor" fillOpacity="0.15" strokeWidth="1" />
            <circle cx="470" cy="620" r="4" fill="currentColor" fillOpacity="0.3" />
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
        className={`w-full max-w-[460px] mx-auto p-6 sm:p-8 relative z-10 transition-all duration-300 ${
          themeId === "press"
            ? "border-4 border-[#141414] shadow-[8px_8px_0_#141414]"
            : themeId === "comic"
            ? "border-[3.5px] border-[#111111] shadow-[8px_8px_0_#111111] rounded-3xl"
            : themeId === "bauhaus"
            ? "border-[3px] border-[#151515] shadow-[8px_8px_0_#151515] rounded-none"
            : themeId === "herbarium"
            ? "border border-[#7a8f6b]/40 shadow-sm rounded-2xl"
            : "rounded-3xl shadow-lg"
        }`}
        style={{
          backgroundColor: theme.cardBg,
          color: theme.text,
        }}
      >
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
        <div className="flex justify-center mb-4">
          {renderThemedAvatar()}
        </div>

        {/* Name Header */}
        <div className="text-center space-y-1 mb-6">
          <h1
            className="text-2xl sm:text-4xl font-bold leading-tight tracking-tight text-current"
            style={{ fontFamily: theme.headingFont }}
          >
            {displayName}
          </h1>

          <p
            className="text-xs font-mono font-semibold tracking-wider opacity-80"
            style={{ color: theme.accent }}
          >
            @{cleanHandle}
          </p>

          {profile.bio && (
            <p
              className="text-xs sm:text-sm font-medium leading-relaxed max-w-sm mx-auto mt-2"
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

        {/* Collaborators Row */}
        {renderThemedCollaborators()}

        {/* Custom Themed Footer */}
        {renderThemedFooter()}
      </main>
    </div>
  );
}
