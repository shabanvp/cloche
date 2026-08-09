import { redirect } from "next/navigation";

export default function VendorServicesCatalogRoute() {
  redirect("/vendor/services?tab=catalog");
}
