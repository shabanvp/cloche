import type { Metadata } from "next";
import { SignupClient } from "@/components/SignupClient";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create a free Cloche account to save your favourite wedding vendors, venues, and inspirations.",
  openGraph: {
    title: "Sign Up | CLOCHE",
    description: "Create a free Cloche account to save your favourite wedding vendors, venues, and inspirations.",
  },
  twitter: {
    card: "summary",
    title: "Sign Up | CLOCHE",
    description: "Create a free Cloche account to save your favourite wedding vendors, venues, and inspirations.",
  },
};

export default function SignupPage() {
  return <SignupClient />;
}
