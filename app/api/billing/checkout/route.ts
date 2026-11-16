import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createCheckoutSession } from "@/lib/billing";
import { checkRateLimit, getClientIp } from "@/lib/security";
import { unpackProfile } from "@/lib/profile-utils";

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
      return NextResponse.json({ error: "Unauthorized. Please sign in to upgrade." }, { status: 401 });
    }

    // Guard: Prevent double-charging if user is already an active Pro subscriber (checks both column & metadata)
    const { data: userRawProfile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    const userProfile = unpackProfile(userRawProfile);

    if (userProfile?.plan === "pro") {
      return NextResponse.json(
        {
          error: "You are already a Pro member! Manage your subscription from Dashboard settings.",
          isAlreadyPro: true,
        },
        { status: 400 }
      );
    }

    // Rate Limiting: Max 10 checkout attempts per minute per user
    const clientIp = getClientIp(req);
    const rate = checkRateLimit(`rate:checkout:${user.id}:${clientIp}`, 10, 60000);
    if (!rate.isAllowed) {
      return NextResponse.json(
        { error: "Too many checkout requests. Please wait a moment." },
        { status: 429, headers: { "Retry-After": String(Math.ceil(rate.resetMs / 1000)) } }
      );
    }

    const body = await req.json().catch(() => ({}));
    const interval: "monthly" | "yearly" = body.interval === "monthly" ? "monthly" : "yearly";

    const session = await createCheckoutSession({
      userId: user.id,
      userEmail: user.email || "",
      interval,
      returnUrl: `${req.nextUrl.origin}/pricing/success`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Checkout initiation error:", err);
    return NextResponse.json({ error: "Unable to initiate checkout. Please try again." }, { status: 500 });
  }
}
