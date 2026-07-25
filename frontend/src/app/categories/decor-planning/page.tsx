import type { Metadata } from "next";
import { DecorPlanningListing } from "@/components/DecorPlanningListing";

export const metadata: Metadata = {
  title: "Decor & Planning Vendors | Cloche",
  description: "Curated decor & planning experts to bring your dream wedding to life.",
};

export default function DecorPlanningPage() {
  return <DecorPlanningListing />;
}
