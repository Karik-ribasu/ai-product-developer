import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { STUB_AUTH_COOKIE_NAME } from "@/lib/stub-auth/constants";

function isProtectedPath(pathname: string): boolean {
  return (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/activity-feed") ||
    pathname.startsWith("/tasks")
  );
}

export function middleware(req: NextRequest): NextResponse {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/_next") || pathname === "/favicon.ico") {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/") || pathname.startsWith("/login")) {
    return NextResponse.next();
  }

  if (isProtectedPath(pathname) && req.cookies.get(STUB_AUTH_COOKIE_NAME)?.value !== "1") {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
