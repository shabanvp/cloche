"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import { 
  Search, Star, CheckCircle2, MapPin, Heart, ChevronRight, Sparkles, UserCheck 
} from "lucide-react";
import { BottomNavBar } from "@/components/BottomNavBar";
import { Footer } from "@/components/Footer";
import { groomWearVendors } from "@/lib/groomWearData";
import { toggleWishlistItem, getWishlistItems } from "@/lib/wishlistStore";

const GROOM_CHIPS = [
  "All Styles",
  "Royal Sherwanis",
  "Velvet Achkans",
  "Italian Tuxedos",
  "Bandhgala Suits",
  "Rental Collections",
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
    <div className="min-h-screen bg-[#111827] text-white flex flex-col pb-24">
      {/* Dark Luxury Hero Banner */}
      <section className="relative w-full bg-gradient-to-r from-[#1F2937] via-[#111827] to-[#030712] border-b border-[#374151] pt-8 pb-12 px-4 sm:px-6 lg:px-10 overflow-hidden shadow-2xl">
        <div className="absolute right-0 top-0 w-96 h-96 bg-[#C8A96A]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 text-center md:text-left max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C8A96A]/20 text-[#C8A96A] text-xs font-bold uppercase tracking-widest border border-[#C8A96A]/30">
              <UserCheck className="w-4 h-4 text-[#C8A96A]" />
              <span>Sartorial Groom Wardrobe</span>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-white">
              Groom Wear & Couture
            </h1>

            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
              Bespoke royal Sherwanis, hand-embroidered velvet Achkans, Italian tuxedos, and tailored Bandhgalas designed for the modern royal groom.
            </p>

            {/* Search Input */}
            <div className="pt-2">
              <div className="relative flex items-center bg-[#1F2937] rounded-2xl p-1.5 border border-gray-700 shadow-inner">
                <Search className="w-5 h-5 text-gray-400 ml-3 shrink-0" />
                <input
                  type="text"
                  placeholder="Search Sherwanis, Tuxedos, Bandhgalas or designers..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-transparent px-3 py-2 text-xs sm:text-sm text-white outline-none placeholder:text-gray-500"
                />
              </div>
            </div>
          </div>

          <div className="w-full md:w-80 bg-gray-800/60 rounded-2xl p-4 border border-gray-700 backdrop-blur-md">
            <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden mb-3">
              <Image
                src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80"
                alt="Groom Signature Suit"
                fill
                className="object-cover"
              />
              <span className="absolute top-2 left-2 bg-[#C8A96A] text-black text-[9px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full">
                Custom Tailoring
              </span>
            </div>
            <h3 className="font-display font-bold text-sm text-white">Bespoke Groom Trial Sessions</h3>
            <p className="text-[11px] text-gray-400">Personalized fittings, embroidery customizations & door-step trials available.</p>
          </div>
        </div>
      </section>

      {/* Category Chips */}
      <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none">
          {GROOM_CHIPS.map((chip) => {
            const active = activeChip === chip;
            return (
              <button
                key={chip}
                onClick={() => setActiveChip(chip)}
                className={`shrink-0 px-5 py-2.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  active
                    ? "bg-[#C8A96A] text-black shadow-lg font-bold"
                    : "bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700"
                }`}
              >
                {chip}
              </button>
            );
          })}
        </div>
      </section>

      {/* Vendors Grid */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVendors.map((vendor) => {
            const isSaved = wishlist.has(String(vendor.id));
            const priceDisplay = vendor.prices[0]?.price || "₹35,000 Onwards";

            return (
              <Link
                key={vendor.id}
                href={`/categories/groom-wear/${vendor.id}`}
                className="group bg-gray-900 rounded-3xl overflow-hidden border border-gray-800 hover:border-[#C8A96A]/60 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-800">
                  <Image
                    src={vendor.image}
                    alt={vendor.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                    <span className="bg-black/80 text-[#C8A96A] text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-[#C8A96A]/30 backdrop-blur-xs">
                      {priceDisplay}
                    </span>

                    <button
                      onClick={(e) => handleWishlistToggle(e, vendor)}
                      className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-transform active:scale-95 ${
                        isSaved ? "bg-rose-500 text-white shadow-md" : "bg-black/60 text-white hover:bg-black"
                      }`}
                      aria-label="Save groom vendor"
                    >
                      <Heart className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
                    </button>
                  </div>

                  <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1.5 text-white text-xs font-semibold border border-gray-700">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span>{vendor.rating} ({vendor.reviews})</span>
                  </div>
                </div>

                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5">
                      <h2 className="font-display font-bold text-lg text-white group-hover:text-[#C8A96A] transition-colors truncate">
                        {vendor.name}
                      </h2>
                      {vendor.isVerified && (
                        <CheckCircle2 className="w-4 h-4 text-[#C8A96A] shrink-0 fill-[#C8A96A]/20" />
                      )}
                    </div>

                    <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                      {vendor.subtitle}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-gray-800 flex items-center justify-between gap-2 text-xs">
                    <span className="flex items-center gap-1 text-gray-400 truncate">
                      <MapPin className="w-3.5 h-3.5 text-[#C8A96A] shrink-0" />
                      <span className="truncate">{vendor.location}</span>
                    </span>

                    <span className="font-bold text-[#C8A96A] group-hover:underline flex items-center gap-1 shrink-0">
                      Explore Groom Suits <ChevronRight className="w-4 h-4" />
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
