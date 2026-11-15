import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { checkRateLimit, getClientIp } from "@/lib/security";

export const dynamic = "force-dynamic";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function POST(request: Request) {
  try {
    // Rate limit: max 30 clicks per minute per IP
    const clientIp = getClientIp(request);
    const rate = checkRateLimit(`rate:click:${clientIp}`, 30, 60000);
    if (!rate.isAllowed) {
      return NextResponse.json(
        { error: "Rate limit exceeded" },
        { status: 429, headers: { "Retry-After": String(Math.ceil(rate.resetMs / 1000)) } }
      );
    }

    const body = await request.json();
    const { linkId } = body;

    if (!linkId || typeof linkId !== "string" || !UUID_REGEX.test(linkId)) {
      return NextResponse.json({ error: "Invalid link identifier" }, { status: 400 });
    }

    const supabase = await createServerSupabaseClient();
    if (supabase) {
      // Execute atomic RPC increment. RPC is configured with SECURITY DEFINER
      // so unauthenticated visitors can track clicks without direct table write access.
      const { error: rpcError } = await supabase.rpc("increment_link_clicks", {
        link_id: linkId,
      });

      if (rpcError) {
        console.warn("RPC increment_link_clicks error:", rpcError);
        return NextResponse.json({ error: "Failed to record click" }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Click increment error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
