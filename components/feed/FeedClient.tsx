//src/components/feed/FeedClient.tsx

"use client";

import { FormEvent, useMemo, useState } from "react";
import CreatePost from "./CreatePost"; 

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

type CurrentUser = UserLite;

// =========================
// HELPERS
// =========================
function fullName(user: UserLite | undefined | null) {
  if (!user) return "";
  return `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();
}

function safeCount(value?: number) {
  return value ?? 0;
}

function likeSummary(likes: LikeLite[]) {
  const names = likes.map((l) => fullName(l.user)).filter(Boolean);
  if (!names.length) return "";
  if (names.length <= 3) return names.join(", ");
  return `${names.slice(0, 3).join(", ")} and ${names.length - 3} others`;
}

// =========================
// MAIN COMPONENT
// =========================
export default function FeedClient({
  currentUser,
  initialPosts,
}: {
  currentUser: CurrentUser;
  initialPosts: PostLite[];
}) {
  const [posts, setPosts] = useState<PostLite[]>(initialPosts);
  const [content, setContent] = useState("");
  const [visibility, setVisibility] = useState<"PUBLIC" | "PRIVATE">("PUBLIC");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);

  const currentUserName = useMemo(() => fullName(currentUser), [currentUser]);

  // =========================
  // IMAGE UPLOAD
  // =========================
  async function uploadImage(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/uploads/image", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data?.error || "Image upload failed");
    }

    return data.url as string;
  }

  // =========================
  // CREATE POST
  // =========================
  async function createPost(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!content.trim()) return;

    setBusy(true);
    try {
      let imageUrl: string | null = null;

      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          visibility, // ✅ IMPORTANT
          imageUrl,
        }),
      });

      const data = await res.json();
      if (!res.ok) return;

      setPosts((prev) => [data.post, ...prev]);
      setContent("");
      setVisibility("PUBLIC");
      setImageFile(null);
    } finally {
      setBusy(false);
    }
  }

  // =========================
  // LIKE
  // =========================
  async function toggleLike(target: {
    postId?: string;
    commentId?: string;
    replyId?: string;
  }) {
    await fetch("/api/likes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(target),
    });

    location.reload(); // keep your logic
  }

  // =========================
  // COMMENT
  // =========================
  async function addComment(postId: string, content: string) {
    await fetch("/api/comments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ postId, content }),
    });

    location.reload();
  }

  // =========================
  // REPLY
  // =========================
  async function addReply(commentId: string, content: string) {
    await fetch("/api/replies", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ commentId, content }),
    });

    location.reload();
  }

  // =========================
  // UI
  // =========================
  return (
    <div className="feed-content">

      <CreatePost
        createPost={createPost}
        content={content}
        setContent={setContent}
        currentUserName={currentUserName}
        setImageFile={setImageFile}
        visibility={visibility}
        setVisibility={setVisibility}
        busy={busy}
      />
      {/* CREATE POST */}
      <form onSubmit={createPost} className="card composer">
        <textarea
          placeholder={`What's on your mind, ${currentUserName}?`}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <div className="post-actions">

          <input
            type="file"
            onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
          />

          <select
            value={visibility}
            onChange={(e) =>
              setVisibility(e.target.value as "PUBLIC" | "PRIVATE")
            }
          >
            <option value="PUBLIC">🌍 Public</option>
            <option value="PRIVATE">🔒 Private</option>
          </select>

          <button className="primary-btn" type="submit" disabled={busy}>
            {busy ? "Posting..." : "Post"}
          </button>
        </div>
      </form>

      {/* POSTS */}
      <div className="feed-grid">
        {posts.map((post) => (
          <div key={post.id} className="card post-card">

            {/* HEADER */}
            <div className="post-head">
              <div className="post-user">
                <div className="feed-avatar" />
                <div className="meta">
                  <strong>{fullName(post.user)}</strong>
                  <span>
                    {new Date(post.createdAt).toLocaleString()} •{" "}
                    {post.visibility === "PUBLIC" ? "🌍 Public" : "🔒 Private"}
                  </span>
                </div>
              </div>
            </div>

            {/* CONTENT */}
            <p>{post.content}</p>

            {/* IMAGE */}
            {post.imageUrl && (
              <div className="post-image">
                <img src={post.imageUrl} />
              </div>
            )}

            {/* ACTIONS */}
            <div className="post-actions">
              <button
                className="icon-btn"
                onClick={() => toggleLike({ postId: post.id })}
              >
                👍 {safeCount(post._count.likes)} Likes
              </button>

              <button className="icon-btn">
                💬 {safeCount(post._count.comments)} Comments
              </button>
            </div>

            {/* COMMENTS */}
            {post.comments.map((comment) => (
              <div key={comment.id} style={{ marginTop: 10, marginLeft: 10 }}>
                <p>
                  <b>{fullName(comment.user)}</b>: {comment.content}
                </p>

                <button
                  className="icon-btn"
                  onClick={() => toggleLike({ commentId: comment.id })}
                >
                  Like ({safeCount(comment._count.likes)})
                </button>

                {/* REPLIES */}
                {comment.replies.map((reply) => (
                  <div key={reply.id} style={{ marginLeft: 20 }}>
                    <p>
                      <b>{fullName(reply.user)}</b>: {reply.content}
                    </p>

                    <button
                      className="icon-btn"
                      onClick={() => toggleLike({ replyId: reply.id })}
                    >
                      Like ({safeCount(reply._count.likes)})
                    </button>
                  </div>
                ))}

                <ReplyBox onSubmit={(text) => addReply(comment.id, text)} />
              </div>
            ))}

            <CommentBox onSubmit={(text) => addComment(post.id, text)} />
          </div>
        ))}
      </div>
    </div>
  );
}

// =========================
// COMMENT BOX
// =========================
function CommentBox({ onSubmit }: { onSubmit: (text: string) => void }) {
  const [text, setText] = useState("");

  return (
    <div style={{ marginTop: 10 }}>
      <input
        placeholder="Write comment..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        className="icon-btn"
        onClick={() => {
          onSubmit(text);
          setText("");
        }}
      >
        Comment
      </button>
    </div>
  );
}

// =========================
// REPLY BOX
// =========================
function ReplyBox({ onSubmit }: { onSubmit: (text: string) => void }) {
  const [text, setText] = useState("");

  return (
    <div style={{ marginTop: 6 }}>
      <input
        placeholder="Reply..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        className="icon-btn"
        onClick={() => {
          onSubmit(text);
          setText("");
        }}
      >
        Reply
      </button>
    </div>
  );
}