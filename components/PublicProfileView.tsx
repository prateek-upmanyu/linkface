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

  // Sync with studio edits from localStorage on this device
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

  const visibleLinks = links.filter((l) => l.is_visible);
  const initials = (profile.display_name || profile.username || "U")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div
      className="min-h-screen bg-[#FFFDF9] text-[#18181B] flex flex-col justify-between items-center px-4 sm:px-6 py-12 sm:py-16 selection:bg-[#F9E79F] selection:text-[#18181B]"
      style={{
        background: "radial-gradient(circle at 50% 0%, rgba(249, 231, 159, 0.35) 0%, transparent 60%), #FFFDF9",
      }}
    >
      <PageViewTracker username={profile.username} />

      {/* Floating Sound Control */}
      <div className="fixed top-5 right-5 z-40">
        <SoundToggle />
      </div>

      {/* Centered Column Max 480px */}
      <main className="w-full max-w-[480px] mx-auto flex flex-col items-center">
        {/* Status / Speech Bubble */}
        <SpeechBubble
          message={profile.status_message}
          styleType={profile.status_style}
        />

        {/* 96px Avatar with Vibrant Sunlit Ring */}
        <div className="relative mb-4">
          {profile.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={profile.display_name || profile.username}
              className="w-24 h-24 rounded-full object-cover ring-2 ring-[#F39C12] p-0.5 shadow-md"
            />
          ) : (
            <div className="w-24 h-24 rounded-full flex items-center justify-center font-heading text-3xl font-bold bg-gradient-to-tr from-[#F39C12] to-[#F4D03F] text-white ring-2 ring-[#F39C12] shadow-md">
              {initials}
            </div>
          )}
        </div>

        {/* Name in Bold Instrument Serif */}
        <h1 className="font-heading text-3xl sm:text-4xl font-bold leading-tight tracking-tight text-[#18181B] text-center">
          {profile.display_name || profile.username}
        </h1>

        {/* Handle */}
        <p className="mt-1 text-xs font-mono font-bold text-[#F39C12] tracking-wide text-center">
          @{(profile.username || "").split("@")[0].replace(/[^a-z0-9_]/gi, "").toLowerCase()}
        </p>

        {/* Bio in Crisp Inter */}
        {profile.bio && (
          <p className="mt-2.5 text-sm font-body font-medium text-[#4B5563] leading-relaxed max-w-[380px] text-center line-clamp-3">
            {profile.bio}
          </p>
        )}

        {/* Links Stack */}
        <div className="w-full space-y-2.5 mt-7">
          {visibleLinks.length === 0 ? (
            <div className="py-12 text-center rounded-[14px] border border-dashed border-[#E5E7EB] bg-white">
              <p className="text-xs text-[#9CA3AF] font-body font-medium">No links published yet.</p>
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

        {/* Featured Collaborators */}
        <FeaturedCreators
          creators={profile.featured_creators}
          themeId={profile.theme}
        />
      </main>

      {/* Footer */}
      <footer className="mt-12 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-body font-bold text-[#9CA3AF] hover:text-[#E67E22] transition-colors"
        >
          <BrandLogo className="w-4 h-4 shadow-none" />
          <span>Made with Linklet</span>
        </Link>
      </footer>
    </div>
  );
}
