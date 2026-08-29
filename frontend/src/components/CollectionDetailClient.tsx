"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Heart,
  Share2,
  Calendar,
  CheckCircle2,
  Sparkles,
  MapPin,
  Clock,
  Shirt,
  Scissors,
  Truck,
  Star,
  Eye,
  X,
  Phone,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Award,
  Filter,
  UserCheck,
  Layers
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
  const [selectedOutfitModal, setSelectedOutfitModal] = useState<OutfitItem | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  // Derive outfits array safely
  const rawOutfits: OutfitItem[] = useMemo(() => {
    if (collection.outfits && collection.outfits.length > 0) {
      return collection.outfits;
    }
    // Fallback demonstration outfits if backend object is minimal
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
      },
      {
        id: "outfit-5",
        name: `${collection.name} - Marigold Floral Haldi Attire`,
        category: "Haldi",
        image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800&auto=format&fit=crop",
        price: "₹11,500 / 3 Days",
        description: "Vibrant marigold yellow organza saree with mirrorwork borders.",
        fabric: "Chiffon & Organza",
        sizes: ["Free Size"],
        rentalAvailable: true
      },
      {
        id: "outfit-6",
        name: `${collection.name} - Emerald Mehendi Anarkali`,
        category: "Mehendi",
        image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=800&auto=format&fit=crop",
        price: "₹14,000 / 3 Days",
        description: "Rich emerald green flared anarkali suit with gold threadwork accent.",
        fabric: "Chanderi Silk",
        sizes: ["S", "M", "L"],
        rentalAvailable: true
      },
      {
        id: "outfit-7",
        name: `${collection.name} - Royal Pearl & Polki Belt`,
        category: "Accessories",
        image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop",
        price: "₹4,500 / 3 Days",
        description: "Handcrafted bridal waist belt with polki stones and freshwater pearls.",
        fabric: "Brass & Pearls",
        sizes: ["Adjustable"],
        rentalAvailable: true
      },
      {
        id: "outfit-8",
        name: `${collection.name} - Velvet Sherwani Set for Groom`,
        category: "Groom",
        image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop",
        price: "₹21,000 / 3 Days",
        description: "Deep maroon velvet sherwani set with embroidered collar and churidar.",
        fabric: "Micro Velvet",
        sizes: ["38", "40", "42", "44"],
        rentalAvailable: true
      }
    ];
  }, [collection]);

  // All gallery photos derived from coverImage + outfits
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

  // Share link handler
  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 3000);
    }
  };

  const formattedCity = boutique.city || boutique.address?.split(",").pop()?.trim() || "Kerala";
  const whatsappUrl = `https://wa.me/${(boutique.whatsappNumber || "919000000000").replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
    `Hi ${boutique.name}, I am interested in your collection "${collection.name}" on Cloche!`
  )}`;

  return (
    <div className="min-h-screen bg-[#FBF8F1] flex flex-col font-sans text-charcoal pb-24 lg:pb-12">
      
      {/* ──────────────────────────────────────────────────────────
          SECTION 1: LUXURY COLLECTION HEADER & BREADCRUMB
      ────────────────────────────────────────────────────────── */}
      <header className="bg-white border-b border-gold/15 sticky top-0 z-40 shadow-2xs backdrop-blur-md bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          <Link
            href={`/boutiques/${boutique.slug || boutique.id || "studio"}`}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0F4C45]/10 text-[#0F4C45] hover:bg-[#0F4C45] hover:text-white transition-all text-xs font-bold shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Studio</span>
          </Link>

          <div className="text-center truncate hidden sm:block">
            <h1 className="font-serif font-bold text-base md:text-lg text-charcoal truncate">
              {collection.name}
            </h1>
            <p className="text-[11px] text-charcoal/60 truncate">
              By {boutique.name} • {formattedCity}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-full border border-gold/20 text-charcoal hover:bg-gold/10 transition-colors relative cursor-pointer"
              title="Share Collection"
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

      {/* ──────────────────────────────────────────────────────────
          MAIN CONTAINER: 10 SECTIONS
      ────────────────────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-10 sm:space-y-12">
        
        {/* ── SECTION 1 META BANNER (TITLE, RATING, BADGES) ── */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gold/15 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#0F4C45]/10 text-[#0F4C45] text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-[#C8A96A]" /> Premium Collection
            </span>

            {boutique.verified !== false && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5" /> Verified Boutique
              </span>
            )}

            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200">
              <Layers className="w-3.5 h-3.5" /> {rawOutfits.length} Outfits Available
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="font-serif font-bold text-2xl sm:text-3xl lg:text-4xl text-charcoal">
                {collection.name}
              </h1>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-charcoal/70 font-medium">
                <Link
                  href={`/boutiques/${boutique.slug || boutique.id || "studio"}`}
                  className="text-[#0F4C45] hover:underline font-bold"
                >
                  By {boutique.name}
                </Link>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#C8A96A]" /> {formattedCity}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-amber-600 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  {boutique.rating || 4.9} ({boutique.reviewCount || 48} Reviews)
                </span>
                <span>•</span>
                <span className="text-charcoal/50">Updated {collection.lastUpdated || "2 days ago"}</span>
              </div>
            </div>

            <div className="shrink-0 flex items-center gap-3">
              <BookingModal
                boutiqueId={Number(boutique.id || 1)}
                boutiqueName={boutique.name}
              />
            </div>
          </div>
        </div>

        {/* ──────────────────────────────────────────────────────────
            SECTION 2: FEATURED HERO IMAGE & GALLERY THUMBNAILS
        ────────────────────────────────────────────────────────── */}
        <section className="bg-white rounded-3xl p-4 sm:p-6 border border-gold/15 shadow-sm space-y-4">
          <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-2xl overflow-hidden bg-charcoal/5 group border border-gold/10">
            <img
              src={galleryImages[activeImageIndex] || collection.coverImage}
              alt={collection.name}
              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700 cursor-pointer"
              onClick={() => setLightboxImage(galleryImages[activeImageIndex] || collection.coverImage)}
            />

            <button
              onClick={() => setLightboxImage(galleryImages[activeImageIndex] || collection.coverImage)}
              className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white p-2 rounded-full hover:bg-black/80 transition-all cursor-pointer"
              title="Expand Fullscreen"
            >
              <Eye className="w-4 h-4" />
            </button>

            {/* Navigation Arrows */}
            {galleryImages.length > 1 && (
              <>
                <button
                  onClick={() => setActiveImageIndex(prev => (prev === 0 ? galleryImages.length - 1 : prev - 1))}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-md p-2 rounded-full hover:bg-white transition-all shadow-md cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5 text-charcoal" />
                </button>
                <button
                  onClick={() => setActiveImageIndex(prev => (prev === galleryImages.length - 1 ? 0 : prev + 1))}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-md p-2 rounded-full hover:bg-white transition-all shadow-md cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5 text-charcoal" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnail Strip */}
          {galleryImages.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                    activeImageIndex === idx ? "border-[#0F4C45] ring-2 ring-[#0F4C45]/20 scale-105" : "border-gold/20 opacity-70 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </section>

        {/* ──────────────────────────────────────────────────────────
            SECTION 3: COLLECTION STORY & SPECIFICATIONS
        ────────────────────────────────────────────────────────── */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
          
          {/* Story & Description (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-gold/15 shadow-sm space-y-5">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#0F4C45] tracking-widest block mb-1">
                The Heritage Story
              </span>
              <h2 className="font-serif font-bold text-xl sm:text-2xl text-charcoal">
                About The Collection
              </h2>
            </div>

            <p className="text-sm text-charcoal/80 leading-relaxed font-light">
              {collection.story || collection.description || (
                `Inspired by regal Indian heritage, this exclusive collection from ${boutique.name} brings together centuries of embroidery craftsmanship with contemporary silhouettes. Designed for grand celebrations, each outfit is hand-embroidered by master artisans in Kerala.`
              )}
            </p>

            <div className="bg-[#FAF7F2] rounded-2xl p-4 sm:p-5 border border-gold/15 space-y-3">
              <h3 className="font-serif font-bold text-sm text-charcoal flex items-center gap-2">
                <Award className="w-4 h-4 text-[#C8A96A]" /> Atelier Craftsmanship Highlights
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-charcoal/70">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  Authentic Zardozi & Gota Work
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  Premium Pure Silk & Organza
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  Personal Fitting & Trial Session
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  Sanitized 3 to 7-Day Rentals
                </li>
              </ul>
            </div>
          </div>

          {/* Quick Specifications (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-gold/15 shadow-sm space-y-4 flex flex-col justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#0F4C45] tracking-widest block mb-1">
                Essential Details
              </span>
              <h2 className="font-serif font-bold text-xl text-charcoal mb-4">
                Collection Specifications
              </h2>

              <dl className="space-y-3 text-xs">
                <div className="flex justify-between py-2 border-b border-gold/10">
                  <dt className="text-charcoal/60 font-medium">Ideal For</dt>
                  <dd className="font-bold text-charcoal text-right">
                    {collection.idealFor?.join(", ") || "Bride, Reception, Sangeet, Engagement"}
                  </dd>
                </div>
                <div className="flex justify-between py-2 border-b border-gold/10">
                  <dt className="text-charcoal/60 font-medium">Price Range</dt>
                  <dd className="font-bold text-[#0F4C45] text-right">
                    {collection.priceRange || "₹14,500 – ₹45,000"}
                  </dd>
                </div>
                <div className="flex justify-between py-2 border-b border-gold/10">
                  <dt className="text-charcoal/60 font-medium">Rental Available</dt>
                  <dd className="font-bold text-emerald-700 text-right">
                    Available (3 to 7 Days)
                  </dd>
                </div>
                <div className="flex justify-between py-2 border-b border-gold/10">
                  <dt className="text-charcoal/60 font-medium">Custom Stitching</dt>
                  <dd className="font-bold text-charcoal text-right">
                    Provided (Fitting Included)
                  </dd>
                </div>
                <div className="flex justify-between py-2 border-b border-gold/10">
                  <dt className="text-charcoal/60 font-medium">Delivery Time</dt>
                  <dd className="font-bold text-charcoal text-right">
                    {collection.deliveryTime || "7–10 Days Standard Delivery"}
                  </dd>
                </div>
                <div className="flex justify-between py-2">
                  <dt className="text-charcoal/60 font-medium">Languages Spoken</dt>
                  <dd className="font-bold text-charcoal text-right">
                    {collection.languages?.join(", ") || "English, Malayalam, Hindi"}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        {/* ──────────────────────────────────────────────────────────
            SECTION 4: CATEGORY FILTERS CHIPS
        ────────────────────────────────────────────────────────── */}
        <section className="bg-white rounded-3xl p-5 sm:p-6 border border-gold/15 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-serif font-bold text-xl text-charcoal flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#0F4C45]" /> Explore Outfits
              </h2>
              <p className="text-xs text-charcoal/60">
                Filter by ceremonial event category ({filteredOutfits.length} items)
              </p>
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

          {/* ──────────────────────────────────────────────────────────
              SECTION 5: OUTFIT GALLERY (RESPONSIVE MASONRY GRID)
          ────────────────────────────────────────────────────────── */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5 pt-2">
            {filteredOutfits.map(outfit => (
              <div
                key={outfit.id}
                onClick={() => setSelectedOutfitModal(outfit)}
                className="group bg-[#FAF7F2] rounded-2xl overflow-hidden border border-gold/15 hover:border-[#0F4C45]/40 shadow-xs hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-charcoal/5">
                    <img
                      src={outfit.image}
                      alt={outfit.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Category Badge */}
                    <span className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-white/20">
                      {outfit.category}
                    </span>

                    {/* Quick View Button Overlay */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="bg-white/90 backdrop-blur-md text-charcoal font-bold text-xs px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5 text-[#0F4C45]" /> Quick View
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
              </div>
            ))}
          </div>
        </section>

        {/* ──────────────────────────────────────────────────────────
            SECTION 7: FEATURED SERVICES CARDS
        ────────────────────────────────────────────────────────── */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-gold/15 shadow-sm space-y-6">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-[10px] uppercase font-bold text-[#0F4C45] tracking-widest block mb-1">
              Atelier Experiences
            </span>
            <h2 className="font-serif font-bold text-xl sm:text-2xl text-charcoal">
              Boutique Services & Guarantees
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-gold/15 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[#0F4C45]/10 text-[#0F4C45] flex items-center gap-2 justify-center font-bold">
                👑
              </div>
              <h3 className="font-serif font-bold text-base text-charcoal">Bridal & Groom Styling</h3>
              <p className="text-xs text-charcoal/70 leading-relaxed font-light">
                Personalized wedding lookbook curation by senior bridal stylists tailored to your wedding theme.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-gold/15 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[#0F4C45]/10 text-[#0F4C45] flex items-center justify-center font-bold">
                ✂️
              </div>
              <h3 className="font-serif font-bold text-base text-charcoal">Custom Stitching & Alterations</h3>
              <p className="text-xs text-charcoal/70 leading-relaxed font-light">
                Bespoke fitting and precision alterations guaranteed for a flawless silhouette on your big day.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-gold/15 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[#0F4C45]/10 text-[#0F4C45] flex items-center justify-center font-bold">
                🔄
              </div>
              <h3 className="font-serif font-bold text-base text-charcoal">Sanitized Rental Options</h3>
              <p className="text-xs text-charcoal/70 leading-relaxed font-light">
                Flexible 3 to 7-day rental packages with professional dry-cleaning and hygienic vacuum sealing.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-gold/15 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[#0F4C45]/10 text-[#0F4C45] flex items-center justify-center font-bold">
                ✨
              </div>
              <h3 className="font-serif font-bold text-base text-charcoal">VIP In-Studio Trial Session</h3>
              <p className="text-xs text-charcoal/70 leading-relaxed font-light">
                Private trial lounge access with trial outfits, bridal jewelry pairing, and refreshments.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-gold/15 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[#0F4C45]/10 text-[#0F4C45] flex items-center justify-center font-bold">
                💬
              </div>
              <h3 className="font-serif font-bold text-base text-charcoal">1-on-1 Designer Consultation</h3>
              <p className="text-xs text-charcoal/70 leading-relaxed font-light">
                Direct consultation with lead designers for custom color matching and bridal embroidery.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-gold/15 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[#0F4C45]/10 text-[#0F4C45] flex items-center justify-center font-bold">
                🚚
              </div>
              <h3 className="font-serif font-bold text-base text-charcoal">Doorstep Pickup & Delivery</h3>
              <p className="text-xs text-charcoal/70 leading-relaxed font-light">
                Insured white-glove courier delivery and post-event doorstep pickup across Kerala.
              </p>
            </div>
          </div>
        </section>

        {/* ──────────────────────────────────────────────────────────
            SECTION 8: CUSTOMER REVIEWS & RATING DISTRIBUTION
        ────────────────────────────────────────────────────────── */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-gold/15 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gold/10 pb-6">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#0F4C45] tracking-widest block mb-1">
                Verified Bride & Groom Experiences
              </span>
              <h2 className="font-serif font-bold text-xl sm:text-2xl text-charcoal">
                Customer Reviews
              </h2>
            </div>

            <div className="flex items-center gap-4 bg-[#FAF7F2] px-5 py-3 rounded-2xl border border-gold/15">
              <div className="text-center">
                <span className="font-serif font-bold text-2xl text-charcoal block">
                  {boutique.rating || 4.9}
                </span>
                <div className="flex items-center gap-0.5 text-amber-400">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                </div>
              </div>
              <div className="h-8 w-px bg-gold/20" />
              <div className="text-xs text-charcoal/70">
                <p className="font-bold text-charcoal">100% Satisfaction</p>
                <p>{boutique.reviewCount || 48} Verified Reviews</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-gold/15 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-charcoal">Ananya S.</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                    Verified Bride
                  </span>
                </div>
                <div className="flex text-amber-400">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                </div>
              </div>
              <p className="text-xs text-charcoal/80 leading-relaxed font-light">
                "The collection fitting was absolute perfection! The velvet embroidery looked stunning in our wedding photos. Highly recommended!"
              </p>
              <p className="text-[10px] text-charcoal/40 pt-1">Rented for Kerala Wedding • 2 weeks ago</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-gold/15 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-charcoal">Rahul & Neha M.</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                    Verified Couple
                  </span>
                </div>
                <div className="flex text-amber-400">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                </div>
              </div>
              <p className="text-xs text-charcoal/80 leading-relaxed font-light">
                "Excellent service from the boutique. The trial session made us feel completely relaxed. Delivery was right on schedule."
              </p>
              <p className="text-[10px] text-charcoal/40 pt-1">Rented for Reception • 1 month ago</p>
            </div>
          </div>
        </section>

        {/* ──────────────────────────────────────────────────────────
            SECTION 9: SIMILAR COLLECTIONS CAROUSEL
        ────────────────────────────────────────────────────────── */}
        {similarCollections.length > 0 && (
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-gold/15 shadow-sm space-y-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#0F4C45] tracking-widest block mb-1">
                More Showroom Creations
              </span>
              <h2 className="font-serif font-bold text-xl sm:text-2xl text-charcoal">
                Similar Collections
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {similarCollections.map(sim => (
                <Link
                  key={sim.id}
                  href={`/collections/${sim.id}`}
                  className="group cursor-pointer block"
                >
                  <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-charcoal/5 border border-gold/15 mb-2">
                    <img
                      src={sim.coverImage}
                      alt={sim.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <h3 className="font-bold text-xs sm:text-sm text-charcoal group-hover:text-[#0F4C45] transition-colors line-clamp-1">
                    {sim.name}
                  </h3>
                  <p className="text-[11px] text-charcoal/50">
                    {sim.outfitCount || 12} Outfits Available
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* ──────────────────────────────────────────────────────────
          SECTION 6: OUTFIT QUICK VIEW MODAL
      ────────────────────────────────────────────────────────── */}
      {selectedOutfitModal && (
        <div
          onClick={() => setSelectedOutfitModal(null)}
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
        >
          <div
            onClick={e => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-3xl w-full border border-gold/25 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200"
          >
            <div className="bg-[#FAF7F2] p-4 sm:p-6 border-b border-gold/15 flex items-start justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-[#0F4C45]/10 text-[#0F4C45] px-2.5 py-0.5 rounded-full inline-block mb-1">
                  {selectedOutfitModal.category} • {boutique.name}
                </span>
                <h3 className="font-serif font-bold text-xl sm:text-2xl text-charcoal">
                  {selectedOutfitModal.name}
                </h3>
              </div>

              <button
                onClick={() => setSelectedOutfitModal(null)}
                className="bg-white p-2 rounded-full border border-gold/20 text-charcoal/60 hover:text-charcoal hover:bg-gold/10 transition-colors shrink-0 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-charcoal/5 border border-gold/15">
                <img
                  src={selectedOutfitModal.image}
                  alt={selectedOutfitModal.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-4">
                {selectedOutfitModal.price && (
                  <div>
                    <span className="text-[10px] uppercase font-bold text-charcoal/60 block">Price / Package</span>
                    <span className="font-serif text-2xl font-bold text-[#0F4C45]">
                      {selectedOutfitModal.price}
                    </span>
                  </div>
                )}

                <p className="text-xs text-charcoal/80 leading-relaxed font-light">
                  {selectedOutfitModal.description || "Handcrafted couture outfit with intricate embroidery, custom fitting, and sanitized rental package."}
                </p>

                <div className="space-y-1 text-xs">
                  <p><span className="font-bold text-charcoal">Fabric:</span> {selectedOutfitModal.fabric || "Pure Raw Silk"}</p>
                  <p><span className="font-bold text-charcoal">Available Sizes:</span> {(selectedOutfitModal.sizes || ["S", "M", "L", "Custom"]).join(", ")}</p>
                  <p><span className="font-bold text-charcoal">Status:</span> <span className="text-emerald-700 font-bold">Ready for Trial & Rental</span></p>
                </div>

                <div className="pt-2 space-y-2">
                  <BookingModal
                    boutiqueId={Number(boutique.id || 1)}
                    boutiqueName={boutique.name}
                  />

                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-full bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors shadow-xs"
                  >
                    <MessageCircle className="w-4 h-4" /> Enquire on WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Image Modal */}
      {lightboxImage && (
        <div
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div className="relative max-w-4xl max-h-[85vh] w-full h-full flex items-center justify-center">
            <img src={lightboxImage} alt="Expanded View" className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl" />
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-4 right-4 bg-white/20 text-white p-2 rounded-full hover:bg-white/40 transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────
          SECTION 10: BOTTOM ACTION BAR (MOBILE STICKY & DESKTOP FIXED)
      ────────────────────────────────────────────────────────── */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-gold/20 shadow-2xl p-3 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 shrink-0">
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

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-full bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-2xs"
              title="WhatsApp Enquire"
            >
              <MessageCircle className="w-5 h-5" />
            </a>

            {boutique.phoneNumber && (
              <a
                href={`tel:${boutique.phoneNumber}`}
                className="p-2.5 rounded-full bg-[#0F4C45] text-white hover:bg-[#12584E] transition-colors shadow-2xs"
                title="Call Studio"
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
