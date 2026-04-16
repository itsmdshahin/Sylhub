import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/src/server/db/supabase-admin";
import { loginSchema } from "@/src/server/validators/auth";
import { comparePassword } from "@/src/server/auth/password";
import {
  COOKIE_NAME,
  authCookieOptions,
  createSessionToken,
} from "@/src/server/auth/session";
import { rateLimit } from "@/src/lib/rate-limit";

// ✅ Dummy hash (prevents timing attack)
const FAKE_HASH =
  "$2a$12$C6UzMDM.H6dfI/f/IKcEeO7yY9l9g1p5MNpQe6V1s5q9gK7KzQeK6";

export async function POST(req: Request) {
  try {
    // ✅ ADD RATE LIMIT HERE (FIRST THING)
    const ip = req.headers.get("x-forwarded-for") || "unknown";

    const allowed = rateLimit(ip);

    if (!allowed) {
      return NextResponse.json(
        { error: "Too many attempts. Try again later." },
        { status: 429 }
      );
    }

    // ⬇️ THEN continue normal flow
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { errors: parsed.error.flatten().fieldErrors },
        { status: 422 }
      );
    }

    const { email, password } = parsed.data;

    const { data: user } = await supabaseAdmin
      .from("users")
      .select("id, first_name, last_name, email, password")
      .eq("email", email)
      .maybeSingle();

    const hash = user?.password || FAKE_HASH;
    const isValid = await comparePassword(password, hash);

    if (!user || !isValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
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
        },
      },
      { status: 200 }
    );

    res.cookies.set(COOKIE_NAME, token, authCookieOptions);

    return res;
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}