import { VendorCategoryListing } from "@/components/VendorCategoryListing";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Groom Studio & Sherwanis | Cloche",
  description: "Explore bespoke sherwanis, tuxedos, Jodhpuri suits, and luxury groom studios.",
};

export default function GroomStudioCategoryPage() {
  return <VendorCategoryListing categorySlug="groom-studio" />;
}
