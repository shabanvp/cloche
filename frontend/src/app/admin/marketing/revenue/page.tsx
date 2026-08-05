import { redirect } from "next/navigation";

export default function AdminMarketingRevenueRoute() {
  redirect("/admin/marketing?tab=revenue");
}
