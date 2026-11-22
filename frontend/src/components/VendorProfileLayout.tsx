"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  Heart,
  Star,
  CheckCircle2,
  MapPin,
  Clock,
  Phone,
  MessageCircle,
  MessageSquare,
  Mail,
  Bell,
  Menu,
  ChevronRight,
  Share2,
  Sparkles,
  Camera,
  Users,
  Building,
  Award,
  ShieldCheck,
  Calendar,
  Globe,
  ExternalLink,
  Briefcase,
  User,
  Check,
  Tag,
  Layers,
  Building2
} from "lucide-react";
import { ExploreOtherVendors } from "@/components/ExploreOtherVendors";

function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function FacebookIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function YoutubeIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-1.96C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 1.96A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-1.96c.32-1.74.46-3.56.46-5.33s-.14-3.59-.46-5.28zM9.75 15.02V8.48l5.75 3.27-5.75 3.27z" />
    </svg>
  );
}

export interface VendorProfileData {
  id: string;
  name: string;
  ownerName?: string;
  owner_name?: string;
  category: "catering" | "venue" | "photographer" | "makeup" | "mehendi" | "decorator" | "bridal-wear" | "jewellery" | string;
  categoryLabel?: string;
  location: string;
  city?: string;
  state?: string;
  district?: string;
  address?: string;
  googleMaps?: string;
  rating: number;
  reviews: number;
  image: string;
  coverImage?: string;
  cover_image?: string;
  coverImages?: string[];
  logo?: string;
  logo_url?: string;
  subtitle?: string;
  tagline?: string;
  startingPrice?: string;
  startingPriceLabel?: string;
  about?: string;
  description?: string;
  isVerified?: boolean;
  isFeatured?: boolean;
  membershipBadge?: string;
  plan?: string;
  isFollowing?: boolean;
  phone?: string;
  whatsapp?: string;
  email?: string;
  website?: string;
  instagram?: string;
  facebook?: string;
  youtube?: string;
  socialLinks?: Record<string, string>;
  serviceAreas?: string;
  service_areas?: string;
  workingHours?: string;
  working_hours?: string;
  experienceYears?: string;
  experience_years?: string;
  experience?: string;
  priceSuffix?: string;
  storeHighlights?: string[];
  store_highlights?: string[];
  featuredCollections?: string[];
  featured_collections?: string[];
  rentalAvailable?: boolean;
  rental_available?: boolean;
  homeTrialAvailable?: boolean;
  home_trial_available?: boolean;
  homeDeliveryAvailable?: boolean;
  home_delivery_available?: boolean;
  customJewelleryAvailable?: boolean;
  custom_jewellery_available?: boolean;
  collectionsCount?: string;
  collections_count?: string;
  citiesServed?: string;
  cities_served?: string;
  actionButtons?: {
    callNow?: boolean;
    whatsapp?: boolean;
    bookAppointment?: boolean;
    viewCollection?: boolean;
    getQuote?: boolean;
    visitStore?: boolean;
  };
  action_buttons?: {
    callNow?: boolean;
    whatsapp?: boolean;
    bookAppointment?: boolean;
    viewCollection?: boolean;
    getQuote?: boolean;
    visitStore?: boolean;
  };
  openingTime?: string;
  opening_time?: string;
  closingTime?: string;
  closing_time?: string;
  workingDays?: string;
  working_days?: string;
  weeklyOff?: string;
  weekly_off?: string;
  holidayNotice?: string;
  holiday_notice?: string;
  rentalPolicy?: string;
  rental_policy?: string;
  returnPolicy?: string;
  return_policy?: string;
  cancellationPolicy?: string;
  cancellation_policy?: string;
  securityDepositPolicy?: string;
  security_deposit_policy?: string;
  damagePolicy?: string;
  damage_policy?: string;
  stats?: Array<{
    icon: string; // lucide or material icon name
    value: string | number;
    label: string;
  }>;
  highlightsTitle?: string;
  highlights?: Array<{
    name: string;
    image: string;
  }>;
  galleryImages?: string[];
  pricesTitle?: string;
  prices?: Array<{
    category: string;
    price: string;
    isPopular?: boolean;
  }>;
  servicesTitle?: string;
  services?: Array<{
    name: string;
    icon?: string;
    description?: string;
    price?: string;
    pricingType?: string;
  }>;
  packages?: Array<{
    name: string;
    tagline?: string;
    description?: string;
    price?: string;
    originalPrice?: string;
    features?: string[];
    isPopular?: boolean;
  }>;
  collections?: Array<{
    id: string;
    title: string;
    description?: string;
    image?: string;
    price?: string;
  }>;
  userReviews?: Array<{
    author: string;
    rating: number;
    text: string;
    date?: string;
  }>;
  similarVendors?: Array<{
    id: string;
    name: string;
    rating: number;
    reviews?: number;
    price: string;
    location: string;
    image: string;
  }>;
  cuisineTypes?: string[];
  serviceTypes?: string[];
  serviceLocations?: string[];
  guestCapacity?: string;
  guest_capacity?: string;
  cateringSpecialities?: string[];
  categoryDetails?: Record<string, any>;
  colorTheme?: string;
  color_theme?: string;
  galleryLayout?: string;
  gallery_layout?: string;
  introVideo?: string;
  intro_video?: string;
  intro_video_url?: string;
  // Venue specific attributes (matching Supabase venue_details columns)
  facilities?: string[];
  venue_facilities?: string[];
  venueHighlights?: string[];
  venue_highlights?: string[];
  featuredHalls?: string[];
  featured_halls?: string[];
  yearsInBusiness?: string;
  years_in_business?: string;
  minGuestCapacity?: string;
  min_guest_capacity?: string;
  numberOfHalls?: string;
  number_of_halls?: string;
  indoorCapacity?: string;
  indoor_capacity?: string;
  outdoorCapacity?: string;
  outdoor_capacity?: string;
  diningCapacity?: string;
  dining_capacity?: string;
  parkingCapacity?: string;
  parking_capacity?: string;
  languagesSpoken?: string;
  languages_spoken?: string;
  contactActions?: string[];
  contact_actions?: string[];
  weeklyHolidays?: string;
  weekly_holidays?: string;
  publicHolidayAvailability?: string;
  public_holiday_availability?: string;
  venueVisitTimings?: string;
  venue_visit_timings?: string;
  advanceAppointmentRequired?: boolean | string;
  advance_appointment_required?: boolean | string;
  advanceBookingRequired?: string;
  advance_booking_required?: string;
  advancePaymentPolicy?: string;
  advance_payment_policy?: string;
  refundPolicy?: string;
  refund_policy?: string;
  overtimeCharges?: string;
  overtime_charges?: string;
  decorationRules?: string;
  decoration_rules?: string;
  outsideCateringPolicy?: string;
  outside_catering_policy?: string;
  outsidePhotographyPolicy?: string;
  outside_photography_policy?: string;
  noiseRestrictions?: string;
  noise_restrictions?: string;
  alcoholPolicy?: string;
  alcohol_policy?: string;
  eventTimingRules?: string;
  event_timing_rules?: string;
  hallImages?: string[];
  hall_images?: string[];
}

