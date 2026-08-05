import { VendorCategoryListing } from "@/components/VendorCategoryListing";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vendors & Boutiques | Cloche Luxury Weddings",
  description: "Browse premium wedding vendors, boutiques, planners, makeup artists, photographers, and decorators.",
};

export default function VendorsDirectoryPage() {
  return <VendorCategoryListing categorySlug="venues" />;
}
