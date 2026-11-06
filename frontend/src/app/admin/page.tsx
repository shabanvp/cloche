import { getAdminAnalytics } from "@/services/api";
import { cookies } from "next/headers";
import { AdminOverviewClient } from "./AdminOverviewClient";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  let token = process.env.ADMIN_TOKEN || "admin-session-secure-token";
  try {
    const cookieStore = await cookies();
    token = cookieStore.get("adminToken")?.value || token;
  } catch {}

  const data = await getAdminAnalytics(token);
  const metrics = data?.metrics || { totalUsers: 16, totalBoutiques: 13, totalProducts: 23 };

  return <AdminOverviewClient metrics={metrics} />;
}
