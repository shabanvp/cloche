"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Heart,
  Share2,
  Calendar,
  Sparkles,
  MapPin,
  CheckCircle2,
  Phone,
  MessageCircle,
  ChevronRight,
  ShieldCheck,
  Award,
  Ruler,
  Clock,
  Truck,
  RotateCcw
} from "lucide-react";
import { WishlistButton } from "@/components/WishlistButton";
import { BookingModal } from "@/components/BookingModal";
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
    : [outfit.image];

  const [activeImage, setActiveImage] = useState(galleryImages[0] || outfit.image);
  const [selectedSize, setSelectedSize] = useState(outfit.sizes?.[0] || "Custom Fit");
  const [isCopied, setIsCopied] = useState(false);

  const formattedCity = boutique.city || boutique.address?.split(",").pop()?.trim() || "Kerala";
  const whatsappUrl = `https://wa.me/${(boutique.whatsappNumber || "919000000000").replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
    `Hi ${boutique.name}, I am interested in renting/purchasing the outfit "${outfit.name}" from your ${collection.name} on Cloche!`
  )}`;

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF8F1] flex flex-col font-sans text-charcoal pb-24 lg:pb-12">
      {/* Sticky Sub-Header */}
      <header className="bg-white border-b border-gold/15 sticky top-0 z-40 shadow-2xs backdrop-blur-md bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          <Link
            href={`/collections/${collection.id}`}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0F4C45]/10 text-[#0F4C45] hover:bg-[#0F4C45] hover:text-white transition-all text-xs font-bold shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Collection</span>
          </Link>

          <div className="text-center truncate hidden sm:block">
            <h1 className="font-serif font-bold text-base text-charcoal truncate">
              {outfit.name}
            </h1>
            <p className="text-[11px] text-charcoal/60 truncate">
              {collection.name} • {boutique.name}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-full border border-gold/20 text-charcoal hover:bg-gold/10 transition-colors relative cursor-pointer"
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

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-10 sm:space-y-12">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-charcoal/60 font-medium overflow-x-auto pb-1 scrollbar-none">
          <Link href="/" className="hover:text-[#0F4C45]">Home</Link>
          <ChevronRight className="w-3 h-3 text-gold" />
          <Link href={`/boutiques/${boutique.slug || boutique.id || "studio"}`} className="hover:text-[#0F4C45]">{boutique.name}</Link>
          <ChevronRight className="w-3 h-3 text-gold" />
          <Link href={`/collections/${collection.id}`} className="hover:text-[#0F4C45]">{collection.name}</Link>
          <ChevronRight className="w-3 h-3 text-gold" />
          <span className="text-charcoal font-bold truncate">{outfit.name}</span>
        </div>

        {/* 2-Column Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Gallery (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative aspect-[3/4] w-full rounded-3xl overflow-hidden bg-white border border-gold/15 shadow-sm">
              <img
                src={activeImage}
                alt={outfit.name}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-3.5 py-1 rounded-full border border-white/20">
                {outfit.category || "Couture"}
              </span>
            </div>

            {galleryImages.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`relative w-20 h-24 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                      activeImage === img ? "border-[#0F4C45] ring-2 ring-[#0F4C45]/20 scale-105" : "border-gold/20 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Outfit Details & Actions (5 Cols) */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-gold/15 shadow-sm space-y-6">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#0F4C45] bg-[#0F4C45]/10 px-3 py-1 rounded-full inline-block mb-2">
                {outfit.category || "Bridal Couture"} • {boutique.name}
              </span>
              <h1 className="font-serif font-bold text-2xl sm:text-3xl text-charcoal">
                {outfit.name}
              </h1>
              <p className="text-xs text-charcoal/60 mt-1 flex items-center gap-1 font-medium">
                <MapPin className="w-3.5 h-3.5 text-[#C8A96A]" /> Available at {boutique.name}, {formattedCity}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-gold/15 space-y-1">
              <span className="text-[10px] uppercase font-bold text-charcoal/50 block">Rental Price Package</span>
              <span className="font-serif font-bold text-2xl text-[#0F4C45] block">
                {outfit.price || "₹18,500 / 3-Day Rental"}
              </span>
              <p className="text-[11px] text-emerald-700 font-bold flex items-center gap-1 pt-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Professional Dry Cleaning & Custom Alterations Included
              </p>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-charcoal flex items-center gap-1.5">
                <Ruler className="w-4 h-4 text-[#C8A96A]" /> Select Size / Fit Option
              </span>
              <div className="flex flex-wrap gap-2">
                {(outfit.sizes || ["S", "M", "L", "XL", "Custom Fit"]).map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      selectedSize === size
                        ? "bg-[#0F4C45] text-white border-[#0F4C45] shadow-xs"
                        : "bg-white text-charcoal/70 border-gold/20 hover:border-gold"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 text-xs border-t border-b border-gold/10 py-4">
              <h3 className="font-serif font-bold text-sm text-charcoal">Description & Craftsmanship</h3>
              <p className="text-charcoal/80 leading-relaxed font-light">
                {outfit.description || "Handcrafted couture outfit with intricate threadwork embroidery, premium lining, and custom trial session guaranteed."}
              </p>
            </div>

            {/* Atelier Guarantees */}
            <dl className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-[#FAF7F2] border border-gold/10">
                <dt className="text-charcoal/50 text-[10px] uppercase font-bold">Fabric</dt>
                <dd className="font-bold text-charcoal pt-0.5">{outfit.fabric || "Pure Raw Silk"}</dd>
              </div>
              <div className="p-3 rounded-xl bg-[#FAF7F2] border border-gold/10">
                <dt className="text-charcoal/50 text-[10px] uppercase font-bold">Embroidery</dt>
                <dd className="font-bold text-charcoal pt-0.5">{outfit.workType || "Hand Zardozi"}</dd>
              </div>
              <div className="p-3 rounded-xl bg-[#FAF7F2] border border-gold/10">
                <dt className="text-charcoal/50 text-[10px] uppercase font-bold">Rental Duration</dt>
                <dd className="font-bold text-charcoal pt-0.5">{outfit.rentalDuration || "3 to 7 Days"}</dd>
              </div>
              <div className="p-3 rounded-xl bg-[#FAF7F2] border border-gold/10">
                <dt className="text-charcoal/50 text-[10px] uppercase font-bold">Delivery</dt>
                <dd className="font-bold text-charcoal pt-0.5">Doorstep Pickup</dd>
              </div>
            </dl>

            {/* Actions */}
            <div className="space-y-2.5 pt-2">
              <BookingModal
                boutiqueId={Number(boutique.id || 1)}
                boutiqueName={boutique.name}
              />

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-2xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors shadow-xs"
              >
                <MessageCircle className="w-4 h-4" /> Enquire on WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* More Outfits from Collection */}
        {moreOutfits.length > 0 && (
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-gold/15 shadow-sm space-y-4">
            <h2 className="font-serif font-bold text-xl text-charcoal">
              More from {collection.name}
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {moreOutfits.map(item => (
                <Link
                  key={item.id}
                  href={`/collections/${collection.id}/outfits/${item.id}`}
                  className="group cursor-pointer block"
                >
                  <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-charcoal/5 border border-gold/15 mb-2">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <h3 className="font-bold text-xs sm:text-sm text-charcoal group-hover:text-[#0F4C45] transition-colors line-clamp-1">
                    {item.name}
                  </h3>
                  {item.price && (
                    <p className="text-[11px] font-bold text-[#0F4C45]">
                      {item.price}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Sticky Mobile Action Bar */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-gold/20 shadow-2xl p-3 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 shrink-0">
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

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-full bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-2xs"
            >
              <MessageCircle className="w-5 h-5" />
            </a>

            {boutique.phoneNumber && (
              <a
                href={`tel:${boutique.phoneNumber}`}
                className="p-2.5 rounded-full bg-[#0F4C45] text-white hover:bg-[#12584E] transition-colors shadow-2xs"
              >
                <Phone className="w-5 h-5" />
              </a>
            )}
          </div>

          <div className="flex-grow max-w-xs">
            <BookingModal
              boutiqueId={Number(boutique.id || 1)}
              boutiqueName={boutique.name}
            />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
