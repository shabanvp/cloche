import type { Metadata } from "next";
import { MakeupListing } from "@/components/MakeupListing";

export const metadata: Metadata = {
  title: "Bridal Makeup Artists | Cloche",
  description: "Browse premium wedding makeup artists for your special day.",
};

export default function MakeupPage() {
  return <MakeupListing />;
}
