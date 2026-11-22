import type { Metadata } from "next";
import { pageMetadata } from "@/lib/pageMetadata";

export const metadata: Metadata = pageMetadata(
  "/contact",
  "Contact CLOCHE",
  "Contact the CLOCHE team for help with wedding planning or joining as a wedding professional."
);

export default function ContactLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
