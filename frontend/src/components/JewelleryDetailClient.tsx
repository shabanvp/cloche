"use client";

import type { JewelleryVendor } from "@/lib/jewelleryData";
import { VendorProfileLayout } from "@/components/VendorProfileLayout";

export function JewelleryDetailClient({ vendor }: { vendor: JewelleryVendor }) {
  const profileData = {
    id: vendor.id,
    name: vendor.name,
    category: "jewellery",
    location: vendor.location,
    rating: vendor.rating,
    reviews: vendor.reviews,
    image: vendor.image || (vendor.portfolio && vendor.portfolio[0]) || "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&q=80",
    subtitle: (vendor as any).tagline || "Certified gold, solitaire diamonds & royal heritage polki bridal sets.",
    about: vendor.about,
    phone: (vendor as any).phone || "9876543210",
    stats: [
      { icon: "sparkles", value: "100%", label: "Certified Jewels" },
      { icon: "building", value: "800+", label: "Unique Designs" },
      { icon: "star", value: `${vendor.rating}`, label: "Average Rating" }
    ],
    highlightsTitle: "Jewellery Highlights",
    highlights: (vendor.portfolio || []).map((img, i) => ({
      name: i === 0 ? "Heritage Polki Choker" : i === 1 ? "Temple Gold Set" : "Diamond Solitaire",
      image: img
    }))
  };

  return <VendorProfileLayout vendor={profileData} />;
}
