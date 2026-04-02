//src/app/api/auth/logout/route.ts

import { NextResponse } from "next/server";
import { COOKIE_NAME } from "@/src/server/auth/session";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, "", {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
  });
  return res;
}