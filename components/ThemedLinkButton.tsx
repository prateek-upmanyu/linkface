"use client";

import React, { useState } from "react";
import { LinkItem } from "@/types";
import { PLATFORMS } from "@/lib/platforms";
import { PlatformIcon } from "@/components/PlatformIcon";
import { playClickSound } from "@/lib/sound-fx";
import { ProfileThemeId, getProfileTheme } from "@/lib/profile-themes-config";
import { ArrowRight, ArrowUpRight, Star } from "lucide-react";

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

  // Dedicated Platform Chip: 44-50px Solid Contrasting Chip in Real Brand Colors (Strict Standard)
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

  // 1. CASSETTE (Free): Mini cassette tape link with reel chip on left, track code, colored stripe
  if (themeId === "cassette") {
    const trackCode = `A${index + 1}`;
    return (
      <a
        href={isDemo ? "#" : link.url}
        target={isDemo ? undefined : "_blank"}
        rel={isDemo ? undefined : "noopener noreferrer"}
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="w-full min-h-[62px] rounded-xl bg-[#f0e6cf] border-2 border-[#1a1a1a] shadow-[0_4px_0_#1a1a1a] hover:shadow-[0_6px_0_#1a1a1a] hover:-translate-y-0.5 transition-all duration-150 flex flex-col justify-between overflow-hidden group select-none text-[#1a1a1a]"
      >
        <div className="p-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {/* Reel style logo chip */}
            {renderLogoChip("border-2 border-[#1a1a1a] rounded-full")}
            <div className="min-w-0 flex-1">
              <span
                className="text-sm sm:text-base font-bold uppercase tracking-tight block truncate text-[#1a1a1a]"
                style={{ fontFamily: "'DM Mono', monospace" }}
              >
                {link.title}
              </span>
              <span className="text-[10px] font-mono tracking-wider text-[#524d45] uppercase block truncate">
                TAPE #{trackCode} • {platform?.name || "SIDE A TRACK"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0 pr-1">
            <span className="text-[11px] font-mono font-bold text-[#f26b21] uppercase">PLAY</span>
            <ArrowRight className="w-4 h-4 text-[#1a1a1a] group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Bottom Dual Color Magnetic Tape Stripe */}
        <div className="h-1.5 w-full flex">
          <div className="h-full flex-1 bg-[#f26b21]" />
          <div className="h-full flex-1 bg-[#2a9d8f]" />
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

  // 3. VINYL: Tracklist row (A1, A2) with equalizer visualizer on hover
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

  // 4. POSTAGE: Scalloped airmail stamp with denomination in the corner
  if (themeId === "postage") {
    return (
      <a
        href={isDemo ? "#" : link.url}
        target={isDemo ? undefined : "_blank"}
        rel={isDemo ? undefined : "noopener noreferrer"}
        onClick={handleClick}
        className="w-full p-4 rounded-xl bg-[#f5efe2] border-2 border-[#1d4e89] shadow-[3px_3px_0_#d62839] hover:-translate-y-1 hover:rotate-1 transition-all duration-150 flex flex-col items-center justify-center text-center relative group select-none text-[#1c1c1c]"
      >
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

  // 5. STICKER BOMB: Die-cut sticker with thick white outline & rotated slap
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

  // 6. ARCHIVE: Index library card with tabs & typed call number
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

  // 7. TRUCK ART: Painted signboard plaque with scalloped ends & marigold border
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

  // 8. RISO: Two-color risograph print block with 3px offset misregistration shadow
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

  // 9. COMIC (NEW): Pop-art panel with thick border (3px), hard offset shadow 4px, action tag "GO!"
  if (themeId === "comic") {
    const friendlyWords = ["GO!", "WOW!", "NEW!", "YES!"];
    const actionWord = friendlyWords[index % friendlyWords.length];

    return (
      <a
        href={isDemo ? "#" : link.url}
        target={isDemo ? undefined : "_blank"}
        rel={isDemo ? undefined : "noopener noreferrer"}
        onClick={handleClick}
        className="w-full min-h-[64px] p-3.5 rounded-2xl bg-[#fff8e7] border-[3px] border-[#111111] shadow-[4px_4px_0_#111111] hover:shadow-[6px_6px_0_#111111] hover:-translate-y-1 transition-all duration-150 flex items-center justify-between group select-none text-[#111111]"
      >
        <div className="flex items-center gap-3.5 min-w-0 flex-1 mr-2">
          {renderLogoChip("border-2 border-[#111111]")}
          <div className="min-w-0 flex-1">
            <span
              className="text-base sm:text-lg font-bold tracking-wide uppercase leading-tight block truncate group-hover:text-[#e63946] transition-colors"
              style={{ fontFamily: "'Bangers', cursive" }}
            >
              {link.title}
            </span>
            <span className="text-[11px] font-bold text-[#1d70f5] uppercase block truncate" style={{ fontFamily: "'Comic Neue', cursive" }}>
              PANEL #{index + 1} • {platform?.name || "ADVENTURE"}
            </span>
          </div>
        </div>

        <div className="shrink-0 px-2.5 py-1 rounded-lg bg-[#ffd400] border-2 border-[#111111] shadow-[2px_2px_0_#111111] rotate-[-2deg] group-hover:rotate-0 transition-transform">
          <span
            className="text-xs sm:text-sm font-black text-[#111111] uppercase tracking-wider block"
            style={{ fontFamily: "'Bangers', cursive" }}
          >
            {actionWord}
          </span>
        </div>
      </a>
    );
  }

  // 10. BAUHAUS (NEW): Bold rectangles in alternating red, yellow, blue, black with hard shift shadow
  if (themeId === "bauhaus") {
    const colors = [
      { bg: "#d7261e", text: "#ffffff" },
      { bg: "#f2b705", text: "#151515" },
      { bg: "#1f4fa3", text: "#ffffff" },
      { bg: "#151515", text: "#ffffff" },
    ];
    const c = colors[index % colors.length];

    return (
      <a
        href={isDemo ? "#" : link.url}
        target={isDemo ? undefined : "_blank"}
        rel={isDemo ? undefined : "noopener noreferrer"}
        onClick={handleClick}
        className="w-full min-h-[60px] p-3.5 rounded-none border-[3px] border-[#151515] shadow-[4px_4px_0_#151515] hover:shadow-[6px_6px_0_#151515] hover:-translate-x-1 hover:-translate-y-1 transition-all duration-150 flex items-center justify-between group select-none"
        style={{
          backgroundColor: c.bg,
          color: c.text,
        }}
      >
        <div className="flex items-center gap-3.5 min-w-0 flex-1 mr-3">
          {renderLogoChip("border-2 border-[#151515] rounded-none")}
          <div className="min-w-0 flex-1">
            <span
              className="text-sm sm:text-base font-black uppercase tracking-wider block truncate"
              style={{ fontFamily: "'Jost', sans-serif" }}
            >
              {link.title}
            </span>
            <span className="text-[10px] font-mono tracking-widest uppercase opacity-85 block truncate">
              FORM + FUNCTION • NO. 0{index + 1}
            </span>
          </div>
        </div>

        <div className="w-7 h-7 bg-white text-[#151515] border-2 border-[#151515] flex items-center justify-center shrink-0 group-hover:rotate-45 transition-transform">
          <ArrowRight className="w-4 h-4 stroke-[3]" />
        </div>
      </a>
    );
  }

  // 11. STAR CHART (NEW): Observatory celestial frame with thin ticks, off-white label, coordinate "N 01"
  if (themeId === "star-chart") {
    const coord = `N 0${index + 1}° ${((index + 2) * 14) % 60}'`;

    return (
      <a
        href={isDemo ? "#" : link.url}
        target={isDemo ? undefined : "_blank"}
        rel={isDemo ? undefined : "noopener noreferrer"}
        onClick={handleClick}
        className="w-full min-h-[60px] p-3 rounded-lg bg-[#0e1630]/80 border border-[#9fb4e8]/40 hover:border-[#e6c36a] shadow-[0_4px_16px_rgba(7,11,24,0.6)] hover:shadow-[0_0_20px_rgba(230,195,106,0.3)] transition-all duration-200 flex items-center justify-between group select-none text-[#eef1fa] relative"
      >
        {/* Subtle Frame Corner Ticks */}
        <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-[#e6c36a]" />
        <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-[#e6c36a]" />
        <div className="absolute bottom-0 left-0 w-1.5 h-1.5 border-b border-l border-[#e6c36a]" />
        <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-[#e6c36a]" />

        <div className="flex items-center gap-3.5 min-w-0 flex-1 mr-3">
          {renderLogoChip("border border-[#e6c36a]/50 rounded-full")}
          <div className="min-w-0 flex-1">
            <span
              className="text-sm sm:text-base font-semibold tracking-wider block truncate text-[#eef1fa] group-hover:text-[#e6c36a] transition-colors"
              style={{ fontFamily: "'Josefin Sans', sans-serif" }}
            >
              {link.title}
            </span>
            <span className="text-[10px] font-mono tracking-widest text-[#9fb4e8] uppercase block truncate">
              SECTOR • {coord}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0 text-[#e6c36a] font-mono text-xs">
          <span className="text-[10px] opacity-75">{coord.split(" ")[0]}</span>
          <Star className="w-3.5 h-3.5 fill-[#e6c36a]" />
        </div>
      </a>
    );
  }

  // 12. PAPERCUT (NEW): Layered paper strip with irregular cut edges (clip-path), paper-white fill, soft stacked shadow
  if (themeId === "papercut") {
    const cutAngles = [
      "polygon(0% 2px, 100% 0%, 100% calc(100% - 2px), 0% 100%)",
      "polygon(0% 0%, 100% 3px, 100% 100%, 0% calc(100% - 3px))",
      "polygon(0% 1px, 100% 0%, 100% 100%, 0% calc(100% - 2px))",
    ];
    const cut = cutAngles[index % cutAngles.length];

    return (
      <a
        href={isDemo ? "#" : link.url}
        target={isDemo ? undefined : "_blank"}
        rel={isDemo ? undefined : "noopener noreferrer"}
        onClick={handleClick}
        className="w-full min-h-[62px] p-3.5 bg-[#fffdf7] text-[#1b1b2f] shadow-[0_8px_16px_rgba(0,0,0,0.35)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.5)] hover:-translate-y-1 transition-all duration-200 flex items-center justify-between group select-none relative"
        style={{
          clipPath: cut,
        }}
      >
        <div className="flex items-center gap-3.5 min-w-0 flex-1 mr-3">
          {renderLogoChip("border-2 border-[#ef476f] rounded-full")}
          <div className="min-w-0 flex-1">
            <span
              className="text-base sm:text-lg font-bold leading-tight block truncate text-[#1b1b2f] group-hover:text-[#ef476f] transition-colors"
              style={{ fontFamily: "'Fredoka', cursive, sans-serif" }}
            >
              {link.title}
            </span>
            <span className="text-[11px] font-semibold text-[#118ab2] block truncate">
              LAYER #{index + 1} • {platform?.name || "PAPER LINK"}
            </span>
          </div>
        </div>

        <div className="w-7 h-7 rounded-full bg-[#ef476f] text-white flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
          <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
        </div>
      </a>
    );
  }

  return null;
}
