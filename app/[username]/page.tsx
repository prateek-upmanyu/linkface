import { Metadata } from "next";
import { notFound } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { DEMO_PROFILE, DEMO_LINKS } from "@/lib/demo-data";
import { PublicProfileView } from "@/components/PublicProfileView";
import { Profile, LinkItem } from "@/types";

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

        return {
          profile,
          links: links || [],
        };
      }
    }
  } catch (err) {
    console.error("Error fetching profile from Supabase:", err);
  }

  // 2. Fallback for demo user 'alex' if no database record exists
  if (cleanUsername === "alex") {
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

  return (
    <PublicProfileView
      initialProfile={profile}
      initialLinks={links}
    />
  );
}
