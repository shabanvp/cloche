import { redirect } from "next/navigation";

export default function AdminMarketingOverviewRoute() {
  redirect("/admin/marketing?tab=dashboard");
}
