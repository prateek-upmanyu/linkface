import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { DEMO_PROFILE, DEMO_LINKS } from "@/lib/demo-data";
import { PublicLinkButton } from "@/components/PublicLinkButton";
import { SpeechBubble } from "@/components/SpeechBubble";
import { FeaturedCreators } from "@/components/FeaturedCreators";
import { SoundToggle } from "@/components/SoundToggle";
import { PageViewTracker } from "@/components/PageViewTracker";
import { BrandLogo } from "@/components/BrandLogo";
import { Profile, LinkItem } from "@/types";
import { getTheme } from "@/lib/themes";

interface PageProps {
  params: Promise<{
    username: string;
  }>;
}

// Fetch user profile and visible links from Supabase
async function getProfileAndLinks(
  username: string
): Promise<{ profile: Profile; links: LinkItem[] } | null> {
  const cleanUsername = username.toLowerCase().trim();

  // Seamless fallback for demo user 'alex'
  if (cleanUsername === "alex") {
    return {
      profile: DEMO_PROFILE,
      links: DEMO_LINKS,
    };
  }

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
  const description =
    profile.bio || `Explore ${title}'s curated link collection on Linklet.`;

  return {
    title: `${title} | Linklet`,
    description,
    openGraph: {
      title: `${title} | Linklet`,
      description,
      images: profile.avatar_url ? [{ url: profile.avatar_url }] : [],
    },
    twitter: {
      card: "summary",
      title: `${title} | Linklet`,
      description,
      images: profile.avatar_url ? [profile.avatar_url] : [],
    },
  };
}

export default async function UserProfilePage({ params }: PageProps) {
  const { username } = await params;
  const data = await getProfileAndLinks(username);

  if (!data) {
    notFound();
  }

  const { profile, links } = data;
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
          {links.length === 0 ? (
            <div className="py-10 text-center opacity-60 rounded-[14px] border border-dashed border-white/15">
              <p className="text-xs text-white">No links shared yet.</p>
            </div>
          ) : (
            links.map((link) => (
              <PublicLinkButton
                key={link.id}
                link={link}
                themeId={profile.theme}
              />
            ))
          )}
        </div>

        {/* Featured Trio Spotlight */}
        {profile.featured_creators && profile.featured_creators.length > 0 && (
          <FeaturedCreators
            creators={profile.featured_creators}
            themeId={profile.theme}
            className="mt-6"
          />
        )}
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
