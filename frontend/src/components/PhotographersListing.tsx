"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import { 
  Search, Star, CheckCircle2, MapPin, Heart, ChevronRight, Camera 
} from "lucide-react";
import { BottomNavBar } from "@/components/BottomNavBar";
import { Footer } from "@/components/Footer";
import { photographers } from "@/lib/vendorLists";
import { toggleWishlistItem, getWishlistItems } from "@/lib/wishlistStore";

const PHOTO_CHIPS = [
  "All Styles",
  "Candid Photography",
  "Traditional",
  "Pre-Wedding Films",
  "Cinematic Teasers",
  "Drone Shoot",
];

export function PhotographersListing() {
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

  const filteredPhotographers = useMemo(() => {
    return photographers.filter((photo) => {
      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        photo.name.toLowerCase().includes(q) ||
        photo.location.toLowerCase().includes(q) ||
        photo.about.toLowerCase().includes(q);

      const targetChip = activeChip.toLowerCase().replace("photography", "").replace(" films", "").replace(" teasers", "").trim();
      const matchesChip =
        activeChip === "All Styles" ||
        photo.about.toLowerCase().includes(targetChip) ||
        photo.category.toLowerCase().includes(targetChip);

      return matchesSearch && matchesChip;
    });
  }, [search, activeChip]);

  const handleWishlistToggle = (e: React.MouseEvent, item: any) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlistItem({
      id: item.id,
      name: item.name,
      category: "Photographers",
      image: item.image,
      location: item.location,
      rating: item.rating,
    });
  };

  return (
    <div className="min-h-screen bg-[#FAF5EF] text-[#2D241E] flex flex-col pb-24 font-sans">
      {/* Warm Champagne Nude Header */}
      <section className="w-full bg-[#F3E9DD] border-b border-[#E3D3C2] pt-5 pb-6 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E3D3C2] text-[#4A3B2D] text-[10px] font-bold uppercase tracking-wider">
                <Camera className="w-3 h-3 text-[#4A3B2D]" />
                <span>Cinematic Visual Directory</span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#3B2F24] mt-1">
                Wedding Photographers
              </h1>
            </div>
            <p className="text-xs text-[#7B6A5A] max-w-md hidden sm:block leading-relaxed">
              Candid photography, traditional muhurtham stories, pre-wedding films & 4K cinematic teasers.
            </p>
          </div>

          {/* Search Input */}
          <div className="relative flex items-center bg-white rounded-xl p-1 shadow-xs border border-[#E3D3C2]">
            <Search className="w-4 h-4 text-[#8C7A6B] ml-3 shrink-0" />
            <input
              type="text"
              placeholder="Search photographer name, candid style, or city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent px-2.5 py-1.5 text-xs text-[#2D241E] outline-none placeholder:text-[#A89888]"
            />
          </div>

          {/* Nude Filter Chips */}
          <div className="flex gap-2 overflow-x-auto pt-1 scrollbar-none">
            {PHOTO_CHIPS.map((chip) => {
              const active = activeChip === chip;
              return (
                <button
                  key={chip}
                  onClick={() => setActiveChip(chip)}
                  className={`shrink-0 px-3.5 py-1.5 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
                    active
                      ? "bg-[#3B2F24] text-white shadow-xs"
                      : "bg-white text-[#5C4C3E] border border-[#E3D3C2] hover:bg-[#F3E9DD]"
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
          {filteredPhotographers.map((photo) => {
            const isSaved = wishlist.has(String(photo.id));
            const priceDisplay = "₹50,000 / day";

            return (
              <Link
                key={photo.id}
                href={`/photographers/${photo.id}`}
                className="group bg-white rounded-2xl overflow-hidden border border-[#E8DDD0] shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F3E9DD]">
                  <Image
                    src={photo.image}
                    alt={photo.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  <div className="absolute top-2 left-2 right-2 flex items-center justify-between z-10">
                    <span className="bg-[#3B2F24]/85 text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full backdrop-blur-xs">
                      {priceDisplay}
                    </span>

                    <button
                      onClick={(e) => handleWishlistToggle(e, photo)}
                      className={`w-7 h-7 rounded-full flex items-center justify-center backdrop-blur-md transition-transform active:scale-95 ${
                        isSaved ? "bg-rose-500 text-white shadow-xs" : "bg-white/80 text-[#2D241E] hover:bg-white"
                      }`}
                      aria-label="Save photographer"
                    >
                      <Heart className={`w-3.5 h-3.5 ${isSaved ? "fill-current" : ""}`} />
                    </button>
                  </div>

                  <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded-full flex items-center gap-1 text-white text-[10px] font-medium">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span>{photo.rating} ({photo.reviews})</span>
                  </div>
                </div>

                <div className="p-3 space-y-1.5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1">
                      <h2 className="font-serif font-bold text-sm text-[#2D241E] group-hover:text-[#3B2F24] transition-colors truncate">
                        {photo.name}
                      </h2>
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#C8A96A] shrink-0 fill-[#C8A96A]/10" />
                    </div>

                    <p className="text-[11px] text-[#7B6A5A] line-clamp-1 leading-normal mt-0.5">
                      {photo.about}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#F0E6DC] flex items-center justify-between text-[11px]">
                    <span className="flex items-center gap-0.5 text-[#7B6A5A] truncate max-w-[65%]">
                      <MapPin className="w-3 h-3 text-[#C8A96A] shrink-0" />
                      <span className="truncate">{photo.location}</span>
                    </span>

                    <span className="font-bold text-[#3B2F24] flex items-center gap-0.5 shrink-0 group-hover:underline">
                      Portfolio <ChevronRight className="w-3 h-3" />
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
