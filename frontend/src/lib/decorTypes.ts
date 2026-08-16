"use client";

export interface DecorServiceItem {
  id: string;
  name: string;
  category: string;
  description: string;
  price: string;
  features: string[];
  image_url?: string;
}

export interface DecorHighlightOption {
  id: string;
  label: string;
}

export interface DecorThemeOption {
  id: string;
  name: string;
  tagline?: string;
  price: string;
  description: string;
  features: string[];
  isPopular?: boolean;
}

export interface DecorBusinessInfo {
  experienceYears: string;
  teamSize: string;
  eventsCompleted: string;
  citiesServed: string;
  languagesSpoken: string;
  decorServices: string[];
}

export interface DecorBookingPolicy {
  advanceBookingRequired: string;
  advancePaymentPolicy: string;
  cancellationPolicy: string;
  setupTeardownPolicy: string;
  propertyDamagePolicy: string;
  travelPolicy: string;
}

export interface DecorWorkingHours {
  openingTime: string;
  closingTime: string;
  weeklyHolidays: string;
  consultationNotice: string;
  siteSurveyAvailable: boolean;
}

export interface DecorBrandTheme {
  id: string;
  label: string;
  primary: string;
  secondary: string;
  accent: string;
  badgeBg: string;
  badgeText: string;
}

export const DECOR_COLOR_THEMES: DecorBrandTheme[] = [
  { id: "emerald", label: "Emerald Green", primary: "#0F4C45", secondary: "#072B27", accent: "#C8A96A", badgeBg: "#0F4C45", badgeText: "#FFFFFF" },
  { id: "burgundy", label: "Royal Burgundy", primary: "#800020", secondary: "#4A0012", accent: "#D4AF37", badgeBg: "#800020", badgeText: "#FFFFFF" },
  { id: "rosegold", label: "Rose Gold", primary: "#B87333", secondary: "#915622", accent: "#E8A598", badgeBg: "#B87333", badgeText: "#FFFFFF" },
  { id: "gold", label: "Warm Gold / Henna", primary: "#8C4A27", secondary: "#5A2E16", accent: "#E8C39E", badgeBg: "#8C4A27", badgeText: "#FFFFFF" },
  { id: "blackgold", label: "Black & Gold", primary: "#1A1A1A", secondary: "#0A0A0A", accent: "#C8A96A", badgeBg: "#1A1A1A", badgeText: "#C8A96A" },
  { id: "softpink", label: "Soft Blush Pink", primary: "#C27BA0", secondary: "#9E5A7E", accent: "#F4C2C2", badgeBg: "#C27BA0", badgeText: "#FFFFFF" },
];

export const DECOR_HIGHLIGHT_OPTIONS: string[] = [
  "Floral Specialists",
  "Royal Mandap Designs",
  "Eco-Friendly Decor",
  "Destination Wedding Decor",
  "3D Stage Renderings",
  "Theme-Based Setup",
  "Custom Lighting Installation",
  "Verified Partner",
  "Outstation Travel Available",
  "Luxury Lounge Staging",
  "Sustainable Floral Props",
  "Custom Canopy & Tenting",
];

export const ALL_DECOR_THEME_OPTIONS: string[] = [
  "Royal Heritage Rajwada",
  "Bohemian Garden Floral",
  "Minimalist Pastel Elegance",
  "Celestial Candlelight Staging",
  "Vintage Botanical Canopy",
  "Bollywood Glitz & Starlight",
];

export const ALL_DECOR_SERVICES_OPTIONS: string[] = [
  "Mandap & Stage Staging",
  "Floral Artistry & Installation",
  "Mood Lighting & Trussing",
  "Theme Tenting & Canopies",
  "Luxury Lounge Seating",
  "Table Centerpiece Decor",
  "Entrance Gate Arches",
  "Pathway & Aisle Decor",
];
