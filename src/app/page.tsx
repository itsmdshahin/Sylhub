import { redirect } from "next/navigation";
import { getCurrentUser } from "@/src/server/auth/current-user";

export default async function HomePage() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/feed");
  }

  redirect("/login");
}