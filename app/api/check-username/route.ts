import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { validateUsername, checkRateLimit, getClientIp } from "@/lib/security";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  // Rate limiting: 60 checks per minute per IP
  const clientIp = getClientIp(request);
  const rate = checkRateLimit(`rate:username_check:${clientIp}`, 60, 60000);
  if (!rate.isAllowed) {
    return NextResponse.json(
      { available: false, message: "Too many checks. Please wait a moment." },
      {
        status: 429,
        headers: { "Retry-After": String(Math.ceil(rate.resetMs / 1000)) },
      }
    );
  }

  const { searchParams } = new URL(request.url);
  const rawUsername = searchParams.get("username");

  const validation = validateUsername(rawUsername);
  if (!validation.isValid) {
    return NextResponse.json({
      available: false,
      message: validation.error,
    });
  }

  const username = validation.cleanUsername;

  // Check Supabase if configured
  try {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from("profiles")
        .select("id")
        .eq("username", username)
        .maybeSingle();

      if (error) {
        console.error("Supabase username check error:", error);
      } else if (data) {
        return NextResponse.json({
          available: false,
          message: "This username is already claimed.",
        });
      }
    }
  } catch (err) {
    console.warn("Could not reach database, allowing fallback check:", err);
  }

  return NextResponse.json({
    available: true,
    message: "Username is available.",
  });
}
