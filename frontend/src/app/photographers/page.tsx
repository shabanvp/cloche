import { VendorCategoryListing } from "@/components/VendorCategoryListing";
import { Metadata } from "next";
import { pageMetadata } from "@/lib/pageMetadata";

export const metadata: Metadata = pageMetadata("/photographers", "Wedding Photographers in Kerala", "Find wedding photographers and cinematographers for celebrations across Kerala.");

export default function PhotographersPage() {
  return <VendorCategoryListing categorySlug="photographers" />;
}
