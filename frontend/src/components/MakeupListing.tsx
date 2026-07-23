"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useMemo } from "react";
import { ArrowLeft, Search, SlidersHorizontal, Heart, Star, MapPin } from "lucide-react";
import { BottomNavBar } from "@/components/BottomNavBar";
import { makeupArtists } from "@/lib/vendorLists";

const FILTERS = ["All", "Bridal Makeup", "Party Makeup", "Airbrush", "HD Makeup"] as const;
type Filter = (typeof FILTERS)[number];

export function MakeupListing() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<Filter>("All");
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    return makeupArtists.filter((artist) => {
      const matchesSearch =
        artist.name.toLowerCase().includes(search.toLowerCase()) ||
        artist.location.toLowerCase().includes(search.toLowerCase());

      const matchesFilter =
        activeFilter === "All" || artist.category.toLowerCase().includes(activeFilter.toLowerCase());

      return matchesSearch && matchesFilter;
    });
  }, [search, activeFilter]);

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
    <div className="min-h-screen flex flex-col" style={{ background: "#F5F0E8" }}>
      {/* Header */}
      <header className="sticky top-0 z-40 flex items-center justify-between px-4 py-4" style={{ background: "#F5F0E8" }}>
        <Link
          href="/"
          className="flex h-10 w-10 items-center justify-center rounded-full"
          style={{ background: "rgba(15,76,69,0.08)" }}
          aria-label="Back"
        >
          <ArrowLeft className="h-5 w-5" style={{ color: "#0F4C45" }} />
        </Link>
        <h1 className="font-display text-[20px] font-bold" style={{ color: "#0F4C45" }}>
          Makeup Artists
        </h1>
        <button className="flex h-10 w-10 items-center justify-center rounded-full" style={{ background: "rgba(15,76,69,0.08)" }}>
          <SlidersHorizontal className="h-5 w-5" style={{ color: "#0F4C45" }} />
        </button>
      </header>

      {/* Search */}
      <div className="px-4 pb-3">
        <div className="flex items-center gap-3 rounded-2xl px-4 py-3" style={{ background: "#FFFFFF", boxShadow: "0 2px 12px rgba(15,76,69,0.07)" }}>
          <Search className="h-4 w-4 shrink-0" style={{ color: "#9A8D7D" }} />
          <input
            type="text"
            placeholder="Search makeup artists..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-[15px] outline-none placeholder:text-[#B5A898]"
            style={{ color: "#2D2520" }}
          />
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex gap-2 overflow-x-auto px-4 pb-3 scrollbar-none" style={{ WebkitOverflowScrolling: "touch" }}>
        {FILTERS.map((f) => {
          const active = activeFilter === f;
          return (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className="shrink-0 rounded-full px-4 py-1.5 text-[13px] font-semibold transition-all"
              style={{
                background: active ? "#0F4C45" : "#FFFFFF",
                color: active ? "#FFFFFF" : "#4A3F35",
                border: active ? "none" : "1px solid #E2D5C0",
              }}
            >
              {f}
            </button>
          );
        })}
      </div>

      {/* List Container */}
      <div className="flex-1 mx-4 mb-28 rounded-2xl overflow-hidden bg-white shadow-[0_4px_20px_rgba(15,76,69,0.07)]">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-6">
            <p className="font-display text-[20px]" style={{ color: "#0F4C45" }}>No artists found</p>
          </div>
        ) : (
          <ul>
            {filtered.map((artist, idx) => {
              const isWishlisted = wishlist.has(artist.id);
              const isLast = idx === filtered.length - 1;
              return (
                <li key={artist.id}>
                  <Link href={`/makeup/${artist.id}`} className="flex items-center gap-4 px-4 py-4 active:bg-[#F5F0E8]/60">
                    <div className="relative shrink-0 rounded-full overflow-hidden" style={{ width: "64px", height: "64px", border: "2px solid #F0E8D8" }}>
                      <Image src={artist.image} alt={artist.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-display text-[16px] font-semibold leading-tight truncate" style={{ color: "#1A1410" }}>
                        {artist.name}
                      </p>
                      <p className="mt-0.5 text-[13px]" style={{ color: "#7A6E65" }}>
                        {artist.category}
                      </p>
                      <div className="mt-1.5 flex items-center gap-1.5">
                        <Star className="h-3.5 w-3.5 fill-current" style={{ color: "#C8A96A" }} />
                        <span className="text-[13px] font-semibold" style={{ color: "#1A1410" }}>
                          {artist.rating}
                        </span>
                        <span className="text-[12px]" style={{ color: "#9A8D7D" }}>
                          ({artist.reviews})
                        </span>
                      </div>
                    </div>
                    <button onClick={(e) => toggleWishlist(e, artist.id)} className="shrink-0 flex h-8 w-8 items-center justify-center rounded-full">
                      <Heart
                        className="h-5 w-5"
                        style={{
                          color: isWishlisted ? "#E8614A" : "#C8A96A",
                          fill: isWishlisted ? "#E8614A" : "none",
                          strokeWidth: 1.8,
                        }}
                      />
                    </button>
                  </Link>
                  {!isLast && <div className="mx-4 h-px" style={{ background: "#F0E8D8" }} />}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <BottomNavBar activeTab="vendors" />
    </div>
  );
}
