import type { Metadata } from "next";
import { RealWeddingsFeed } from "@/components/RealWeddingsFeed";

export const metadata: Metadata = {
  title: "Real Weddings | Cloche",
  description: "Browse beautiful stories and inspiration from real premium weddings.",
};

export default function RealWeddingsPage() {
  return <RealWeddingsFeed />;
}
