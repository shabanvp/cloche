import type { Metadata } from "next";
import { TrendingAnalyticsClient } from "@/components/admin/TrendingAnalyticsClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Trending Analytics Engine | Cloche Admin",
  description: "Real-time decay-based trending score analytics and category rankings.",
};

export default function AdminTrendingPage() {
  return <TrendingAnalyticsClient />;
}
