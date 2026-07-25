import type { Metadata } from "next";
import { MehendiListing } from "@/components/MehendiListing";

export const metadata: Metadata = {
  title: "Bridal Mehendi Artists | Cloche",
  description: "Browse premium bridal mehendi artists and henna designers.",
};

export default function MehendiPage() {
  return <MehendiListing />;
}
