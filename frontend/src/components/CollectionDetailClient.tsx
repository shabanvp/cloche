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
  Eye
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
    const images: string[] = [];
    if (collection.coverImage) images.push(collection.coverImage);
    rawOutfits.forEach(o => {
      if (o.image && !images.includes(o.image)) {
        images.push(o.image);
      }
    });
    // Add working fallbacks if count is small
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-10 space-y-10">
        
        {/* DESKTOP & MOBILE DETAIL HERO LAYOUT - COMPACT LAPTOP VIEW */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* LEFT SIDE: TALL PORTRAIT MAIN IMAGE - CONSTRAINED MAX HEIGHT ON LAPTOP */}
          <div className="lg:col-span-6 xl:col-span-6 flex justify-center">
            <div className="relative aspect-[3/4] w-full max-w-md lg:max-w-none max-h-[460px] sm:max-h-[500px] lg:max-h-[460px] xl:max-h-[500px] rounded-2xl overflow-hidden bg-charcoal/5 shadow-xs border border-gray-200 group flex items-center justify-center">
              <img
                src={galleryImages[activeImageIndex] || collection.coverImage}
                alt={collection.name}
                className="w-full h-full object-cover max-h-[500px]"
              />

              {/* Next Image Floating Arrow Button on Right Edge */}
              {galleryImages.length > 1 && (
                <button
                  onClick={handleNextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 shadow-md flex items-center justify-center text-charcoal hover:bg-white hover:scale-110 transition-all cursor-pointer z-10"
                  title="Next Photo"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}

              {/* Mobile Carousel Indicators */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10 sm:hidden">
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

          {/* RIGHT SIDE: THUMBNAILS, STACKED TEXT & ACCORDIONS */}
          <div className="lg:col-span-6 xl:col-span-6 space-y-4">
            
            {/* Horizontal Thumbnail Strip (Desktop) */}
            {galleryImages.length > 1 && (
              <div className="hidden lg:flex items-center gap-2.5 overflow-x-auto pb-1">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative aspect-[3/4] w-16 sm:w-18 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
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

            {/* Stacked Product Information Block */}
            <div className="space-y-0.5">
              <p className="text-xs text-charcoal/60 font-medium">
                {collection.name}
              </p>

              <h1 className="font-bold text-xl sm:text-2xl text-charcoal">
                {boutique.name}
              </h1>

              <p className="text-xs text-charcoal/50 font-medium">
                {formattedCity}
              </p>

              <p className="font-bold text-2xl text-charcoal pt-1">
                {collection.priceRange || "₹4,47,500"}
              </p>
            </div>

            {/* Desktop Action Button: Bright Green Pill Button */}
            <div className="hidden sm:block pt-1">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full py-3 px-6 rounded-full bg-[#64D264] hover:bg-[#52C052] text-white font-bold text-sm shadow-md transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-white text-[#64D264]" />
                <span>Chat with Designer</span>
              </a>
            </div>

            {/* Divider Line & Accordions */}
            <div className="border-t border-gray-200 pt-3 space-y-2">
              
              {/* Accordion 1: Product Details */}
              <div className="border-b border-gray-100 pb-2">
                <button
                  onClick={() => toggleAccordion("details")}
                  className="w-full flex items-center justify-between py-1.5 text-left font-bold text-xs sm:text-sm text-charcoal cursor-pointer"
                >
                  <span>Product Details</span>
                  {openAccordion === "details" ? (
                    <ChevronUp className="w-4 h-4 text-charcoal/60" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-charcoal/60" />
                  )}
                </button>

                {openAccordion === "details" && (
                  <div className="pt-1.5 text-xs text-charcoal/80 leading-relaxed font-normal space-y-1">
                    <p>
                      {collection.story || collection.description || "Inspired by regal Indian heritage, this exclusive collection brings together centuries of embroidery craftsmanship with contemporary silhouettes."}
                    </p>
                    <p><span className="font-bold text-charcoal">Ideal For:</span> {collection.idealFor?.join(", ") || "Bride, Reception, Sangeet, Engagement"}</p>
                    <p><span className="font-bold text-charcoal">Outfits Available:</span> {rawOutfits.length} Signature Pieces</p>
                  </div>
                )}
              </div>

              {/* Accordion 2: Fabric Details */}
              <div className="border-b border-gray-100 pb-2">
                <button
                  onClick={() => toggleAccordion("fabric")}
                  className="w-full flex items-center justify-between py-1.5 text-left font-bold text-xs sm:text-sm text-charcoal cursor-pointer"
                >
                  <span>Fabric details</span>
                  {openAccordion === "fabric" ? (
                    <ChevronUp className="w-4 h-4 text-charcoal/60" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-charcoal/60" />
                  )}
                </button>

                {openAccordion === "fabric" && (
                  <div className="pt-1.5 text-xs text-charcoal/80 leading-relaxed font-normal space-y-1">
                    <p><span className="font-bold text-charcoal">Craftsmanship:</span> Authentic Zardozi & Threadwork Embroidery</p>
                    <p><span className="font-bold text-charcoal">Material:</span> Pure Raw Silk, Organza & Micro Velvet</p>
                    <p><span className="font-bold text-charcoal">Service:</span> Custom Tailoring & Fitting Included</p>
                  </div>
                )}
              </div>

              {/* Accordion 3: How to order? */}
              <div className="pb-1">
                <button
                  onClick={() => toggleAccordion("order")}
                  className="w-full flex items-center justify-between py-1.5 text-left font-bold text-xs sm:text-sm text-charcoal cursor-pointer"
                >
                  <span>How to order?</span>
                  {openAccordion === "order" ? (
                    <ChevronUp className="w-4 h-4 text-charcoal/60" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-charcoal/60" />
                  )}
                </button>

                {openAccordion === "order" && (
                  <div className="pt-1.5 text-xs text-charcoal/80 leading-relaxed font-normal">
                    <p>Use the "Chat with Designer" button to get in touch with the designer.</p>
                  </div>
                )}
              </div>

            </div>

          </div>
        </div>

        {/* ── OUTFIT GALLERY GRID (COMPACT OUTFIT CARDS, NO FILTER CHIPS) ── */}
        <section className="border-t border-gray-200 pt-6 space-y-4">
          <div>
            <h2 className="font-bold text-base sm:text-lg text-charcoal">
              Collection Outfits ({rawOutfits.length})
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
            {rawOutfits.map(outfit => (
              <Link
                key={outfit.id}
                href={`/collections/${collection.id}/outfits/${outfit.id}`}
                className="group bg-[#FAF7F2] rounded-xl overflow-hidden border border-gold/15 hover:border-[#0F4C45]/40 shadow-2xs hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col justify-between block"
              >
                <div>
                  <div className="relative aspect-[3/4] max-h-[220px] sm:max-h-[250px] w-full overflow-hidden bg-charcoal/5">
                    <img
                      src={outfit.image}
                      alt={outfit.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 max-h-[250px]"
                    />
                    <span className="absolute top-2 left-2 bg-black/60 backdrop-blur-md text-white text-[9px] font-bold px-2 py-0.5 rounded-full border border-white/20">
                      {outfit.category}
                    </span>

                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="bg-white/90 backdrop-blur-md text-charcoal font-bold text-[11px] px-2.5 py-1 rounded-full shadow-xs flex items-center gap-1">
                        <Eye className="w-3 h-3 text-[#0F4C45]" /> View
                      </span>
                    </div>
                  </div>

                  <div className="p-2.5 space-y-0.5">
                    <p className="text-xs font-bold text-charcoal group-hover:text-[#0F4C45] transition-colors line-clamp-1">
                      {outfit.name}
                    </p>
                    <p className="text-[10px] text-charcoal/60 line-clamp-1 font-medium">
                      {outfit.fabric || "Bespoke Couture"}
                    </p>
                    {outfit.price && (
                      <p className="text-xs font-bold text-[#0F4C45] pt-0.5">
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

      {/* ── MOBILE STICKY BOTTOM BUTTON ── */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-white border-t border-gray-200 p-3 sm:hidden shadow-lg">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 w-full py-3 px-6 rounded-full bg-[#64D264] hover:bg-[#52C052] text-white font-bold text-sm shadow-md transition-all cursor-pointer"
        >
          <MessageCircle className="w-5 h-5 fill-white text-[#64D264]" />
          <span>Chat with Designer</span>
        </a>
      </div>

      <Footer />
    </div>
  );
}
