"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Share2,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  Phone,
  Star,
  MapPin,
  ShieldCheck,
  Check,
  Calendar,
  Sparkles,
  Menu,
  Send,
  Heart,
  Eye,
  Sliders,
  Award,
  Clock,
  Shirt,
  UserCheck
} from "lucide-react";
import { WishlistButton } from "@/components/WishlistButton";
import { Footer } from "@/components/Footer";

interface OutfitItem {
  id: string | number;
  name: string;
  category: string;
  image: string;
  price?: string;
  description?: string;
  fabric?: string;
  sizes?: string[];
  rentalAvailable?: boolean;
}

interface CollectionDetailProps {
  collection: {
    id: string | number;
    name: string;
    description?: string;
    story?: string;
    coverImage: string;
    category?: string;
    outfitCount?: number;
    outfits?: OutfitItem[];
    priceRange?: string;
    rentalPrice?: string;
    rentalDuration?: string;
    depositAmount?: string;
    fabric?: string;
    includes?: string[];
    sizes?: string[];
    idealFor?: string[];
    customStitching?: boolean;
    rentalAvailable?: boolean;
    deliveryTime?: string;
  };
  boutique: {
    id: string | number;
    name: string;
    city?: string;
    address?: string;
    rating?: number;
    reviewCount?: number;
    verified?: boolean;
    isPremium?: boolean;
    whatsappNumber?: string;
    phoneNumber?: string;
    slug?: string;
  };
  similarCollections?: Array<{
    id: string | number;
    name: string;
    coverImage: string;
    outfitCount?: number;
    priceRange?: string;
    category?: string;
    location?: string;
  }>;
}

