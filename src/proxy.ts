//src/proxy.ts

import { NextResponse, type NextRequest } from "next/server";
import { COOKIE_NAME } from "@/src/server/auth/session";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/feed")) {
    return NextResponse.next();
  }

  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/feed/:path*"],
};