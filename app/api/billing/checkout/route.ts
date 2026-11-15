import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createCheckoutSession } from "@/lib/billing";

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
      return NextResponse.json({ error: "Unauthorized. Please sign in to upgrade." }, { status: 401 });
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
    return NextResponse.json({ error: err.message || "Failed to create checkout session" }, { status: 500 });
  }
}
