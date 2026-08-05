import { VendorCategoryListing } from "@/components/VendorCategoryListing";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Makeup Artists | Cloche Luxury Weddings",
  description: "Discover professional makeup artists to look and feel your best. HD, Airbrush, and Bridal Specialist makeup.",
};

export default function MakeupArtistsPage() {
  return <VendorCategoryListing categorySlug="makeup-artists" />;
}
