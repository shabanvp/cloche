import type { Metadata } from "next";
import { GroomWearListing } from "@/components/GroomWearListing";

export const metadata: Metadata = {
  title: "Groom Wear | Sherwanis, Achkans & Suits | Cloche",
  description:
    "Browse premium groom wear, sherwanis, bandhgalas, achkans and bespoke suits for your wedding day.",
};

export default function GroomWearPage() {
  return <GroomWearListing />;
}
