"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Share2,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  MessageCircle
} from "lucide-react";
import { WishlistButton } from "@/components/WishlistButton";
import { Footer } from "@/components/Footer";

interface OutfitDetailProps {
  outfit: {
    id: string | number;
    name: string;
    category?: string;
    image: string;
    gallery?: string[];
    price?: string;
    description?: string;
    fabric?: string;
    sizes?: string[];
    rentalAvailable?: boolean;
    rentalDuration?: string;
    workType?: string;
  };
  collection: {
    id: string | number;
    name: string;
  };
  boutique: {
    id: string | number;
    name: string;
    city?: string;
    address?: string;
    whatsappNumber?: string;
    phoneNumber?: string;
    slug?: string;
  };
  moreOutfits?: Array<{
    id: string | number;
    name: string;
    image: string;
    category?: string;
    price?: string;
  }>;
}

export function OutfitDetailClient({
  outfit,
  collection,
  boutique,
  moreOutfits = []
}: OutfitDetailProps) {
  const galleryImages = outfit.gallery && outfit.gallery.length > 0 
    ? outfit.gallery 
    : [
        outfit.image,
        "https://images.unsplash.com/photo-1546804764-9147f7157769?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop"
      ];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [openAccordion, setOpenAccordion] = useState<string | null>("details");
  const [isCopied, setIsCopied] = useState(false);

  const formattedCity = boutique.city || boutique.address?.split(",").pop()?.trim() || "Kerala";
  const whatsappUrl = `https://wa.me/${(boutique.whatsappNumber || "919000000000").replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
    `Hi ${boutique.name}, I am interested in your outfit "${outfit.name}" from ${collection.name} on Cloche!`
  )}`;

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

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-charcoal pb-24 lg:pb-12">
      
      {/* ── TOP NAV BAR ── */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
          <Link
            href={`/collections/${collection.id}`}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0F4C45]/10 text-[#0F4C45] hover:bg-[#0F4C45] hover:text-white transition-all text-xs font-bold shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Collection</span>
          </Link>

          <div className="text-center truncate hidden sm:block">
            <p className="text-xs text-charcoal/60 truncate">
              {collection.name} • {boutique.name}
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
                id: String(outfit.id),
                product_name: outfit.name,
                boutique_name: boutique.name,
                category: outfit.category || "Outfit",
                price: outfit.price || 0,
                image_url: outfit.image
              } as any}
            />
          </div>
        </div>
      </header>

      {/* ── MAIN WEDMEGOOD DETAIL CONTAINER ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-10 space-y-10">
        
        {/* DESKTOP & MOBILE DETAIL LAYOUT - COMPACT LAPTOP HERO */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* LEFT SIDE: TALL PORTRAIT MAIN IMAGE - CONSTRAINED MAX HEIGHT ON LAPTOP */}
          <div className="lg:col-span-6 xl:col-span-6 flex justify-center">
            <div className="relative aspect-[3/4] w-full max-w-md lg:max-w-none max-h-[460px] sm:max-h-[500px] lg:max-h-[460px] xl:max-h-[500px] rounded-2xl overflow-hidden bg-charcoal/5 shadow-xs border border-gray-200 group flex items-center justify-center">
              <img
                src={galleryImages[activeImageIndex] || outfit.image}
                alt={outfit.name}
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
                {outfit.name}
              </p>

              <h1 className="font-bold text-xl sm:text-2xl text-charcoal">
                {boutique.name}
              </h1>

              <p className="text-xs text-charcoal/50 font-medium">
                {formattedCity}
              </p>

              <p className="font-bold text-2xl text-charcoal pt-1">
                {outfit.price || "₹4,47,500"}
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
                      {outfit.description || "Handcrafted couture outfit with intricate threadwork embroidery, premium lining, and custom trial session guaranteed."}
                    </p>
                    <p><span className="font-bold text-charcoal">Category:</span> {outfit.category || "Bridal Lehenga"}</p>
                    <p><span className="font-bold text-charcoal">Collection:</span> {collection.name}</p>
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
                    <p><span className="font-bold text-charcoal">Primary Fabric:</span> {outfit.fabric || "Pure Raw Silk & Organza"}</p>
                    <p><span className="font-bold text-charcoal">Embroidery Work:</span> {outfit.workType || "Hand Zardozi & Threadwork"}</p>
                    <p><span className="font-bold text-charcoal">Lining & Fitting:</span> Custom Atelier Fitting Provided</p>
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

        {/* MORE FROM THIS COLLECTION - COMPACT CARDS */}
        {moreOutfits.length > 0 && (
          <section className="border-t border-gray-200 pt-6 space-y-4">
            <h2 className="font-bold text-base sm:text-lg text-charcoal">
              More from {collection.name}
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
              {moreOutfits.map(item => (
                <Link
                  key={item.id}
                  href={`/collections/${collection.id}/outfits/${item.id}`}
                  className="group bg-[#FAF7F2] rounded-xl overflow-hidden border border-gold/15 hover:border-[#0F4C45]/40 shadow-2xs hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col justify-between block"
                >
                  <div>
                    <div className="relative aspect-[3/4] max-h-[220px] sm:max-h-[250px] w-full overflow-hidden bg-charcoal/5">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 max-h-[250px]"
                      />
                    </div>
                    <div className="p-2.5 space-y-0.5">
                      <h3 className="font-bold text-xs text-charcoal group-hover:text-[#0F4C45] transition-colors line-clamp-1">
                        {item.name}
                      </h3>
                      {item.price && (
                        <p className="text-xs font-bold text-[#0F4C45] pt-0.5">
                          {item.price}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
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
