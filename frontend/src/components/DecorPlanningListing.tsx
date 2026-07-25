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
  Bell,
  Menu,
} from "lucide-react";
import { BottomNavBar } from "@/components/BottomNavBar";
import { decorVendors, DecorVendor } from "@/lib/decorData";

export function DecorPlanningListing() {
  const [search, setSearch] = useState("");
  const [cityFilter, setCityFilter] = useState("All");

  const filteredVendors = useMemo(() => {
    return decorVendors.filter((vendor) => {
      const matchesSearch =
        vendor.name.toLowerCase().includes(search.toLowerCase()) ||
        vendor.subtitle.toLowerCase().includes(search.toLowerCase()) ||
        vendor.location.toLowerCase().includes(search.toLowerCase());
      const matchesCity = cityFilter === "All" || vendor.location.toLowerCase().includes(cityFilter.toLowerCase());
      return matchesSearch && matchesCity;
    });
  }, [search, cityFilter]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] pb-24 text-[#2D2520]">
      <main className="flex-1">
        {/* Breadcrumb & Hero Header */}
        <div className="px-4 pt-4 pb-2">
          <nav className="flex items-center gap-1.5 text-xs text-[#7A6E65]">
            <Link href="/" className="hover:underline">Home</Link>
            <span>/</span>
            <span className="text-[#0F4C45] font-medium">Decor & Planning</span>
          </nav>

          <h1 className="mt-3 font-serif text-[28px] sm:text-[34px] font-bold text-[#0F4C45] leading-tight">
            Decor &amp; Planning
          </h1>
          <p className="mt-1 text-[13px] sm:text-[14px] text-[#5A6561] leading-snug">
            Curated decor &amp; planning experts to bring your dream wedding to life.
          </p>
        </div>

        {/* Search Bar */}
        <div className="px-4 py-2.5">
          <div className="flex items-center gap-2.5 rounded-full bg-white px-4 py-2.5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-black/5">
            <Search className="h-4 w-4 shrink-0 text-[#8C827A]" />
            <input
              type="text"
              placeholder="Search vendors, styles, services..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent text-[14px] outline-none placeholder:text-[#AAA29A] text-[#1A1410]"
            />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2 overflow-x-auto px-4 py-2 scrollbar-none">
          <button className="flex shrink-0 items-center gap-1.5 rounded-full bg-[#0F4C45] px-3.5 py-1.5 text-[12px] font-semibold text-white shadow-xs">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            All Filters
          </button>
          <button className="flex shrink-0 items-center gap-1 rounded-full border border-black/10 bg-white px-3.5 py-1.5 text-[12px] font-medium text-[#4A3F35] hover:bg-black/5">
            City <ChevronDown className="h-3.5 w-3.5 opacity-60" />
          </button>
          <button className="flex shrink-0 items-center gap-1 rounded-full border border-black/10 bg-white px-3.5 py-1.5 text-[12px] font-medium text-[#4A3F35] hover:bg-black/5">
            Budget <ChevronDown className="h-3.5 w-3.5 opacity-60" />
          </button>
          <button className="flex shrink-0 items-center gap-1 rounded-full border border-black/10 bg-white px-3.5 py-1.5 text-[12px] font-medium text-[#4A3F35] hover:bg-black/5">
            Rating <ChevronDown className="h-3.5 w-3.5 opacity-60" />
          </button>
        </div>

        {/* Section Title & Results Count */}
        <div className="px-4 pt-4 pb-2">
          <h2 className="font-serif text-[18px] font-bold text-[#1A1410]">
            Top Decor &amp; Planning Vendors
          </h2>
          <p className="text-[12px] text-[#7A6E65] mt-0.5">
            {filteredVendors.length} results
          </p>
        </div>

        {/* Vendor List */}
        <div className="px-4 space-y-4">
          {filteredVendors.map((vendor) => (
            <div
              key={vendor.id}
              className="group overflow-hidden rounded-2xl bg-white p-3 border border-black/5 shadow-[0_2px_10px_rgba(0,0,0,0.03)] flex flex-col sm:flex-row gap-3 transition-shadow hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)]"
            >
              {/* Vendor Image */}
              <div className="relative aspect-[4/3] sm:aspect-square w-full sm:w-[130px] shrink-0 overflow-hidden rounded-xl bg-gray-100">
                <Image
                  src={vendor.image}
                  alt={vendor.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {vendor.isFeatured && (
                  <span className="absolute top-2 left-2 rounded bg-[#D4B66E] px-2 py-0.5 text-[10px] font-bold tracking-wider text-[#0F4C45] uppercase shadow-xs">
                    FEATURED
                  </span>
                )}
                {vendor.isVerified && !vendor.isFeatured && (
                  <span className="absolute top-2 left-2 rounded bg-[#0F4C45] px-2 py-0.5 text-[10px] font-bold tracking-wider text-white uppercase shadow-xs">
                    VERIFIED
                  </span>
                )}
              </div>

              {/* Vendor Details */}
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
                  <p className="text-[12px] text-[#7A6E65] mt-0.5">{vendor.subtitle}</p>

                  <div className="mt-2 flex items-center gap-2 text-[12px]">
                    <div className="flex items-center gap-1 font-bold text-[#1A1410]">
                      <span>{vendor.rating}</span>
                      <Star className="h-3.5 w-3.5 fill-[#C8A96A] text-[#C8A96A]" />
                    </div>
                    <span className="text-[#9A8D7D]">({vendor.reviews} reviews)</span>
                  </div>

                  <div className="mt-1 flex items-center gap-1 text-[12px] text-[#6B5E52]">
                    <MapPin className="h-3.5 w-3.5 text-[#8C827A]" />
                    <span>{vendor.location}</span>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between pt-2 border-t border-black/5">
                  <div>
                    <span className="text-[11px] text-[#8C827A] block leading-none">Starts at</span>
                    <span className="text-[15px] font-bold text-[#0F4C45]">{vendor.price}</span>
                  </div>

                  <Link
                    href={`/categories/decor-planning/${vendor.id}`}
                    className="flex items-center gap-1 rounded-lg bg-[#0F4C45] px-3.5 py-1.5 text-[12px] font-semibold text-white shadow-xs transition-transform active:scale-95 hover:bg-[#155e56]"
                  >
                    View Profile <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Promo CTA Banner (Matching Picture 2 bottom banner) */}
        <div className="mx-4 mt-6 mb-4 rounded-2xl bg-[#F4EFE6] border border-[#E8DFD1] p-4 flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-[#0F4C45] shadow-xs border border-black/5">
            <span className="material-symbols-outlined text-[24px]">church</span>
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-serif text-[15px] font-bold text-[#0F4C45]">
              Planning your dream wedding?
            </h4>
            <p className="text-[12px] text-[#5A6561] mt-0.5 leading-tight">
              Connect with top decor &amp; planning experts who bring your vision to life.
            </p>
            <button className="mt-2.5 flex items-center gap-1 rounded-lg bg-[#0F4C45] px-3.5 py-1.5 text-[12px] font-semibold text-white shadow-xs transition-transform active:scale-95">
              Get Free Quotes <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </main>

      <BottomNavBar activeTab="vendors" />
    </div>
  );
}
