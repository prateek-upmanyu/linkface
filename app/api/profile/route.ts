import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isProTheme } from "@/lib/themes";
import { ThemeId } from "@/types";
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
      .maybeSingle();

    const { unpackProfile, packProfileUpdates } = await import("@/lib/profile-utils");
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
          error: `The theme "${body.theme}" requires a Pro subscription. Free accounts can choose between Notebook, Pastel, or Console.`,
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

    // Username validation and update
    let newUsername: string | undefined = undefined;
    if (body.username !== undefined) {
      const cleanUsername = String(body.username).toLowerCase().trim();
      if (cleanUsername !== currentProfile.username) {
        if (!/^[a-z0-9_]{3,30}$/.test(cleanUsername)) {
          return NextResponse.json(
            { error: "Username must be 3-30 characters long and contain only lowercase letters, numbers, and underscores." },
            { status: 400 }
          );
        }

        const RESERVED = [
          "admin", "api", "dashboard", "settings", "auth", "signup", "login",
          "onboarding", "pricing", "terms", "privacy", "help", "explore", "app"
        ];
        if (RESERVED.includes(cleanUsername)) {
          return NextResponse.json(
            { error: "This username is reserved. Please pick another." },
            { status: 400 }
          );
        }

        // Check if username is taken by another user
        const { data: existingUser } = await supabase
          .from("profiles")
          .select("id")
          .eq("username", cleanUsername)
          .neq("id", user.id)
          .maybeSingle();

        if (existingUser) {
          return NextResponse.json(
            { error: "This username is already taken. Please choose another." },
            { status: 409 }
          );
        }

        newUsername = cleanUsername;
      }
    }

    // Sanitize string inputs before packing
    const safeUpdates: Partial<typeof currentProfile> = {};
    if (newUsername !== undefined) safeUpdates.username = newUsername;
    if (body.display_name !== undefined) {
      safeUpdates.display_name = String(body.display_name || "").trim().slice(0, 60);
    }
    if (body.bio !== undefined) {
      safeUpdates.bio = String(body.bio || "").trim().slice(0, 300);
    }
    if (body.avatar_url !== undefined) {
      const avatar = body.avatar_url === null ? null : String(body.avatar_url || "");
      if (avatar === null || avatar === "" || avatar.startsWith("data:image/") || avatar.startsWith("https://")) {
        safeUpdates.avatar_url = avatar;
      }
    }
    if (body.theme !== undefined) {
      safeUpdates.theme = String(body.theme).trim().slice(0, 40).replace(/[^a-zA-Z0-9_-]/g, "") as ThemeId;
    }
    if (body.spotlight_enabled !== undefined) {
      safeUpdates.spotlight_enabled = Boolean(body.spotlight_enabled);
    }
    if (body.status_message !== undefined) {
      safeUpdates.status_message = String(body.status_message || "").trim().slice(0, 100);
    }
    if (body.status_style !== undefined) {
      const allowedStyles = ["cloud", "speech", "pixel"];
      safeUpdates.status_style = allowedStyles.includes(body.status_style) ? body.status_style : "cloud";
    }
    if (body.featured_creators !== undefined && Array.isArray(body.featured_creators)) {
      safeUpdates.featured_creators = body.featured_creators.slice(0, 6);
    }

    // Safely pack updates: embeds metadata into bio to prevent DB schema cache missing column crashes
    const { dbPayload, updatedProfile } = packProfileUpdates(safeUpdates, currentProfile);

    // Prefer admin service client if configured, otherwise server client
    const { createAdminSupabaseClient } = await import("@/lib/supabase/server");
    const dbClient = createAdminSupabaseClient() || supabase;

    let updated: any = null;
    let updateError: any = null;

    if (!currentRawProfile) {
      // Profile doesn't exist yet (e.g. fresh onboarding) - upsert initial profile
      const initialUsername = newUsername || ("user_" + user.id.replace(/-/g, "").slice(0, 8));
      const res = await dbClient
        .from("profiles")
        .upsert({
          id: user.id,
          username: initialUsername,
          display_name: safeUpdates.display_name || user.email?.split("@")[0] || initialUsername,
          theme: safeUpdates.theme || "notebook",
          ...dbPayload,
        })
        .select()
        .maybeSingle();
      updated = res.data;
      updateError = res.error;
    } else {
      // Existing profile - update safely
      const res = await dbClient
        .from("profiles")
        .update(dbPayload)
        .eq("id", user.id)
        .select()
        .maybeSingle();
      updated = res.data;
      updateError = res.error;
    }

    if (updateError) {
      console.error("Supabase profile update error:", updateError);
      return NextResponse.json({ error: updateError.message || "Failed to update profile. Please try again." }, { status: 500 });
    }

    return NextResponse.json({ profile: unpackProfile(updated || updatedProfile) });
  } catch (err: any) {
    console.error("API profile update error:", err);
    return NextResponse.json({ error: "Failed to update profile. Please try again." }, { status: 500 });
  }
}
