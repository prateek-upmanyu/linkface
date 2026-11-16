import { Profile, FeaturedCreator } from "@/types";

const META_PREFIX = "<!--LINKLET_META:";
const META_SUFFIX = "-->";

export interface ProfileMetadata {
  featured_creators?: FeaturedCreator[];
  spotlight_creators?: FeaturedCreator[];
  status_message?: string | null;
  status_style?: "speech" | "cloud" | "pixel" | null;
  spotlight_enabled?: boolean;
  plan?: "free" | "pro";
}

/**
 * Remove any embedded metadata tag from a bio string.
 */
export function cleanBio(bio?: string | null): string {
  if (!bio) return "";
  const regex = new RegExp(`${META_PREFIX}[\\s\\S]*?${META_SUFFIX}`, "g");
  return bio.replace(regex, "").trim();
}

/**
 * Extract embedded metadata from a bio string.
 */
export function extractMetadataFromBio(bio?: string | null): ProfileMetadata {
  if (!bio) return {};
  const startIndex = bio.indexOf(META_PREFIX);
  if (startIndex === -1) return {};

  const jsonStart = startIndex + META_PREFIX.length;
  const endIndex = bio.indexOf(META_SUFFIX, jsonStart);
  if (endIndex === -1) return {};

  const jsonStr = bio.slice(jsonStart, endIndex).trim();
  try {
    return JSON.parse(jsonStr);
  } catch (err) {
    console.error("Failed to parse profile metadata from bio:", err);
    return {};
  }
}

/**
 * Hydrates a raw profile by extracting metadata (featured_creators, status_message, status_style)
 * from the bio field if the columns do not exist directly in the database.
 */
export function unpackProfile(raw: any): Profile {
  if (!raw) return raw;

  const metadata = extractMetadataFromBio(raw.bio);
  const cleaned = cleanBio(raw.bio);

  let featured = raw.spotlight_creators || raw.featured_creators;
  if (!featured || (Array.isArray(featured) && featured.length === 0)) {
    if (metadata.spotlight_creators && Array.isArray(metadata.spotlight_creators)) {
      featured = metadata.spotlight_creators;
    } else if (metadata.featured_creators && Array.isArray(metadata.featured_creators)) {
      featured = metadata.featured_creators;
    }
  }

  // Parse if it was returned as string from DB
  if (typeof featured === "string") {
    try {
      featured = JSON.parse(featured);
    } catch {
      featured = [];
    }
  }

  const status_message =
    raw.status_message !== undefined && raw.status_message !== null
      ? raw.status_message
      : metadata.status_message || null;

  const status_style =
    raw.status_style !== undefined && raw.status_style !== null
      ? raw.status_style
      : metadata.status_style || "speech";

  const spotlight_enabled =
    raw.spotlight_enabled !== undefined && raw.spotlight_enabled !== null
      ? Boolean(raw.spotlight_enabled)
      : Boolean(metadata.spotlight_enabled ?? false);

  const plan =
    raw.plan === "pro" || metadata.plan === "pro"
      ? "pro"
      : "free";

  return {
    ...raw,
    theme: raw.theme || "midnight",
    plan,
    plan_status: raw.plan_status || (plan === "pro" ? "active" : null),
    billing_interval: raw.billing_interval || null,
    current_period_end: raw.current_period_end || null,
    provider_customer_id: raw.provider_customer_id || null,
    provider_subscription_id: raw.provider_subscription_id || null,
    spotlight_enabled,
    bio: cleaned,
    spotlight_creators: Array.isArray(featured) ? featured : [],
    featured_creators: Array.isArray(featured) ? featured : [],
    status_message,
    status_style,
  };
}

/**
 * Packs profile updates into safe database fields.
 * Embeds featured_creators, status_message, and status_style into the bio field as an invisible HTML comment tag,
 * ensuring persistence on Supabase without requiring new table columns.
 */
export function packProfileUpdates(
  updates: Partial<Profile>,
  currentProfile: Profile
): { dbPayload: Record<string, any>; updatedProfile: Profile } {
  // Determine final values for all fields
  const finalFeatured =
    updates.spotlight_creators !== undefined
      ? updates.spotlight_creators
      : updates.featured_creators !== undefined
      ? updates.featured_creators
      : currentProfile.spotlight_creators || currentProfile.featured_creators || [];

  const finalStatusMessage =
    updates.status_message !== undefined
      ? updates.status_message
      : currentProfile.status_message || null;

  const finalStatusStyle =
    updates.status_style !== undefined
      ? updates.status_style
      : currentProfile.status_style || "speech";

  const finalSpotlight =
    updates.spotlight_enabled !== undefined
      ? Boolean(updates.spotlight_enabled)
      : Boolean(currentProfile.spotlight_enabled ?? false);

  const finalPlan =
    updates.plan !== undefined
      ? updates.plan
      : currentProfile.plan || "free";

  const rawBio = updates.bio !== undefined ? updates.bio : currentProfile.bio || "";
  const cleanedBio = cleanBio(rawBio);

  // Construct metadata object
  const meta: ProfileMetadata = {};
  if (Array.isArray(finalFeatured) && finalFeatured.length > 0) {
    meta.spotlight_creators = finalFeatured;
    meta.featured_creators = finalFeatured;
  }
  if (finalStatusMessage) {
    meta.status_message = finalStatusMessage;
  }
  if (finalStatusStyle) {
    meta.status_style = finalStatusStyle;
  }
  meta.spotlight_enabled = finalSpotlight;
  if (finalPlan === "pro") {
    meta.plan = "pro";
  }

  // Pack metadata into bio
  let packedBio = cleanedBio;
  if (Object.keys(meta).length > 0) {
    const metaTag = `${META_PREFIX}${JSON.stringify(meta)}${META_SUFFIX}`;
    packedBio = cleanedBio ? `${cleanedBio}\n${metaTag}` : metaTag;
  }

  // Updated in-memory profile
  const updatedProfile: Profile = {
    ...currentProfile,
    ...updates,
    bio: cleanedBio,
    spotlight_creators: finalFeatured,
    featured_creators: finalFeatured,
    status_message: finalStatusMessage,
    status_style: finalStatusStyle,
    spotlight_enabled: finalSpotlight,
  };

  // Safe columns that exist in the Supabase `profiles` table:
  const dbPayload: Record<string, any> = {
    bio: packedBio,
    updated_at: new Date().toISOString(),
  };

  if (updates.username !== undefined) dbPayload.username = updates.username;
  if (updates.display_name !== undefined) dbPayload.display_name = updates.display_name;
  if (updates.avatar_url !== undefined) dbPayload.avatar_url = updates.avatar_url;
  if (updates.theme !== undefined) dbPayload.theme = updates.theme;
  if (updates.spotlight_enabled !== undefined) dbPayload.spotlight_enabled = updates.spotlight_enabled;
  if (updates.spotlight_creators !== undefined) {
    dbPayload.spotlight_creators = updates.spotlight_creators;
    dbPayload.featured_creators = updates.spotlight_creators;
  } else if (updates.featured_creators !== undefined) {
    dbPayload.spotlight_creators = updates.featured_creators;
    dbPayload.featured_creators = updates.featured_creators;
  }

  return { dbPayload, updatedProfile };
}
