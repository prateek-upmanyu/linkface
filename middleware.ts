import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return supabaseResponse;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  // Refresh user session if token is near expiration
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const url = request.nextUrl.clone();

  // If already logged in and visiting login or signup, redirect to dashboard preserving cookies
  if (user && (url.pathname === "/login" || url.pathname === "/signup")) {
    url.pathname = "/dashboard";
    const redirectRes = NextResponse.redirect(url);
    // Copy all updated session cookies to redirect response
    supabaseResponse.cookies.getAll().forEach((c) => {
      redirectRes.cookies.set(c.name, c.value);
    });
    return redirectRes;
  }

  // If not logged in and visiting protected routes, redirect to login
  if (!user && (url.pathname === "/dashboard" || url.pathname === "/onboarding")) {
    if (supabaseUrl && supabaseAnonKey && !supabaseUrl.includes("placeholder")) {
      url.pathname = "/login";
      const redirectRes = NextResponse.redirect(url);
      supabaseResponse.cookies.getAll().forEach((c) => {
        redirectRes.cookies.set(c.name, c.value);
      });
      return redirectRes;
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
