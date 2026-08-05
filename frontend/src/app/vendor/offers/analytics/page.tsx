import { redirect } from "next/navigation";

export default function VendorOffersAnalyticsRoute() {
  redirect("/vendor/offers?tab=analytics");
}
