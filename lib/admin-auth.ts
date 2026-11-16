import crypto from "crypto";
import { cookies } from "next/headers";

export const ADMIN_PASS = process.env.ADMIN_SECRET_KEY || "researchandinnovationstudios";
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "learner.prateek.upmanyu@gmail.com";

export function getAdminSessionToken(): string {
  return crypto
    .createHash("sha256")
    .update(`${ADMIN_PASS}_linkface_secure_admin_salt_2026`)
    .digest("hex");
}

export function verifyAdminPassword(pass: string): boolean {
  if (!pass) return false;
  return pass.trim() === ADMIN_PASS;
}

export async function isAuthorizedAdmin(req?: Request | null, userEmail?: string | null): Promise<boolean> {
  // 1. Direct authorization via header
  if (req) {
    const headerKey = req.headers.get("x-admin-key");
    if (headerKey && (headerKey.trim() === ADMIN_PASS || headerKey.trim() === getAdminSessionToken())) {
      return true;
    }
  }

  // 2. Direct authorization if authenticated user is the designated admin email
  if (userEmail && userEmail.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
    return true;
  }

  // 3. Authorization via secure HTTP-only admin session cookie
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("linkface_admin_session")?.value;
    if (token && token === getAdminSessionToken()) {
      return true;
    }
  } catch {
    // Context without cookie store
  }

  return false;
}
