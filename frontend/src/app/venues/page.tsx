import { VendorCategoryListing } from "@/components/VendorCategoryListing";
import { Metadata } from "next";
import { pageMetadata } from "@/lib/pageMetadata";

export const metadata: Metadata = pageMetadata("/venues", "Wedding Venues in Kerala", "Explore wedding venues across Kerala, from banquet halls and lawns to resorts and palaces.");

export default function VenuesPage() {
  return <VendorCategoryListing categorySlug="venues" />;
}
