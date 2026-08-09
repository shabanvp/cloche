import { redirect } from "next/navigation";

export default function VendorOffersCouponsRoute() {
  redirect("/vendor/offers?tab=coupons");
}
