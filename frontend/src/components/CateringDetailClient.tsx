"use client";

import { CateringVendor } from "@/lib/cateringData";
import { VendorProfileLayout } from "@/components/VendorProfileLayout";

export function CateringDetailClient({ vendor }: { vendor: CateringVendor }) {
  const profileData = {
    id: vendor.id,
    name: vendor.name,
    category: "catering",
    location: vendor.location,
    rating: vendor.rating,
    reviews: vendor.reviews,
    image: vendor.image,
    subtitle: vendor.subtitle,
    about: vendor.about,
    isVerified: vendor.isVerified,
    phone: (vendor as any).phone || "9876543210",
    stats: [
      { icon: "clock", value: `${vendor.yearsInBusiness || 10}+`, label: "Years in Business" },
      { icon: "utensils", value: `${vendor.eventsCartered || 500}+`, label: "Events Catered" },
      { icon: "star", value: `${vendor.rating}`, label: "Average Rating" }
    ],
    highlightsTitle: "Menu Highlights",
    highlights: vendor.menuHighlights || [],
    prices: vendor.prices || [],
    services: vendor.services || [],
    userReviews: vendor.userReviews || []
  };

  return <VendorProfileLayout vendor={profileData} />;
}

