import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { DEMO_PROFILE, DEMO_LINKS } from "@/lib/demo-data";
import { PublicLinkButton } from "@/components/PublicLinkButton";
import { SpeechBubble } from "@/components/SpeechBubble";
import { FeaturedCreators } from "@/components/FeaturedCreators";
import { PageViewTracker } from "@/components/PageViewTracker";
import { SoundToggle } from "@/components/SoundToggle";
import { AmbientParticles } from "@/components/AmbientParticles";
import { BrandLogo } from "@/components/BrandLogo";

interface PageProps {
  params: Promise<{ username: string }>;
}

async function getProfileAndLinks(username: string) {
  const cleanUsername = username.toLowerCase().trim();

  // 1. Check for built-in demo profile "alex"
  if (cleanUsername === "alex") {
    return {
      profile: DEMO_PROFILE,
      links: DEMO_LINKS,
    };
  }

  // 2. Query Supabase
  try {
    const supabase = await createServerSupabaseClient();
    if (!supabase) return null;

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("username", cleanUsername)
      .single();

    if (profileError || !profile) {
      return null;
    }

    const { data: links, error: linksError } = await supabase
      .from("links")
      .select("*")
      .eq("user_id", profile.id)
      .eq("is_visible", true)
      .order("position", { ascending: true });

    if (linksError) {
      console.error("Error fetching links:", linksError);
    }

    return {
      profile,
      links: links || [],
    };
  } catch (err) {
    console.error("Unexpected error in getProfileAndLinks:", err);
    return null;
  }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { username } = await params;
  const data = await getProfileAndLinks(username);

  if (!data) {
    return {
      title: "User Not Found | Linklet",
    };
  }

  const { profile } = data;
  const title = profile.display_name || `@${profile.username}`;
  const description = profile.bio || `Check out ${title}'s links and updates on Linklet.`;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://linklet.bio";

  return {
    title: `${title} | Linklet`,
    description,
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${profile.username}`,
      siteName: "Linklet",
      images: profile.avatar_url
        ? [
            {
              url: profile.avatar_url,
              width: 800,
              height: 800,
              alt: title,
            },
          ]
        : [],
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: profile.avatar_url ? [profile.avatar_url] : [],
    },
  };
}

export default async function PublicProfilePage({ params }: PageProps) {
  const { username } = await params;
  const data = await getProfileAndLinks(username);

  if (!data) {
    notFound();
  }

  const { profile, links } = data;

  return (
    <div
      className="min-h-screen flex flex-col justify-between items-center px-4 py-12 transition-colors duration-300 relative overflow-hidden bg-[var(--color-heritage-deep)] text-[var(--color-text-offwhite)] font-body"
    >
      <PageViewTracker username={profile.username} />
      <AmbientParticles />

      {/* Floating Sound Toggle */}
      <div className="fixed top-4 right-4 z-40">
        <SoundToggle />
      </div>

      {/* Main Container */}
      <main className="w-full max-w-md mx-auto flex flex-col items-center relative z-10">
        {/* Floating Speech/Cloud Bubble Message */}
        <SpeechBubble
          message={profile.status_message}
          styleType={profile.status_style}
        />

        {/* Avatar */}
        <div className="relative mb-4">
          {profile.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={profile.display_name || profile.username}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover ring-1 ring-[var(--border-soft)] shadow-md"
            />
          ) : (
            <div
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center text-3xl font-heading font-medium bg-[#002e62] text-[var(--color-text-offwhite)] ring-1 ring-[var(--border-soft)] shadow-md"
            >
              {profile.display_name?.charAt(0) || profile.username.charAt(0)}
            </div>
          )}
        </div>

        {/* Display Name & Handle */}
        <h1 className="text-3xl sm:text-4xl font-heading font-medium tracking-tight text-center text-[var(--color-text-offwhite)]">
          {profile.display_name || `@${profile.username}`}
        </h1>
        {profile.display_name && (
          <p className="text-xs mt-1 tracking-wider text-[var(--color-text-muted)] font-body">
            @{profile.username}
          </p>
        )}

        {/* Bio */}
        {profile.bio && (
          <p className="text-xs sm:text-sm text-center max-w-sm mt-3 leading-relaxed text-[var(--color-text-muted)] font-body">
            {profile.bio}
          </p>
        )}

        {/* Links Stack */}
        <div className="w-full space-y-3.5 mt-8">
          {links.length === 0 ? (
            <div className="py-12 text-center opacity-60 rounded-2xl border border-dashed border-[var(--border-soft)]">
              <p className="text-sm font-medium text-[var(--color-text-offwhite)] font-body">
                No public links shared yet.
              </p>
            </div>
          ) : (
            links.map((link) => (
              <PublicLinkButton
                key={link.id}
                link={link}
              />
            ))
          )}
        </div>

        {/* Featured Trio Spotlight (Sponsors / Collaborators) */}
        {profile.featured_creators && profile.featured_creators.length > 0 && (
          <FeaturedCreators
            creators={profile.featured_creators}
            className="mt-8"
          />
        )}
      </main>

      {/* Footer Branding Badge */}
      <footer className="mt-16 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs tracking-wide transition-all duration-200 hover:scale-105 backdrop-blur-md group border border-[var(--border-soft)] bg-[#002e62]/90 text-[var(--color-text-muted)] shadow-[var(--shadow-card)] hover:border-[#d0f600]"
        >
          <BrandLogo className="w-4 h-4" />
          <span className="font-heading font-semibold tracking-wider text-xs text-[var(--color-text-offwhite)]">
            Linklet
          </span>
          <span className="text-[var(--color-text-subtle)] text-[10px]">&bull;</span>
          <span className="text-xs font-body transition-colors text-[var(--color-text-muted)] group-hover:text-[var(--color-text-offwhite)]">
            Create yours free
          </span>
        </Link>
      </footer>
    </div>
  );
}
