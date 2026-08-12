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

  const [liveDbArtists, setLiveDbArtists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadMakeupVendors() {
      try {
        const res = await fetch("/api/v1/public/vendors?category=makeup", { cache: "no-store" });
        if (res.ok) {
          const json = await res.json();
          if (isMounted && Array.isArray(json.data) && json.data.length > 0) {
            setLiveDbArtists(json.data);
          }
        }
      } catch (_) {} finally {
        if (isMounted) setLoading(false);
      }
    }
    loadMakeupVendors();
    return () => { isMounted = false; };
  }, []);

  const allArtists = useMemo(() => {
    return liveDbArtists.length > 0 ? liveDbArtists : makeupArtists;
  }, [liveDbArtists]);

  const filteredArtists = useMemo(() => {
    return allArtists.filter((artist: any) => {
      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q || artist.name.toLowerCase().includes(q) || (artist.location || artist.city || "").toLowerCase().includes(q) || (artist.about || "").toLowerCase().includes(q);

      const targetChip = activeChip.toLowerCase().replace("hd ", "").replace("venue travel", "travel").trim();
      const matchesChip =
        activeChip === "All" || (artist.category || "").toLowerCase().includes(targetChip) || (artist.about || "").toLowerCase().includes(targetChip);

      return matchesSearch && matchesChip;
    });
  }, [allArtists, search, activeChip]);

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
    <div className="min-h-screen bg-[#F8F5F0] text-[#2D2520] flex flex-col pb-24 font-sans">
      {/* Warm #F8F5F0 Header */}
      <section className="w-full bg-[#EFE8DE] border-b border-[#E2D6C7] py-4 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto space-y-2.5">
          <div className="flex items-center justify-between">
            <div>
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#E2D6C7] text-[#0F4C45] text-[9.5px] font-bold uppercase tracking-wider">
                <Wand2 className="w-2.5 h-2.5 text-[#0F4C45]" />
                <span>Glamour & HD Artistry</span>
              </div>
              <h1 className="font-serif text-xl sm:text-2xl font-bold text-[#0F4C45] mt-0.5">
                Bridal Makeup Artists
              </h1>
            </div>
            <span className="text-[11px] font-bold text-[#0F4C45] bg-white/70 px-2.5 py-1 rounded-full border border-[#E2D6C7]">
              {filteredArtists.length} Artists
            </span>
          </div>

          {/* Search & Chips Row */}
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1 flex items-center bg-white rounded-xl px-2.5 py-1 shadow-xs border border-[#E2D6C7]">
              <Search className="w-3.5 h-3.5 text-[#8C827A] mr-2 shrink-0" />
              <input
                type="text"
                placeholder="Search artist or city..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent text-xs text-[#2D2520] outline-none placeholder:text-[#AAA29A]"
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
          {filteredArtists.map((artist) => {
            const isSaved = wishlist.has(String(artist.id));
            const startingPrice = "₹25k+";

            return (
              <Link
                key={artist.id}
                href={`/makeup/${artist.id}`}
                className="group bg-white rounded-xl overflow-hidden border border-[#E8DFC5]/80 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_20px_rgba(15,76,69,0.12)] hover:border-[#0F4C45]/40 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="relative aspect-[16/11] w-full overflow-hidden bg-[#EFE8DE]">
                  <Image
                    src={artist.image}
                    alt={artist.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  <div className="absolute top-1.5 left-1.5 right-1.5 flex items-center justify-between z-10">
                    <span className="bg-[#0F4C45]/90 text-white text-[8.5px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md backdrop-blur-xs">
                      {startingPrice}
                    </span>

                    <button
                      onClick={(e) => handleWishlistToggle(e, artist)}
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
                    <span>{artist.rating}</span>
                  </div>
                </div>

                <div className="p-2.5 space-y-1 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1">
                      <h2 className="font-serif font-bold text-[12.5px] text-[#2D2520] group-hover:text-[#0F4C45] transition-colors truncate">
                        {artist.name}
                      </h2>
                      <CheckCircle2 className="w-3 h-3 text-[#C8A96A] shrink-0" />
                    </div>

                    <p className="text-[10px] text-[#7A6E65] line-clamp-1 leading-tight mt-0.5">
                      {artist.about}
                    </p>
                  </div>

                  <div className="pt-1.5 border-t border-[#F2EBE1] flex items-center justify-between text-[10px]">
                    <span className="flex items-center gap-0.5 text-[#7A6E65] truncate max-w-[65%]">
                      <MapPin className="w-2.5 h-2.5 text-[#0F4C45] shrink-0" />
                      <span className="truncate">{artist.location}</span>
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
