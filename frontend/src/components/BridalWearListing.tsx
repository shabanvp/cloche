"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import {
  ArrowLeft,
  Search,
  SlidersHorizontal,
  Star,
  CheckCircle2,
  MapPin,
  Heart,
  ChevronRight,
  ShoppingBag,
  Loader2,
} from "lucide-react";
import { BottomNavBar } from "@/components/BottomNavBar";
import { getAllBoutiques } from "@/services/api";
import { Boutique } from "@/types";
import { DEFAULT_VENDOR_CONFIGS } from "@/lib/vendorTemplates";

export function BridalWearListing() {
  const [search, setSearch] = useState("");
  const [activeChip, setActiveChip] = useState("All");
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const [dbBoutiques, setDbBoutiques] = useState<Boutique[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch Real Database Boutiques
  useEffect(() => {
    async function loadBoutiques() {
      setIsLoading(true);
      try {
        const fetched = await getAllBoutiques();
        
        // Also combine with registered vendor configs in DEFAULT_VENDOR_CONFIGS / localStorage
        let localConfigs: Boutique[] = [];
        if (typeof window !== "undefined") {
          try {
            const raw = localStorage.getItem("cloche_vendor_profile_configs_v1");
            const parsed = raw ? JSON.parse(raw) : DEFAULT_VENDOR_CONFIGS;
            localConfigs = Object.values(parsed).map((cfg: any) => ({
              id: cfg.vendorId || cfg.id,
              boutique_name: cfg.businessName,
              email: cfg.email || "vendor@cloche.com",
              city: cfg.city,
              district: cfg.district,
              phone: cfg.phone,
              tags: cfg.category,
              category: cfg.category,
              image_url: cfg.coverImage,
              logo_url: cfg.logo,
              rating: cfg.rating || 4.9,
              reviews_count: cfg.reviewsCount || 85,
              description: cfg.tagline || cfg.aboutText,
            }));
          } catch (e) {}
        }

        const combined = [...fetched, ...localConfigs];
        
        // Unique by ID
        const uniqueMap = new Map();
        combined.forEach((b) => {
          if (!uniqueMap.has(String(b.id))) {
            uniqueMap.set(String(b.id), b);
          }
        });

        setDbBoutiques(Array.from(uniqueMap.values()));
      } catch (err) {
        console.error("Failed to load bridal boutiques:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadBoutiques();
  }, []);

  // Filter ONLY Bridal Wear / Bridal Boutique / Designer Boutique Categories
  const bridalBoutiques = useMemo(() => {
    return dbBoutiques.filter((b) => {
      const cat = ((b as any).category || b.tags || "").toString().toLowerCase();
      // Only match bridal category keywords
      return (
        cat.includes("bridal") ||
        cat.includes("boutique") ||
        cat.includes("dress") ||
        cat.includes("lehenga") ||
        cat.includes("saree") ||
        cat.includes("couture")
      );
    });
  }, [dbBoutiques]);

  // Filter by Search & Category Chip
  const filtered = useMemo(() => {
    return bridalBoutiques.filter((b) => {
      const name = (b.boutique_name || "").toLowerCase();
      const city = (b.city || "").toLowerCase();
      const district = (b.district || "").toLowerCase();
      const desc = ((b as any).description || (b as any).tagline || "").toLowerCase();

      const matchesSearch =
        !search.trim() ||
        name.includes(search.toLowerCase()) ||
        city.includes(search.toLowerCase()) ||
        district.includes(search.toLowerCase()) ||
        desc.includes(search.toLowerCase());

      const matchesChip =
        activeChip === "All" ||
        desc.includes(activeChip.toLowerCase()) ||
        ((b as any).tags || "").toLowerCase().includes(activeChip.toLowerCase());

      return matchesSearch && matchesChip;
    });
  }, [bridalBoutiques, search, activeChip]);

  const toggleWishlist = (e: React.MouseEvent, id: string | number) => {
    e.preventDefault();
    const strId = String(id);
    setWishlist((prev) => {
      const next = new Set(prev);
      if (next.has(strId)) next.delete(strId);
      else next.add(strId);
      return next;
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] pb-24 text-[#2D2520] font-sans">
      <main className="flex-1">
        
        {/* Header Row */}
        <div className="px-4 pt-4 pb-2">
          <div className="flex items-center justify-between">
            <Link
              href="/categories"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EFE9DF] text-[#0F4C45] transition-transform active:scale-95 hover:bg-[#E5DDCF]"
              aria-label="Back to categories"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>

            <h1 className="font-serif text-[24px] sm:text-[28px] font-bold text-[#0F4C45] text-center">
              Bridal Wear & Boutiques
            </h1>

            <button
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EFE9DF] text-[#0F4C45] transition-transform active:scale-95 hover:bg-[#E5DDCF]"
              aria-label="Filter options"
            >
              <SlidersHorizontal className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-2 text-[13px] sm:text-[14px] text-[#5A6561] text-center leading-snug">
            Real verified bridal boutiques & handcrafted couture partners
          </p>
        </div>

        {/* Search Bar */}
        <div className="px-4 py-2">
          <div className="flex items-center gap-2.5 rounded-full bg-white px-4 py-2.5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-black/5">
            <Search className="h-4 w-4 shrink-0 text-[#8C827A]" />
            <input
              type="text"
              placeholder="Search boutique name, city, district..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent text-[13px] sm:text-[14px] outline-none placeholder:text-[#AAA29A] text-[#1A1410]"
            />
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="flex gap-2 overflow-x-auto px-4 py-2 scrollbar-none text-[12px]">
          {["All", "Lehengas", "Sarees", "Anarkali", "Gowns"].map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => setActiveChip(chip)}
              aria-label={`Filter by ${chip}`}
              className={`shrink-0 rounded-full px-4 py-1.5 font-medium transition-all cursor-pointer ${
                activeChip === chip
                  ? "bg-[#0F4C45] text-white font-bold"
                  : "bg-white text-[#4A3F35] border border-black/10 hover:bg-black/5"
              }`}
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Top Section Title */}
        <div className="px-4 pt-4 pb-1 flex items-center justify-between">
          <div>
            <h2 className="font-serif text-[18px] font-bold text-[#1A1410]">
              Bridal Boutiques ({filtered.length})
            </h2>
            <p className="text-[12px] text-[#7A6E65]">Verified database partners</p>
          </div>
        </div>

        {/* Loading Skeleton */}
        {isLoading && (
          <div className="px-4 py-12 text-center space-y-3">
            <Loader2 className="w-8 h-8 text-[#0F4C45] animate-spin mx-auto" />
            <p className="text-xs text-charcoal/60">Loading real bridal boutiques from database...</p>
          </div>
        )}

        {/* Real Database Boutique Cards */}
        {!isLoading && filtered.length > 0 && (
          <div className="px-4 space-y-4 mt-2">
            {filtered.map((boutique) => {
              const boutiqueId = String(boutique.id);
              const isSaved = wishlist.has(boutiqueId);

              const name = boutique.boutique_name || "Bridal Boutique";
              const coverImg = boutique.image_url || (boutique as any).cover_image || "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80";
              const locationText = boutique.city ? `${boutique.city}${boutique.district ? `, ${boutique.district}` : ""}` : "Kerala";
              const ratingVal = boutique.rating || 4.9;
              const reviewsVal = (boutique as any).reviews_count || (boutique as any).reviews || (boutique as any).userReviews?.length || 1;
              const desc = (boutique as any).description || (boutique as any).tagline || "Luxury bridal wear and bespoke wedding couture.";

              return (
                <div
                  key={boutiqueId}
                  className="group relative overflow-hidden rounded-2xl bg-white p-3 border border-black/5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col sm:flex-row gap-3 transition-shadow hover:shadow-[0_4px_18px_rgba(0,0,0,0.06)]"
                >
                  {/* Image Section */}
                  <div className="relative aspect-[3/4] sm:aspect-square w-full sm:w-[130px] shrink-0 overflow-hidden rounded-xl bg-gray-100">
                    <Image
                      src={coverImg}
                      alt={name}
                      fill
                      unoptimized
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <button
                      onClick={(e) => toggleWishlist(e, boutiqueId)}
                      className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-xs transition-transform active:scale-90"
                    >
                      <Heart
                        className="h-4 w-4"
                        style={{
                          color: isSaved ? "#E8614A" : "#8C827A",
                          fill: isSaved ? "#E8614A" : "none",
                        }}
                      />
                    </button>
                  </div>

                  {/* Details Section */}
                  <div className="flex-1 flex flex-col justify-between py-0.5">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-serif text-[17px] font-bold text-[#1A1410] leading-snug">
                          {name}
                        </h3>
                        <CheckCircle2 className="h-4 w-4 shrink-0 fill-[#0F4C45] text-white" />
                      </div>

                      <div className="mt-1 flex items-center gap-2 text-[12px]">
                        <div className="flex items-center gap-1 font-bold text-[#1A1410]">
                          <Star className="h-3.5 w-3.5 fill-[#C8A96A] text-[#C8A96A]" />
                          <span>{ratingVal}</span>
                          <span className="text-[#9A8D7D] font-normal">({reviewsVal})</span>
                        </div>
                        <span className="text-[#0F4C45] font-medium">• Verified Partner</span>
                      </div>

                      <div className="mt-1 flex items-center gap-1 text-[12px] text-[#6B5E52]">
                        <MapPin className="h-3.5 w-3.5 text-[#8C827A]" />
                        <span>{locationText}</span>
                      </div>

                      <p className="mt-2 text-[12px] text-[#5A6561] leading-relaxed line-clamp-2">
                        {desc}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-black/5 flex justify-end">
                      <Link
                        href={`/boutiques/${boutiqueId}`}
                        className="flex items-center gap-1 rounded-xl bg-[#0F4C45] px-4 py-2 text-[12px] font-semibold text-white shadow-xs transition-transform active:scale-95 hover:bg-[#155e56]"
                      >
                        View Profile <ChevronRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty State when no matching real boutiques */}
        {!isLoading && filtered.length === 0 && (
          <div className="px-4 py-16 text-center space-y-3 bg-white rounded-2xl mx-4 my-6 border border-black/5 shadow-xs">
            <ShoppingBag className="w-12 h-12 text-[#0F4C45] mx-auto" />
            <h3 className="font-serif text-xl font-bold text-charcoal">No bridal boutiques available yet.</h3>
            <p className="text-xs text-charcoal/70 max-w-sm mx-auto leading-relaxed">
              No matching boutiques found for "{search || activeChip}". Check back soon as new verified bridal partners join Cloche.
            </p>
            {search && (
              <button
                onClick={() => { setSearch(""); setActiveChip("All"); }}
                className="mt-2 text-xs font-bold text-[#0F4C45] underline"
              >
                Clear Search Filter
              </button>
            )}
          </div>
        )}

      </main>

      <BottomNavBar activeTab="vendors" />
    </div>
  );
}
