import { NextRequest, NextResponse } from "next/server";
import { isAuthorizedAdmin } from "@/lib/admin-auth";
import { createAdminSupabaseClient, createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    let userEmail: string | null = null;
    try {
      const supabaseUser = await createServerSupabaseClient();
      if (supabaseUser) {
        const { data: { user } } = await supabaseUser.auth.getUser();
        userEmail = user?.email || null;
      }
    } catch {
      // Continue to header/cookie check
    }

    const authorized = await isAuthorizedAdmin(req, userEmail);
    if (!authorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { userId, plan } = body;

    if (!userId || !["free", "pro"].includes(plan)) {
      return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
    }

    const supabaseAdmin = createAdminSupabaseClient();
    if (!supabaseAdmin) {
      return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
    }

    const updatePayload: Record<string, any> = {
      plan,
      plan_status: plan === "pro" ? "active" : null,
      billing_interval: plan === "pro" ? "monthly" : null,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabaseAdmin
      .from("profiles")
      .update(updatePayload)
      .eq("id", userId)
      .select("id, username, plan, plan_status")
      .single();

    if (error) {
      console.error("Admin toggle-pro error:", error);
      return NextResponse.json({ error: "Failed to update user plan" }, { status: 500 });
    }

    return NextResponse.json({ ok: true, user: data });
  } catch (err: any) {
    console.error("Admin toggle-pro error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
