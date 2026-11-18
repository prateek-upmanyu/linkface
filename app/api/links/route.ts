import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { sanitizeAndValidateUrl, checkRateLimit, getClientIp } from "@/lib/security";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: "Database service temporarily unavailable." }, { status: 503 });
    }

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized. Please sign in." }, { status: 401 });
    }

    // Rate Limiting: Max 30 link creations per minute per user
    const clientIp = getClientIp(req);
    const rate = checkRateLimit(`rate:links_post:${user.id}:${clientIp}`, 30, 60000);
    if (!rate.isAllowed) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a moment before creating more links." },
        { status: 429, headers: { "Retry-After": String(Math.ceil(rate.resetMs / 1000)) } }
      );
    }

    // 1. Fetch user profile to check subscription plan safely
    const { data: rawProfile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    const { unpackProfile } = await import("@/lib/profile-utils");
    const userProfile = unpackProfile(rawProfile);
    const isPro = userProfile?.plan === "pro";

    const { createAdminSupabaseClient } = await import("@/lib/supabase/server");
    const dbClient = createAdminSupabaseClient() || supabase;

    // 2. Count existing links
    const { count, error: countError } = await dbClient
      .from("links")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    if (countError) {
      console.error("Count links verification error:", countError);
      return NextResponse.json({ error: "Failed to verify link limit." }, { status: 500 });
    }

    const currentCount = count || 0;

    // 3. Server-side Free Plan Enforce: Max 3 links
    if (!isPro && currentCount >= 3) {
      return NextResponse.json(
        {
          error: "Free plan is limited to 3 links. Please upgrade to Pro for unlimited links.",
          code: "UPGRADE_REQUIRED",
          limit: 3,
        },
        { status: 403 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const { url, title, platform, badge, custom_icon } = body;

    const validation = sanitizeAndValidateUrl(url);
    if (!validation.isValid) {
      return NextResponse.json({ error: validation.error || "Invalid destination URL." }, { status: 400 });
    }

    // Strict input length validation
    const cleanTitle = (title ? String(title) : "My Link").trim().slice(0, 100);
    const cleanPlatform = platform ? String(platform).trim().slice(0, 40) : null;
    const cleanBadge = badge ? String(badge).trim().slice(0, 20) : null;

    // Validate custom icon: Must be valid data URI or image URL under 600KB
    let validCustomIcon: string | null = null;
    if (custom_icon && typeof custom_icon === "string") {
      if (custom_icon.startsWith("data:image/") || custom_icon.startsWith("https://")) {
        if (custom_icon.length <= 600000) {
          validCustomIcon = custom_icon;
        }
      }
    }

    const insertPayload: any = {
      user_id: user.id,
      url: validation.sanitizedUrl,
      title: cleanTitle,
      platform: cleanPlatform,
      position: currentCount,
      is_visible: true,
      badge: cleanBadge,
      custom_icon: validCustomIcon,
    };

    let { data, error } = await dbClient.from("links").insert(insertPayload).select().single();

    if (error && error.message?.toLowerCase().includes("custom_icon")) {
      delete insertPayload.custom_icon;
      if (validCustomIcon) {
        insertPayload.platform = `custom:${validCustomIcon}`;
      }
      const retry = await dbClient.from("links").insert(insertPayload).select().single();
      data = retry.data;
      error = retry.error;
    }

    if (error) {
      console.error("Supabase link insert error:", error);
      return NextResponse.json({ error: "Failed to save link. Please try again." }, { status: 500 });
    }

    const unpackedLink = data ? {
      ...data,
      custom_icon: data.custom_icon || (data.platform?.startsWith("custom:") ? data.platform.slice(7) : null),
      platform: data.platform?.startsWith("custom:") ? null : data.platform,
    } : data;

    return NextResponse.json({ link: unpackedLink });
  } catch (err: any) {
    console.error("API link create error:", err);
    return NextResponse.json({ error: "Failed to create link. Please try again." }, { status: 500 });
  }
}

/**
 * PUT: Batch synchronize links (reorder, update titles/urls/visibility/custom icons, delete removed).
 * Verified server-side with user session cookies.
 */
export async function PUT(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: "Database service temporarily unavailable." }, { status: 503 });
    }

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized. Please sign in." }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const rawLinks: any[] = Array.isArray(body.links) ? body.links : [];

    const { createAdminSupabaseClient } = await import("@/lib/supabase/server");
    const dbClient = createAdminSupabaseClient() || supabase;

    // 1. Get existing link IDs from DB
    const { data: dbExistingLinks } = await dbClient
      .from("links")
      .select("id")
      .eq("user_id", user.id);

    const dbIds = (dbExistingLinks || []).map((l) => l.id);
    const incomingPersistedIds = rawLinks
      .map((l) => l.id)
      .filter((id) => id && typeof id === "string" && !id.startsWith("temp-"));

    // 2. Process deletions: any DB link not in the incoming list is deleted
    const toDeleteIds = dbIds.filter((id) => !incomingPersistedIds.includes(id));
    if (toDeleteIds.length > 0) {
      await dbClient.from("links").delete().in("id", toDeleteIds).eq("user_id", user.id);
    }

    // 3. Process inserts and updates
    const savedLinks: any[] = [];
    for (let i = 0; i < rawLinks.length; i++) {
      const item = rawLinks[i];
      const validation = sanitizeAndValidateUrl(item.url);
      const safeUrl = validation.isValid ? validation.sanitizedUrl : item.url;
      const safeTitle = (item.title || "My Link").trim().slice(0, 100);

      let icon = item.custom_icon || null;
      let platformVal = item.platform || null;

      const linkPayload: any = {
        user_id: user.id,
        url: safeUrl,
        title: safeTitle,
        platform: platformVal,
        position: i,
        is_visible: item.is_visible !== false,
        badge: item.badge ? String(item.badge).trim().slice(0, 20) : null,
        custom_icon: icon,
        updated_at: new Date().toISOString(),
      };

      if (!item.id || String(item.id).startsWith("temp-")) {
        // Insert
        let { data: inserted, error: insertErr } = await dbClient
          .from("links")
          .insert(linkPayload)
          .select()
          .single();

        if (insertErr && insertErr.message?.toLowerCase().includes("custom_icon")) {
          delete linkPayload.custom_icon;
          if (icon) {
            linkPayload.platform = `custom:${icon}`;
          }
          const retry = await dbClient.from("links").insert(linkPayload).select().single();
          inserted = retry.data;
          insertErr = retry.error;
        }

        if (inserted) savedLinks.push(inserted);
      } else {
        // Update
        let { data: updated, error: updateErr } = await dbClient
          .from("links")
          .update(linkPayload)
          .eq("id", item.id)
          .eq("user_id", user.id)
          .select()
          .single();

        if (updateErr && updateErr.message?.toLowerCase().includes("custom_icon")) {
          delete linkPayload.custom_icon;
          if (icon) {
            linkPayload.platform = `custom:${icon}`;
          }
          const retry = await dbClient
            .from("links")
            .update(linkPayload)
            .eq("id", item.id)
            .eq("user_id", user.id)
            .select()
            .single();
          updated = retry.data;
          updateErr = retry.error;
        }

        if (updated) savedLinks.push(updated);
      }
    }

    // 4. Fetch clean final ordered list
    const { data: finalDbLinks } = await dbClient
      .from("links")
      .select("*")
      .eq("user_id", user.id)
      .order("position", { ascending: true });

    const finalLinks = (finalDbLinks && finalDbLinks.length > 0 ? finalDbLinks : savedLinks).map((l: any) => ({
      ...l,
      custom_icon: l.custom_icon || (l.platform?.startsWith("custom:") ? l.platform.slice(7) : null),
      platform: l.platform?.startsWith("custom:") ? null : l.platform,
    }));

    return NextResponse.json({ links: finalLinks });
  } catch (err: any) {
    console.error("API links sync error:", err);
    return NextResponse.json({ error: "Failed to synchronize links." }, { status: 500 });
  }
}

/**
 * DELETE: Delete a single link by ID.
 */
export async function DELETE(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: "Database service temporarily unavailable." }, { status: 503 });
    }

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized. Please sign in." }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const linkId = searchParams.get("id");

    if (!linkId) {
      return NextResponse.json({ error: "Link ID is required." }, { status: 400 });
    }

    const { createAdminSupabaseClient } = await import("@/lib/supabase/server");
    const dbClient = createAdminSupabaseClient() || supabase;

    const { error: deleteError } = await dbClient
      .from("links")
      .delete()
      .eq("id", linkId)
      .eq("user_id", user.id);

    if (deleteError) {
      console.error("Supabase link delete error:", deleteError);
      return NextResponse.json({ error: "Failed to delete link." }, { status: 500 });
    }

    return NextResponse.json({ ok: true, deletedId: linkId });
  } catch (err: any) {
    console.error("API link delete error:", err);
    return NextResponse.json({ error: "Failed to delete link." }, { status: 500 });
  }
}
