"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Share2,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  Phone,
  MapPin,
  Eye,
  Filter
} from "lucide-react";
import { WishlistButton } from "@/components/WishlistButton";
import { BookingModal } from "@/components/BookingModal";
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
    idealFor?: string[];
    customStitching?: boolean;
    rentalAvailable?: boolean;
    deliveryTime?: string;
    languages?: string[];
    lastUpdated?: string;
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
  }>;
}

export function CollectionDetailClient({
  collection,
  boutique,
  similarCollections = []
}: CollectionDetailProps) {
  // ── 1. STATE ──
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState("All");
  const [openAccordion, setOpenAccordion] = useState<string | null>("details");
  const [isCopied, setIsCopied] = useState(false);

  // Derive outfits array safely
  const rawOutfits: OutfitItem[] = useMemo(() => {
    if (collection.outfits && collection.outfits.length > 0) {
      return collection.outfits;
    }
    return [
      {
        id: "outfit-1",
        name: `${collection.name} - Royal Zardozi Velvet Outfit`,
        category: "Bride",
        image: collection.coverImage || "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=800&auto=format&fit=crop",
        price: "₹24,500 / 3 Days",
        description: "Hand-crafted zardozi and raw silk ensemble featuring intricate dabka threadwork.",
        fabric: "Velvet & Raw Silk",
        sizes: ["S", "M", "L", "Custom Fit"],
        rentalAvailable: true
      },
      {
        id: "outfit-2",
        name: `${collection.name} - Pastel Silk Ceremonial Gown`,
        category: "Reception",
        image: "https://images.unsplash.com/photo-1546804764-9147f7157769?q=80&w=800&auto=format&fit=crop",
        price: "₹18,000 / 3 Days",
        description: "Elegant pastel silk gown with crystal embellishments and lightweight trail.",
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
        description: "Traditional heritage red lehenga with gota patti and hand-embroidered dupatta.",
        fabric: "Raw Silk & Net",
        sizes: ["M", "L", "XL", "Custom Fit"],
        rentalAvailable: true
      },
      {
        id: "outfit-4",
        name: `${collection.name} - Indo-Western Sangeet Ensemble`,
        category: "Engagement",
        image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop",
        price: "₹15,500 / 3 Days",
        description: "Contemporary drape jacket paired with flared pants for evening celebrations.",
        fabric: "Georgette & Satin",
        sizes: ["S", "M", "Custom Fit"],
        rentalAvailable: true
      }
    ];
  }, [collection]);

  // Gallery photos array
  const galleryImages = useMemo(() => {
    const images = [collection.coverImage];
    rawOutfits.forEach(o => {
      if (o.image && !images.includes(o.image)) {
        images.push(o.image);
      }
    });
    return images.filter(Boolean);
  }, [collection.coverImage, rawOutfits]);

  // Category filter chips
  const categoryChips = ["All", "Bride", "Groom", "Reception", "Engagement", "Haldi", "Mehendi", "Accessories"];

  // Filtered outfits logic
  const filteredOutfits = useMemo(() => {
    if (activeCategoryFilter === "All") return rawOutfits;
    return rawOutfits.filter(o => 
      (o.category || "").toLowerCase().includes(activeCategoryFilter.toLowerCase())
    );
  }, [rawOutfits, activeCategoryFilter]);

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

  const toggleAccordion = (section: string) => {
    setOpenAccordion(prev => (prev === section ? null : section));
  };

  const formattedCity = boutique.city || boutique.address?.split(",").pop()?.trim() || "Kerala";
  const whatsappUrl = `https://wa.me/${(boutique.whatsappNumber || "919000000000").replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
    `Hi ${boutique.name}, I am interested in your collection "${collection.name}" on Cloche!`
  )}`;

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-charcoal pb-24 lg:pb-12">
      
      {/* ── TOP NAV BAR ── */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          <Link
            href={`/boutiques/${boutique.slug || boutique.id || "studio"}`}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0F4C45]/10 text-[#0F4C45] hover:bg-[#0F4C45] hover:text-white transition-all text-xs font-bold shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Studio</span>
          </Link>

          <div className="text-center truncate hidden sm:block">
            <h1 className="font-serif font-bold text-base text-charcoal truncate">
              {collection.name}
            </h1>
            <p className="text-[11px] text-charcoal/60 truncate">
              By {boutique.name} • {formattedCity}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-full border border-gray-200 text-charcoal hover:bg-gray-100 transition-colors relative cursor-pointer"
              title="Share"
            >
              <Share2 className="w-4 h-4" />
              {isCopied && (
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-charcoal text-white text-[10px] px-2 py-0.5 rounded shadow-md whitespace-nowrap">
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
      </header>

      {/* ── MAIN WEDMEGOOD DETAIL CONTAINER ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-8 pb-12 space-y-12">
        
        {/* DESKTOP & MOBILE DETAIL HERO LAYOUT (MATCHING IMAGE 1 & IMAGE 2) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT SIDE: TALL PORTRAIT MAIN IMAGE + NEXT BUTTON (MATCHING IMAGE 1 & IMAGE 2) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative aspect-[3/4] w-full max-w-xl mx-auto rounded-2xl overflow-hidden bg-charcoal/5 shadow-xs border border-gray-200 group">
              <img
                src={galleryImages[activeImageIndex] || collection.coverImage}
                alt={collection.name}
                className="w-full h-full object-cover"
              />

              {/* Next Image Floating Arrow Button on Right Edge (Matching Image 1) */}
              {galleryImages.length > 1 && (
                <button
                  onClick={handleNextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-md flex items-center justify-center text-charcoal hover:bg-white hover:scale-110 transition-all cursor-pointer z-10"
                  title="Next Photo"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}

              {/* Mobile Carousel Indicators (Matching Image 2) */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10 sm:hidden">
                {galleryImages.map((_, idx) => (
                  <span
                    key={idx}
                    className={`w-2 h-2 rounded-full transition-all ${
                      activeImageIndex === idx ? "bg-white w-4" : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: THUMBNAILS, STACKED TEXT & ACCORDIONS (MATCHING IMAGE 1 & IMAGE 2) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Horizontal Thumbnail Strip (Desktop - Matching Image 1 Top Right) */}
            {galleryImages.length > 1 && (
              <div className="hidden lg:flex items-center gap-3 overflow-x-auto pb-2">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative aspect-[3/4] w-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                      activeImageIndex === idx
                        ? "border-[#64D264] ring-2 ring-[#64D264]/20 scale-105"
                        : "border-gray-200 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Stacked Product Information Block (Matching Image 1 & 2) */}
            <div className="space-y-1">
              <p className="text-xs sm:text-sm text-charcoal/60 font-medium">
                {collection.name}
              </p>

              <h1 className="font-bold text-xl sm:text-2xl text-charcoal">
                {boutique.name}
              </h1>

              <p className="text-xs text-charcoal/50 font-medium">
                {formattedCity}
              </p>

              <p className="font-bold text-2xl text-charcoal pt-2">
                {collection.priceRange || "₹4,47,500"}
              </p>
            </div>

            {/* Desktop Action Button: Bright Green Pill Button (Matching Image 1) */}
            <div className="hidden sm:block pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 w-full py-3.5 px-6 rounded-full bg-[#64D264] hover:bg-[#52C052] text-white font-bold text-sm sm:text-base shadow-md transition-all cursor-pointer"
              >
                <MessageCircle className="w-5 h-5 fill-white text-[#64D264]" />
                <span>Chat with Designer</span>
              </a>
            </div>

            {/* Divider Line (Matching Image 1 & 2) */}
            <div className="border-t border-gray-200 pt-4 space-y-3">
              
              {/* Accordion 1: Product Details */}
              <div className="border-b border-gray-100 pb-3">
                <button
                  onClick={() => toggleAccordion("details")}
                  className="w-full flex items-center justify-between py-2 text-left font-bold text-sm text-charcoal cursor-pointer"
                >
                  <span>Product Details</span>
                  {openAccordion === "details" ? (
                    <ChevronUp className="w-4 h-4 text-charcoal/60" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-charcoal/60" />
                  )}
                </button>

                {openAccordion === "details" && (
                  <div className="pt-2 text-xs text-charcoal/80 leading-relaxed font-normal space-y-2">
                    <p>
                      {collection.story || collection.description || "Inspired by regal Indian heritage, this exclusive collection brings together centuries of embroidery craftsmanship with contemporary silhouettes."}
                    </p>
                    <p><span className="font-bold text-charcoal">Ideal For:</span> {collection.idealFor?.join(", ") || "Bride, Reception, Sangeet, Engagement"}</p>
                    <p><span className="font-bold text-charcoal">Outfits Available:</span> {rawOutfits.length} Signature Pieces</p>
                  </div>
                )}
              </div>

              {/* Accordion 2: Fabric Details */}
              <div className="border-b border-gray-100 pb-3">
                <button
                  onClick={() => toggleAccordion("fabric")}
                  className="w-full flex items-center justify-between py-2 text-left font-bold text-sm text-charcoal cursor-pointer"
                >
                  <span>Fabric details</span>
                  {openAccordion === "fabric" ? (
                    <ChevronUp className="w-4 h-4 text-charcoal/60" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-charcoal/60" />
                  )}
                </button>

                {openAccordion === "fabric" && (
                  <div className="pt-2 text-xs text-charcoal/80 leading-relaxed font-normal space-y-1">
                    <p><span className="font-bold text-charcoal">Craftsmanship:</span> Authentic Zardozi & Threadwork Embroidery</p>
                    <p><span className="font-bold text-charcoal">Material:</span> Pure Raw Silk, Organza & Micro Velvet</p>
                    <p><span className="font-bold text-charcoal">Service:</span> Custom Tailoring & Fitting Included</p>
                  </div>
                )}
              </div>

              {/* Accordion 3: How to order? (Matching Image 1 & 2) */}
              <div className="pb-2">
                <button
                  onClick={() => toggleAccordion("order")}
                  className="w-full flex items-center justify-between py-2 text-left font-bold text-sm text-charcoal cursor-pointer"
                >
                  <span>How to order?</span>
                  {openAccordion === "order" ? (
                    <ChevronUp className="w-4 h-4 text-charcoal/60" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-charcoal/60" />
                  )}
                </button>

                {openAccordion === "order" && (
                  <div className="pt-2 text-xs text-charcoal/80 leading-relaxed font-normal">
                    <p>Use the "Chat with Designer" button to get in touch with the designer.</p>
                  </div>
                )}
              </div>

            </div>

          </div>
        </div>

        {/* ── OUTFIT GALLERY GRID (DESKTOP 4 COLS, TABLET 3 COLS, MOBILE 2 COLS) ── */}
        <section className="border-t border-gray-200 pt-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-bold text-xl text-charcoal flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#0F4C45]" /> Collection Outfits ({filteredOutfits.length})
              </h2>
            </div>

            {/* Filter Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {categoryChips.map(chip => (
                <button
                  key={chip}
                  onClick={() => setActiveCategoryFilter(chip)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    activeCategoryFilter === chip
                      ? "bg-[#0F4C45] text-white shadow-xs"
                      : "bg-[#FAF7F2] text-charcoal/70 border border-gold/20 hover:border-gold"
                  }`}
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5">
            {filteredOutfits.map(outfit => (
              <Link
                key={outfit.id}
                href={`/collections/${collection.id}/outfits/${outfit.id}`}
                className="group bg-[#FAF7F2] rounded-2xl overflow-hidden border border-gold/15 hover:border-[#0F4C45]/40 shadow-xs hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col justify-between block"
              >
                <div>
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-charcoal/5">
                    <img
                      src={outfit.image}
                      alt={outfit.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-white/20">
                      {outfit.category}
                    </span>

                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="bg-white/90 backdrop-blur-md text-charcoal font-bold text-xs px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5 text-[#0F4C45]" /> View Outfit
                      </span>
                    </div>
                  </div>

                  <div className="p-3 space-y-1">
                    <p className="text-xs font-bold text-charcoal group-hover:text-[#0F4C45] transition-colors line-clamp-1">
                      {outfit.name}
                    </p>
                    <p className="text-[11px] text-charcoal/60 line-clamp-1 font-medium">
                      {outfit.fabric || "Bespoke Couture"}
                    </p>
                    {outfit.price && (
                      <p className="text-xs sm:text-sm font-bold text-[#0F4C45] pt-0.5">
                        {outfit.price}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

      </main>

      {/* ── MOBILE STICKY BOTTOM BUTTON (MATCHING IMAGE 2) ── */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-white border-t border-gray-200 p-3 sm:hidden shadow-lg">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-full bg-[#64D264] hover:bg-[#52C052] text-white font-bold text-sm shadow-md transition-all cursor-pointer"
        >
          <MessageCircle className="w-5 h-5 fill-white text-[#64D264]" />
          <span>Chat with Designer</span>
        </a>
      </div>

      <Footer />
    </div>
  );
}
