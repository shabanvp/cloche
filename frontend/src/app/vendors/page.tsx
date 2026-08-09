import { VendorsListing } from "@/components/VendorsListing";
import { getAllBoutiques } from "@/services/api";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Vendors & Boutiques | Cloche Luxury Weddings",
  description: "Browse premium wedding vendors, boutiques, planners, makeup artists, photographers, and decorators.",
};

export default async function VendorsDirectoryPage() {
  const boutiques = await getAllBoutiques();

  return <VendorsListing boutiques={boutiques} />;
}
