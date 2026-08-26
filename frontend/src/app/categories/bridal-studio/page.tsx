import { VendorCategoryListing } from "@/components/VendorCategoryListing";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bridal Studio & Couture | Cloche",
  description: "Explore luxury bridal lehengas, sarees, gowns, and bespoke bridal studios.",
};

export default function BridalStudioCategoryPage() {
  return <VendorCategoryListing categorySlug="bridal-studio" />;
}
