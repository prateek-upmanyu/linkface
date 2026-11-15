import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    let rawUrl = (body.url || "").trim();

    if (!rawUrl) {
      return NextResponse.json(
        { error: "URL is required" },
        { status: 400 }
      );
    }

    // Ensure protocol
    if (!rawUrl.startsWith("http://") && !rawUrl.startsWith("https://")) {
      rawUrl = "https://" + rawUrl;
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(rawUrl);
    } catch {
      return NextResponse.json(
        { error: "Invalid URL provided" },
        { status: 400 }
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
          avatarUrl = new URL(ogImageMatch[1], parsedUrl.href).href;
        } catch {
          avatarUrl = ogImageMatch[1];
        }
      }

      // Extract title / creator name
      const titleMatch =
        html.match(/<meta\s+[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i) ||
        html.match(/<meta\s+[^>]*name=["']twitter:title["'][^>]*content=["']([^"']+)["']/i) ||
        html.match(/<title[^>]*>([^<]+)<\/title>/i);

      if (titleMatch && titleMatch[1]) {
        title = titleMatch[1].trim();
        // Clean up common suffixes like " - YouTube", " | Twitter", " / X"
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
