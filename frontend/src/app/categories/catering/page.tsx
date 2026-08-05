import { VendorCategoryListing } from "@/components/VendorCategoryListing";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Catering Services | Cloche",
  description: "Delicious wedding feasts, live counters, and gourmet banquet menus.",
};

export default function CateringCategoryPage() {
  return <VendorCategoryListing categorySlug="catering" />;
}
