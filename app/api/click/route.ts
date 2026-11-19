import { NextResponse } from "next/server";
import { createServerSupabaseClient, createAdminSupabaseClient } from "@/lib/supabase/server";
import { checkRateLimit, getClientIp } from "@/lib/security";
import { extractGeoFromRequest } from "@/lib/geo";

export const dynamic = "force-dynamic";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function sanitizeString(val: unknown, maxLen = 80): string {
  if (typeof val !== "string") return "";
  return val.replace(/[\u0000-\u001F\u007F-\u009F<>]/g, "").trim().slice(0, maxLen);
}

function resolveClickGeo(request: Request, clientGeo: any) {
  const edgeGeo = extractGeoFromRequest(request);

  const clientCity = sanitizeString(clientGeo?.city, 80);
  const clientRegion = sanitizeString(clientGeo?.regionState, 80);
  const clientCountryName = sanitizeString(clientGeo?.countryName, 80);
  const clientCountryCode = sanitizeString(clientGeo?.countryCode, 4).toUpperCase();

  // If client provided an accurate city (e.g. Ratnagiri, Kolhapur), prioritize it over edge ISP gateway IP
  const isCityValid =
    Boolean(clientCity) &&
    clientCity.length >= 2 &&
    clientCity !== "UNKNOWN" &&
    clientCity !== "Direct";

  return {
    countryCode:
      clientCountryCode && clientCountryCode.length === 2
        ? clientCountryCode
        : edgeGeo.countryCode,
    countryName: clientCountryName || edgeGeo.countryName,
    regionState: clientRegion || edgeGeo.regionState,
    city: isCityValid ? clientCity : edgeGeo.city,
  };
}

export async function POST(request: Request) {
  try {
    // Rate limit: max 60 clicks per minute per IP
    const clientIp = getClientIp(request);
    const rate = checkRateLimit(`rate:click:${clientIp}`, 60, 60000);
    if (!rate.isAllowed) {
      return NextResponse.json(
        { error: "Rate limit exceeded" },
        { status: 429, headers: { "Retry-After": String(Math.ceil(rate.resetMs / 1000)) } }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { linkId, spotlightId, profileUsername, clientGeo } = body;

    const adminSupabase = createAdminSupabaseClient();
    const supabase = adminSupabase || (await createServerSupabaseClient());
    if (!supabase) {
      return NextResponse.json({ success: true });
    }

    // Resolve accurate city and geolocation
    const geo = resolveClickGeo(request, clientGeo);
    const clickedAt = new Date().toISOString();

    // 1. Handle Link clicks
    if (linkId && typeof linkId === "string" && UUID_REGEX.test(linkId)) {
      // Look up link owner user_id to associate click for owner's analytics
      let linkOwnerId: string | null = null;
      try {
        const { data: linkRecord } = await supabase
          .from("links")
          .select("id, user_id")
          .eq("id", linkId)
          .single();
        if (linkRecord) {
          linkOwnerId = linkRecord.user_id;
        }
      } catch {
        // fallback
      }

      // Record detailed geolocation click log in link_clicks table
      try {
        await supabase.from("link_clicks").insert({
          link_id: linkId,
          user_id: linkOwnerId,
          country_code: geo.countryCode,
          country_name: geo.countryName,
          region_state: geo.regionState,
          city: geo.city,
          referrer: request.headers.get("referer") || null,
          user_agent: request.headers.get("user-agent") || null,
          created_at: clickedAt,
        });
      } catch (insertErr) {
        // Non-blocking: table might still be migrating on user Supabase
        console.warn("Failed to write to link_clicks table:", insertErr);
      }

      // Execute atomic RPC increment for fast counter
      const { error: rpcError } = await supabase.rpc("increment_link_clicks", {
        link_id: linkId,
      });

      if (rpcError) {
        console.warn("RPC increment_link_clicks error:", rpcError);
      }

      return NextResponse.json({ success: true, timestamp: clickedAt, geo });
    }

    // 2. Handle Spotlight clicks
    if (spotlightId || profileUsername) {
      try {
        await supabase.from("link_clicks").insert({
          link_id: null,
          user_id: null,
          country_code: geo.countryCode,
          country_name: geo.countryName,
          region_state: geo.regionState,
          city: geo.city,
          referrer: request.headers.get("referer") || null,
          user_agent: request.headers.get("user-agent") || null,
          created_at: clickedAt,
        });
      } catch {
        // non-blocking
      }

      return NextResponse.json({ success: true, timestamp: clickedAt, geo });
    }

    return NextResponse.json({ error: "Invalid click identifier" }, { status: 400 });
  } catch (err: any) {
    console.error("Click increment error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
