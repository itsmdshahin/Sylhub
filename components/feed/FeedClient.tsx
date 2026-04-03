//src/components/feed/FeedClient.tsx

"use client";

import { FormEvent, useMemo, useState } from "react";
import CreatePost from "./CreatePost";
import PostCard from "./PostCard";

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

      <div className="feed-grid">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            fullName={fullName}
            safeCount={safeCount}
            toggleLike={toggleLike}
            addComment={addComment}
            addReply={addReply}
          />
        ))}
      </div>
      {/* POSTS */}
      
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