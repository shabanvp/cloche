import type { Metadata } from "next";
import { ForgotPasswordClient } from "@/components/ForgotPasswordClient";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Reset your Cloche account password.",
  openGraph: {
    title: "Reset Password | CLOCHE",
    description: "Reset your Cloche account password.",
  },
  twitter: {
    card: "summary",
    title: "Reset Password | CLOCHE",
    description: "Reset your Cloche account password.",
  },
};

export default function ResetPasswordPage() {
  return <ForgotPasswordClient />;
}
