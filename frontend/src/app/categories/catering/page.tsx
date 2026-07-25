import type { Metadata } from "next";
import { CateringListing } from "@/components/CateringListing";

export const metadata: Metadata = {
  title: "Catering & Food | Wedding Caterers | Cloche",
  description:
    "Find premium catering services for your wedding – curated menus, live counters, and professional hospitality.",
};

export default function CateringPage() {
  return <CateringListing />;
}
