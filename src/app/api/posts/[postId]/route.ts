// src/app/api/posts/[postId]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/src/server/auth/current-user";
import { supabaseAdmin } from "@/src/server/db/supabase-admin";
import { updatePostSchema } from "@/src/server/validators/engagement";

// =========================
// PATCH POST
// =========================
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ postId: string }> }
) {
  const { postId } = await context.params;

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = updatePostSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid post data" }, { status: 400 });
  }

  const { data: post, error: fetchError } = await supabaseAdmin
    .from("posts")
    .select("id, user_id")
    .eq("id", postId)
    .maybeSingle();

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 });
  }

  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  if (post.user_id !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const updateData: Record<string, any> = {};

  if (parsed.data.content !== undefined) {
    updateData.content = parsed.data.content;
  }

  if (parsed.data.imageUrl !== undefined) {
    updateData.image_url = parsed.data.imageUrl;
  }

  if (parsed.data.visibility !== undefined) {
    updateData.visibility = parsed.data.visibility.toLowerCase();
  }

  const { data, error } = await supabaseAdmin
    .from("posts")
    .update(updateData)
    .eq("id", postId)
    .select("id, content, image_url, visibility, created_at, user_id")
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: error?.message || "Failed to update post" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    post: {
      id: data.id,
      content: data.content,
      imageUrl: data.image_url,
      visibility: String(data.visibility).toUpperCase() as "PUBLIC" | "PRIVATE",
      createdAt: data.created_at,
    },
  });
}

// =========================
// DELETE POST
// =========================
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ postId: string }> }
) {
  const { postId } = await context.params;

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: post, error: fetchError } = await supabaseAdmin
    .from("posts")
    .select("id, user_id")
    .eq("id", postId)
    .maybeSingle();

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 });
  }

  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  if (post.user_id !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { error } = await supabaseAdmin
    .from("posts")
    .delete()
    .eq("id", postId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ deleted: true });
}