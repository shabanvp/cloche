import { VendorsListing } from "@/components/VendorsListing";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/pageMetadata";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = pageMetadata("/vendors", "Wedding Vendors in Kerala", "Browse wedding professionals, boutiques, planners, photographers, and decorators across Kerala.");

export default function VendorsDirectoryPage() {
  return <VendorsListing boutiques={[]} />;
}
