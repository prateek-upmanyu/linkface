import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const rawNext = requestUrl.searchParams.get("next") || "/dashboard";

  // Prevent Open Redirect: Only allow relative internal paths starting with a single '/'
  let safeNext = "/dashboard";
  if (rawNext.startsWith("/") && !rawNext.startsWith("//")) {
    safeNext = rawNext;
  }

  // Determine canonical origin
  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProto = request.headers.get("x-forwarded-proto") || "https";
  const baseUrl = forwardedHost
    ? `${forwardedProto}://${forwardedHost}`
    : requestUrl.origin;

  if (code) {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        return NextResponse.redirect(`${baseUrl}${safeNext}`);
      }
      console.error("Auth callback exchange error:", error);
    }
  }

  // Fallback redirect on error
  return NextResponse.redirect(`${baseUrl}/login?error=auth_failed`);
}
