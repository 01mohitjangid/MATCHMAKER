import { NextResponse, type NextRequest } from "next/server";

import { SESSION_COOKIE, isValidSession } from "@/lib/session";

/**
 * Route protection at the edge:
 *   • Unauthenticated → /dashboard, /clients/*  ⇒ redirect to /login
 *   • Authenticated   → /login                  ⇒ redirect to /dashboard
 */
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const authed = await isValidSession(req.cookies.get(SESSION_COOKIE)?.value);

  const isProtected =
    pathname.startsWith("/dashboard") || pathname.startsWith("/clients");

  if (isProtected && !authed) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (pathname === "/login" && authed) {
    const url = req.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/clients/:path*", "/login"],
};
