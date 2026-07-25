"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useMemo } from "react";
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

export function CateringListing() {
  const [search, setSearch] = useState("");
  const [activeChip, setActiveChip] = useState("Catering & Food");
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    return cateringVendors.filter((v) => {
      const matchesSearch =
        v.name.toLowerCase().includes(search.toLowerCase()) ||
        v.location.toLowerCase().includes(search.toLowerCase()) ||
        v.subtitle.toLowerCase().includes(search.toLowerCase());
      return matchesSearch;
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
          <p className="mt-2 text-[13px] sm:text-[14px] text-[#5A6561] text-center leading-snug">
            Delicious cuisines for your perfect celebration
          </p>
        </div>

        {/* Hero Banner */}
        <div className="mx-4 mt-3 mb-4 relative overflow-hidden rounded-2xl h-[200px] sm:h-[240px]">
          <Image
            src="https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1200&q=80"
            alt="Catering & Food"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-center px-5">
            <h2 className="font-serif text-[26px] font-bold text-white leading-tight">
              Catering<br />&amp; Food
            </h2>
            <p className="mt-1 text-[13px] text-white/80 leading-snug">
              Delicious cuisines for your<br />perfect celebration
            </p>
            <button className="mt-3 w-fit rounded-full bg-[#C8A96A] px-5 py-2 text-[12px] font-bold text-[#0F4C45]">
              Explore Services
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto px-4 py-2 scrollbar-none text-[12px]">
          {["Catering & Food", "Decor & Planning", "Photography", "Entertainment", "Invitations"].map(
            (chip) => (
              <button
                key={chip}
                onClick={() => setActiveChip(chip)}
                className={`shrink-0 rounded-full px-4 py-1.5 font-medium transition-all ${
                  activeChip === chip
                    ? "bg-[#0F4C45] text-white font-bold"
                    : "bg-white text-[#4A3F35] border border-black/10 hover:bg-black/5"
                }`}
              >
                {chip}
              </button>
            )
          )}
        </div>

        {/* Search Bar */}
        <div className="px-4 py-2">
          <div className="flex items-center gap-2.5 rounded-full bg-white px-4 py-2.5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-black/5">
            <Search className="h-4 w-4 shrink-0 text-[#8C827A]" />
            <input
              type="text"
              placeholder="Search catering services..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent text-[13px] sm:text-[14px] outline-none placeholder:text-[#AAA29A] text-[#1A1410]"
            />
          </div>
        </div>

        {/* Top Catering Services Banner */}
        <div className="px-4 pt-3 pb-1 flex items-center justify-between">
          <h2 className="font-serif text-[18px] font-bold text-[#1A1410]">Top Catering Services</h2>
          <button className="text-[12px] font-bold text-[#0F4C45]">View All</button>
        </div>
        <div className="mx-4 mb-4 relative overflow-hidden rounded-2xl bg-[#0F4C45] h-[160px]">
          <Image
            src="https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=1200&q=80"
            alt="Exceptional Catering Services"
            fill
            className="object-cover opacity-40"
          />
          <div className="absolute inset-0 flex flex-col justify-center px-5">
            <p className="text-[11px] text-[#C8A96A] font-semibold uppercase tracking-wider">
              Flavors that Delight
            </p>
            <h3 className="mt-1 font-serif text-[22px] font-bold text-white leading-tight">
              Exceptional<br />Catering<br />Services
            </h3>
            <p className="mt-1 text-[12px] text-white/70">From traditional feasts to modern delicacies.</p>
            <button className="mt-3 w-fit rounded-full bg-[#C8A96A] px-5 py-2 text-[12px] font-bold text-[#0F4C45]">
              Book Now
            </button>
          </div>
        </div>

        {/* Popular Catering Services List */}
        <div className="px-4 pt-2 pb-1 flex items-center justify-between">
          <div>
            <h2 className="font-serif text-[18px] font-bold text-[#1A1410]">
              Popular Catering Services
            </h2>
          </div>
        </div>

        <div className="px-4 space-y-4 mt-2">
          {filtered.map((vendor) => {
            const isSaved = wishlist.has(vendor.id);
            return (
              <div
                key={vendor.id}
                className="group relative overflow-hidden rounded-2xl bg-white p-3 border border-black/5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col sm:flex-row gap-3 transition-shadow hover:shadow-[0_4px_18px_rgba(0,0,0,0.06)]"
              >
                {/* Image */}
                <div className="relative aspect-[3/4] sm:aspect-square w-full sm:w-[130px] shrink-0 overflow-hidden rounded-xl bg-gray-100">
                  <Image
                    src={vendor.image}
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
                      <span>{vendor.prices[1]?.price}</span>
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
