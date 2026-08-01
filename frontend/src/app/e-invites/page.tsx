import type { Metadata } from "next";
import { EInvitesClient } from "@/components/EInvitesClient";

export const metadata: Metadata = {
  title: "Digital E-Invites & Save the Date",
  description: "Create elegant digital wedding invitations, animated WhatsApp video invites, and interactive wedding websites.",
  openGraph: {
    title: "Digital E-Invites & Save the Date | CLOCHE",
    description: "Create elegant digital wedding invitations, animated WhatsApp video invites, and interactive wedding websites.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Digital E-Invites & Save the Date | CLOCHE",
    description: "Create elegant digital wedding invitations, animated WhatsApp video invites, and interactive wedding websites.",
  },
};

export default function EInvitesPage() {
  return <EInvitesClient />;
}
