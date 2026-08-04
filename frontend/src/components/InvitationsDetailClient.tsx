"use client";

import { InvitationVendor } from "@/lib/bridalAndInvitationData";
import { VendorProfileLayout } from "@/components/VendorProfileLayout";

export function InvitationsDetailClient({ vendor }: { vendor: InvitationVendor }) {
  const profileData = {
    id: vendor.id,
    name: vendor.name,
    category: "invitations",
    location: vendor.location,
    rating: vendor.rating,
    reviews: vendor.reviewsCount || 84,
    image: vendor.image || "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=600&q=80",
    subtitle: vendor.tagline || "Luxury wedding invitations, digital e-invites, boxed hampers & custom stationery.",
    about: vendor.about,
    phone: vendor.phone,
    stats: [
      { icon: "sparkles", value: "300+", label: "Design Templates" },
      { icon: "building", value: "1,500+", label: "Orders Delivered" },
      { icon: "star", value: `${vendor.rating}`, label: "Average Rating" }
    ]
  };

  return <VendorProfileLayout vendor={profileData} />;
}
