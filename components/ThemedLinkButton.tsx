"use client";

import React, { useState } from "react";
import { LinkItem } from "@/types";
import { PLATFORMS } from "@/lib/platforms";
import { PlatformIcon } from "@/components/PlatformIcon";
import { playClickSound } from "@/lib/sound-fx";
import { ProfileThemeId, getProfileTheme } from "@/lib/profile-themes-config";
import { ArrowRight, ArrowUpRight, Barcode } from "lucide-react";

interface ThemedLinkButtonProps {
  link: LinkItem;
  themeId: ProfileThemeId;
  index: number;
}

export function ThemedLinkButton({ link, themeId, index }: ThemedLinkButtonProps) {
  const [clicked, setClicked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const theme = getProfileTheme(themeId);

  const platform = PLATFORMS.find((p) => p.id === link.platform);
  const brandColor = platform?.brandColor || "#18181b";
  const favicon =
    link.url && !platform
      ? `https://www.google.com/s2/favicons?domain=${
          link.url.replace(/^https?:\/\//i, "").split("/")[0]
        }&sz=128`
      : null;

  const isDemo = !link.url || link.url === "#" || link.url.startsWith("#") || link.id.startsWith("demo-");

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    playClickSound();
    setClicked(true);
    setTimeout(() => setClicked(false), 150);

    if (isDemo) {
      e.preventDefault();
      return;
    }

    fetch("/api/click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ linkId: link.id }),
    }).catch(() => {});
  };

  // Dedicated Platform Chip: 44-50px Solid Contrasting Chip in Real Brand Colors
  const renderLogoChip = (extraClass = "") => (
    <div
      className={`w-11 h-11 min-w-[44px] rounded-xl flex items-center justify-center shrink-0 shadow-sm relative z-10 transition-transform duration-200 group-hover:scale-105 ${extraClass}`}
      style={{
        backgroundColor: brandColor === "#000000" && theme.isDark ? "#ffffff" : brandColor,
        color: brandColor === "#000000" && theme.isDark ? "#000000" : "#ffffff",
        boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
      }}
    >
      <PlatformIcon
        platformId={link.platform}
        faviconUrl={link.custom_icon || favicon}
        className="w-5 h-5 text-current drop-shadow-xs"
      />
    </div>
  );

  // 1. RECEIPT: Line item with dotted leader and "OPEN >"
  if (themeId === "receipt") {
    return (
      <a
        href={isDemo ? "#" : link.url}
        target={isDemo ? undefined : "_blank"}
        rel={isDemo ? undefined : "noopener noreferrer"}
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="w-full min-h-[58px] p-2.5 flex items-center justify-between border-b border-dashed border-[#1a1a1a]/40 text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-[#f4f1e8] transition-colors duration-150 group font-mono select-none"
        style={{
          fontFamily: theme.monoFont,
        }}
      >
        <div className="flex items-center gap-3 min-w-0 flex-1 mr-2">
          {renderLogoChip("border border-[#1a1a1a]")}
          <div className="min-w-0 flex-1">
            <span className="text-sm font-bold uppercase tracking-tight block truncate">
              {link.title}
            </span>
            <span className="text-[10px] opacity-70 block truncate">
              ITEM #{String(index + 1).padStart(2, "0")} • {platform?.name || "LINK"}
            </span>
          </div>
        </div>

        <div className="hidden sm:flex flex-1 mx-2 items-center overflow-hidden opacity-40">
          <span className="truncate tracking-widest text-xs">. . . . . . . . . . . . . . . . . . . .</span>
        </div>

        <div className="flex items-center gap-1 shrink-0 text-xs font-bold uppercase tracking-wider pl-2">
          <span>OPEN</span>
          <span className="group-hover:translate-x-1 transition-transform">&gt;</span>
        </div>
      </a>
    );
  }

  // 2. PRESS: Headline block with vertical column rules and ink-multiply shade
  if (themeId === "press") {
    return (
      <a
        href={isDemo ? "#" : link.url}
        target={isDemo ? undefined : "_blank"}
        rel={isDemo ? undefined : "noopener noreferrer"}
        onClick={handleClick}
        className="w-full p-4 bg-[#ece4d3] border-2 border-[#141414] shadow-[3px_3px_0px_#141414] hover:shadow-[5px_5px_0px_#141414] hover:-translate-y-0.5 transition-all duration-150 flex flex-col justify-between gap-3 group select-none text-[#141414]"
      >
        <div className="flex items-center justify-between gap-2 border-b border-[#141414]/30 pb-2">
          <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-[#c1121f]">
            DISPATCH #{index + 1}
          </span>
          <span className="text-[10px] font-mono text-[#3d3a36] uppercase">
            READ NOW →
          </span>
        </div>

        <div className="flex items-center gap-3 min-w-0">
          {renderLogoChip("border-2 border-[#141414]")}
          <div className="min-w-0 flex-1">
            <h3
              className="text-base sm:text-lg font-bold leading-tight tracking-tight text-[#141414] group-hover:underline group-hover:decoration-2 group-hover:decoration-[#c1121f] transition-all line-clamp-2"
              style={{ fontFamily: "'Abril Fatface', Georgia, serif" }}
            >
              {link.title}
            </h3>
            <p className="text-[11px] font-body text-[#3d3a36] mt-0.5 truncate">
              {platform?.name || "Verified External Link"}
            </p>
          </div>
        </div>
      </a>
    );
  }

  // 3. TICKET: Notched concert stub with perforated dashed rule and seat code
  if (themeId === "ticket") {
    const seatRow = String.fromCharCode(65 + (index % 6));
    const seatNum = String((index + 1) * 7).padStart(2, "0");

    return (
      <a
        href={isDemo ? "#" : link.url}
        target={isDemo ? undefined : "_blank"}
        rel={isDemo ? undefined : "noopener noreferrer"}
        onClick={handleClick}
        className="w-full relative min-h-[64px] bg-[#0f0f12] text-[#f3e9d2] border border-[#f3e9d2]/30 rounded-2xl flex items-center justify-between overflow-hidden group hover:rotate-1 hover:-translate-y-1 transition-all duration-200 select-none shadow-[0_8px_24px_rgba(0,0,0,0.6)]"
      >
        {/* Notched Semicircle Cutouts */}
        <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#09090b] border border-[#f3e9d2]/30" />
        <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#09090b] border border-[#f3e9d2]/30" />

        <div className="pl-6 pr-4 py-3 flex items-center gap-3.5 min-w-0 flex-1">
          {renderLogoChip("border border-[#e4572e]")}
          <div className="min-w-0 flex-1">
            <span
              className="text-sm sm:text-base font-bold uppercase tracking-wider block truncate text-[#f3e9d2] group-hover:text-[#e4572e] transition-colors"
              style={{ fontFamily: "'Anton', sans-serif" }}
            >
              {link.title}
            </span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#a89f8b]">
              ROW {seatRow} • SEAT {seatNum}
            </span>
          </div>
        </div>

        {/* Perforated Vertical Divider */}
        <div className="h-full border-l-2 border-dashed border-[#f3e9d2]/25 mx-2" />

        {/* Stub Barcode Side */}
        <div className="pr-6 pl-3 py-3 shrink-0 flex flex-col items-center justify-center text-[#e4572e]">
          <span className="text-[9px] font-mono font-bold tracking-widest uppercase mb-1">
            ADMIT
          </span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </a>
    );
  }

  // 4. VINYL: Tracklist row (A1, A2) with equalizer visualizer on hover
  if (themeId === "vinyl") {
    const trackLabel = `A${index + 1}`;
    return (
      <a
        href={isDemo ? "#" : link.url}
        target={isDemo ? undefined : "_blank"}
        rel={isDemo ? undefined : "noopener noreferrer"}
        onClick={handleClick}
        className="w-full min-h-[58px] px-4 py-2.5 rounded-xl bg-[#f1e6d0] border-2 border-[#111111] shadow-[3px_3px_0_#111111] hover:bg-[#ff6b1a] hover:text-[#ffffff] hover:border-[#111111] transition-all duration-150 flex items-center justify-between group select-none text-[#111111]"
      >
        <div className="flex items-center gap-3.5 min-w-0 flex-1 mr-3">
          <span className="text-xs font-mono font-bold tracking-wider text-[#111111] group-hover:text-[#ffffff] shrink-0 w-6">
            {trackLabel}.
          </span>
          {renderLogoChip("border border-[#111111]")}
          <div className="min-w-0 flex-1">
            <span
              className="text-sm sm:text-base font-bold leading-tight block truncate text-current"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {link.title}
            </span>
            <span className="text-[10px] font-mono opacity-80 uppercase block truncate">
              SIDE A • {platform?.name || "AUDIO / LINK"}
            </span>
          </div>
        </div>

        {/* 3 Equalizer Bars on Hover */}
        <div className="flex items-end gap-1 h-5 shrink-0 pl-2">
          <span className="w-1 bg-[#111111] group-hover:bg-[#ffffff] h-2 group-hover:h-5 transition-all duration-150 rounded-full animate-pulse" />
          <span className="w-1 bg-[#111111] group-hover:bg-[#ffffff] h-4 group-hover:h-3 transition-all duration-200 rounded-full animate-pulse delay-75" />
          <span className="w-1 bg-[#111111] group-hover:bg-[#ffffff] h-3 group-hover:h-4 transition-all duration-150 rounded-full animate-pulse delay-150" />
        </div>
      </a>
    );
  }

  // 5. POSTAGE: Scalloped airmail stamp with denomination in the corner
  if (themeId === "postage") {
    return (
      <a
        href={isDemo ? "#" : link.url}
        target={isDemo ? undefined : "_blank"}
        rel={isDemo ? undefined : "noopener noreferrer"}
        onClick={handleClick}
        className="w-full p-4 rounded-xl bg-[#f5efe2] border-2 border-[#1d4e89] shadow-[3px_3px_0_#d62839] hover:-translate-y-1 hover:rotate-1 transition-all duration-150 flex flex-col items-center justify-center text-center relative group select-none text-[#1c1c1c]"
      >
        {/* Corner Airmail Denomination */}
        <div className="absolute top-2 right-2 text-[10px] font-mono font-bold text-[#d62839]">
          ${(index + 1) * 25}¢
        </div>

        <div className="my-1">
          {renderLogoChip("border-2 border-[#1d4e89] mx-auto")}
        </div>

        <h4
          className="text-sm sm:text-base font-bold text-[#1c1c1c] leading-tight mt-2 line-clamp-2"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          {link.title}
        </h4>

        <span className="text-[10px] font-mono tracking-wider text-[#1d4e89] uppercase mt-1">
          AIR MAIL • PAR AVION
        </span>
      </a>
    );
  }

  // 6. GOTHIC: Engraved plaque with notched corners and gold flourishes
  if (themeId === "gothic") {
    return (
      <a
        href={isDemo ? "#" : link.url}
        target={isDemo ? undefined : "_blank"}
        rel={isDemo ? undefined : "noopener noreferrer"}
        onClick={handleClick}
        className="w-full min-h-[60px] px-5 py-3 rounded-none bg-[#0a0908] border border-[#b08d57] text-[#e9e0cf] hover:border-[#9b1d20] hover:bg-[#140b0c] transition-all duration-200 flex items-center justify-between group select-none shadow-[0_4px_16px_rgba(0,0,0,0.8)] relative"
      >
        {/* Corner Gold Notches */}
        <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-[#b08d57] group-hover:border-[#9b1d20] transition-colors" />
        <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-[#b08d57] group-hover:border-[#9b1d20] transition-colors" />
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-[#b08d57] group-hover:border-[#9b1d20] transition-colors" />
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-[#b08d57] group-hover:border-[#9b1d20] transition-colors" />

        <div className="flex items-center gap-4 min-w-0 flex-1 mr-3">
          {renderLogoChip("border border-[#b08d57] rounded-none")}
          <div className="min-w-0 flex-1">
            <span
              className="text-base sm:text-lg font-bold block truncate tracking-wide text-[#e9e0cf] group-hover:text-[#ffffff] transition-colors"
              style={{ fontFamily: "'Pirata One', cursive" }}
            >
              {link.title}
            </span>
            <div className="h-[1px] w-12 bg-[#9b1d20] mt-0.5 group-hover:w-full transition-all duration-300" />
          </div>
        </div>

        <span
          className="text-lg text-[#b08d57] group-hover:text-[#9b1d20] transition-colors"
          style={{ fontFamily: "'Pirata One', cursive" }}
        >
          †
        </span>
      </a>
    );
  }

  // 7. STICKER BOMB: Die-cut sticker with thick white outline & rotated slap
  if (themeId === "sticker-bomb") {
    const stickerColors = ["#ffd23f", "#ff5d8f", "#3ddc97", "#4cc9f0"];
    const stickerBg = stickerColors[index % stickerColors.length];
    const rot = (index % 2 === 0 ? 1 : -1) * (1.5 + (index % 3) * 0.8);

    return (
      <a
        href={isDemo ? "#" : link.url}
        target={isDemo ? undefined : "_blank"}
        rel={isDemo ? undefined : "noopener noreferrer"}
        onClick={handleClick}
        className="w-full p-3.5 rounded-2xl border-[3px] border-white shadow-[0_6px_0px_rgba(0,0,0,0.4)] hover:shadow-[0_8px_0px_rgba(0,0,0,0.5)] hover:rotate-0 hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between select-none text-[#18181b]"
        style={{
          backgroundColor: stickerBg,
          transform: `rotate(${rot}deg)`,
        }}
      >
        <div className="flex items-center justify-between">
          {renderLogoChip("border-2 border-white rounded-2xl shadow-sm")}
          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-white/80 text-[#18181b]">
            ★ PEEL
          </span>
        </div>

        <h3
          className="text-base sm:text-lg font-extrabold leading-tight mt-3 line-clamp-2 tracking-tight text-[#18181b]"
          style={{ fontFamily: "'Bagel Fat One', cursive" }}
        >
          {link.title}
        </h3>
      </a>
    );
  }

  // 8. ARCHIVE: Index library card with tabs & typed call number
  if (themeId === "archive") {
    const callNum = `00${index + 1}.${(index + 3) * 12}`;
    return (
      <a
        href={isDemo ? "#" : link.url}
        target={isDemo ? undefined : "_blank"}
        rel={isDemo ? undefined : "noopener noreferrer"}
        onClick={handleClick}
        className="w-full min-h-[62px] p-3 rounded-lg bg-[#f3ead6] border-2 border-[#cfc1aa] shadow-[2px_3px_0_#2a1d14] hover:-translate-y-2 hover:shadow-[4px_6px_0_#2a1d14] transition-all duration-200 flex items-center justify-between group select-none text-[#1b1b1b] relative overflow-hidden"
      >
        {/* Top Red & Blue Ruled Lines */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#c1403a]" />
        <div className="absolute top-[4px] left-0 right-0 h-[1px] bg-[#6fa1c9]/40" />

        <div className="flex items-center gap-3.5 min-w-0 flex-1 mr-3 mt-1">
          {renderLogoChip("border border-[#1b1b1b]")}
          <div className="min-w-0 flex-1">
            <span
              className="text-sm sm:text-base font-bold leading-tight block truncate text-[#1b1b1b] group-hover:text-[#c1403a] transition-colors"
              style={{ fontFamily: "'Courier Prime', monospace" }}
            >
              {link.title}
            </span>
            <span className="text-[10px] font-mono tracking-widest text-[#453f38] uppercase block">
              CALL NO. {callNum}
            </span>
          </div>
        </div>

        <span className="text-xs font-mono font-bold text-[#c1403a] shrink-0 pr-1 group-hover:translate-x-1 transition-transform">
          [PULL]
        </span>
      </a>
    );
  }

  // 9. TRUCK ART: Painted signboard plaque with scalloped ends & marigold border
  if (themeId === "truck-art") {
    return (
      <a
        href={isDemo ? "#" : link.url}
        target={isDemo ? undefined : "_blank"}
        rel={isDemo ? undefined : "noopener noreferrer"}
        onClick={handleClick}
        className="w-full min-h-[62px] px-4 py-2.5 rounded-2xl bg-[#fff4d6] border-[3px] border-[#f9a602] shadow-[0_5px_0_#d81b60] hover:shadow-[0_8px_0_#d81b60] hover:-translate-y-1 transition-all duration-200 flex items-center justify-between group select-none text-[#0e0e0e]"
      >
        <div className="flex items-center gap-3.5 min-w-0 flex-1 mr-3">
          {renderLogoChip("border-2 border-[#d81b60] shadow-sm")}
          <div className="min-w-0 flex-1">
            <span
              className="text-base sm:text-lg font-bold leading-tight block truncate text-[#0e0e0e] group-hover:text-[#d81b60] transition-colors"
              style={{ fontFamily: "'Yatra One', cursive" }}
            >
              {link.title}
            </span>
            <span className="text-[10px] font-bold text-[#00897b] tracking-wider uppercase block">
              ★ SHUBH LABH ★
            </span>
          </div>
        </div>

        <div className="shrink-0 flex items-center gap-1 text-[#d81b60]">
          <span className="text-xs font-bold font-mono">देखे</span>
          <ArrowUpRight className="w-4 h-4 group-hover:rotate-45 transition-transform" />
        </div>
      </a>
    );
  }

  // 10. DECO: Chamfered emerald bar with thin gold outline & chevron ornament
  if (themeId === "deco") {
    return (
      <a
        href={isDemo ? "#" : link.url}
        target={isDemo ? undefined : "_blank"}
        rel={isDemo ? undefined : "noopener noreferrer"}
        onClick={handleClick}
        className="w-full min-h-[60px] px-5 py-3 rounded-none bg-[#07110e] border border-[#d4af37] shadow-[0_4px_16px_rgba(0,0,0,0.6)] hover:bg-[#0f3b2e] hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all duration-200 flex items-center justify-between group select-none text-[#f2e2b3]"
        style={{
          clipPath: "polygon(10px 0, calc(100% - 10px) 0, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0 calc(100% - 10px), 0 10px)",
        }}
      >
        <div className="flex items-center gap-4 min-w-0 flex-1 mr-3">
          {renderLogoChip("border border-[#d4af37] rounded-none")}
          <div className="min-w-0 flex-1">
            <span
              className="text-base sm:text-lg font-normal tracking-wider block truncate text-[#f2e2b3] group-hover:text-[#ffffff] transition-colors"
              style={{ fontFamily: "'Poiret One', cursive" }}
            >
              {link.title}
            </span>
            <span className="text-[9px] font-mono tracking-[0.2em] uppercase text-[#d4af37]">
              DELUXE EDITION
            </span>
          </div>
        </div>

        <div className="shrink-0 flex items-center gap-1 text-[#d4af37]">
          <span className="text-sm">◆</span>
          <span className="text-sm group-hover:translate-x-1 transition-transform">›</span>
        </div>
      </a>
    );
  }

  // 11. RISO: Two-color risograph print block with 3px offset misregistration shadow
  if (themeId === "riso") {
    const isPinkBlock = index % 2 === 0;
    const blockBg = isPinkBlock ? "#ff48b0" : "#0078bf";
    const shadowColor = isPinkBlock ? "#0078bf" : "#ff48b0";
    const textColor = isPinkBlock ? "#1a1a1a" : "#ffffff";

    return (
      <a
        href={isDemo ? "#" : link.url}
        target={isDemo ? undefined : "_blank"}
        rel={isDemo ? undefined : "noopener noreferrer"}
        onClick={handleClick}
        className="w-full min-h-[60px] p-3 rounded-none border-2 border-[#1a1a1a] transition-all duration-150 flex items-center justify-between group select-none"
        style={{
          backgroundColor: blockBg,
          color: textColor,
          boxShadow: `4px 4px 0px ${shadowColor}`,
        }}
      >
        <div className="flex items-center gap-3.5 min-w-0 flex-1 mr-3">
          {renderLogoChip("border-2 border-[#1a1a1a]")}
          <div className="min-w-0 flex-1">
            <span
              className="text-sm sm:text-base font-extrabold uppercase tracking-tight block truncate"
              style={{ fontFamily: "'Archivo Black', sans-serif" }}
            >
              {link.title}
            </span>
            <span className="text-[10px] font-mono uppercase tracking-wider opacity-85 block truncate">
              INK PLATE {isPinkBlock ? "P-01 (MAGENTA)" : "P-02 (CYAN)"}
            </span>
          </div>
        </div>

        <span className="text-xs font-mono font-bold border-2 border-[#1a1a1a] px-2 py-0.5 bg-white text-[#1a1a1a] shrink-0 group-hover:translate-x-1 transition-transform">
          OPEN
        </span>
      </a>
    );
  }

  // 12. Y2K CHROME: Glossy liquid chrome capsule with bevel & glint
  if (themeId === "y2k-chrome") {
    return (
      <a
        href={isDemo ? "#" : link.url}
        target={isDemo ? undefined : "_blank"}
        rel={isDemo ? undefined : "noopener noreferrer"}
        onClick={handleClick}
        className="w-full min-h-[62px] px-5 py-3 rounded-full bg-gradient-to-b from-[#ffffff] via-[#e6e8f0] to-[#b0b5c8] border-2 border-white/80 shadow-[0_8px_20px_rgba(0,0,0,0.5),inset_0_2px_4px_rgba(255,255,255,0.9)] hover:shadow-[0_0_25px_rgba(61,90,254,0.6)] hover:scale-[1.01] transition-all duration-200 flex items-center justify-between group select-none text-[#0b0b1e] relative overflow-hidden"
      >
        {/* Subtle Glint Arc */}
        <div className="absolute top-0 left-0 right-0 h-[45%] bg-gradient-to-b from-white/70 to-transparent pointer-events-none rounded-t-full" />

        <div className="flex items-center gap-3.5 min-w-0 flex-1 mr-3 relative z-10">
          {renderLogoChip("border-2 border-white shadow-md")}
          <div className="min-w-0 flex-1">
            <span
              className="text-sm sm:text-base font-bold tracking-tight block truncate text-[#0b0b1e] group-hover:text-[#3d5afe] transition-colors"
              style={{ fontFamily: "'Unbounded', sans-serif" }}
            >
              {link.title}
            </span>
            <span className="text-[9px] font-mono tracking-widest text-[#3d5afe] uppercase font-bold block">
              // HYPERLINK.0{index + 1}
            </span>
          </div>
        </div>

        <div className="relative z-10 w-7 h-7 rounded-full bg-white flex items-center justify-center text-[#3d5afe] shrink-0 shadow-xs group-hover:translate-x-1 transition-transform">
          <ArrowRight className="w-3.5 h-3.5" strokeWidth={3} />
        </div>
      </a>
    );
  }

  return null;
}
