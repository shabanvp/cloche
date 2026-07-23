import type { Metadata } from "next";
import { PhotographersListing } from "@/components/PhotographersListing";

export const metadata: Metadata = {
  title: "Wedding Photographers | Cloche",
  description: "Browse premium wedding photographers for your special day.",
};

export default function PhotographersPage() {
  return <PhotographersListing />;
}
