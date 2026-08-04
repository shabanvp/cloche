"use client";

import { VendorProfileLayout, VendorProfileData } from "@/components/VendorProfileLayout";
import { VendorProfileConfig } from "@/lib/vendorTemplates";

interface Props {
  config: VendorProfileConfig;
}

export function GenericCategoryProfileTemplate({ config }: Props) {
  const profileData: VendorProfileData = {
    id: config.id || config.vendorId || "gen-1",
    name: config.businessName || "Cloche Luxury Vendor",
    category: config.category?.toLowerCase() || "catering",
    location: config.city || "Mumbai",
    rating: (config as any)?.rating || 4.9,
    reviews: (config as any)?.reviewsCount || 100,
    image: config.coverImage || "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=600&q=80",
    subtitle: config.tagline || "Luxury wedding services, bespoke experiences and top-rated vendor excellence.",
    about: config.aboutText || "Known for high-end wedding planning and exceptional quality.",
    phone: config.phone || "9876543210"
  };

  return <VendorProfileLayout vendor={profileData} />;
}
