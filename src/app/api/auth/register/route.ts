import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/src/server/db/supabase-admin";
import { registerSchema } from "@/src/server/validators/auth";
import { hashPassword } from "@/src/server/auth/password";
import {
  COOKIE_NAME,
  authCookieOptions,
  createSessionToken,
} from "@/src/server/auth/session";
import { rateLimit } from "@/src/lib/rate-limit"; // ✅ correct path

export async function POST(req: Request) {
  try {
    // ✅ RATE LIMIT (FIRST STEP)
    const ip = req.headers.get("x-forwarded-for") || "unknown";

    const allowed = rateLimit(ip);

    if (!allowed) {
      return NextResponse.json(
        { error: "Too many attempts. Try again later." },
        { status: 429 }
      );
    }

    // ⬇️ NORMAL FLOW STARTS
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    // ✅ Field validation
    if (!parsed.success) {
      return NextResponse.json(
        { errors: parsed.error.flatten().fieldErrors },
        { status: 422 }
      );
    }

    const { firstName, lastName, email, password } = parsed.data;

    const { data: existing } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    // ✅ Do NOT reveal existence
    if (existing) {
      return NextResponse.json(
        { error: "Unable to register with this email" },
        { status: 400 }
      );
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
      console.error("Register error:", error);
      return NextResponse.json(
        { error: "Registration failed" },
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
  } catch (err) {
    console.error("Register error:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}