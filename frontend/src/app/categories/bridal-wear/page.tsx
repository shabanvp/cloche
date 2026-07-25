import type { Metadata } from "next";
import { BridalWearListing } from "@/components/BridalWearListing";

export const metadata: Metadata = {
  title: "Bridal Wear & Boutiques | Cloche",
  description: "Browse luxury bridal wear, lehengas, sarees, and couture boutiques.",
};

export default function BridalWearPage() {
  return <BridalWearListing />;
}
