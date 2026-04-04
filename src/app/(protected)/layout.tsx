// src/app/(protected)/layout.tsx

import { ReactNode } from "react";
import { redirect } from "next/navigation";
import Header from "@/components/layout/Header";
import { getCurrentUser } from "@/src/server/auth/current-user";
import RightSidebar from "@/components/feed/RightSidebar";
import LeftSidebar from "@/components/feed/LeftSidebar";

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
           <LeftSidebar />
        </aside>

        {/* CENTER FEED */}
        <section className="center-feed">
          {children}
        </section>

      
        {/* RIGHT SIDEBAR */}
        <aside className="right-sidebar">
          <RightSidebar /> 
        </aside>
      </main>
    </div>
  );
}