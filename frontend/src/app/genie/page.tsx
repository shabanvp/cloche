import type { Metadata } from "next";
import { GenieClient } from "@/components/GenieClient";

export const metadata: Metadata = {
  title: "Cloche Aura - AI Wedding Concierge & Business Assistant",
  description: "Plan your dream luxury wedding or manage your vendor business with Cloche Aura — your personal AI assistant.",
  openGraph: {
    title: "Cloche Aura - AI Wedding Concierge & Business Assistant | CLOCHE",
    description: "Plan your dream luxury wedding or manage your vendor business with Cloche Aura — your personal AI assistant.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cloche Aura - AI Wedding Concierge & Business Assistant | CLOCHE",
    description: "Plan your dream luxury wedding or manage your vendor business with Cloche Aura — your personal AI assistant.",
  },
};

export default function GeniePage() {
  return <GenieClient />;
}
