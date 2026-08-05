import { redirect } from "next/navigation";

export default function AdminMarketingCampaignsRoute() {
  redirect("/admin/marketing?tab=campaigns");
}
