import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import {
  sanitizeAndValidateUrl,
  isPrivateOrReservedHost,
  checkRateLimit,
} from "@/lib/security";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    // 1. Session verification: Must be an authenticated user
    const supabase = await createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: "Service unconfigured" }, { status: 503 });
    }

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Authentication required to fetch metadata" },
        { status: 401 }
      );
    }

    // 2. Rate limiting: 15 scrapes per minute per authenticated user
    const rate = checkRateLimit(`rate:scrape:${user.id}`, 15, 60000);
    if (!rate.isAllowed) {
      return NextResponse.json(
        { error: "Scraping rate limit exceeded. Please wait a moment." },
        { status: 429, headers: { "Retry-After": String(Math.ceil(rate.resetMs / 1000)) } }
      );
    }

    const body = await req.json();
    const rawUrl = body.url;

    // 3. Strict URL validation
    const urlValidation = sanitizeAndValidateUrl(rawUrl);
    if (!urlValidation.isValid) {
      return NextResponse.json(
        { error: urlValidation.error || "Invalid URL" },
        { status: 400 }
      );
    }

    const parsedUrl = new URL(urlValidation.sanitizedUrl);

    // 4. SSRF Guard: reject loopback, internal networks, or cloud metadata endpoints
    if (isPrivateOrReservedHost(parsedUrl.hostname)) {
      return NextResponse.json(
        { error: "Access to private or internal addresses is prohibited." },
        { status: 403 }
      );
    }

    const host = parsedUrl.hostname.toLowerCase().replace(/^www\./, "");
    const pathname = parsedUrl.pathname;

    // Fast-path 1: GitHub user profile
    if (host === "github.com") {
      const parts = pathname.split("/").filter(Boolean);
      if (parts.length >= 1) {
        const username = parts[0];
        return NextResponse.json({
          success: true,
          avatarUrl: `https://github.com/${username}.png`,
          avatar_url: `https://github.com/${username}.png`,
          name: username,
        });
      }
    }

    // Fast-path 2: Twitter / X
    if (host === "x.com" || host === "twitter.com") {
      const parts = pathname.split("/").filter(Boolean);
      if (parts.length >= 1 && parts[0] !== "home") {
        const username = parts[0];
        return NextResponse.json({
          success: true,
          avatarUrl: `https://unavatar.io/x/${username}`,
          avatar_url: `https://unavatar.io/x/${username}`,
          name: `@${username}`,
        });
      }
    }

    // Fast-path 3: Substack
    if (host.endsWith(".substack.com")) {
      const sub = host.replace(".substack.com", "");
      return NextResponse.json({
        success: true,
        avatarUrl: `https://unavatar.io/substack/${sub}`,
        avatar_url: `https://unavatar.io/substack/${sub}`,
        name: sub,
      });
    }

    // General webpage fetch with 4s timeout
    let html = "";
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const res = await fetch(parsedUrl.href, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Linklet/1.0",
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/*;q=0.8,*/*;q=0.7",
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        html = await res.text();
      }
    } catch {
      // Fetch failed or timed out, fallback below
    }

    let avatarUrl: string | null = null;
    let title: string | null = null;

    if (html) {
      // Extract OG image
      const ogImageMatch =
        html.match(/<meta\s+[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i) ||
        html.match(/<meta\s+[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i) ||
        html.match(/<meta\s+[^>]*name=["']twitter:image["'][^>]*content=["']([^"']+)["']/i) ||
        html.match(/<meta\s+[^>]*content=["']([^"']+)["'][^>]*name=["']twitter:image["']/i) ||
        html.match(/<link\s+[^>]*rel=["'](?:apple-touch-icon|shortcut icon|icon)["'][^>]*href=["']([^"']+)["']/i);

      if (ogImageMatch && ogImageMatch[1]) {
        try {
          const resolved = new URL(ogImageMatch[1], parsedUrl.href);
          if (!isPrivateOrReservedHost(resolved.hostname)) {
            avatarUrl = resolved.href;
          }
        } catch {
          avatarUrl = null;
        }
      }

      // Extract title / creator name
      const titleMatch =
        html.match(/<meta\s+[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i) ||
        html.match(/<meta\s+[^>]*name=["']twitter:title["'][^>]*content=["']([^"']+)["']/i) ||
        html.match(/<title[^>]*>([^<]+)<\/title>/i);

      if (titleMatch && titleMatch[1]) {
        title = titleMatch[1].trim();
        title = title.replace(/\s*([|–—-])\s*(YouTube|Twitter|X|GitHub|Instagram|LinkedIn|Substack|Twitch).*$/i, "").trim();
      }
    }

    // High-resolution fallback if no image found in HTML
    if (!avatarUrl) {
      avatarUrl = `https://www.google.com/s2/favicons?domain=${host}&sz=128`;
    }

    if (!title) {
      title = host.charAt(0).toUpperCase() + host.slice(1);
    }

    return NextResponse.json({
      success: true,
      avatarUrl,
      avatar_url: avatarUrl,
      name: title,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to scrape metadata" },
      { status: 500 }
    );
  }
}
