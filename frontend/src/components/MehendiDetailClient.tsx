"use client";

import { MehendiVendor } from "@/lib/mehendiData";
import { VendorProfileLayout } from "@/components/VendorProfileLayout";

export function MehendiDetailClient({ artist }: { artist: MehendiVendor }) {
  const profileData = {
    id: artist.id,
    name: artist.name,
    category: "mehendi",
    location: artist.location,
    rating: artist.rating,
    reviews: artist.reviews,
    image: artist.image || (artist.portfolio && artist.portfolio[0]) || "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&q=80",
    subtitle: artist.tagline || "Exquisite bridal mehndi, intricate organic henna designs & royal patterns.",
    about: artist.about,
    phone: artist.phone,
    stats: [
      { icon: "clock", value: `${artist.experienceYears || 7}+`, label: "Years Experience" },
      { icon: "sparkles", value: `${artist.bridesServed || 600}+`, label: "Brides Applied" },
      { icon: "star", value: `${artist.rating}`, label: "Average Rating" }
    ],
    highlightsTitle: "Mehndi Design Highlights",
    highlights: (artist.portfolio || []).map((img, i) => ({
      name: i === 0 ? "Royal Rajasthani Motif" : i === 1 ? "Intricate Arabic" : "Portrait Motif",
      image: img
    }))
  };

  return <VendorProfileLayout vendor={profileData} />;
}
