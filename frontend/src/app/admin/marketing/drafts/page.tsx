import { redirect } from "next/navigation";

export default function AdminMarketingDraftsRoute() {
  redirect("/admin/marketing?tab=drafts");
}
