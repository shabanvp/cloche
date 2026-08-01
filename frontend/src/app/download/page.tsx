import type { Metadata } from "next";
import { DownloadClient } from "@/components/DownloadClient";

export const metadata: Metadata = {
  title: "Download Cloche Mobile App",
  description: "Download the Cloche mobile app for iOS and Android to plan your luxury Kerala wedding on the go.",
  openGraph: {
    title: "Download Cloche Mobile App | CLOCHE",
    description: "Download the Cloche mobile app for iOS and Android to plan your luxury Kerala wedding on the go.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Download Cloche Mobile App | CLOCHE",
    description: "Download the Cloche mobile app for iOS and Android to plan your luxury Kerala wedding on the go.",
  },
};

export default function DownloadAppPage() {
  return <DownloadClient />;
}
