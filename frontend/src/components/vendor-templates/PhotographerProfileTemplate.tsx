"use client";

import { VendorProfileLayout, VendorProfileData } from "@/components/VendorProfileLayout";
import { VendorProfileConfig } from "@/lib/vendorTemplates";

interface Props {
  config: VendorProfileConfig;
}

export function PhotographerProfileTemplate({ config }: Props) {
  const profileData: VendorProfileData = {
    id: config.id || config.vendorId || "photo-1",
    name: config.businessName || "Royal Wedding Photography",
    category: "photographer",
    location: config.city || "Mumbai",
    rating: (config as any)?.rating || 4.9,
    reviews: (config as any)?.reviewsCount || 140,
    image: config.coverImage || "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=600&q=80",
    subtitle: config.tagline || "Candid wedding photography, cinematic films, and timeless pre-wedding stories.",
    about: config.aboutText || "Capturing timeless emotions, royal rituals, and unforgettable moments.",
    phone: config.phone || "9876543210"
  };

  return <VendorProfileLayout vendor={profileData} />;
}
