import { NextRequest, NextResponse } from "next/server";
import { isAuthorizedAdmin } from "@/lib/admin-auth";
import { createAdminSupabaseClient, createServerSupabaseClient } from "@/lib/supabase/server";
import { packProfileUpdates, unpackProfile } from "@/lib/profile-utils";

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

    const supabaseAdmin = createAdminSupabaseClient() || (await createServerSupabaseClient());
    if (!supabaseAdmin) {
      return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
    }

    // 1. Fetch current profile
    const { data: existingProfile, error: fetchErr } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (fetchErr || !existingProfile) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const currentProfile = unpackProfile(existingProfile);

    // 2. Pack updates using metadata storage into bio
    const { dbPayload, updatedProfile } = packProfileUpdates({ plan }, currentProfile);

    const { error: updateErr } = await supabaseAdmin
      .from("profiles")
      .update(dbPayload)
      .eq("id", userId);

    if (updateErr) {
      console.error("Admin toggle-pro error:", updateErr);
      return NextResponse.json({ error: "Failed to update user plan" }, { status: 500 });
    }

    return NextResponse.json({ ok: true, user: updatedProfile });
  } catch (err: any) {
    console.error("Admin toggle-pro error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
