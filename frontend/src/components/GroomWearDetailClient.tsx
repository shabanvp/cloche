"use client";

import { GroomWearVendor } from "@/lib/groomWearData";
import { VendorProfileLayout } from "@/components/VendorProfileLayout";

export function GroomWearDetailClient({ vendor }: { vendor: GroomWearVendor }) {
  const profileData = {
    id: vendor.id,
    name: vendor.name,
    category: "groom-wear",
    location: vendor.location,
    rating: vendor.rating,
    reviews: vendor.reviews,
    image: vendor.image || "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&q=80",
    subtitle: vendor.subtitle || "Bespoke royal sherwanis, Indo-western suits, and designer groom wear.",
    about: vendor.about,
    phone: vendor.phone,
    stats: [
      { icon: "sparkles", value: "400+", label: "Designer Sherwanis" },
      { icon: "users", value: "950+", label: "Grooms Styled" },
      { icon: "star", value: `${vendor.rating}`, label: "Average Rating" }
    ]
  };

  return <VendorProfileLayout vendor={profileData} />;
}
