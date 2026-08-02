"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import { Search, Star, CheckCircle2, MapPin, Heart, ChevronRight, Flower2 } from "lucide-react";
import { BottomNavBar } from "@/components/BottomNavBar";
import { Footer } from "@/components/Footer";
import { mehendiVendors } from "@/lib/mehendiData";
import { toggleWishlistItem, getWishlistItems } from "@/lib/wishlistStore";

const MEHENDI_CHIPS = ["All", "Bridal Heavy", "Arabic", "Portrait", "Organic Henna", "Family Pack"];

export function MehendiListing() {
  const [search, setSearch] = useState("");
  const [activeChip, setActiveChip] = useState("All");
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
    return mehendiVendors.filter((artist) => {
      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q || artist.name.toLowerCase().includes(q) || artist.location.toLowerCase().includes(q) || artist.subtitle.toLowerCase().includes(q);

      const targetChip = activeChip.toLowerCase().replace("bridal ", "").replace(" pack", "").trim();
      const matchesChip =
        activeChip === "All" ||
        (artist.chips && artist.chips.some((c) => c.toLowerCase().includes(targetChip))) ||
        ((artist as any).tags && (artist as any).tags.some((t: string) => t.toLowerCase().includes(targetChip))) ||
        artist.subtitle.toLowerCase().includes(targetChip);

      return matchesSearch && matchesChip;
    });
  }, [search, activeChip]);

  const handleWishlistToggle = (e: React.MouseEvent, item: any) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlistItem({
      id: item.id,
      name: item.name,
      category: "Mehendi",
      image: item.image,
      location: item.location,
      rating: item.rating,
    });
  };

  return (
    <div className="min-h-screen bg-[#FAF6F2] text-[#38281F] flex flex-col pb-24 font-sans">
      {/* Terrakotta Henna Clay Nude Header */}
      <section className="w-full bg-[#F4E8DC] border-b border-[#E4D0BD] py-4 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto space-y-2.5">
          <div className="flex items-center justify-between">
            <div>
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#E4D0BD] text-[#6B4734] text-[9.5px] font-bold uppercase tracking-wider">
                <Flower2 className="w-2.5 h-2.5 text-[#6B4734]" />
                <span>Terrakotta Henna Nude</span>
              </div>
              <h1 className="font-serif text-xl sm:text-2xl font-bold text-[#452D21] mt-0.5">
                Bridal Mehendi Artists
              </h1>
            </div>
            <span className="text-[11px] font-bold text-[#6B4734] bg-white/70 px-2.5 py-1 rounded-full border border-[#E4D0BD]">
              {filteredVendors.length} Artists
            </span>
          </div>

          {/* Search & Chips Row */}
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1 flex items-center bg-white rounded-xl px-2.5 py-1 shadow-xs border border-[#E4D0BD]">
              <Search className="w-3.5 h-3.5 text-[#9C8271] mr-2 shrink-0" />
              <input
                type="text"
                placeholder="Search artist or city..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent text-xs text-[#38281F] outline-none placeholder:text-[#B09888]"
              />
            </div>

            <div className="flex gap-1.5 overflow-x-auto scrollbar-none py-0.5">
              {MEHENDI_CHIPS.map((chip) => {
                const active = activeChip === chip;
                return (
                  <button
                    key={chip}
                    onClick={() => setActiveChip(chip)}
                    className={`shrink-0 px-3 py-1 rounded-full text-[10.5px] font-semibold transition-all cursor-pointer ${
                      active
                        ? "bg-[#6B4734] text-white shadow-xs"
                        : "bg-white text-[#5C3D2C] border border-[#E4D0BD] hover:bg-[#F4E8DC]"
                    }`}
                  >
                    {chip}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Extra Small Compact Panels Grid */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-3">
          {filteredVendors.map((artist) => {
            const isSaved = wishlist.has(String(artist.id));
            const startingPrice = artist.price || "₹5k+";

            return (
              <Link
                key={artist.id}
                href={`/categories/mehendi/${artist.id}`}
                className="group bg-white rounded-xl overflow-hidden border border-[#EADCCF] shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_20px_rgba(107,71,52,0.12)] hover:border-[#6B4734]/40 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="relative aspect-[16/11] w-full overflow-hidden bg-[#F4E8DC]">
                  <Image
                    src={artist.image}
                    alt={artist.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  <div className="absolute top-1.5 left-1.5 right-1.5 flex items-center justify-between z-10">
                    <span className="bg-[#6B4734]/90 text-white text-[8.5px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md backdrop-blur-xs">
                      {startingPrice}
                    </span>

                    <button
                      onClick={(e) => handleWishlistToggle(e, artist)}
                      className={`w-6 h-6 rounded-full flex items-center justify-center backdrop-blur-md transition-transform active:scale-95 ${
                        isSaved ? "bg-rose-500 text-white" : "bg-white/85 text-[#38281F] hover:bg-white"
                      }`}
                      aria-label="Save"
                    >
                      <Heart className={`w-3 h-3 ${isSaved ? "fill-current" : ""}`} />
                    </button>
                  </div>

                  <div className="absolute bottom-1.5 left-1.5 bg-black/60 backdrop-blur-xs px-1.5 py-0.5 rounded-md flex items-center gap-0.5 text-white text-[9px] font-semibold">
                    <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                    <span>{artist.rating}</span>
                  </div>
                </div>

                <div className="p-2.5 space-y-1 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1">
                      <h2 className="font-serif font-bold text-[12.5px] text-[#38281F] group-hover:text-[#6B4734] transition-colors truncate">
                        {artist.name}
                      </h2>
                      {artist.isVerified && (
                        <CheckCircle2 className="w-3 h-3 text-[#C8A96A] shrink-0" />
                      )}
                    </div>

                    <p className="text-[10px] text-[#8C7060] line-clamp-1 leading-tight mt-0.5">
                      {artist.subtitle}
                    </p>
                  </div>

                  <div className="pt-1.5 border-t border-[#F5EDE6] flex items-center justify-between text-[10px]">
                    <span className="flex items-center gap-0.5 text-[#8C7060] truncate max-w-[65%]">
                      <MapPin className="w-2.5 h-2.5 text-[#6B4734] shrink-0" />
                      <span className="truncate">{artist.location}</span>
                    </span>

                    <span className="font-bold text-[#6B4734] flex items-center gap-0.5 shrink-0 group-hover:underline">
                      Designs <ChevronRight className="w-2.5 h-2.5" />
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
