import { getCurrentUser } from "@/src/server/auth/current-user";
import { supabaseAdmin } from "@/src/server/db/supabase-admin";

export default async function MyPosts() {
  const user = await getCurrentUser();

  const { data } = await supabaseAdmin
    .from("posts")
    .select("*")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false });

  return (
    <div style={{ padding: 20 }}>
      <h2>My Posts</h2>

      {data?.map((p) => (
        <div key={p.id} style={{ marginBottom: 16 }}>
          <p>{p.content}</p>
        </div>
      ))}
    </div>
  );
}