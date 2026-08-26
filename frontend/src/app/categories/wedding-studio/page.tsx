import { VendorCategoryListing } from "@/components/VendorCategoryListing";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wedding Studio & Couple Couture | Cloche",
  description: "Explore luxury couple couture, ceremonial edits, and bespoke wedding studios.",
};

export default function WeddingStudioCategoryPage() {
  return <VendorCategoryListing categorySlug="wedding-studio" />;
}
