import { redirect } from "next/navigation";

export default function AdminMarketingAnalyticsRoute() {
  redirect("/admin/marketing?tab=analytics");
}
