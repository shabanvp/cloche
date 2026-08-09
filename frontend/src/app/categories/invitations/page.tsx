import { VendorCategoryListing } from "@/components/VendorCategoryListing";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wedding Invitations | Cloche",
  description: "Explore luxury wedding invitations, digital e-invites, and stationery designers.",
};

export default function InvitationsCategoryPage() {
  return <VendorCategoryListing categorySlug="invitations" />;
}
