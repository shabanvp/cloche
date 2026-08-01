import type { Metadata } from "next";
import { LoginClient } from "@/components/LoginClient";

export const metadata: Metadata = {
  title: "Login",
  description: "Log in to your Cloche account to manage wedding wishlists, bookings, and vendor inquiries.",
  openGraph: {
    title: "Login | CLOCHE",
    description: "Log in to your Cloche account to manage wedding wishlists, bookings, and vendor inquiries.",
  },
  twitter: {
    card: "summary",
    title: "Login | CLOCHE",
    description: "Log in to your Cloche account to manage wedding wishlists, bookings, and vendor inquiries.",
  },
};

export default function LoginPage() {
  return <LoginClient />;
}
