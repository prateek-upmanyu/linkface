import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username } = body;

    if (!username) {
      return NextResponse.json({ error: "Missing username" }, { status: 400 });
    }

    const supabase = await createServerSupabaseClient();
    if (supabase) {
      const { error: rpcError } = await supabase.rpc("increment_page_views", {
        profile_username: username.toLowerCase(),
      });

      if (rpcError) {
        console.warn("RPC increment_page_views failed, attempting fallback:", rpcError);
        const { data: profile } = await supabase
          .from("profiles")
          .select("page_views")
          .eq("username", username.toLowerCase())
          .single();

        if (profile) {
          await supabase
            .from("profiles")
            .update({ page_views: (profile.page_views || 0) + 1 })
            .eq("username", username.toLowerCase());
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("View increment error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
