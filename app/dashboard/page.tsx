import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { DashboardClient } from "./DashboardClient";
import { DEMO_PROFILE, DEMO_LINKS } from "@/lib/demo-data";
import { Profile, LinkItem } from "@/types";

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
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile || !profile.username) {
    // Redirect to onboarding to pick unique username
    redirect("/onboarding");
  }

  // Fetch user links ordered by position
  const { data: links } = await supabase
    .from("links")
    .select("*")
    .eq("user_id", user.id)
    .order("position", { ascending: true });

  return (
    <DashboardClient
      initialProfile={profile as Profile}
      initialLinks={(links as LinkItem[]) || []}
      isDemoMode={false}
    />
  );
}
