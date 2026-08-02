import type { Metadata } from "next";
import { CateringListing } from "@/components/CateringListing";

export const metadata: Metadata = {
  title: "Wedding Catering & Food | Cloche",
  description: "Find the best wedding caterers, traditional sadya, buffets, and food counters in Kerala.",
};

export default function CateringPage() {
  return <CateringListing />;
}
