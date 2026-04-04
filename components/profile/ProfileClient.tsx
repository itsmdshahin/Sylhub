"use client";

import { useState } from "react";

export default function ProfileClient({ user, initialPosts }: any) {
  const [posts, setPosts] = useState(initialPosts);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  // DELETE
  async function deletePost(id: string) {
    await fetch(`/api/posts/${id}`, { method: "DELETE" });

    setPosts((prev: any) => prev.filter((p: any) => p.id !== id));
  }

  // UPDATE
  async function updatePost(id: string) {
    await fetch(`/api/posts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
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

      {/* PROFILE HEADER */}
      <div className="card" style={{ padding: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          
          <div
            className="feed-avatar"
            style={{ width: 80, height: 80 }}
          />

          <div>
            <h2>
              {user.firstName} {user.lastName}
            </h2>
            <p style={{ color: "#64748b" }}>{user.email}</p>
          </div>

        </div>
      </div>

      {/* POSTS TITLE */}
      <div className="card" style={{ padding: 16 }}>
        <h3>My Posts</h3>
      </div>

      {/* POSTS LIST */}
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