export function CollectionDetailClient({
  collection,
  boutique,
  similarCollections = []
}: CollectionDetailProps) {
  // ── STATE ──
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isCopied, setIsCopied] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>("details");

  // Reviews State
  const [reviewsList, setReviewsList] = useState<Array<{ id: string; name: string; rating: number; date: string; comment: string; verified?: boolean }>>([
    {
      id: "rev-1",
      name: "Ananya Ramesh",
      rating: 5,
      date: "2 days ago",
      comment: "Absolutely breathtaking outfit! The intricate zardozi embroidery and perfect fitting made my wedding day truly unforgettable. Highly recommend!",
      verified: true
    },
    {
      id: "rev-2",
      name: "Dr. Kavya Nair",
      rating: 5,
      date: "1 week ago",
      comment: "Rented this lehenga set for my reception. Premium fabric, pristine condition, and smooth rental pickup/drop process.",
      verified: true
    },
    {
      id: "rev-3",
      name: "Priyanka & Rahul",
      rating: 5,
      date: "2 weeks ago",
      comment: "The gold foil work and vibrant color palette looked mesmerizing in photos. Excellent customer service from Halo & Hue team.",
      verified: true
    }
  ]);

  // Review Form State
  const [reviewerName, setReviewerName] = useState("");
  const [reviewerComment, setReviewerComment] = useState("");
  const [ratingInput, setRatingInput] = useState(5);
  const [reviewSuccessMsg, setReviewSuccessMsg] = useState(false);

  // Availability / Booking Modal
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingSent, setBookingSent] = useState(false);

  // Persistent storage key for reviews
  const reviewStorageKey = `cloche_reviews_collection_${collection.id}`;

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(reviewStorageKey);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setReviewsList(parsed);
          }
        }
      } catch (e) {}
    }
  }, [reviewStorageKey]);

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim() || !reviewerComment.trim()) return;

    const newEntry = {
      id: `rev-${Date.now()}`,
      name: reviewerName.trim(),
      rating: ratingInput,
      date: "Just now",
      comment: reviewerComment.trim(),
      verified: true
    };

    const updated = [newEntry, ...reviewsList];
    setReviewsList(updated);
    setReviewerName("");
    setReviewerComment("");
    setRatingInput(5);
    setReviewSuccessMsg(true);

    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(reviewStorageKey, JSON.stringify(updated));
      }
    } catch (e) {}

    setTimeout(() => setReviewSuccessMsg(false), 4000);
  };

  // Derive outfits array safely
  const rawOutfits: OutfitItem[] = useMemo(() => {
    if (collection.outfits && collection.outfits.length > 0) {
      return collection.outfits;
    }
    return [
      {
        id: "outfit-1",
        name: `${collection.name} - Royal Zardozi Velvet Ensemble`,
        category: "Bride",
        image: collection.coverImage || "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=800&auto=format&fit=crop",
        price: "₹24,500 / 3 Days",
        fabric: "Pure Raw Silk & Micro Velvet",
        sizes: ["S", "M", "L", "Custom Fit"],
        rentalAvailable: true
      },
      {
        id: "outfit-2",
        name: `${collection.name} - Pastel Silk Ceremonial Gown`,
        category: "Reception",
        image: "https://images.unsplash.com/photo-1546804764-9147f7157769?q=80&w=800&auto=format&fit=crop",
        price: "₹18,000 / 3 Days",
        fabric: "Organza Silk",
        sizes: ["S", "M", "L"],
        rentalAvailable: true
      },
      {
        id: "outfit-3",
        name: `${collection.name} - Heritage Kundan & Gold Lehenga`,
        category: "Bride",
        image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop",
        price: "₹32,000 / 3 Days",
        fabric: "Raw Silk & Net",
        sizes: ["M", "L", "XL", "Custom Fit"],
        rentalAvailable: true
      },
      {
        id: "outfit-4",
        name: `${collection.name} - Indo-Western Sangeet Drape`,
        category: "Engagement",
        image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop",
        price: "₹15,500 / 3 Days",
        fabric: "Georgette & Satin",
        sizes: ["S", "M", "Custom Fit"],
        rentalAvailable: true
      }
    ];
  }, [collection]);

  // Gallery photos array
  const galleryImages = useMemo(() => {
    const images: string[] = [];
    if (collection.coverImage) images.push(collection.coverImage);
    rawOutfits.forEach(o => {
      if (o.image && !images.includes(o.image)) {
        images.push(o.image);
      }
    });
    if (images.length < 3) {
      const fallbacks = [
        "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1546804764-9147f7157769?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop"
      ];
      fallbacks.forEach(f => {
        if (!images.includes(f)) images.push(f);
      });
    }
    return images.filter(Boolean);
  }, [collection.coverImage, rawOutfits]);

  const handleNextImage = () => {
    setActiveImageIndex(prev => (prev === galleryImages.length - 1 ? 0 : prev + 1));
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 3000);
    }
  };

  const formattedCity = (boutique.city || "PERINTHALMANNA, MALAPPURAM").toUpperCase();
  const whatsappUrl = `https://wa.me/${(boutique.whatsappNumber || "919000000000").replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
    `Hi ${boutique.name}, I'm interested in booking/renting the collection "${collection.name}" on Cloche!`
  )}`;

  // Average rating
  const avgRating = useMemo(() => {
    if (reviewsList.length === 0) return "5.0";
    const sum = reviewsList.reduce((acc, r) => acc + r.rating, 0);
    return (sum / reviewsList.length).toFixed(1);
  }, [reviewsList]);

  return (
    <div className="min-h-screen bg-[#0D0E12] text-white flex flex-col font-sans selection:bg-[#D4B66E] selection:text-black">
      
      {/* ── LUXURY TOP HEADER (MATCHING SCREENSHOT) ── */}
      <header className="sticky top-0 z-40 bg-[#090A0C]/90 backdrop-blur-xl border-b border-white/10 px-4 sm:px-6 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:text-white transition-all cursor-pointer">
            <Menu className="w-5 h-5" />
          </button>

          <Link href="/" className="font-serif font-extrabold text-xl sm:text-2xl tracking-[0.25em] text-white uppercase drop-shadow-md">
            CLOCHE
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:text-white transition-all relative cursor-pointer"
              title="Share Collection"
            >
              <Share2 className="w-4 h-4" />
              {isCopied && (
                <span className="absolute -bottom-8 right-0 bg-[#D4B66E] text-black text-[10px] font-bold px-2.5 py-0.5 rounded shadow-lg whitespace-nowrap">
                  Link Copied!
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ── BREADCRUMB NAV TRAIL (MATCHING SCREENSHOT) ── */}
      <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 pt-5 pb-3">
        <nav className="flex items-center gap-2 text-[10px] sm:text-xs font-bold tracking-[0.2em] text-white/50 uppercase">
          <Link href="/" className="hover:text-white transition-colors">HOME</Link>
          <span>›</span>
          <Link href="/collections" className="hover:text-white transition-colors">COLLECTIONS</Link>
          <span>›</span>
          <span className="text-[#D4B66E] font-extrabold truncate max-w-[200px] sm:max-w-none">
            {collection.name.toUpperCase()}
          </span>
        </nav>
      </div>

      {/* ── MAIN CONTENT CONTAINER (CONTAINED FOR PERFECT PORTRAIT SCREENSHOT LOOK) ── */}
      <main className="max-w-4xl mx-auto w-full px-4 sm:px-6 pb-24 space-y-8">
        
        {/* 1. PORTRAIT COVER IMAGE WITH VERIFIED LUXURY BADGE (MATCHING SCREENSHOT) */}
        <div className="relative aspect-[3/4] w-full rounded-3xl overflow-hidden bg-charcoal/30 border border-gold/20 shadow-2xl group flex items-center justify-center">
          <img
            src={galleryImages[activeImageIndex] || collection.coverImage}
            alt={collection.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />

          {/* VERIFIED LUXURY GOLD BADGE */}
          <div className="absolute top-5 left-5 bg-[#C8A96A]/20 backdrop-blur-md border border-[#D4B66E]/40 text-[#D4B66E] font-bold text-[10px] sm:text-xs px-3.5 py-1 rounded-full uppercase tracking-[0.2em] shadow-lg flex items-center gap-1.5 z-10">
            <Award className="w-3.5 h-3.5 text-[#D4B66E]" />
            <span>VERIFIED LUXURY</span>
          </div>

          {/* Next Image Floating Arrow Button */}
          {galleryImages.length > 1 && (
            <button
              onClick={handleNextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/20 shadow-xl flex items-center justify-center text-white hover:bg-black hover:scale-110 transition-all cursor-pointer z-10"
              title="Next Image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}

          {/* Mobile Image Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
            {galleryImages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  activeImageIndex === idx ? "bg-[#D4B66E] w-5" : "bg-white/40 w-2"
                }`}
              />
            ))}
          </div>
        </div>

        {/* 2. COLLECTION METADATA (EXACT TYPOGRAPHY & LAYOUT MATCHING SCREENSHOT) */}
        <div className="space-y-2 text-left pt-1">
          {/* Gold Category Tag */}
          <span className="text-xs sm:text-sm font-bold text-[#D4B66E] uppercase tracking-[0.25em]">
            {(collection.category || "BRIDAL").toUpperCase()}
          </span>

          {/* Large Serif Title */}
          <h1 className="font-serif font-extrabold text-3xl sm:text-4xl text-white uppercase tracking-wide leading-tight drop-shadow-sm">
            {collection.name}
          </h1>

          {/* Studio Name & Location */}
          <div className="space-y-1 pt-1">
            <h2 className="font-serif font-bold text-lg sm:text-xl text-[#D4B66E]">
              {boutique.name}
            </h2>
            <div className="flex items-center gap-1.5 text-xs text-white/60 font-medium tracking-wider uppercase">
              <MapPin className="w-3.5 h-3.5 text-[#D4B66E] shrink-0" />
              <span>{formattedCity}</span>
            </div>
          </div>
        </div>

        {/* 3. PRICING & RENTAL SPECIFICATION CARD */}
        <div className="bg-[#14161D] rounded-3xl p-5 sm:p-6 border border-gold/20 shadow-xl space-y-5">
          <div className="flex items-start justify-between flex-wrap gap-3 pb-4 border-b border-white/10">
            <div>
              <span className="text-[11px] font-bold text-white/50 uppercase tracking-widest block">Rental Price</span>
              <div className="font-serif font-extrabold text-2xl sm:text-3xl text-[#D4B66E] mt-0.5">
                {collection.rentalPrice || collection.priceRange || "₹24,500"}
                <span className="text-xs text-white/60 font-sans font-medium ml-2">/ 3 Days Rental</span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-3 py-1 rounded-full inline-flex items-center gap-1">
                <Check className="w-3 h-3" /> Available for Booking
              </span>
              <span className="text-[11px] text-white/50 block mt-1">Refundable Deposit: {collection.depositAmount || "₹5,000"}</span>
            </div>
          </div>

          {/* Quick Specifications Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="bg-white/5 p-3 rounded-2xl border border-white/10 space-y-1">
              <div className="flex items-center gap-1.5 text-[#D4B66E] font-bold">
                <Shirt className="w-4 h-4" />
                <span>Fabric & Craft</span>
              </div>
              <p className="text-white/80 text-[11px] line-clamp-1 font-medium">{collection.fabric || "Raw Silk & Zardozi"}</p>
            </div>

            <div className="bg-white/5 p-3 rounded-2xl border border-white/10 space-y-1">
              <div className="flex items-center gap-1.5 text-[#D4B66E] font-bold">
                <Sliders className="w-4 h-4" />
                <span>Available Sizes</span>
              </div>
              <p className="text-white/80 text-[11px] font-medium">S, M, L, XL, Custom Fit</p>
            </div>

            <div className="bg-white/5 p-3 rounded-2xl border border-white/10 space-y-1 col-span-2 sm:col-span-1">
              <div className="flex items-center gap-1.5 text-[#D4B66E] font-bold">
                <Clock className="w-4 h-4" />
                <span>Rental Period</span>
              </div>
              <p className="text-white/80 text-[11px] font-medium">3 Days / 5 Days Option</p>
            </div>
          </div>

          {/* Primary Call to Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => setShowBookingModal(true)}
              className="w-full py-3.5 px-6 rounded-2xl bg-[#0F4C45] hover:bg-[#14635a] text-white font-bold text-sm shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 border border-emerald-500/30"
            >
              <Calendar className="w-4 h-4 text-emerald-300" />
              <span>Check Available Dates</span>
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-6 rounded-2xl bg-[#25D366] hover:bg-emerald-600 text-white font-bold text-sm shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Chat with Designer</span>
            </a>
          </div>
        </div>

        {/* 4. PRODUCT DETAILS & INCLUSIONS ACCORDIONS */}
        <div className="bg-[#14161D] rounded-3xl p-5 sm:p-6 border border-gold/20 shadow-xl space-y-4">
          <h3 className="font-serif font-bold text-xl text-white border-b border-white/10 pb-3 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#D4B66E]" />
            <span>Product Details &amp; Inclusions</span>
          </h3>

          <div className="space-y-3 text-xs leading-relaxed">
            <p className="text-white/80 font-normal">
              {collection.story || collection.description || "Hand-crafted zardozi and raw silk ensemble featuring intricate dabka threadwork, royal gold highlights, and custom fitting tailoring."}
            </p>

            <div className="pt-2 space-y-2">
              <h4 className="font-bold text-[#D4B66E] uppercase tracking-wider text-[11px]">Set Includes:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {(collection.includes || ["Heavy Embroidered Lehenga Skirt", "Unstitched / Stitched Blouse", "Double Net Dupatta", "Matching Latkan"]).map((inc, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-white/5 p-2.5 rounded-xl border border-white/10 text-white/90">
                    <Check className="w-3.5 h-3.5 text-[#D4B66E] shrink-0" />
                    <span>{inc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 5. REVIEWS SEEING & ADDING SECTION */}
        <div className="bg-[#14161D] rounded-3xl p-5 sm:p-6 border border-gold/20 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h3 className="font-serif font-bold text-xl text-white">Client Reviews &amp; Ratings</h3>
              <p className="text-xs text-white/60 mt-0.5">Real feedback from brides &amp; customers who wore this set</p>
            </div>

            <div className="flex items-center gap-2 bg-[#D4B66E]/15 border border-[#D4B66E]/30 px-3.5 py-1.5 rounded-2xl text-right">
              <Star className="w-5 h-5 fill-[#D4B66E] text-[#D4B66E]" />
              <div>
                <span className="font-bold text-base text-[#D4B66E]">{avgRating}</span>
                <span className="text-[10px] text-white/60 block font-medium">({reviewsList.length} reviews)</span>
              </div>
            </div>
          </div>

          {/* List of Existing Reviews */}
          <div className="space-y-4">
            {reviewsList.map((rev) => (
              <div key={rev.id} className="bg-white/5 rounded-2xl p-4 border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#D4B66E]/20 border border-[#D4B66E]/40 flex items-center justify-center font-bold text-xs text-[#D4B66E]">
                      {rev.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-sm text-white">{rev.name}</span>
                        {rev.verified && (
                          <span className="text-[9px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded-full font-bold flex items-center gap-0.5">
                            <UserCheck className="w-2.5 h-2.5" /> Verified Bride
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-white/50">{rev.date}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${s <= rev.rating ? "fill-[#D4B66E] text-[#D4B66E]" : "text-white/20"}`}
                      />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-white/80 leading-relaxed font-normal pt-1">
                  "{rev.comment}"
                </p>
              </div>
            ))}
          </div>

          {/* Add Review Form */}
          <div className="pt-4 border-t border-white/10 space-y-4">
            <h4 className="font-serif font-bold text-base text-[#D4B66E]">Write a Customer Review</h4>

            {reviewSuccessMsg && (
              <div className="p-3 bg-emerald-950/80 border border-emerald-500/40 rounded-2xl text-xs text-emerald-300 font-bold flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Thank you! Your review has been published successfully.</span>
              </div>
            )}

            <form onSubmit={handleAddReview} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-white/70 uppercase tracking-wider block mb-1">Your Rating</label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRatingInput(star)}
                      className="p-1 cursor-pointer transition-transform hover:scale-125"
                    >
                      <Star
                        className={`w-6 h-6 ${star <= ratingInput ? "fill-[#D4B66E] text-[#D4B66E]" : "text-white/20"}`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-white/70 uppercase tracking-wider block mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Ananya Ramesh"
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  className="w-full bg-white/5 border border-white/15 rounded-xl p-3 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#D4B66E]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-white/70 uppercase tracking-wider block mb-1">Your Review / Experience</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Share details about the fitting, fabric quality, and rental experience..."
                  value={reviewerComment}
                  onChange={(e) => setReviewerComment(e.target.value)}
                  className="w-full bg-white/5 border border-white/15 rounded-xl p-3 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#D4B66E] resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#D4B66E] hover:bg-[#bfa25c] text-black font-bold text-xs shadow-md transition-all cursor-pointer uppercase tracking-wider"
              >
                Submit Review
              </button>
            </form>
          </div>
        </div>

        {/* 6. BOTTOM SIMILAR COLLECTIONS CARDS (MATCHING REFERENCE CARDS) */}
        {similarCollections.length > 0 && (
          <section className="space-y-4 pt-4 border-t border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-xl text-white">Similar Collections</h3>
                <p className="text-xs text-white/60">More signature couture ensembles you may like</p>
              </div>

              <Link href="/collections" className="text-xs font-bold text-[#D4B66E] hover:underline flex items-center gap-1">
                <span>View All</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-5">
              {similarCollections.map((item) => (
                <Link
                  key={item.id}
                  href={`/collections/${item.id}`}
                  className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden shadow-md group cursor-pointer border border-gold/20 hover:border-[#D4B66E] hover:shadow-2xl transition-all duration-500 block"
                >
                  <img
                    src={item.coverImage}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent transition-opacity group-hover:from-black" />
                  <div className="absolute bottom-0 left-0 right-0 p-3.5 sm:p-4 flex flex-col justify-end text-left z-10 space-y-1">
                    <span className="text-[10px] font-bold text-[#D4B66E] uppercase tracking-[0.2em]">
                      {(item.location || "KERALA").toUpperCase()}
                    </span>
                    <h4 className="font-serif font-bold text-xs sm:text-sm text-white uppercase tracking-wider leading-snug line-clamp-2 drop-shadow-xs">
                      {item.name}
                    </h4>
                    <span className="text-[10px] font-medium text-white/75 uppercase tracking-[0.15em]">
                      {(item.category || "COUTURE").toUpperCase()}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

      </main>

      {/* ── BOOKING DATE MODAL ── */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#14161D] rounded-3xl max-w-md w-full border border-gold/30 p-6 space-y-4 text-white relative">
            <button
              onClick={() => setShowBookingModal(false)}
              className="absolute top-4 right-4 text-white/60 hover:text-white font-bold text-sm"
            >
              ✕
            </button>

            <h3 className="font-serif font-bold text-xl text-[#D4B66E]">Check Event Date Availability</h3>
            <p className="text-xs text-white/70">
              Select your wedding or event date to check live availability with {boutique.name}.
            </p>

            {bookingSent ? (
              <div className="p-4 bg-emerald-950 border border-emerald-500 rounded-2xl text-xs text-emerald-300 font-bold space-y-2">
                <p>✓ Availability Inquiry Sent!</p>
                <p className="font-normal text-white/80">
                  {boutique.name} has received your inquiry for {bookingDate}. Their concierge team will respond shortly.
                </p>
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="mt-2 w-full py-2 bg-emerald-600 text-white rounded-xl font-bold"
                >
                  Close
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-white/70 block mb-1">
                    Event / Wedding Date
                  </label>
                  <input
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#D4B66E]"
                  />
                </div>

                <button
                  onClick={() => {
                    if (!bookingDate) return;
                    setBookingSent(true);
                  }}
                  className="w-full py-3 bg-[#0F4C45] hover:bg-emerald-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all"
                >
                  Confirm &amp; Request Date
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
