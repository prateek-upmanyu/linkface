import { NextRequest, NextResponse } from "next/server";
import { verifyAdminPassword, getAdminSessionToken } from "@/lib/admin-auth";
import { checkRateLimit, getClientIp } from "@/lib/security";

export async function POST(req: NextRequest) {
  try {
    const clientIp = getClientIp(req);
    // Rate limit: max 5 login attempts per 15 minutes per IP to prevent brute force
    const rate = checkRateLimit(`rate:admin_login:${clientIp}`, 5, 900000);
    if (!rate.isAllowed) {
      return NextResponse.json(
        { error: "Too many login attempts. Please wait 15 minutes." },
        { status: 429, headers: { "Retry-After": String(Math.ceil(rate.resetMs / 1000)) } }
      );
    }

    const body = await req.json().catch(() => ({}));
    const { password } = body;

    if (!verifyAdminPassword(password)) {
      return NextResponse.json({ error: "Invalid master passkey" }, { status: 401 });
    }

    const token = getAdminSessionToken();
    const response = NextResponse.json({ ok: true, token, message: "Welcome Admin" });

    // Set secure HTTP-only cookie valid for 7 days
    response.cookies.set("linkface_admin_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;
  } catch (err: any) {
    console.error("Admin login error:", err);
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
  }
}
