//src/app/api/posts/route.ts
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/src/server/auth/current-user";
import { supabaseAdmin } from "@/src/server/db/supabase-admin";
import { createPostSchema } from "@/src/server/validators/post";

type UserLite = {
  id: string;
  firstName: string;
  lastName: string;
};

type LikeLite = {
  user: UserLite;
};

type ReplyLite = {
  id: string;
  content: string;
  createdAt: string;
  user: UserLite;
  likes: LikeLite[];
  _count: { likes: number };
};

type CommentLite = {
  id: string;
  content: string;
  createdAt: string;
  user: UserLite;
  likes: LikeLite[];
  replies: ReplyLite[];
  _count: { likes: number; replies: number };
};

type PostLite = {
  id: string;
  content: string;
  imageUrl: string | null;
  visibility: "PUBLIC" | "PRIVATE";
  createdAt: string;
  user: UserLite;
  _count: { likes: number; comments: number };
  likes: LikeLite[];
  comments: CommentLite[];
};

function toUserLite(user: any): UserLite {
  return {
    id: user.id,
    firstName: user.first_name,
    lastName: user.last_name,
  };
}

function unique(values: string[]) {
  return [...new Set(values.filter(Boolean))];
}

function groupBy<T extends Record<string, any>>(rows: T[], key: keyof T) {
  const map = new Map<string, T[]>();

  for (const row of rows) {
    const groupKey = String(row[key] ?? "");
    if (!groupKey) continue;
    const current = map.get(groupKey) ?? [];
    current.push(row);
    map.set(groupKey, current);
  }

  return map;
}

function sortAsc<T extends { created_at: string }>(rows: T[]) {
  return [...rows].sort((a, b) => a.created_at.localeCompare(b.created_at));
}

function sortDesc<T extends { created_at: string }>(rows: T[]) {
  return [...rows].sort((a, b) => b.created_at.localeCompare(a.created_at));
}

async function loadUsers(userIds: string[]) {
  if (!userIds.length) return new Map<string, UserLite>();

  const { data, error } = await supabaseAdmin
    .from("users")
    .select("id, first_name, last_name")
    .in("id", userIds);

  if (error || !data) return new Map<string, UserLite>();

  return new Map<string, UserLite>(
    data.map((u: any) => [u.id, toUserLite(u)])
  );
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = createPostSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid post data" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("posts")
    .insert({
      user_id: user.id,
      content: parsed.data.content,
      image_url: parsed.data.imageUrl ?? null,
      visibility: parsed.data.visibility.toLowerCase(), // PUBLIC -> public
    })
    .select("id, content, image_url, visibility, created_at, user_id")
    .single();

  if (error || !data) {
    console.error("Create post error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to create post" },
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      post: {
        id: data.id,
        content: data.content,
        imageUrl: data.image_url,
        visibility: String(data.visibility).toUpperCase() as "PUBLIC" | "PRIVATE",
        createdAt: data.created_at,
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
        },
        _count: { likes: 0, comments: 0 },
        likes: [],
        comments: [],
      },
    },
    { status: 201 }
  );
}

