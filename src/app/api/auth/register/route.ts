// src/app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/src/server/db/supabase-admin";
import { registerSchema } from "@/src/server/validators/auth";
import { hashPassword } from "@/src/server/auth/password";
import {
  COOKIE_NAME,
  authCookieOptions,
  createSessionToken,
} from "@/src/server/auth/session";

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid registration data" },
      { status: 400 }
    );
  }

  const { firstName, lastName, email, password } = parsed.data;

  const { data: existing, error: existingError } = await supabaseAdmin
    .from("users")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (existingError) {
    console.error("Existing user check error:", existingError);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }

  if (existing) {
    return NextResponse.json({ error: "Email already exists" }, { status: 409 });
  }

  const hashedPassword = await hashPassword(password);

  const { data: user, error } = await supabaseAdmin
    .from("users")
    .insert({
      first_name: firstName,
      last_name: lastName,
      email,
      password: hashedPassword,
    })
    .select("id, first_name, last_name, email, created_at")
    .single();

  if (error || !user) {
    console.error("Register insert error:", error);
    return NextResponse.json(
      { error: error?.message || "Registration failed" },
      { status: 500 }
    );
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
        createdAt: user.created_at,
      },
    },
    { status: 201 }
  );

  res.cookies.set(COOKIE_NAME, token, authCookieOptions);
  return res;
}