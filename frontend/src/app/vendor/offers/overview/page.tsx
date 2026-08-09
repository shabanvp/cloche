import { redirect } from "next/navigation";

export default function VendorOffersOverviewRoute() {
  redirect("/vendor/offers?tab=overview");
}
