import type { Metadata } from "next";
import { VendorRegisterClient } from "@/components/VendorRegisterClient";

export const metadata: Metadata = {
  title: "Vendor Registration",
  description: "Join Cloche as a partner vendor. Showcase your luxury boutique, bridal wear, makeup, or wedding venue to thousands of couples.",
  openGraph: {
    title: "Vendor Registration | CLOCHE",
    description: "Join Cloche as a partner vendor. Showcase your luxury boutique, bridal wear, makeup, or wedding venue to thousands of couples.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vendor Registration | CLOCHE",
    description: "Join Cloche as a partner vendor. Showcase your luxury boutique, bridal wear, makeup, or wedding venue to thousands of couples.",
  },
};

export default function VendorRegisterPage() {
  return <VendorRegisterClient />;
}
