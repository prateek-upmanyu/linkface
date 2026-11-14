import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { linkId } = body;

    if (!linkId) {
      return NextResponse.json({ error: "Missing linkId" }, { status: 400 });
    }

    const supabase = await createServerSupabaseClient();
    if (supabase) {
      // First attempt using secure RPC function
      const { error: rpcError } = await supabase.rpc("increment_link_clicks", {
        link_id: linkId,
      });

      if (rpcError) {
        // Fallback: direct update if RPC is not installed yet
        console.warn("RPC increment_link_clicks failed, attempting fallback:", rpcError);
        const { data: link } = await supabase
          .from("links")
          .select("click_count")
          .eq("id", linkId)
          .single();

        if (link) {
          await supabase
            .from("links")
            .update({ click_count: (link.click_count || 0) + 1 })
            .eq("id", linkId);
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Click increment error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
