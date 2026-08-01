import type { Metadata } from "next";
import { VerifyEmailClient } from "@/components/VerifyEmailClient";

export const metadata: Metadata = {
  title: "Verify Vendor Email",
  description: "Verify your Cloche vendor account email address.",
  openGraph: {
    title: "Verify Vendor Email | CLOCHE",
    description: "Verify your Cloche vendor account email address.",
  },
  twitter: {
    card: "summary",
    title: "Verify Vendor Email | CLOCHE",
    description: "Verify your Cloche vendor account email address.",
  },
};

export default function VendorVerifyEmailPage() {
  return <VerifyEmailClient />;
}
