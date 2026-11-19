import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { unpackProfile } from "@/lib/profile-utils";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json(
        { error: "Database service temporarily unavailable." },
        { status: 503 }
      );
    }

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized. Please sign in." }, { status: 401 });
    }

    // 1. Fetch current user's profile
    const { data: userProfileRaw } = await supabase
      .from("profiles")
      .select("id, username, display_name, avatar_url")
      .eq("id", user.id)
      .single();

    const currentUsername = (userProfileRaw?.username || "").toLowerCase();

    // 2. Compute Spotlight Inclusions Insight:
    // How many people's Spotlights is this user currently in?
    const { data: allProfilesRaw } = await supabase
      .from("profiles")
      .select("id, username, display_name, avatar_url, bio, spotlight_creators, featured_creators")
      .neq("id", user.id);

    const curatorsSpotlightingUser: Array<{
      id: string;
      username: string;
      displayName: string;
      avatarUrl: string | null;
      spotlightTitle?: string | null;
    }> = [];

    if (allProfilesRaw && currentUsername) {
      for (const p of allProfilesRaw) {
        const unpacked = unpackProfile(p);
        const creators = unpacked.spotlight_creators || unpacked.featured_creators || [];

        const isIncluded = creators.some((c) => {
          if (!c || !c.url) return false;
          const urlLower = c.url.toLowerCase();
          const cleanUrl = urlLower.replace(/^https?:\/\//, "").replace(/^www\./, "");
          return (
            cleanUrl.endsWith(`/${currentUsername}`) ||
            cleanUrl.includes(`linkface.in/${currentUsername}`) ||
            cleanUrl.includes(`/${currentUsername}?`) ||
            urlLower === currentUsername ||
            urlLower === `@${currentUsername}`
          );
        });

        if (isIncluded) {
          curatorsSpotlightingUser.push({
            id: p.id,
            username: p.username,
            displayName: p.display_name || `@${p.username}`,
            avatarUrl: p.avatar_url || null,
          });
        }
      }
    }

    // 3. Fetch Link Click Geolocation & Timestamp Analytics
    let recentClicks: Array<{
      id: string;
      linkTitle: string;
      country: string;
      countryCode: string;
      regionState: string;
      city: string;
      timestamp: string;
    }> = [];

    const countryCounts: Record<string, { name: string; code: string; count: number }> = {};
    const stateCounts: Record<string, { name: string; country: string; count: number }> = {};
    const cityCounts: Record<string, { name: string; state: string; country: string; count: number }> = {};

    // First, map link titles for this user
    const { data: userLinks } = await supabase
      .from("links")
      .select("id, title, click_count")
      .eq("user_id", user.id);

    const linkTitleMap: Record<string, string> = {};
    let totalLinkClicks = 0;
    if (userLinks) {
      for (const l of userLinks) {
        linkTitleMap[l.id] = l.title || "Showcase Link";
        totalLinkClicks += Number(l.click_count || 0);
      }
    }

    try {
      const { data: clicksData, error: clicksError } = await supabase
        .from("link_clicks")
        .select("id, link_id, country_code, country_name, region_state, city, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(100);

      if (!clicksError && clicksData && clicksData.length > 0) {
        for (const c of clicksData) {
          const cName = c.country_name || "India";
          const cCode = c.country_code || "IN";
          const sName = c.region_state || "Direct";

          // Country aggregation
          if (!countryCounts[cName]) {
            countryCounts[cName] = { name: cName, code: cCode, count: 0 };
          }
          countryCounts[cName].count += 1;

          // State aggregation
          const stateKey = `${sName}_${cName}`;
          if (!stateCounts[stateKey]) {
            stateCounts[stateKey] = { name: sName, country: cName, count: 0 };
          }
          stateCounts[stateKey].count += 1;

          // City aggregation
          const rawCity = (c.city && c.city !== sName) ? c.city : (c.city || sName);
          if (rawCity && rawCity !== "UNKNOWN" && rawCity !== "Direct") {
            const cityKey = `${rawCity}_${sName}_${cName}`;
            if (!cityCounts[cityKey]) {
              cityCounts[cityKey] = { name: rawCity, state: sName, country: cName, count: 0 };
            }
            cityCounts[cityKey].count += 1;
          }

          // Recent list
          recentClicks.push({
            id: c.id,
            linkTitle: c.link_id ? (linkTitleMap[c.link_id] || "Showcase Link") : "Profile Spotlight",
            country: cName,
            countryCode: cCode,
            regionState: sName,
            city: c.city || sName,
            timestamp: c.created_at,
          });
        }
      }
    } catch {
      // link_clicks table may be migrating
    }

    // Format countries array sorted by count desc
    const totalGeoCount = Object.values(countryCounts).reduce((sum, c) => sum + c.count, 0);
    const sortedCountries = Object.values(countryCounts)
      .sort((a, b) => b.count - a.count)
      .map((c) => ({
        ...c,
        percentage: totalGeoCount > 0 ? Math.round((c.count / totalGeoCount) * 100) : 0,
      }));

    // Format states array sorted by count desc
    const sortedStates = Object.values(stateCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Format cities array sorted by count desc
    const sortedCities = Object.values(cityCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return NextResponse.json({
      success: true,
      spotlightInsight: {
        inclusionsCount: curatorsSpotlightingUser.length,
        curators: curatorsSpotlightingUser,
      },
      geoBreakdown: {
        countries: sortedCountries,
        states: sortedStates,
        cities: sortedCities,
      },
      recentClicks: recentClicks.slice(0, 20),
    });
  } catch (err: any) {
    console.error("Analytics overview API error:", err);
    return NextResponse.json({ error: "Failed to load analytics overview" }, { status: 500 });
  }
}
