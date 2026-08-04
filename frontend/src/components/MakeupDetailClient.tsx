"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Share2,
  Heart,
  CheckCircle2,
  Star,
  MapPin,
  Phone,
  MessageSquare,
  Calendar,
  Clock,
  Sparkles,
  ShieldCheck,
  Award,
  Check,
  ChevronRight,
  ChevronDown,
  Play,
  X,
  Copy,
  ExternalLink,
  Eye,
  ThumbsUp,
  Maximize2,
  Smartphone,
  Monitor,
  RefreshCw,
  Gift,
  HelpCircle,
  Mail,
  Globe,
  SlidersHorizontal,
  Plus
} from "lucide-react";
import { VendorDetail } from "@/lib/vendorLists";
import { formatTelUri } from "@/lib/formatters";

// SVG Brand Icons
const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);

const YoutubeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.56 49.56 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
    <path d="m10 15 5-3-5-3v6Z" />
  </svg>
);

interface PortfolioItem {
  id: string;
  url: string;
  title: string;
  category: "bridal" | "engagement" | "reception" | "haldi" | "mehendi" | "south_indian" | "christian" | "editorial" | "before_after";
  categoryLabel: string;
  likes: number;
  lipShade?: string;
  technique?: string;
}

interface VideoItem {
  id: string;
  thumbnail: string;
  title: string;
  duration: string;
  views: string;
  likes: string;
}

interface ReviewItem {
  id: string;
  brideName: string;
  brideAvatar: string;
  weddingDate: string;
  eventType: string;
  rating: number;
  comment: string;
  photos: string[];
  verifiedBride: boolean;
  vendorReply?: {
    date: string;
    message: string;
  };
}

