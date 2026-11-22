import { VendorsListing } from "@/components/VendorsListing";
import { getAllBoutiques } from "@/services/api";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/pageMetadata";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = pageMetadata("/vendors", "Wedding Vendors in Kerala", "Browse wedding professionals, boutiques, planners, photographers, and decorators across Kerala.");

export default async function VendorsDirectoryPage() {
  const boutiques = await getAllBoutiques();

  return <VendorsListing boutiques={boutiques} />;
}
