"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import {
  ArrowLeft,
  Search,
  SlidersHorizontal,
  Star,
  CheckCircle2,
  MapPin,
  Heart,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { BottomNavBar } from "@/components/BottomNavBar";
import { Footer } from "@/components/Footer";
import { jewelleryVendors, JewelleryVendor } from "@/lib/jewelleryData";
import { getCategoryFallbackImage } from "@/lib/categories";

export function JewelleryListing() {
  const [search, setSearch] = useState("");
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const [jewelleryList, setJewelleryList] = useState<any[]>(jewelleryVendors);

  useEffect(() => {
    fetch("/api/v1/public/vendors?category=jewellery", { cache: "no-store" })
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          const fallbackImg = getCategoryFallbackImage("jewellery");
          const mapped = json.data.map((dbV: any) => ({
            id: dbV.id,
            name: dbV.name,
            subtitle: dbV.tagline || dbV.about || "Heritage Bridal Jewellery & Temple Ornaments",
            location: dbV.city || dbV.state || "Kerala, India",
            rating: dbV.rating || 4.9,
            reviews: dbV.reviewCount || 0,
            reviewsCount: dbV.reviewCount || 0,
            price: dbV.startingPrice || "₹25,000 / set",
            startingPrice: dbV.startingPrice || "₹25,000 / set",
            category: "Jewellery",
            isVerified: dbV.isVerified ?? true,
            verified: dbV.isVerified ?? true,
            heroImage: dbV.coverImage || dbV.logo || fallbackImg,
            image: dbV.coverImage || dbV.logo || fallbackImg,
            badge: "BIS Hallmarked",
          }));

          const dbIds = new Set(mapped.map((m: any) => m.id));
          const existingFiltered = jewelleryVendors.filter((j) => !dbIds.has(j.id));
          setJewelleryList([...mapped, ...existingFiltered]);
        }
      })
      .catch((err) => console.error("Error fetching live jewellery vendors:", err));
  }, []);

  const filtered = useMemo(() => {
    return jewelleryList.filter((v) => {
      return (
        v.name.toLowerCase().includes(search.toLowerCase()) ||
        (v.location && v.location.toLowerCase().includes(search.toLowerCase())) ||
        (v.subtitle && v.subtitle.toLowerCase().includes(search.toLowerCase()))
      );
    });
  }, [search, jewelleryList]);

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
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] pb-24 text-[#2D2520]">
      <main className="flex-1">
        {/* Top Header Row with Circular Back Arrow */}
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
              Bridal Jewellery
            </h1>

            <button
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EFE9DF] text-[#0F4C45] transition-transform active:scale-95 hover:bg-[#E5DDCF]"
              aria-label="Filter options"
            >
              <SlidersHorizontal className="h-4 w-4" />
            </button>
          </div>

          <p className="mt-1 text-[13px] sm:text-[14px] text-[#5A6561] text-center">
            Gold, diamonds, uncut polki &amp; heritage temple jewellery
          </p>
        </div>

        {/* Search Bar */}
        <div className="px-4 py-2">
          <div className="flex items-center gap-2.5 rounded-full bg-white px-4 py-2.5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-black/5">
            <Search className="h-4 w-4 shrink-0 text-[#8C827A]" />
            <input
              type="text"
              placeholder="Search temple jewellery, polki, diamonds, gold..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent text-[14px] outline-none placeholder:text-[#AAA29A] text-[#1A1410]"
            />
          </div>
        </div>

        {/* Quick Filter Chips */}
        <div className="flex gap-2 overflow-x-auto px-4 py-2 scrollbar-none">
          {["All Jewellery", "Temple Gold", "Diamond Sets", "Polki & Kundan", "Rental Sets"].map((chip, idx) => (
            <button
              key={chip}
              className={`shrink-0 rounded-full px-4 py-1.5 text-[12px] font-semibold transition-all ${
                idx === 0
                  ? "bg-[#0F4C45] text-white shadow-xs"
                  : "bg-white text-[#4A3F35] border border-black/10 hover:bg-black/5"
              }`}
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Results Header */}
        <div className="px-4 pt-3 pb-2 flex items-center justify-between">
          <h2 className="font-serif text-[17px] font-bold text-[#1A1410]">
            Featured Jewellery Houses
          </h2>
          <span className="text-[12px] text-[#7A6E65]">
            {filtered.length} boutiques found
          </span>
        </div>

        {/* Vendors List */}
        <div className="px-4 space-y-3.5">
          {filtered.map((v) => {
            const isSaved = wishlist.has(v.id);
            return (
              <div
                key={v.id}
                className="group relative overflow-hidden rounded-2xl bg-white p-3 border border-black/5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col sm:flex-row gap-3 transition-shadow hover:shadow-[0_4px_18px_rgba(0,0,0,0.06)]"
              >
                {/* Image */}
                <div className="relative aspect-[3/4] sm:aspect-square w-full sm:w-[130px] shrink-0 overflow-hidden rounded-xl bg-gray-100">
                  <Image
                    src={v.image || "/images/jewellery-cover.png"}
                    alt={v.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <button
                    onClick={(e) => toggleWishlist(e, v.id)}
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
                  {v.isFeatured && (
                    <span className="absolute top-2 left-2 rounded bg-[#0F4C45] px-2 py-0.5 text-[9px] font-bold tracking-wider text-white uppercase shadow-xs">
                      FEATURED
                    </span>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between py-0.5">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-serif text-[17px] font-bold text-[#1A1410] leading-snug">
                        {v.name}
                      </h3>
                      {v.isVerified && (
                        <CheckCircle2 className="h-4 w-4 shrink-0 fill-[#0F4C45] text-white" />
                      )}
                    </div>
                    <p className="text-[12px] text-[#7A6E65] mt-0.5">{v.subtitle}</p>

                    <div className="mt-1 flex items-center gap-2 text-[12px]">
                      <div className="flex items-center gap-1 font-bold text-[#1A1410]">
                        <Star className="h-3.5 w-3.5 fill-[#C8A96A] text-[#C8A96A]" />
                        <span>{v.rating}</span>
                        <span className="text-[#9A8D7D] font-normal">({v.reviews ?? v.reviewsCount ?? 0})</span>
                      </div>
                      <div className="flex items-center gap-1 text-[#6B5E52]">
                        <MapPin className="h-3.5 w-3.5 text-[#8C827A]" />
                        <span>{v.location}</span>
                      </div>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {v.isVerified && (
                        <span className="inline-flex items-center gap-1 rounded bg-[#EAF4F2] px-2 py-0.5 text-[10px] font-semibold text-[#0F4C45]">
                          <ShieldCheck className="h-3 w-3" /> Verified
                        </span>
                      )}
                      {v.isPremium && (
                        <span className="inline-flex items-center gap-1 rounded bg-[#FAF5EA] px-2 py-0.5 text-[10px] font-semibold text-[#8F7856] border border-[#E8DFD1]">
                          👑 Premium
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between pt-2 border-t border-black/5">
                    <div>
                      <span className="text-[10px] text-[#8C827A] block leading-none">Starting from</span>
                      <span className="text-[15px] font-bold text-[#0F4C45]">{v.price || v.startingPrice || "₹25,000 / set"}</span>
                    </div>

                    <Link
                      href={`/categories/jewellery/${v.id}`}
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

      <Footer />
      <BottomNavBar activeTab="vendors" />
    </div>
  );
}
