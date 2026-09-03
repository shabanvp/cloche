export interface SectionDefinition {
  key: string;
  title: string;
  table: string;
  fields: string[];
}

export const SECTION_REGISTRY: Record<string, SectionDefinition> = {
  hero: {
    key: "hero",
    title: "Hero & Visuals",
    table: "vendor_profiles",
    fields: ["business_name", "tagline", "logo_url", "cover_image", "city", "state", "starting_price"],
  },
  overview: {
    key: "overview",
    title: "Venue Details & Overview",
    table: "venue_details",
    fields: ["venue_type", "guest_capacity", "rooms_count", "parking_capacity", "years_in_business", "has_indoor_space", "has_outdoor_space", "has_rooftop_space", "has_bridal_room", "has_groom_room"],
  },
  pricing: {
    key: "pricing",
    title: "Pricing Information",
    table: "venue_details",
    fields: ["veg_price", "non_veg_price", "decor_starting_price", "contact_for_pricing"],
  },
  gallery: {
    key: "gallery",
    title: "Portfolio Gallery",
    table: "vendor_gallery",
    fields: ["gallery_images"],
  },
  about: {
    key: "about",
    title: "About & Story",
    table: "vendor_profiles",
    fields: ["about", "description", "store_highlights", "years_in_business"],
  },
  policies: {
    key: "policies",
    title: "Policies & Rules",
    table: "venue_details",
    fields: ["policy_switches", "decoration_rules", "cancellation_policy"],
  },
  amenities: {
    key: "amenities",
    title: "Facilities & Amenities",
    table: "venue_details",
    fields: ["facilities"],
  },
  packages: {
    key: "packages",
    title: "Curated Packages",
    table: "vendor_service_packages",
    fields: ["packages"],
  },
  faqs: {
    key: "faqs",
    title: "Frequently Asked Questions",
    table: "vendor_profiles",
    fields: ["faqs"],
  },
  hours: {
    key: "hours",
    title: "Business Hours",
    table: "venue_details",
    fields: ["opening_time", "closing_time", "working_days", "weekly_off", "holiday_notice"],
  },
  contact: {
    key: "contact",
    title: "Contact & Location",
    table: "vendor_contacts",
    fields: ["phone", "whatsapp", "email", "address", "google_maps_url"],
  },
  socials: {
    key: "socials",
    title: "Social Media Links",
    table: "vendor_social_links",
    fields: ["instagram", "facebook", "youtube", "website"],
  },
  service_areas: {
    key: "service_areas",
    title: "Service Areas & Cities Served",
    table: "vendor_profiles",
    fields: ["service_areas", "cities_served"],
  },
  visibility: {
    key: "visibility",
    title: "Profile Visibility",
    table: "vendors",
    fields: ["publication_status", "status"],
  },
};

export const CATEGORY_SECTIONS: Record<string, string[]> = {
  venue: ["hero", "overview", "pricing", "gallery", "about", "policies", "amenities", "packages", "faqs", "hours", "contact", "socials", "service_areas", "visibility"],
  photographer: ["hero", "gallery", "packages", "about", "faqs", "hours", "contact", "socials", "service_areas", "visibility"],
  "bridal-wear": ["hero", "gallery", "pricing", "about", "policies", "faqs", "hours", "contact", "socials", "visibility"],
  makeup: ["hero", "gallery", "packages", "about", "faqs", "hours", "contact", "socials", "service_areas", "visibility"],
  mehendi: ["hero", "gallery", "packages", "about", "faqs", "hours", "contact", "socials", "visibility"],
  catering: ["hero", "pricing", "gallery", "packages", "about", "amenities", "faqs", "hours", "contact", "socials", "visibility"],
  decorator: ["hero", "gallery", "packages", "about", "policies", "faqs", "hours", "contact", "socials", "visibility"],
  jewellery: ["hero", "gallery", "pricing", "about", "faqs", "hours", "contact", "socials", "visibility"],
  invitations: ["hero", "gallery", "packages", "about", "faqs", "hours", "contact", "socials", "visibility"],
};

export function getCategorySections(categorySlug: string): string[] {
  const norm = (categorySlug || "").toLowerCase();
  for (const [catKey, sections] of Object.entries(CATEGORY_SECTIONS)) {
    if (norm.includes(catKey)) return sections;
  }
  return CATEGORY_SECTIONS.venue;
}
