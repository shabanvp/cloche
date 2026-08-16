"use client";

export interface MehendiService {
  id: string;
  name: string;
  category: string;
  description: string;
  price: string;
  duration?: string;
  features: string[];
  image_url?: string;
}

export interface MehendiHighlightOption {
  id: string;
  label: string;
}

export interface MehendiPackage {
  id: string;
  name: string;
  tagline?: string;
  price: string;
  originalPrice?: string;
  description: string;
  features: string[];
  isPopular?: boolean;
}

export interface MehendiBusinessInfo {
  experienceYears: string;
  maxBridesPerDay: string;
  organicHennaCertified: boolean;
  teamSize: string;
  travelCities: string;
  languagesSpoken: string;
}

export interface MehendiBookingPolicy {
  advanceBookingRequired: string;
  advancePaymentPolicy: string;
  cancellationPolicy: string;
  stainCarePolicy: string;
  groupBookingPolicy: string;
  travelPolicy: string;
}

export interface MehendiWorkingHours {
  openingTime: string;
  closingTime: string;
  weeklyHolidays: string;
  appointmentNotice: string;
  homeVisitAvailable: boolean;
}

export interface MehendiBrandTheme {
  id: string;
  label: string;
  primary: string;
  secondary: string;
  accent: string;
  badgeBg: string;
  badgeText: string;
}

export const MEHENDI_COLOR_THEMES: MehendiBrandTheme[] = [
  { id: "emerald", label: "Emerald Green", primary: "#0F4C45", secondary: "#072B27", accent: "#C8A96A", badgeBg: "#0F4C45", badgeText: "#FFFFFF" },
  { id: "henna", label: "Warm Henna / Sand", primary: "#8C4A27", secondary: "#5A2E16", accent: "#E8C39E", badgeBg: "#8C4A27", badgeText: "#FFFFFF" },
  { id: "burgundy", label: "Royal Burgundy", primary: "#800020", secondary: "#4A0012", accent: "#D4AF37", badgeBg: "#800020", badgeText: "#FFFFFF" },
  { id: "rosegold", label: "Rose Gold", primary: "#B87333", secondary: "#915622", accent: "#E8A598", badgeBg: "#B87333", badgeText: "#FFFFFF" },
  { id: "blackgold", label: "Black & Gold", primary: "#1A1A1A", secondary: "#0A0A0A", accent: "#C8A96A", badgeBg: "#1A1A1A", badgeText: "#C8A96A" },
  { id: "softpink", label: "Soft Blush Pink", primary: "#C27BA0", secondary: "#9E5A7E", accent: "#F4C2C2", badgeBg: "#C27BA0", badgeText: "#FFFFFF" },
];

export const MEHENDI_HIGHLIGHT_OPTIONS: string[] = [
  "100% Organic Henna",
  "Bridal Specialist",
  "Arabic & Indo-Arabic",
  "Outstation Travel Available",
  "Custom Figure Portraits",
  "Rajasthani Traditional",
  "Marwari Bridal",
  "Glitter & Stone Henna",
  "Fast Dark Stain",
  "Certified Artist",
  "Group Booking Available",
  "Verified Partner",
];

export const ALL_MEHENDI_PACKAGE_OPTIONS: string[] = [
  "Signature Bridal Mehendi",
  "Rajasthani Traditional Set",
  "Arabic & Minimalist Henna",
  "Royale Family & Guest Package",
  "Indo-Arabic Fusion",
  "Portrait & Storytelling Henna",
];
