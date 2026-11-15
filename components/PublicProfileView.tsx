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

  const visibleLinks = links.filter((l) => l.is_visible);
  const initials = (profile.display_name || profile.username || "U")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="min-h-screen bg-[#0a0f1c] text-[#f5f1e8] flex flex-col justify-between items-center px-6 py-16 selection:bg-[#18223a] selection:text-[#c9a96a]">
      <PageViewTracker username={profile.username} />

      {/* Floating Sound Control (Subtle top right) */}
      <div className="fixed top-6 right-6 z-40">
        <SoundToggle />
      </div>

      {/* Centered Column Max 480px */}
      <main className="w-full max-w-[480px] mx-auto flex flex-col items-center">
        {/* Status / Speech Bubble */}
        <SpeechBubble
          message={profile.status_message}
          styleType={profile.status_style}
        />

        {/* 96px Avatar with 1px #c9a96a 40% border */}
        <div className="relative mb-5">
          {profile.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={profile.display_name || profile.username}
              className="w-24 h-24 rounded-full object-cover border border-[#c9a96a]/40"
            />
          ) : (
            <div className="w-24 h-24 rounded-full flex items-center justify-center font-heading text-3xl font-normal bg-[#121a2e] text-[#f5f1e8] border border-[#c9a96a]/40">
              {initials}
            </div>
          )}
        </div>

        {/* Name in Instrument Serif 32px */}
        <h1 className="font-heading text-[32px] font-normal leading-tight tracking-tight text-[#f5f1e8] text-center">
          {profile.display_name || profile.username}
        </h1>

        {/* Faint @handle below (NEVER showing raw email) */}
        <p className="mt-1 text-xs font-body text-[rgba(245,241,232,0.38)] tracking-wide text-center">
          @{profile.username}
        </p>

        {/* Bio in Inter 14px, muted, max 3 lines */}
        {profile.bio && (
          <p className="mt-3 text-sm font-body text-[rgba(245,241,232,0.62)] leading-relaxed max-w-[400px] text-center line-clamp-3">
            {profile.bio}
          </p>
        )}

        {/* Links Stack (56px tall buttons with #121a2e surface) */}
        <div className="w-full space-y-3 mt-8">
          {visibleLinks.length === 0 ? (
            <div className="py-12 text-center rounded-[12px] border border-dashed border-[rgba(245,241,232,0.12)]">
              <p className="text-xs text-[rgba(245,241,232,0.38)] font-body">No links published yet.</p>
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

      {/* Tiny Footer: 'Made with Linklet' in faint 12px Inter */}
      <footer className="mt-16 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-body text-[rgba(245,241,232,0.38)] hover:text-[#f5f1e8] transition-colors"
        >
          <BrandLogo className="w-3.5 h-3.5 opacity-60" />
          <span>Made with Linklet</span>
        </Link>
      </footer>
    </div>
  );
}
