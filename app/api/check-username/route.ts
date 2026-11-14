import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const RESERVED_USERNAMES = new Set([
  "admin",
  "administrator",
  "root",
  "login",
  "signup",
  "signin",
  "auth",
  "api",
  "dashboard",
  "settings",
  "account",
  "profile",
  "user",
  "help",
  "support",
  "terms",
  "privacy",
  "explore",
  "about",
  "contact",
  "billing",
  "public",
  "static",
  "assets",
  "favicon",
  "robots",
  "sitemap",
]);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = (searchParams.get("username") || "").toLowerCase().trim();

  if (!username) {
    return NextResponse.json(
      { available: false, message: "Username is required." },
      { status: 400 }
    );
  }

  // Format validation: 3-20 characters, lowercase letters, numbers, and underscores only
  if (!/^[a-z0-9_]{3,20}$/.test(username)) {
    return NextResponse.json({
      available: false,
      message:
        "Username must be 3-20 characters long and contain only lowercase letters, numbers, and underscores.",
    });
  }

  // Reserved keyword validation
  if (RESERVED_USERNAMES.has(username)) {
    return NextResponse.json({
      available: false,
      message: `The username "${username}" is a reserved system word.`,
    });
  }

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
          message: "This username is already taken.",
        });
      }
    }
  } catch (err) {
    console.warn("Could not reach database, allowing fallback check:", err);
  }

  // Demo user check
  if (username === "alex") {
    return NextResponse.json({
      available: false,
      message: "The username 'alex' is reserved for the live demo showcase.",
    });
  }

  return NextResponse.json({
    available: true,
    message: "Username is available!",
  });
}
