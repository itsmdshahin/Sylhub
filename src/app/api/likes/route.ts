//src/app/api/likes/route.ts
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/src/server/auth/current-user";
import { supabaseAdmin } from "@/src/server/db/supabase-admin";
import { likeSchema } from "@/src/server/validators/engagement";

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = likeSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid like payload" }, { status: 400 });
  }

  const { postId, commentId, replyId } = parsed.data;

  let query = supabaseAdmin.from("likes").select("*").eq("user_id", user.id);

  if (postId) query = query.eq("post_id", postId);
  if (commentId) query = query.eq("comment_id", commentId);
  if (replyId) query = query.eq("reply_id", replyId);

  const { data: existing, error: existingError } = await query.maybeSingle();

  if (existingError) {
    return NextResponse.json({ error: existingError.message }, { status: 500 });
  }

  if (existing) {
    const { error } = await supabaseAdmin
      .from("likes")
      .delete()
      .eq("id", existing.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      liked: false,
      target: {
        postId: postId ?? null,
        commentId: commentId ?? null,
        replyId: replyId ?? null,
      },
    });
  }

  const { data, error } = await supabaseAdmin
    .from("likes")
    .insert({
      user_id: user.id,
      post_id: postId ?? null,
      comment_id: commentId ?? null,
      reply_id: replyId ?? null,
    })
    .select("*")
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: error?.message || "Failed to like" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    liked: true,
    like: data,
    target: {
      postId: postId ?? null,
      commentId: commentId ?? null,
      replyId: replyId ?? null,
    },
  });
}