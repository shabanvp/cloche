"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Share2,
  ChevronRight,
  ChevronLeft,
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
  UserCheck,
  X,
  Maximize2,
  FileText,
  AlertCircle
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
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

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
    if (images.length < 4) {
      const fallbacks = [
        "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1546804764-9147f7157769?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=800&auto=format&fit=crop"
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

  const handlePrevImage = () => {
    setActiveImageIndex(prev => (prev === 0 ? galleryImages.length - 1 : prev - 1));
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
    `Hi ${boutique.name}, I'm interested in sending an enquiry for the collection "${collection.name}" on Cloche!`
  )}`;
  const phoneUrl = `tel:${(boutique.phoneNumber || "919000000000").replace(/[^0-9]/g, "")}`;

  // Average rating
  const avgRating = useMemo(() => {
    if (reviewsList.length === 0) return "5.0";
    const sum = reviewsList.reduce((acc, r) => acc + r.rating, 0);
    return (sum / reviewsList.length).toFixed(1);
  }, [reviewsList]);

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-charcoal flex flex-col font-sans selection:bg-[#0F4C45] selection:text-white">
      
      {/* ══════════════════════════════════════════════════════════════════════
          1. MOBILE LAYOUT (100% UNCHANGED & PRESERVED EXACTLY AS BEFORE)
          ══════════════════════════════════════════════════════════════════════ */}
      <div className="lg:hidden">
        {/* Mobile Navigation Trail & Share Bar */}
        <div className="max-w-4xl mx-auto w-full px-4 pt-6 pb-3 flex items-center justify-between gap-4">
          <nav className="flex items-center gap-1.5 text-[10px] font-bold tracking-[0.15em] text-charcoal/60 uppercase flex-wrap">
            <Link href="/" className="hover:text-[#0F4C45] transition-colors">HOME</Link>
            <span>›</span>
            <Link href="/vendors" className="hover:text-[#0F4C45] transition-colors">VENDORS</Link>
            <span>›</span>
            <Link
              href={`/wedding-story/${boutique.slug || boutique.id || "studio"}`}
              className="hover:text-[#0F4C45] transition-colors text-[#0F4C45]"
            >
              {boutique.name.toUpperCase()}
            </Link>
            <span>›</span>
            <span className="text-charcoal font-extrabold truncate max-w-[150px]">
              {collection.name.toUpperCase()}
            </span>
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleShare}
              className="p-2 rounded-full bg-white border border-gold/20 text-[#0F4C45] relative cursor-pointer shadow-xs"
              title="Share Collection"
            >
              <Share2 className="w-4 h-4" />
              {isCopied && (
                <span className="absolute -bottom-8 right-0 bg-[#0F4C45] text-white text-[10px] font-bold px-2.5 py-0.5 rounded shadow-lg whitespace-nowrap z-20">
                  Link Copied!
                </span>
              )}
            </button>

            <WishlistButton
              product={{
                id: String(collection.id),
                product_name: collection.name,
                boutique_name: boutique.name,
                category: collection.category || "Collection",
                price: collection.priceRange || 0,
                image_url: collection.coverImage
              } as any}
            />
          </div>
        </div>

        {/* Mobile Main Content */}
        <main className="max-w-4xl mx-auto w-full px-4 pb-24 space-y-8">
          {/* Mobile Cover Photo */}
          <div className="relative aspect-[3/4] w-full rounded-3xl overflow-hidden bg-charcoal/5 border border-gold/20 shadow-xl group flex items-center justify-center">
            <img
              src={galleryImages[activeImageIndex] || collection.coverImage}
              alt={collection.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-5 left-5 bg-[#0F4C45] text-[#D4B66E] border border-[#D4B66E]/40 font-bold text-[10px] px-3.5 py-1 rounded-full uppercase tracking-[0.2em] shadow-lg flex items-center gap-1.5 z-10">
              <Award className="w-3.5 h-3.5 text-[#D4B66E]" />
              <span>VERIFIED LUXURY</span>
            </div>

            {galleryImages.length > 1 && (
              <button
                onClick={handleNextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 border border-gold/20 shadow-xl flex items-center justify-center text-[#0F4C45] z-10"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
              {galleryImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`h-2 rounded-full transition-all ${
                    activeImageIndex === idx ? "bg-[#0F4C45] w-5" : "bg-white/60 w-2"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Mobile Collection Metadata */}
          <div className="space-y-1.5 text-left pt-1">
            <span className="text-xs font-bold text-[#0F4C45] uppercase tracking-[0.25em] bg-[#0F4C45]/10 px-3 py-1 rounded-full inline-block">
              {(collection.category || "BRIDAL").toUpperCase()}
            </span>
            <h1 className="font-serif font-extrabold text-3xl text-charcoal uppercase tracking-wide leading-tight pt-1">
              {collection.name}
            </h1>
            <div className="space-y-1 pt-1">
              <h2 className="font-serif font-bold text-lg text-[#0F4C45]">
                {boutique.name}
              </h2>
              <div className="flex items-center gap-1.5 text-xs text-charcoal/60 font-medium tracking-wider uppercase">
                <MapPin className="w-3.5 h-3.5 text-[#0F4C45] shrink-0" />
                <span>{formattedCity}</span>
              </div>
            </div>
          </div>

          {/* Mobile Pricing & Rental Box */}
          <div className="bg-white rounded-3xl p-5 border border-gold/20 shadow-md space-y-5">
            <div className="flex items-start justify-between flex-wrap gap-3 pb-4 border-b border-gold/10">
              <div>
                <span className="text-[11px] font-bold text-charcoal/50 uppercase tracking-widest block">Rental Price</span>
                <div className="font-serif font-extrabold text-2xl text-[#0F4C45] mt-0.5">
                  {collection.rentalPrice || collection.priceRange || "₹24,500"}
                  <span className="text-xs text-charcoal/60 font-sans font-medium ml-2">/ 3 Days Rental</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full inline-flex items-center gap-1">
                  <Check className="w-3 h-3 text-emerald-600" /> Available for Rental
                </span>
                <span className="text-[11px] text-charcoal/50 block mt-1">Refundable Deposit: {collection.depositAmount || "₹5,000"}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-[#FAF7F2] p-3 rounded-2xl border border-gold/15 space-y-1">
                <div className="flex items-center gap-1.5 text-[#0F4C45] font-bold">
                  <Shirt className="w-4 h-4" />
                  <span>Fabric &amp; Craft</span>
                </div>
                <p className="text-charcoal/80 text-[11px] line-clamp-1 font-medium">{collection.fabric || "Raw Silk & Zardozi"}</p>
              </div>

              <div className="bg-[#FAF7F2] p-3 rounded-2xl border border-gold/15 space-y-1">
                <div className="flex items-center gap-1.5 text-[#0F4C45] font-bold">
                  <Sliders className="w-4 h-4" />
                  <span>Available Sizes</span>
                </div>
                <p className="text-charcoal/80 text-[11px] font-medium">S, M, L, XL, Custom Fit</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 pt-2">
              <button
                onClick={() => setShowBookingModal(true)}
                className="w-full py-3.5 px-6 rounded-2xl bg-[#0F4C45] text-white font-bold text-sm shadow-md flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4 text-[#D4B66E]" />
                <span>Send Enquiry</span>
              </button>

              <div className="flex items-center gap-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-4 rounded-2xl bg-[#25D366] text-white font-bold text-xs shadow-md flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>WhatsApp</span>
                </a>

                <a
                  href={phoneUrl}
                  className="p-3 rounded-2xl bg-white border border-[#0F4C45] text-[#0F4C45] font-bold shadow-xs flex items-center justify-center"
                >
                  <Phone className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Mobile Details */}
          <div className="bg-white rounded-3xl p-5 border border-gold/20 shadow-md space-y-4">
            <h3 className="font-serif font-bold text-xl text-charcoal border-b border-gold/10 pb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#C8A96A]" />
              <span>Product Details &amp; Inclusions</span>
            </h3>
            <p className="text-xs text-charcoal/80 leading-relaxed font-normal">
              {collection.story || collection.description || "Hand-crafted zardozi and raw silk ensemble featuring intricate dabka threadwork, royal gold highlights, and custom fitting tailoring."}
            </p>
            <div className="space-y-2 pt-1">
              <h4 className="font-bold text-[#0F4C45] uppercase tracking-wider text-[11px]">Set Includes:</h4>
              <div className="grid grid-cols-1 gap-2">
                {(collection.includes || ["Heavy Embroidered Lehenga Skirt", "Unstitched / Stitched Blouse", "Double Net Dupatta", "Matching Latkan"]).map((inc, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-[#FAF7F2] p-2.5 rounded-xl border border-gold/15 text-charcoal font-medium text-xs">
                    <Check className="w-3.5 h-3.5 text-[#0F4C45] shrink-0" />
                    <span>{inc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile Reviews */}
          <div className="bg-white rounded-3xl p-5 border border-gold/20 shadow-md space-y-6">
            <div className="flex items-center justify-between border-b border-gold/10 pb-4">
              <div>
                <h3 className="font-serif font-bold text-xl text-charcoal">Client Reviews</h3>
                <p className="text-xs text-charcoal/60 mt-0.5">{reviewsList.length} verified feedback</p>
              </div>
              <div className="flex items-center gap-2 bg-[#FAF7F2] border border-gold/25 px-3.5 py-1.5 rounded-2xl">
                <Star className="w-5 h-5 fill-[#C8A96A] text-[#C8A96A]" />
                <span className="font-bold text-base text-charcoal">{avgRating}</span>
              </div>
            </div>

            <div className="space-y-3">
              {reviewsList.map((rev) => (
                <div key={rev.id} className="bg-[#FAF7F2] rounded-2xl p-4 border border-gold/15 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs text-charcoal">{rev.name}</span>
                      {rev.verified && (
                        <span className="text-[8px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.5 rounded-full font-bold flex items-center gap-0.5">
                          <UserCheck className="w-2 h-2" /> Verified
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className={`w-3 h-3 ${s <= rev.rating ? "fill-[#C8A96A] text-[#C8A96A]" : "text-gray-300"}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-charcoal/80">"{rev.comment}"</p>
                </div>
              ))}
            </div>

            {/* Mobile Add Review Form */}
            <div className="pt-4 border-t border-gold/10 space-y-3">
              <h4 className="font-serif font-bold text-base text-[#0F4C45]">Write a Customer Review</h4>

              {reviewSuccessMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-bold flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Thank you! Your review has been published.</span>
                </div>
              )}

              <form onSubmit={handleAddReview} className="space-y-3">
                <div>
                  <label className="text-[11px] font-bold text-charcoal/70 uppercase tracking-wider block mb-1">Your Rating</label>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRatingInput(star)}
                        className="p-1 cursor-pointer transition-transform hover:scale-125"
                      >
                        <Star className={`w-5 h-5 ${star <= ratingInput ? "fill-[#C8A96A] text-[#C8A96A]" : "text-gray-300"}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-charcoal/70 uppercase tracking-wider block mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Ananya Ramesh"
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl p-2.5 text-xs text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:border-[#0F4C45]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-charcoal/70 uppercase tracking-wider block mb-1">Your Review</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Share details about fitting, fabric quality, and rental experience..."
                    value={reviewerComment}
                    onChange={(e) => setReviewerComment(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl p-2.5 text-xs text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:border-[#0F4C45] resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#0F4C45] hover:bg-[#0B3B35] text-white font-bold text-xs shadow-md transition-all cursor-pointer uppercase tracking-wider"
                >
                  Submit Review
                </button>
              </form>
            </div>
          </div>

          {/* Mobile Related Collections (Horizontal Swipe Carousel) */}
          {similarCollections.length > 0 && (
            <section className="space-y-3.5 pt-4 border-t border-gold/15">
              <div>
                <h3 className="font-serif font-bold text-xl text-charcoal">Related Collections</h3>
                <p className="text-xs text-charcoal/60">More signature couture ensembles from our featured studios</p>
              </div>

              {/* Mobile Horizontal Swipe Carousel */}
              <div className="flex overflow-x-auto snap-x snap-mandatory space-x-3.5 pb-2 -mx-4 px-4 scroll-smooth [webkit-scrollbar:none] [-ms-overflow-style:none] [scrollbar-width:none]">
                {similarCollections.map((item) => {
                  const locationTag = (item.location || "PERINTHALMANNA, MALAPPURAM").toUpperCase();
                  const categoryTag = (item.category || "COUTURE").toUpperCase();

                  return (
                    <Link
                      key={item.id}
                      href={`/collections/${item.id}`}
                      className="w-[75%] sm:w-[80%] shrink-0 snap-start relative aspect-[3/4] rounded-2xl overflow-hidden shadow-md group cursor-pointer border border-gold/20 block"
                    >
                      <img
                        src={item.coverImage}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4 flex flex-col justify-end text-left z-10 space-y-1">
                        <span className="text-[10px] font-bold text-[#D4B66E] uppercase tracking-[0.2em]">
                          {locationTag}
                        </span>
                        <h4 className="font-serif font-bold text-sm text-white uppercase tracking-wider leading-snug line-clamp-2 drop-shadow-xs">
                          {item.name}
                        </h4>
                        <span className="text-[10px] font-medium text-white/75 uppercase tracking-[0.15em]">
                          {categoryTag}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}
        </main>
      </div>


      {/* ══════════════════════════════════════════════════════════════════════
          2. DESKTOP LAYOUT (HIGH-END LUXURY E-COMMERCE CATALOGUE >1024px)
          ══════════════════════════════════════════════════════════════════════ */}
      <div className="hidden lg:block max-w-7xl mx-auto w-full px-8 pt-8 pb-28 space-y-12">
        
        {/* A. BREADCRUMB & TOP ACTIONS */}
        <div className="flex items-center justify-between border-b border-gold/15 pb-4">
          <nav className="flex items-center gap-2 text-xs font-bold tracking-[0.18em] text-charcoal/60 uppercase">
            <Link href="/" className="hover:text-[#0F4C45] transition-colors">HOME</Link>
            <span>›</span>
            <Link href="/vendors" className="hover:text-[#0F4C45] transition-colors">VENDORS</Link>
            <span>›</span>
            <Link
              href={`/wedding-story/${boutique.slug || boutique.id || "studio"}`}
              className="hover:text-[#0F4C45] transition-colors text-[#0F4C45]"
            >
              {boutique.name.toUpperCase()}
            </Link>
            <span>›</span>
            <span className="text-charcoal font-extrabold">
              {collection.name.toUpperCase()}
            </span>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gold/20 text-[#0F4C45] font-bold text-xs hover:bg-[#0F4C45] hover:text-white transition-all shadow-2xs relative cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>Share Collection</span>
              {isCopied && (
                <span className="absolute -bottom-8 right-0 bg-[#0F4C45] text-white text-[10px] font-bold px-2.5 py-0.5 rounded shadow-lg whitespace-nowrap z-20">
                  Link Copied!
                </span>
              )}
            </button>

            <WishlistButton
              product={{
                id: String(collection.id),
                product_name: collection.name,
                boutique_name: boutique.name,
                category: collection.category || "Collection",
                price: collection.priceRange || 0,
                image_url: collection.coverImage
              } as any}
            />
          </div>
        </div>

        {/* B. DESKTOP HERO SECTION (BALANCED 2-COLUMN GRID) */}
        <div className="grid grid-cols-12 gap-10 items-start">
          
          {/* LEFT COLUMN: HERO IMAGE & THUMBNAILS (HEIGHT CONSTRAINED: ~520-580px) */}
          <div className="col-span-6 space-y-4">
            <div className="relative aspect-[3/4] max-h-[580px] w-full rounded-3xl overflow-hidden bg-charcoal/5 border border-gold/20 shadow-2xl group flex items-center justify-center">
              <img
                src={galleryImages[activeImageIndex] || collection.coverImage}
                alt={collection.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 max-h-[580px]"
              />

              {/* Verified Luxury Badge */}
              <div className="absolute top-6 left-6 bg-[#0F4C45] text-[#D4B66E] border border-[#D4B66E]/40 font-bold text-xs px-4 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-lg flex items-center gap-2 z-10">
                <Award className="w-4 h-4 text-[#D4B66E]" />
                <span>VERIFIED LUXURY</span>
              </div>

              {/* Expand Lightbox Button */}
              <button
                onClick={() => setLightboxImage(galleryImages[activeImageIndex] || collection.coverImage)}
                className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md border border-gold/20 shadow-lg flex items-center justify-center text-[#0F4C45] hover:bg-white hover:scale-110 transition-all cursor-pointer opacity-0 group-hover:opacity-100 z-10"
                title="View Fullscreen Photo"
              >
                <Maximize2 className="w-4 h-4" />
              </button>

              {/* Prev/Next Image Arrow Navigation */}
              {galleryImages.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 backdrop-blur-md border border-gold/20 shadow-xl flex items-center justify-center text-[#0F4C45] hover:bg-white hover:scale-110 transition-all cursor-pointer z-10"
                    title="Previous Photo"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>

                  <button
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 backdrop-blur-md border border-gold/20 shadow-xl flex items-center justify-center text-[#0F4C45] hover:bg-white hover:scale-110 transition-all cursor-pointer z-10"
                    title="Next Photo"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Strip Underneath Image */}
            {galleryImages.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2 pt-1">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative aspect-[3/4] w-20 rounded-xl overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                      activeImageIndex === idx
                        ? "border-[#0F4C45] ring-2 ring-[#0F4C45]/20 scale-105 shadow-md"
                        : "border-gold/20 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: INFORMATION HIERARCHY & LUXURY PRICING CARD */}
          <div className="col-span-6 space-y-6">
            
            {/* Header Information Block */}
            <div className="space-y-2 border-b border-gold/15 pb-5">
              <span className="text-xs font-bold text-[#0F4C45] uppercase tracking-[0.25em] bg-[#0F4C45]/10 px-3.5 py-1 rounded-full inline-block">
                {(collection.category || "BRIDAL").toUpperCase()}
              </span>

              <h1 className="font-serif font-extrabold text-3xl xl:text-4xl text-charcoal uppercase tracking-wide leading-tight">
                {collection.name}
              </h1>

              <div className="flex items-center justify-between flex-wrap gap-3 pt-1">
                <Link
                  href={`/wedding-story/${boutique.slug || boutique.id || "studio"}`}
                  className="font-serif font-bold text-lg text-[#0F4C45] hover:underline flex items-center gap-2"
                >
                  <span>{boutique.name}</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>

                <div className="flex items-center gap-4 text-xs font-medium text-charcoal/70">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-[#0F4C45]" />
                    <span className="uppercase tracking-wider">{formattedCity}</span>
                  </div>

                  <div className="flex items-center gap-1 bg-[#FAF7F2] border border-gold/20 px-2.5 py-0.5 rounded-full">
                    <Star className="w-3.5 h-3.5 fill-[#C8A96A] text-[#C8A96A]" />
                    <span className="font-bold text-charcoal">{avgRating}</span>
                    <span className="text-[10px] text-charcoal/50">({reviewsList.length})</span>
                  </div>
                </div>
              </div>
            </div>

            {/* LUXURY PRICING CARD (STRONGEST VISUAL ELEMENT) */}
            <div className="bg-white rounded-3xl p-6 border border-gold/25 shadow-lg space-y-6">
              
              <div className="flex items-start justify-between border-b border-gold/10 pb-4">
                <div>
                  <span className="text-xs font-bold text-charcoal/50 uppercase tracking-widest block">Rental Price</span>
                  <div className="font-serif font-extrabold text-3xl xl:text-4xl text-[#0F4C45] mt-1">
                    {collection.rentalPrice || collection.priceRange || "₹24,500"}
                    <span className="text-sm font-sans font-medium text-charcoal/60 ml-2">/ 3 Days Rental</span>
                  </div>
                </div>

                <div className="text-right space-y-1">
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3.5 py-1 rounded-full inline-flex items-center gap-1.5 shadow-2xs">
                    <Check className="w-3.5 h-3.5 text-emerald-600" /> Available for Rental
                  </span>
                  <span className="text-xs text-charcoal/60 block font-medium">Refundable Deposit: {collection.depositAmount || "₹5,000"}</span>
                </div>
              </div>

              {/* Key Specifications Grid */}
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="bg-[#FAF7F2] p-3.5 rounded-2xl border border-gold/15 space-y-1">
                  <div className="flex items-center gap-1.5 text-[#0F4C45] font-bold">
                    <Shirt className="w-4 h-4" />
                    <span>Fabric &amp; Work</span>
                  </div>
                  <p className="text-charcoal/80 text-xs font-medium line-clamp-1">{collection.fabric || "Pure Raw Silk & Zardozi"}</p>
                </div>

                <div className="bg-[#FAF7F2] p-3.5 rounded-2xl border border-gold/15 space-y-1">
                  <div className="flex items-center gap-1.5 text-[#0F4C45] font-bold">
                    <Sliders className="w-4 h-4" />
                    <span>Available Sizes</span>
                  </div>
                  <p className="text-charcoal/80 text-xs font-medium">S, M, L, XL, Custom Fit</p>
                </div>

                <div className="bg-[#FAF7F2] p-3.5 rounded-2xl border border-gold/15 space-y-1">
                  <div className="flex items-center gap-1.5 text-[#0F4C45] font-bold">
                    <Clock className="w-4 h-4" />
                    <span>Rental Duration</span>
                  </div>
                  <p className="text-charcoal/80 text-xs font-medium">3 Days / 5 Days Option</p>
                </div>
              </div>

              {/* Action Buttons: Primary Send Enquiry + WhatsApp + Call */}
              <div className="space-y-3 pt-1">
                <button
                  onClick={() => setShowBookingModal(true)}
                  className="w-full py-4 px-8 rounded-2xl bg-[#0F4C45] hover:bg-[#0B3B35] text-white font-bold text-base shadow-lg transition-all cursor-pointer flex items-center justify-center gap-3 border border-emerald-600/20 active:scale-98"
                >
                  <Send className="w-5 h-5 text-[#D4B66E]" />
                  <span>Send Enquiry</span>
                </button>

                <div className="grid grid-cols-2 gap-3">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-3.5 px-6 rounded-2xl bg-[#25D366] hover:bg-emerald-600 text-white font-bold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4.5 h-4.5 fill-white" />
                    <span>WhatsApp</span>
                  </a>

                  <a
                    href={phoneUrl}
                    className="py-3.5 px-6 rounded-2xl bg-white border border-[#0F4C45] hover:bg-emerald-50 text-[#0F4C45] font-bold text-sm shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Phone className="w-4.5 h-4.5" />
                    <span>Call Studio</span>
                  </a>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* C. PRODUCT DETAILS SECTION (DESKTOP) */}
        <div className="grid grid-cols-12 gap-8 items-start">
          
          {/* About & Story */}
          <div className="col-span-7 bg-white rounded-3xl p-7 border border-gold/20 shadow-md space-y-4">
            <h3 className="font-serif font-bold text-2xl text-charcoal border-b border-gold/10 pb-3 flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-[#C8A96A]" />
              <span>About this Collection</span>
            </h3>

            <div className="space-y-3 text-sm text-charcoal/80 leading-relaxed">
              <p>
                {collection.story || collection.description || "Inspired by centuries of royal Indian craftsmanship, this signature collection features hand-woven silk, intricate zardozi embroidery, and rich velvet drapes tailored for modern luxury weddings."}
              </p>
              <p>
                Every ensemble includes bespoke fitting adjustments, pre-event trial options, and professional garment care.
              </p>
            </div>

            <div className="pt-3 border-t border-gold/10 space-y-2.5">
              <h4 className="font-bold text-xs text-[#0F4C45] uppercase tracking-wider">Set Inclusions:</h4>
              <div className="grid grid-cols-2 gap-3">
                {(collection.includes || ["Heavy Embroidered Lehenga / Sherwani Skirt", "Custom Tailored Blouse / Jacket", "Double Net / Silk Dupatta", "Matching Accessories / Latkan"]).map((inc, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 bg-[#FAF7F2] p-3 rounded-xl border border-gold/15 text-xs text-charcoal font-medium">
                    <Check className="w-4 h-4 text-[#0F4C45] shrink-0" />
                    <span>{inc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* D. RENTAL POLICIES SECTION (DEDICATED DESKTOP CARD) */}
          <div className="col-span-5 bg-white rounded-3xl p-7 border border-gold/20 shadow-md space-y-4">
            <h3 className="font-serif font-bold text-xl text-charcoal border-b border-gold/10 pb-3 flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-[#0F4C45]" />
              <span>Rental Policies</span>
            </h3>

            <div className="space-y-3.5 text-xs text-charcoal/80">
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#FAF7F2] border border-gold/15">
                <Clock className="w-4 h-4 text-[#0F4C45] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-charcoal block">Standard 3 Days Rental</span>
                  <span className="text-charcoal/60 text-[11px]">Pick up 1 day before event, return 1 day after event.</span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#FAF7F2] border border-gold/15">
                <ShieldCheck className="w-4 h-4 text-[#0F4C45] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-charcoal block">Refundable Security Deposit</span>
                  <span className="text-charcoal/60 text-[11px]">Returned within 24 hours upon garment inspection.</span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#FAF7F2] border border-gold/15">
                <Sliders className="w-4 h-4 text-[#0F4C45] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-charcoal block">Alterations &amp; Custom Fitting</span>
                  <span className="text-charcoal/60 text-[11px]">Bespoke waist &amp; bust alterations included prior to pickup.</span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#FAF7F2] border border-gold/15">
                <AlertCircle className="w-4 h-4 text-[#0F4C45] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-charcoal block">Dry Cleaning &amp; Damage Policy</span>
                  <span className="text-charcoal/60 text-[11px]">Professional eco dry cleaning included. Minor wear covered.</span>
                </div>
              </div>
            </div>
          </div>

        </div>



        {/* F. CLIENT REVIEWS SECTION (DESKTOP) */}
        <div className="bg-white rounded-3xl p-8 border border-gold/20 shadow-md space-y-8">
          <div className="flex items-center justify-between border-b border-gold/10 pb-5">
            <div>
              <h3 className="font-serif font-bold text-2xl text-charcoal">Client Reviews &amp; Ratings</h3>
              <p className="text-xs text-charcoal/60 mt-1">Real feedback from brides &amp; customers who wore this set</p>
            </div>

            <div className="flex items-center gap-3 bg-[#FAF7F2] border border-gold/25 px-5 py-2.5 rounded-2xl">
              <Star className="w-6 h-6 fill-[#C8A96A] text-[#C8A96A]" />
              <div>
                <span className="font-bold text-xl text-charcoal">{avgRating}</span>
                <span className="text-xs text-charcoal/60 block font-medium">Out of 5 Stars ({reviewsList.length} reviews)</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-8 items-start">
            
            {/* Reviews List */}
            <div className="col-span-7 space-y-4">
              {reviewsList.map((rev) => (
                <div key={rev.id} className="bg-[#FAF7F2] rounded-2xl p-5 border border-gold/15 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-[#0F4C45]/10 border border-[#0F4C45]/20 flex items-center justify-center font-bold text-sm text-[#0F4C45]">
                        {rev.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-charcoal">{rev.name}</span>
                          {rev.verified && (
                            <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full font-bold flex items-center gap-0.5">
                              <UserCheck className="w-3 h-3" /> Verified Bride
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-charcoal/50">{rev.date}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className={`w-4 h-4 ${s <= rev.rating ? "fill-[#C8A96A] text-[#C8A96A]" : "text-gray-300"}`} />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-charcoal/80 leading-relaxed font-normal pt-1">
                    "{rev.comment}"
                  </p>
                </div>
              ))}
            </div>

            {/* Write a Review Form */}
            <div className="col-span-5 bg-[#FAF7F2] rounded-2xl p-6 border border-gold/20 space-y-4">
              <h4 className="font-serif font-bold text-lg text-[#0F4C45]">Write a Customer Review</h4>

              {reviewSuccessMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-bold flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Thank you! Your review has been published.</span>
                </div>
              )}

              <form onSubmit={handleAddReview} className="space-y-3.5">
                <div>
                  <label className="text-xs font-bold text-charcoal/70 uppercase tracking-wider block mb-1">Your Rating</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRatingInput(star)}
                        className="p-1 cursor-pointer transition-transform hover:scale-125"
                      >
                        <Star className={`w-6 h-6 ${star <= ratingInput ? "fill-[#C8A96A] text-[#C8A96A]" : "text-gray-300"}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-charcoal/70 uppercase tracking-wider block mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Ananya Ramesh"
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    className="w-full bg-white border border-gold/20 rounded-xl p-3 text-xs text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:border-[#0F4C45]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-charcoal/70 uppercase tracking-wider block mb-1">Your Review</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Share details about fitting, fabric quality, and rental experience..."
                    value={reviewerComment}
                    onChange={(e) => setReviewerComment(e.target.value)}
                    className="w-full bg-white border border-gold/20 rounded-xl p-3 text-xs text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:border-[#0F4C45] resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-[#0F4C45] hover:bg-[#0B3B35] text-white font-bold text-xs shadow-md transition-all cursor-pointer uppercase tracking-wider"
                >
                  Submit Review
                </button>
              </form>
            </div>

          </div>
        </div>

        {/* G. RELATED COLLECTIONS (DESKTOP GRID) */}
        {similarCollections.length > 0 && (
          <section className="space-y-5 pt-4 border-t border-gold/15">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-2xl text-charcoal">Related Collections</h3>
                <p className="text-xs text-charcoal/60">More signature couture ensembles from our featured studios</p>
              </div>

              <Link href="/collections" className="text-xs font-bold text-[#0F4C45] hover:underline flex items-center gap-1">
                <span>Browse All Collections</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-4 gap-6">
              {similarCollections.map((item) => (
                <Link
                  key={item.id}
                  href={`/collections/${item.id}`}
                  className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden shadow-md group cursor-pointer border border-gold/20 hover:border-[#0F4C45] hover:shadow-2xl transition-all duration-500 block"
                >
                  <img
                    src={item.coverImage}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent transition-opacity group-hover:from-black/95" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 flex flex-col justify-end text-left z-10 space-y-0.5">
                    <span className="text-[10px] font-bold text-[#D4B66E] uppercase tracking-[0.2em]">
                      {(item.location || "KERALA").toUpperCase()}
                    </span>
                    <h4 className="font-serif font-bold text-sm text-white uppercase tracking-wider leading-snug line-clamp-2 drop-shadow-xs">
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

      </div>


      {/* ══════════════════════════════════════════════════════════════════════
          3. DESKTOP STICKY CTA BAR (ALWAYS VISIBLE WHILE SCROLLING ON DESKTOP)
          ══════════════════════════════════════════════════════════════════════ */}
      <div className="hidden lg:block fixed bottom-0 left-0 right-0 z-40 bg-white/98 backdrop-blur-md border-t border-gold/20 py-3.5 px-8 shadow-2xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={collection.coverImage}
              alt={collection.name}
              className="w-12 h-12 rounded-xl object-cover border border-gold/20"
            />
            <div>
              <h4 className="font-serif font-bold text-sm text-charcoal line-clamp-1">{collection.name}</h4>
              <p className="text-xs text-[#0F4C45] font-bold">{boutique.name} • {formattedCity}</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <span className="text-[10px] font-bold text-charcoal/50 uppercase tracking-widest block">Rental Price</span>
              <span className="font-serif font-extrabold text-xl text-[#0F4C45]">{collection.rentalPrice || collection.priceRange || "₹24,500"}</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowBookingModal(true)}
                className="py-3 px-6 rounded-xl bg-[#0F4C45] hover:bg-[#0B3B35] text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-2"
              >
                <Send className="w-4 h-4 text-[#D4B66E]" />
                <span>Send Enquiry</span>
              </button>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-5 rounded-xl bg-[#25D366] hover:bg-emerald-600 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>WhatsApp</span>
              </a>

              <a
                href={phoneUrl}
                className="p-3 rounded-xl bg-white border border-[#0F4C45] hover:bg-emerald-50 text-[#0F4C45] font-bold shadow-xs transition-all cursor-pointer"
                title="Call Studio"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>


      {/* ══════════════════════════════════════════════════════════════════════
          4. COMMON MODALS (LIGHTBOX & SEND ENQUIRY MODAL)
          ══════════════════════════════════════════════════════════════════════ */}
      
      {/* Lightbox Modal */}
      {lightboxImage && (
        <div
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
        >
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute top-6 right-6 w-11 h-11 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition-all cursor-pointer z-50"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={lightboxImage}
            alt="Enlarged Photo"
            className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl"
          />
        </div>
      )}

      {/* Send Enquiry Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full border border-gold/30 p-6 space-y-4 text-charcoal relative shadow-2xl">
            <button
              onClick={() => setShowBookingModal(false)}
              className="absolute top-4 right-4 text-charcoal/60 hover:text-charcoal font-bold text-sm cursor-pointer"
            >
              ✕
            </button>

            <h3 className="font-serif font-bold text-xl text-[#0F4C45]">Send Event Enquiry</h3>
            <p className="text-xs text-charcoal/70">
              Select your wedding or event date to send a direct enquiry to {boutique.name}.
            </p>

            {bookingSent ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 font-bold space-y-2">
                <p>✓ Enquiry Sent Successfully!</p>
                <p className="font-normal text-charcoal/80">
                  {boutique.name} has received your enquiry for {bookingDate}. Their concierge team will contact you shortly.
                </p>
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="mt-2 w-full py-2 bg-[#0F4C45] text-white rounded-xl font-bold"
                >
                  Close
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-charcoal/70 block mb-1">
                    Event / Wedding Date
                  </label>
                  <input
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl p-3 text-xs text-charcoal focus:outline-none focus:border-[#0F4C45]"
                  />
                </div>

                <button
                  onClick={() => {
                    if (!bookingDate) return;
                    setBookingSent(true);
                  }}
                  className="w-full py-3.5 bg-[#0F4C45] hover:bg-[#0B3B35] text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4 text-[#D4B66E]" />
                  <span>Send Enquiry Now</span>
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
