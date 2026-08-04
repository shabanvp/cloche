"use client";

import { BridalBoutiqueVendor } from "@/lib/bridalAndInvitationData";
import { VendorProfileLayout } from "@/components/VendorProfileLayout";

export function BridalWearDetailClient({ boutique }: { boutique: BridalBoutiqueVendor }) {
  const profileData = {
    id: boutique.id,
    name: boutique.name,
    category: "bridal-wear",
    location: boutique.location,
    rating: boutique.rating,
    reviews: boutique.reviewsCount || boutique.reviews || 95,
    image: boutique.image || "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&q=80",
    subtitle: boutique.tagline || "Luxury bridal lehengas, custom couture, and exquisite wedding outfits.",
    about: boutique.about,
    phone: boutique.phone || "9876543210",
    stats: [
      { icon: "sparkles", value: "500+", label: "Designer Outfits" },
      { icon: "users", value: "1,200+", label: "Happy Brides" },
      { icon: "star", value: `${boutique.rating || 4.9}`, label: "Average Rating" }
    ]
  };

  return <VendorProfileLayout vendor={profileData} />;
}
