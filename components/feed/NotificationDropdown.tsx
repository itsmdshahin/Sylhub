"use client";

import { useState } from "react";

export default function NotificationDropdown({ children }: any) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ position: "relative" }}>
      <div onClick={() => setOpen(!open)}>{children}</div>

      {open && (
        <div
          style={{
            position: "absolute",
            right: 0,
            marginTop: 10,
            width: 280,
            background: "#fff",
            borderRadius: 16,
            padding: 16,
            boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
            zIndex: 50,
          }}
        >
          <h4 style={{ marginBottom: 12 }}>Notifications</h4>

          <div style={{ display: "flex", gap: 10 }}>
            <div className="feed-avatar" style={{ width: 32, height: 32 }} />
            <p style={{ fontSize: 14 }}>
              <b>Steve Jobs</b> liked your post
            </p>
          </div>

          <p style={{ fontSize: 12, color: "#64748b", marginTop: 6 }}>
            2 minutes ago
          </p>
        </div>
      )}
    </div>
  );
}