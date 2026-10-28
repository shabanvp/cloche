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
} from "lucide-react";
import { BottomNavBar } from "@/components/BottomNavBar";
import { cateringVendors } from "@/lib/cateringData";
import { getCategoryFallbackImage } from "@/lib/categories";

export function CateringListing() {
  const [search, setSearch] = useState("");
  const [activeChip, setActiveChip] = useState("Catering & Food");
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const [vendorList, setVendorList] = useState<any[]>(cateringVendors);

  useEffect(() => {
    fetch("/api/v1/public/vendors?category=catering", { cache: "no-store" })
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          const fallbackImg = getCategoryFallbackImage("caterers");
          const mapped = json.data.map((dbV: any) => ({
            id: dbV.id,
            name: dbV.name,
            subtitle: dbV.tagline || dbV.about || "Luxury Wedding Caterers",
            location: dbV.city || dbV.state || "Kerala, India",
            rating: dbV.rating || 4.9,
            reviews: dbV.reviewCount || 0,
            price: dbV.startingPrice || "₹450 / plate",
            badge: "Featured Caterer",
            verified: dbV.isVerified ?? true,
            isVerified: dbV.isVerified ?? true,
            heroImage: dbV.coverImage || dbV.logo || fallbackImg,
            image: dbV.coverImage || dbV.logo || fallbackImg,
            gallery: [dbV.coverImage || dbV.logo, dbV.logo].filter(Boolean),
            cuisines: dbV.cuisineTypes?.length > 0 ? dbV.cuisineTypes : ["Kerala", "South Indian", "North Indian"],
            specialties: dbV.cateringSpecialities?.length > 0 ? dbV.cateringSpecialities : ["Sadya", "Live Counters"],
            services: dbV.serviceTypes?.length > 0 ? dbV.serviceTypes : ["Wedding Catering", "Reception"],
            capacity: dbV.guestCapacity || "100 - 1500 Guests",
            prices: [
              { category: "Standard", price: dbV.startingPrice || "₹450 / plate" },
              { category: "Premium", price: dbV.startingPrice ? `${dbV.startingPrice}` : "₹650 / plate" },
            ],
          }));

          // Put real DB vendors at top
          const dbIds = new Set(mapped.map((m: any) => m.id));
          const existingFiltered = cateringVendors.filter((v) => !dbIds.has(v.id));
          setVendorList([...mapped, ...existingFiltered]);
        }
      })
      .catch((err) => console.error("Error fetching live catering vendors:", err));
  }, []);

  const filtered = useMemo(() => {
    return vendorList.filter((v) => {
      const matchesSearch =
        v.name.toLowerCase().includes(search.toLowerCase()) ||
        (v.location && v.location.toLowerCase().includes(search.toLowerCase())) ||
        (v.subtitle && v.subtitle.toLowerCase().includes(search.toLowerCase()));
      return matchesSearch;
    });
  }, [search, vendorList]);

  const toggleWishlist = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setWishlist((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] pb-24 text-[#2D2520]">
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
              Catering &amp; Food
            </h1>

            <button
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EFE9DF] text-[#0F4C45] transition-transform active:scale-95 hover:bg-[#E5DDCF]"
              aria-label="Filter options"
            >
              <SlidersHorizontal className="h-4 w-4" />
            </button>
          </div>

          <p className="mt-1 text-[13px] sm:text-[14px] text-[#5A6561] text-center">
            Kerala sadya, grand buffets &amp; curated culinary spreads
          </p>
        </div>

        {/* Search Bar */}
        <div className="px-4 py-2">
          <div className="flex items-center gap-2.5 rounded-full bg-white px-4 py-2.5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-black/5">
            <Search className="h-4 w-4 shrink-0 text-[#8C827A]" />
            <input
              type="text"
              placeholder="Search caterers, sadya, live counters..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent text-[14px] outline-none placeholder:text-[#AAA29A] text-[#1A1410]"
            />
          </div>
        </div>

        {/* Quick Filter Chips */}
        <div className="flex gap-2 overflow-x-auto px-4 py-2 scrollbar-none">
          {["All Caterers", "Sadya Specialist", "Royal Buffet", "Live Counters", "Continental"].map((chip) => {
            const isActive = activeChip === chip || (chip === "All Caterers" && activeChip === "Catering & Food");
            return (
              <button
                key={chip}
                onClick={() => setActiveChip(chip)}
                className={`shrink-0 rounded-full px-4 py-1.5 text-[12px] font-semibold transition-all ${
                  isActive
                    ? "bg-[#0F4C45] text-white shadow-xs"
                    : "bg-white text-[#4A3F35] border border-black/10 hover:bg-black/5"
                }`}
              >
                {chip}
              </button>
            );
          })}
        </div>

        {/* Results Header */}
        <div className="px-4 pt-3 pb-2 flex items-center justify-between">
          <h2 className="font-serif text-[17px] font-bold text-[#1A1410]">
            Featured Wedding Caterers
          </h2>
          <span className="text-[12px] text-[#7A6E65]">
            {filtered.length} caterers found
          </span>
        </div>

        {/* Vendors List */}
        <div className="px-4 space-y-3.5">
          {filtered.map((vendor) => {
            const isSaved = wishlist.has(vendor.id);
            const priceDisplay =
              vendor.prices?.[1]?.price ||
              vendor.prices?.[0]?.price ||
              vendor.price ||
              "₹450 / plate";

            return (
              <div
                key={vendor.id}
                className="group relative overflow-hidden rounded-2xl bg-white p-3 border border-black/5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col sm:flex-row gap-3 transition-shadow hover:shadow-[0_4px_18px_rgba(0,0,0,0.06)]"
              >
                {/* Image */}
                <div className="relative aspect-[3/4] sm:aspect-square w-full sm:w-[130px] shrink-0 overflow-hidden rounded-xl bg-gray-100">
                  <Image
                    src={vendor.image || "/images/catering-cover.png"}
                    alt={vendor.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <button
                    onClick={(e) => toggleWishlist(e, vendor.id)}
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

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between py-0.5">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-serif text-[17px] font-bold text-[#1A1410] leading-snug">
                        {vendor.name}
                      </h3>
                      {vendor.isVerified && (
                        <CheckCircle2 className="h-4 w-4 shrink-0 fill-[#0F4C45] text-white" />
                      )}
                    </div>

                    <div className="mt-1 flex items-center gap-2 text-[12px]">
                      <div className="flex items-center gap-1 font-bold text-[#1A1410]">
                        <Star className="h-3.5 w-3.5 fill-[#C8A96A] text-[#C8A96A]" />
                        <span>{vendor.rating}</span>
                        <span className="text-[#9A8D7D] font-normal">({vendor.reviews})</span>
                      </div>
                      <span className="text-[#0F4C45] font-medium">• Verified</span>
                    </div>

                    <div className="mt-1 flex items-center gap-1 text-[12px] text-[#6B5E52]">
                      <MapPin className="h-3.5 w-3.5 text-[#8C827A]" />
                      <span>{vendor.location}</span>
                    </div>

                    <div className="mt-2 flex items-center gap-1 text-[12px] font-bold text-[#1A1410]">
                      <span>{priceDisplay}</span>
                      <span className="text-[#7A6E65] font-normal">Onwards</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-black/5 flex justify-end">
                    <Link
                      href={`/categories/catering/${vendor.id}`}
                      className="flex items-center gap-1 rounded-xl bg-[#0F4C45] px-4 py-2 text-[12px] font-semibold text-white shadow-xs transition-transform active:scale-95 hover:bg-[#155e56]"
                    >
                      View Details <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <BottomNavBar activeTab="vendors" />
    </div>
  );
}
