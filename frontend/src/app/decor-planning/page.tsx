import { VendorCategoryListing } from "@/components/VendorCategoryListing";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Decor & Planning | Cloche Luxury Weddings",
  description: "Stunning stage setups, floral decor, and complete wedding planning services.",
};

export default function DecorPlanningPage() {
  return <VendorCategoryListing categorySlug="decor-planning" />;
}
