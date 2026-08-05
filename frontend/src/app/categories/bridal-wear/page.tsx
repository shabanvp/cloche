import { VendorCategoryListing } from "@/components/VendorCategoryListing";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bridal Wear | Cloche",
  description: "Explore luxury bridal lehengas, gowns, designer sarees, and bridal boutiques.",
};

export default function BridalWearCategoryPage() {
  return <VendorCategoryListing categorySlug="bridal-wear" />;
}
