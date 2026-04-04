"use client";

import { useMemo, useState } from "react";

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

type Props = {
  post: PostLite;
  fullName: (user: any) => string;
  safeCount: (n?: number) => number;
  toggleLike: (data: any) => void;
  addComment: (postId: string, content: string) => void;
  addReply: (commentId: string, content: string) => void;
};

type LikeViewerState = {
  title: string;
  users: UserLite[];
} | null;

export default function PostCard({
  post,
  fullName,
  safeCount,
  toggleLike,
  addComment,
  addReply,
}: Props) {
  const [commentText, setCommentText] = useState("");
  const [viewer, setViewer] = useState<LikeViewerState>(null);

  const postLikeLabel = useMemo(() => {
    const names = post.likes.map((l) => fullName(l.user)).filter(Boolean);
    if (!names.length) return "Be the first to like this";
    if (names.length <= 3) return `Liked by ${names.join(", ")}`;
    return `Liked by ${names.slice(0, 3).join(", ")} and ${names.length - 3} others`;
  }, [post.likes, fullName]);

  const openLikeViewer = (title: string, likes: LikeLite[]) => {
    setViewer({
      title,
      users: likes.map((l) => l.user),
    });
  };

  return (
    <div className="card post-card">
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
      <p style={{ marginTop: 10 }}>{post.content}</p>

      {/* IMAGE */}
      {post.imageUrl && (
        <div className="post-image">
          <img src={post.imageUrl} alt="Post" />
        </div>
      )}

      {/* STATS */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 13,
          color: "#64748b",
          marginTop: 10,
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <button
          type="button"
          className="icon-btn"
          onClick={() => openLikeViewer("People who liked this post", post.likes)}
          style={{ background: "transparent", border: "none", padding: 0 }}
        >
          {safeCount(post._count.likes)} reactions
        </button>

        <span>{safeCount(post._count.comments)} comments</span>
      </div>

      <div style={{ marginTop: 6, fontSize: 13, color: "#475569" }}>
        <button
          type="button"
          className="icon-btn"
          onClick={() => openLikeViewer("People who liked this post", post.likes)}
          style={{ background: "transparent", border: "none", padding: 0 }}
        >
          {postLikeLabel}
        </button>
      </div>

      {/* ACTIONS */}
      <div className="post-actions">
        <button className="icon-btn" onClick={() => toggleLike({ postId: post.id })}>
          👍 Like
        </button>

        <button className="icon-btn">💬 Comment</button>
        <button className="icon-btn">↗ Share</button>
      </div>

      {/* COMMENTS LIST */}
      {post.comments.map((comment: CommentLite) => (
        <div key={comment.id} style={{ marginTop: 10, marginLeft: 10 }}>
          <p>
            <b>{fullName(comment.user)}</b>: {comment.content}
          </p>

          <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
            <button
              className="icon-btn"
              onClick={() => toggleLike({ commentId: comment.id })}
            >
              Like ({safeCount(comment._count.likes)})
            </button>

            <button
              type="button"
              className="icon-btn"
              onClick={() =>
                openLikeViewer("People who liked this comment", comment.likes)
              }
              style={{ background: "transparent", border: "none", padding: 0 }}
            >
              View who liked
            </button>
          </div>

          {comment.likes.length > 0 && (
            <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>
              {comment.likes.length <= 3
                ? `Liked by ${comment.likes.map((l) => fullName(l.user)).join(", ")}`
                : `Liked by ${comment.likes
                    .slice(0, 3)
                    .map((l) => fullName(l.user))
                    .join(", ")} and ${comment.likes.length - 3} others`}
            </div>
          )}

          {/* REPLIES */}
          {comment.replies.map((reply: ReplyLite) => (
            <div key={reply.id} style={{ marginLeft: 20, marginTop: 8 }}>
              <p>
                <b>{fullName(reply.user)}</b>: {reply.content}
              </p>

              <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                <button
                  className="icon-btn"
                  onClick={() => toggleLike({ replyId: reply.id })}
                >
                  Like ({safeCount(reply._count.likes)})
                </button>

                <button
                  type="button"
                  className="icon-btn"
                  onClick={() =>
                    openLikeViewer("People who liked this reply", reply.likes)
                  }
                  style={{ background: "transparent", border: "none", padding: 0 }}
                >
                  View who liked
                </button>
              </div>

              {reply.likes.length > 0 && (
                <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>
                  {reply.likes.length <= 3
                    ? `Liked by ${reply.likes.map((l) => fullName(l.user)).join(", ")}`
                    : `Liked by ${reply.likes
                        .slice(0, 3)
                        .map((l) => fullName(l.user))
                        .join(", ")} and ${reply.likes.length - 3} others`}
                </div>
              )}
            </div>
          ))}

          {/* REPLY BOX */}
          <ReplyBox onSubmit={(text) => addReply(comment.id, text)} />
        </div>
      ))}

      {/* COMMENT BOX */}
      <div style={{ marginTop: 10 }}>
        <input
          placeholder="Write comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
        <button
          className="icon-btn"
          onClick={() => {
            addComment(post.id, commentText);
            setCommentText("");
          }}
        >
          Comment
        </button>
      </div>

      {/* LIKE VIEWER */}
      {viewer && (
        <div
          onClick={() => setViewer(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: 16,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: 420,
              background: "#fff",
              borderRadius: 16,
              padding: 16,
              boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
              maxHeight: "70vh",
              overflow: "auto",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
              <h3 style={{ margin: 0 }}>{viewer.title}</h3>
              <button
                className="icon-btn"
                onClick={() => setViewer(null)}
                style={{ background: "transparent", border: "none" }}
              >
                ✕
              </button>
            </div>

            <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
              {viewer.users.length === 0 ? (
                <p style={{ margin: 0, color: "#64748b" }}>No likes yet.</p>
              ) : (
                viewer.users.map((user) => (
                  <div
                    key={user.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "10px 12px",
                      border: "1px solid #e2e8f0",
                      borderRadius: 12,
                    }}
                  >
                    <div className="feed-avatar" />
                    <div>
                      <strong>{fullName(user)}</strong>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* REPLY BOX */
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