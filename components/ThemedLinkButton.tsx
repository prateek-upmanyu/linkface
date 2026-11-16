"use client";

import React, { useState } from "react";
import { LinkItem } from "@/types";
import { PLATFORMS } from "@/lib/platforms";
import { PlatformIcon } from "@/components/PlatformIcon";
import { playClickSound } from "@/lib/sound-fx";
import { ProfileThemeId, getProfileTheme } from "@/lib/profile-themes-config";
import { ArrowRight, ArrowUpRight, Leaf } from "lucide-react";

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
      keepalive: true,
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

  // 5. STICKER BOMB (FIXED):
  // Rule: every label and logo must contrast with its own sticker fill. Dark ink #111 on light fills (yellow, mint, sky).
  // Logo chips get a 2px dark ink border so they never blend into white outline or light fill.
  // Nothing sits white-on-white.
  if (themeId === "sticker-bomb") {
    const stickerPalette = [
      { bg: "#ffd23f", text: "#111111", tagBg: "#111111", tagText: "#ffd23f" }, // Vibrant yellow
      { bg: "#3ddc97", text: "#111111", tagBg: "#111111", tagText: "#3ddc97" }, // Mint
      { bg: "#4cc9f0", text: "#111111", tagBg: "#111111", tagText: "#4cc9f0" }, // Sky
      { bg: "#ff5d8f", text: "#ffffff", tagBg: "#ffffff", tagText: "#ff5d8f" }, // Deep pink (white text passes AA)
    ];
    const s = stickerPalette[index % stickerPalette.length];
    const rot = (index % 2 === 0 ? 1 : -1) * (1.5 + (index % 3) * 0.8);

    return (
      <a
        href={isDemo ? "#" : link.url}
        target={isDemo ? undefined : "_blank"}
        rel={isDemo ? undefined : "noopener noreferrer"}
        onClick={handleClick}
        className="w-full p-3.5 rounded-2xl border-[3px] border-white shadow-[0_6px_0px_rgba(0,0,0,0.5)] hover:shadow-[0_8px_0px_rgba(0,0,0,0.65)] hover:rotate-0 hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between select-none"
        style={{
          backgroundColor: s.bg,
          color: s.text,
          transform: `rotate(${rot}deg)`,
        }}
      >
        <div className="flex items-center justify-between mb-1">
          {/* Logo chip with solid 2px dark ink border to prevent white-on-white blending */}
          {renderLogoChip("border-2 border-[#111111] rounded-2xl shadow-sm")}
          <span
            className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full border border-[#111111] shadow-2xs tracking-wider"
            style={{
              backgroundColor: s.tagBg,
              color: s.tagText,
            }}
          >
            ★ STICKER
          </span>
        </div>

        <h3
          className="text-base sm:text-lg font-black leading-snug mt-3 mb-1 line-clamp-2 tracking-tight text-[#111111]"
          style={{
            fontFamily: "'Bagel Fat One', cursive",
            color: s.text,
            textShadow: s.text === "#ffffff" ? "0 1px 2px rgba(0,0,0,0.5)" : "none",
          }}
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

  // 9. COMIC: Pop-art panel with thick border (3.5px), hard offset shadow 4px, action tag "GO!"
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

  // 10. BAUHAUS: Bold rectangles in alternating red, yellow, blue, black with hard shift shadow
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

  // 11. HERBARIUM (Pro - NEW):
  // Cream rows with 1px hairline border, radius 6px, logo chip left in solid color circle, serif label, small botanical-name tag ("No. 01")
  if (themeId === "herbarium") {
    return (
      <a
        href={isDemo ? "#" : link.url}
        target={isDemo ? undefined : "_blank"}
        rel={isDemo ? undefined : "noopener noreferrer"}
        onClick={handleClick}
        className="w-full min-h-[60px] p-3 rounded-[6px] bg-[#fdfbf7] border border-[rgba(43,42,38,0.18)] hover:border-[#7a8f6b] shadow-2xs hover:shadow-[0_4px_16px_rgba(122,143,107,0.15)] hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-between group select-none text-[#2b2a26]"
      >
        <div className="flex items-center gap-3.5 min-w-0 flex-1 mr-3">
          {/* Logo chip in a solid color circle with 2px sage ring */}
          {renderLogoChip("border-2 border-[#7a8f6b] rounded-full")}
          <div className="min-w-0 flex-1">
            <span
              className="text-base sm:text-lg font-semibold leading-tight block truncate text-[#2b2a26] group-hover:text-[#7a8f6b] transition-colors"
              style={{ fontFamily: "'Lora', Georgia, serif" }}
            >
              {link.title}
            </span>
            <span
              className="text-[11px] font-medium text-[#5e5b52] block truncate"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {platform?.name || "Botanical Reference"}
            </span>
          </div>
        </div>

        <div className="shrink-0 flex items-center gap-1.5 pl-2">
          <span
            className="text-[10px] font-mono tracking-widest text-[#7a8f6b] uppercase"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            No. 0{index + 1}
          </span>
          <Leaf className="w-3.5 h-3.5 text-[#7a8f6b] group-hover:rotate-12 transition-transform" />
        </div>
      </a>
    );
  }

  // 12. PAPERCUT: Layered paper strip with irregular cut edges (clip-path), paper-white fill, soft stacked shadow
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
