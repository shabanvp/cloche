export type MehendiBusinessType =
  | "Individual Mehendi Artist"
  | "Mehendi Studio"
  | "Mehendi Artist Team";

export type MehendiPricingMethod =
  | "Fixed Price"
  | "Per Hand"
  | "Per Person"
  | "Per Hour"
  | "Custom Quotation";

export type MehendiComplexity =
  | "Simple"
  | "Moderate"
  | "Detailed"
  | "Highly Intricate";

export type MehendiAppointmentStatus =
  | "pending"
  | "confirmed"
  | "rejected"
  | "rescheduled"
  | "completed"
  | "cancelled";

export const MEHENDI_SPECIALIZATIONS = [
  "Indian Bridal Mehendi",
  "Arabic Mehendi",
  "Rajasthani Mehendi",
  "Indo-Arabic Mehendi",
  "Moroccan Mehendi",
  "Mughlai Mehendi",
  "Mandala Mehendi",
  "Minimal Mehendi",
  "Traditional Mehendi",
  "Contemporary Mehendi",
  "Portrait Mehendi",
  "Customized Bridal Mehendi",
  "Engagement Mehendi",
  "Festival Mehendi",
  "Guest Mehendi",
  "Feet Mehendi",
] as const;

export const MEHENDI_SERVICE_CATEGORIES = [
  "Bridal Mehendi",
  "Engagement Mehendi",
  "Arabic Mehendi",
  "Rajasthani Mehendi",
  "Indo-Arabic Mehendi",
  "Guest Mehendi",
  "Party Mehendi",
  "Feet Mehendi",
  "Minimal Mehendi",
  "Customized Mehendi",
  "Festival Mehendi",
  "Family Mehendi",
] as const;

export const MEHENDI_PORTFOLIO_CATEGORIES = [
  "Bridal Mehendi",
  "Arabic Mehendi",
  "Rajasthani Mehendi",
  "Indo-Arabic Mehendi",
  "Engagement Mehendi",
  "Party Mehendi",
  "Feet Mehendi",
  "Minimal Mehendi",
  "Traditional Mehendi",
  "Customized Designs",
] as const;

export const MEHENDI_APPLICATION_AREAS = [
  "Palms Only",
  "Both Sides of Hands (To Wrist)",
  "Forearm Length",
  "Elbow Length",
  "Feet to Ankles",
  "Feet to Mid-Calf",
  "Full Arms & Legs",
] as const;

export const MEHENDI_SERVICE_OPTIONS = [
  "Studio Appointments",
  "Home Service",
  "Wedding Venue Service",
  "Outstation Service",
  "International Service",
] as const;

export const MEHENDI_COLOR_THEMES = [
  { id: "emerald", label: "Emerald Green", primary: "#0F4C45", secondary: "#072B27", accent: "#C8A96A" },
  { id: "henna", label: "Warm Henna", primary: "#8C4A27", secondary: "#5A2E16", accent: "#E8C39E" },
  { id: "burgundy", label: "Royal Burgundy", primary: "#800020", secondary: "#4A0012", accent: "#D4AF37" },
  { id: "rosegold", label: "Rose Gold", primary: "#B87333", secondary: "#915622", accent: "#E8A598" },
  { id: "blackgold", label: "Black & Gold", primary: "#1A1A1A", secondary: "#0A0A0A", accent: "#C8A96A" },
  { id: "softpink", label: "Soft Blush Pink", primary: "#C27BA0", secondary: "#9E5A7E", accent: "#F4C2C2" },
];

export interface MehendiProfileData {
  vendorId: string;
  vendorCode: string | null;
  status: string;
  publicationStatus: "published" | "draft";
  isVerified: boolean;
  businessName: string;
  slug: string;
  ownerName: string;
  businessLogoUrl: string;
  businessLogoMediaId: string | null;
  profilePhotoUrl: string;
  profilePhotoMediaId: string | null;
  coverPhotoUrl: string;
  coverPhotoMediaId: string | null;
  tagline: string;
  about: string;
  businessType: MehendiBusinessType;
  establishedYear: number | null;
  experienceYears: number | null;
  teamSize: string;
  primaryArtistName: string;
  intro: string;
  professionalExperience: string;
  training: string;
  certifications: string[];
  awards: string[];
  languagesSpoken: string[];
  specializations: string[];
  country: string;
  state: string;
  district: string;
  city: string;
  addressLine1: string;
  addressLine2: string;
  pincode: string;
  studioLocation: string;
  googleMapsUrl: string;
  serviceOptions: string[];
  citiesServed: string[];
  phone: string;
  whatsapp: string;
  email: string;
  instagram: string;
  facebook: string;
  website: string;
  youtube: string;
  preferredContactMethod: "WhatsApp" | "Phone" | "Email";
  workingDays: string[];
  workingHours: { start: string; end: string };
  appointmentPreferences: string;
  advanceBookingPeriod: string;
  homeServiceAvailable: boolean;
  startingPrice: number | null;
  rating: number;
  reviewCount: number;
  profileCompletionPercentage: number;
}

