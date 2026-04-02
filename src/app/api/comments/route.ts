//src/app/api/comments/route.ts
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/src/server/auth/current-user";
import { supabaseAdmin } from "@/src/server/db/supabase-admin";
import { commentSchema } from "@/src/server/validators/engagement";

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = commentSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid comment data" }, { status: 400 });
  }

  const { data: post } = await supabaseAdmin
    .from("posts")
    .select("id, visibility, user_id")
    .eq("id", parsed.data.postId)
    .maybeSingle();

  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  if (post.visibility !== "public" && post.user_id !== user.id) {
    return NextResponse.json({ error: "Post not accessible" }, { status: 403 });
  }

  const { data, error } = await supabaseAdmin
    .from("comments")
    .insert({
      post_id: parsed.data.postId,
      user_id: user.id,
      content: parsed.data.content,
    })
    .select("id, content, created_at, user_id, post_id")
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: error?.message || "Failed to create comment" },
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      comment: {
        id: data.id,
        content: data.content,
        createdAt: data.created_at,
        user,
        likes: [],
        replies: [],
        _count: { likes: 0, replies: 0 },
      },
    },
    { status: 201 }
  );
}