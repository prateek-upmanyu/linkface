import { Metadata } from "next";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { DEMO_PROFILE, DEMO_LINKS } from "@/lib/demo-data";
import { PublicProfileView } from "@/components/PublicProfileView";
import { UnclaimedProfileView } from "@/components/UnclaimedProfileView";
import { Profile, LinkItem } from "@/types";
import { unpackProfile } from "@/lib/profile-utils";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface PageProps {
  params: Promise<{
    username: string;
  }>;
}

// Fetch user profile and visible links
async function getProfileAndLinks(
  username: string
): Promise<{ profile: Profile; links: LinkItem[] } | null> {
  const cleanUsername = username.toLowerCase().trim();

  // 1. Attempt fetching from Supabase first
  try {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("username", cleanUsername)
        .single();

      if (profile && !profileError) {
        const { data: links } = await supabase
          .from("links")
          .select("*")
          .eq("user_id", profile.id)
          .eq("is_visible", true)
          .order("position", { ascending: true });

        const unpacked = unpackProfile(profile);
        const isPro = unpacked.plan === "pro";
        const rawLinks = (links || []).map((l: any) => ({
          ...l,
          custom_icon: l.custom_icon || (l.platform?.startsWith("custom:") ? l.platform.slice(7) : null),
          platform: l.platform?.startsWith("custom:") ? null : l.platform,
        }));
        const displayedLinks = isPro ? rawLinks : rawLinks.slice(0, 3);
        const safeProfile: Profile = {
          ...unpacked,
          theme: isPro
            ? unpacked.theme
            : ["notebook", "pastel", "console"].includes(unpacked.theme)
            ? unpacked.theme
            : "notebook",
          spotlight_enabled: isPro ? unpacked.spotlight_enabled : false,
        };

        return {
          profile: safeProfile,
          links: displayedLinks,
        };
      }
    }
  } catch (err) {
    console.error("Error fetching profile from Supabase:", err);
  }

  // 2. Fallback for demo sample users ('alex' or 'demo') if no database record exists
  if (cleanUsername === "alex" || cleanUsername === "demo") {
    return {
      profile: DEMO_PROFILE,
      links: DEMO_LINKS,
    };
  }

  return null;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { username } = await params;
  const data = await getProfileAndLinks(username);

  if (!data) {
    return {
      title: "Profile Not Found | Linkface",
    };
  }

  const { profile } = data;
  const title = profile.display_name || `@${profile.username}`;
  const description =
    profile.bio || `Explore ${title}'s curated link collection on Linkface.`;

  return {
    title: `${title} | Linkface`,
    description,
    openGraph: {
      title: `${title} | Linkface`,
      description,
      images: profile.avatar_url ? [{ url: profile.avatar_url }] : [],
    },
    twitter: {
      card: "summary",
      title: `${title} | Linkface`,
      description,
      images: profile.avatar_url ? [profile.avatar_url] : [],
    },
  };
}

export default async function UserProfilePage({ params }: PageProps) {
  const { username } = await params;
  const data = await getProfileAndLinks(username);

  if (!data) {
    return <UnclaimedProfileView username={username} />;
  }

  const { profile, links } = data;

  return (
    <PublicProfileView
      initialProfile={profile}
      initialLinks={links}
    />
  );
}
