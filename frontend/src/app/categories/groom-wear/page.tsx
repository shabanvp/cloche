import { VendorCategoryListing } from "@/components/VendorCategoryListing";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Groom Wear | Cloche",
  description: "Browse premium groom wear, sherwanis, bandhgalas, achkans and bespoke suits for your wedding day.",
};

export default function GroomWearCategoryPage() {
  return <VendorCategoryListing categorySlug="groom-wear" />;
}
