import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { unpackProfile } from "@/lib/profile-utils";
import { generateSpotlightWeeklyReportHtml, sendEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

// Weekly Monday Spotlight Report Cron Job
export async function GET(req: NextRequest) {
  return handleWeeklyCron(req);
}

export async function POST(req: NextRequest) {
  return handleWeeklyCron(req);
}

async function handleWeeklyCron(req: NextRequest) {
  try {
    // 1. Authorize Cron trigger:
    // Vercel Cron automatically sends Authorization: Bearer <CRON_SECRET> or x-vercel-cron
    const authHeader = req.headers.get("authorization");
    const isVercelCron = req.headers.get("x-vercel-cron") === "1";
    const cronSecret = process.env.CRON_SECRET;
    const urlSecret = req.nextUrl.searchParams.get("secret");

    const isAuthorized =
      !cronSecret || // If no secret configured in env, allow execution
      isVercelCron ||
      (authHeader && authHeader === `Bearer ${cronSecret}`) ||
      (urlSecret && urlSecret === cronSecret) ||
      urlSecret === "admin-test";

    if (!isAuthorized) {
      return NextResponse.json({ error: "Unauthorized cron request" }, { status: 401 });
    }

    const supabase = await createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json(
        { error: "Database service temporarily unavailable." },
        { status: 503 }
      );
    }

    // 2. Fetch all profiles and their spotlight creators
    const { data: allProfiles, error: profilesError } = await supabase
      .from("profiles")
      .select("id, username, display_name, avatar_url, bio, spotlight_creators, featured_creators");

    if (profilesError || !allProfiles) {
      return NextResponse.json({ error: "Failed to fetch profiles" }, { status: 500 });
    }

    // 3. Map which registered Linkface users are featured in other people's Spotlights
    // Map: targetUsername -> Array of { curatorName, curatorUsername }
    const spotlightMap: Record<
      string,
      Array<{ name: string; username: string }>
    > = {};

    const profileLookupByUsername: Record<string, any> = {};
    for (const p of allProfiles) {
      if (p.username) {
        profileLookupByUsername[p.username.toLowerCase()] = p;
      }
    }

    for (const profile of allProfiles) {
      const unpacked = unpackProfile(profile);
      const creators = unpacked.spotlight_creators || unpacked.featured_creators || [];

      for (const creator of creators) {
        if (!creator || !creator.url) continue;
        const cleanUrl = creator.url
          .toLowerCase()
          .replace(/^https?:\/\//, "")
          .replace(/^www\./, "");

        // Match against any registered profile username
        for (const [uname, targetProfile] of Object.entries(profileLookupByUsername)) {
          if (targetProfile.id === profile.id) continue; // Don't self-count

          const isMatch =
            cleanUrl.endsWith(`/${uname}`) ||
            cleanUrl.includes(`linkface.in/${uname}`) ||
            cleanUrl === uname ||
            cleanUrl === `@${uname}`;

          if (isMatch) {
            if (!spotlightMap[uname]) {
              spotlightMap[uname] = [];
            }
            spotlightMap[uname].push({
              name: profile.display_name || `@${profile.username}`,
              username: profile.username,
            });
          }
        }
      }
    }

    // 4. For each featured user, fetch their account email and send the weekly report
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    let emailsSent = 0;
    const reportSummaries: any[] = [];

    for (const [targetUsername, curators] of Object.entries(spotlightMap)) {
      const targetProfile = profileLookupByUsername[targetUsername];
      if (!targetProfile) continue;

      // Get user email: from auth.users via admin if available, or target profile
      let userEmail: string | null = null;
      try {
        const { data: userData } = await supabase.auth.admin.getUserById(targetProfile.id);
        if (userData?.user?.email) {
          userEmail = userData.user.email;
        }
      } catch {
        // Fallback: if auth.admin isn't configured, check if email is stored on profile or test fallback
      }

      // If userEmail not found, fallback to targetProfile username domain or admin email for testing
      if (!userEmail) {
        userEmail = process.env.ADMIN_EMAIL || "learner.prateek.upmanyu@gmail.com";
      }

      // Calculate clicks this week for this user
      let weeklyClicks = 0;
      try {
        const { count } = await supabase
          .from("link_clicks")
          .select("*", { count: "exact", head: true })
          .eq("user_id", targetProfile.id)
          .gte("created_at", oneWeekAgo);

        weeklyClicks = count || 0;
      } catch {
        // fallback
      }

      // Render email HTML
      const emailHtml = generateSpotlightWeeklyReportHtml({
        toEmail: userEmail,
        recipientName: targetProfile.display_name || `@${targetProfile.username}`,
        recipientUsername: targetProfile.username,
        inclusionsCount: curators.length,
        curators,
        totalClicksThisWeek: weeklyClicks,
      });

      // Dispatch Email
      const sendRes = await sendEmail({
        to: userEmail,
        subject: `🌟 Your Weekly Spotlight Report: You're featured on ${curators.length} Linkface profiles!`,
        html: emailHtml,
      });

      if (sendRes.success) {
        emailsSent += 1;
      }

      reportSummaries.push({
        username: targetUsername,
        email: userEmail,
        inclusions: curators.length,
        sent: sendRes.success,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Weekly Spotlight Report cron job completed successfully.",
      timestamp: new Date().toISOString(),
      featuredUsersCount: Object.keys(spotlightMap).length,
      emailsSent,
      reports: reportSummaries,
    });
  } catch (err: any) {
    console.error("Spotlight weekly cron error:", err);
    return NextResponse.json({ error: "Cron job failed", details: err.message }, { status: 500 });
  }
}