export function VendorProfileLayout({ vendor }: { vendor: VendorProfileData }) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeModal, setActiveModal] = useState<null | "quote" | "share">(null);

  // Vendor Name Initials Avatar
  const initials = vendor.name
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .join("")
    .slice(0, 2)
    .toUpperCase() || "CL";

  const catKey = (vendor.category || "").toLowerCase();
  const isJewellery = catKey.includes("jewel");
  const isVenue = catKey.includes("venue");

  // Category Configuration Engine (Dynamic Mappings)
  const getCategoryDefaults = () => {
    if (catKey.includes("venue")) {
      return {
        categoryLabel: "Wedding Venue",
        stats: [
          { icon: "users", value: "1,500", label: "Max Capacity" },
          { icon: "building", value: "24", label: "Guest Rooms" },
          { icon: "star", value: Number(vendor.rating ?? 0) > 0 ? Number(vendor.rating).toFixed(1) : "New", label: "Average Rating" }
        ],
        highlightsTitle: "Venue Spaces & Ambiance",
        highlights: [
          { name: "Grand Royal Ballroom", image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=600&q=80" },
          { name: "Sunlit Poolside Lawn", image: "https://images.unsplash.com/photo-1545232979-fbfd430335e3?auto=format&fit=crop&w=600&q=80" },
          { name: "Luxury Bridal Suite", image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80" }
        ],
        prices: [
          { category: "Veg Plate", price: "₹1,800" },
          { category: "Non-Veg Plate", price: "₹2,200", isPopular: true },
          { category: "Venue Rental", price: "₹3,50,000" }
        ],
        services: [
          { name: "Capacity 1500", icon: "groups" },
          { name: "Indoor/Outdoor", icon: "deck" },
          { name: "24 Rooms", icon: "hotel" },
          { name: "Parking (250 Cars)", icon: "local_parking" },
          { name: "Decor Policy", icon: "palette" },
          { name: "Venue Timings", icon: "schedule" }
        ]
      };
    }

    if (catKey.includes("photo")) {
      return {
        categoryLabel: "Wedding Photographer",
        stats: [
          { icon: "clock", value: "8+", label: "Years Experience" },
          { icon: "camera", value: "350+", label: "Weddings Covered" },
          { icon: "star", value: Number(vendor.rating ?? 0) > 0 ? Number(vendor.rating).toFixed(1) : "New", label: "Average Rating" }
        ],
        highlightsTitle: "Portfolio Highlights",
        highlights: [
          { name: "Candid Moments", image: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=600&q=80" },
          { name: "Cinematic Films", image: "/images/photographers-cover.png" },
          { name: "Pre-Wedding Shoot", image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=600&q=80" }
        ],
        prices: [
          { category: "Pre-Wedding", price: "₹40,000" },
          { category: "1-Day Photo", price: "₹85,000", isPopular: true },
          { category: "Full Package", price: "₹1,80,000" }
        ],
        services: [
          { name: "Candid Photo", icon: "photo_camera" },
          { name: "Traditional", icon: "camera_alt" },
          { name: "Cinematic Films", icon: "videocam" },
          { name: "Drone Shots", icon: "flight" },
          { name: "Photobook Album", icon: "book" },
          { name: "45-Day Delivery", icon: "schedule" }
        ]
      };
    }

    if (catKey.includes("makeup")) {
      return {
        categoryLabel: "Bridal Makeup Artist",
        stats: [
          { icon: "clock", value: "8+", label: "Years Experience" },
          { icon: "sparkles", value: "850+", label: "Brides Styled" },
          { icon: "star", value: Number(vendor.rating ?? 0) > 0 ? Number(vendor.rating).toFixed(1) : "New", label: "Average Rating" }
        ],
        highlightsTitle: "Bridal Portfolio & Looks",
        highlights: [
          { name: "Royal Sabyasachi Red", image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&q=80" },
          { name: "Dewy Sangeet Glow", image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80" },
          { name: "South Indian Muhurtham", image: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=600&q=80" }
        ],
        prices: [
          { category: "Engagement", price: "₹18,000" },
          { category: "Signature HD", price: "₹25,000", isPopular: true },
          { category: "Airbrush 4K", price: "₹35,000" }
        ],
        services: [
          { name: "HD Makeup", icon: "brush" },
          { name: "Airbrush 4K", icon: "auto_fix_high" },
          { name: "Dior & MAC", icon: "face" },
          { name: "Trial Available", icon: "verified" },
          { name: "Hair Styling", icon: "content_cut" },
          { name: "Saree Draping", icon: "strikethrough_s" }
        ]
      };
    }

    if (catKey.includes("mehendi") || catKey.includes("mehndi")) {
      return {
        categoryLabel: "Mehndi Artist",
        stats: [
          { icon: "clock", value: "7+", label: "Years Experience" },
          { icon: "sparkles", value: "600+", label: "Brides Applied" },
          { icon: "star", value: Number(vendor.rating ?? 0) > 0 ? Number(vendor.rating).toFixed(1) : "New", label: "Average Rating" }
        ],
        highlightsTitle: "Mehndi Design Highlights",
        highlights: [
          { name: "Royal Rajasthani Motif", image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&q=80" },
          { name: "Intricate Arabic Pattern", image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80" },
          { name: "Personalized Portrait", image: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=600&q=80" }
        ],
        prices: [
          { category: "Guest Package", price: "₹10,000" },
          { category: "Bridal Basic", price: "₹18,000", isPopular: true },
          { category: "Royal Bridal", price: "₹30,000" }
        ],
        services: [
          { name: "Bridal Mehndi", icon: "draw" },
          { name: "Arabic Design", icon: "auto_awesome" },
          { name: "Portrait Motif", icon: "person" },
          { name: "Guest Mehndi", icon: "groups" },
          { name: "Natural Henna", icon: "eco" },
          { name: "Home Service", icon: "home" }
        ]
      };
    }

    if (catKey.includes("decor")) {
      return {
        categoryLabel: "Wedding Decorator",
        stats: [
          { icon: "clock", value: "10+", label: "Years Experience" },
          { icon: "sparkles", value: "450+", label: "Events Designed" },
          { icon: "star", value: Number(vendor.rating ?? 0) > 0 ? Number(vendor.rating).toFixed(1) : "New", label: "Average Rating" }
        ],
        highlightsTitle: "Decoration Themes & Mandaps",
        highlights: [
          { name: "Royal Floral Mandap", image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=600&q=80" },
          { name: "Fairy Light Tunnel", image: "https://images.unsplash.com/photo-1545232979-fbfd430335e3?auto=format&fit=crop&w=600&q=80" },
          { name: "Contemporary Stage", image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80" }
        ],
        prices: [
          { category: "Stage Only", price: "₹75,000" },
          { category: "Mandap & Entry", price: "₹1,80,000", isPopular: true },
          { category: "Full Venue Decor", price: "₹4,50,000" }
        ],
        services: [
          { name: "Floral Themes", icon: "local_florist" },
          { name: "Stage Decor", icon: "event_seat" },
          { name: "Mandap Design", icon: "temple_hindu" },
          { name: "Lighting Setup", icon: "lightbulb" },
          { name: "Entry Archway", icon: "door_front" },
          { name: "Reception Setup", icon: "celebration" }
        ]
      };
    }

    if (catKey.includes("bridal-wear") || catKey.includes("boutique")) {
      return {
        categoryLabel: "Bridal Wear Store",
        stats: [
          { icon: "sparkles", value: "500+", label: "Designer Outfits" },
          { icon: "users", value: "1,200+", label: "Happy Brides" },
          { icon: "star", value: Number(vendor.rating ?? 0) > 0 ? Number(vendor.rating).toFixed(1) : "New", label: "Average Rating" }
        ],
        highlightsTitle: "Couture Collection Highlights",
        highlights: [
          { name: "Velvet Crimson Lehenga", image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&q=80" },
          { name: "Pastel Floral Gown", image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80" },
          { name: "Silk Kanjeevaram Saree", image: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=600&q=80" }
        ],
        prices: [
          { category: "Light Lehenga", price: "₹45,000" },
          { category: "Heavy Bridal", price: "₹1,20,000", isPopular: true },
          { category: "Couture Custom", price: "₹2,50,000" }
        ],
        services: [
          { name: "Designer Collections", icon: "checkroom" },
          { name: "Rental / Purchase", icon: "shopping_bag" },
          { name: "Custom Stitching", icon: "content_cut" },
          { name: "Trial Sessions", icon: "accessibility_new" },
          { name: "XS to 4XL Sizes", icon: "format_size" },
          { name: "On-Time Delivery", icon: "local_shipping" }
        ]
      };
    }

    if (catKey.includes("jewel")) {
      return {
        categoryLabel: "Bridal Jewellery",
        stats: [
          { icon: "sparkles", value: "100%", label: "Certified Jewels" },
          { icon: "building", value: "800+", label: "Unique Designs" },
          { icon: "star", value: Number(vendor.rating ?? 0) > 0 ? Number(vendor.rating).toFixed(1) : "New", label: "Average Rating" }
        ],
        highlightsTitle: "Jewellery Highlights",
        highlights: [
          { name: "Heritage Polki Choker", image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&q=80" },
          { name: "Temple Gold Necklace", image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80" },
          { name: "Diamond Solitaire Set", image: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=600&q=80" }
        ],
        prices: [
          { category: "Silver / Kundan", price: "₹25,000" },
          { category: "Gold Set", price: "₹85,000", isPopular: true },
          { category: "Diamond Bridal", price: "₹2,20,000" }
        ],
        services: [
          { name: "Hallmark Gold", icon: "diamond" },
          { name: "Certified Diamond", icon: "verified" },
          { name: "Rental Available", icon: "key" },
          { name: "Bridal Sets", icon: "auto_awesome" },
          { name: "Custom Fitting", icon: "build" },
          { name: "Insurance Ready", icon: "security" }
        ]
      };
    }

    if (catKey.includes("cake") || catKey.includes("baker") || catKey.includes("dessert")) {
      return {
        categoryLabel: "Cake Designer",
        stats: [
          { icon: "clock", value: "6+", label: "Years Experience" },
          { icon: "sparkles", value: "350+", label: "Custom Cakes Baked" },
          { icon: "star", value: Number(vendor.rating ?? 0) > 0 ? Number(vendor.rating).toFixed(1) : "New", label: "Average Rating" }
        ],
        highlightsTitle: "Signature Wedding Cakes & Dessert Displays",
        highlights: [
          { name: "Multi-Tier Floral Wedding Cake", image: "https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=600&q=80" },
          { name: "Gold Foil Fondant Masterpiece", image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=600&q=80" },
          { name: "Gourmet Dessert Table Spread", image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=600&q=80" }
        ],
        prices: [
          { category: "2-Tier Cake (3kg)", price: "₹8,500" },
          { category: "3-Tier Luxury (6kg)", price: "₹18,000", isPopular: true },
          { category: "Grand 5-Tier (12kg)", price: "₹35,000" }
        ],
        services: [
          { name: "Bespoke Flavors", icon: "cake" },
          { name: "Eggless Options", icon: "eco" },
          { name: "On-Site Setup", icon: "local_shipping" },
          { name: "Tasting Sessions", icon: "restaurant" }
        ]
      };
    }

    if (catKey.includes("groom") || catKey.includes("sherwani") || catKey.includes("suit")) {
      return {
        categoryLabel: "Groom Wear Store",
        stats: [
          { icon: "sparkles", value: "400+", label: "Designer Outfits" },
          { icon: "users", value: "850+", label: "Grooms Styled" },
          { icon: "star", value: Number(vendor.rating ?? 0) > 0 ? Number(vendor.rating).toFixed(1) : "New", label: "Average Rating" }
        ],
        highlightsTitle: "Groom Apparel & Sherwani Collection",
        highlights: [
          { name: "Royal Embroidered Sherwani", image: "/images/groom-wear-cover.png" },
          { name: "Classic Bespoke Tuxedo", image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=600&q=80" },
          { name: "Indo-Western Bandhgala", image: "https://images.unsplash.com/photo-1593032465175-481ac7f401a0?auto=format&fit=crop&w=600&q=80" }
        ],
        prices: [
          { category: "Kurta Set", price: "₹15,000" },
          { category: "Signature Sherwani", price: "₹45,000", isPopular: true },
          { category: "Handcrafted Tuxedo", price: "₹65,000" }
        ],
        services: [
          { name: "Custom Tailoring", icon: "content_cut" },
          { name: "Fabric Selection", icon: "checkroom" },
          { name: "Trial Fitting", icon: "accessibility_new" },
          { name: "Matching Accessories", icon: "diamond" }
        ]
      };
    }

    // Default Fallback: Catering Master Template or Dynamic Label
    return {
      categoryLabel: vendor.categoryLabel || (vendor.category ? vendor.category.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase()) : "Wedding Caterer"),
      stats: [
        { icon: "clock", value: "10+", label: "Years in Business" },
        { icon: "utensils", value: "500+", label: "Events Catered" },
        { icon: "star", value: `${vendor.rating || 4.8}`, label: "Average Rating" }
      ],
      highlightsTitle: "Menu Highlights",
      highlights: [
        { name: "North Indian Cuisine", image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=600&q=80" },
        { name: "South Indian Delicacies", image: "https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=600&q=80" },
        { name: "Live Counters & Mocktails", image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80" }
      ],
      prices: [
        { category: "Budget", price: "₹20,000" },
        { category: "Premium", price: "₹50,000", isPopular: true },
        { category: "Luxury", price: "₹1,00,000" }
      ],
      services: [
        { name: "Customized Menu", icon: "restaurant_menu" },
        { name: "Hygienic Prep", icon: "clean_hands" },
        { name: "Professional Staff", icon: "badge" },
        { name: "Live Counters", icon: "local_fire_department" }
      ]
    };
  };

  const defaults = getCategoryDefaults();
  const displayCategoryLabel = vendor.categoryLabel || defaults.categoryLabel;
  const highlights = vendor.highlights || defaults.highlights;
  const prices = vendor.prices || defaults.prices;
  const services = vendor.services || defaults.services;
  const stats = vendor.stats || defaults.stats;
  const highlightsTitle = vendor.highlightsTitle || defaults.highlightsTitle;

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] pb-32 text-[#2D2520] font-sans">

      {/* Top Hero Banner (Mobile & Tablet) */}
      <div className="lg:hidden relative w-full aspect-[4/3] sm:aspect-[16/9] md:h-[440px] md:aspect-auto bg-[#0F4C45] overflow-hidden">
        {vendor.image ? (
          <Image src={vendor.image} alt={vendor.name} fill priority className="object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#0F4C45] to-[#1a6b5e]">
            <span className="font-serif text-8xl font-bold text-white/60 tracking-wider select-none">{initials}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />

        {/* Floating Top Buttons */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 sm:px-8 pt-4 pb-2 z-10 max-w-7xl mx-auto">
          <Link
            href={`/vendors`}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md hover:bg-black/60 transition-colors"
            aria-label="Back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsWishlisted(!isWishlisted)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md active:scale-90 transition-transform"
            >
              <Heart
                className="h-5 w-5"
                style={{
                  color: isWishlisted ? "#E8614A" : "#FFFFFF",
                  fill: isWishlisted ? "#E8614A" : "none",
                }}
              />
            </button>
          </div>
        </div>

        {/* Counter Overlay */}
        <div className="absolute bottom-3 right-3 sm:right-8 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm border border-white/20">
          1/15
        </div>
      </div>

      {/* Premium Desktop Split Hero Section (1024px+) */}
      <div className="hidden lg:block w-[min(94vw,1320px)] mx-auto pt-6 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-12 gap-8 items-start">

          {/* Left Column (Hero Gallery) */}
          <div className="col-span-7 relative w-full h-[460px] xl:h-[500px] 2xl:h-[540px] max-h-[540px] rounded-2xl overflow-hidden shadow-md bg-[#0F4C45] group">
            {vendor.image ? (
              <Image
                src={vendor.image}
                alt={vendor.name}
                fill
                priority
                className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#0F4C45] to-[#1a6b5e]">
                <span className="font-serif text-9xl font-bold text-white/60 tracking-wider select-none">{initials}</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

            {/* Top Floating Controls */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
              <Link
                href={`/vendors`}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md hover:bg-black/60 transition-colors"
                aria-label="Back"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md active:scale-90 transition-transform"
                  aria-label="Wishlist"
                >
                  <Heart
                    className="h-5 w-5"
                    style={{
                      color: isWishlisted ? "#E8614A" : "#FFFFFF",
                      fill: isWishlisted ? "#E8614A" : "none",
                    }}
                  />
                </button>
              </div>
            </div>

            {/* Bottom Floating Controls */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between z-10">
              <button
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-bold hover:bg-black/80 transition-colors border border-white/20"
              >
                <Camera className="h-3.5 w-3.5" />
                <span>View All Photos ({highlights.length})</span>
              </button>

              <div className="rounded-full bg-black/60 px-3.5 py-1.5 text-xs font-bold text-white backdrop-blur-md border border-white/20">
                1/{highlights.length || 1}
              </div>
            </div>
          </div>

          {/* Right Column (Sticky Vendor Information Card) */}
          <div className="col-span-5 sticky top-24 rounded-2xl border border-black/5 bg-white shadow-md p-6 min-h-[460px] flex flex-col justify-between">
            <div>
              {/* Category Badge & Logo / Initials Header */}
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-full bg-[#FAF5EA] border border-[#E8DFD1] text-[12px] font-bold text-[#0F4C45] uppercase tracking-wider">
                  {displayCategoryLabel}
                </span>
                <div className="relative h-12 w-12 rounded-xl overflow-hidden bg-[#0F4C45] border-2 border-white shadow-sm flex items-center justify-center text-white shrink-0">
                  {vendor.logo || vendor.logo_url ? (
                    <img src={vendor.logo || vendor.logo_url} alt={vendor.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="font-serif text-sm font-bold tracking-wider">{initials}</span>
                  )}
                </div>
              </div>

              {/* Vendor Title & Owner Name */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h1 className="font-serif text-2xl xl:text-3xl font-bold text-[#1A1410] leading-tight">
                    {vendor.name}
                  </h1>
                  {vendor.isVerified !== false && (
                    <CheckCircle2 className="h-6 w-6 shrink-0 fill-[#0F4C45] text-white" />
                  )}
                </div>
                {(vendor.ownerName || vendor.owner_name) && (
                  <p className="text-xs text-[#7A6E65] font-medium flex items-center gap-1">
                    <User className="h-3 w-3 text-[#0F4C45]" /> Owner / Managed by {vendor.ownerName || vendor.owner_name}
                  </p>
                )}
              </div>

              {(vendor.tagline || vendor.subtitle) && (
                <p className="text-xs font-semibold italic text-[#0F4C45] mt-1.5">
                  "{vendor.tagline || vendor.subtitle}"
                </p>
              )}

              {/* Rating & Location */}
              <div className="mt-2.5 flex items-center gap-3 text-sm">
                <div className="flex items-center gap-1 font-bold text-[#1A1410]">
                  <Star className="h-4 w-4 fill-[#C8A96A] text-[#C8A96A]" />
                  {Number(vendor.rating ?? 0) > 0 ? (
                    <>
                      <span>{Number(vendor.rating).toFixed(1)}</span>
                      <span className="text-[#7A6E65] font-normal">({vendor.reviews ?? 0} reviews)</span>
                    </>
                  ) : (
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">New</span>
                  )}
                </div>
                <span className="text-[#8C827A]">•</span>
                <div className="flex items-center gap-1 text-[#6B5E52]">
                  <MapPin className="h-4 w-4 text-[#8C827A]" />
                  <span className="truncate">{vendor.location}</span>
                </div>
              </div>

              {/* Starting Price Display */}
              <div className="mt-4 p-3.5 rounded-xl bg-[#FAF9F6] border border-black/5 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-[#7A6E65] uppercase tracking-wider font-semibold">Starting Price</div>
                  <div className="text-xl font-bold text-[#0F4C45]">{vendor.startingPriceLabel || vendor.startingPrice || "Contact for pricing"}</div>
                </div>
                <span className="text-xs text-[#7A6E65]">Per Event / Package</span>
              </div>

              {/* Store Highlights Badges in Desktop Hero Sidebar */}
              {(vendor.storeHighlights || vendor.store_highlights) && (vendor.storeHighlights || vendor.store_highlights)!.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                  {(vendor.storeHighlights || vendor.store_highlights)!.map((badge) => (
                    <span
                      key={badge}
                      className="bg-black/5 text-[#0F4C45] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#0F4C45]/20 flex items-center gap-1"
                    >
                      <Sparkles className="w-2.5 h-2.5 text-[#C8A96A]" /> {badge}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-4 border-t border-black/5">
              <button
                onClick={() => setActiveModal("quote")}
                className="w-full py-3.5 rounded-xl bg-[#0F4C45] text-white font-bold hover:bg-[#09312d] transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <MessageSquare className="h-4 w-4" /> Message
              </button>

              <div className="flex gap-2.5">
                <a
                  href={`tel:${vendor.phone || ""}`}
                  className="flex-1 py-2.5 rounded-xl bg-[#0F4C45] text-white font-bold text-xs hover:bg-[#083833] transition-colors flex items-center justify-center gap-1.5"
                >
                  <Phone className="h-3.5 w-3.5" /> Call
                </a>
                <a
                  href={`https://wa.me/${(vendor.whatsapp || vendor.phone || "").replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-2.5 rounded-xl bg-[#0F4C45] text-white font-bold text-xs hover:bg-[#083833] transition-colors flex items-center justify-center gap-1.5"
                >
                  <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>

      <main className="flex-1 px-3 sm:px-4 md:px-6 lg:px-8 pt-3 sm:pt-4 md:pt-6 space-y-4 sm:space-y-5 md:space-y-6 lg:space-y-8 xl:space-y-10 w-[min(96vw,1300px)] mx-auto">

        {/* Profile Card Header (Mobile & Tablet only) */}
        <div className="lg:hidden flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 items-start sm:items-center relative bg-white p-3 sm:p-4 md:p-6 lg:p-7 rounded-2xl border border-black/5 shadow-xs">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative h-16 w-16 md:h-20 md:w-20 lg:h-22 lg:w-22 shrink-0 rounded-2xl overflow-hidden bg-[#0F4C45] border-2 border-white shadow-md flex items-center justify-center text-white">
              {vendor.logo || vendor.logo_url ? (
                <img src={vendor.logo || vendor.logo_url} alt={vendor.name} className="w-full h-full object-cover" />
              ) : (
                <span className="font-serif text-lg md:text-2xl font-bold tracking-wider">{initials}</span>
              )}
            </div>

            <div className="flex-1 min-w-0 sm:hidden">
              <div className="flex items-center gap-1.5">
                <h1 className="font-serif text-lg font-bold text-[#1A1410] leading-tight truncate">
                  {vendor.name}
                </h1>
                {vendor.isVerified !== false && (
                  <CheckCircle2 className="h-4 w-4 shrink-0 fill-[#0F4C45] text-white" />
                )}
              </div>
              <span className="text-[#0F4C45] text-xs font-semibold block">{displayCategoryLabel}</span>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="hidden sm:flex items-center gap-2 flex-wrap">
              <h1 className="font-serif text-[clamp(1.375rem,2.5vw,2.375rem)] font-bold text-[#1A1410] leading-tight">
                {vendor.name}
              </h1>
              {vendor.isVerified !== false && (
                <CheckCircle2 className="h-5 w-5 md:h-6 md:w-6 shrink-0 fill-[#0F4C45] text-white" />
              )}
            </div>

            {(vendor.ownerName || vendor.owner_name) && (
              <p className="text-xs text-[#7A6E65] font-medium mt-0.5">
                Owner: {vendor.ownerName || vendor.owner_name}
              </p>
            )}

            {/* Store Highlights Badges on Mobile */}
            {((vendor.storeHighlights || vendor.store_highlights) ?? []).length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 mt-2">
                {(vendor.storeHighlights || vendor.store_highlights || []).map((badge) => (
                  <span
                    key={badge}
                    className="bg-[#FAF9F6] text-[#0F4C45] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#0F4C45]/20 flex items-center gap-1"
                  >
                    <Sparkles className="w-2.5 h-2.5 text-[#C8A96A]" /> {badge}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Featured Collections Strip (Jewellery Only) */}
        {isJewellery && ((vendor.featuredCollections || vendor.featured_collections) ?? []).length > 0 && (
          <section className="rounded-2xl bg-white p-4 sm:p-5 border border-black/5 shadow-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-sm sm:text-base font-bold text-[#1A1410] flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#0F4C45]" /> Featured Collections
              </h2>
              <span className="text-[11px] text-[#7A6E65] font-medium">Curated by Store</span>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1">
              {(vendor.featuredCollections || vendor.featured_collections || []).map((col: string) => (
                <span
                  key={col}
                  className="bg-[#FAF5EA] text-[#0F4C45] border border-[#E8DFD1] text-xs font-bold px-3.5 py-1.5 rounded-xl shrink-0 shadow-2xs flex items-center gap-1.5"
                >
                  <Sparkles className="w-3 h-3 text-[#C8A96A]" /> {col}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Featured Halls Strip (Venues Only) */}
        {isVenue && ((vendor.featuredHalls || vendor.featured_halls) ?? []).length > 0 && (
          <section className="rounded-2xl bg-white p-4 sm:p-5 border border-black/5 shadow-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-sm sm:text-base font-bold text-[#1A1410] flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#0F4C45]" /> Featured Halls & Spaces
              </h2>
              <span className="text-[11px] text-[#7A6E65] font-medium">Curated by Venue</span>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1">
              {(vendor.featuredHalls || vendor.featured_halls || []).map((hall: string) => (
                <span
                  key={hall}
                  className="bg-[#FAF5EA] text-[#0F4C45] border border-[#E8DFD1] text-xs font-bold px-3.5 py-1.5 rounded-xl shrink-0 shadow-2xs flex items-center gap-1.5"
                >
                  <Building2 className="w-3 h-3 text-[#C8A96A]" /> {hall}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Venue Facilities & Spaces (Venues Only) */}
        {isVenue && ((vendor.facilities || vendor.venue_facilities) ?? []).length > 0 && (
          <section className="rounded-2xl bg-white p-4 sm:p-5 md:p-6 lg:p-8 border border-black/5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-black/5 pb-3">
              <h2 className="font-serif text-[clamp(1rem,1.5vw,1.625rem)] font-bold text-[#1A1410] flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#0F4C45]" /> Venue Facilities & Spaces
              </h2>
              <span className="text-xs font-bold text-[#0F4C45]">
                {(vendor.facilities || vendor.venue_facilities || []).length} Verified Amenities
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 pt-1">
              {(vendor.facilities || vendor.venue_facilities || []).map((fac: string) => (
                <div
                  key={fac}
                  className="bg-[#FAF9F6] p-3 rounded-xl border border-black/5 flex items-center gap-2 text-xs font-bold text-[#2D2520]"
                >
                  <span className="w-4 h-4 rounded-full bg-[#0F4C45] text-white flex items-center justify-center text-[10px] shrink-0">
                    ✓
                  </span>
                  <span className="truncate">{fac}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* About Section */}
        <section className="rounded-2xl bg-white p-3 sm:p-4 md:p-6 lg:p-8 border border-black/5 shadow-xs">
          <h2 className="font-serif text-[clamp(1rem,1.5vw,1.625rem)] font-bold text-[#1A1410]">About {isVenue ? "Venue" : "Brand"}</h2>
          <p className="mt-2 text-[clamp(0.8125rem,1vw,1.0625rem)] text-[#5A6561] leading-relaxed max-w-[760px]">
            {vendor.about || vendor.description || `${vendor.name} is a premier ${displayCategoryLabel.toLowerCase()} in ${vendor.location}, dedicated to delivering exceptional service and luxury experiences for grand celebrations and intimate weddings.`}
          </p>
        </section>

        {/* Business & Contact Information */}
        <section className="rounded-2xl bg-white p-4 sm:p-5 md:p-6 lg:p-8 border border-black/5 shadow-xs space-y-4">
          <h2 className="font-serif text-[clamp(1rem,1.5vw,1.625rem)] font-bold text-[#1A1410]">
            {isVenue ? "Venue & Operating Information" : "Business Information & Contact"}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs font-sans">
            {(vendor.experienceYears || vendor.yearsInBusiness || vendor.years_in_business || vendor.experience_years || vendor.experience) && (
              <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-black/5 space-y-1">
                <span className="text-[11px] text-[#7A6E65] uppercase font-bold tracking-wider block">Years of Experience</span>
                <span className="font-bold text-[#0F4C45] text-sm block">{vendor.experienceYears || vendor.yearsInBusiness || vendor.years_in_business || vendor.experience_years || vendor.experience} Years</span>
              </div>
            )}

            {/* Venue Specific Capacity Cards */}
            {isVenue && (vendor.guestCapacity || vendor.guest_capacity) && (
              <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-black/5 space-y-1">
                <span className="text-[11px] text-[#7A6E65] uppercase font-bold tracking-wider block">Max Guest Capacity</span>
                <span className="font-bold text-[#0F4C45] text-sm block">{vendor.guestCapacity || vendor.guest_capacity}</span>
              </div>
            )}

            {isVenue && (vendor.minGuestCapacity || vendor.min_guest_capacity) && (
              <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-black/5 space-y-1">
                <span className="text-[11px] text-[#7A6E65] uppercase font-bold tracking-wider block">Min Guest Capacity</span>
                <span className="font-bold text-[#2D2520] text-sm block">{vendor.minGuestCapacity || vendor.min_guest_capacity}</span>
              </div>
            )}

            {isVenue && (vendor.numberOfHalls || vendor.number_of_halls) && (
              <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-black/5 space-y-1">
                <span className="text-[11px] text-[#7A6E65] uppercase font-bold tracking-wider block">Halls & Lawns</span>
                <span className="font-bold text-[#0F4C45] text-sm block">{vendor.numberOfHalls || vendor.number_of_halls}</span>
              </div>
            )}

            {isVenue && (vendor.diningCapacity || vendor.dining_capacity) && (
              <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-black/5 space-y-1">
                <span className="text-[11px] text-[#7A6E65] uppercase font-bold tracking-wider block">Dining Capacity</span>
                <span className="font-bold text-[#2D2520] text-sm block">{vendor.diningCapacity || vendor.dining_capacity}</span>
              </div>
            )}

            {isVenue && (vendor.indoorCapacity || vendor.indoor_capacity) && (
              <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-black/5 space-y-1">
                <span className="text-[11px] text-[#7A6E65] uppercase font-bold tracking-wider block">Indoor AC Capacity</span>
                <span className="font-bold text-[#2D2520] text-sm block">{vendor.indoorCapacity || vendor.indoor_capacity}</span>
              </div>
            )}

            {isVenue && (vendor.outdoorCapacity || vendor.outdoor_capacity) && (
              <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-black/5 space-y-1">
                <span className="text-[11px] text-[#7A6E65] uppercase font-bold tracking-wider block">Outdoor Lawn Capacity</span>
                <span className="font-bold text-[#2D2520] text-sm block">{vendor.outdoorCapacity || vendor.outdoor_capacity}</span>
              </div>
            )}

            {isVenue && (vendor.parkingCapacity || vendor.parking_capacity) && (
              <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-black/5 space-y-1">
                <span className="text-[11px] text-[#7A6E65] uppercase font-bold tracking-wider block">Parking & Valet</span>
                <span className="font-bold text-[#2D2520] text-sm block">{vendor.parkingCapacity || vendor.parking_capacity}</span>
              </div>
            )}

            {isVenue && (vendor.languagesSpoken || vendor.languages_spoken) && (
              <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-black/5 space-y-1">
                <span className="text-[11px] text-[#7A6E65] uppercase font-bold tracking-wider block">Staff Languages</span>
                <span className="font-bold text-[#2D2520] text-sm block">{vendor.languagesSpoken || vendor.languages_spoken}</span>
              </div>
            )}

            {/* Jewellery Specific Toggles */}
            {isJewellery && (vendor.rentalAvailable !== undefined || vendor.rental_available !== undefined) && (
              <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-black/5 space-y-1">
                <span className="text-[11px] text-[#7A6E65] uppercase font-bold tracking-wider block">Rental Service</span>
                <span className="font-bold text-[#1A1410] text-sm block">
                  {Boolean(vendor.rentalAvailable ?? vendor.rental_available) ? "✓ Rental Available" : "✗ Purchase Only"}
                </span>
              </div>
            )}

            {isJewellery && (vendor.homeTrialAvailable !== undefined || vendor.home_trial_available !== undefined) && (
              <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-black/5 space-y-1">
                <span className="text-[11px] text-[#7A6E65] uppercase font-bold tracking-wider block">Home Trial Service</span>
                <span className="font-bold text-[#1A1410] text-sm block">
                  {Boolean(vendor.homeTrialAvailable ?? vendor.home_trial_available) ? "✓ Available" : "✗ In-Store Only"}
                </span>
              </div>
            )}

            {isJewellery && (vendor.homeDeliveryAvailable !== undefined || vendor.home_delivery_available !== undefined) && (
              <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-black/5 space-y-1">
                <span className="text-[11px] text-[#7A6E65] uppercase font-bold tracking-wider block">Home Delivery</span>
                <span className="font-bold text-[#1A1410] text-sm block">
                  {Boolean(vendor.homeDeliveryAvailable ?? vendor.home_delivery_available) ? "✓ Insured Courier / Delivery" : "✗ Store Pickup Only"}
                </span>
              </div>
            )}

            {isJewellery && (vendor.customJewelleryAvailable !== undefined || vendor.custom_jewellery_available !== undefined) && (
              <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-black/5 space-y-1">
                <span className="text-[11px] text-[#7A6E65] uppercase font-bold tracking-wider block">Customization</span>
                <span className="font-bold text-[#1A1410] text-sm block">
                  {Boolean(vendor.customJewelleryAvailable ?? vendor.custom_jewellery_available) ? "✓ Custom Orders Accepted" : "✗ Standard Designs"}
                </span>
              </div>
            )}

            {isJewellery && (vendor.collectionsCount || vendor.collections_count) && (
              <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-black/5 space-y-1">
                <span className="text-[11px] text-[#7A6E65] uppercase font-bold tracking-wider block">Collections Available</span>
                <span className="font-bold text-[#0F4C45] text-sm block">{vendor.collectionsCount || vendor.collections_count}</span>
              </div>
            )}

            {(vendor.ownerName || vendor.owner_name) && (
              <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-black/5 space-y-1">
                <span className="text-[11px] text-[#7A6E65] uppercase font-bold tracking-wider block">{isVenue ? "Venue Manager" : "Vendor / Owner Name"}</span>
                <span className="font-bold text-[#1A1410] text-sm block">{vendor.ownerName || vendor.owner_name}</span>
              </div>
            )}

            {vendor.phone && (
              <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-black/5 space-y-1">
                <span className="text-[11px] text-[#7A6E65] uppercase font-bold tracking-wider block">Phone Number</span>
                <a href={`tel:${vendor.phone}`} className="font-bold text-[#0F4C45] text-sm hover:underline block">{vendor.phone}</a>
              </div>
            )}

            {vendor.whatsapp && (
              <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-black/5 space-y-1">
                <span className="text-[11px] text-[#7A6E65] uppercase font-bold tracking-wider block">WhatsApp</span>
                <a href={`https://wa.me/${vendor.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noreferrer" className="font-bold text-[#0F4C45] text-sm hover:underline block">{vendor.whatsapp}</a>
              </div>
            )}

            {vendor.email && (
              <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-black/5 space-y-1">
                <span className="text-[11px] text-[#7A6E65] uppercase font-bold tracking-wider block">Email Address</span>
                <a href={`mailto:${vendor.email}`} className="font-semibold text-[#0F4C45] text-xs hover:underline block truncate">{vendor.email}</a>
              </div>
            )}

            {(vendor.address || vendor.location) && (
              <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-black/5 space-y-1 sm:col-span-2">
                <span className="text-[11px] text-[#7A6E65] uppercase font-bold tracking-wider block">{isVenue ? "Venue Location & Address" : "Studio / Business Address"}</span>
                <span className="font-medium text-[#2D2520] text-xs block leading-relaxed">{vendor.address || vendor.location}</span>
                {vendor.googleMaps && (
                  <a href={vendor.googleMaps} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[11px] text-[#0F4C45] font-bold hover:underline mt-1">
                    <MapPin className="w-3.5 h-3.5" /> View on Google Maps <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            )}

            {(vendor.serviceAreas || vendor.service_areas || vendor.citiesServed || vendor.cities_served) && (
              <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-black/5 space-y-1 sm:col-span-2">
                <span className="text-[11px] text-[#7A6E65] uppercase font-bold tracking-wider block">Service Area / Operating Districts</span>
                <span className="font-medium text-[#2D2520] text-xs block leading-relaxed">{vendor.serviceAreas || vendor.service_areas || vendor.citiesServed || vendor.cities_served}</span>
              </div>
            )}

            {/* Venue Visit Timings vs General Working Hours */}
            {isVenue ? (
              (vendor.openingTime || vendor.venueVisitTimings || vendor.venue_visit_timings || vendor.workingHours) && (
                <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-black/5 space-y-1 sm:col-span-2">
                  <span className="text-[11px] text-[#7A6E65] uppercase font-bold tracking-wider block">Office Hours & Venue Visit Timings</span>
                  <span className="font-medium text-[#2D2520] text-xs block">
                    Office: {vendor.openingTime || "08:00 AM"} - {vendor.closingTime || "10:00 PM"} ({vendor.weeklyHolidays || "Open All 7 Days"})
                  </span>
                  {(vendor.venueVisitTimings || vendor.venue_visit_timings) && (
                    <span className="text-[11px] text-[#0F4C45] font-bold block mt-0.5">
                      Guided Visit Timings: {vendor.venueVisitTimings || vendor.venue_visit_timings}
                    </span>
                  )}
                  {(vendor.publicHolidayAvailability || vendor.public_holiday_availability) && (
                    <span className="text-[10px] text-[#7A6E65] block mt-0.5">
                      Holidays: {vendor.publicHolidayAvailability || vendor.public_holiday_availability}
                    </span>
                  )}
                </div>
              )
            ) : (
              (vendor.workingHours || vendor.working_hours || vendor.workingDays || vendor.working_days) && (
                <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-black/5 space-y-1 sm:col-span-2">
                  <span className="text-[11px] text-[#7A6E65] uppercase font-bold tracking-wider block">Working Hours & Timings</span>
                  <span className="font-medium text-[#2D2520] text-xs block">
                    {vendor.workingHours || vendor.working_hours || `${vendor.workingDays || vendor.working_days || "Mon-Sat"}: ${vendor.openingTime || vendor.opening_time || "10:00 AM"} - ${vendor.closingTime || vendor.closing_time || "08:00 PM"} (Weekly Off: ${vendor.weeklyOff || vendor.weekly_off || "Sunday"})`}
                  </span>
                  {(vendor.holidayNotice || vendor.holiday_notice) && (
                    <span className="text-[11px] text-[#0F4C45] font-semibold block mt-0.5">
                      Notice: {vendor.holidayNotice || vendor.holiday_notice}
                    </span>
                  )}
                </div>
              )
            )}
          </div>

          {/* Venue Booking Policies & Guidelines (Venues Only) */}
          {isVenue && (
            vendor.advanceBookingRequired || vendor.advance_booking_required ||
            vendor.advancePaymentPolicy || vendor.advance_payment_policy ||
            vendor.cancellationPolicy || vendor.cancellation_policy ||
            vendor.refundPolicy || vendor.refund_policy ||
            vendor.overtimeCharges || vendor.overtime_charges ||
            vendor.decorationRules || vendor.decoration_rules ||
            vendor.outsideCateringPolicy || vendor.outside_catering_policy ||
            vendor.outsidePhotographyPolicy || vendor.outside_photography_policy ||
            vendor.noiseRestrictions || vendor.noise_restrictions ||
            vendor.alcoholPolicy || vendor.alcohol_policy ||
            vendor.eventTimingRules || vendor.event_timing_rules
          ) && (
            <div className="pt-4 border-t border-black/5 space-y-3">
              <span className="text-xs font-serif font-bold text-[#1A1410] block">Venue Booking Policies & Guidelines</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {(vendor.advanceBookingRequired || vendor.advance_booking_required) && (
                  <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-black/5 space-y-1">
                    <span className="font-bold text-[#0F4C45] block">Advance Booking Requirement</span>
                    <p className="text-[#5A6561] leading-relaxed">{vendor.advanceBookingRequired || vendor.advance_booking_required}</p>
                  </div>
                )}
                {(vendor.advancePaymentPolicy || vendor.advance_payment_policy) && (
                  <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-black/5 space-y-1">
                    <span className="font-bold text-[#0F4C45] block">Advance Payment Policy</span>
                    <p className="text-[#5A6561] leading-relaxed">{vendor.advancePaymentPolicy || vendor.advance_payment_policy}</p>
                  </div>
                )}
                {(vendor.cancellationPolicy || vendor.cancellation_policy) && (
                  <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-black/5 space-y-1">
                    <span className="font-bold text-[#0F4C45] block">Cancellation Policy</span>
                    <p className="text-[#5A6561] leading-relaxed">{vendor.cancellationPolicy || vendor.cancellation_policy}</p>
                  </div>
                )}
                {(vendor.refundPolicy || vendor.refund_policy) && (
                  <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-black/5 space-y-1">
                    <span className="font-bold text-[#0F4C45] block">Security Deposit & Refund</span>
                    <p className="text-[#5A6561] leading-relaxed">{vendor.refundPolicy || vendor.refund_policy}</p>
                  </div>
                )}
                {(vendor.overtimeCharges || vendor.overtime_charges) && (
                  <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-black/5 space-y-1">
                    <span className="font-bold text-[#0F4C45] block">Overtime Charges</span>
                    <p className="text-[#5A6561] leading-relaxed">{vendor.overtimeCharges || vendor.overtime_charges}</p>
                  </div>
                )}
                {(vendor.decorationRules || vendor.decoration_rules) && (
                  <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-black/5 space-y-1">
                    <span className="font-bold text-[#0F4C45] block">Decoration Guidelines</span>
                    <p className="text-[#5A6561] leading-relaxed">{vendor.decorationRules || vendor.decoration_rules}</p>
                  </div>
                )}
                {(vendor.outsideCateringPolicy || vendor.outside_catering_policy) && (
                  <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-black/5 space-y-1">
                    <span className="font-bold text-[#0F4C45] block">Outside Catering Policy</span>
                    <p className="text-[#5A6561] leading-relaxed">{vendor.outsideCateringPolicy || vendor.outside_catering_policy}</p>
                  </div>
                )}
                {(vendor.outsidePhotographyPolicy || vendor.outside_photography_policy) && (
                  <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-black/5 space-y-1">
                    <span className="font-bold text-[#0F4C45] block">Photography & Drone Rules</span>
                    <p className="text-[#5A6561] leading-relaxed">{vendor.outsidePhotographyPolicy || vendor.outside_photography_policy}</p>
                  </div>
                )}
                {(vendor.noiseRestrictions || vendor.noise_restrictions) && (
                  <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-black/5 space-y-1">
                    <span className="font-bold text-[#0F4C45] block">Music & Noise Timings</span>
                    <p className="text-[#5A6561] leading-relaxed">{vendor.noiseRestrictions || vendor.noise_restrictions}</p>
                  </div>
                )}
                {(vendor.alcoholPolicy || vendor.alcohol_policy) && (
                  <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-black/5 space-y-1">
                    <span className="font-bold text-[#0F4C45] block">Alcohol & Bar Setup</span>
                    <p className="text-[#5A6561] leading-relaxed">{vendor.alcoholPolicy || vendor.alcohol_policy}</p>
                  </div>
                )}
                {(vendor.eventTimingRules || vendor.event_timing_rules) && (
                  <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-black/5 space-y-1 sm:col-span-2">
                    <span className="font-bold text-[#0F4C45] block">Event Timing Slot Rules</span>
                    <p className="text-[#5A6561] leading-relaxed">{vendor.eventTimingRules || vendor.event_timing_rules}</p>
                  </div>
                )}
              </div>
            </div>
          )}



          {/* Social Media Channels */}
          {(vendor.instagram || vendor.facebook || vendor.youtube || vendor.website) && (
            <div className="pt-3 border-t border-black/5">
              <span className="text-[11px] text-[#7A6E65] uppercase font-bold tracking-wider block mb-2">Connect via Social Media & Website</span>
              <div className="flex flex-wrap items-center gap-2">
                {vendor.instagram && (
                  <a href={vendor.instagram.startsWith("http") ? vendor.instagram : `https://instagram.com/${vendor.instagram.replace("@", "")}`} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF5EA] border border-[#E8DFD1] rounded-lg text-xs font-bold text-[#0F4C45] hover:bg-[#0F4C45] hover:text-white transition-colors">
                    <InstagramIcon className="w-4 h-4" /> Instagram
                  </a>
                )}
                {vendor.facebook && (
                  <a href={vendor.facebook.startsWith("http") ? vendor.facebook : `https://facebook.com/${vendor.facebook}`} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF5EA] border border-[#E8DFD1] rounded-lg text-xs font-bold text-[#0F4C45] hover:bg-[#0F4C45] hover:text-white transition-colors">
                    <FacebookIcon className="w-4 h-4" /> Facebook
                  </a>
                )}
                {vendor.youtube && (
                  <a href={vendor.youtube.startsWith("http") ? vendor.youtube : `https://youtube.com/${vendor.youtube}`} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF5EA] border border-[#E8DFD1] rounded-lg text-xs font-bold text-[#0F4C45] hover:bg-[#0F4C45] hover:text-white transition-colors">
                    <YoutubeIcon className="w-4 h-4" /> YouTube
                  </a>
                )}
                {vendor.website && (
                  <a href={vendor.website.startsWith("http") ? vendor.website : `https://${vendor.website}`} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF5EA] border border-[#E8DFD1] rounded-lg text-xs font-bold text-[#0F4C45] hover:bg-[#0F4C45] hover:text-white transition-colors">
                    <Globe className="w-4 h-4" /> Official Website <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          )}
        </section>

        {/* Key Stats Cards (3 Columns) */}
        <div className="grid grid-cols-3 gap-1.5 sm:gap-2 md:gap-4 lg:gap-5 text-center">
          {stats.map((st, i) => (
            <div key={i} className="p-2 sm:p-3 md:p-5 lg:py-6 rounded-2xl bg-[#FAF5EA] border border-[#E8DFD1] flex flex-col items-center justify-center min-h-[85px] sm:min-h-[90px] md:min-h-[110px] lg:h-[130px] lg:max-h-[140px] transition-transform hover:-translate-y-0.5">
              {st.icon === "clock" && <Clock className="h-5 w-5 md:h-6 md:w-6 text-[#0F4C45]" />}
              {st.icon === "camera" && <Camera className="h-5 w-5 md:h-6 md:w-6 text-[#0F4C45]" />}
              {st.icon === "users" && <Users className="h-5 w-5 md:h-6 md:w-6 text-[#0F4C45]" />}
              {st.icon === "building" && <Building className="h-5 w-5 md:h-6 md:w-6 text-[#0F4C45]" />}
              {st.icon === "star" && <Star className="h-5 w-5 md:h-6 md:w-6 text-[#C8A96A] fill-[#C8A96A]" />}
              {st.icon === "sparkles" && <Sparkles className="h-5 w-5 md:h-6 md:w-6 text-[#0F4C45]" />}
              {st.icon === "utensils" && <span className="material-symbols-outlined text-[22px] md:text-[26px] text-[#0F4C45]">restaurant</span>}

              <span className="font-serif text-[clamp(1rem,1.4vw,1.625rem)] font-bold text-[#1A1410] block mt-1">
                {st.value}
              </span>
              <span className="text-[clamp(0.6875rem,0.8vw,0.8125rem)] text-[#7A6E65] leading-tight mt-0.5">{st.label}</span>
            </div>
          ))}
        </div>

        {/* Highlights Carousel / Portfolio Grid */}
        <section className="rounded-2xl bg-white p-3 sm:p-4 md:p-6 lg:p-8 border border-black/5 shadow-xs">
          <div className="flex items-center justify-between mb-3 md:mb-5">
            <h2 className="font-serif text-[clamp(1rem,1.5vw,1.625rem)] font-bold text-[#1A1410]">{highlightsTitle}</h2>
            <button className="text-[12px] md:text-[13px] font-bold text-[#0F4C45] hover:underline">See All</button>
          </div>
          <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 md:gap-4 lg:gap-5 overflow-x-auto md:overflow-visible hide-scrollbar pb-2 md:pb-0">
            {highlights.map((item, idx) => (
              <div
                key={idx}
                className="relative min-w-[170px] w-[55vw] sm:w-48 md:w-auto aspect-[3/4] rounded-xl overflow-hidden shadow-sm shrink-0 md:shrink group"
              >
                <Image src={item.image} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                <span className="absolute bottom-2 left-2 right-2 text-[11px] md:text-[12px] font-bold text-white leading-tight">
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Vendor Packages Section */}
        {vendor.packages && vendor.packages.length > 0 && (
          <section className="rounded-2xl bg-white p-4 sm:p-5 md:p-6 lg:p-8 border border-black/5 shadow-xs space-y-4">
            <h2 className="font-serif text-[clamp(1rem,1.5vw,1.625rem)] font-bold text-[#1A1410]">
              Exclusive Packages & Offerings
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {vendor.packages.map((pkg, idx) => (
                <div key={idx} className={`p-5 rounded-2xl border flex flex-col justify-between relative ${pkg.isPopular ? "bg-[#FAF5EA] border-[#C8A96A] border-2 shadow-sm" : "bg-[#FAF9F6] border-black/10"}`}>
                  {pkg.isPopular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0F4C45] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full shadow-xs">
                      Most Popular
                    </span>
                  )}
                  <div className="space-y-2">
                    <h3 className="font-serif font-bold text-lg text-[#1A1410]">{pkg.name}</h3>
                    {pkg.tagline && <p className="text-xs font-semibold text-[#0F4C45] italic">"{pkg.tagline}"</p>}
                    {pkg.description && <p className="text-xs text-[#5A6561] leading-relaxed">{pkg.description}</p>}

                    {pkg.features && pkg.features.length > 0 && (
                      <ul className="mt-3 space-y-1.5 text-xs text-[#2D2520]">
                        {pkg.features.map((feat, fidx) => (
                          <li key={fidx} className="flex items-center gap-1.5">
                            <Check className="w-3.5 h-3.5 text-[#0F4C45] shrink-0" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-black/5 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-[#7A6E65] block font-medium">Package Price</span>
                      <span className="font-serif text-xl font-bold text-[#0F4C45]">{pkg.price}</span>
                      {pkg.originalPrice && <span className="text-xs text-[#8C827A] line-through ml-2">{pkg.originalPrice}</span>}
                    </div>
                    <button onClick={() => setActiveModal("quote")} className="px-4 py-2 bg-[#0F4C45] text-white font-bold text-xs rounded-xl hover:bg-[#072B27] transition-colors">
                      Book Package
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Price Range Section (Centered 3 Columns) */}
        <section className="rounded-2xl bg-white p-3 sm:p-4 md:p-6 lg:p-8 border border-black/5 shadow-xs w-[min(100%,960px)] mx-auto">
          <h2 className="font-serif text-[clamp(1rem,1.5vw,1.625rem)] font-bold text-[#1A1410] mb-3 md:mb-5">Price Range</h2>
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2 md:gap-4 lg:gap-5 text-center">
            {prices.map((pr, idx) => (
              <div
                key={idx}
                className={`relative p-2 sm:p-3 md:p-5 rounded-xl border flex flex-col justify-between ${
                  pr.isPopular ? "bg-[#FAF5EA] border-[#D4B66E] border-2 shadow-xs" : "bg-[#FAF9F6] border-black/5"
                }`}
              >
                {pr.isPopular && (
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded bg-[#0F4C45] px-2 py-0.5 text-[7.5px] sm:text-[8px] md:text-[10px] font-bold text-white uppercase whitespace-nowrap tracking-wider shadow-xs">
                    Most Popular
                  </span>
                )}
                <div>
                  <span className="text-[clamp(0.6875rem,0.8vw,0.8125rem)] text-[#7A6E65] block font-medium mt-1">{pr.category}</span>
                  <span className="font-serif text-[clamp(0.9375rem,1.3vw,1.375rem)] font-bold text-[#0F4C45] block mt-1">
                    {pr.price}
                  </span>
                </div>
                <span className="text-[10px] md:text-[12px] text-[#8C827A] mt-1 block">Onwards</span>
              </div>
            ))}
          </div>
        </section>

        {/* Category Specifications Section */}
        {((vendor.cuisineTypes && vendor.cuisineTypes.length > 0) ||
          (vendor.serviceTypes && vendor.serviceTypes.length > 0) ||
          (vendor.cateringSpecialities && vendor.cateringSpecialities.length > 0) ||
          vendor.guestCapacity ||
          (vendor.serviceLocations && vendor.serviceLocations.length > 0)) && (
          <section className="rounded-2xl bg-white p-4 sm:p-5 md:p-6 lg:p-8 border border-black/5 shadow-xs space-y-4">
            <h2 className="font-serif text-[clamp(1rem,1.5vw,1.625rem)] font-bold text-[#1A1410]">
              Category Specifications & Capabilities
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs font-sans">
              {vendor.cuisineTypes && vendor.cuisineTypes.length > 0 && (
                <div className="p-4 rounded-xl bg-[#FAF9F6] border border-black/5 space-y-2">
                  <span className="font-serif font-bold text-[#0F4C45] text-sm block">Cuisine Types</span>
                  <div className="flex flex-wrap gap-1.5">
                    {vendor.cuisineTypes.map((c) => (
                      <span key={c} className="bg-[#0F4C45]/10 text-[#0F4C45] font-semibold px-2.5 py-1 rounded-md text-[11px]">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {vendor.cateringSpecialities && vendor.cateringSpecialities.length > 0 && (
                <div className="p-4 rounded-xl bg-[#FAF9F6] border border-black/5 space-y-2">
                  <span className="font-serif font-bold text-[#0F4C45] text-sm block">Specialities & Offerings</span>
                  <div className="flex flex-wrap gap-1.5">
                    {vendor.cateringSpecialities.map((s) => (
                      <span key={s} className="bg-amber-100 text-amber-950 font-semibold px-2.5 py-1 rounded-md text-[11px]">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {vendor.serviceTypes && vendor.serviceTypes.length > 0 && (
                <div className="p-4 rounded-xl bg-[#FAF9F6] border border-black/5 space-y-2">
                  <span className="font-serif font-bold text-[#0F4C45] text-sm block">Service Formats</span>
                  <div className="flex flex-wrap gap-1.5">
                    {vendor.serviceTypes.map((st) => (
                      <span key={st} className="bg-emerald-100 text-emerald-950 font-semibold px-2.5 py-1 rounded-md text-[11px]">
                        {st}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {vendor.guestCapacity && (
                <div className="p-4 rounded-xl bg-[#FAF9F6] border border-black/5 space-y-1">
                  <span className="font-serif font-bold text-[#0F4C45] text-sm block">Guest Capacity</span>
                  <span className="text-xs font-bold text-[#2D2520] block">{vendor.guestCapacity}</span>
                </div>
              )}

              {vendor.serviceLocations && vendor.serviceLocations.length > 0 && (
                <div className="p-4 rounded-xl bg-[#FAF9F6] border border-black/5 space-y-1 sm:col-span-2">
                  <span className="font-serif font-bold text-[#0F4C45] text-sm block">Service & Travel Districts</span>
                  <span className="text-xs font-medium text-[#4A3F35] block leading-relaxed">
                    {vendor.serviceLocations.join(" • ")}
                  </span>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Intro Video Reel Section */}
        {vendor.introVideo && (
          <section className="rounded-2xl bg-white p-4 sm:p-5 md:p-6 lg:p-8 border border-black/5 shadow-xs space-y-3">
            <h2 className="font-serif text-[clamp(1rem,1.5vw,1.625rem)] font-bold text-[#1A1410]">
              Brand Introduction & Showcase Reel
            </h2>
            <div className="rounded-xl overflow-hidden bg-black max-w-3xl mx-auto aspect-video border border-gold/20 shadow-md">
              <video src={vendor.introVideo} controls className="w-full h-full object-cover" />
            </div>
          </section>
        )}

        {/* Services Included Section */}
        <section className="rounded-2xl bg-white p-3 sm:p-4 md:p-6 lg:p-8 border border-black/5 shadow-xs">
          <h2 className="font-serif text-[clamp(1rem,1.5vw,1.625rem)] font-bold text-[#1A1410] mb-3 md:mb-5">Services Included</h2>
          <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 items-center gap-2 sm:gap-2.5 md:gap-4 lg:gap-5 overflow-x-auto md:overflow-visible hide-scrollbar pb-1 md:pb-0">
            {services.map((svc, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center justify-center p-2.5 sm:p-3 md:p-4 min-w-[100px] sm:min-w-[110px] md:min-w-0 rounded-xl bg-[#FAF9F6] border border-black/5 text-center shrink-0 md:shrink"
              >
                <span className="material-symbols-outlined text-[22px] md:text-[28px] text-[#0F4C45]">
                  {svc.icon}
                </span>
                <span className="mt-1 md:mt-2 text-[10px] md:text-[12px] font-semibold text-[#4A3F35] leading-tight">
                  {svc.name}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Reviews Section */}
        {vendor.userReviews && vendor.userReviews.length > 0 ? (
          <section className="rounded-2xl bg-white p-3 sm:p-4 md:p-6 lg:p-8 border border-black/5 shadow-xs w-[min(100%,880px)] mx-auto">
            <div className="flex items-center justify-between mb-3 md:mb-5">
              <h2 className="font-serif text-[clamp(1rem,1.5vw,1.625rem)] font-bold text-[#1A1410]">Verified Reviews</h2>
              <button className="text-[12px] md:text-[13px] font-bold text-[#0F4C45] hover:underline">See All</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 lg:gap-5">
              {vendor.userReviews.map((rev, idx) => (
                <div key={idx} className="p-3 sm:p-4 rounded-xl bg-[#FAF5EA] border border-[#E8DFD1]">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] md:text-[14px] font-bold text-[#1A1410]">{rev.author}</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-[#C8A96A] text-[#C8A96A]" />
                      <span className="text-[11px] md:text-[12px] font-bold text-[#1A1410]">{rev.rating}</span>
                    </div>
                  </div>
                  <p className="mt-1.5 text-[12px] md:text-[13px] text-[#5A6561] leading-relaxed">{rev.text}</p>
                </div>
              ))}
            </div>
          </section>
        ) : (
          <section className="rounded-2xl bg-white p-6 md:p-8 border border-black/5 shadow-xs text-center space-y-2 w-[min(100%,880px)] mx-auto">
            <div className="w-12 h-12 rounded-full bg-[#FAF5EA] border border-[#E8DFD1] text-[#0F4C45] flex items-center justify-center mx-auto">
              <Star className="w-6 h-6 fill-[#C8A96A] text-[#C8A96A]" />
            </div>
            <h3 className="font-serif font-bold text-lg text-[#1A1410]">No Reviews Yet</h3>
            <p className="text-xs text-[#7A6E65] max-w-sm mx-auto">
              This partner is newly listed or hasn't received public reviews yet. Book through Cloche and leave the first review!
            </p>
          </section>
        )}

        {/* Real Dynamic Explore Other Vendors in Same Category */}
        <ExploreOtherVendors
          category={vendor.category || "venues"}
          currentVendorId={vendor.id}
          currentVendorName={vendor.name}
        />

      </main>

      {/* Sticky Bottom Actions & Floating Genie Button */}
      <div className="fixed bottom-16 md:bottom-6 lg:bottom-8 left-1/2 -translate-x-1/2 z-40 bg-white/95 backdrop-blur-md px-3 sm:px-4 md:px-6 py-2.5 md:py-0 border-t md:border border-black/10 shadow-lg md:shadow-2xl md:rounded-full w-[calc(100%-1.5rem)] md:w-[min(92vw,980px)] h-auto md:h-[72px] flex items-center transition-all">
        <div className="relative flex-1 flex items-center gap-2 md:gap-4">
          <a
            href={`tel:${vendor.phone || ""}`}
            className="flex-1 flex items-center justify-center gap-1.5 rounded-xl md:rounded-full bg-[#0F4C45] h-12 md:h-14 text-[13px] md:text-[14px] font-bold text-white hover:bg-[#083833] transition-colors"
          >
            <Phone className="h-4 w-4" /> Call
          </a>

          <a
            href={`https://wa.me/${(vendor.whatsapp || vendor.phone || "").replace(/\D/g, "")}`}
            target="_blank"
            rel="noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 rounded-xl md:rounded-full bg-[#0F4C45] h-12 md:h-14 text-[13px] md:text-[14px] font-bold text-white hover:bg-[#083833] transition-colors"
          >
            <MessageCircle className="h-4 w-4" /> WhatsApp
          </a>

          <button
            onClick={() => setActiveModal("quote")}
            className="flex-1 flex items-center justify-center gap-1.5 rounded-xl md:rounded-full bg-[#C8A96A] h-12 md:h-14 text-[13px] md:text-[14px] font-bold text-[#0F4C45] hover:bg-yellow-400 transition-colors"
          >
            <Mail className="h-4 w-4" /> Get Quote
          </button>
        </div>
      </div>

    </div>
  );
}
