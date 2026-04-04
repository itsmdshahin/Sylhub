"use client";

import { useState } from "react";

export default function MyPostsClient({ initialPosts }: any) {
  const [posts, setPosts] = useState(initialPosts);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  // DELETE POST
  async function deletePost(id: string) {
    await fetch(`/api/posts/${id}`, {
      method: "DELETE",
    });

    setPosts((prev: any) => prev.filter((p: any) => p.id !== id));
  }

  // UPDATE POST
  async function updatePost(id: string) {
    await fetch(`/api/posts/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: editText }),
    });

    setPosts((prev: any) =>
      prev.map((p: any) =>
        p.id === id ? { ...p, content: editText } : p
      )
    );

    setEditingId(null);
    setEditText("");
  }

  return (
    <div className="center-feed">

      <div className="card" style={{ padding: 16 }}>
        <h2>My Posts</h2>
      </div>

      {posts.map((p: any) => (
        <div key={p.id} className="card post-card">

          {/* EDIT MODE */}
          {editingId === p.id ? (
            <>
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                style={{ width: "100%", marginTop: 10 }}
              />

              <div style={{ marginTop: 10, display: "flex", gap: 10 }}>
                <button
                  className="icon-btn"
                  onClick={() => updatePost(p.id)}
                >
                  Save
                </button>

                <button
                  className="icon-btn"
                  onClick={() => setEditingId(null)}
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <p>{p.content}</p>

              {/* ACTIONS */}
              <div style={{ marginTop: 10, display: "flex", gap: 10 }}>
                <button
                  className="icon-btn"
                  onClick={() => {
                    setEditingId(p.id);
                    setEditText(p.content);
                  }}
                >
                  ✏️ Edit
                </button>

                <button
                  className="icon-btn"
                  onClick={() => deletePost(p.id)}
                >
                  🗑 Delete
                </button>
              </div>
            </>
          )}

        </div>
      ))}

    </div>
  );
}