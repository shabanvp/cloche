import { VendorCategoryListing } from "@/components/VendorCategoryListing";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bridal Wear | Cloche Luxury Weddings",
  description: "Explore luxury bridal lehengas, gowns, designer sarees, and bridal boutiques.",
};

export default function BridalWearPage() {
  return <VendorCategoryListing categorySlug="bridal-wear" />;
}
