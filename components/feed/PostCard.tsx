"use client";

import { useState } from "react";

type Props = {
  post: any;
  fullName: (user: any) => string;
  safeCount: (n?: number) => number;
  toggleLike: (data: any) => void;
  addComment: (postId: string, content: string) => void;
  addReply: (commentId: string, content: string) => void;
};

export default function PostCard({
  post,
  fullName,
  safeCount,
  toggleLike,
  addComment,
  addReply,
}: Props) {
  const [commentText, setCommentText] = useState("");

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
          <img src={post.imageUrl} />
        </div>
      )}

      {/* STATS */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        fontSize: 13,
        color: "#64748b",
        marginTop: 10,
      }}>
        <span>{safeCount(post._count.likes)} reactions</span>
        <span>{safeCount(post._count.comments)} comments</span>
      </div>

      {/* ACTIONS */}
      <div className="post-actions">
        <button
          className="icon-btn"
          onClick={() => toggleLike({ postId: post.id })}
        >
          👍 Like
        </button>

        <button className="icon-btn">
          💬 Comment
        </button>

        <button className="icon-btn">
          ↗ Share
        </button>
      </div>

      {/* COMMENTS LIST */}
      {post.comments.map((comment: any) => (
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
          {comment.replies.map((reply: any) => (
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