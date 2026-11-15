/**
 * Linkface Security & Input Sanitization Suite
 * Server-side input validation, XSS prevention, SSRF guards, and sliding-window rate limiting.
 */

// Comprehensive reserved words for username protection
export const RESERVED_USERNAMES = new Set([
  "admin",
  "administrator",
  "root",
  "system",
  "security",
  "login",
  "logout",
  "signup",
  "signin",
  "auth",
  "callback",
  "api",
  "dashboard",
  "settings",
  "account",
  "profile",
  "user",
  "users",
  "help",
  "support",
  "terms",
  "privacy",
  "legal",
  "explore",
  "about",
  "contact",
  "billing",
  "pricing",
  "public",
  "static",
  "assets",
  "favicon",
  "robots",
  "sitemap",
  "well-known",
  "alex",
  "linkface",
  "linktree",
  "bio",
  "null",
  "undefined",
  "test",
]);

/**
 * Validates and sanitizes a destination link or social URL.
 * Rejects javascript:, data:, vbscript:, file:, blob:, and malformed URIs to prevent XSS.
 */
export function sanitizeAndValidateUrl(rawUrl?: string | null): {
  isValid: boolean;
  sanitizedUrl: string;
  error?: string;
} {
  if (!rawUrl || typeof rawUrl !== "string") {
    return { isValid: false, sanitizedUrl: "", error: "URL is required." };
  }

  const trimmed = rawUrl.trim();

  // Explicitly block malicious pseudo-schemes
  const dangerousPatterns = [
    /^javascript:/i,
    /^data:/i,
    /^vbscript:/i,
    /^file:/i,
    /^blob:/i,
    /^about:/i,
    /^\/\//, // Protocol-relative URLs that can bypass domain filters
  ];

  for (const pattern of dangerousPatterns) {
    if (pattern.test(trimmed)) {
      return {
        isValid: false,
        sanitizedUrl: "",
        error: "Forbidden URL scheme. Only HTTP and HTTPS destinations are permitted.",
      };
    }
  }

  // Handle contact schemes safely
  if (trimmed.startsWith("mailto:") || trimmed.startsWith("tel:") || trimmed.startsWith("sms:")) {
    if (trimmed.length > 300) {
      return { isValid: false, sanitizedUrl: "", error: "Link exceeds maximum permitted length." };
    }
    return { isValid: true, sanitizedUrl: trimmed };
  }

  // Prepend https:// if protocol is missing
  let target = trimmed;
  if (!/^https?:\/\//i.test(target)) {
    target = `https://${target}`;
  }

  try {
    const parsed = new URL(target);

    // Protocol strictly restricted to http or https
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return { isValid: false, sanitizedUrl: "", error: "Protocol must be HTTP or HTTPS." };
    }

    // Hostname must be valid and contain at least one dot (unless localhost in development)
    if (!parsed.hostname || (!parsed.hostname.includes(".") && parsed.hostname !== "localhost")) {
      return { isValid: false, sanitizedUrl: "", error: "Invalid hostname format." };
    }

    if (target.length > 2048) {
      return { isValid: false, sanitizedUrl: "", error: "URL exceeds maximum permitted length." };
    }

    return { isValid: true, sanitizedUrl: parsed.href };
  } catch {
    return { isValid: false, sanitizedUrl: "", error: "Malformed URL format." };
  }
}

/**
 * Validates username against format restrictions and reserved dictionary words.
 */
export function validateUsername(rawUsername?: string | null): {
  isValid: boolean;
  cleanUsername: string;
  error?: string;
} {
  if (!rawUsername || typeof rawUsername !== "string") {
    return { isValid: false, cleanUsername: "", error: "Username is required." };
  }

  const clean = rawUsername.trim().toLowerCase();

  if (clean.length < 3 || clean.length > 20) {
    return {
      isValid: false,
      cleanUsername: clean,
      error: "Username must be between 3 and 20 characters.",
    };
  }

  // Only lowercase letters, numbers, and underscores allowed
  if (!/^[a-z0-9_]+$/.test(clean)) {
    return {
      isValid: false,
      cleanUsername: clean,
      error: "Username can only contain lowercase letters, numbers, and underscores.",
    };
  }

  if (RESERVED_USERNAMES.has(clean)) {
    return {
      isValid: false,
      cleanUsername: clean,
      error: `The username "${clean}" is reserved by the system.`,
    };
  }

  return { isValid: true, cleanUsername: clean };
}

/**
 * SSRF Guard: Blocks private IP addresses, loopbacks, link-local, and cloud metadata targets.
 */
export function isPrivateOrReservedHost(hostname: string): boolean {
  const host = hostname.toLowerCase().trim();

  // Local and cloud metadata domains
  if (
    host === "localhost" ||
    host.endsWith(".localhost") ||
    host.endsWith(".local") ||
    host.endsWith(".internal") ||
    host.endsWith(".lan") ||
    host === "instance-data" ||
    host === "metadata.google.internal"
  ) {
    return true;
  }

  // Check IP addresses
  // Loopback (127.0.0.0/8, ::1)
  if (host === "127.0.0.1" || host === "::1" || host === "0.0.0.0" || host.startsWith("127.")) {
    return true;
  }

  // AWS/Cloud metadata IP: 169.254.169.254
  if (host.startsWith("169.254.")) {
    return true;
  }

  // Private RFC 1918 ranges
  // 10.0.0.0 - 10.255.255.255
  if (host.startsWith("10.")) {
    return true;
  }

  // 192.168.0.0 - 192.168.255.255
  if (host.startsWith("192.168.")) {
    return true;
  }

  // 172.16.0.0 - 172.31.255.255
  const match172 = host.match(/^172\.(\d+)\./);
  if (match172) {
    const octet = parseInt(match172[1], 10);
    if (octet >= 16 && octet <= 31) return true;
  }

  return false;
}

/**
 * In-memory sliding-window rate limiter for server routes.
 */
interface RateLimitRecord {
  timestamps: number[];
}

const rateLimitStore = new Map<string, RateLimitRecord>();

// Cleanup stale keys every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitStore.entries()) {
      record.timestamps = record.timestamps.filter((t) => now - t < 300000);
      if (record.timestamps.length === 0) {
        rateLimitStore.delete(key);
      }
    }
  }, 300000);
}

export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): { isAllowed: boolean; remaining: number; resetMs: number } {
  const now = Date.now();
  const record = rateLimitStore.get(key) || { timestamps: [] };

  // Filter timestamps within current window
  record.timestamps = record.timestamps.filter((t) => now - t < windowMs);

  if (record.timestamps.length >= limit) {
    const oldest = record.timestamps[0];
    const resetMs = windowMs - (now - oldest);
    return { isAllowed: false, remaining: 0, resetMs: Math.max(0, resetMs) };
  }

  record.timestamps.push(now);
  rateLimitStore.set(key, record);

  return {
    isAllowed: true,
    remaining: limit - record.timestamps.length,
    resetMs: windowMs,
  };
}

/**
 * Extracts client IP address safely from standard headers.
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }
  return "127.0.0.1";
}
