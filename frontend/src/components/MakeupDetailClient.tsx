"use client";

import { VendorDetail } from "@/lib/vendorLists";
import { VendorProfileLayout } from "@/components/VendorProfileLayout";

export function MakeupDetailClient({ artist }: { artist: VendorDetail }) {
  const profileData = {
    id: artist.id,
    name: artist.name,
    category: "makeup",
    location: artist.location,
    rating: artist.rating,
    reviews: artist.reviews,
    image: artist.image || (artist.images && artist.images[0]) || "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80",
    subtitle: (artist as any).tagline || "Luxury bridal makeup artist specializing in HD 4K Airbrush & signature glam.",
    about: artist.about,
    phone: artist.phone,
    email: artist.email,
    stats: [
      { icon: "clock", value: "8+", label: "Years Experience" },
      { icon: "sparkles", value: "850+", label: "Brides Styled" },
      { icon: "star", value: `${artist.rating}`, label: "Average Rating" }
    ],
    highlightsTitle: "Bridal Portfolio & Looks",
    highlights: (artist.images || []).map((img, i) => ({
      name: i === 0 ? "Royal Crimson Bridal" : i === 1 ? "Dewy Sangeet Glam" : "South Indian Muhurtham",
      image: img
    }))
  };

  return <VendorProfileLayout vendor={profileData} />;
}
