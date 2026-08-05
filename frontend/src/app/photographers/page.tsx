import { VendorCategoryListing } from "@/components/VendorCategoryListing";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Photographers | Cloche Luxury Weddings",
  description: "Capture timeless moments with top wedding photographers and cinematographers.",
};

export default function PhotographersPage() {
  return <VendorCategoryListing categorySlug="photographers" />;
}
