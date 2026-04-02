import { cookies } from "next/headers";
import { supabaseAdmin } from "@/src/server/db/supabase-admin";
import { COOKIE_NAME, verifySessionToken } from "@/src/server/auth/session";

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) return null;

  try {
    const { userId } = await verifySessionToken(token);
    if (!userId) return null;

    const { data, error } = await supabaseAdmin
      .from("users")
      .select("id, first_name, last_name, email, created_at, updated_at")
      .eq("id", userId)
      .single();

    if (error || !data) return null;

    return {
      id: data.id,
      firstName: data.first_name,
      lastName: data.last_name,
      email: data.email,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  } catch {
    return null;
  }
}