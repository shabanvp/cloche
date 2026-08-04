"use client";

import { VendorDetail } from "@/lib/vendorLists";
import { VendorProfileLayout } from "@/components/VendorProfileLayout";

export function PhotographerDetailClient({ photographer }: { photographer: VendorDetail }) {
  const profileData = {
    id: photographer.id,
    name: photographer.name,
    category: "photographer",
    location: photographer.location,
    rating: photographer.rating,
    reviews: photographer.reviews,
    image: photographer.image || (photographer.images && photographer.images[0]) || "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=600&q=80",
    subtitle: "Candid wedding photography, cinematic films, and timeless pre-wedding stories.",
    about: photographer.about,
    phone: photographer.phone,
    email: photographer.email,
    stats: [
      { icon: "clock", value: "8+", label: "Years Experience" },
      { icon: "camera", value: "350+", label: "Weddings Covered" },
      { icon: "star", value: `${photographer.rating}`, label: "Average Rating" }
    ],
    highlightsTitle: "Portfolio Highlights",
    highlights: (photographer.images || []).map((img, i) => ({
      name: i === 0 ? "Candid Moments" : i === 1 ? "Cinematic Films" : "Pre-Wedding Shoot",
      image: img
    }))
  };

  return <VendorProfileLayout vendor={profileData} />;
}
