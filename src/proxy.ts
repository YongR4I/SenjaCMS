import { NextResponse, type NextRequest } from "next/server";

const PROTECTED_PREFIXES = ["/dashboard", "/hero", "/about", "/our-work", "/partners", "/contact"];

const API_URL =
  process.env.API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:8000/api/v1";

const TOKEN_COOKIE = "senja_cms_token";

/**
 * Session guard (Next.js proxy). The `senja_cms_token` cookie carries the real
 * Passport access token, verified against the backend before any protected
 * route is served — a forged or expired value fails verification and redirects
 * to /login.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(TOKEN_COOKIE)?.value;

  if (pathname === "/login") {
    return NextResponse.next();
  }

  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  if (!token || !(await isTokenValid(token))) {
    return redirectToLogin(request, pathname);
  }

  return NextResponse.next();
}

async function isTokenValid(token: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      cache: "no-store",
    });
    return res.ok;
  } catch {
    return false;
  }
}

function redirectToLogin(request: NextRequest, pathname: string) {
  const url = new URL("/login", request.url);
  url.searchParams.set("next", pathname);
  const response = NextResponse.redirect(url);
  response.cookies.delete(TOKEN_COOKIE);
  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/hero/:path*", "/about/:path*", "/our-work/:path*", "/partners/:path*", "/contact/:path*", "/login"],
};
