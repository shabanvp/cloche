import type { Metadata } from "next";
import { DigitalInvitationsClient } from "@/components/DigitalInvitationsClient";

export const metadata: Metadata = {
  title: "Digital Wedding Invitations & Save the Date Templates | CLOCHE",
  description: "Browse and customize premium digital wedding invitation templates. Send elegant animated Save the Date invites via WhatsApp and web.",
};

export default function DigitalInvitationsPage() {
  return <DigitalInvitationsClient />;
}
