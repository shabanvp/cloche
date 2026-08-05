import { VendorCategoryListing } from "@/components/VendorCategoryListing";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Catering Services | Cloche Luxury Weddings",
  description: "Delicious wedding feasts, live counters, and gourmet banquet menus.",
};

export default function CateringPage() {
  return <VendorCategoryListing categorySlug="catering" />;
}
