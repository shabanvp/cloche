import { redirect } from "next/navigation";

export default function VendorOffersSettingsRoute() {
  redirect("/vendor/offers?tab=settings");
}
