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
  Calendar
} from "lucide-react";
import { BottomNavBar } from "@/components/BottomNavBar";

export interface VendorProfileData {
  id: string;
  name: string;
  category: "catering" | "venue" | "photographer" | "makeup" | "mehendi" | "decorator" | "bridal-wear" | "jewellery" | string;
  categoryLabel?: string;
  location: string;
  rating: number;
  reviews: number;
  image: string;
  coverImages?: string[];
  subtitle?: string;
  startingPrice?: string;
  about?: string;
  isVerified?: boolean;
  isFollowing?: boolean;
  phone?: string;
  whatsapp?: string;
  email?: string;
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
          { name: "Cinematic Films", image: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=600&q=80" },
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

    // Default Fallback: Catering Master Template
    return {
      categoryLabel: "Wedding Caterer",
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
  const highlights = vendor.highlights || defaults.highlights;
  const prices = vendor.prices || defaults.prices;
  const services = vendor.services || defaults.services;
  const stats = vendor.stats || defaults.stats;
  const highlightsTitle = vendor.highlightsTitle || defaults.highlightsTitle;

  // Global Similar Vendors by Category
  const defaultSimilarVendors = [
    {
      id: "sim-1",
      name: "Grand Spice Caterers & Banquets",
      rating: 4.8,
      reviews: 142,
      price: "₹22,000",
      location: vendor.location || "Bandra, Mumbai",
      image: "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=400&q=80"
    },
    {
      name: "Saffron Gourmet Celebrations",
      rating: 4.9,
      reviews: 198,
      price: "₹35,000",
      location: vendor.location || "Mumbai",
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80"
    },
    {
      name: "Flavors of Royal Kitchen",
      rating: 4.7,
      reviews: 95,
      price: "₹28,000",
      location: vendor.location || "Juhu, Mumbai",
      image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=400&q=80"
    }
  ];

  const similarVendors = vendor.similarVendors || defaultSimilarVendors;

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] pb-32 text-[#2D2520] font-sans">

      {/* Top Hero Banner (Mobile & Tablet) */}
      <div className="lg:hidden relative w-full aspect-[4/3] sm:aspect-[16/9] md:h-[440px] md:aspect-auto bg-gray-900 overflow-hidden">
        <Image src={vendor.image} alt={vendor.name} fill priority className="object-cover" />
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
          <div className="col-span-7 relative w-full h-[460px] xl:h-[500px] 2xl:h-[540px] max-h-[540px] rounded-2xl overflow-hidden shadow-md bg-gray-900 group">
            <Image
              src={vendor.image}
              alt={vendor.name}
              fill
              priority
              className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
            />
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
                <span>View All Photos (15)</span>
              </button>

              <div className="rounded-full bg-black/60 px-3.5 py-1.5 text-xs font-bold text-white backdrop-blur-md border border-white/20">
                1/15
              </div>
            </div>
          </div>

          {/* Right Column (Sticky Vendor Information Card) */}
          <div className="col-span-5 sticky top-24 rounded-2xl border border-black/5 bg-white shadow-md p-6 h-[460px] xl:h-[500px] 2xl:h-[540px] flex flex-col justify-between">
            <div>
              {/* Category Badge & Verified Initials Header */}
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-full bg-[#FAF5EA] border border-[#E8DFD1] text-[12px] font-bold text-[#0F4C45] uppercase tracking-wider">
                  {defaults.categoryLabel}
                </span>
                <div className="relative h-12 w-12 rounded-xl overflow-hidden bg-[#0F4C45] border-2 border-white shadow-sm flex items-center justify-center text-white shrink-0">
                  <span className="font-serif text-sm font-bold tracking-wider">{initials}</span>
                </div>
              </div>

              {/* Vendor Title */}
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-2xl xl:text-3xl font-bold text-[#1A1410] leading-tight">
                  {vendor.name}
                </h1>
                {vendor.isVerified !== false && (
                  <CheckCircle2 className="h-6 w-6 shrink-0 fill-[#0F4C45] text-white" />
                )}
              </div>

              {/* Rating & Location */}
              <div className="mt-2 flex items-center gap-3 text-sm">
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
              <div className="mt-4 p-3.5 rounded-xl bg-[#FAF7F2] border border-black/5 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-[#7A6E65] uppercase tracking-wider font-semibold">Starting Price</div>
                  <div className="text-xl font-bold text-[#0F4C45]">{vendor.startingPrice || "Contact for pricing"}</div>
                </div>
                <span className="text-xs text-[#7A6E65]">Per Event / Package</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-4 border-t border-black/5">
              <button
                onClick={() => setActiveModal("quote")}
                className="w-full py-3.5 rounded-xl bg-[#C8A96A] text-[#0F4C45] font-bold hover:bg-yellow-400 transition-colors flex items-center justify-center gap-2 shadow-xs"
              >
                <Mail className="h-4 w-4" /> Get Instant Quote
              </button>

              <div className="flex gap-2.5">
                <a
                  href={`tel:${vendor.phone || "9876543210"}`}
                  className="flex-1 py-2.5 rounded-xl bg-[#0F4C45] text-white font-bold text-xs hover:bg-[#083833] transition-colors flex items-center justify-center gap-1.5"
                >
                  <Phone className="h-3.5 w-3.5" /> Call
                </a>
                <a
                  href={`https://wa.me/${vendor.phone || "9876543210"}`}
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
        <div className="lg:hidden flex gap-3 sm:gap-4 md:gap-6 items-center relative bg-white p-3 sm:p-4 md:p-6 lg:p-7 rounded-2xl border border-black/5 shadow-xs">
          <div className="relative h-16 w-16 md:h-20 md:w-20 lg:h-22 lg:w-22 shrink-0 rounded-2xl overflow-hidden bg-[#0F4C45] border-2 border-white shadow-md flex items-center justify-center text-white">
            <span className="font-serif text-lg md:text-2xl font-bold tracking-wider">{initials}</span>
          </div>

          <div className="flex-1 min-w-0 flex flex-col justify-center">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-serif text-[clamp(1.375rem,2.5vw,2.375rem)] font-bold text-[#1A1410] leading-tight">
                {vendor.name}
              </h1>
              {vendor.isVerified !== false && (
                <CheckCircle2 className="h-5 w-5 md:h-6 md:w-6 shrink-0 fill-[#0F4C45] text-white" />
              )}
            </div>

            <div className="mt-1.5 flex items-center gap-3 text-[clamp(0.75rem,0.9vw,0.875rem)] flex-wrap">
              <div className="flex items-center gap-1 font-bold text-[#1A1410]">
                <Star className="h-4 w-4 fill-[#C8A96A] text-[#C8A96A]" />
                {Number(vendor.rating ?? 0) > 0 ? (
                  <>
                    <span>{Number(vendor.rating).toFixed(1)}</span>
                    <span className="text-[#7A6E65] font-normal">({vendor.reviews ?? 0})</span>
                  </>
                ) : (
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">New</span>
                )}
              </div>
              <span className="text-[#0F4C45] font-semibold">• Verified {defaults.categoryLabel}</span>
              <div className="flex items-center gap-1 text-[#6B5E52]">
                <MapPin className="h-3.5 w-3.5 md:h-4 md:w-4 text-[#8C827A]" />
                <span>{vendor.location}</span>
              </div>
            </div>
          </div>
        </div>

        {/* About Section */}
        <section className="rounded-2xl bg-white p-3 sm:p-4 md:p-6 lg:p-8 border border-black/5 shadow-xs">
          <h2 className="font-serif text-[clamp(1rem,1.5vw,1.625rem)] font-bold text-[#1A1410]">About</h2>
          <p className="mt-2 text-[clamp(0.8125rem,1vw,1.0625rem)] text-[#5A6561] leading-relaxed max-w-[760px]">
            {vendor.about || `${vendor.name} is known for creating memorable wedding experiences with a perfect blend of style, presentation, and unmatched hospitality. From intimate gatherings to grand celebrations, we bring your vision to life.`}
          </p>
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

        {/* Price Range Section (Centered 3 Columns) */}
        <section className="rounded-2xl bg-white p-3 sm:p-4 md:p-6 lg:p-8 border border-black/5 shadow-xs w-[min(100%,960px)] mx-auto">
          <h2 className="font-serif text-[clamp(1rem,1.5vw,1.625rem)] font-bold text-[#1A1410] mb-3 md:mb-5">Price Range</h2>
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2 md:gap-4 lg:gap-5 text-center">
            {prices.map((pr, idx) => (
              <div
                key={idx}
                className={`relative p-2 sm:p-3 md:p-5 rounded-xl border flex flex-col justify-between ${
                  pr.isPopular ? "bg-[#FAF5EA] border-[#D4B66E] border-2 shadow-xs" : "bg-[#FAF7F2] border-black/5"
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

        {/* Services Included Section */}
        <section className="rounded-2xl bg-white p-3 sm:p-4 md:p-6 lg:p-8 border border-black/5 shadow-xs">
          <h2 className="font-serif text-[clamp(1rem,1.5vw,1.625rem)] font-bold text-[#1A1410] mb-3 md:mb-5">Services Included</h2>
          <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 items-center gap-2 sm:gap-2.5 md:gap-4 lg:gap-5 overflow-x-auto md:overflow-visible hide-scrollbar pb-1 md:pb-0">
            {services.map((svc, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center justify-center p-2.5 sm:p-3 md:p-4 min-w-[100px] sm:min-w-[110px] md:min-w-0 rounded-xl bg-[#FAF7F2] border border-black/5 text-center shrink-0 md:shrink"
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
              <h2 className="font-serif text-[clamp(1rem,1.5vw,1.625rem)] font-bold text-[#1A1410]">Reviews</h2>
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
          <section className="rounded-2xl bg-white p-3 sm:p-4 md:p-6 lg:p-8 border border-black/5 shadow-xs w-[min(100%,880px)] mx-auto">
            <div className="flex items-center justify-between mb-3 md:mb-5">
              <h2 className="font-serif text-[clamp(1rem,1.5vw,1.625rem)] font-bold text-[#1A1410]">Reviews</h2>
              <button className="text-[12px] md:text-[13px] font-bold text-[#0F4C45] hover:underline">See All</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 lg:gap-5">
              <div className="p-3 sm:p-4 rounded-xl bg-[#FAF5EA] border border-[#E8DFD1]">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] md:text-[14px] font-bold text-[#1A1410]">Neha Sharma</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-[#C8A96A] text-[#C8A96A]" />
                    <span className="text-[11px] md:text-[12px] font-bold text-[#1A1410]">5</span>
                  </div>
                </div>
                <p className="mt-1.5 text-[12px] md:text-[13px] text-[#5A6561] leading-relaxed">
                  The service was absolutely amazing! Every detail was executed flawlessly. Highly recommended!
                </p>
              </div>
              <div className="p-3 sm:p-4 rounded-xl bg-[#FAF5EA] border border-[#E8DFD1] hidden md:block">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] md:text-[14px] font-bold text-[#1A1410]">Rohan Verma</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-[#C8A96A] text-[#C8A96A]" />
                    <span className="text-[11px] md:text-[12px] font-bold text-[#1A1410]">5</span>
                  </div>
                </div>
                <p className="mt-1.5 text-[12px] md:text-[13px] text-[#5A6561] leading-relaxed">
                  Extremely professional team with incredible taste and punctuality. Our guests loved everything!
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Global Cards of Other Vendors in Same Category */}
        <section className="rounded-2xl bg-white p-3 sm:p-4 md:p-6 lg:p-8 border border-black/5 shadow-xs">
          <div className="flex items-center justify-between mb-3 md:mb-5">
            <h2 className="font-serif text-[clamp(1rem,1.5vw,1.625rem)] font-bold text-[#1A1410]">
              Explore Other {defaults.categoryLabel}s
            </h2>
            <Link href="/vendors" className="text-[12px] md:text-[13px] font-bold text-[#0F4C45] hover:underline">
              See All
            </Link>
          </div>

          <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 md:gap-4 lg:gap-5 overflow-x-auto md:overflow-visible hide-scrollbar pb-2 md:pb-0">
            {similarVendors.map((sim, idx) => (
              <Link
                key={idx}
                href="/vendors"
                className="flex-shrink-0 min-w-[200px] w-[62vw] sm:w-52 md:w-auto rounded-xl overflow-hidden bg-[#FAF7F2] border border-black/5 shadow-2xs hover:border-[#0F4C45] transition-all group"
              >
                <div className="relative h-32 md:h-36 w-full">
                  <Image src={sim.image} alt={sim.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="p-2.5 md:p-3">
                  <h4 className="text-xs md:text-sm font-bold text-[#1A1410] truncate">{sim.name}</h4>
                  <div className="flex items-center gap-1 text-[10px] md:text-[12px] text-[#7A6E65] mt-0.5">
                    <Star className="h-3 w-3 fill-[#C8A96A] text-[#C8A96A]" />
                    <span>{sim.rating}</span>
                    <span>({sim.reviews || 95})</span>
                  </div>
                  <span className="block text-[11px] md:text-[13px] font-bold text-[#0F4C45] mt-1">{sim.price} onwards</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

      </main>

      {/* Sticky Bottom Actions & Floating Genie Button */}
      <div className="fixed bottom-16 md:bottom-6 lg:bottom-8 left-1/2 -translate-x-1/2 z-40 bg-white/95 backdrop-blur-md px-3 sm:px-4 md:px-6 py-2.5 md:py-0 border-t md:border border-black/10 shadow-lg md:shadow-2xl md:rounded-full w-[calc(100%-1.5rem)] md:w-[min(92vw,980px)] h-auto md:h-[72px] flex items-center transition-all">
        <div className="relative flex-1 flex items-center gap-2 md:gap-4">
          <a
            href={`tel:${vendor.phone || "9876543210"}`}
            className="flex-1 flex items-center justify-center gap-1.5 rounded-xl md:rounded-full bg-[#0F4C45] h-12 md:h-14 text-[13px] md:text-[14px] font-bold text-white hover:bg-[#083833] transition-colors"
          >
            <Phone className="h-4 w-4" /> Call
          </a>

          <a
            href={`https://wa.me/${vendor.phone || "9876543210"}`}
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

          {/* Floating Golden Genie Button */}
          <Link
            href="/genie"
            className="absolute -top-3 -right-2 md:-top-3 md:-right-3 h-12 w-12 md:h-14 md:w-14 rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#F3E5AB] text-[#0F4C45] border-2 border-white shadow-xl flex items-center justify-center active:scale-95 transition-transform hover:scale-105"
            aria-label="Cloche Genie Assistant"
          >
            <Sparkles className="h-6 w-6 fill-[#0F4C45] text-[#0F4C45] animate-pulse" />
          </Link>
        </div>
      </div>

      {/* Cloche Bottom Navigation Bar */}
      <BottomNavBar activeTab="vendors" />
    </div>
  );
}
