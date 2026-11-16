import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isProTheme } from "@/lib/themes";
import { checkRateLimit, getClientIp } from "@/lib/security";

export async function PATCH(req: NextRequest) {
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

    // Rate Limiting: Max 30 profile updates per minute per user
    const clientIp = getClientIp(req);
    const rate = checkRateLimit(`rate:profile_patch:${user.id}:${clientIp}`, 30, 60000);
    if (!rate.isAllowed) {
      return NextResponse.json(
        { error: "Too many updates. Please wait a moment before saving again." },
        { status: 429, headers: { "Retry-After": String(Math.ceil(rate.resetMs / 1000)) } }
      );
    }

    const { data: currentRawProfile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    const { unpackProfile } = await import("@/lib/profile-utils");
    const currentProfile = unpackProfile(currentRawProfile);
    const isPro = currentProfile?.plan === "pro";
    const body = await req.json().catch(() => ({}));

    // SECURITY: Strip protected subscription fields so client can never change them
    delete body.plan;
    delete body.plan_status;
    delete body.billing_interval;
    delete body.current_period_end;
    delete body.provider_customer_id;
    delete body.provider_subscription_id;

    // Enforce Pro Theme Rule on Server
    if (!isPro && body.theme && isProTheme(body.theme)) {
      return NextResponse.json(
        {
          error: `The theme "${body.theme}" requires a Pro subscription. Free accounts can use the Cassette theme.`,
          code: "UPGRADE_REQUIRED",
        },
        { status: 403 }
      );
    }

    // Enforce Spotlight Rule on Server
    if (!isPro && body.spotlight_enabled === true) {
      return NextResponse.json(
        {
          error: "Interactive Spotlight requires a Pro subscription.",
          code: "UPGRADE_REQUIRED",
        },
        { status: 403 }
      );
    }

    const updatePayload: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    // Strict input length validation
    if (body.display_name !== undefined) {
      updatePayload.display_name = String(body.display_name || "").trim().slice(0, 60);
    }
    if (body.bio !== undefined) {
      updatePayload.bio = String(body.bio || "").trim().slice(0, 300);
    }
    if (body.avatar_url !== undefined) {
      const avatar = String(body.avatar_url || "");
      if (avatar.startsWith("data:image/") || avatar.startsWith("https://") || avatar === "") {
        if (avatar.length <= 600000) {
          updatePayload.avatar_url = avatar;
        }
      }
    }
    if (body.theme !== undefined) {
      updatePayload.theme = String(body.theme).trim().slice(0, 40).replace(/[^a-zA-Z0-9_-]/g, "");
    }
    if (body.spotlight_enabled !== undefined) {
      updatePayload.spotlight_enabled = Boolean(body.spotlight_enabled);
    }
    if (body.status_message !== undefined) {
      updatePayload.status_message = String(body.status_message || "").trim().slice(0, 100);
    }
    if (body.status_style !== undefined) {
      const allowedStyles = ["cloud", "dot", "sparkle"];
      updatePayload.status_style = allowedStyles.includes(body.status_style) ? body.status_style : "cloud";
    }
    if (body.featured_creators !== undefined && Array.isArray(body.featured_creators)) {
      updatePayload.featured_creators = body.featured_creators.slice(0, 6);
    }

    const { data: updated, error: updateError } = await supabase
      .from("profiles")
      .update(updatePayload)
      .eq("id", user.id)
      .select()
      .single();

    if (updateError) {
      console.error("Supabase profile update error:", updateError);
      return NextResponse.json({ error: "Failed to update profile. Please try again." }, { status: 500 });
    }

    return NextResponse.json({ profile: updated });
  } catch (err: any) {
    console.error("API profile update error:", err);
    return NextResponse.json({ error: "Failed to update profile. Please try again." }, { status: 500 });
  }
}
