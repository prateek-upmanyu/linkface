import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { type EmailOtpType } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const tokenHash = requestUrl.searchParams.get("token_hash") || requestUrl.searchParams.get("token");
  const rawType = requestUrl.searchParams.get("type");
  const rawNext = requestUrl.searchParams.get("next") || "/dashboard";
  const errorDescription = requestUrl.searchParams.get("error_description");

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

  if (errorDescription) {
    return NextResponse.redirect(
      `${baseUrl}/login?error=${encodeURIComponent(errorDescription)}`
    );
  }

  const supabase = await createServerSupabaseClient();

  // 1. Handle Email Verification Links (token_hash / token + type)
  if (tokenHash && rawType && supabase) {
    const type = rawType as EmailOtpType;
    const { error: otpError } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type,
    });

    if (!otpError) {
      return NextResponse.redirect(`${baseUrl}${safeNext}`);
    }
    console.error("Email verification OTP error:", otpError);
    return NextResponse.redirect(
      `${baseUrl}/login?error=${encodeURIComponent(otpError.message || "Email verification failed")}`
    );
  }

  // 2. Handle PKCE / OAuth Code Exchange
  if (code && supabase) {
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
    if (!exchangeError) {
      return NextResponse.redirect(`${baseUrl}${safeNext}`);
    }
    console.error("Auth callback exchange error:", exchangeError);
    return NextResponse.redirect(
      `${baseUrl}/login?error=${encodeURIComponent(exchangeError.message || "Authentication failed")}`
    );
  }

  // Fallback redirect on error
  return NextResponse.redirect(`${baseUrl}/login?error=auth_failed`);
}
