import type { Metadata } from "next";
import { VendorLoginClient } from "@/components/VendorLoginClient";

export const metadata: Metadata = {
  title: "Vendor Login",
  description: "Log in to the Cloche Vendor Portal to manage your boutique profile, collections, leads, and analytics.",
  openGraph: {
    title: "Vendor Login | CLOCHE",
    description: "Log in to the Cloche Vendor Portal to manage your boutique profile, collections, leads, and analytics.",
  },
  twitter: {
    card: "summary",
    title: "Vendor Login | CLOCHE",
    description: "Log in to the Cloche Vendor Portal to manage your boutique profile, collections, leads, and analytics.",
  },
};

export default function VendorLoginPage() {
  return <VendorLoginClient />;
}
