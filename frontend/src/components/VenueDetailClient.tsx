"use client";

import { VenueDetail } from "@/lib/venueData";
import { VendorProfileLayout } from "@/components/VendorProfileLayout";

export function VenueDetailClient({ venue }: { venue: VenueDetail }) {
  const v = venue || {};
  const profileData = {
    ...v,
    id: v.id || "venue-1",
    name: v.name || (v as any).venueName || (v as any).business_name || (v as any).boutique_name || "Royal Orchid Palace & Banquets",
    category: "venue",
    location: v.location || [(v as any).address, (v as any).district, (v as any).state || v.city].filter(Boolean).join(", ") || "Golf Course Road, Gurgaon",
    rating: v.rating || 4.9,
    reviews: (v as any).reviewsCount || (v as any).reviews || 156,
    image: v.image || (v as any).coverImage || (v as any).cover_image || "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=600&q=80",
    coverImage: (v as any).coverImage || (v as any).cover_image || v.image,
    logo: (v as any).logo || (v as any).logo_url,
    subtitle: (v as any).tagline || (v as any).shortDescription || "Grand banquet halls, lush outdoor lawns and 5-star wedding experiences.",
    about: (v as any).description || (v as any).about || "Royal Orchid Palace is a premier wedding venue known for hosting royal celebrations, grand receptions, and unforgettable wedding ceremonies.",
    phone: (v as any).phone || "9876543210",
    whatsapp: (v as any).whatsapp || (v as any).phone,
    email: (v as any).email,
    address: (v as any).address,
    district: (v as any).district,
    state: (v as any).state,
    googleMaps: (v as any).googleMaps || (v as any).google_maps_url,
    startingPrice: (v as any).contactForPricing ? "Contact for Pricing" : (v as any).vegPrice ? `₹${(v as any).vegPrice} / plate` : v.startingPrice || "Contact for Pricing",
    stats: [
      { icon: "users", value: (v as any).guestCapacity || v.capacity ? `${(v as any).guestCapacity || v.capacity}` : "1,500", label: "Max Capacity" },
      { icon: "building", value: (v as any).roomsCount || (v as any).numberOfRooms ? `${(v as any).roomsCount || (v as any).numberOfRooms}` : "24", label: "Guest Rooms" },
      { icon: "star", value: `${v.rating || 4.9}`, label: "Average Rating" }
    ],
  };

  return <VendorProfileLayout vendor={profileData} />;
}
