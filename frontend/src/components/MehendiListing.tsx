"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useMemo } from "react";
import {
  ArrowLeft,
  Search,
  SlidersHorizontal,
  ChevronDown,
  ChevronRight,
  Star,
  CheckCircle2,
  MapPin,
  Heart,
} from "lucide-react";
import { BottomNavBar } from "@/components/BottomNavBar";
import { mehendiVendors, MehendiVendor } from "@/lib/mehendiData";

export function MehendiListing() {
  const [search, setSearch] = useState("");
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());

  const filteredVendors = useMemo(() => {
    return mehendiVendors.filter((artist) => {
      return (
        artist.name.toLowerCase().includes(search.toLowerCase()) ||
        artist.location.toLowerCase().includes(search.toLowerCase()) ||
        artist.subtitle.toLowerCase().includes(search.toLowerCase())
      );
    });
  }, [search]);

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
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] pb-24 text-[#2D2520]">
      <main className="flex-1">
        {/* Banner Hero Section matching Picture 1 */}
        <div className="relative w-full overflow-hidden bg-[#FAF7F2]">
          <div className="relative flex items-center justify-between px-4 pt-4 pb-4 sm:px-6">
            <div className="flex items-center gap-3 z-10 max-w-[60%]">
              <Link
                href="/categories"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EFE9DF] text-[#0F4C45] transition-transform active:scale-95 hover:bg-[#E5DDCF]"
                aria-label="Back to categories"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#D4B66E]/20 text-[#0F4C45]">
                    <span className="material-symbols-outlined text-[20px]">brush</span>
                  </div>
                  <h1 className="font-serif text-[28px] sm:text-[34px] font-bold text-[#0F4C45] leading-none">
                    Mehendi
                  </h1>
                </div>
                <p className="mt-1 font-serif text-[15px] font-semibold text-[#1A1410]">
                  Bridal Mehendi Artists
                </p>
                <p className="mt-0.5 text-[12px] text-[#5A6561] leading-tight">
                  Celebrate your love with intricate henna artistry
                </p>
              </div>
            </div>

            {/* Right Hero Image */}
            <div className="relative w-[38%] aspect-[4/3] rounded-2xl overflow-hidden shadow-sm border border-black/5">
              <Image
                src="https://images.unsplash.com/photo-1605001011156-cbf0b0f67a51?auto=format&fit=crop&w=600&q=80"
                alt="Mehendi banner"
                fill
                className="object-cover object-center"
              />
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-4 py-2">
          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center gap-2.5 rounded-2xl bg-white px-4 py-2.5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-black/5">
              <Search className="h-4 w-4 shrink-0 text-[#8C827A]" />
              <input
                type="text"
                placeholder="Search Mehendi artists by name or location"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent text-[13px] sm:text-[14px] outline-none placeholder:text-[#AAA29A] text-[#1A1410]"
              />
            </div>
            <button className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#EFE9DF] text-[#0F4C45] shadow-xs">
              <SlidersHorizontal className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2 overflow-x-auto px-4 py-2 scrollbar-none text-[12px]">
          <button className="flex shrink-0 items-center gap-1 rounded-full border border-black/10 bg-white px-3.5 py-1.5 font-medium text-[#4A3F35]">
            Sort By <ChevronDown className="h-3.5 w-3.5 opacity-60" />
          </button>
          <button className="flex shrink-0 items-center gap-1 rounded-full border border-black/10 bg-white px-3.5 py-1.5 font-medium text-[#4A3F35]">
            Location <ChevronDown className="h-3.5 w-3.5 opacity-60" />
          </button>
          <button className="flex shrink-0 items-center gap-1 rounded-full border border-black/10 bg-white px-3.5 py-1.5 font-medium text-[#4A3F35]">
            Price <ChevronDown className="h-3.5 w-3.5 opacity-60" />
          </button>
          <button className="flex shrink-0 items-center gap-1 rounded-full border border-black/10 bg-white px-3.5 py-1.5 font-medium text-[#4A3F35]">
            Ratings 4+ <ChevronDown className="h-3.5 w-3.5 opacity-60" />
          </button>
        </div>

        {/* Results Counter */}
        <div className="px-4 pt-3 pb-1">
          <p className="text-[12px] font-medium text-[#7A6E65]">
            {filteredVendors.length} Mehendi Artists found
          </p>
        </div>

        {/* Vendor Cards List (Matching Picture 1) */}
        <div className="px-4 space-y-4">
          {filteredVendors.map((artist) => {
            const isSaved = wishlist.has(artist.id);
            return (
              <div
                key={artist.id}
                className="group relative overflow-hidden rounded-2xl bg-white p-3 border border-black/5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col sm:flex-row gap-3 transition-shadow hover:shadow-[0_4px_18px_rgba(0,0,0,0.06)]"
              >
                {/* Image Section with Heart */}
                <div className="relative aspect-[4/3] sm:aspect-square w-full sm:w-[130px] shrink-0 overflow-hidden rounded-xl bg-gray-100">
                  <Image
                    src={artist.image}
                    alt={artist.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <button
                    onClick={(e) => toggleWishlist(e, artist.id)}
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
                  {artist.isVerified && (
                    <span className="absolute bottom-2 left-2 rounded bg-[#0F4C45] px-2 py-0.5 text-[9px] font-bold tracking-wider text-white uppercase shadow-xs flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" /> VERIFIED
                    </span>
                  )}
                </div>

                {/* Details Section */}
                <div className="flex-1 flex flex-col justify-between py-0.5">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-serif text-[17px] font-bold text-[#1A1410] leading-snug">
                        {artist.name}
                      </h3>
                      <span className="text-[#C8A96A] text-xs">❁</span>
                    </div>
                    <p className="text-[12px] text-[#7A6E65] mt-0.5">{artist.subtitle}</p>

                    <div className="mt-2 flex items-center gap-3 text-[12px]">
                      <div className="flex items-center gap-1 font-bold text-[#1A1410]">
                        <Star className="h-3.5 w-3.5 fill-[#C8A96A] text-[#C8A96A]" />
                        <span>{artist.rating}</span>
                        <span className="text-[#9A8D7D] font-normal">({artist.reviews})</span>
                      </div>
                      <div className="flex items-center gap-1 text-[#6B5E52]">
                        <MapPin className="h-3.5 w-3.5 text-[#8C827A]" />
                        <span>{artist.location}</span>
                      </div>
                    </div>

                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {artist.chips.map((chip, idx) => (
                        <span
                          key={idx}
                          className="rounded-md bg-[#FAF5EA] px-2 py-0.5 text-[10px] font-medium text-[#8F7856] border border-[#E8DFD1]"
                        >
                          {chip}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between pt-2 border-t border-black/5">
                    <div>
                      <span className="text-[11px] text-[#8C827A] block leading-none">Starts at</span>
                      <span className="text-[15px] font-bold text-[#0F4C45]">{artist.price}</span>
                    </div>

                    <Link
                      href={`/categories/mehendi/${artist.id}`}
                      className="flex items-center gap-1 rounded-xl bg-[#0F4C45] px-4 py-2 text-[12px] font-semibold text-white shadow-xs transition-transform active:scale-95 hover:bg-[#155e56]"
                    >
                      View Profile
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