export function MakeupDetailClient({ artist }: { artist: VendorDetail }) {
  // UI Controls
  const [viewMode, setViewMode] = useState<"mobile" | "full">("mobile");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"about" | "portfolio" | "services" | "packages" | "reviews" | "faqs" | "contact">("about");
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filters & Controls
  const [portfolioCategory, setPortfolioCategory] = useState<string>("all");
  const [reviewFilter, setReviewFilter] = useState<"latest" | "highest" | "lowest" | "photos">("latest");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [selectedDate, setSelectedDate] = useState<string | null>("2026-11-18");

  // Modals
  const [activeModal, setActiveModal] = useState<null | "availability" | "quote" | "share" | "review_write">(null);
  const [lightboxImage, setLightboxImage] = useState<PortfolioItem | null>(null);
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);

  // Quote Form State
  const [quoteStep, setQuoteStep] = useState(1);
  const [quoteData, setQuoteData] = useState({
    name: "",
    phone: "",
    eventDate: "2026-11-18",
    functions: ["Bridal HD Makeup"],
    guestCount: "2 Bridesmaids",
    city: artist.location || "Delhi NCR",
    notes: ""
  });

  // Display Toast message
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Toggle wishlist
  const handleWishlistToggle = () => {
    setIsWishlisted(!isWishlisted);
    showToast(!isWishlisted ? "Added to your Cloche Luxury Wishlist!" : "Removed from Wishlist");
  };

  // Scroll tab sync
  const scrollToSection = (id: string) => {
    setActiveTab(id as any);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -120;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  // Mock Data Sets tailored to Luxury Bridal Makeup
  const portfolioItems: PortfolioItem[] = [
    {
      id: "p1",
      url: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80",
      title: "Royal Crimson Sabyasachi Bride",
      category: "bridal",
      categoryLabel: "Bridal",
      likes: 1240,
      lipShade: "MAC Ruby Woo + Charlotte Tilbury Walk of No Shame",
      technique: "4K HD Waterproof Airbrush & Matte Eye Glam"
    },
    {
      id: "p2",
      url: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
      title: "Golden Hour Dewy Sangeet Glow",
      category: "engagement",
      categoryLabel: "Engagement",
      likes: 980,
      lipShade: "NARS Velvet Gloss Nude Pink",
      technique: "Glass Skin Hydration + Soft Smokey Contour"
    },
    {
      id: "p3",
      url: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=800&q=80",
      title: "Royal South Indian Kanjeevaram Bride",
      category: "south_indian",
      categoryLabel: "South Indian Bride",
      likes: 1850,
      lipShade: "Huda Beauty Trophy Wife + Gold Temple Kohl",
      technique: "Traditional Matte Base + Fresh Mogra Hair Bun"
    },
    {
      id: "p4",
      url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
      title: "Pastel Ivory Reception Elegance",
      category: "reception",
      categoryLabel: "Reception",
      likes: 1420,
      lipShade: "Dior Addict Stellar Gloss 639",
      technique: "Airbrush Glow + Hollywood Waves Hair"
    },
    {
      id: "p5",
      url: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=800&q=80",
      title: "Haldi Sunshine Minimalist Glow",
      category: "haldi",
      categoryLabel: "Haldi",
      likes: 890,
      lipShade: "Bobbi Brown Bare Pink Tint",
      technique: "Sweatproof Tinted Moisturizer & Floral Bun"
    },
    {
      id: "p6",
      url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80",
      title: "Classic White Veil Christian Bride",
      category: "christian",
      categoryLabel: "Christian Bride",
      likes: 1100,
      lipShade: "Tom Ford Spanish Pink",
      technique: "Soft Monochromatic Nude + Tiara Placement"
    },
    {
      id: "p7",
      url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80",
      title: "Emerald & Gold Mehendi Glam",
      category: "mehendi",
      categoryLabel: "Mehendi",
      likes: 760,
      lipShade: "Fenty Glow Gloss Bomb",
      technique: "Winged Eyeliner & Messy Braid Draping"
    },
    {
      id: "p8",
      url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
      title: "Vogue Cover Bridal Editorial",
      category: "editorial",
      categoryLabel: "Editorial",
      likes: 2100,
      lipShade: "Charlotte Tilbury Pillow Talk High Shine",
      technique: "High Definition Sculpting & Pearl Accent Eye"
    }
  ];

  const filteredPortfolio = portfolioCategory === "all"
    ? portfolioItems
    : portfolioItems.filter(item => item.category === portfolioCategory);

  const videoItems: VideoItem[] = [
    {
      id: "v1",
      thumbnail: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&q=80",
      title: "Real Bride Transformation: Sabyasachi Red Glow",
      duration: "0:45",
      views: "185K",
      likes: "14.2K"
    },
    {
      id: "v2",
      thumbnail: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80",
      title: "Behind The Scenes: Destination Wedding in Udaipur",
      duration: "0:58",
      views: "240K",
      likes: "22.8K"
    },
    {
      id: "v3",
      thumbnail: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=600&q=80",
      title: "Waterproof HD Test: 14 Hours Post Ceremony",
      duration: "0:32",
      views: "98K",
      likes: "9.6K"
    }
  ];

  const serviceCards = [
    {
      title: "Bridal HD Signature Makeup",
      price: "₹25,000",
      duration: "3.0 Hours",
      popular: true,
      included: [
        "HD Skin prep & pore-refining primer",
        "Custom false lashes (Mink 3D)",
        "Designer Hair Styling & Bun setting",
        "Saree / Lehenga & Dupatta Draping",
        "Complimentary Touch-up mini kit"
      ]
    },
    {
      title: "4K Airbrush Deluxe Bridal Experience",
      price: "₹35,000",
      duration: "3.5 Hours",
      popular: false,
      included: [
        "Waterproof 24-Hr Airbrush Spray Base",
        "Premium HD Contour & Lip Customization",
        "Intricate Floral / Jewel Hair Draping",
        "Luxury Body Shimmer & Neck Highlight",
        "Pre-wedding Skin Consultation Session"
      ]
    },
    {
      title: "Engagement & Sangeet Glamour",
      price: "₹18,000",
      duration: "2.5 Hours",
      popular: false,
      included: [
        "Smokey eye / Dewy glass skin look",
        "Voluminous curls or sleek ponytail",
        "Eyelash extension placement",
        "Outfit draping & jewelry assistance"
      ]
    },
    {
      title: "Reception & Cocktail Evening Look",
      price: "₹20,000",
      duration: "2.5 Hours",
      popular: false,
      included: [
        "Hollywood Glamwave hair styling",
        "High-definition camera-ready makeup",
        "Hydrating lip stain & gloss setting",
        "Dupatta & dupatta drape fixing"
      ]
    },
    {
      title: "Mother of the Bride / Family Makeup",
      price: "₹10,000",
      duration: "1.5 Hours",
      popular: false,
      included: [
        "Age-defying hydrating foundation",
        "Soft classic eye makeup & blush",
        "Blow-dry styling or elegant updo",
        "Saree / Dupatta pleating & pinning"
      ]
    },
    {
      title: "Groom Grooming & Hair Styling",
      price: "₹8,000",
      duration: "1.0 Hour",
      popular: false,
      included: [
        "Matte anti-shine skin prep & concealer",
        "Beard line trimming & styling",
        "Hair texturizing & setting",
        "Turban / Safa touch-up assistance"
      ]
    }
  ];

  const packagesData = [
    {
      name: "Silver Bridal Package",
      badge: "Essential 2-Function",
      price: "₹45,000",
      originalPrice: "₹50,000",
      functions: "Engagement + Wedding Day",
      features: [
        "1 Signature Bridal HD Makeup",
        "1 Engagement Makeup",
        "Hair styling & Lash application included",
        "Lehenga & Dupatta draping for both events",
        "Complimentary trial at Gurgaon studio"
      ]
    },
    {
      name: "Gold Royal Package",
      badge: "Most Popular",
      price: "₹75,000",
      originalPrice: "₹85,000",
      functions: "3 Main Functions (Haldi + Sangeet + Wedding)",
      popular: true,
      features: [
        "1 Bridal 4K Airbrush Experience",
        "1 Sangeet Glam + 1 Haldi Glow Makeup",
        "2 Free Family / Bridesmaid Makeups",
        "Full Lash Extensions & Hair Floral Setting",
        "Complimentary trial & Pre-bride face mask kit",
        "On-location assistance throughout ceremony"
      ]
    },
    {
      name: "Platinum Couture Package",
      badge: "All-Inclusive Luxury",
      price: "₹1,20,000",
      originalPrice: "₹1,40,000",
      functions: "4 Functions (Mehendi, Haldi, Sangeet, Wedding)",
      features: [
        "All 4 wedding ceremony looks curated by Parul/Riya",
        "Dedicated senior touch-up artist on standby for 8 hours",
        "4 Family / Bridesmaid makeups included",
        "Luxury Bride Emergency Beauty Trunk Box",
        "Unlimited pre-wedding skincare calls & trials"
      ]
    },
    {
      name: "Destination Wedding Royalty",
      badge: "Worldwide Travel",
      price: "₹1,50,000",
      originalPrice: "₹1,75,000",
      functions: "3 Days / Unlimited Events Anywhere Globally",
      features: [
        "Unlimited function makeovers for the Bride across 3 days",
        "Team of 2 Senior Assistant Artists included",
        "Full continuous touch-ups during ceremony & photoshoots",
        "Travel & accommodation logistics managed seamlessly",
        "100% waterproof heat & humidity resistant airbrushing"
      ]
    }
  ];

  const reviewsList: ReviewItem[] = [
    {
      id: "r1",
      brideName: "Ananya Sengupta",
      brideAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
      weddingDate: "March 2026",
      eventType: "Sangeet & Wedding Day",
      rating: 5,
      comment: "Riya and her team are absolute magicians! I was super nervous about looking caked up on my wedding day, but she gave me the most ethereal, dewy glass-skin bridal look. The makeup stayed intact through 14 hours of emotional rituals and heavy dancing!",
      photos: [
        "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=400&q=80"
      ],
      verifiedBride: true,
      vendorReply: {
        date: "March 2026",
        message: "Thank you so much dearest Ananya! You looked like a royal princess in your red lehenga. Wishing you both lifetime of love! ❤️"
      }
    },
    {
      id: "r2",
      brideName: "Devika Oberoi",
      brideAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
      weddingDate: "January 2026",
      eventType: "Destination Wedding in Udaipur",
      rating: 5,
      comment: "We flew Riya to Jagmandir Palace in Udaipur for 3 days. Her punctuality, calm demeanour, and perfectionism are unmatched. All my guests and mother-in-law loved their family makeovers!",
      photos: [
        "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=400&q=80"
      ],
      verifiedBride: true
    },
    {
      id: "r3",
      brideName: "Kavya Reddy",
      brideAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
      weddingDate: "February 2026",
      eventType: "South Indian Muhurtham & Reception",
      rating: 5,
      comment: "Her eye makeup detail is next level! She draped my traditional Kanjeevaram saree and temple jewelry flawlessly. Highly recommend booking her at least 6 months in advance!",
      photos: [],
      verifiedBride: true
    }
  ];

  const faqsList = [
    {
      q: "Do you travel to outstation / destination wedding locations?",
      a: "Yes! We travel worldwide for destination weddings (Udaipur, Jaipur, Goa, Dubai, Bali, Italy, etc.). Travel and accommodation expenses for the artist and team are borne by the client or covered under our Destination Package."
    },
    {
      q: "Is a trial makeup session available before booking?",
      a: "Yes, paid paid trials (₹5,000) are available at our Gurgaon / South Delhi studio. If you confirm your booking on the same day, 50% of the trial fee is adjusted towards your final package invoice."
    },
    {
      q: "Which cosmetics and skin prep brands do you use?",
      a: "We use 100% authentic international luxury brands including Charlotte Tilbury, Christian Dior, MAC Cosmetics, NARS, Tom Ford, Bobbi Brown, Huda Beauty, and Fenty Beauty tailored to your skin type."
    },
    {
      q: "Are hair styling and outfit draping included in the bridal packages?",
      a: "Absolutely! Every bridal service includes customized high-definition hair styling (bun, braids, waves), eyelash extension application, and professional lehenga/saree & dupatta draping."
    },
    {
      q: "What is your cancellation and date change policy?",
      a: "Advance deposits (25%) are non-refundable upon cancellation. However, if you notify us at least 30 days prior, date changes can be accommodated subject to artist availability."
    },
    {
      q: "How much advance payment is required to confirm the slot?",
      a: "A 25% deposit confirms your date slot on our master calendar. 50% is payable 7 days prior to the event, and the remaining 25% on the event day before service completion."
    },
    {
      q: "How large is your team and can they style my family/bridesmaids?",
      a: "We have a dedicated team of 6 senior certified artists and assistants who can accommodate up to 15 family members or bridesmaids per event under seamless quality control."
    },
    {
      q: "Is touch-up support provided during the main ceremony?",
      a: "Yes, touch-up mini kits are provided complimentary. For full-time on-stage touch-up assistance during Pheras or Photoshoots, a dedicated assistant can be added to your booking."
    }
  ];

  const calendarDates = [
    { day: "15 Nov", status: "available" },
    { day: "16 Nov", status: "limited" },
    { day: "17 Nov", status: "booked" },
    { day: "18 Nov", status: "available" },
    { day: "19 Nov", status: "available" },
    { day: "20 Nov", status: "limited" },
    { day: "21 Nov", status: "booked" }
  ];

  const similarArtists = [
    {
      name: "Namrata Soni Studio",
      rating: 4.9,
      reviews: 180,
      price: "₹70,000",
      location: "Mumbai",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80"
    },
    {
      name: "Meenakshi Dutt Makeovers",
      rating: 4.8,
      reviews: 120,
      price: "₹65,000",
      location: "Delhi NCR",
      image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=400&q=80"
    },
    {
      name: "Faces by Leena Bhushan",
      rating: 4.7,
      reviews: 94,
      price: "₹60,000",
      location: "Noida",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8F6F2] font-sans text-[#1C1C17] pb-32">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-full px-5 py-2.5 bg-[#0B5D4F] text-white text-[13px] font-medium shadow-2xl animate-fade-in border border-[#D4AF37]/30">
          <Sparkles className="h-4 w-4 text-[#D4AF37]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Preview Controls Bar (for desktop evaluation / responsive testing) */}
      <div className="hidden md:flex items-center justify-between px-6 py-2.5 bg-[#0B5D4F] text-white text-xs border-b border-[#D4AF37]/20 sticky top-0 z-40">
        <div className="flex items-center gap-2 font-serif text-sm tracking-wide">
          <span className="text-[#D4AF37]">CLOCHE</span>
          <span className="opacity-40">|</span>
          <span className="text-[#F8F6F2]/90 font-sans text-xs">Luxury Wedding Marketplace Profile</span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsLoading(!isLoading)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 transition-all text-xs"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin text-[#D4AF37]" : ""}`} />
            <span>{isLoading ? "Skeleton Mode Active" : "Simulate Loading Skeleton"}</span>
          </button>

          <div className="flex items-center bg-black/20 p-0.5 rounded-full border border-white/10">
            <button
              onClick={() => setViewMode("mobile")}
              className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                viewMode === "mobile" ? "bg-[#D4AF37] text-[#0B5D4F]" : "text-white/80 hover:text-white"
              }`}
            >
              <Smartphone className="h-3.5 w-3.5" />
              Mobile Frame (390px)
            </button>
            <button
              onClick={() => setViewMode("full")}
              className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                viewMode === "full" ? "bg-[#D4AF37] text-[#0B5D4F]" : "text-white/80 hover:text-white"
              }`}
            >
              <Monitor className="h-3.5 w-3.5" />
              Full Width View
            </button>
          </div>
        </div>
      </div>

      {/* Outer Shell Wrapper (Mobile Frame on Desktop if mobile view selected) */}
      <div className={`mx-auto transition-all duration-300 ${viewMode === "mobile" ? "max-width-390 md:max-w-[420px] md:my-6 md:rounded-[40px] md:shadow-[0_20px_60px_rgba(0,0,0,0.18)] md:border-[10px] md:border-[#1E1E1C] overflow-hidden relative" : "max-w-5xl"}`}>

        {/* Skeleton Loader State */}
        {isLoading ? (
          <div className="p-4 space-y-6 animate-pulse">
            <div className="h-72 bg-neutral-300 rounded-3xl" />
            <div className="h-36 bg-neutral-200 rounded-2xl" />
            <div className="h-12 bg-neutral-200 rounded-xl" />
            <div className="grid grid-cols-2 gap-4">
              <div className="h-48 bg-neutral-200 rounded-2xl" />
              <div className="h-48 bg-neutral-200 rounded-2xl" />
            </div>
          </div>
        ) : (
          <>
            {/* 1. HERO SECTION */}
            <div className="relative w-full overflow-hidden" style={{ minHeight: "340px" }}>
              {/* Cover Photo */}
              <div className="relative w-full h-80">
                <Image
                  src={artist.images[0] || artist.image}
                  alt={artist.name}
                  fill
                  priority
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B5D4F] via-[#0B5D4F]/30 to-black/50" />
              </div>

              {/* Floating Header Icons */}
              <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 pt-4 z-10">
                <Link
                  href="/makeup"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-black/40 backdrop-blur-md text-white border border-white/20 active:scale-95 transition-transform"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Link>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleWishlistToggle}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-black/40 backdrop-blur-md text-white border border-white/20 active:scale-95 transition-transform"
                  >
                    <Heart className={`h-5 w-5 ${isWishlisted ? "fill-[#E8614A] text-[#E8614A]" : "text-white"}`} />
                  </button>
                  <button
                    onClick={() => setActiveModal("share")}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-black/40 backdrop-blur-md text-white border border-white/20 active:scale-95 transition-transform"
                  >
                    <Share2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Overlapping Profile Card */}
              <div className="px-4 relative -mt-16 z-20">
                <div className="rounded-3xl p-5 bg-[#FFFDF9] border border-[#D4AF37]/25 shadow-[0_12px_40px_rgba(11,93,79,0.08)] relative">

                  {/* Circular Avatar */}
                  <div className="absolute -top-12 left-6 ring-4 ring-[#0B5D4F] rounded-full overflow-hidden shadow-xl w-24 h-24 bg-[#0B5D4F] border-2 border-[#D4AF37]">
                    <Image
                      src={artist.image}
                      alt={artist.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Top Badge Tag */}
                  <div className="flex justify-end pt-1">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0B5D4F]/10 text-[#0B5D4F] text-[11px] font-semibold tracking-wide border border-[#0B5D4F]/20">
                      <Sparkles className="h-3 w-3 text-[#D4AF37]" />
                      CLOCHE CHOICE VENDOR
                    </span>
                  </div>

                  <div className="pt-4">
                    <div className="flex items-center gap-2">
                      <h1 className="font-serif text-2xl font-bold tracking-tight text-[#1C1C17]">
                        {artist.name}
                      </h1>
                      <CheckCircle2 className="h-5 w-5 text-[#0B5D4F] shrink-0" />
                    </div>

                    <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-[#D4AF37]">
                      {artist.category} • Luxury Couture Makeup
                    </p>

                    <div className="mt-2 flex items-center gap-1.5 text-xs text-[#6E6A61]">
                      <MapPin className="h-3.5 w-3.5 text-[#0B5D4F]" />
                      <span>{artist.location || "Delhi NCR & Destination Worldwide"}</span>
                    </div>

                    {/* Stats Grid Pill Bar */}
                    <div className="mt-4 grid grid-cols-3 gap-2 p-3 rounded-2xl bg-[#F8F6F2] border border-[#EBE5DA] text-center">
                      <div className="flex flex-col items-center">
                        <div className="flex items-center gap-1 text-[#0B5D4F] font-bold text-sm">
                          <Star className="h-3.5 w-3.5 fill-[#D4AF37] text-[#D4AF37]" />
                          <span>4.9</span>
                        </div>
                        <span className="text-[10px] text-[#6E6A61] mt-0.5">328 Reviews</span>
                      </div>

                      <div className="flex flex-col items-center border-x border-[#EBE5DA] px-1">
                        <span className="font-bold text-sm text-[#0B5D4F]">₹25,000</span>
                        <span className="text-[10px] text-[#6E6A61] mt-0.5">Starting Price</span>
                      </div>

                      <div className="flex flex-col items-center">
                        <span className="font-bold text-sm text-[#0B5D4F]">8+ Yrs</span>
                        <span className="text-[10px] text-[#6E6A61] mt-0.5">Experience</span>
                      </div>
                    </div>

                    {/* Additional Micro Stats Badges */}
                    <div className="mt-3 flex items-center justify-between text-[11px] font-medium text-[#0B5D4F] px-1">
                      <span className="flex items-center gap-1">
                        <Award className="h-3.5 w-3.5 text-[#D4AF37]" />
                        850+ Weddings Done
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-[#D4AF37]" />
                        Responds &lt; 2 Hrs
                      </span>
                      <span className="flex items-center gap-1 text-emerald-800">
                        ✈️ Outstation Ready
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. QUICK INFO CARD */}
            <div className="px-4 mt-4">
              <div className="rounded-2xl p-4 bg-[#FFFDF9] border border-[#EBE5DA] shadow-sm">
                <h3 className="font-serif text-sm font-bold text-[#0B5D4F] uppercase tracking-wider mb-3 flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-[#D4AF37]" />
                  Vendor Highlights & Credentials
                </h3>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-2.5 rounded-xl bg-[#F8F6F2]">
                    <span className="text-[10px] text-[#6E6A61] block uppercase tracking-wider">Category</span>
                    <span className="font-semibold text-[#1C1C17]">Bridal & Couture Hair/Makeup</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#F8F6F2]">
                    <span className="text-[10px] text-[#6E6A61] block uppercase tracking-wider">Followers</span>
                    <span className="font-semibold text-[#1C1C17]">45.8K+ Social Brides</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#F8F6F2]">
                    <span className="text-[10px] text-[#6E6A61] block uppercase tracking-wider">Languages</span>
                    <span className="font-semibold text-[#1C1C17]">English, Hindi, Punjabi</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#F8F6F2]">
                    <span className="text-[10px] text-[#6E6A61] block uppercase tracking-wider">Cities Served</span>
                    <span className="font-semibold text-[#1C1C17]">Delhi, Mumbai, Udaipur, Goa</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. PRIMARY ACTION BUTTONS */}
            <div className="px-4 mt-4">
              <div className="grid grid-cols-4 gap-2">
                <a
                  href={formatTelUri(artist.phone || "9876543210")}
                  className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#FFFDF9] border border-[#EBE5DA] hover:border-[#0B5D4F] active:scale-95 transition-all shadow-sm group"
                >
                  <div className="h-10 w-10 rounded-full bg-[#0B5D4F]/10 flex items-center justify-center text-[#0B5D4F] group-hover:bg-[#0B5D4F] group-hover:text-white transition-colors">
                    <Phone className="h-5 w-5" />
                  </div>
                  <span className="mt-1.5 text-[11px] font-semibold text-[#1C1C17]">Call Artist</span>
                </a>

                <a
                  href={`https://wa.me/${artist.phone || "9876543210"}?text=Hi%20${encodeURIComponent(artist.name)},%20I%20saw%20your%20profile%20on%20Cloche%20Wedding%20Platform%20and%20would%20like%20to%20inquire%20for%20my%20wedding!`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#FFFDF9] border border-[#EBE5DA] hover:border-[#25D366] active:scale-95 transition-all shadow-sm group"
                >
                  <div className="h-10 w-10 rounded-full bg-[#25D366]/10 flex items-center justify-center text-[#25D366] group-hover:bg-[#25D366] group-hover:text-white transition-colors">
                    <WhatsAppIcon className="h-5 w-5" />
                  </div>
                  <span className="mt-1.5 text-[11px] font-semibold text-[#1C1C17]">WhatsApp</span>
                </a>

                <button
                  onClick={() => setActiveModal("availability")}
                  className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#FFFDF9] border border-[#EBE5DA] hover:border-[#D4AF37] active:scale-95 transition-all shadow-sm group"
                >
                  <div className="h-10 w-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-[#0B5D4F] transition-colors">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <span className="mt-1.5 text-[11px] font-semibold text-[#1C1C17]">Availability</span>
                </button>

                <button
                  onClick={() => setActiveModal("quote")}
                  className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#0B5D4F] text-white hover:bg-[#08483d] active:scale-95 transition-all shadow-md group"
                >
                  <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center text-white">
                    <Sparkles className="h-5 w-5 text-[#D4AF37]" />
                  </div>
                  <span className="mt-1.5 text-[11px] font-bold text-white">Get Quote</span>
                </button>
              </div>
            </div>

            {/* 4. STICKY SECTION NAVIGATION */}
            <div className="sticky top-0 z-30 mt-6 bg-[#F8F6F2]/95 backdrop-blur-md border-y border-[#EBE5DA]">
              <div className="flex items-center gap-1 px-4 overflow-x-auto hide-scrollbar py-2.5">
                {[
                  { id: "about", label: "About" },
                  { id: "portfolio", label: "Portfolio" },
                  { id: "services", label: "Services" },
                  { id: "packages", label: "Packages" },
                  { id: "reviews", label: "Reviews" },
                  { id: "faqs", label: "FAQs" },
                  { id: "contact", label: "Contact" }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => scrollToSection(tab.id)}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                      activeTab === tab.id
                        ? "bg-[#0B5D4F] text-white shadow-sm"
                        : "text-[#6E6A61] hover:text-[#1C1C17] hover:bg-[#EBE5DA]/50"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 5. ABOUT SECTION */}
            <div id="about" className="px-4 mt-6 space-y-4">
              <div className="rounded-3xl p-5 bg-[#FFFDF9] border border-[#EBE5DA] shadow-sm">
                <div className="flex items-center justify-between border-b border-[#EBE5DA] pb-3 mb-3">
                  <h2 className="font-serif text-lg font-bold text-[#0B5D4F]">
                    About {artist.name}
                  </h2>
                  <span className="text-xs text-[#D4AF37] font-semibold flex items-center gap-1">
                    <Sparkles className="h-3.5 w-3.5" />
                    Verified Master Artist
                  </span>
                </div>

                <p className="text-xs text-[#4A4740] leading-relaxed">
                  {artist.about || `With over 8 years of luxury bridal experience, ${artist.name} is celebrated across India for creating timeless, radiant, and customized wedding looks. Her core philosophy centers on enhancing each bride's unique natural features using HD airbrush technology, skin prep rituals, and global couture standards.`}
                </p>

                {/* Key Features Cards */}
                <div className="mt-4 grid grid-cols-2 gap-2.5">
                  <div className="p-3 rounded-2xl bg-[#F8F6F2] border border-[#EBE5DA]">
                    <div className="h-7 w-7 rounded-full bg-[#0B5D4F]/10 flex items-center justify-center text-[#0B5D4F] mb-1.5">
                      <Sparkles className="h-4 w-4 text-[#D4AF37]" />
                    </div>
                    <h4 className="text-xs font-bold text-[#1C1C17]">Luxury Brands</h4>
                    <p className="text-[10px] text-[#6E6A61] mt-0.5">Charlotte Tilbury, Dior, NARS, MAC, Tom Ford</p>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#F8F6F2] border border-[#EBE5DA]">
                    <div className="h-7 w-7 rounded-full bg-[#0B5D4F]/10 flex items-center justify-center text-[#0B5D4F] mb-1.5">
                      <Award className="h-4 w-4 text-[#0B5D4F]" />
                    </div>
                    <h4 className="text-xs font-bold text-[#1C1C17]">Senior Stylist Team</h4>
                    <p className="text-[10px] text-[#6E6A61] mt-0.5">Team of 6 certified artists for bridesmaids</p>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#F8F6F2] border border-[#EBE5DA]">
                    <div className="h-7 w-7 rounded-full bg-[#0B5D4F]/10 flex items-center justify-center text-[#0B5D4F] mb-1.5">
                      <CheckCircle2 className="h-4 w-4 text-[#0B5D4F]" />
                    </div>
                    <h4 className="text-xs font-bold text-[#1C1C17]">HD 4K Airbrush</h4>
                    <p className="text-[10px] text-[#6E6A61] mt-0.5">Waterproof, sweatproof 24-hr lock technique</p>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#F8F6F2] border border-[#EBE5DA]">
                    <div className="h-7 w-7 rounded-full bg-[#0B5D4F]/10 flex items-center justify-center text-[#0B5D4F] mb-1.5">
                      <Globe className="h-4 w-4 text-[#D4AF37]" />
                    </div>
                    <h4 className="text-xs font-bold text-[#1C1C17]">Destination Ready</h4>
                    <p className="text-[10px] text-[#6E6A61] mt-0.5">Travels with full kit to global destinations</p>
                  </div>
                </div>

                {/* Awards */}
                <div className="mt-4 pt-4 border-t border-[#EBE5DA]">
                  <h4 className="text-xs font-bold text-[#0B5D4F] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Award className="h-4 w-4 text-[#D4AF37]" />
                    Awards & Honors
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 rounded-full bg-[#0B5D4F]/5 border border-[#0B5D4F]/20 text-[11px] font-medium text-[#0B5D4F]">
                      🏆 Vogue Wedding Award 2024
                    </span>
                    <span className="px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[11px] font-medium text-[#0B5D4F]">
                      🌟 WedMeGood Luxury Choice 2025
                    </span>
                    <span className="px-3 py-1 rounded-full bg-[#0B5D4F]/5 border border-[#0B5D4F]/20 text-[11px] font-medium text-[#0B5D4F]">
                      🎓 London School of Makeup Certified
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 6. SERVICES SECTION */}
            <div id="services" className="px-4 mt-6">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h2 className="font-serif text-lg font-bold text-[#0B5D4F]">
                    Bridal Services
                  </h2>
                  <p className="text-xs text-[#6E6A61]">Customized per function & client skin type</p>
                </div>
                <span className="text-xs text-[#D4AF37] font-semibold">6 Services Available</span>
              </div>

              <div className="space-y-3">
                {serviceCards.map((service, idx) => (
                  <div key={idx} className="rounded-2xl p-4 bg-[#FFFDF9] border border-[#EBE5DA] shadow-sm relative overflow-hidden">
                    {service.popular && (
                      <div className="absolute top-0 right-0 bg-[#0B5D4F] text-[#D4AF37] text-[10px] font-bold px-3 py-0.5 rounded-bl-xl border-l border-b border-[#D4AF37]/30">
                        MOST REQUESTED
                      </div>
                    )}
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-serif text-sm font-bold text-[#1C1C17]">
                          {service.title}
                        </h3>
                        <span className="text-[11px] text-[#6E6A61] flex items-center gap-1 mt-0.5">
                          <Clock className="h-3 w-3 text-[#D4AF37]" />
                          Duration: {service.duration}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-base font-bold text-[#0B5D4F]">{service.price}</span>
                        <span className="block text-[10px] text-[#6E6A61]">onwards</span>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-[#EBE5DA]">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#6E6A61] block mb-1.5">What's Included:</span>
                      <ul className="grid grid-cols-1 gap-1">
                        {service.included.map((item, i) => (
                          <li key={i} className="text-xs text-[#4A4740] flex items-center gap-1.5">
                            <Check className="h-3.5 w-3.5 text-[#0B5D4F] shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      onClick={() => {
                        setQuoteData(prev => ({ ...prev, functions: [service.title] }));
                        setActiveModal("quote");
                      }}
                      className="mt-3 w-full py-2 rounded-xl bg-[#0B5D4F]/10 hover:bg-[#0B5D4F] text-[#0B5D4F] hover:text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1"
                    >
                      Inquire for {service.title}
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* 7. PACKAGES SECTION */}
            <div id="packages" className="px-4 mt-6">
              <div className="mb-3">
                <h2 className="font-serif text-lg font-bold text-[#0B5D4F]">
                  Curated Bridal Packages
                </h2>
                <p className="text-xs text-[#6E6A61]">Multi-event packages with complimentary bonuses</p>
              </div>

              <div className="space-y-4">
                {packagesData.map((pkg, i) => (
                  <div
                    key={i}
                    className={`rounded-3xl p-5 bg-[#FFFDF9] border shadow-sm relative ${
                      pkg.popular ? "border-2 border-[#D4AF37]" : "border-[#EBE5DA]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-0.5 rounded-full bg-[#0B5D4F]/10 text-[#0B5D4F] text-[10px] font-bold uppercase tracking-wider">
                        {pkg.badge}
                      </span>
                      {pkg.originalPrice && (
                        <span className="text-xs text-[#6E6A61] line-through">{pkg.originalPrice}</span>
                      )}
                    </div>

                    <div className="mt-2 flex items-baseline justify-between">
                      <h3 className="font-serif text-base font-bold text-[#1C1C17]">{pkg.name}</h3>
                      <span className="font-serif text-xl font-bold text-[#0B5D4F]">{pkg.price}</span>
                    </div>

                    <p className="text-xs font-medium text-[#D4AF37] mt-0.5">{pkg.functions}</p>

                    <div className="mt-3 pt-3 border-t border-[#EBE5DA] space-y-1.5">
                      {pkg.features.map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-start gap-2 text-xs text-[#4A4740]">
                          <CheckCircle2 className="h-4 w-4 text-[#0B5D4F] shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => setActiveModal("quote")}
                      className="mt-4 w-full py-3 rounded-xl bg-[#0B5D4F] text-white text-xs font-bold shadow-md hover:bg-[#08483d] transition-all active:scale-98 flex items-center justify-center gap-1.5"
                    >
                      Book Package ({pkg.price})
                      <Sparkles className="h-4 w-4 text-[#D4AF37]" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* 8. PORTFOLIO MASONRY GALLERY */}
            <div id="portfolio" className="px-4 mt-6">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h2 className="font-serif text-lg font-bold text-[#0B5D4F]">
                    Portfolio Gallery
                  </h2>
                  <p className="text-xs text-[#6E6A61]">Real brides, HD finishes & hair transformations</p>
                </div>
                <span className="text-xs text-[#6E6A61]">{filteredPortfolio.length} Looks</span>
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto hide-scrollbar pb-2">
                {[
                  { id: "all", label: "All Looks" },
                  { id: "bridal", label: "Bridal Red" },
                  { id: "engagement", label: "Engagement" },
                  { id: "reception", label: "Reception" },
                  { id: "south_indian", label: "South Indian" },
                  { id: "haldi", label: "Haldi" },
                  { id: "christian", label: "Christian" },
                  { id: "mehendi", label: "Mehendi" },
                  { id: "editorial", label: "Editorial" }
                ].map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setPortfolioCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                      portfolioCategory === cat.id
                        ? "bg-[#0B5D4F] text-white"
                        : "bg-[#FFFDF9] text-[#6E6A61] border border-[#EBE5DA]"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Masonry Layout Grid */}
              <div className="grid grid-cols-2 gap-2.5 mt-3">
                {filteredPortfolio.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setLightboxImage(item)}
                    className="relative rounded-2xl overflow-hidden shadow-sm group cursor-pointer border border-[#EBE5DA]"
                    style={{ height: item.id === "p1" || item.id === "p4" || item.id === "p8" ? "240px" : "190px" }}
                  >
                    <Image
                      src={item.url}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />

                    <div className="absolute bottom-2 left-2 right-2 text-white">
                      <span className="px-2 py-0.5 rounded-md bg-black/40 backdrop-blur-sm text-[9px] font-semibold text-[#D4AF37]">
                        {item.categoryLabel}
                      </span>
                      <h4 className="text-[11px] font-semibold line-clamp-1 mt-1">
                        {item.title}
                      </h4>
                      <div className="flex items-center justify-between text-[9px] text-white/80 mt-0.5">
                        <span className="flex items-center gap-1">
                          <Heart className="h-2.5 w-2.5 fill-[#D4AF37] text-[#D4AF37]" />
                          {item.likes}
                        </span>
                        <span className="underline">Zoom</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 9. VIDEO & REELS SECTION */}
            <div className="px-4 mt-6">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h2 className="font-serif text-lg font-bold text-[#0B5D4F]">
                    Video Reels & BTS
                  </h2>
                  <p className="text-xs text-[#6E6A61]">Watch live application & 14-hr wear tests</p>
                </div>
                <span className="text-xs text-[#D4AF37] font-semibold">Instagram Reels</span>
              </div>

              <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
                {videoItems.map((vid) => (
                  <div
                    key={vid.id}
                    onClick={() => setActiveVideo(vid)}
                    className="flex-shrink-0 w-44 h-72 relative rounded-2xl overflow-hidden border border-[#EBE5DA] shadow-sm cursor-pointer group"
                  >
                    <Image
                      src={vid.thumbnail}
                      alt={vid.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/20" />

                    {/* Play Icon */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-12 w-12 rounded-full bg-[#0B5D4F]/80 border border-[#D4AF37] flex items-center justify-center text-white backdrop-blur-md shadow-lg group-hover:scale-110 transition-transform">
                        <Play className="h-6 w-6 fill-white ml-0.5" />
                      </div>
                    </div>

                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/60 text-white text-[9px] font-bold">
                      {vid.duration}
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <h4 className="text-xs font-semibold line-clamp-2 leading-tight">
                        {vid.title}
                      </h4>
                      <div className="flex items-center justify-between text-[10px] text-white/80 mt-1.5">
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3 text-[#D4AF37]" />
                          {vid.views}
                        </span>
                        <span className="flex items-center gap-1">
                          <ThumbsUp className="h-3 w-3 text-[#D4AF37]" />
                          {vid.likes}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 10. REVIEWS SECTION */}
            <div id="reviews" className="px-4 mt-6">
              <div className="rounded-3xl p-5 bg-[#FFFDF9] border border-[#EBE5DA] shadow-sm">
                <div className="flex items-center justify-between border-b border-[#EBE5DA] pb-4 mb-4">
                  <div>
                    <h2 className="font-serif text-lg font-bold text-[#0B5D4F]">
                      Verified Bride Reviews
                    </h2>
                    <p className="text-xs text-[#6E6A61]">328 Ratings from authentic brides</p>
                  </div>
                  <button
                    onClick={() => setActiveModal("review_write")}
                    className="px-3 py-1.5 rounded-full bg-[#0B5D4F]/10 hover:bg-[#0B5D4F] text-[#0B5D4F] hover:text-white text-xs font-semibold transition-colors flex items-center gap-1"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Write Review
                  </button>
                </div>

                {/* Rating Overview Box */}
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#F8F6F2] border border-[#EBE5DA]">
                  <div className="text-center shrink-0 pr-2 border-r border-[#EBE5DA]">
                    <span className="font-serif text-3xl font-bold text-[#0B5D4F]">4.9</span>
                    <div className="flex items-center justify-center gap-0.5 text-[#D4AF37] my-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-current" />
                      ))}
                    </div>
                    <span className="text-[10px] text-[#6E6A61]">328 Reviews</span>
                  </div>

                  <div className="flex-1 space-y-1 text-[11px]">
                    <div className="flex items-center gap-2">
                      <span className="w-12 text-[#6E6A61]">5 Stars</span>
                      <div className="flex-1 h-1.5 rounded-full bg-[#EBE5DA] overflow-hidden">
                        <div className="h-full bg-[#0B5D4F] rounded-full" style={{ width: "93%" }} />
                      </div>
                      <span className="w-6 text-right font-medium text-[#1C1C17]">93%</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="w-12 text-[#6E6A61]">4 Stars</span>
                      <div className="flex-1 h-1.5 rounded-full bg-[#EBE5DA] overflow-hidden">
                        <div className="h-full bg-[#0B5D4F] rounded-full" style={{ width: "5%" }} />
                      </div>
                      <span className="w-6 text-right font-medium text-[#1C1C17]">5%</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="w-12 text-[#6E6A61]">3 Stars</span>
                      <div className="flex-1 h-1.5 rounded-full bg-[#EBE5DA] overflow-hidden">
                        <div className="h-full bg-[#0B5D4F] rounded-full" style={{ width: "2%" }} />
                      </div>
                      <span className="w-6 text-right font-medium text-[#1C1C17]">2%</span>
                    </div>
                  </div>
                </div>

                {/* Review Filters */}
                <div className="flex items-center gap-2 mt-4 overflow-x-auto hide-scrollbar pb-1">
                  {[
                    { id: "latest", label: "Latest" },
                    { id: "highest", label: "Highest Rated" },
                    { id: "photos", label: "With Photos Only" }
                  ].map(f => (
                    <button
                      key={f.id}
                      onClick={() => setReviewFilter(f.id as any)}
                      className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                        reviewFilter === f.id
                          ? "bg-[#0B5D4F] text-white"
                          : "bg-[#F8F6F2] text-[#6E6A61] border border-[#EBE5DA]"
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>

                {/* Reviews List */}
                <div className="mt-4 space-y-4">
                  {reviewsList.map((rev) => (
                    <div key={rev.id} className="p-4 rounded-2xl bg-[#FFFDF9] border border-[#EBE5DA] space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="relative h-9 w-9 rounded-full overflow-hidden border border-[#D4AF37]">
                            <Image src={rev.brideAvatar} alt={rev.brideName} fill className="object-cover" />
                          </div>
                          <div>
                            <div className="flex items-center gap-1">
                              <h4 className="text-xs font-bold text-[#1C1C17]">{rev.brideName}</h4>
                              <CheckCircle2 className="h-3.5 w-3.5 text-[#0B5D4F]" />
                            </div>
                            <span className="text-[10px] text-[#6E6A61]">{rev.eventType} • {rev.weddingDate}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-0.5 text-[#D4AF37]">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <Star key={i} className="h-3 w-3 fill-current" />
                          ))}
                        </div>
                      </div>

                      <p className="text-xs text-[#4A4740] leading-relaxed">
                        {rev.comment}
                      </p>

                      {/* Photo Attachments */}
                      {rev.photos.length > 0 && (
                        <div className="flex gap-2 pt-1">
                          {rev.photos.map((p, pIdx) => (
                            <div
                              key={pIdx}
                              onClick={() => setLightboxImage({ id: pIdx.toString(), url: p, title: `${rev.brideName}'s Bridal Look`, category: "bridal", categoryLabel: "Review Photo", likes: 45 })}
                              className="relative h-16 w-16 rounded-xl overflow-hidden border border-[#EBE5DA] cursor-pointer"
                            >
                              <Image src={p} alt="Review attachment" fill className="object-cover" />
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Vendor Reply */}
                      {rev.vendorReply && (
                        <div className="mt-2 p-2.5 rounded-xl bg-[#F8F6F2] border-l-2 border-[#0B5D4F] text-[11px] text-[#4A4740]">
                          <span className="font-bold text-[#0B5D4F] block mb-0.5">
                            Response from {artist.name}:
                          </span>
                          <p>{rev.vendorReply.message}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 11. AVAILABILITY CALENDAR */}
            <div className="px-4 mt-6">
              <div className="rounded-3xl p-5 bg-[#FFFDF9] border border-[#EBE5DA] shadow-sm">
                <div className="flex items-center justify-between border-b border-[#EBE5DA] pb-3 mb-3">
                  <div>
                    <h2 className="font-serif text-lg font-bold text-[#0B5D4F]">
                      2026 Season Availability
                    </h2>
                    <p className="text-xs text-[#6E6A61]">Select your wedding date to reserve</p>
                  </div>
                  <Calendar className="h-5 w-5 text-[#D4AF37]" />
                </div>

                <div className="flex items-center justify-between text-xs font-semibold text-[#1C1C17] mb-3">
                  <span>November 2026 Wedding Muhurtham</span>
                  <span className="text-[#0B5D4F]">Delhi NCR & Outstation</span>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1.5 text-center">
                  {calendarDates.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        if (item.status !== "booked") {
                          setSelectedDate(`2026-11-${item.day.split(" ")[0]}`);
                          setActiveModal("availability");
                        }
                      }}
                      disabled={item.status === "booked"}
                      className={`p-2 rounded-xl flex flex-col items-center justify-center transition-all ${
                        item.status === "available"
                          ? "bg-[#0B5D4F]/10 border border-[#0B5D4F]/30 hover:bg-[#0B5D4F] hover:text-white"
                          : item.status === "limited"
                          ? "bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#0B5D4F]"
                          : "bg-neutral-100 border border-neutral-200 text-neutral-400 cursor-not-allowed"
                      }`}
                    >
                      <span className="text-[10px] font-medium">{item.day}</span>
                      <span className="text-[9px] font-bold capitalize mt-0.5">
                        {item.status === "available" ? "Open" : item.status === "limited" ? "1 Left" : "Booked"}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="flex items-center justify-center gap-4 mt-4 text-[10px] text-[#6E6A61] border-t border-[#EBE5DA] pt-3">
                  <span className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-[#0B5D4F]" />
                    Slots Available
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-[#D4AF37]" />
                    Limited Slot
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-neutral-300" />
                    Fully Booked
                  </span>
                </div>
              </div>
            </div>

            {/* 12. FAQ ACCORDION SECTION */}
            <div id="faqs" className="px-4 mt-6">
              <div className="rounded-3xl p-5 bg-[#FFFDF9] border border-[#EBE5DA] shadow-sm">
                <div className="flex items-center justify-between border-b border-[#EBE5DA] pb-3 mb-3">
                  <h2 className="font-serif text-lg font-bold text-[#0B5D4F]">
                    Frequently Asked Questions
                  </h2>
                  <HelpCircle className="h-5 w-5 text-[#D4AF37]" />
                </div>

                <div className="space-y-2">
                  {faqsList.map((faq, i) => (
                    <div
                      key={i}
                      className="rounded-2xl border border-[#EBE5DA] overflow-hidden bg-[#F8F6F2]"
                    >
                      <button
                        onClick={() => setOpenFaqIndex(openFaqIndex === i ? null : i)}
                        className="w-full p-3.5 text-left flex items-center justify-between text-xs font-bold text-[#1C1C17] hover:text-[#0B5D4F] transition-colors"
                      >
                        <span className="pr-2">{faq.q}</span>
                        <ChevronDown className={`h-4 w-4 text-[#0B5D4F] transition-transform duration-300 ${openFaqIndex === i ? "rotate-180" : ""}`} />
                      </button>
                      {openFaqIndex === i && (
                        <div className="px-3.5 pb-3.5 text-xs text-[#4A4740] leading-relaxed border-t border-[#EBE5DA]/50 pt-2 bg-[#FFFDF9]">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 13. CONTACT & LOCATION SECTION */}
            <div id="contact" className="px-4 mt-6">
              <div className="rounded-3xl p-5 bg-[#FFFDF9] border border-[#EBE5DA] shadow-sm space-y-4">
                <h2 className="font-serif text-lg font-bold text-[#0B5D4F]">
                  Studio & Contact Details
                </h2>

                <div className="space-y-2.5 text-xs text-[#4A4740]">
                  <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-[#F8F6F2]">
                    <MapPin className="h-4 w-4 text-[#0B5D4F] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-[#1C1C17] block">Studio Address</span>
                      <span>DLF Phase 5, Golf Course Road, Gurgaon / South Delhi Studio</span>
                      <a
                        href="https://maps.google.com"
                        target="_blank"
                        rel="noreferrer"
                        className="mt-1 flex items-center gap-1 text-[11px] font-bold text-[#0B5D4F] underline"
                      >
                        Open in Google Maps
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href={formatTelUri(artist.phone || "9876543210")}
                      className="p-3 rounded-2xl bg-[#F8F6F2] flex items-center gap-2 text-[#1C1C17] font-semibold hover:bg-[#0B5D4F] hover:text-white transition-colors"
                    >
                      <Phone className="h-4 w-4 text-[#0B5D4F]" />
                      <span>{artist.phone || "+91 98765 43210"}</span>
                    </a>

                    <a
                      href={`mailto:${artist.email || "info@cloche.luxury"}`}
                      className="p-3 rounded-2xl bg-[#F8F6F2] flex items-center gap-2 text-[#1C1C17] font-semibold hover:bg-[#0B5D4F] hover:text-white transition-colors overflow-hidden"
                    >
                      <Mail className="h-4 w-4 text-[#0B5D4F] shrink-0" />
                      <span className="truncate">{artist.email || "info@artist.com"}</span>
                    </a>
                  </div>
                </div>

                {/* Social Channels */}
                <div className="pt-3 border-t border-[#EBE5DA]">
                  <span className="text-[11px] font-bold text-[#6E6A61] uppercase tracking-wider block mb-2">Connect on Socials</span>
                  <div className="flex items-center gap-3">
                    <a href="https://instagram.com" target="_blank" rel="noreferrer" className="h-10 w-10 rounded-full bg-[#0B5D4F]/10 flex items-center justify-center text-[#0B5D4F] hover:bg-[#0B5D4F] hover:text-white transition-colors">
                      <InstagramIcon />
                    </a>
                    <a href="https://youtube.com" target="_blank" rel="noreferrer" className="h-10 w-10 rounded-full bg-[#0B5D4F]/10 flex items-center justify-center text-[#0B5D4F] hover:bg-[#0B5D4F] hover:text-white transition-colors">
                      <YoutubeIcon />
                    </a>
                    <a href="https://wa.me" target="_blank" rel="noreferrer" className="h-10 w-10 rounded-full bg-[#0B5D4F]/10 flex items-center justify-center text-[#0B5D4F] hover:bg-[#0B5D4F] hover:text-white transition-colors">
                      <WhatsAppIcon />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* 14. TRUST & BADGES */}
            <div className="px-4 mt-6">
              <div className="p-4 rounded-3xl bg-[#0B5D4F] text-white border border-[#D4AF37]/30 shadow-md">
                <div className="flex items-center gap-2 mb-3">
                  <ShieldCheck className="h-5 w-5 text-[#D4AF37]" />
                  <h3 className="font-serif text-sm font-bold tracking-wide">Cloche Trust & Security Assured</h3>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="flex items-center gap-1.5 bg-white/10 p-2 rounded-xl">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#D4AF37]" />
                    <span>Identity Verified</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-white/10 p-2 rounded-xl">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#D4AF37]" />
                    <span>GST Business Verified</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-white/10 p-2 rounded-xl">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#D4AF37]" />
                    <span>Payment Protected</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-white/10 p-2 rounded-xl">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#D4AF37]" />
                    <span>100% Response Rate</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 15. SIMILAR ARTISTS CAROUSEL */}
            <div className="px-4 mt-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-serif text-base font-bold text-[#0B5D4F]">
                  Explore Similar Artists
                </h2>
                <Link href="/makeup" className="text-xs font-semibold text-[#D4AF37] hover:underline">
                  View All
                </Link>
              </div>

              <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
                {similarArtists.map((sim, i) => (
                  <Link
                    key={i}
                    href="/makeup"
                    className="flex-shrink-0 w-40 rounded-2xl overflow-hidden bg-[#FFFDF9] border border-[#EBE5DA] shadow-sm hover:border-[#0B5D4F] transition-all group"
                  >
                    <div className="relative h-28 w-full">
                      <Image src={sim.image} alt={sim.name} fill className="object-cover group-hover:scale-105 transition-transform" />
                    </div>
                    <div className="p-2.5">
                      <h4 className="text-xs font-bold text-[#1C1C17] truncate">{sim.name}</h4>
                      <div className="flex items-center gap-1 text-[10px] text-[#6E6A61] mt-0.5">
                        <Star className="h-3 w-3 fill-[#D4AF37] text-[#D4AF37]" />
                        <span>{sim.rating}</span>
                        <span>({sim.reviews})</span>
                      </div>
                      <span className="block text-[11px] font-bold text-[#0B5D4F] mt-1">{sim.price} onwards</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* 16. FINAL CTA BANNER */}
            <div className="px-4 mt-6">
              <div className="rounded-3xl p-6 bg-gradient-to-br from-[#0B5D4F] to-[#073D34] text-white border border-[#D4AF37]/40 shadow-xl text-center space-y-3">
                <Sparkles className="h-8 w-8 text-[#D4AF37] mx-auto animate-pulse" />
                <h2 className="font-serif text-xl font-bold tracking-tight">
                  Ready to Book Your Dream Bridal Look?
                </h2>
                <p className="text-xs text-[#F8F6F2]/90 max-w-xs mx-auto">
                  Wedding season slots for 2026 are filling up fast. Get a custom price quote or block your date today!
                </p>

                <div className="flex flex-col gap-2 pt-2">
                  <button
                    onClick={() => setActiveModal("quote")}
                    className="w-full py-3 rounded-xl bg-[#D4AF37] text-[#0B5D4F] font-bold text-xs shadow-lg hover:bg-yellow-400 transition-colors"
                  >
                    Get Free Customized Quote
                  </button>
                  <a
                    href={`https://wa.me/${artist.phone || "9876543210"}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2.5 rounded-xl bg-white/10 border border-white/20 text-white font-semibold text-xs hover:bg-white/20 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <WhatsAppIcon className="h-4 w-4 text-[#25D366]" />
                    Chat directly on WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </>
        )}

        {/* STICKY BOTTOM ACTION FLOATING BAR */}
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#FFFDF9]/95 backdrop-blur-md border-t border-[#EBE5DA] p-3 shadow-2xl">
          <div className={`mx-auto flex items-center justify-between gap-2 ${viewMode === "mobile" ? "max-w-[400px]" : "max-w-md"}`}>
            <div className="flex flex-col pl-1">
              <span className="text-[10px] text-[#6E6A61] uppercase tracking-wider">Starting Price</span>
              <span className="font-serif text-base font-bold text-[#0B5D4F]">₹25,000</span>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={`https://wa.me/${artist.phone || "9876543210"}`}
                target="_blank"
                rel="noreferrer"
                className="h-11 px-3 rounded-xl bg-[#25D366]/10 text-[#25D366] font-bold text-xs flex items-center gap-1 hover:bg-[#25D366] hover:text-white transition-colors"
              >
                <WhatsAppIcon className="h-4 w-4" />
                <span className="hidden sm:inline">WhatsApp</span>
              </a>

              <button
                onClick={() => setActiveModal("availability")}
                className="h-11 px-4 rounded-xl bg-[#0B5D4F] text-white font-bold text-xs shadow-md hover:bg-[#08483d] transition-all flex items-center gap-1.5 active:scale-95"
              >
                <Calendar className="h-4 w-4 text-[#D4AF37]" />
                Check Availability
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* MODALS */}

      {/* 1. Lightbox Image Gallery Modal */}
      {lightboxImage && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col justify-between p-4 animate-fade-in">
          <div className="flex items-center justify-between text-white pt-2">
            <div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#D4AF37] text-[#0B5D4F] text-[10px] font-bold">
                {lightboxImage.categoryLabel}
              </span>
              <h3 className="font-serif text-sm font-bold mt-1">{lightboxImage.title}</h3>
            </div>
            <button onClick={() => setLightboxImage(null)} className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-white">
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="relative w-full h-[60vh] max-w-lg mx-auto">
            <Image src={lightboxImage.url} alt={lightboxImage.title} fill className="object-contain" />
          </div>

          <div className="max-w-lg mx-auto w-full bg-white/10 backdrop-blur-md p-4 rounded-2xl text-white text-xs space-y-2 border border-white/20 mb-4">
            {lightboxImage.lipShade && (
              <div>
                <span className="text-[#D4AF37] font-bold block">Lip Combo Used:</span>
                <span>{lightboxImage.lipShade}</span>
              </div>
            )}
            {lightboxImage.technique && (
              <div>
                <span className="text-[#D4AF37] font-bold block">Base & Eye Technique:</span>
                <span>{lightboxImage.technique}</span>
              </div>
            )}
            <div className="flex items-center justify-between pt-2 border-t border-white/10">
              <span className="flex items-center gap-1">
                <Heart className="h-4 w-4 fill-[#D4AF37] text-[#D4AF37]" />
                {lightboxImage.likes} Brides loved this look
              </span>
              <button
                onClick={() => {
                  showToast("Look saved to your Inspiration Board!");
                  setLightboxImage(null);
                }}
                className="px-4 py-1.5 rounded-full bg-[#D4AF37] text-[#0B5D4F] font-bold text-xs"
              >
                Save Look
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Video Reel Player Modal */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 animate-fade-in">
          <div className="flex items-center justify-between text-white pt-2">
            <h3 className="font-serif text-sm font-bold">{activeVideo.title}</h3>
            <button onClick={() => setActiveVideo(null)} className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-white">
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="relative w-full max-w-xs h-[70vh] mx-auto rounded-3xl overflow-hidden border border-white/20 shadow-2xl">
            <Image src={activeVideo.thumbnail} alt={activeVideo.title} fill className="object-cover" />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <div className="h-16 w-16 rounded-full bg-[#0B5D4F] border-2 border-[#D4AF37] flex items-center justify-center text-white">
                <Play className="h-8 w-8 fill-white ml-1 animate-pulse" />
              </div>
            </div>
          </div>

          <div className="max-w-xs mx-auto w-full text-center text-white text-xs pb-4">
            <p className="text-white/80">{activeVideo.views} views • {activeVideo.likes} likes</p>
          </div>
        </div>
      )}

      {/* 3. Availability Calendar Modal */}
      {activeModal === "availability" && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full max-w-md bg-[#FFFDF9] rounded-t-3xl sm:rounded-3xl p-6 space-y-4 border border-[#EBE5DA] animate-slide-up shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#EBE5DA] pb-3">
              <h3 className="font-serif text-lg font-bold text-[#0B5D4F]">Check Wedding Date Availability</h3>
              <button onClick={() => setActiveModal(null)} className="p-1 text-[#6E6A61] hover:text-black">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#1C1C17] mb-1">Select Preferred Wedding / Function Date</label>
                <input
                  type="date"
                  value={selectedDate || "2026-11-18"}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full p-3 rounded-xl border border-[#EBE5DA] bg-[#F8F6F2] text-[#1C1C17] font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-[#1C1C17] mb-1">Function Type</label>
                <select className="w-full p-3 rounded-xl border border-[#EBE5DA] bg-[#F8F6F2] text-[#1C1C17] font-semibold">
                  <option>Bridal Wedding Day HD Makeup</option>
                  <option>4K Airbrush Bridal Experience</option>
                  <option>Sangeet & Engagement Glam</option>
                  <option>Reception Evening Look</option>
                  <option>Multi-day Destination Wedding</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#1C1C17] mb-1">Wedding City / Venue</label>
                <input
                  type="text"
                  placeholder="e.g. Leela Palace Udaipur / South Delhi"
                  className="w-full p-3 rounded-xl border border-[#EBE5DA] bg-[#F8F6F2]"
                />
              </div>

              <div className="p-3 rounded-xl bg-[#0B5D4F]/10 border border-[#0B5D4F]/20 text-[#0B5D4F] flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-[#D4AF37] shrink-0" />
                <span>Date <strong>{selectedDate}</strong> is currently <strong>AVAILABLE</strong> for booking!</span>
              </div>
            </div>

            <button
              onClick={() => {
                setActiveModal(null);
                showToast("Availability request sent! Artist team will WhatsApp you within 30 mins.");
              }}
              className="w-full py-3.5 rounded-xl bg-[#0B5D4F] text-white font-bold text-xs shadow-md hover:bg-[#08483d]"
            >
              Confirm Date Inquiry
            </button>
          </div>
        </div>
      )}

      {/* 4. Get Custom Quote Modal */}
      {activeModal === "quote" && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full max-w-md bg-[#FFFDF9] rounded-t-3xl sm:rounded-3xl p-6 space-y-4 border border-[#EBE5DA] animate-slide-up shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#EBE5DA] pb-3">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#0B5D4F]">Request Customized Price Quote</h3>
                <span className="text-[10px] text-[#6E6A61]">Step {quoteStep} of 2</span>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-1 text-[#6E6A61]">
                <X className="h-5 w-5" />
              </button>
            </div>

            {quoteStep === 1 ? (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-[#1C1C17] mb-1">Your Full Name</label>
                  <input
                    type="text"
                    placeholder="Enter bride's name"
                    value={quoteData.name}
                    onChange={(e) => setQuoteData({ ...quoteData, name: e.target.value })}
                    className="w-full p-3 rounded-xl border border-[#EBE5DA] bg-[#F8F6F2]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#1C1C17] mb-1">WhatsApp Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={quoteData.phone}
                    onChange={(e) => setQuoteData({ ...quoteData, phone: e.target.value })}
                    className="w-full p-3 rounded-xl border border-[#EBE5DA] bg-[#F8F6F2]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#1C1C17] mb-1">Target Wedding Date</label>
                  <input
                    type="date"
                    value={quoteData.eventDate}
                    onChange={(e) => setQuoteData({ ...quoteData, eventDate: e.target.value })}
                    className="w-full p-3 rounded-xl border border-[#EBE5DA] bg-[#F8F6F2]"
                  />
                </div>

                <button
                  onClick={() => setQuoteStep(2)}
                  className="w-full py-3.5 rounded-xl bg-[#0B5D4F] text-white font-bold text-xs shadow-md mt-2"
                >
                  Next: Event & Guest Details
                </button>
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-[#1C1C17] mb-1">Number of Bridesmaids / Family Members</label>
                  <select
                    value={quoteData.guestCount}
                    onChange={(e) => setQuoteData({ ...quoteData, guestCount: e.target.value })}
                    className="w-full p-3 rounded-xl border border-[#EBE5DA] bg-[#F8F6F2]"
                  >
                    <option>Bride Only</option>
                    <option>Bride + 2 Family Members</option>
                    <option>Bride + 5 Family Members</option>
                    <option>Bride + 10+ Guests (Full Bridal Party)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#1C1C17] mb-1">Special Requirements / Notes</label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Airbrush preferred, hair extensions needed, trial session request..."
                    value={quoteData.notes}
                    onChange={(e) => setQuoteData({ ...quoteData, notes: e.target.value })}
                    className="w-full p-3 rounded-xl border border-[#EBE5DA] bg-[#F8F6F2]"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => setQuoteStep(1)}
                    className="w-1/3 py-3 rounded-xl bg-[#F8F6F2] border border-[#EBE5DA] font-bold text-[#6E6A61]"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => {
                      setActiveModal(null);
                      setQuoteStep(1);
                      showToast("Quote Request Submitted! Check your WhatsApp for custom invoice details.");
                    }}
                    className="w-2/3 py-3 rounded-xl bg-[#0B5D4F] text-white font-bold shadow-md hover:bg-[#08483d]"
                  >
                    Submit Quote Request
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. Share Profile Modal */}
      {activeModal === "share" && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#FFFDF9] rounded-3xl p-6 space-y-4 border border-[#EBE5DA] shadow-2xl text-center">
            <div className="flex justify-between items-center border-b border-[#EBE5DA] pb-3">
              <h3 className="font-serif text-base font-bold text-[#0B5D4F]">Share Artist Profile</h3>
              <button onClick={() => setActiveModal(null)}>
                <X className="h-5 w-5 text-[#6E6A61]" />
              </button>
            </div>

            <div className="p-3 rounded-2xl bg-[#F8F6F2] flex items-center justify-between border border-[#EBE5DA]">
              <span className="text-xs text-[#1C1C17] truncate max-w-[200px]">https://cloche.luxury/makeup/{artist.id}</span>
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(`https://cloche.luxury/makeup/${artist.id}`);
                  showToast("Profile link copied to clipboard!");
                  setActiveModal(null);
                }}
                className="px-3 py-1 rounded-lg bg-[#0B5D4F] text-white text-xs font-bold flex items-center gap-1"
              >
                <Copy className="h-3 w-3" />
                Copy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Write Review Modal */}
      {activeModal === "review_write" && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#FFFDF9] rounded-3xl p-6 space-y-4 border border-[#EBE5DA] shadow-2xl">
            <div className="flex justify-between items-center border-b border-[#EBE5DA] pb-3">
              <h3 className="font-serif text-base font-bold text-[#0B5D4F]">Write a Verified Bride Review</h3>
              <button onClick={() => setActiveModal(null)}>
                <X className="h-5 w-5 text-[#6E6A61]" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#1C1C17] mb-1">Select Star Rating</label>
                <div className="flex items-center gap-2 text-[#D4AF37]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-6 w-6 fill-current cursor-pointer hover:scale-110 transition-transform" />
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#1C1C17] mb-1">Your Wedding Date & Function</label>
                <input type="text" placeholder="e.g. Sangeet - Nov 2026" className="w-full p-3 rounded-xl border border-[#EBE5DA] bg-[#F8F6F2]" />
              </div>

              <div>
                <label className="block font-bold text-[#1C1C17] mb-1">Your Review Feedback</label>
                <textarea rows={3} placeholder="Describe your experience, makeup finish, artist behavior..." className="w-full p-3 rounded-xl border border-[#EBE5DA] bg-[#F8F6F2]" />
              </div>

              <button
                onClick={() => {
                  setActiveModal(null);
                  showToast("Thank you! Your review has been submitted for verification.");
                }}
                className="w-full py-3.5 rounded-xl bg-[#0B5D4F] text-white font-bold shadow-md hover:bg-[#08483d]"
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
