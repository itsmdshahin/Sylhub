// src/app/(protected)/layout.tsx

import { ReactNode } from "react";
import { redirect } from "next/navigation";
import Header from "@/components/layout/Header";
import { getCurrentUser } from "@/src/server/auth/current-user";

export default async function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="feed-shell">
      <Header user={user} />

      {/* 3 COLUMN LAYOUT */}
      <main className="main-layout">
        {/* LEFT SIDEBAR */}
        <aside className="left-sidebar">
          <div className="card sidebar-card">
            <h3>Explore</h3>
            <ul>
              <li>📘 Learning</li>
              <li>📊 Insights</li>
              <li>👥 Find Friends</li>
              <li>🔖 Bookmarks</li>
              <li>👨‍👩‍👧 Groups</li>
              <li>🎮 Gaming</li>
              <li>⚙️ Settings</li>
            </ul>
          </div>

          <div className="card sidebar-card">
            <h3>Suggested People</h3>
            <p>Steve Jobs</p>
            <p>Ryan Roslansky</p>
            <p>Dylan Field</p>
          </div>
        </aside>

        {/* CENTER FEED */}
        <section className="center-feed">
          {children}
        </section>

        {/* RIGHT SIDEBAR */}
        <aside className="right-sidebar">
          <div className="card sidebar-card">
            <h3>You Might Like</h3>
            <p>Radovan SkillArena</p>
            <button className="primary-btn">Follow</button>
          </div>

          <div className="card sidebar-card">
            <h3>Your Friends</h3>
            <p>Steve Jobs</p>
            <p>Ryan Roslansky</p>
            <p>Dylan Field</p>
          </div>
        </aside>
      </main>
    </div>
  );
}