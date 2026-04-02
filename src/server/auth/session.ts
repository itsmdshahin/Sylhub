//src/server/auth/session.ts

import { SignJWT, jwtVerify } from "jose";

export const COOKIE_NAME = "social_session";
const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export const authCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 7, // 7 days
};

export async function createSessionToken(payload: {
  userId: string;
  email: string;
}) {
  return new SignJWT({ email: payload.email })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.userId)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifySessionToken(token: string) {
  const { payload } = await jwtVerify(token, secret);
  return {
    userId: payload.sub ?? "",
    email: String(payload.email ?? ""),
  };
}