import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { DEMO_PROFILE, DEMO_LINKS } from "@/lib/demo-data";
import { THEMES } from "@/lib/themes";
import { PublicLinkButton } from "@/components/PublicLinkButton";
import { PageViewTracker } from "@/components/PageViewTracker";
import { Profile, LinkItem } from "@/types";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ username: string }>;
}

async function getProfileAndLinks(rawUsername: string) {
  const username = rawUsername.toLowerCase().trim();

  // If Supabase client can be initialized
  const supabase = await createServerSupabaseClient();
  if (supabase) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("username", username)
      .single();

    if (profile) {
      const { data: links } = await supabase
        .from("links")
        .select("*")
        .eq("user_id", profile.id)
        .eq("is_visible", true)
        .order("position", { ascending: true });

      return {
        profile: profile as Profile,
        links: (links as LinkItem[]) || [],
      };
    }
  }

  // Demo user showcase fallback
  if (username === "alex" || username === "demo") {
    return {
      profile: DEMO_PROFILE,
      links: DEMO_LINKS,
    };
  }

  return null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username } = await params;
  const data = await getProfileAndLinks(username);

  if (!data) {
    return {
      title: "Page Not Found | LinkinBio",
      description: "The requested link-in-bio page does not exist.",
    };
  }

  const { profile } = data;
  const title = profile.display_name
    ? `${profile.display_name} (@${profile.username})`
    : `@${profile.username}`;
  const description =
    profile.bio || `Explore all links and social platforms for @${profile.username}.`;

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  return {
    title: `${title} | LinkinBio`,
    description,
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${profile.username}`,
      siteName: "LinkinBio",
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
  const theme = THEMES[profile.theme] || THEMES.light;

  return (
    <div
      className={`min-h-screen flex flex-col justify-between items-center px-4 py-12 transition-colors duration-300 ${theme.background}`}
    >
      <PageViewTracker username={profile.username} />

      {/* Main Container */}
      <main className="w-full max-w-md mx-auto flex flex-col items-center">
        {/* Avatar */}
        <div className="relative mb-4">
          {profile.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={profile.display_name || profile.username}
              className={`w-24 h-24 sm:w-28 sm:h-28 ${
                theme.avatarRing.includes("rounded-none") ? "rounded-none" : "rounded-full"
              } object-cover ${theme.avatarRing}`}
            />
          ) : (
            <div
              className={`w-24 h-24 sm:w-28 sm:h-28 ${
                theme.avatarRing.includes("rounded-none") ? "rounded-none" : "rounded-full"
              } bg-neutral-800 text-white flex items-center justify-center text-3xl font-bold uppercase ${theme.avatarRing}`}
            >
              {profile.display_name?.charAt(0) || profile.username.charAt(0)}
            </div>
          )}
        </div>

        {/* Display Name & Handle */}
        <h1 className={`text-2xl font-bold tracking-tight text-center ${theme.textPrimary}`}>
          {profile.display_name || `@${profile.username}`}
        </h1>
        {profile.display_name && (
          <p className={`text-sm mt-0.5 ${theme.textSecondary}`}>
            @{profile.username}
          </p>
        )}

        {/* Bio */}
        {profile.bio && (
          <p
            className={`text-sm text-center max-w-sm mt-3 leading-relaxed ${theme.textSecondary}`}
          >
            {profile.bio}
          </p>
        )}

        {/* Links Stack */}
        <div className="w-full space-y-3.5 mt-8">
          {links.length === 0 ? (
            <div className="py-12 text-center opacity-60">
              <p className="text-sm font-medium">No public links shared yet.</p>
            </div>
          ) : (
            links.map((link) => (
              <PublicLinkButton
                key={link.id}
                link={link}
                themeCardClass={theme.card}
                themeCardHoverClass={theme.cardHover}
                themeButtonShadow={theme.buttonShadow}
              />
            ))
          )}
        </div>
      </main>

      {/* Footer Branding Badge */}
      <footer className="mt-16 text-center">
        <Link
          href="/"
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all duration-150 hover:opacity-100 ${theme.badge} opacity-75 shadow-xs`}
        >
          <span>LinkinBio</span>
          <span className="opacity-40 text-[10px]">&bull;</span>
          <span className="opacity-70 text-[11px]">Create your own</span>
        </Link>
      </footer>
    </div>
  );
}
