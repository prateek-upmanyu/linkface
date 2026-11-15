import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { sanitizeAndValidateUrl, checkRateLimit, getClientIp } from "@/lib/security";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: "Database service temporarily unavailable." }, { status: 503 });
    }

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized. Please sign in." }, { status: 401 });
    }

    // Rate Limiting: Max 30 link creations per minute per user
    const clientIp = getClientIp(req);
    const rate = checkRateLimit(`rate:links_post:${user.id}:${clientIp}`, 30, 60000);
    if (!rate.isAllowed) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a moment before creating more links." },
        { status: 429, headers: { "Retry-After": String(Math.ceil(rate.resetMs / 1000)) } }
      );
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
      console.error("Count links verification error:", countError);
      return NextResponse.json({ error: "Failed to verify link limit." }, { status: 500 });
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
      return NextResponse.json({ error: validation.error || "Invalid destination URL." }, { status: 400 });
    }

    // Strict input length validation
    const cleanTitle = (title ? String(title) : "My Link").trim().slice(0, 100);
    const cleanPlatform = platform ? String(platform).trim().slice(0, 40) : null;
    const cleanBadge = badge ? String(badge).trim().slice(0, 20) : null;

    // Validate custom icon: Must be valid data URI or image URL under 600KB
    let validCustomIcon: string | null = null;
    if (custom_icon && typeof custom_icon === "string") {
      if (custom_icon.startsWith("data:image/") || custom_icon.startsWith("https://")) {
        if (custom_icon.length <= 600000) {
          validCustomIcon = custom_icon;
        }
      }
    }

    const insertPayload: any = {
      user_id: user.id,
      url: validation.sanitizedUrl,
      title: cleanTitle,
      platform: cleanPlatform,
      position: currentCount,
      is_visible: true,
      badge: cleanBadge,
      custom_icon: validCustomIcon,
    };

    let { data, error } = await supabase.from("links").insert(insertPayload).select().single();

    if (error && error.message?.toLowerCase().includes("custom_icon")) {
      delete insertPayload.custom_icon;
      const retry = await supabase.from("links").insert(insertPayload).select().single();
      data = retry.data;
      error = retry.error;
    }

    if (error) {
      console.error("Supabase link insert error:", error);
      return NextResponse.json({ error: "Failed to save link. Please try again." }, { status: 500 });
    }

    return NextResponse.json({ link: data });
  } catch (err: any) {
    console.error("API link create error:", err);
    return NextResponse.json({ error: "Failed to create link. Please try again." }, { status: 500 });
  }
}
