import type { Metadata } from "next";
import { VerifyEmailClient } from "@/components/VerifyEmailClient";

export const metadata: Metadata = {
  title: "Verify Account",
  description: "Verify your Cloche account email address.",
  openGraph: {
    title: "Verify Account | CLOCHE",
    description: "Verify your Cloche account email address.",
  },
  twitter: {
    card: "summary",
    title: "Verify Account | CLOCHE",
    description: "Verify your Cloche account email address.",
  },
};

export default function VerifyPage() {
  return <VerifyEmailClient />;
}
