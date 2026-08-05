import { VendorCategoryListing } from "@/components/VendorCategoryListing";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Groom Wear | Cloche Luxury Weddings",
  description: "Discover royal sherwanis, tuxedos, and designer suits for grooms.",
};

export default function GroomWearPage() {
  return <VendorCategoryListing categorySlug="groom-wear" />;
}
