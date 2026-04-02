// src/app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/src/server/db/supabase-admin";
import { loginSchema } from "@/src/server/validators/auth";
import { comparePassword } from "@/src/server/auth/password";
import {
  COOKIE_NAME,
  authCookieOptions,
  createSessionToken,
} from "@/src/server/auth/session";

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid login data" }, { status: 400 });
  }

  const { email, password } = parsed.data;

  const { data: user, error } = await supabaseAdmin
    .from("users")
    .select("id, first_name, last_name, email, password")
    .eq("email", email)
    .maybeSingle();

  if (error || !user) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const ok = await comparePassword(password, user.password);
  if (!ok) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = await createSessionToken({
    userId: user.id,
    email: user.email,
  });

  const res = NextResponse.json(
    {
      user: {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
      },
    },
    { status: 200 }
  );

  res.cookies.set(COOKIE_NAME, token, authCookieOptions);
  return res;
}