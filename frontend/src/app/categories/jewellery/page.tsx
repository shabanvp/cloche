import type { Metadata } from "next";
import { JewelleryListing } from "@/components/JewelleryListing";

export const metadata: Metadata = {
  title: "Jewellery Vendors | Cloche",
  description: "Explore premium bridal jewellery vendors – Polki, Kundan, Diamond & Gold collections curated for your wedding.",
};

export default function JewelleryPage() {
  return <JewelleryListing />;
}
