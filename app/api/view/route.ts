import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { checkRateLimit, getClientIp, validateUsername } from "@/lib/security";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const clientIp = getClientIp(request);
    const body = await request.json();
    const { username } = body;

    const validation = validateUsername(username);
    if (!validation.isValid && username !== "alex") {
      return NextResponse.json({ error: "Invalid profile username" }, { status: 400 });
    }

    const cleanUser = validation.cleanUsername || "alex";

    // Rate limit: 1 view count per 10 seconds per IP + profile combo to prevent inflating counts
    const rate = checkRateLimit(`rate:view:${clientIp}:${cleanUser}`, 1, 10000);
    if (!rate.isAllowed) {
      // Return 200 without double counting
      return NextResponse.json({ success: true, deduplicated: true });
    }

    const supabase = await createServerSupabaseClient();
    if (supabase) {
      const { error: rpcError } = await supabase.rpc("increment_page_views", {
        profile_username: cleanUser,
      });

      if (rpcError) {
        console.warn("RPC increment_page_views error:", rpcError);
        return NextResponse.json({ error: "Failed to record view" }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("View increment error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
