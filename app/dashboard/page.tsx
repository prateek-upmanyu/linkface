import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { DashboardClient } from "./DashboardClient";
import { DEMO_PROFILE, DEMO_LINKS } from "@/lib/demo-data";
import { Profile, LinkItem } from "@/types";
import { unpackProfile } from "@/lib/profile-utils";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Dashboard | LinkinBio",
  description: "Manage your links, profile, theme, and view analytics.",
};

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient();

  // If Supabase is not configured yet, provide seamless demo mode
  if (!supabase) {
    return (
      <DashboardClient
        initialProfile={DEMO_PROFILE}
        initialLinks={DEMO_LINKS}
        isDemoMode={true}
      />
    );
  }

  // Check authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch user profile
  let { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  // If no profile exists yet, auto-create one seamlessly so user is NEVER bounced or stuck
  if (!profile) {
    const rawName = user.user_metadata?.full_name || user.user_metadata?.name || "";
    let desiredUsername = user.email
      ? user.email.split("@")[0].replace(/[^a-zA-Z0-9_]/g, "").toLowerCase().slice(0, 20)
      : `user_${user.id.slice(0, 6)}`;

    if (!desiredUsername || desiredUsername.length < 3) {
      desiredUsername = `user_${user.id.slice(0, 6)}`;
    }

    // Check if username is taken, if so append random suffix
    const { data: taken } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", desiredUsername)
      .neq("id", user.id)
      .maybeSingle();

    if (taken) {
      desiredUsername = `${desiredUsername}_${user.id.slice(0, 4)}`;
    }

    const { createAdminSupabaseClient } = await import("@/lib/supabase/server");
    const dbClient = createAdminSupabaseClient() || supabase;

    const { data: newProfile } = await dbClient
      .from("profiles")
      .upsert(
        {
          id: user.id,
          username: desiredUsername,
          display_name: rawName || desiredUsername,
          avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture || null,
          theme: "notebook",
        },
        { onConflict: "id" }
      )
      .select()
      .maybeSingle();

    if (newProfile) {
      profile = newProfile;
    }
  }

  if (!profile || !profile.username) {
    // Fallback only if database could not be written
    redirect("/onboarding");
  }

  // Fetch user links ordered by position
  const { data: links } = await supabase
    .from("links")
    .select("*")
    .eq("user_id", user.id)
    .order("position", { ascending: true });

  const rawLinks = (links || []).map((l: any) => ({
    ...l,
    custom_icon: l.custom_icon || (l.platform?.startsWith("custom:") ? l.platform.slice(7) : null),
    platform: l.platform?.startsWith("custom:") ? null : l.platform,
  }));

  const hydratedProfile = unpackProfile(profile);

  return (
    <DashboardClient
      initialProfile={hydratedProfile}
      initialLinks={rawLinks as LinkItem[]}
      isDemoMode={false}
    />
  );
}
