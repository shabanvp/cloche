import { VendorCategoryListing } from "@/components/VendorCategoryListing";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Venues | Cloche Luxury Weddings",
  description: "Find the perfect venue for your special day. Explore luxury wedding halls, resorts, banquet venues & palaces.",
};

export default function VenuesPage() {
  return <VendorCategoryListing categorySlug="venues" />;
}
