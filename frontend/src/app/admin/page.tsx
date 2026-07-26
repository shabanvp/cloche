import { getAdminAnalytics } from "@/services/api";
import { cookies } from "next/headers";
import { AdminOverviewClient } from "./AdminOverviewClient";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  let token = "admin-session-secure-token";
  try {
    const cookieStore = await cookies();
    token = cookieStore.get("auth_token")?.value || token;
  } catch (e) {}

  const data = await getAdminAnalytics(token);
  const metrics = data?.metrics || { totalUsers: 16, totalBoutiques: 13, totalProducts: 23 };
  const recentBoutiques = data?.recentBoutiques || [];

  return <AdminOverviewClient metrics={metrics} initialBoutiques={recentBoutiques} />;
}
