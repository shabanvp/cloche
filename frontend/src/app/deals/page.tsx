import type { Metadata } from "next";
import { DealsClient } from "@/components/DealsClient";

export const metadata: Metadata = {
  title: "Wedding Deals & Offers",
  description: "Discover exclusive wedding packages, boutique discounts, and seasonal offers on Cloche.",
  openGraph: {
    title: "Wedding Deals & Offers | CLOCHE",
    description: "Discover exclusive wedding packages, boutique discounts, and seasonal offers on Cloche.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wedding Deals & Offers | CLOCHE",
    description: "Discover exclusive wedding packages, boutique discounts, and seasonal offers on Cloche.",
  },
};

export default function DealsPage() {
  return <DealsClient />;
}
