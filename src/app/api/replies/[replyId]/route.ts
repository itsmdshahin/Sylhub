//src/app/api/posts/[postId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/src/server/auth/current-user";
import { supabaseAdmin } from "@/src/server/db/supabase-admin";
import { updateReplySchema } from "@/src/server/validators/engagement";

// =========================
// PATCH REPLY
// =========================
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ replyId: string }> }
) {
  const { replyId } = await context.params;

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = updateReplySchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid reply data" }, { status: 400 });
  }

  const { data: reply, error: fetchError } = await supabaseAdmin
    .from("replies")
    .select("id, user_id")
    .eq("id", replyId)
    .maybeSingle();

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 });
  }

  if (!reply) {
    return NextResponse.json({ error: "Reply not found" }, { status: 404 });
  }

  if (reply.user_id !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { data, error } = await supabaseAdmin
    .from("replies")
    .update({ content: parsed.data.content })
    .eq("id", replyId)
    .select("id, content, created_at, user_id, comment_id")
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: error?.message || "Failed to update reply" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    reply: {
      id: data.id,
      content: data.content,
      createdAt: data.created_at,
      commentId: data.comment_id,
    },
  });
}

// =========================
// DELETE REPLY
// =========================
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ replyId: string }> }
) {
  const { replyId } = await context.params;

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: reply, error: fetchError } = await supabaseAdmin
    .from("replies")
    .select("id, user_id")
    .eq("id", replyId)
    .maybeSingle();

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 });
  }

  if (!reply) {
    return NextResponse.json({ error: "Reply not found" }, { status: 404 });
  }

  if (reply.user_id !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { error } = await supabaseAdmin
    .from("replies")
    .delete()
    .eq("id", replyId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ deleted: true });
}