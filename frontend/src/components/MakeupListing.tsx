"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import { Search, Star, CheckCircle2, MapPin, Heart, ChevronRight, Wand2 } from "lucide-react";
import { BottomNavBar } from "@/components/BottomNavBar";
import { Footer } from "@/components/Footer";
import { makeupArtists } from "@/lib/vendorLists";
import { toggleWishlistItem, getWishlistItems } from "@/lib/wishlistStore";

const MAKEUP_CHIPS = ["All", "HD Airbrush", "Kerala Glow", "Glamour", "Trials", "Venue Travel"];

export function MakeupListing() {
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

  const filteredArtists = useMemo(() => {
    return makeupArtists.filter((artist) => {
      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q || artist.name.toLowerCase().includes(q) || artist.location.toLowerCase().includes(q) || artist.about.toLowerCase().includes(q);

      const targetChip = activeChip.toLowerCase().replace("hd ", "").replace("venue travel", "travel").trim();
      const matchesChip =
        activeChip === "All" || artist.category.toLowerCase().includes(targetChip) || artist.about.toLowerCase().includes(targetChip);

      return matchesSearch && matchesChip;
    });
  }, [search, activeChip]);

  const handleWishlistToggle = (e: React.MouseEvent, item: any) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlistItem({
      id: item.id,
      name: item.name,
      category: "Makeup",
      image: item.image,
      location: item.location,
      rating: item.rating,
    });
  };

  return (
    <div className="min-h-screen bg-[#FCF5F3] text-[#3B2C2A] flex flex-col pb-24 font-sans">
      {/* Peach Blush Nude Header */}
      <section className="w-full bg-[#F8E8E4] border-b border-[#EBD2CC] py-4 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto space-y-2.5">
          <div className="flex items-center justify-between">
            <div>
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#EBD2CC] text-[#854F46] text-[9.5px] font-bold uppercase tracking-wider">
                <Wand2 className="w-2.5 h-2.5 text-[#854F46]" />
                <span>Blush Peach Nude Makeup</span>
              </div>
              <h1 className="font-serif text-xl sm:text-2xl font-bold text-[#54332D] mt-0.5">
                Bridal Makeup Artists
              </h1>
            </div>
            <span className="text-[11px] font-bold text-[#854F46] bg-white/70 px-2.5 py-1 rounded-full border border-[#EBD2CC]">
              {filteredArtists.length} Artists
            </span>
          </div>

          {/* Search & Chips Row */}
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1 flex items-center bg-white rounded-xl px-2.5 py-1 shadow-xs border border-[#EBD2CC]">
              <Search className="w-3.5 h-3.5 text-[#AC8A84] mr-2 shrink-0" />
              <input
                type="text"
                placeholder="Search artist or city..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent text-xs text-[#3B2C2A] outline-none placeholder:text-[#BF9F99]"
              />
            </div>

            <div className="flex gap-1.5 overflow-x-auto scrollbar-none py-0.5">
              {MAKEUP_CHIPS.map((chip) => {
                const active = activeChip === chip;
                return (
                  <button
                    key={chip}
                    onClick={() => setActiveChip(chip)}
                    className={`shrink-0 px-3 py-1 rounded-full text-[10.5px] font-semibold transition-all cursor-pointer ${
                      active
                        ? "bg-[#854F46] text-white shadow-xs"
                        : "bg-white text-[#70423A] border border-[#EBD2CC] hover:bg-[#F8E8E4]"
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
          {filteredArtists.map((artist) => {
            const isSaved = wishlist.has(String(artist.id));
            const startingPrice = "₹25k+";

            return (
              <Link
                key={artist.id}
                href={`/makeup/${artist.id}`}
                className="group bg-white rounded-xl overflow-hidden border border-[#F0DAD5] shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_20px_rgba(133,79,70,0.12)] hover:border-[#854F46]/40 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="relative aspect-[16/11] w-full overflow-hidden bg-[#F8E8E4]">
                  <Image
                    src={artist.image}
                    alt={artist.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  <div className="absolute top-1.5 left-1.5 right-1.5 flex items-center justify-between z-10">
                    <span className="bg-[#854F46]/90 text-white text-[8.5px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md backdrop-blur-xs">
                      {startingPrice}
                    </span>

                    <button
                      onClick={(e) => handleWishlistToggle(e, artist)}
                      className={`w-6 h-6 rounded-full flex items-center justify-center backdrop-blur-md transition-transform active:scale-95 ${
                        isSaved ? "bg-rose-500 text-white" : "bg-white/85 text-[#3B2C2A] hover:bg-white"
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
                      <h2 className="font-serif font-bold text-[12.5px] text-[#3B2C2A] group-hover:text-[#854F46] transition-colors truncate">
                        {artist.name}
                      </h2>
                      <CheckCircle2 className="w-3 h-3 text-[#C8A96A] shrink-0" />
                    </div>

                    <p className="text-[10px] text-[#916E67] line-clamp-1 leading-tight mt-0.5">
                      {artist.about}
                    </p>
                  </div>

                  <div className="pt-1.5 border-t border-[#F8EDE9] flex items-center justify-between text-[10px]">
                    <span className="flex items-center gap-0.5 text-[#916E67] truncate max-w-[65%]">
                      <MapPin className="w-2.5 h-2.5 text-[#854F46] shrink-0" />
                      <span className="truncate">{artist.location}</span>
                    </span>

                    <span className="font-bold text-[#854F46] flex items-center gap-0.5 shrink-0 group-hover:underline">
                      Portfolio <ChevronRight className="w-2.5 h-2.5" />
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
