import { NextRequest, NextResponse } from "next/server";
import { isAuthorizedAdmin } from "@/lib/admin-auth";
import { createAdminSupabaseClient, createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  try {
    // 1. Check if user is signed in as admin email
    let userEmail: string | null = null;
    try {
      const supabaseUser = await createServerSupabaseClient();
      if (supabaseUser) {
        const { data: { user } } = await supabaseUser.auth.getUser();
        userEmail = user?.email || null;
      }
    } catch {
      // Continue to cookie check
    }

    const authorized = await isAuthorizedAdmin(userEmail);
    if (!authorized) {
      return NextResponse.json({ error: "Unauthorized access to admin console." }, { status: 401 });
    }

    const supabaseAdmin = createAdminSupabaseClient();
    if (!supabaseAdmin) {
      return NextResponse.json({ error: "Admin database service unavailable." }, { status: 503 });
    }

    // 2. Fetch profiles
    const { data: profiles, error: profileErr } = await supabaseAdmin
      .from("profiles")
      .select("id, username, display_name, avatar_url, plan, plan_status, billing_interval, created_at, updated_at, theme")
      .order("created_at", { ascending: false });

    if (profileErr) {
      console.error("Admin fetch profiles error:", profileErr);
      return NextResponse.json({ error: "Failed to load profiles" }, { status: 500 });
    }

    // 3. Fetch links summary
    const { data: links, error: linkErr } = await supabaseAdmin
      .from("links")
      .select("id, user_id, clicks, is_visible");

    const linksList = links || [];
    const profilesList = profiles || [];

    // Map link count and clicks per user
    const linkCountByUser: Record<string, number> = {};
    const clicksByUser: Record<string, number> = {};
    let totalClicks = 0;

    for (const l of linksList) {
      linkCountByUser[l.user_id] = (linkCountByUser[l.user_id] || 0) + 1;
      const c = Number(l.clicks) || 0;
      clicksByUser[l.user_id] = (clicksByUser[l.user_id] || 0) + c;
      totalClicks += c;
    }

    const totalUsers = profilesList.length;
    const proUsers = profilesList.filter((p) => p.plan === "pro").length;
    const freeUsers = totalUsers - proUsers;
    const totalLinks = linksList.length;
    const estimatedMRR = proUsers * 3; // $3/month approx

    const enrichedUsers = profilesList.map((p) => ({
      ...p,
      link_count: linkCountByUser[p.id] || 0,
      total_clicks: clicksByUser[p.id] || 0,
    }));

    return NextResponse.json({
      stats: {
        totalUsers,
        proUsers,
        freeUsers,
        totalLinks,
        totalClicks,
        estimatedMRR,
      },
      users: enrichedUsers,
    });
  } catch (err: any) {
    console.error("Admin data error:", err);
    return NextResponse.json({ error: "Failed to load admin metrics." }, { status: 500 });
  }
}
