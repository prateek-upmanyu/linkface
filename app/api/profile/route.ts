import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isProTheme } from "@/lib/themes";

export async function PATCH(req: NextRequest) {
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

    const { data: currentProfile } = await supabase
      .from("profiles")
      .select("plan")
      .eq("id", user.id)
      .single();

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
          error: `The theme "${body.theme}" requires a Pro subscription. Free accounts are limited to the Midnight theme.`,
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

    if (body.display_name !== undefined) updatePayload.display_name = body.display_name;
    if (body.bio !== undefined) updatePayload.bio = body.bio;
    if (body.avatar_url !== undefined) updatePayload.avatar_url = body.avatar_url;
    if (body.theme !== undefined) updatePayload.theme = body.theme;
    if (body.spotlight_enabled !== undefined) updatePayload.spotlight_enabled = body.spotlight_enabled;
    if (body.status_message !== undefined) updatePayload.status_message = body.status_message;
    if (body.status_style !== undefined) updatePayload.status_style = body.status_style;
    if (body.featured_creators !== undefined) updatePayload.featured_creators = body.featured_creators;

    const { data: updated, error: updateError } = await supabase
      .from("profiles")
      .update(updatePayload)
      .eq("id", user.id)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ profile: updated });
  } catch (err: any) {
    console.error("API profile update error:", err);
    return NextResponse.json({ error: err.message || "Failed to update profile" }, { status: 500 });
  }
}
