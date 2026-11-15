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
      title: "Profile Not Found | Linklet",
    };
  }

  const { profile } = data;
  const title = profile.display_name || `@${profile.username}`;
  const description = profile.bio || `Explore ${title}'s links and portfolio on Linklet.`;
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
    <div className="min-h-screen flex flex-col justify-between items-center px-6 py-16 bg-[var(--color-heritage-deep)] text-[var(--color-text-offwhite)] font-body selection:bg-[#0a3d7a] selection:text-[#d0f600]">
      <PageViewTracker username={profile.username} />

      {/* Floating Sound Control */}
      <div className="fixed top-6 right-6 z-40">
        <SoundToggle />
      </div>

      {/* Main Profile Canvas */}
      <main className="w-full max-w-md mx-auto flex flex-col items-center">
        {/* Status Message */}
        <SpeechBubble
          message={profile.status_message}
          styleType={profile.status_style}
        />

        {/* Avatar */}
        <div className="relative mb-5">
          {profile.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={profile.display_name || profile.username}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover ring-1 ring-[var(--border-soft)]"
            />
          ) : (
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center text-3xl font-heading font-medium bg-[#002e62] text-[var(--color-text-offwhite)] ring-1 ring-[var(--border-soft)]">
              {profile.display_name?.charAt(0) || profile.username.charAt(0)}
            </div>
          )}
        </div>

        {/* Display Name & Handle */}
        <h1 className="text-3xl sm:text-4xl font-heading font-medium tracking-tight text-center text-[var(--color-text-offwhite)]">
          {profile.display_name || `@${profile.username}`}
        </h1>
        {profile.display_name && (
          <p className="text-xs mt-1 tracking-[0.12em] text-[var(--color-text-muted)] font-body">
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
        <div className="w-full space-y-3 mt-8">
          {links.length === 0 ? (
            <div className="py-12 text-center opacity-60 rounded-[12px] border border-dashed border-[var(--border-soft)]">
              <p className="text-sm font-medium text-[var(--color-text-offwhite)] font-body">
                No links shared yet.
              </p>
            </div>
          ) : (
            links.map((link) => (
              <PublicLinkButton key={link.id} link={link} />
            ))
          )}
        </div>

        {/* Featured Trio Spotlight */}
        {profile.featured_creators && profile.featured_creators.length > 0 && (
          <FeaturedCreators
            creators={profile.featured_creators}
            className="mt-8"
          />
        )}
      </main>

      {/* Footer Colophon */}
      <footer className="mt-20 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs tracking-wider transition-colors border border-[var(--border-soft)] bg-[#00224a] text-[var(--color-text-muted)] hover:border-[#d0f600] hover:text-white"
        >
          <BrandLogo className="w-3.5 h-3.5" />
          <span className="font-heading font-medium tracking-tight text-[var(--color-text-offwhite)]">
            Linklet
          </span>
          <span className="text-[var(--color-text-subtle)]">&mdash;</span>
          <span className="text-[11px] font-body text-[var(--color-text-muted)]">
            Create your profile &rarr;
          </span>
        </Link>
      </footer>
    </div>
  );
}
