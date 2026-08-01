import type { Metadata } from "next";
import { GenieClient } from "@/components/GenieClient";

export const metadata: Metadata = {
  title: "Cloche Genie - AI Wedding Concierge",
  description: "Plan your dream luxury wedding within budget with Cloche Genie — your personal AI wedding planner.",
  openGraph: {
    title: "Cloche Genie - AI Wedding Concierge | CLOCHE",
    description: "Plan your dream luxury wedding within budget with Cloche Genie — your personal AI wedding planner.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cloche Genie - AI Wedding Concierge | CLOCHE",
    description: "Plan your dream luxury wedding within budget with Cloche Genie — your personal AI wedding planner.",
  },
};

export default function GeniePage() {
  return <GenieClient />;
}
