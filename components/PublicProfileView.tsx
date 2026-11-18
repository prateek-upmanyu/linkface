"use client";

import React, { useEffect, useState } from "react";
import { Profile, LinkItem } from "@/types";
import { getTheme, isProTheme } from "@/lib/themes";
import { isNewProfileTheme, ProfileThemeId } from "@/lib/profile-themes-config";
import { ThemedPublicProfileView } from "@/components/ThemedPublicProfileView";
import { PublicLinkButton } from "@/components/PublicLinkButton";
import { PageViewTracker } from "@/components/PageViewTracker";
import { SoundToggle } from "@/components/SoundToggle";
import { SpeechBubble } from "@/components/SpeechBubble";
import { FeaturedCreators } from "@/components/FeaturedCreators";
import { ProfileSpotlight } from "@/components/ProfileSpotlight";
import { BrandLogo } from "@/components/BrandLogo";
import Link from "next/link";

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

  // Keep state synchronized when server props revalidate
  useEffect(() => {
    setProfile(initialProfile);
  }, [initialProfile]);

  useEffect(() => {
    setLinks(initialLinks);
  }, [initialLinks]);

  const isPro = profile.plan === "pro";

  // Downgrade rules:
  // Free users are strictly restricted to "notebook", "pastel", or "console" (defaulting to "notebook").
  // Pro users unlock all 12 bespoke luxury themes + free themes.
  const activeThemeId = isPro
    ? (profile.theme || "notebook")
    : (profile.theme === "notebook" || profile.theme === "pastel" || profile.theme === "console")
    ? profile.theme
    : "notebook";

  // If one of the 12 bespoke themes is active, render via ThemedPublicProfileView
  if (isNewProfileTheme(activeThemeId)) {
    return (
      <>
        <PageViewTracker username={profile.username} />
        <ThemedPublicProfileView
          profile={profile}
          links={links}
          themeId={activeThemeId as ProfileThemeId}
        />
      </>
    );
  }

  const theme = getTheme(activeThemeId);

  // 2. Free users show max 3 links publicly (all others preserved safely in DB)
  const allVisibleLinks = links.filter((l) => l.is_visible);
  const displayedLinks = isPro ? allVisibleLinks : allVisibleLinks.slice(0, 3);

  const initials = (profile.display_name || profile.username || "U")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const cleanHandle = (profile.username || "").split("@")[0].replace(/[^a-z0-9_]/gi, "").toLowerCase();

  return (
    <div
      className="min-h-screen relative flex flex-col justify-between items-center px-4 sm:px-6 py-12 sm:py-16 selection:bg-[#c9a96a]/30 overflow-x-hidden font-body"
      style={{
        backgroundColor: theme.bg,
        color: theme.text,
        background: theme.bgTint ? `${theme.bgTint}, ${theme.bg}` : theme.bg,
      }}
    >
      <PageViewTracker username={profile.username} />

      {/* Interactive Cursor / Touch Spotlight (Pro only) */}
      {isPro && profile.spotlight_enabled && (
        <ProfileSpotlight accentColor={theme.accent} opacity={0.1} />
      )}

      {/* Floating Sound Control */}
      <div className="fixed top-5 right-5 z-40">
        <SoundToggle />
      </div>

      {/* Centered Column Max 480px, strictly z-10 above spotlight */}
      <main className="w-full max-w-[480px] mx-auto flex flex-col items-center relative z-10">
        {/* Status / Speech Bubble */}
        <SpeechBubble
          message={profile.status_message}
          styleType={profile.status_style}
        />

        {/* 96px Avatar with Theme Accent Ring */}
        <div className="relative mb-4">
          {profile.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={profile.display_name || profile.username}
              className="w-24 h-24 rounded-full object-cover p-0.5 shadow-md"
              style={{
                boxShadow: `0 0 0 2px ${theme.accent}`,
              }}
            />
          ) : (
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold shadow-md"
              style={{
                backgroundColor: theme.surfaceRaised,
                color: theme.accent,
                boxShadow: `0 0 0 2px ${theme.accent}`,
                fontFamily: theme.headingFontFamily,
              }}
            >
              {initials}
            </div>
          )}
        </div>

        {/* Display Name with Theme Heading Font */}
        <h1
          className="text-3xl sm:text-4xl font-normal leading-tight tracking-tight text-center break-words hyphens-auto max-w-full"
          style={{
            fontFamily: theme.headingFontFamily,
            color: theme.text,
          }}
        >
          {profile.display_name || profile.username}
        </h1>

        {/* Handle */}
        <p
          className="mt-1 text-xs font-mono font-semibold tracking-wide text-center"
          style={{ color: theme.accent }}
        >
          @{cleanHandle}
        </p>

        {/* Bio */}
        {profile.bio && (
          <p
            className="mt-2.5 text-sm font-medium leading-relaxed max-w-[380px] text-center line-clamp-3"
            style={{ color: theme.muted }}
          >
            {profile.bio}
          </p>
        )}

        {/* Links Stack */}
        <div className="w-full space-y-3 mt-7">
          {displayedLinks.length === 0 ? (
            <div
              className="py-12 text-center rounded-[14px] border border-dashed"
              style={{
                backgroundColor: theme.surface,
                borderColor: theme.border,
                color: theme.muted,
              }}
            >
              <p className="text-xs font-medium">No links published yet.</p>
            </div>
          ) : (
            displayedLinks.map((link) => (
              <PublicLinkButton
                key={link.id}
                link={link}
                themeConfig={theme}
              />
            ))
          )}
        </div>

        {/* Notice for Free users if extra links exist */}
        {!isPro && allVisibleLinks.length > 3 && (
          <p className="mt-4 text-[11px] text-center" style={{ color: theme.muted }}>
            Showing top 3 links on the Free plan.
          </p>
        )}

        {/* Spotlight Showcase */}
        <FeaturedCreators
          creators={profile.featured_creators}
          themeId={theme.id}
        />
      </main>

      {/* Minimal Footer */}
      <footer className="mt-12 text-center relative z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-medium transition-colors hover:opacity-100 opacity-60"
          style={{ color: theme.muted }}
        >
          <BrandLogo className="w-4 h-4 shadow-none" />
          <span>Made with Linkface</span>
        </Link>
      </footer>
    </div>
  );
}
