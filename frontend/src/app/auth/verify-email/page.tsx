import type { Metadata } from "next";
import { VerifyEmailClient } from "@/components/VerifyEmailClient";

export const metadata: Metadata = {
  title: "Email Verification",
  description: "Verify your email address for Cloche.",
  openGraph: {
    title: "Email Verification | CLOCHE",
    description: "Verify your email address for Cloche.",
  },
  twitter: {
    card: "summary",
    title: "Email Verification | CLOCHE",
    description: "Verify your email address for Cloche.",
  },
};

export default function AuthVerifyEmailPage() {
  return <VerifyEmailClient />;
}
