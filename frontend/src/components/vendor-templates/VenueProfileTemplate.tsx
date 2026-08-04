"use client";

import { VendorProfileLayout, VendorProfileData } from "@/components/VendorProfileLayout";
import { VenueDetail } from "@/lib/venueData";
import { VendorProfileConfig } from "@/lib/vendorTemplates";

interface Props {
  venue?: VenueDetail;
  config?: VendorProfileConfig;
  preview?: boolean;
}

export function VenueProfileTemplate({ venue, config }: Props) {
  const profileData: VendorProfileData = {
    id: venue?.id || config?.id || "venue-1",
    name: venue?.name || config?.businessName || "Royal Orchid Palace & Banquets",
    category: "venue",
    location: venue?.location || config?.city || "Golf Course Road, Gurgaon",
    rating: venue?.rating || config?.rating || 4.9,
    reviews: (venue as any)?.reviewsCount || (venue as any)?.reviews || config?.reviewsCount || 156,
    image: venue?.image || config?.images?.[0] || "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=600&q=80",
    subtitle: "Grand banquet halls, lush outdoor lawns and 5-star wedding experiences.",
    about: (venue as any)?.description || (venue as any)?.about || config?.aboutText || "Royal Orchid Palace is a premier wedding venue known for hosting royal celebrations, grand receptions, and unforgettable wedding ceremonies.",
    phone: (venue as any)?.phone || config?.phone || "9876543210",
    stats: [
      { icon: "users", value: venue?.capacity ? `${venue.capacity}` : "1,500", label: "Max Capacity" },
      { icon: "building", value: "24", label: "Guest Rooms" },
      { icon: "star", value: `${venue?.rating || 4.9}`, label: "Average Rating" }
    ]
  };

  return <VendorProfileLayout vendor={profileData} />;
}
