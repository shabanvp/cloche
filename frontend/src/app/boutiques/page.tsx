import { VendorsListing } from "@/components/VendorsListing";
import { getAllBoutiques } from "@/services/api";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vendors | Cloche",
  description: "Browse premium wedding vendors, boutiques, planners, makeup artists, photographers and decorators.",
};

export default async function BoutiquesPage() {
  const boutiques = await getAllBoutiques();

  return <VendorsListing boutiques={boutiques} />;
}

