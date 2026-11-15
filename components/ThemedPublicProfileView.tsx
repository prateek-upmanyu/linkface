"use client";

import React, { useState } from "react";
import { Profile, LinkItem, FeaturedCreator } from "@/types";
import { ProfileThemeId, getProfileTheme } from "@/lib/profile-themes-config";
import { ThemedLinkButton } from "@/components/ThemedLinkButton";
import { BrandLogo } from "@/components/BrandLogo";
import Link from "next/link";
import { ExternalLink, Star } from "lucide-react";

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
  const [vinylSpinning, setVinylSpinning] = useState(true);

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
    // A. VINYL: Spinning vinyl disc
    if (themeId === "vinyl") {
      return (
        <div
          onMouseEnter={() => setVinylSpinning(false)}
          onMouseLeave={() => setVinylSpinning(true)}
          className="relative w-32 h-32 rounded-full bg-[#111111] p-1 shadow-[0_12px_32px_rgba(0,0,0,0.4)] flex items-center justify-center cursor-pointer transition-transform hover:scale-105"
        >
          {/* Subtle Grooves */}
          <div
            className={`w-full h-full rounded-full border-4 border-[#222222] border-dashed flex items-center justify-center transition-transform duration-700 ${
              vinylSpinning ? "animate-[spin_10s_linear_infinite]" : ""
            }`}
          >
            {/* Center Label with Avatar */}
            <div className="w-16 h-16 rounded-full border-2 border-[#ff6b1a] overflow-hidden bg-[#ff6b1a] relative flex items-center justify-center">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={displayName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="font-bold text-[#111111] text-lg font-mono">
                  {initials}
                </span>
              )}
              {/* Spindle Center Hole */}
              <div className="absolute w-3.5 h-3.5 rounded-full bg-[#111111] border border-white/50" />
            </div>
          </div>
        </div>
      );
    }

    // B. GOTHIC: Pointed-arch window shape
    if (themeId === "gothic") {
      return (
        <div
          className="w-24 h-32 bg-[#0a0908] border-2 border-[#b08d57] shadow-[0_0_24px_rgba(155,29,32,0.6)] p-1 flex items-center justify-center relative overflow-hidden"
          style={{
            borderRadius: "48px 48px 0 0",
          }}
        >
          <div
            className="w-full h-full border border-[#9b1d20] overflow-hidden flex items-center justify-center"
            style={{ borderRadius: "44px 44px 0 0" }}
          >
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={displayName}
                className="w-full h-full object-cover grayscale contrast-125"
              />
            ) : (
              <span className="text-2xl font-bold text-[#b08d57]" style={{ fontFamily: "'Pirata One', cursive" }}>
                {initials}
              </span>
            )}
          </div>
        </div>
      );
    }

    // C. STAMP: Scalloped postage stamp
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

    // D. TRUCK ART: Scalloped medallion with marigold petals
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

    // E. DECO: Octagonal frame with double gold border
    if (themeId === "deco") {
      return (
        <div
          className="w-28 h-28 bg-[#07110e] border-2 border-[#d4af37] p-1.5 flex items-center justify-center shadow-[0_0_24px_rgba(212,175,55,0.4)]"
          style={{
            clipPath: "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)",
          }}
        >
          <div
            className="w-full h-full border border-[#d4af37] flex items-center justify-center overflow-hidden"
            style={{
              clipPath: "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)",
            }}
          >
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={displayName}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-2xl text-[#f2e2b3]" style={{ fontFamily: "'Limelight', cursive" }}>
                {initials}
              </span>
            )}
          </div>
        </div>
      );
    }

    // F. Y2K CHROME: Thick polished chrome ring with glint
    if (themeId === "y2k-chrome") {
      return (
        <div className="relative w-28 h-28 rounded-full p-2 bg-gradient-to-tr from-[#9aa0b4] via-[#ffffff] to-[#6f7592] shadow-[0_8px_32px_rgba(61,90,254,0.4)] flex items-center justify-center">
          <div className="w-full h-full rounded-full bg-[#0b0b1e] p-1 border border-white/50 flex items-center justify-center overflow-hidden">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={displayName}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-xl font-black text-white" style={{ fontFamily: "'Unbounded', sans-serif" }}>
                {initials}
              </span>
            )}
          </div>
        </div>
      );
    }

    // G. RISO: Halftone circle with offset duplicate ring
    if (themeId === "riso") {
      return (
        <div className="relative w-24 h-24 mb-1">
          {/* Offset Cyan Ring */}
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

    // H. PRESS: Halftone newsprint square photo with caption
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

    // I. STICKER BOMB: Peeling round laptop sticker
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

    // J. Default (Receipt, Ticket, Archive): Crisp square / framed
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

    if (themeId === "receipt") {
      return (
        <div className="mb-3 px-3 py-1 bg-[#d62828] text-white text-[11px] font-mono font-bold uppercase tracking-wider shadow-xs rotate-[-1deg]">
          STAMP: {msg}
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

    if (themeId === "ticket") {
      return (
        <div className="mb-3 px-3.5 py-1 rounded-full bg-[#e4572e] text-[#f3e9d2] text-[10px] font-mono font-bold uppercase tracking-widest border border-white/20">
          ★ ADMIT ONE: {msg} ★
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

    if (themeId === "gothic") {
      return (
        <div className="mb-3 px-4 py-1.5 border border-[#b08d57] bg-[#140b0c] text-[#e9e0cf] text-xs font-serif italic text-center max-w-xs">
          &ldquo;{msg}&rdquo;
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

    if (themeId === "deco") {
      return (
        <div
          className="mb-3 px-4 py-1 bg-[#0f3b2e] border border-[#d4af37] text-[#f2e2b3] text-xs font-mono uppercase tracking-[0.2em]"
          style={{ clipPath: "polygon(6px 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px), 0 6px)" }}
        >
          {msg}
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

    if (themeId === "y2k-chrome") {
      return (
        <div className="mb-3 px-4 py-1 rounded-full bg-gradient-to-r from-[#ffffff] via-[#e6e8f0] to-[#b0b5c8] border border-white text-[#0b0b1e] text-[10px] font-mono font-black uppercase tracking-widest shadow-md">
          // STATUS: {msg}
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
          {themeId === "receipt" && "SERVED BY / COLLABORATORS"}
          {themeId === "press" && "EDITORIAL CONTRIBUTORS"}
          {themeId === "ticket" && "GUEST LIST & VIP"}
          {themeId === "vinyl" && "FEATURING CREDITS"}
          {themeId === "postage" && "ADDRESSED CO-PILOTS"}
          {themeId === "gothic" && "HONORED GUILD MEMBERS"}
          {themeId === "sticker-bomb" && "CREW STICKERS"}
          {themeId === "archive" && "SEE ALSO / REFERENCES"}
          {themeId === "truck-art" && "HUMSAFAR / CREW"}
          {themeId === "deco" && "PATRONS OF HONOR"}
          {themeId === "riso" && "PRINT EDITION CO-AUTHORS"}
          {themeId === "y2k-chrome" && "NETWORK ALLIES"}
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
        {themeId === "receipt" && (
          <>
            <div className="text-[10px] font-mono tracking-widest uppercase">
              TOTAL DESTINATIONS: {String(visibleLinks.length).padStart(2, "0")}
            </div>
            {/* SVG Barcode */}
            <div className="py-1">
              <svg className="w-48 h-8 mx-auto" viewBox="0 0 160 30" fill="currentColor">
                <rect x="0" y="0" width="3" height="30" />
                <rect x="5" y="0" width="2" height="30" />
                <rect x="9" y="0" width="5" height="30" />
                <rect x="16" y="0" width="2" height="30" />
                <rect x="20" y="0" width="4" height="30" />
                <rect x="26" y="0" width="2" height="30" />
                <rect x="31" y="0" width="6" height="30" />
                <rect x="40" y="0" width="3" height="30" />
                <rect x="45" y="0" width="2" height="30" />
                <rect x="50" y="0" width="5" height="30" />
                <rect x="57" y="0" width="3" height="30" />
                <rect x="62" y="0" width="6" height="30" />
                <rect x="71" y="0" width="2" height="30" />
                <rect x="75" y="0" width="4" height="30" />
                <rect x="81" y="0" width="3" height="30" />
                <rect x="86" y="0" width="5" height="30" />
                <rect x="93" y="0" width="2" height="30" />
                <rect x="98" y="0" width="4" height="30" />
                <rect x="105" y="0" width="3" height="30" />
                <rect x="110" y="0" width="6" height="30" />
                <rect x="118" y="0" width="2" height="30" />
                <rect x="122" y="0" width="5" height="30" />
                <rect x="130" y="0" width="3" height="30" />
                <rect x="135" y="0" width="4" height="30" />
                <rect x="142" y="0" width="2" height="30" />
                <rect x="146" y="0" width="6" height="30" />
                <rect x="155" y="0" width="3" height="30" />
              </svg>
            </div>
            <div className="text-[10px] font-mono tracking-widest uppercase">
              *** THANK YOU, COME AGAIN ***
            </div>
          </>
        )}

        {themeId === "press" && (
          <div className="text-[10px] font-mono tracking-wider uppercase text-[#3d3a36]">
            VOL. CIV • NO. 42 • PUBLISHED DAILY IN LUXURY INK
          </div>
        )}

        {themeId === "ticket" && (
          <div className="text-[10px] font-mono tracking-widest uppercase text-[#a89f8b]">
            ★ NO REFUNDS • NON-TRANSFERABLE • VALID FOR ONE ENTRY ★
          </div>
        )}

        {themeId === "vinyl" && (
          <div className="text-[10px] font-mono tracking-wider uppercase text-[#111111]">
            CATALOGUE #LF-33RPM • STEREO RECORDING • 2026
          </div>
        )}

        {themeId === "gothic" && (
          <div className="text-xs font-serif italic text-[#b08d57]">
            ✦ IN NOMINE VERITAS • SANCTUM ✦
          </div>
        )}

        {themeId === "truck-art" && (
          <div className="text-xs font-bold text-[#f9a602] tracking-wider" style={{ fontFamily: "'Yatra One', cursive" }}>
            बुरी नज़र वाले तेरा मुँह काला • LINKFACE
          </div>
        )}

        {themeId === "deco" && (
          <div className="text-[10px] font-mono tracking-[0.25em] text-[#d4af37] uppercase">
            ◆ ART DECO LUXURY • EDITION MMXXVI ◆
          </div>
        )}

        {themeId === "riso" && (
          <div className="text-[10px] font-mono font-bold tracking-widest text-[#1a1a1a] uppercase">
            PRINTED IN 2 SPOT COLORS: CYAN & MAGENTA
          </div>
        )}

        {themeId === "y2k-chrome" && (
          <div className="text-[9px] font-mono tracking-widest text-[#3d5afe] uppercase">
            [ CYBERNETIC LINKFACE OS v2.006 // SECURE ONLINE ]
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

      {/* Main Container Card (Narrow Receipt / Poster / Masthead) */}
      <main
        className={`w-full max-w-[460px] mx-auto p-6 sm:p-8 relative z-10 transition-all duration-300 ${
          themeId === "receipt"
            ? "shadow-[0_16px_48px_rgba(0,0,0,0.6)]"
            : themeId === "press"
            ? "border-4 border-[#141414] shadow-[8px_8px_0_#141414]"
            : themeId === "gothic"
            ? "border border-[#b08d57] shadow-[0_0_36px_rgba(0,0,0,0.9)]"
            : themeId === "deco"
            ? "border-2 border-[#d4af37] shadow-[0_0_32px_rgba(212,175,55,0.25)]"
            : "rounded-3xl shadow-lg"
        }`}
        style={{
          backgroundColor: theme.cardBg,
          color: theme.text,
        }}
      >
        {/* Receipt Zig-Zag Mask or Border details */}
        {themeId === "receipt" && (
          <div className="w-full text-center pb-4 border-b-2 border-dashed border-[#1a1a1a]/40 mb-5">
            <span className="text-[11px] font-mono tracking-widest uppercase block font-bold text-[#1a1a1a]">
              *** OFFICIAL RECEIPT ***
            </span>
            <span className="text-[9px] font-mono text-[#55524b] block mt-0.5">
              REGISTER #01 • {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </span>
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

        {/* Deco Fan Sunburst Lines Background (SVG) */}
        {themeId === "deco" && (
          <div className="absolute top-0 left-0 right-0 h-40 pointer-events-none opacity-20 overflow-hidden">
            <svg className="w-full h-full text-[#d4af37]" viewBox="0 0 400 160" fill="none" stroke="currentColor">
              <line x1="200" y1="160" x2="0" y2="0" strokeWidth="1" />
              <line x1="200" y1="160" x2="50" y2="0" strokeWidth="1" />
              <line x1="200" y1="160" x2="100" y2="0" strokeWidth="1" />
              <line x1="200" y1="160" x2="150" y2="0" strokeWidth="1" />
              <line x1="200" y1="160" x2="200" y2="0" strokeWidth="1" />
              <line x1="200" y1="160" x2="250" y2="0" strokeWidth="1" />
              <line x1="200" y1="160" x2="300" y2="0" strokeWidth="1" />
              <line x1="200" y1="160" x2="350" y2="0" strokeWidth="1" />
              <line x1="200" y1="160" x2="400" y2="0" strokeWidth="1" />
            </svg>
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
