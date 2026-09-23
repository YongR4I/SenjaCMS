import { NextResponse, type NextRequest } from "next/server";

const PROTECTED_PREFIXES = ["/dashboard", "/hero", "/about", "/our-work", "/partners", "/contact"];

/**
 * Passport session guard (edge): login sets a `senja_cms_token` presence
 * cookie; RBAC detail (spatie roles/permissions) is enforced by BE +
 * zustand auth-store on the client.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/login") {
    if (request.cookies.get("senja_cms_token")) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  const protected_ = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

  if (protected_ && !request.cookies.get("senja_cms_token")) {
    const url = new URL("/login", request.url);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/hero/:path*", "/about/:path*", "/our-work/:path*", "/partners/:path*", "/contact/:path*", "/login"],
};
