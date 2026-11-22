import type { Metadata } from "next";
import { DownloadClient } from "@/components/DownloadClient";
import { pageMetadata } from "@/lib/pageMetadata";

export const metadata: Metadata = pageMetadata("/download", "Get the CLOCHE App", "Find wedding vendors, venues, and inspiration with the CLOCHE mobile app.");

export default function DownloadAppPage() {
  return <DownloadClient />;
}
