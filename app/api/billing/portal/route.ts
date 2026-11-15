import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createCustomerPortalSession } from "@/lib/billing";
import { checkRateLimit, getClientIp } from "@/lib/security";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: "Server temporarily unavailable." }, { status: 503 });
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized. Please sign in." }, { status: 401 });
    }

    // Rate Limiting: Max 10 portal requests per minute per user
    const clientIp = getClientIp(req);
    const rate = checkRateLimit(`rate:portal:${user.id}:${clientIp}`, 10, 60000);
    if (!rate.isAllowed) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a moment." },
        { status: 429, headers: { "Retry-After": String(Math.ceil(rate.resetMs / 1000)) } }
      );
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
    return NextResponse.json({ error: "Unable to generate billing portal link. Please try again." }, { status: 500 });
  }
}
