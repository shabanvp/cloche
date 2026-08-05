import { VendorCategoryListing } from "@/components/VendorCategoryListing";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mehendi Artists | Cloche Luxury Weddings",
  description: "Discover talented mehendi artists for your special celebrations. Bridal, Arabic, and Traditional henna designs.",
};

export default function MehendiArtistsPage() {
  return <VendorCategoryListing categorySlug="mehendi-artists" />;
}
