import { redirect } from "next/navigation";

export default function VendorOffersFlashRoute() {
  redirect("/vendor/offers?tab=flash");
}
