import { VendorCategoryListing } from "@/components/VendorCategoryListing";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Decor & Planning | Cloche",
  description: "Explore top wedding decorators, stage setup experts, and planners.",
};

export default function DecorPlanningCategoryPage() {
  return <VendorCategoryListing categorySlug="decor-planning" />;
}
