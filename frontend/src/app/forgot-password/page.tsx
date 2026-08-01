import type { Metadata } from "next";
import { ForgotPasswordClient } from "@/components/ForgotPasswordClient";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Recover your Cloche account or reset your password.",
  openGraph: {
    title: "Forgot Password | CLOCHE",
    description: "Recover your Cloche account or reset your password.",
  },
  twitter: {
    card: "summary",
    title: "Forgot Password | CLOCHE",
    description: "Recover your Cloche account or reset your password.",
  },
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordClient />;
}
