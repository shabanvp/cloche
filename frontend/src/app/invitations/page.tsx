import { VendorCategoryListing } from "@/components/VendorCategoryListing";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wedding Invitations | Cloche Luxury Weddings",
  description: "Find the perfect invitation for your special day. Luxury traditional, modern, minimal, and e-invites.",
};

export default function InvitationsPage() {
  return <VendorCategoryListing categorySlug="invitations" />;
}
