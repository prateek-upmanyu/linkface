"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Profile, LinkItem } from "@/types";
import { PublicLinkButton } from "@/components/PublicLinkButton";
import { SpeechBubble } from "@/components/SpeechBubble";
import { FeaturedCreators } from "@/components/FeaturedCreators";
import { SoundToggle } from "@/components/SoundToggle";
import { PageViewTracker } from "@/components/PageViewTracker";
import { BrandLogo } from "@/components/BrandLogo";
import { getTheme } from "@/lib/themes";

interface PublicProfileViewProps {
  initialProfile: Profile;
  initialLinks: LinkItem[];
}

export function PublicProfileView({
  initialProfile,
  initialLinks,
}: PublicProfileViewProps) {
  const [profile, setProfile] = useState<Profile>(initialProfile);
  const [links, setLinks] = useState<LinkItem[]>(initialLinks);

  // Sync with latest studio edits from localStorage on this device
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const cachedProfile = localStorage.getItem(`linklet_profile_${initialProfile.username}`);
        if (cachedProfile) {
          const parsed = JSON.parse(cachedProfile);
          if (parsed && typeof parsed === "object") {
            setProfile((prev) => ({ ...prev, ...parsed }));
          }
        }

        const cachedLinks = localStorage.getItem(`linklet_links_${initialProfile.username}`);
        if (cachedLinks) {
          const parsed = JSON.parse(cachedLinks);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setLinks(parsed);
          }
        }
      } catch (err) {
        console.error("Local sync hydration error:", err);
      }
    }
  }, [initialProfile.username]);

  const theme = getTheme(profile.theme);

  // Dynamic typography & surface styling per theme
  // 1. APPLE MODERN: San Francisco + #1D1D1F / #F5F5F7 / #007AFF
  let titleClass =
    "font-[-apple-system,BlinkMacSystemFont,'SF_Pro_Display','SF_Pro','Helvetica_Neue',sans-serif] text-2xl sm:text-3xl font-semibold tracking-tight text-[#F5F5F7]";
  let bioClass = "font-[-apple-system,sans-serif] text-xs sm:text-sm text-[#AAAAAA]";
  let avatarRing = "ring-2 ring-[#AAAAAA]/30 shadow-[0_0_24px_rgba(0,122,255,0.25)]";
  let bgClass = "bg-[#1D1D1F] text-[#F5F5F7]";

  // 2. BMW: Helvetica Bold + #000000 / #4AA5D2 / #FFFFFF
  if (theme.id === "bmw") {
    titleClass =
      "font-['Helvetica_Neue',Helvetica,Arial,sans-serif] text-xl sm:text-2xl font-bold tracking-tight uppercase text-[#FFFFFF]";
    bioClass = "font-['Helvetica_Neue',Helvetica,Arial,sans-serif] text-xs sm:text-sm text-[#4AA5D2]/80";
    avatarRing = "ring-2 ring-[#4AA5D2] shadow-[0_0_30px_rgba(74,165,210,0.5)]";
    bgClass = "bg-[#000000] text-[#FFFFFF]";
  } else if (theme.id === "minecraft") {
    titleClass =
      "font-['Silkscreen',monospace] text-base sm:text-lg font-bold tracking-widest uppercase text-white drop-shadow-[2px_2px_0px_#000]";
    bioClass = "font-['Silkscreen',monospace] text-xs text-[#aaaaaa]";
    avatarRing = "border-2 border-[#55FF55] rounded-none";
    bgClass = "bg-[#141416] text-[#e0e0e0]";
  }

  const visibleLinks = links.filter((l) => l.is_visible);

  return (
    <div
      className={`min-h-screen flex flex-col justify-between items-center px-4 py-10 sm:py-16 transition-colors duration-200 ${bgClass}`}
    >
      <PageViewTracker username={profile.username} />

      {/* Floating Sound Control */}
      <div className="fixed top-5 right-5 z-40">
        <SoundToggle />
      </div>

      {/* Main Profile Canvas */}
      <main className="w-full max-w-md mx-auto flex flex-col items-center">
        {/* Status / Floating Message Bubble */}
        <SpeechBubble
          message={profile.status_message}
          styleType={profile.status_style}
        />

        {/* Profile Avatar */}
        <div className="relative mb-4">
          {profile.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={profile.display_name || profile.username}
              className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover ${avatarRing}`}
            />
          ) : (
            <div
              className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center text-3xl font-semibold bg-white/10 text-white ${avatarRing}`}
            >
              {profile.display_name?.charAt(0) || profile.username?.charAt(0)}
            </div>
          )}
        </div>

        {/* Display Name ONLY - No redundant email handle beneath it */}
        <h1 className={`text-center leading-tight ${titleClass}`}>
          {profile.display_name || profile.username}
        </h1>

        {/* Bio */}
        {profile.bio && (
          <p className={`text-center max-w-sm mt-2.5 leading-relaxed ${bioClass}`}>
            {profile.bio}
          </p>
        )}

        {/* Links Stack */}
        <div className="w-full space-y-3 mt-7">
          {visibleLinks.length === 0 ? (
            <div className="py-10 text-center opacity-60 rounded-[14px] border border-dashed border-white/15">
              <p className="text-xs text-white">No links shared yet.</p>
            </div>
          ) : (
            visibleLinks.map((link) => (
              <PublicLinkButton
                key={link.id}
                link={link}
                themeId={profile.theme}
              />
            ))
          )}
        </div>

        {/* Featured Spotlight (1, 2, or 3 collaborators) - Always invoked; FeaturedCreators hides automatically if empty */}
        <FeaturedCreators
          creators={profile.featured_creators}
          themeId={profile.theme}
          className="mt-6"
        />
      </main>

      {/* Clean Minimal Footer */}
      <footer className="mt-16 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-medium tracking-wide transition-colors border border-white/10 bg-white/[0.04] text-white/60 hover:text-white hover:border-white/20"
        >
          <BrandLogo className="w-3.5 h-3.5" />
          <span>Linklet</span>
        </Link>
      </footer>
    </div>
  );
}
