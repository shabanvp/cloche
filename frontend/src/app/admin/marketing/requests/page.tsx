import { redirect } from "next/navigation";

export default function AdminMarketingRequestsRoute() {
  redirect("/admin/marketing?tab=requests");
}
