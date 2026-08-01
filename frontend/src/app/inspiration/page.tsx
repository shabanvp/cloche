import type { Metadata } from "next";
import { InspirationClient } from "@/components/InspirationClient";

export const metadata: Metadata = {
  title: "Wedding Inspiration & Photo Gallery",
  description: "Browse curated wedding trends, luxury lehenga designs, moodboards, and decor ideas on Cloche.",
  openGraph: {
    title: "Wedding Inspiration & Photo Gallery | CLOCHE",
    description: "Browse curated wedding trends, luxury lehenga designs, moodboards, and decor ideas on Cloche.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wedding Inspiration & Photo Gallery | CLOCHE",
    description: "Browse curated wedding trends, luxury lehenga designs, moodboards, and decor ideas on Cloche.",
  },
};

export default function InspirationPage() {
  return <InspirationClient />;
}
