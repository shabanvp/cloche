import { VendorCategoryListing } from "@/components/VendorCategoryListing";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Jewelry | Cloche Luxury Weddings",
  description: "Discover exquisite jewelry for every occasion. Gold, diamond, polki, and bridal sets.",
};

export default function JewelleryPage() {
  return <VendorCategoryListing categorySlug="jewellery" />;
}
