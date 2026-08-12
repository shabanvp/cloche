"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import { Search, Star, CheckCircle2, MapPin, Heart, ChevronRight, Camera } from "lucide-react";
import { BottomNavBar } from "@/components/BottomNavBar";
import { Footer } from "@/components/Footer";
import { photographers } from "@/lib/vendorLists";
import { toggleWishlistItem, getWishlistItems } from "@/lib/wishlistStore";

const PHOTO_CHIPS = ["All", "Candid", "Traditional", "Pre-Wedding", "Cinematic", "Drone"];

export function PhotographersListing() {
  const [search, setSearch] = useState("");
  const [activeChip, setActiveChip] = useState("All");
  const [wishlist, setWishlist] = useState<Set<string>>(() => new Set());
  const [photographersList, setPhotographersList] = useState<any[]>(photographers);

  useEffect(() => {
    fetch("/api/v1/public/vendors?category=photographers", { cache: "no-store" })
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          const mapped = json.data.map((dbV: any) => ({
            id: dbV.id,
            name: dbV.name,
            about: dbV.tagline || dbV.about || "Luxury Wedding Photography & Cinematic Films",
            location: dbV.city || dbV.state || "Kerala, India",
            rating: dbV.rating || 4.9,
            reviews: dbV.reviewCount || 0,
            price: dbV.startingPrice || "₹65,000 / day",
            category: "Photographers",
            isVerified: dbV.isVerified ?? true,
            image: dbV.coverImage || dbV.logo || photographers[0].image,
            portfolio: [dbV.coverImage || dbV.logo, dbV.logo].filter(Boolean),
          }));

          const dbIds = new Set(mapped.map((m: any) => m.id));
          const existingFiltered = photographers.filter((p) => !dbIds.has(p.id));
          setPhotographersList([...mapped, ...existingFiltered]);
        }
      })
      .catch((err) => console.error("Error fetching live photographer vendors:", err));
  }, []);

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
    return photographersList.filter((photo) => {
      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q || photo.name.toLowerCase().includes(q) || photo.location.toLowerCase().includes(q) || photo.about.toLowerCase().includes(q);

      const targetChip = activeChip.toLowerCase().trim();
      const matchesChip =
        activeChip === "All" || photo.about.toLowerCase().includes(targetChip) || photo.category.toLowerCase().includes(targetChip);

      return matchesSearch && matchesChip;
    });
  }, [search, activeChip, photographersList]);

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
    <div className="min-h-screen bg-[#F8F5F0] text-[#2D2520] flex flex-col pb-24 font-sans">
      {/* Warm #F8F5F0 Header */}
      <section className="w-full bg-[#EFE8DE] border-b border-[#E2D6C7] py-4 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto space-y-2.5">
          <div className="flex items-center justify-between">
            <div>
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#E2D6C7] text-[#0F4C45] text-[9.5px] font-bold uppercase tracking-wider">
                <Camera className="w-2.5 h-2.5 text-[#0F4C45]" />
                <span>Cinematic Photography Directory</span>
              </div>
              <h1 className="font-serif text-xl sm:text-2xl font-bold text-[#0F4C45] mt-0.5">
                Wedding Photographers
              </h1>
            </div>
            <span className="text-[11px] font-bold text-[#0F4C45] bg-white/70 px-2.5 py-1 rounded-full border border-[#E2D6C7]">
              {filteredPhotographers.length} Studios
            </span>
          </div>

          {/* Search & Chips Row */}
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1 flex items-center bg-white rounded-xl px-2.5 py-1 shadow-xs border border-[#E2D6C7]">
              <Search className="w-3.5 h-3.5 text-[#8C827A] mr-2 shrink-0" />
              <input
                type="text"
                placeholder="Search photographer or city..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent text-xs text-[#2D2520] outline-none placeholder:text-[#AAA29A]"
              />
            </div>

            <div className="flex gap-1.5 overflow-x-auto scrollbar-none py-0.5">
              {PHOTO_CHIPS.map((chip) => {
                const active = activeChip === chip;
                return (
                  <button
                    key={chip}
                    onClick={() => setActiveChip(chip)}
                    className={`shrink-0 px-3 py-1 rounded-full text-[10.5px] font-semibold transition-all cursor-pointer ${
                      active
                        ? "bg-[#0F4C45] text-white shadow-xs"
                        : "bg-white text-[#4A3F35] border border-[#E2D6C7] hover:bg-[#EFE8DE]"
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
          {filteredPhotographers.map((photo) => {
            const isSaved = wishlist.has(String(photo.id));
            const priceDisplay = "₹50k/day";

            return (
              <Link
                key={photo.id}
                href={`/photographers/${photo.id}`}
                className="group bg-white rounded-xl overflow-hidden border border-[#E8DFC5]/80 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_20px_rgba(15,76,69,0.12)] hover:border-[#0F4C45]/40 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="relative aspect-[16/11] w-full overflow-hidden bg-[#EFE8DE]">
                  <Image
                    src={photo.image}
                    alt={photo.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  <div className="absolute top-1.5 left-1.5 right-1.5 flex items-center justify-between z-10">
                    <span className="bg-[#0F4C45]/90 text-white text-[8.5px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md backdrop-blur-xs">
                      {priceDisplay}
                    </span>

                    <button
                      onClick={(e) => handleWishlistToggle(e, photo)}
                      className={`w-6 h-6 rounded-full flex items-center justify-center backdrop-blur-md transition-transform active:scale-95 ${
                        isSaved ? "bg-rose-500 text-white" : "bg-white/85 text-[#2D2520] hover:bg-white"
                      }`}
                      aria-label="Save"
                    >
                      <Heart className={`w-3 h-3 ${isSaved ? "fill-current" : ""}`} />
                    </button>
                  </div>

                  <div className="absolute bottom-1.5 left-1.5 bg-black/60 backdrop-blur-xs px-1.5 py-0.5 rounded-md flex items-center gap-0.5 text-white text-[9px] font-semibold">
                    <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                    <span>{photo.rating}</span>
                  </div>
                </div>

                <div className="p-2.5 space-y-1 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1">
                      <h2 className="font-serif font-bold text-[12.5px] text-[#2D2520] group-hover:text-[#0F4C45] transition-colors truncate">
                        {photo.name}
                      </h2>
                      <CheckCircle2 className="w-3 h-3 text-[#C8A96A] shrink-0" />
                    </div>

                    <p className="text-[10px] text-[#7A6E65] line-clamp-1 leading-tight mt-0.5">
                      {photo.about}
                    </p>
                  </div>

                  <div className="pt-1.5 border-t border-[#F2EBE1] flex items-center justify-between text-[10px]">
                    <span className="flex items-center gap-0.5 text-[#7A6E65] truncate max-w-[65%]">
                      <MapPin className="w-2.5 h-2.5 text-[#0F4C45] shrink-0" />
                      <span className="truncate">{photo.location}</span>
                    </span>

                    <span className="font-bold text-[#0F4C45] flex items-center gap-0.5 shrink-0 group-hover:underline">
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
