import { getCurrentUser } from "@/src/server/auth/current-user";

export default async function ProfilePage() {
  const user = await getCurrentUser();

  return (
    <div style={{ padding: 20 }}>
      <h1>{user?.firstName} {user?.lastName}</h1>
      <p>{user?.email}</p>
    </div>
  );
}