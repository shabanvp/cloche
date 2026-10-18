"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Heart, ImageIcon, Eye } from "lucide-react";
import { isItemInWishlist, toggleWishlistItem } from "@/lib/wishlistStore";

interface InspirationItem {
  id: string;
  title: string;
  category: string;
  categoryKey: "bridal" | "decor" | "photography" | "mehendi" | "groom";
  badge: string;
  image: string;
  targetCategoryUrl: string;
}

const INSPIRATION_ITEMS: InspirationItem[] = [
  {
    id: "insp-1",
    title: "Handcrafted Crimson Lehenga & Polki Choker",
    category: "Bridal Wear & Jewelry",
    categoryKey: "bridal",
    badge: "Bridal Look",
    image: "https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=800&q=80",
    targetCategoryUrl: "/categories/bridal-studio",
  },
  {
    id: "insp-2",
    title: "Pastel Floral Mandap with Ambient Stage Lighting",
    category: "Stage & Mandap Decor",
    categoryKey: "decor",
    badge: "Stage Decor",
    image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=80",
    targetCategoryUrl: "/categories/decor-planning",
  },
  {
    id: "insp-3",
    title: "Golden Hour Candid Waterfront Couple Portrait",
    category: "Candid Photography",
    categoryKey: "photography",
    badge: "Candid Shot",
    image: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80",
    targetCategoryUrl: "/photographers",
  },
  {
    id: "insp-4",
    title: "Intricate Royal Bridal Dulhan Henna Art",
    category: "Mehendi & Henna",
    categoryKey: "mehendi",
    badge: "Bridal Mehendi",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
    targetCategoryUrl: "/mehendi-artists",
  },
  {
    id: "insp-5",
    title: "Bespoke Raw Silk Sherwani with Zardozi Embroidery",
    category: "Groom Couture",
    categoryKey: "groom",
    badge: "Groom Look",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80",
    targetCategoryUrl: "/categories/groom-studio",
  },
  {
    id: "insp-6",
    title: "Grand Palace Dining & Heritage Table Styling",
    category: "Stage & Mandap Decor",
    categoryKey: "decor",
    badge: "Banquet Styling",
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80",
    targetCategoryUrl: "/venues",
  },
];

const FILTER_TABS = [
  { label: "All Looks", key: "all" },
  { label: "Bridal & Jewelry", key: "bridal" },
  { label: "Stage & Decor", key: "decor" },
  { label: "Photography", key: "photography" },
  { label: "Mehendi", key: "mehendi" },
  { label: "Groom Couture", key: "groom" },
];

