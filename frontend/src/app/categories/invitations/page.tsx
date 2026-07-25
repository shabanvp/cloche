import type { Metadata } from "next";
import { InvitationsListing } from "@/components/InvitationsListing";

export const metadata: Metadata = {
  title: "Invitation Designers | Cloche",
  description: "Find the best wedding invitation designers for your special day.",
};

export default function CategoriesInvitationsPage() {
  return <InvitationsListing />;
}
