import { VendorCategoryListing } from "@/components/VendorCategoryListing";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/pageMetadata";

export const metadata: Metadata = pageMetadata("/makeup", "Bridal Makeup Artists in Kerala", "Browse bridal makeup artists and beauty professionals for your Kerala wedding.");

export default function MakeupPage() {
  return <VendorCategoryListing categorySlug="makeup-artists" />;
}
