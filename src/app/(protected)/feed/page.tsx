//src/app/(protected)/feed/page.tsx

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/src/server/auth/current-user";
import { supabaseAdmin } from "@/src/server/db/supabase-admin";
import FeedClient from "@/components/feed/FeedClient";
import Stories from "@/components/feed/Stories";

type UserLite = {
  id: string;
  firstName: string;
  lastName: string;
};

function toUserLite(user: any): UserLite {
  return {
    id: user.id,
    firstName: user.first_name ?? user.firstName ?? "",
    lastName: user.last_name ?? user.lastName ?? "",
  };
}

function unique(values: string[]) {
  return [...new Set(values.filter(Boolean))];
}

export default async function FeedPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const { data: postsRaw, error: postsError } = await supabaseAdmin
    .from("posts")
    .select("id, content, image_url, visibility, created_at, user_id")
    .or(`visibility.eq.public,user_id.eq.${user.id}`)
    .order("created_at", { ascending: false })
    .limit(20);

  if (postsError || !postsRaw) {
    console.error(postsError);
    return <div>Failed to load feed</div>;
  }

  const postIds = postsRaw.map((p) => p.id);

  const { data: commentsRaw } = postIds.length
    ? await supabaseAdmin
        .from("comments")
        .select("id, content, created_at, user_id, post_id")
        .in("post_id", postIds)
        .order("created_at", { ascending: true })
    : { data: [] as any[] };

  const commentIds = (commentsRaw ?? []).map((c) => c.id);

  const { data: repliesRaw } = commentIds.length
    ? await supabaseAdmin
        .from("replies")
        .select("id, content, created_at, user_id, comment_id")
        .in("comment_id", commentIds)
        .order("created_at", { ascending: true })
    : { data: [] as any[] };

  const { data: likesRaw } = await supabaseAdmin
    .from("likes")
    .select("id, user_id, post_id, comment_id, reply_id, created_at");

  const allUserIds = unique([
    user.id,
    ...postsRaw.map((p) => p.user_id),
    ...(commentsRaw ?? []).map((c) => c.user_id),
    ...(repliesRaw ?? []).map((r) => r.user_id),
    ...(likesRaw ?? []).map((l) => l.user_id),
  ]);

  const { data: usersRaw } = allUserIds.length
    ? await supabaseAdmin
        .from("users")
        .select("id, first_name, last_name")
        .in("id", allUserIds)
    : { data: [] as any[] };

  const usersMap = new Map<string, UserLite>(
    (usersRaw ?? []).map((u) => [u.id, toUserLite(u)])
  );

  const posts = postsRaw.map((post) => {
    const postComments = (commentsRaw ?? []).filter((c) => c.post_id === post.id);
    const postLikes = (likesRaw ?? []).filter((l) => l.post_id === post.id);

    const comments = postComments.map((comment) => {
      const commentReplies = (repliesRaw ?? []).filter(
        (r) => r.comment_id === comment.id
      );
      const commentLikes = (likesRaw ?? []).filter(
        (l) => l.comment_id === comment.id
      );

      const replies = commentReplies.map((reply) => {
        const replyLikes = (likesRaw ?? []).filter((l) => l.reply_id === reply.id);

        return {
          id: reply.id,
          content: reply.content,
          createdAt: reply.created_at,
          user: usersMap.get(reply.user_id) ?? {
            id: reply.user_id,
            firstName: "",
            lastName: "",
          },
          likes: replyLikes.slice(0, 3).map((like) => ({
            user: usersMap.get(like.user_id) ?? {
              id: like.user_id,
              firstName: "",
              lastName: "",
            },
          })),
          _count: {
            likes: replyLikes.length,
          },
        };
      });

      return {
        id: comment.id,
        content: comment.content,
        createdAt: comment.created_at,
        user: usersMap.get(comment.user_id) ?? {
          id: comment.user_id,
          firstName: "",
          lastName: "",
        },
        likes: commentLikes.slice(0, 3).map((like) => ({
          user: usersMap.get(like.user_id) ?? {
            id: like.user_id,
            firstName: "",
            lastName: "",
          },
        })),
        replies,
        _count: {
          likes: commentLikes.length,
          replies: replies.length,
        },
      };
    });

    return {
      id: post.id,
      content: post.content,
      imageUrl: post.image_url,
      visibility: String(post.visibility).toUpperCase() as "PUBLIC" | "PRIVATE",
      createdAt: post.created_at,
      user: usersMap.get(post.user_id) ?? {
        id: post.user_id,
        firstName: "",
        lastName: "",
      },
      likes: postLikes.slice(0, 3).map((like) => ({
        user: usersMap.get(like.user_id) ?? {
          id: like.user_id,
          firstName: "",
          lastName: "",
        },
      })),
      comments,
      _count: {
        likes: postLikes.length,
        comments: comments.length,
      },
    };
  });

  return(
    <> 
      <Stories  />
      <FeedClient currentUser={user} initialPosts={posts} />
    </>
  ); 
}