export function WeddingInspirationGallerySection() {
  const [activeTab, setActiveTab] = useState("all");
  const [savedIds, setSavedIds] = useState<Set<string>>(() => {
    if (typeof window !== "undefined") {
      const items = INSPIRATION_ITEMS.filter((item) => isItemInWishlist(item.id));
      return new Set(items.map((i) => i.id));
    }
    return new Set();
  });

  const filteredItems = useMemo(() => {
    if (activeTab === "all") return INSPIRATION_ITEMS;
    return INSPIRATION_ITEMS.filter((item) => item.categoryKey === activeTab);
  }, [activeTab]);

  const handleToggleSave = (item: InspirationItem, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    toggleWishlistItem({
      id: item.id,
      name: item.title,
      category: item.category,
      image: item.image,
      href: "/inspiration",
    });

    setSavedIds((prev) => {
      const next = new Set(prev);
      if (next.has(item.id)) {
        next.delete(item.id);
      } else {
        next.add(item.id);
      }
      return next;
    });
  };

  return (
    <section className="py-12 bg-[#FAF7F2] border-b border-[#C6A568]/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#C6A568]/20 text-[#064E43] text-xs font-bold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5 text-[#C6A568]" /> Wedding Ideas &amp; Gallery
            </div>
            <h2 className="text-2xl md:text-3xl font-bold font-serif text-[#242321]">
              Trending Wedding Inspiration
            </h2>
            <p className="text-xs sm:text-sm text-[#242321]/65 max-w-xl">
              Discover real bridal attire, floral mandap stages, candid shots, and decor styling for your big day
            </p>
          </div>

          <Link
            href="/inspiration"
            className="hidden md:inline-flex items-center gap-1.5 text-sm font-bold text-[#064E43] hover:text-[#C6A568] transition-colors"
          >
            <span>Explore All Ideas (10,000+)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-2 mb-6">
          {FILTER_TABS.map((tab) => {
            const isSelected = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer border ${
                  isSelected
                    ? "bg-[#064E43] text-white border-[#064E43] shadow-xs"
                    : "bg-white text-[#242321]/70 border-[#C6A568]/20 hover:border-[#064E43] hover:text-[#064E43]"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Inspiration Cards Grid (3 cols on desktop, 2 cols on tablet, scrollable on mobile) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map((item) => {
            const isSaved = savedIds.has(item.id);
            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl overflow-hidden border border-[#C6A568]/15 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Photo with Overlay & Badges */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-70 group-hover:opacity-80 transition-opacity" />

                    {/* Top Left: Category Badge */}
                    <span className="absolute top-3 left-3 bg-[#064E43]/90 backdrop-blur-md text-white text-[10.5px] font-bold px-2.5 py-0.5 rounded-full shadow-xs uppercase tracking-wider border border-white/10">
                      {item.badge}
                    </span>

                    {/* Top Right: Wishlist / Save Button */}
                    <button
                      type="button"
                      onClick={(e) => handleToggleSave(item, e)}
                      aria-label={isSaved ? "Remove from saved ideas" : "Save wedding idea"}
                      className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 shadow-md backdrop-blur-md cursor-pointer z-10 active:scale-90 ${
                        isSaved
                          ? "bg-[#064E43] text-[#C6A568]"
                          : "bg-white/90 text-[#242321]/70 hover:bg-white hover:text-red-500 hover:scale-105"
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isSaved ? "fill-[#C6A568] text-[#C6A568]" : ""}`} />
                    </button>

                    {/* Quick view button on hover */}
                    <Link
                      href={item.targetCategoryUrl}
                      className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/25"
                    >
                      <span className="px-4 py-2 rounded-full bg-white/95 backdrop-blur-md text-[#064E43] font-bold text-xs shadow-lg flex items-center gap-1.5 hover:bg-white transform translate-y-2 group-hover:translate-y-0 transition-transform">
                        <Eye className="w-3.5 h-3.5 text-[#C6A568]" /> View Details
                      </span>
                    </Link>
                  </div>

                  {/* Body Text */}
                  <div className="p-4 sm:p-5 space-y-1.5">
                    <span className="text-[10.5px] font-bold text-[#C6A568] uppercase tracking-wider block">
                      {item.category}
                    </span>
                    <h3 className="font-serif font-bold text-base text-[#242321] group-hover:text-[#064E43] transition-colors leading-snug">
                      {item.title}
                    </h3>
                  </div>
                </div>

                {/* Card Action Link */}
                <div className="p-4 sm:p-5 pt-0">
                  <Link
                    href={item.targetCategoryUrl}
                    className="w-full py-2 px-3 rounded-xl bg-[#FAF7F2] hover:bg-[#064E43] text-[#064E43] hover:text-white border border-[#C6A568]/20 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-2xs group-hover:border-[#064E43]"
                  >
                    <span>Browse Category</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Hub CTA */}
        <div className="mt-8 p-4 sm:p-5 rounded-2xl bg-white border border-[#C6A568]/25 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#C6A568]/20 text-[#064E43] flex items-center justify-center shrink-0">
              <ImageIcon className="w-5 h-5 text-[#C6A568]" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-sm sm:text-base text-[#242321]">
                Looking for specific wedding themes or outfits?
              </h4>
              <p className="text-xs text-[#242321]/60">
                Browse our complete database of 10,000+ curated high-resolution wedding photos.
              </p>
            </div>
          </div>

          <Link
            href="/inspiration"
            className="px-5 py-2.5 rounded-full bg-[#064E43] hover:bg-[#085C50] text-white font-bold text-xs transition-all shadow-sm shrink-0 whitespace-nowrap"
          >
            Explore Inspiration Hub
          </Link>
        </div>

      </div>
    </section>
  );
}
