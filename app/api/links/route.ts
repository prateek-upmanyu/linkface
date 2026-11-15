import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { sanitizeAndValidateUrl } from "@/lib/security";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: "Database service unavailable" }, { status: 503 });
    }

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. Fetch user profile to check subscription plan
    const { data: profile } = await supabase
      .from("profiles")
      .select("plan")
      .eq("id", user.id)
      .single();

    const isPro = profile?.plan === "pro";

    // 2. Count existing links
    const { count, error: countError } = await supabase
      .from("links")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    if (countError) {
      return NextResponse.json({ error: "Failed to verify link limit" }, { status: 500 });
    }

    const currentCount = count || 0;

    // 3. Server-side Free Plan Enforce: Max 3 links
    if (!isPro && currentCount >= 3) {
      return NextResponse.json(
        {
          error: "Free plan is limited to 3 links. Please upgrade to Pro for unlimited links.",
          code: "UPGRADE_REQUIRED",
          limit: 3,
        },
        { status: 403 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const { url, title, platform, badge, custom_icon } = body;

    const validation = sanitizeAndValidateUrl(url);
    if (!validation.isValid) {
      return NextResponse.json({ error: validation.error || "Invalid destination URL" }, { status: 400 });
    }

    const insertPayload: any = {
      user_id: user.id,
      url: validation.sanitizedUrl,
      title: (title || "My Link").trim().slice(0, 100),
      platform: platform || null,
      position: currentCount,
      is_visible: true,
      badge: badge ? String(badge).trim().slice(0, 20) : null,
      custom_icon: custom_icon || null,
    };

    let { data, error } = await supabase.from("links").insert(insertPayload).select().single();

    if (error && error.message?.toLowerCase().includes("custom_icon")) {
      delete insertPayload.custom_icon;
      const retry = await supabase.from("links").insert(insertPayload).select().single();
      data = retry.data;
      error = retry.error;
    }

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ link: data });
  } catch (err: any) {
    console.error("API link create error:", err);
    return NextResponse.json({ error: err.message || "Failed to create link" }, { status: 500 });
  }
}
