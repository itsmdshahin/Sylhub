// app/my-posts/page.tsx

import { getCurrentUser } from "@/src/server/auth/current-user";
import { supabaseAdmin } from "@/src/server/db/supabase-admin";
import MyPostsClient from "@/components/profile/MyPostsClient";
import { redirect } from "next/navigation";

export default async function MyPostsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const { data, error } = await supabaseAdmin
    .from("posts")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return <div>Failed to load posts</div>;
  }

  return <MyPostsClient initialPosts={data || []} />;
}