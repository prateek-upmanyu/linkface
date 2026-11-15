import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient, createAdminSupabaseClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const interval: "monthly" | "yearly" = body.interval === "monthly" ? "monthly" : "yearly";
    const periodEnd = new Date(Date.now() + (interval === "yearly" ? 365 : 30) * 86400000).toISOString();

    const supabaseAdmin = createAdminSupabaseClient() || supabase;

    const { error: updateError } = await supabaseAdmin
      .from("profiles")
      .update({
        plan: "pro",
        plan_status: "active",
        billing_interval: interval,
        current_period_end: periodEnd,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, plan: "pro" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
