import { VendorCategoryListing } from "@/components/VendorCategoryListing";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mehendi Artists | Cloche",
  description: "Explore bridal mehendi artists, traditional henna designers, and Arabic pattern specialists.",
};

export default function MehendiCategoryPage() {
  return <VendorCategoryListing categorySlug="mehendi-artists" />;
}