export interface MehendiServiceItem {
  id: string;
  name: string;
  category: string;
  description: string;
  imageUrl: string;
  pricingMethod: MehendiPricingMethod;
  startingPrice: number | null;
  estimatedDuration: string;
  designCoverage: string;
  serviceLocation: string;
  additionalCharges: string;
  isActive: boolean;
  sortOrder: number;
  createdAt?: string;
}

export interface MehendiPortfolioDesignItem {
  id: string;
  mediaId?: string;
  title: string;
  imageUrl: string;
  category: string;
  description: string;
  style: string;
  applicationArea: string;
  complexity: MehendiComplexity;
  estimatedDuration: string;
  startingPrice: number | null;
  isFeatured: boolean;
  isPublic: boolean;
  viewCount?: number;
  sortOrder: number;
  createdAt?: string;
}

export interface MehendiCollectionItem {
  id: string;
  name: string;
  coverUrl: string;
  coverMediaId?: string | null;
  description: string;
  category: string;
  selectedDesignIds: string[];
  displayOrder: number;
  isFeatured: boolean;
  isPublic: boolean;
  createdAt?: string;
}

export interface MehendiAppointmentItem {
  id: string;
  bookingRef: string;
  customerId: string | null;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  serviceName: string;
  serviceId?: string | null;
  packageName?: string | null;
  designTitle?: string | null;
  appointmentDate: string;
  preferredTime: string;
  locationType: "Studio" | "Customer's Home" | "Wedding Venue";
  eventAddress: string;
  peopleCount: number;
  specialRequirements: string;
  status: MehendiAppointmentStatus;
  proposedTime?: string | null;
  proposedDate?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface MehendiReviewItem {
  id: string;
  customerName: string;
  customerAvatar: string;
  rating: number;
  writtenReview: string;
  serviceReceived: string;
  appointmentDate: string | null;
  reviewPhotos: string[];
  createdAt: string;
  isVerifiedBooking: boolean;
  reply?: {
    id: string;
    text: string;
    createdAt: string;
  } | null;
}

export interface MehendiReviewsBundle {
  averageRating: number;
  totalReviews: number;
  ratingBreakdown: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  reviews: MehendiReviewItem[];
}

export interface MehendiCustomizeStoreData {
  coverUrl: string;
  coverMediaId: string | null;
  logoUrl: string;
  logoMediaId: string | null;
  themeId: string;
  featuredDesignIds: string[];
  featuredCollectionIds: string[];
  portfolioDisplayOrder: "newest" | "featured" | "popular";
  collectionDisplayOrder: "manual" | "alphabetical" | "popular";
  selectedTestimonialIds: string[];
  awards: string[];
}

export interface MehendiAnalyticsBundle {
  totalProfileViews: number;
  totalDesignViews: number;
  totalCollectionViews: number;
  totalServiceViews: number;
  totalEnquiries: number;
  appointmentRequests: number;
  confirmedAppointments: number;
  contactClicks: number;
  averageRating: number;
  trafficSeries: Array<{ date: string; profileViews: number; inquiries: number; appointments: number }>;
  popularDesigns: Array<{ id: string; title: string; imageUrl: string; views: number; category: string }>;
  popularServices: Array<{ name: string; inquiries: number; startingPrice: number | null }>;
}

export interface MehendiFaqItem {
  id: string;
  question: string;
  answer: string;
  isPublished: boolean;
}

export type MehendiDashboardTab =
  | "overview"
  | "profile"
  | "services"
  | "portfolio"
  | "collections"
  | "appointments"
  | "leads"
  | "reviews"
  | "customize-store"
  | "analytics"
  | "subscription"
  | "messages"
  | "settings";
