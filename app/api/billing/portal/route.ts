import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createCustomerPortalSession } from "@/lib/billing";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: "Server unavailable" }, { status: 503 });
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("provider_customer_id")
      .eq("id", user.id)
      .single();

    const portalUrl = await createCustomerPortalSession(profile?.provider_customer_id || "");
    return NextResponse.json({ url: portalUrl });
  } catch (err: any) {
    console.error("Portal error:", err);
    return NextResponse.json({ error: err.message || "Failed to generate portal" }, { status: 500 });
  }
}
