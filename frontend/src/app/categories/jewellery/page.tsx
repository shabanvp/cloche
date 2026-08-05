import { VendorCategoryListing } from "@/components/VendorCategoryListing";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Jewelry | Cloche",
  description: "Explore exquisite wedding jewelry, bridal sets, gold, diamond, and polki collections.",
};

export default function JewelleryCategoryPage() {
  return <VendorCategoryListing categorySlug="jewellery" />;
}
