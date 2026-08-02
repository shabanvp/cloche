"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  Star,
  MapPin,
  Phone,
  MessageSquare,
  Share2,
  Heart,
  CheckCircle2,
  Camera,
  Film,
  Award,
  Clock,
  UserCheck,
  Play,
  Sparkles,
  Globe,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  ThumbsUp,
  Calendar,
  Check,
  Send,
} from "lucide-react";
import { BottomNavBar } from "@/components/BottomNavBar";
import { VendorDetail } from "@/lib/vendorLists";
import { formatTelUri } from "@/lib/formatters";

export function PhotographerDetailClient({ photographer }: { photographer: VendorDetail }) {
  const [activeTab, setActiveTab] = useState<"about" | "portfolio" | "packages" | "reviews" | "info">("about");
  const [portfolioCategory, setPortfolioCategory] = useState<string>("all");
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);

  const getInitials = (name: string) => {
    if (name.includes("Wedding Frames")) return "WF";
    if (name.includes("Candid Shutters")) return "CS";
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  // Dynamic calculations / specs based on photographer profile
  const studioName = photographer.name;
  const location = photographer.location;
  const yearsExp = (photographer as any).yearsInBusiness || 8;
  const weddingsCount = (photographer as any).weddingsCovered || 350;
  const teamSize = (photographer as any).teamSize || "6 Senior Photographers & Cinematographers";
  const responseTime = "< 30 Minutes";

  // Photography styles list
  const photoStyles = [
    "Candid Photography",
    "Cinematic Wedding Films",
    "Documentary Storytelling",
    "Fine Art & Editorial",
    "Traditional Portraiture",
    "Drone Aerial Photography",
    "Pre-Wedding & Engagement",
  ];

  // Camera Gear
  const cameraGear = [
    "Sony FX3 & A7IV Cinema Bodies",
    "Canon EOS R5 Full-Frame",
    "DJI Mavic 3 Cine 5.1K Drone",
    "G-Master 24-70mm & 85mm f/1.4 Lenses",
    "Godox AD600 Pro Wireless Lighting",
    "DJI RS3 Pro Gimbal Stabilizers",
  ];

  // Services & Packages
  const packagesList = [
    {
      title: "Essential Photography Package",
      price: "₹55,000",
      description: "Ideal for 1-day wedding or engagement ceremonies.",
      features: [
        "1 Senior Candid Photographer",
        "1 Traditional Photographer",
        "200 High-Res Edited Digital Photos",
        "All Raw Images Delivered on USB",
        "Online Private Client Gallery",
      ],
    },
    {
      title: "Signature 2-Day Wedding & Film Package (Most Popular)",
      price: "₹1,15,000",
      popular: true,
      description: "Full coverage of Mehendi/Haldi, Wedding, and Grand Reception.",
      features: [
        "2 Senior Candid Photographers",
        "2 Cinematographers (4K Cinema Coverage)",
        "DJI Drone Aerial Shots",
        "3-4 Min Cinematic Teaser & Full Feature Film",
        "300 Premium Edited Photos",
        "1 Luxury Hardcover Flush-Mount Album (40 Pages)",
      ],
    },
    {
      title: "Royal Destination Full-Suite Coverage",
      price: "₹1,85,000",
      description: "End-to-end multi-day destination wedding coverage.",
      features: [
        "Full 6-Member Crew (Photo + Video + Drone)",
        "Pre-Wedding Couple Shoot with Styling",
        "Same-Day Edit Teaser Video for Reception",
        "4K Ultra-HD Feature Film + Instagram Reels",
        "2 Premium Hardcover Albums + Parent Albums",
        "Worldwide Destination Travel Included Options",
      ],
    },
  ];

  // Expanded Portfolio Albums
  const portfolioAlbums = [
    {
      title: "Royal Palace Wedding Story",
      category: "featured",
      tag: "Featured Wedding",
      images: [
        photographer.images[0] || photographer.image,
        photographer.images[1] || photographer.image,
        photographer.images[2] || photographer.image,
      ],
    },
    {
      title: "Bridal Portraits & Lehengas",
      category: "bride",
      tag: "Bride Portraits",
      images: [
        photographer.images[1] || photographer.image,
        photographer.images[2] || photographer.image,
      ],
    },
    {
      title: "Romantic Sunset Couple Shoot",
      category: "couple",
      tag: "Couple Shoot",
      images: [
        photographer.images[2] || photographer.image,
        photographer.images[0] || photographer.image,
      ],
    },
    {
      title: "Aerial Drone Venue Shots",
      category: "drone",
      tag: "Drone Photography",
      images: [
        photographer.images[0] || photographer.image,
        photographer.images[1] || photographer.image,
      ],
    },
  ];

  // Customer Reviews List
  const clientReviews = [
    {
      author: "Anjali & Rahul S.",
      location: "Trivandrum, Kerala",
      date: "Dec 2025",
      rating: 5,
      verified: true,
      text: `${studioName} captured our wedding day with pure magic! Their candid shots felt completely natural, and the cinematic teaser made our whole family tear up. Extremely punctual and humble team!`,
      reply: `Thank you so much Anjali & Rahul! It was an absolute honor capturing your special day. Wishing you a lifetime of joy! — ${studioName} Team`,
    },
    {
      author: "Dr. Nitya & Siddharth M.",
      location: "Kochi, Kerala",
      date: "Nov 2025",
      rating: 5,
      verified: true,
      text: "Hands down the best decision we made for our wedding! The drone footage of our beach venue was breathtaking, and the hardcover album quality is top-tier luxury.",
      reply: `Warm thanks Dr. Nitya & Siddharth! You two were amazing to work with.`,
    },
    {
      author: "Priya & Vikram K.",
      location: "Bangalore, India",
      date: "Oct 2025",
      rating: 5,
      verified: true,
      text: "From pre-wedding shoot in Munnar to our grand reception, their team managed everything seamlessly. Their lighting and editing style is world-class.",
      reply: null,
    },
  ];

  // FAQs
  const faqs = [
    {
      q: "Do you travel for destination weddings outside Kerala?",
      a: "Yes! Our team regularly travels across India and abroad for destination weddings. Travel and lodging arrangements are either managed by the client or included in custom destination packages.",
    },
    {
      q: "What is your album delivery timeline?",
      a: "We deliver high-resolution digital edited photos within 3 to 4 weeks. Hardcover physical photo albums and full 4K wedding films are delivered within 6 to 8 weeks after photo selection.",
    },
    {
      q: "Do you provide drone photography & cinematic 4K videography?",
      a: "Yes, we use licensed 5.1K DJI drones and 4K cinema bodies (Sony FX3) to capture high-framerate cinematic wedding films and aerial shots.",
    },
    {
      q: "What is the booking advance and payment schedule?",
      a: "We require a 25% advance to lock your date. 50% is due on the event date, and the remaining 25% is payable upon delivery of your physical photo album and video drive.",
    },
    {
      q: "Do we get raw, unedited photos?",
      a: "Yes! We provide all original unedited RAW photos on a high-speed USB drive along with your color-graded highlight gallery.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col pb-36 bg-[#F8F5F0] text-[#2D2520] font-sans">
      {/* ─── VENUE-STYLE COMPACT 2-COLUMN LAYOUT ON DESKTOP ─── */}
      <div className="max-w-4xl mx-auto w-full px-4 pt-4 md:pt-6">
        <div className="flex flex-col md:grid md:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* Left Column: Cover Gallery Image */}
          <div className="w-full md:col-span-7 space-y-4">
            <div className="relative w-full h-[220px] sm:h-[280px] md:h-[360px] lg:h-[380px] md:rounded-3xl overflow-hidden shadow-md border border-[#E8DFC5]/80 bg-gray-900">
              <Image src={photographer.images[0] || photographer.image} alt={photographer.name} fill priority className="object-cover object-center" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

              <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                <Link
                  href="/photographers"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition-transform active:scale-95"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Link>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition-transform active:scale-95"
                  >
                    <Heart className={`h-5 w-5 ${isWishlisted ? "fill-rose-500 text-rose-500" : "text-white"}`} />
                  </button>
                  <button
                    onClick={() => {
                      if (navigator.share) navigator.share({ title: photographer.name, url: window.location.href });
                    }}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md"
                  >
                    <Share2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs font-medium z-10">
                <span className="bg-black/50 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1.5 border border-white/20">
                  <Camera className="w-3.5 h-3.5 text-[#C8A96A]" /> Certified Studio
                </span>
                <span className="bg-black/50 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                  1 / {photographer.images?.length || 1}
                </span>
              </div>
            </div>

            {/* Gallery Thumbnails Strip */}
            {photographer.images && photographer.images.length > 1 && (
              <div className="hidden sm:grid grid-cols-4 gap-2.5">
                {photographer.images.slice(0, 4).map((img, i) => (
                  <div
                    key={i}
                    onClick={() => setLightboxImg(img)}
                    className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-[#E2D6C7] bg-[#EFE8DE] shadow-xs cursor-pointer hover:opacity-90 transition-opacity"
                  >
                    <Image src={img} alt={`Gallery ${i + 1}`} fill className="object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Sticky Information & Action Card */}
          <div className="w-full md:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-[#E8DFC5]/80 shadow-md space-y-5 md:sticky md:top-24">
            
            {/* Header Row */}
            <div className="flex items-start justify-between gap-3 border-b border-[#F2EBE1] pb-4">
              <div className="flex items-center gap-3.5">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-[#0F4C45] text-[#C8A96A] font-serif font-bold text-xl shadow-md border-2 border-white shrink-0">
                  {getInitials(photographer.name)}
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <h1 className="font-serif text-xl sm:text-2xl font-bold text-[#0F4C45]">
                      {photographer.name}
                    </h1>
                    <CheckCircle2 className="h-4 w-4 text-[#C8A96A] shrink-0 fill-[#C8A96A]/20" />
                  </div>

                  <p className="text-xs text-[#7A6E65] flex items-center gap-1 mt-0.5">
                    <MapPin className="h-3.5 w-3.5 text-[#0F4C45] shrink-0" />
                    <span>{photographer.location}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 bg-[#C8A96A]/10 px-2.5 py-1 rounded-full text-xs font-bold text-[#1A1410] shrink-0">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span>{photographer.rating}</span>
                <span className="text-[#7A6E65] font-normal">({photographer.reviews})</span>
              </div>
            </div>

            {/* Business Badges & Stats Bar */}
            <div className="p-3.5 rounded-2xl bg-[#F8F5F0] border border-[#E2D6C7]/60 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[10px] uppercase font-bold text-[#7A6E65]">Category</span>
                <span className="font-bold text-[#0F4C45]">Wedding Photography</span>
              </div>

              <div className="flex items-center justify-between text-xs pt-1 border-t border-[#E2D6C7]/40">
                <span className="text-[10px] uppercase font-bold text-[#7A6E65]">Response Time</span>
                <span className="font-bold text-emerald-700">{responseTime}</span>
              </div>

              <div className="flex items-center justify-between text-xs pt-1 border-t border-[#E2D6C7]/40">
                <span className="text-[10px] uppercase font-bold text-[#7A6E65]">Recommendation</span>
                <span className="font-bold text-[#0F4C45]">98% Couples</span>
              </div>
            </div>

            {/* Calling & Messaging Buttons in Right Column Card */}
            <div className="space-y-2.5 pt-1">
              <a
                href={formatTelUri(photographer.phone || "+919847055443")}
                className="w-full flex items-center justify-center gap-2 rounded-xl py-3 bg-[#0F4C45] text-white text-xs uppercase tracking-wider font-bold shadow-md hover:bg-[#12584E] transition-colors"
              >
                <Phone className="h-4 w-4" /> Call Studio Direct
              </a>

              <a
                href={`https://wa.me/${(photographer.phone || "919847055443").replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 rounded-xl py-3 bg-[#25D366] text-white text-xs uppercase tracking-wider font-bold shadow-md hover:bg-[#20ba59] transition-colors"
              >
                <MessageSquare className="h-4 w-4" /> Send WhatsApp Message
              </a>
            </div>
          </div>
        </div>

        {/* ─── RICH PROFILE TABS SECTION ─── */}
        <div className="mt-8">
          <div className="flex gap-2 border-b border-[#E2D6C7] text-xs font-semibold overflow-x-auto scrollbar-none">
            {[
              { id: "about", label: "About Studio" },
              { id: "portfolio", label: `Portfolio (${photographer.images?.length || 4})` },
              { id: "packages", label: "Pricing & Packages" },
              { id: "reviews", label: `Reviews (${photographer.reviews})` },
              { id: "info", label: "Contact & Location" },
            ].map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-3 px-4 border-b-2 transition-all shrink-0 cursor-pointer ${
                    active ? "border-[#0F4C45] text-[#0F4C45] font-bold" : "border-transparent text-[#7A6E65]"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="pt-5 space-y-6">
            
            {/* ─── ABOUT TAB ─── */}
            {activeTab === "about" && (
              <div className="space-y-6">
                
                {/* About Intro Card */}
                <div className="rounded-2xl p-5 sm:p-6 bg-white border border-[#E8DFC5]/80 shadow-2xs space-y-3">
                  <h2 className="font-serif font-bold text-lg text-[#0F4C45]">About {studioName}</h2>
                  <p className="text-xs sm:text-sm text-[#5A6561] leading-relaxed font-sans">
                    {photographer.about}
                  </p>
                  <p className="text-xs text-[#5A6561] leading-relaxed font-sans pt-1">
                    With over {yearsExp} years of wedding photography experience, our team specializes in capturing timeless, emotion-rich moments. We blend candid storytelling with cinematic flair to ensure your special day is preserved in heirloom-quality visuals.
                  </p>
                </div>

                {/* Key Studio Highlights Counter Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="p-4 rounded-2xl bg-white border border-[#E8DFC5]/80 shadow-2xs space-y-1">
                    <Clock className="w-5 h-5 text-[#0F4C45] mx-auto" />
                    <span className="font-serif font-bold text-lg text-[#1A1410] block">{yearsExp}+ Years</span>
                    <span className="text-[10px] text-[#7A6E65] uppercase font-semibold block">In Industry</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-white border border-[#E8DFC5]/80 shadow-2xs space-y-1">
                    <Camera className="w-5 h-5 text-[#C8A96A] mx-auto" />
                    <span className="font-serif font-bold text-lg text-[#1A1410] block">{weddingsCount}+</span>
                    <span className="text-[10px] text-[#7A6E65] uppercase font-semibold block">Weddings Covered</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-white border border-[#E8DFC5]/80 shadow-2xs space-y-1">
                    <ThumbsUp className="w-5 h-5 text-emerald-600 mx-auto" />
                    <span className="font-serif font-bold text-lg text-[#1A1410] block">98%</span>
                    <span className="text-[10px] text-[#7A6E65] uppercase font-semibold block">Happy Couples</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-white border border-[#E8DFC5]/80 shadow-2xs space-y-1">
                    <Award className="w-5 h-5 text-amber-500 mx-auto" />
                    <span className="font-serif font-bold text-lg text-[#1A1410] block">Top Rated</span>
                    <span className="text-[10px] text-[#7A6E65] uppercase font-semibold block">Featured Studio</span>
                  </div>
                </div>

                {/* Photography & Videography Styles Offered */}
                <div className="rounded-2xl p-5 sm:p-6 bg-white border border-[#E8DFC5]/80 shadow-2xs space-y-3">
                  <h3 className="font-serif font-bold text-sm text-[#1A1410] flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#C8A96A]" /> Photography & Videography Styles Offered
                  </h3>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {photoStyles.map((style, idx) => (
                      <span
                        key={idx}
                        className="bg-[#0F4C45]/10 text-[#0F4C45] font-semibold text-xs px-3 py-1.5 rounded-full border border-[#0F4C45]/20 flex items-center gap-1.5"
                      >
                        <Check className="w-3.5 h-3.5 text-[#0F4C45]" /> {style}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Gear & Camera Equipment */}
                <div className="rounded-2xl p-5 sm:p-6 bg-white border border-[#E8DFC5]/80 shadow-2xs space-y-3">
                  <h3 className="font-serif font-bold text-sm text-[#1A1410] flex items-center gap-2">
                    <Camera className="w-4 h-4 text-[#0F4C45]" /> Professional Camera Gear & Equipment
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-xs text-[#5A6561]">
                    {cameraGear.map((gear, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-2 rounded-xl bg-[#F8F5F0] border border-[#E2D6C7]/60">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#C8A96A] shrink-0" />
                        <span>{gear}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Studio Policies & Process */}
                <div className="rounded-2xl p-5 sm:p-6 bg-white border border-[#E8DFC5]/80 shadow-2xs space-y-4">
                  <h3 className="font-serif font-bold text-sm text-[#1A1410] flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" /> Booking Process & Policies
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-[#F8F5F0] space-y-1">
                      <span className="font-bold text-[#0F4C45] block">1. Booking Advance</span>
                      <span className="text-[#7A6E65]">25% advance to lock your date.</span>
                    </div>

                    <div className="p-3 rounded-xl bg-[#F8F5F0] space-y-1">
                      <span className="font-bold text-[#0F4C45] block">2. Album Delivery</span>
                      <span className="text-[#7A6E65]">Edits in 3-4 weeks, album in 6 weeks.</span>
                    </div>

                    <div className="p-3 rounded-xl bg-[#F8F5F0] space-y-1">
                      <span className="font-bold text-[#0F4C45] block">3. Travel & Stay</span>
                      <span className="text-[#7A6E65]">Destination travel options available.</span>
                    </div>
                  </div>
                </div>

                {/* FAQs Accordion */}
                <div className="rounded-2xl p-5 sm:p-6 bg-white border border-[#E8DFC5]/80 shadow-2xs space-y-4">
                  <h3 className="font-serif font-bold text-sm text-[#1A1410]">Frequently Asked Questions</h3>

                  <div className="space-y-2.5">
                    {faqs.map((faq, idx) => {
                      const isOpen = openFaq === idx;
                      return (
                        <div key={idx} className="border border-[#E2D6C7]/60 rounded-xl overflow-hidden">
                          <button
                            onClick={() => setOpenFaq(isOpen ? null : idx)}
                            className="w-full p-3.5 bg-[#F8F5F0] text-left text-xs font-bold text-[#1A1410] flex items-center justify-between gap-2"
                          >
                            <span>{faq.q}</span>
                            {isOpen ? <ChevronUp className="w-4 h-4 shrink-0 text-[#0F4C45]" /> : <ChevronDown className="w-4 h-4 shrink-0 text-[#7A6E65]" />}
                          </button>
                          {isOpen && (
                            <div className="p-3.5 bg-white text-xs text-[#5A6561] leading-relaxed border-t border-[#E2D6C7]/40 font-sans">
                              {faq.a}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ─── PORTFOLIO TAB ─── */}
            {activeTab === "portfolio" && (
              <div className="space-y-6">
                
                {/* Category Filter Pills */}
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
                  {[
                    { id: "all", label: "All Albums" },
                    { id: "featured", label: "Featured Weddings" },
                    { id: "bride", label: "Bride Portraits" },
                    { id: "couple", label: "Couple Shoots" },
                    { id: "drone", label: "Drone & Aerial" },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setPortfolioCategory(cat.id)}
                      className={`px-3.5 py-1.5 rounded-full font-semibold shrink-0 cursor-pointer transition-colors ${
                        portfolioCategory === cat.id
                          ? "bg-[#0F4C45] text-white"
                          : "bg-white border border-[#E2D6C7] text-[#7A6E65] hover:text-[#1A1410]"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                {/* Gallery Albums Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {portfolioAlbums
                    .filter((album) => portfolioCategory === "all" || album.category === portfolioCategory)
                    .map((album, idx) => (
                      <div
                        key={idx}
                        className="bg-white rounded-2xl border border-[#E8DFC5]/80 overflow-hidden shadow-2xs group"
                      >
                        <div className="relative aspect-[4/3] w-full bg-gray-900">
                          <Image src={album.images[0]} alt={album.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                          <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[10px] uppercase font-bold px-2.5 py-1 rounded-full shadow">
                            {album.tag}
                          </span>
                        </div>

                        <div className="p-4 flex items-center justify-between">
                          <h4 className="font-serif font-bold text-xs sm:text-sm text-[#1A1410] truncate">{album.title}</h4>
                          <button
                            onClick={() => setLightboxImg(album.images[0])}
                            className="text-xs font-bold text-[#0F4C45] hover:underline shrink-0"
                          >
                            View Album ({album.images.length})
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* ─── PRICING & PACKAGES TAB ─── */}
            {activeTab === "packages" && (
              <div className="space-y-6">
                <div className="border-b border-[#E2D6C7] pb-3">
                  <h3 className="font-serif font-bold text-base text-[#1A1410]">Services & Packages</h3>
                  <p className="text-xs text-[#7A6E65]">Standard coverage plans. Custom packages available on request.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {packagesList.map((pkg, idx) => (
                    <div
                      key={idx}
                      className={`relative bg-white rounded-2xl p-5 border flex flex-col justify-between space-y-4 shadow-2xs ${
                        pkg.popular ? "border-[#C8A96A] border-2 shadow-md" : "border-[#E8DFC5]/80"
                      }`}
                    >
                      {pkg.popular && (
                        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0F4C45] text-white text-[9px] font-bold uppercase tracking-widest px-3 py-0.5 rounded-full shadow">
                          Most Popular
                        </span>
                      )}

                      <div className="space-y-2">
                        <h4 className="font-serif font-bold text-sm text-[#1A1410]">{pkg.title}</h4>
                        <span className="font-serif font-bold text-2xl text-[#0F4C45] block">{pkg.price}</span>
                        <p className="text-xs text-[#7A6E65]">{pkg.description}</p>

                        <div className="space-y-1.5 pt-2">
                          {pkg.features.map((feat, i) => (
                            <div key={i} className="flex items-start gap-1.5 text-xs text-[#5A6561]">
                              <Check className="w-3.5 h-3.5 text-[#0F4C45] shrink-0 mt-0.5" />
                              <span>{feat}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <a
                        href={`https://wa.me/${(photographer.phone || "919847055443").replace(/\D/g, "")}?text=Hi%20${encodeURIComponent(studioName)},%20I%20am%20interested%20in%20your%20${encodeURIComponent(pkg.title)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full text-center bg-[#0F4C45] text-white py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-[#12584E] transition-colors shadow-xs"
                      >
                        Inquire Package
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ─── REVIEWS TAB ─── */}
            {activeTab === "reviews" && (
              <div className="space-y-6">
                
                {/* Review Header Stats */}
                <div className="rounded-2xl p-5 bg-white border border-[#E8DFC5]/80 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="text-center p-3 rounded-xl bg-[#F8F5F0] border border-[#E2D6C7]/60">
                      <span className="font-serif text-3xl font-bold text-[#0F4C45] block">{photographer.rating}</span>
                      <div className="flex justify-center gap-0.5 text-amber-400 my-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className="w-3 h-3 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <span className="text-[10px] text-[#7A6E65] font-bold uppercase block">{photographer.reviews} Reviews</span>
                    </div>

                    <div>
                      <h4 className="font-serif font-bold text-sm text-[#1A1410]">Verified Client Feedback</h4>
                      <p className="text-xs text-[#7A6E65] mt-0.5">98% of couples recommend {studioName}</p>
                    </div>
                  </div>
                </div>

                {/* Client Reviews List */}
                <div className="space-y-3">
                  {clientReviews.map((rev, idx) => (
                    <div key={idx} className="rounded-2xl p-5 bg-white border border-[#E8DFC5]/80 shadow-2xs space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-serif font-bold text-xs sm:text-sm text-[#1A1410] block">{rev.author}</span>
                          <span className="text-[10px] text-[#7A6E65]">{rev.location} • {rev.date}</span>
                        </div>

                        <div className="flex items-center gap-1 text-xs font-bold text-[#0F4C45] bg-[#C8A96A]/10 px-2.5 py-1 rounded-full">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {rev.rating}.0
                        </div>
                      </div>

                      <p className="text-xs text-[#5A6561] leading-relaxed italic font-sans">&quot;{rev.text}&quot;</p>

                      {rev.reply && (
                        <div className="p-3 rounded-xl bg-[#F8F5F0] border-l-2 border-[#0F4C45] text-xs text-[#5A6561] space-y-1">
                          <span className="font-bold text-[#0F4C45] text-[11px] block">Photographer Response:</span>
                          <p className="italic">{rev.reply}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ─── CONTACT INFO TAB ─── */}
            {activeTab === "info" && (
              <div className="rounded-2xl p-5 sm:p-6 bg-white border border-[#E8DFC5]/80 shadow-2xs space-y-5 text-xs">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-[#F2EBE1] pb-4">
                  <div>
                    <span className="bg-[#C8A96A]/10 text-[#1A1410] font-bold text-[10px] uppercase tracking-widest px-3 py-1 rounded-full">
                      STUDIO CONTACT & LOCATION
                    </span>
                    <h3 className="font-serif text-xl font-bold text-[#0F4C45] mt-2">{studioName}</h3>
                    <p className="text-xs text-[#7A6E65] mt-0.5">{location}</p>
                  </div>

                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(`${studioName} ${location}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#0F4C45]/10 hover:bg-[#0F4C45] text-[#0F4C45] hover:text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 transition-colors"
                  >
                    <MapPin className="w-4 h-4" /> Open Directions
                  </a>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A6E65] block">Direct Phone</span>
                    <a href={formatTelUri(photographer.phone || "+919847055443")} className="font-semibold text-[#0F4C45] text-sm hover:underline block">
                      {photographer.phone || "+91 98470 55443"}
                    </a>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A6E65] block">Official Email</span>
                    <a href={`mailto:${photographer.email || "hello@studio.com"}`} className="font-semibold text-[#0F4C45] text-sm hover:underline block">
                      {photographer.email || "hello@studio.com"}
                    </a>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A6E65] block">Studio Business Hours</span>
                    <p className="font-medium text-[#2D2520]">Mon – Sat: 9:30 AM – 7:30 PM | Sun: Appointment Only</p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A6E65] block">Service Destinations</span>
                    <p className="font-medium text-[#2D2520]">Kerala, Tamil Nadu, Karnataka, Goa, Dubai & International</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxImg && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4" onClick={() => setLightboxImg(null)}>
          <div className="relative max-w-3xl w-full aspect-[4/3] rounded-2xl overflow-hidden">
            <Image src={lightboxImg} alt="Enlarged gallery photo" fill className="object-contain" />
          </div>
        </div>
      )}

      <BottomNavBar activeTab="vendors" />
    </div>
  );
}