export async function GET(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const cursor = url.searchParams.get("cursor");
  const limit = Math.min(Number(url.searchParams.get("limit") ?? 10), 20);

  let postsQuery = supabaseAdmin
    .from("posts")
    .select("id, content, image_url, visibility, created_at, updated_at, user_id")
    .or(`visibility.eq.public,user_id.eq.${user.id}`)
    .order("created_at", { ascending: false })
    .order("id", { ascending: false })
    .limit(limit + 1);

  if (cursor) {
    const { data: cursorPost } = await supabaseAdmin
      .from("posts")
      .select("created_at")
      .eq("id", cursor)
      .maybeSingle();

    if (cursorPost?.created_at) {
      postsQuery = postsQuery.lt("created_at", cursorPost.created_at);
    }
  }

  const { data: postsRaw, error: postsError } = await postsQuery;

  if (postsError || !postsRaw) {
    console.error("Load posts error:", postsError);
    return NextResponse.json(
      { error: postsError?.message || "Failed to load posts" },
      { status: 500 }
    );
  }

  const visiblePosts = postsRaw.slice(0, limit);
  const hasMore = postsRaw.length > limit;
  const nextCursor = hasMore ? visiblePosts[visiblePosts.length - 1]?.id ?? null : null;

  const postIds = visiblePosts.map((p) => p.id);

  const { data: commentsRaw } = postIds.length
    ? await supabaseAdmin
        .from("comments")
        .select("id, content, created_at, user_id, post_id")
        .in("post_id", postIds)
        .order("created_at", { ascending: true })
    : { data: [] as any[] };

  const comments = commentsRaw ?? [];
  const commentIds = comments.map((c) => c.id);

  const { data: repliesRaw } = commentIds.length
    ? await supabaseAdmin
        .from("replies")
        .select("id, content, created_at, user_id, comment_id")
        .in("comment_id", commentIds)
        .order("created_at", { ascending: true })
    : { data: [] as any[] };

  const replies = repliesRaw ?? [];
  const replyIds = replies.map((r) => r.id);

  const { data: postLikesRaw } = postIds.length
    ? await supabaseAdmin
        .from("likes")
        .select("id, created_at, user_id, post_id, comment_id, reply_id")
        .in("post_id", postIds)
    : { data: [] as any[] };

  const { data: commentLikesRaw } = commentIds.length
    ? await supabaseAdmin
        .from("likes")
        .select("id, created_at, user_id, post_id, comment_id, reply_id")
        .in("comment_id", commentIds)
    : { data: [] as any[] };

  const { data: replyLikesRaw } = replyIds.length
    ? await supabaseAdmin
        .from("likes")
        .select("id, created_at, user_id, post_id, comment_id, reply_id")
        .in("reply_id", replyIds)
    : { data: [] as any[] };

  const postLikes = postLikesRaw ?? [];
  const commentLikes = commentLikesRaw ?? [];
  const replyLikes = replyLikesRaw ?? [];

  const allUserIds = unique([
    user.id,
    ...visiblePosts.map((p) => p.user_id),
    ...comments.map((c) => c.user_id),
    ...replies.map((r) => r.user_id),
    ...postLikes.map((l) => l.user_id),
    ...commentLikes.map((l) => l.user_id),
    ...replyLikes.map((l) => l.user_id),
  ]);

  const usersMap = await loadUsers(allUserIds);

  const commentsByPost = groupBy(comments, "post_id");
  const repliesByComment = groupBy(replies, "comment_id");
  const postLikesByPost = groupBy(postLikes, "post_id");
  const commentLikesByComment = groupBy(commentLikes, "comment_id");
  const replyLikesByReply = groupBy(replyLikes, "reply_id");

  const posts: PostLite[] = visiblePosts.map((post) => {
    const postAuthor = usersMap.get(post.user_id) ?? {
      id: post.user_id,
      firstName: "",
      lastName: "",
    };

    const postLikeRows = sortDesc(postLikesByPost.get(post.id) ?? []);
    const commentRows = sortAsc(commentsByPost.get(post.id) ?? []);

    const commentsForPost: CommentLite[] = commentRows.map((comment) => {
      const commentAuthor = usersMap.get(comment.user_id) ?? {
        id: comment.user_id,
        firstName: "",
        lastName: "",
      };

      const commentLikeRows = sortDesc(commentLikesByComment.get(comment.id) ?? []);
      const replyRows = sortAsc(repliesByComment.get(comment.id) ?? []);

      const repliesForComment: ReplyLite[] = replyRows.map((reply) => {
        const replyAuthor = usersMap.get(reply.user_id) ?? {
          id: reply.user_id,
          firstName: "",
          lastName: "",
        };

        const likeRows = sortDesc(replyLikesByReply.get(reply.id) ?? []);

        return {
          id: reply.id,
          content: reply.content,
          createdAt: reply.created_at,
          user: replyAuthor,
          likes: likeRows.slice(0, 3).map((like) => ({
            user: usersMap.get(like.user_id) ?? {
              id: like.user_id,
              firstName: "",
              lastName: "",
            },
          })),
          _count: {
            likes: likeRows.length,
          },
        };
      });

      return {
        id: comment.id,
        content: comment.content,
        createdAt: comment.created_at,
        user: commentAuthor,
        likes: commentLikeRows.slice(0, 3).map((like) => ({
          user: usersMap.get(like.user_id) ?? {
            id: like.user_id,
            firstName: "",
            lastName: "",
          },
        })),
        replies: repliesForComment,
        _count: {
          likes: commentLikeRows.length,
          replies: repliesForComment.length,
        },
      };
    });

    return {
      id: post.id,
      content: post.content,
      imageUrl: post.image_url,
      visibility: String(post.visibility).toUpperCase() as "PUBLIC" | "PRIVATE",
      createdAt: post.created_at,
      user: postAuthor,
      _count: {
        likes: postLikeRows.length,
        comments: commentsForPost.length,
      },
      likes: postLikeRows.slice(0, 3).map((like) => ({
        user: usersMap.get(like.user_id) ?? {
          id: like.user_id,
          firstName: "",
          lastName: "",
        },
      })),
      comments: commentsForPost,
    };
  });

  return NextResponse.json({
    posts,
    nextCursor,
  });
}