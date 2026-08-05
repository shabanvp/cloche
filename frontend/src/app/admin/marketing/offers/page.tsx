import { redirect } from "next/navigation";

export default function AdminMarketingOffersRoute() {
  redirect("/admin/marketing?tab=offers");
}
