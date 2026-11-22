import type { Metadata } from "next";
import { GenieClient } from "@/components/GenieClient";
import { pageMetadata } from "@/lib/pageMetadata";

export const metadata: Metadata = pageMetadata("/aura", "Aura Wedding Planning Assistant", "Get wedding planning guidance and vendor discovery help with Aura from CLOCHE.");

export default function AuraPage() {
  return <GenieClient />;
}
