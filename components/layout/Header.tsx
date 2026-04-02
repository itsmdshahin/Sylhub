//src/components/layout/Header.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export default function Header({ user }: any) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  return (
    <header className="feed-topbar">
      <div className="feed-topbar-inner">
        {/* LOGO */}
        <div className="feed-logo">
          <img
            src="/assets/images/logo.svg"
            alt="Buddy Script"
            style={{ height: 34 }}
          />
        </div>

        {/* SEARCH */}
        <div className="feed-search">
          <Search size={18} />
          <input type="search" placeholder="input search text" />
        </div>

        {/* PROFILE */}
        <div
          className="feed-profile"
          style={{ position: "relative", cursor: "pointer" }}
          onClick={() => setOpen(!open)}
        >
          <div className="feed-avatar" />

          <div style={{ display: "grid", lineHeight: 1.1 }}>
            <strong style={{ fontSize: 14 }}>
              {user.firstName} {user.lastName}
            </strong>
            <span style={{ fontSize: 12, color: "#64748b" }}>
              Member
            </span>
          </div>

          {/* DROPDOWN */}
          {open && (
            <div
              style={{
                position: "absolute",
                top: 50,
                right: 0,
                background: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: 8,
                width: 160,
                boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
                zIndex: 100,
              }}
            >
              <div
                className="dropdown-item"
                onClick={() => router.push("/profile")}
              >
                Profile
              </div>

              <div
                className="dropdown-item"
                onClick={() => router.push("/my-posts")}
              >
                My Posts
              </div>

              <div className="dropdown-item" onClick={logout}>
                Logout
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}