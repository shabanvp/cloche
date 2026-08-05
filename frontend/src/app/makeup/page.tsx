import { VendorCategoryListing } from "@/components/VendorCategoryListing";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Makeup Artists | Cloche",
  description: "Browse premium wedding makeup artists for your special day.",
};

export default function MakeupPage() {
  return <VendorCategoryListing categorySlug="makeup-artists" />;
}
