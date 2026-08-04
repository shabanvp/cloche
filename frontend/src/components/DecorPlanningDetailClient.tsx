"use client";

import { DecorVendor } from "@/lib/decorData";
import { VendorProfileLayout } from "@/components/VendorProfileLayout";

export function DecorPlanningDetailClient({ vendor }: { vendor: DecorVendor }) {
  const profileData = {
    id: vendor.id,
    name: vendor.name,
    category: "decorator",
    location: vendor.location,
    rating: vendor.rating,
    reviews: vendor.reviews,
    image: vendor.image || (vendor.portfolio && vendor.portfolio[0]) || "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=600&q=80",
    subtitle: vendor.subtitle || "Luxury wedding decor, breathtaking mandap setups, and fairy-tale themes.",
    about: vendor.about,
    phone: vendor.phone,
    stats: [
      { icon: "clock", value: `${vendor.yearsInBusiness || 10}+`, label: "Years Experience" },
      { icon: "sparkles", value: `${vendor.eventsDecorated || 450}+`, label: "Events Designed" },
      { icon: "star", value: `${vendor.rating}`, label: "Average Rating" }
    ],
    highlightsTitle: "Decoration Themes & Mandaps",
    highlights: (vendor.portfolio || []).map((img, i) => ({
      name: i === 0 ? "Royal Floral Mandap" : i === 1 ? "Fairy Light Tunnel" : "Contemporary Stage",
      image: img
    }))
  };

  return <VendorProfileLayout vendor={profileData} />;
}
