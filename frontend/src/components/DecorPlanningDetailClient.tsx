"use client";

import { DecorVendor } from "@/lib/decorData";
import { VendorProfileLayout } from "@/components/VendorProfileLayout";

export function DecorPlanningDetailClient({ vendor }: { vendor: DecorVendor & Record<string, any> }) {
  const profileData = {
    id: vendor.id,
    name: vendor.name,
    category: "decorator",
    location: vendor.location,
    rating: vendor.rating || 4.9,
    reviews: vendor.reviews || 0,
    image: vendor.image || (vendor.portfolio && vendor.portfolio[0]) || "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=600&q=80",
    subtitle: vendor.subtitle || "Luxury wedding decor, breathtaking mandap setups, and fairy-tale themes.",
    about: vendor.about,
    phone: vendor.phone || "9876543210",
    stats: [
      { icon: "clock", value: `${vendor.yearsInBusiness || vendor.experience_years || vendor.experienceYears || "12+"}`, label: "Years Experience" },
      { icon: "sparkles", value: `${vendor.eventsCompleted || vendor.events_completed || vendor.eventsDecorated || "350+"}`, label: "Events Designed" },
      { icon: "users", value: `${vendor.teamSize || vendor.team_size || "25+"}`, label: "On-Site Crew" },
      { icon: "star", value: `${vendor.rating || 4.9}`, label: "Average Rating" }
    ],
    highlightsTitle: "Decoration Themes & Mandaps",
    highlights: (vendor.portfolio || []).map((img: string, i: number) => ({
      name: (vendor.featured_themes && vendor.featured_themes[i]) || (vendor.featuredThemes && vendor.featuredThemes[i]) || (i === 0 ? "Royal Floral Mandap" : i === 1 ? "Fairy Light Tunnel" : "Contemporary Stage"),
      image: img
    }))
  };

  return <VendorProfileLayout vendor={profileData} />;
}
