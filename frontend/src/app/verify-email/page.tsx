import type { Metadata } from "next";
import { VerifyEmailClient } from "@/components/VerifyEmailClient";

export const metadata: Metadata = {
  title: "Verify Email",
  description: "Email verification status for your Cloche account.",
  openGraph: {
    title: "Verify Email | CLOCHE",
    description: "Email verification status for your Cloche account.",
  },
  twitter: {
    card: "summary",
    title: "Verify Email | CLOCHE",
    description: "Email verification status for your Cloche account.",
  },
};

export default function VerifyEmailPage() {
  return <VerifyEmailClient />;
}
