"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import { 
  Search, Star, CheckCircle2, MapPin, Heart, ChevronRight, Sparkles, Wand2, ShieldCheck 
} from "lucide-react";
import { BottomNavBar } from "@/components/BottomNavBar";
import { Footer } from "@/components/Footer";
import { makeupArtists } from "@/lib/vendorLists";
import { toggleWishlistItem, getWishlistItems } from "@/lib/wishlistStore";

const MAKEUP_CHIPS = [
  "All Looks",
  "HD Airbrush Makeup",
  "Kerala Traditional Glow",
  "Glamour & Reception",
  "Trial Sessions Available",
  "Travel To Venue",
];

export function MakeupListing() {
  const [search, setSearch] = useState("");
  const [activeChip, setActiveChip] = useState("All Looks");
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
        !q ||
        artist.name.toLowerCase().includes(q) ||
        artist.location.toLowerCase().includes(q) ||
        artist.about.toLowerCase().includes(q);

      const matchesChip =
        activeChip === "All Looks" ||
        artist.category.toLowerCase().includes(activeChip.toLowerCase().replace("hd ", "").replace("looks", ""));

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
    <div className="min-h-screen bg-[#FAF7F2] text-[#2D2520] flex flex-col pb-24">
      {/* Glamorous Rose-Emerald Hero Banner */}
      <section className="relative w-full bg-gradient-to-r from-[#0F4C45] via-[#176B61] to-[#0A3B36] text-white pt-8 pb-12 px-4 sm:px-6 lg:px-10 overflow-hidden shadow-xl">
        <div className="absolute right-0 bottom-0 w-80 h-80 bg-[#F4D0D8]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 text-center md:text-left max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C8A96A]/20 text-[#C8A96A] text-xs font-bold uppercase tracking-widest border border-[#C8A96A]/30">
              <Wand2 className="w-4 h-4 text-[#C8A96A]" />
              <span>Glamour & High-Definition Artistry</span>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-white">
              Bridal Makeup Artists
            </h1>

            <p className="text-emerald-100/80 text-xs sm:text-sm leading-relaxed">
              Book celebrity bridal makeup artists across Kerala. Specializing in HD Airbrush, glass-skin finishes, traditional Muhurtham glow, and luxury hair styling.
            </p>

            {/* Search Input */}
            <div className="pt-2">
              <div className="relative flex items-center bg-white rounded-2xl p-1.5 shadow-lg border border-[#E2D5C0]">
                <Search className="w-5 h-5 text-[#8E7D62] ml-3 shrink-0" />
                <input
                  type="text"
                  placeholder="Search makeup artist name, location, or HD airbrush..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-transparent px-3 py-2 text-xs sm:text-sm text-[#2D2520] outline-none placeholder:text-[#A79B8B]"
                />
              </div>
            </div>
          </div>

          <div className="w-full md:w-80 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
            <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden mb-3">
              <Image
                src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80"
                alt="HD Airbrush Makeup"
                fill
                className="object-cover"
              />
              <span className="absolute top-2 left-2 bg-[#0F4C45] text-[#C8A96A] text-[9px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full border border-[#C8A96A]/30">
                Premium Brands Only
              </span>
            </div>
            <h3 className="font-display font-bold text-sm text-white">MAC, Charlotte Tilbury & NARS</h3>
            <p className="text-[11px] text-emerald-100/70">Long-lasting 18-hour sweatproof HD bridal makeup.</p>
          </div>
        </div>
      </section>

      {/* Category Chips */}
      <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none">
          {MAKEUP_CHIPS.map((chip) => {
            const active = activeChip === chip;
            return (
              <button
                key={chip}
                onClick={() => setActiveChip(chip)}
                className={`shrink-0 px-5 py-2.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  active
                    ? "bg-[#0F4C45] text-white shadow-md font-bold"
                    : "bg-white text-[#2D2520]/80 border border-[#E2D5C0] hover:bg-[#F5F0E8]"
                }`}
              >
                {chip}
              </button>
            );
          })}
        </div>
      </section>

      {/* Artists Grid */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArtists.map((artist) => {
            const isSaved = wishlist.has(String(artist.id));
            const startingPrice = "₹25,000 Onwards";

            return (
              <Link
                key={artist.id}
                href={`/makeup/${artist.id}`}
                className="group bg-white rounded-3xl overflow-hidden border border-[#E2D5C0] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#FAF7F2]">
                  <Image
                    src={artist.image}
                    alt={artist.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                    <span className="bg-[#0F4C45]/90 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full backdrop-blur-xs">
                      {startingPrice}
                    </span>

                    <button
                      onClick={(e) => handleWishlistToggle(e, artist)}
                      className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-transform active:scale-95 ${
                        isSaved ? "bg-rose-500 text-white shadow-md" : "bg-white/80 text-[#2D2520] hover:bg-white"
                      }`}
                      aria-label="Save makeup artist"
                    >
                      <Heart className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
                    </button>
                  </div>

                  <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1.5 text-white text-xs font-semibold">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span>{artist.rating} ({artist.reviews})</span>
                  </div>
                </div>

                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5">
                      <h2 className="font-display font-bold text-lg text-[#2D2520] group-hover:text-[#0F4C45] transition-colors truncate">
                        {artist.name}
                      </h2>
                      <CheckCircle2 className="w-4 h-4 text-[#0F4C45] shrink-0 fill-[#0F4C45]/10" />
                    </div>

                    <p className="text-xs text-charcoal/70 line-clamp-2 leading-relaxed">
                      {artist.about}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#E2D5C0]/60 flex items-center justify-between gap-2 text-xs">
                    <span className="flex items-center gap-1 text-charcoal/60 truncate">
                      <MapPin className="w-3.5 h-3.5 text-[#0F4C45] shrink-0" />
                      <span className="truncate">{artist.location}</span>
                    </span>

                    <span className="font-bold text-[#0F4C45] group-hover:underline flex items-center gap-1 shrink-0">
                      View Portfolio <ChevronRight className="w-4 h-4" />
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
