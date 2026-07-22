import type { Metadata } from "next";
import { VenuesListing } from "@/components/VenuesListing";

export const metadata: Metadata = {
  title: "Wedding Venues | Cloche",
  description: "Browse premium wedding venues — banquet halls, lawns, heritage palaces, and destination spaces across India.",
};

export default function VenuesPage() {
  return <VenuesListing />;
}
