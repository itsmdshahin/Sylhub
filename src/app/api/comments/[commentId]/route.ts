import { NextResponse } from "next/server";
import { getCurrentUser } from "@/src/server/auth/current-user";
import { supabaseAdmin } from "@/src/server/db/supabase-admin";
import { updateCommentSchema } from "@/src/server/validators/engagement";

export async function PATCH(
  req: Request,
  { params }: { params: { commentId: string } }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = updateCommentSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid comment data" }, { status: 400 });
  }

  const { data: comment, error: fetchError } = await supabaseAdmin
    .from("comments")
    .select("id, user_id")
    .eq("id", params.commentId)
    .maybeSingle();

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 });
  }

  if (!comment) {
    return NextResponse.json({ error: "Comment not found" }, { status: 404 });
  }

  if (comment.user_id !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { data, error } = await supabaseAdmin
    .from("comments")
    .update({ content: parsed.data.content })
    .eq("id", params.commentId)
    .select("id, content, created_at, user_id, post_id")
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: error?.message || "Failed to update comment" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    comment: {
      id: data.id,
      content: data.content,
      createdAt: data.created_at,
      postId: data.post_id,
    },
  });
}

export async function DELETE(
  req: Request,
  { params }: { params: { commentId: string } }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: comment, error: fetchError } = await supabaseAdmin
    .from("comments")
    .select("id, user_id")
    .eq("id", params.commentId)
    .maybeSingle();

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 });
  }

  if (!comment) {
    return NextResponse.json({ error: "Comment not found" }, { status: 404 });
  }

  if (comment.user_id !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { error } = await supabaseAdmin
    .from("comments")
    .delete()
    .eq("id", params.commentId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ deleted: true });
}