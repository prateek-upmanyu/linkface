import { MetadataRoute } from "next";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://linkface.in";

  // Core static marketing and informational routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/signup`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/alex`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];

  // Dynamically fetch public creator profiles to index their biolink pages
  let creatorRoutes: MetadataRoute.Sitemap = [];
  try {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      const { data: profiles } = await supabase
        .from("profiles")
        .select("username, updated_at")
        .not("username", "is", null)
        .limit(1000);

      if (profiles && profiles.length > 0) {
        creatorRoutes = profiles.map((p) => ({
          url: `${baseUrl}/${p.username}`,
          lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
          changeFrequency: "daily" as const,
          priority: 0.7,
        }));
      }
    }
  } catch (err) {
    console.warn("Sitemap: Failed to query dynamic profiles:", err);
  }

  return [...staticRoutes, ...creatorRoutes];
}
