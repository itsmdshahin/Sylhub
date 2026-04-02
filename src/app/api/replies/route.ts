
//src/app/api/replies/route.ts
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/src/server/auth/current-user";
import { supabaseAdmin } from "@/src/server/db/supabase-admin";
import { replySchema } from "@/src/server/validators/engagement";

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = replySchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid reply data" }, { status: 400 });
  }

  const { data: comment, error: commentError } = await supabaseAdmin
    .from("comments")
    .select("id, post_id")
    .eq("id", parsed.data.commentId)
    .maybeSingle();

  if (commentError) {
    return NextResponse.json({ error: commentError.message }, { status: 500 });
  }

  if (!comment) {
    return NextResponse.json({ error: "Comment not found" }, { status: 404 });
  }

  const { data, error } = await supabaseAdmin
    .from("replies")
    .insert({
      comment_id: parsed.data.commentId,
      user_id: user.id,
      content: parsed.data.content,
    })
    .select("id, content, created_at, user_id, comment_id")
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: error?.message || "Failed to create reply" },
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      reply: {
        id: data.id,
        content: data.content,
        createdAt: data.created_at,
        user,
        likes: [],
        _count: { likes: 0 },
      },
    },
    { status: 201 }
  );
}