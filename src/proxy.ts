import { NextResponse, type NextRequest } from "next/server";

/**
 * Next 16 proxy (ex-middleware). CHEAP gate only: cookie presence, never
 * validity/role — real role checks live in each route group's layout.tsx
 * via getServerSession (docs/frontend/00-architecture.md §3).
 *
 * Cookie names come from Better Auth: plain in dev, `__Secure-` prefixed when
 * the API issues secure cookies in production.
 */

const SESSION_COOKIES = [
  "better-auth.session_token",
  "__Secure-better-auth.session_token",
] as const;

function hasSessionCookie(request: NextRequest): boolean {
  return SESSION_COOKIES.some((name) => request.cookies.has(name));
}

export function proxy(request: NextRequest) {
  if (!hasSessionCookie(request)) {
    const url = request.nextUrl.clone();
    url.pathname = "/masuk";
    // `langsung=1` tells the auth page this is an expired session, not a first
    // visit: show the form, not the two-question gateway.
    url.search = `?next=${encodeURIComponent(request.nextUrl.pathname)}&langsung=1`;
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/hasil/:path*",
    "/admin/:path*",
    "/psikolog/:path*",
    "/instansi/:path*",
  ],
};
