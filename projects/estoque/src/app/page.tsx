import { redirect } from "next/navigation";
import { getSessionContext } from "@/lib/auth/auth";

export default async function HomePage() {
  const session = await getSessionContext();

  redirect(session ? "/dashboard" : "/login");
}
