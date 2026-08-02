"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import { 
  Search, Star, CheckCircle2, MapPin, Heart, ChevronRight, UserCheck 
} from "lucide-react";
import { BottomNavBar } from "@/components/BottomNavBar";
import { Footer } from "@/components/Footer";
import { groomWearVendors } from "@/lib/groomWearData";
import { toggleWishlistItem, getWishlistItems } from "@/lib/wishlistStore";

const GROOM_CHIPS = [
  "All Styles",
  "Sherwanis",
  "Achkans",
  "Tuxedos",
  "Bandhgalas",
  "Rentals",
];

export function GroomWearListing() {
  const [search, setSearch] = useState("");
  const [activeChip, setActiveChip] = useState("All Styles");
  const [wishlist, setWishlist] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    const updateLocalWishlist = () => {
      const items = getWishlistItems();
      setWishlist(new Set(items.map((i) => String(i.id))));
    };
    updateLocalWishlist();
    window.addEventListener("cloche_wishlist_updated", updateLocalWishlist);
    return () => window.removeEventListener("cloche_wishlist_updated", updateLocalWishlist);
  }, []);

  const filteredVendors = useMemo(() => {
    return groomWearVendors.filter((v) => {
      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        v.name.toLowerCase().includes(q) ||
        v.location.toLowerCase().includes(q) ||
        v.subtitle.toLowerCase().includes(q);

      const searchTarget = activeChip.toLowerCase().replace("royal ", "").replace("collections", "").trim();
      const matchesChip =
        activeChip === "All Styles" ||
        (v.tags && v.tags.some((t) => t.toLowerCase().includes(searchTarget))) ||
        v.collections.some((c) => c.name.toLowerCase().includes(searchTarget)) ||
        v.subtitle.toLowerCase().includes(searchTarget);

      return matchesSearch && matchesChip;
    });
  }, [search, activeChip]);

  const handleWishlistToggle = (e: React.MouseEvent, item: any) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlistItem({
      id: item.id,
      name: item.name,
      category: "Groom Wear",
      image: item.image,
      location: item.location,
      rating: item.rating,
    });
  };

  return (
    <div className="min-h-screen bg-[#F5ECE1] text-[#2D241E] flex flex-col pb-24 font-sans">
      {/* Warm Sand Nude Header */}
      <section className="w-full bg-[#EADDCF] border-b border-[#D8C5B3] pt-5 pb-6 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D8C5B3] text-[#3B3028] text-[10px] font-bold uppercase tracking-wider">
                <UserCheck className="w-3 h-3 text-[#3B3028]" />
                <span>Sartorial Groom Collection</span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#3B3028] mt-1">
                Groom Wear & Couture
              </h1>
            </div>
            <p className="text-xs text-[#6E5D4F] max-w-md hidden sm:block leading-relaxed">
              Bespoke royal Sherwanis, velvet Achkans, Italian tuxedos & tailored Bandhgalas.
            </p>
          </div>

          {/* Search Input */}
          <div className="relative flex items-center bg-white rounded-xl p-1 shadow-xs border border-[#D8C5B3]">
            <Search className="w-4 h-4 text-[#7A6B5D] ml-3 shrink-0" />
            <input
              type="text"
              placeholder="Search Sherwanis, Tuxedos, Bandhgalas or designers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent px-2.5 py-1.5 text-xs text-[#2D241E] outline-none placeholder:text-[#9A8B7D]"
            />
          </div>

          {/* Nude Filter Chips */}
          <div className="flex gap-2 overflow-x-auto pt-1 scrollbar-none">
            {GROOM_CHIPS.map((chip) => {
              const active = activeChip === chip;
              return (
                <button
                  key={chip}
                  onClick={() => setActiveChip(chip)}
                  className={`shrink-0 px-3.5 py-1.5 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
                    active
                      ? "bg-[#3B3028] text-white shadow-xs"
                      : "bg-white text-[#5C4E43] border border-[#D8C5B3] hover:bg-[#EADDCF]"
                  }`}
                >
                  {chip}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Compact Cards Grid */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4">
          {filteredVendors.map((vendor) => {
            const isSaved = wishlist.has(String(vendor.id));
            const priceDisplay = vendor.prices[0]?.price || "₹35,000 Onwards";

            return (
              <Link
                key={vendor.id}
                href={`/categories/groom-wear/${vendor.id}`}
                className="group bg-white rounded-2xl overflow-hidden border border-[#E0D2C2] shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#EADDCF]">
                  <Image
                    src={vendor.image}
                    alt={vendor.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  <div className="absolute top-2 left-2 right-2 flex items-center justify-between z-10">
                    <span className="bg-[#3B3028]/85 text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full backdrop-blur-xs">
                      {priceDisplay}
                    </span>

                    <button
                      onClick={(e) => handleWishlistToggle(e, vendor)}
                      className={`w-7 h-7 rounded-full flex items-center justify-center backdrop-blur-md transition-transform active:scale-95 ${
                        isSaved ? "bg-rose-500 text-white shadow-xs" : "bg-white/80 text-[#2D241E] hover:bg-white"
                      }`}
                      aria-label="Save groom vendor"
                    >
                      <Heart className={`w-3.5 h-3.5 ${isSaved ? "fill-current" : ""}`} />
                    </button>
                  </div>

                  <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded-full flex items-center gap-1 text-white text-[10px] font-medium">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span>{vendor.rating}</span>
                  </div>
                </div>

                <div className="p-3 space-y-1.5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1">
                      <h2 className="font-serif font-bold text-sm text-[#2D241E] group-hover:text-[#3B3028] transition-colors truncate">
                        {vendor.name}
                      </h2>
                      {vendor.isVerified && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#C8A96A] shrink-0 fill-[#C8A96A]/10" />
                      )}
                    </div>

                    <p className="text-[11px] text-[#6E5D4F] line-clamp-1 leading-normal mt-0.5">
                      {vendor.subtitle}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#EFE4D6] flex items-center justify-between text-[11px]">
                    <span className="flex items-center gap-0.5 text-[#6E5D4F] truncate max-w-[65%]">
                      <MapPin className="w-3 h-3 text-[#C8A96A] shrink-0" />
                      <span className="truncate">{vendor.location}</span>
                    </span>

                    <span className="font-bold text-[#3B3028] flex items-center gap-0.5 shrink-0 group-hover:underline">
                      Explore <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </main>

      <Footer />
      <BottomNavBar />
    </div>
  );
}
