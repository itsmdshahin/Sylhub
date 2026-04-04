"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import NotificationDropdown from "@/components/feed/NotificationDropdown";

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
        <div className="feed-logo" onClick={() => router.push("/feed")} style={{ cursor: "pointer" }}>
          <img
            src="/assets/images/sitelogos.png"
            alt="SylHUb"
            style={{ height: 50 }}
          />
        </div>

        {/* SEARCH */}
        <div className="feed-search">
          <Search size={18} />
          <input type="search" placeholder="Search..." />
        </div>

        {/* ACTIONS */}
        <div className="feed-profile" style={{ gap: 12 }}>

          {/* HOME */}
          <button
            className="icon-btn"
            onClick={() => router.push("/feed")}
          >
            🏠
          </button>

           {/* FRIEND */}
          <button className="icon-btn"
            onClick={() => alert("Friend feature coming soon")}
          >👥</button>

          {/* CHAT */}
          <button
            className="icon-btn"
            onClick={() => alert("Chat feature coming soon")}
          >
            💬
          </button>

          {/* NOTIFICATIONS */}
          <NotificationDropdown>
            <button className="icon-btn">🔔</button>
          </NotificationDropdown>

          {/* PROFILE DROPDOWN */}
          <div
            style={{ position: "relative", cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}
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
                  top: 55,
                  right: 0,
                  background: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: 12,
                  width: 180,
                  boxShadow: "0 15px 40px rgba(0,0,0,0.1)",
                  zIndex: 100,
                  overflow: "hidden",
                }}
              >
                <div
                  className="dropdown-item"
                  onClick={() => router.push("/profile")}
                >
                  👤 Profile
                </div>

                <div
                  className="dropdown-item"
                  onClick={() => router.push("/my-posts")}
                >
                  📝 My Posts
                </div>

                <div
                  className="dropdown-item"
                  onClick={() => router.push("/settings")}
                >
                  ⚙️ Settings
                </div>

                <div
                  className="dropdown-item"
                  onClick={logout}
                  style={{ color: "red" }}
                >
                  🚪 Logout
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}