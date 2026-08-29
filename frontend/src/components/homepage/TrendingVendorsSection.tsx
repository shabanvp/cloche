"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Star, Heart, MapPin, CheckCircle2, Flame, Clock, ArrowRight, ShieldCheck } from "lucide-react";

export interface TrendingVendor {
  id: string;
  slug: string;
  name: string;
  category: string;
  city: string;
  rating: number;
  reviewCount: number;
  startingPrice: string;
  coverImage: string;
  responseTime: string;
  tagline: string;
  isVerified?: boolean;
  isTrending?: boolean;
  adminBadge?: "Trending" | "Featured" | "Editor's Choice" | "Premium";
}

const SAMPLE_TRENDING_VENDORS: TrendingVendor[] = [
  {
    id: "v-1",
    slug: "wedlock-stories",
    name: "Wedlock Cinema & Stories",
    category: "Photographers",
    city: "Kochi, Kerala",
    rating: 4.9,
    reviewCount: 142,
    startingPrice: "₹85,000 / day",
    coverImage: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80",
    responseTime: "< 1 hr response",
    tagline: "Award-winning luxury wedding cinematography & candid frames",
    isVerified: true,
    isTrending: true,
    adminBadge: "Editor's Choice",
  },
  {
    id: "v-2",
    slug: "royal-palace-kochi",
    name: "Grand Hyatt Resort & Lawns",
    category: "Venues",
    city: "Bolgatty, Kochi",
    rating: 4.8,
    reviewCount: 98,
    startingPrice: "₹2,500 / plate",
    coverImage: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80",
    responseTime: "< 2 hr response",
    tagline: "Waterfront luxury island venue with 1500+ guest capacity",
    isVerified: true,
    isTrending: true,
    adminBadge: "Trending",
  },
  {
    id: "v-3",
    slug: "glam-by-ananya",
    name: "Ananya Bridal Artistry",
    category: "Makeup Artist",
    city: "Trivandrum, Kerala",
    rating: 5.0,
    reviewCount: 86,
    startingPrice: "₹22,000 / event",
    coverImage: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80",
    responseTime: "< 30 mins response",
    tagline: "HD Airbrush & Traditional Keralite Royal Bridal Looks",
    isVerified: true,
    isTrending: true,
    adminBadge: "Premium",
  },
  {
    id: "v-4",
    slug: "flora-wedding-crafts",
    name: "Flora Wedding & Stage Crafts",
    category: "Decor & Planning",
    city: "Calicut, Kerala",
    rating: 4.9,
    reviewCount: 114,
    startingPrice: "₹1,50,000 / event",
    coverImage: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=80",
    responseTime: "< 1 hr response",
    tagline: "Custom floral mandaps, fairy light domes & concept styling",
    isVerified: true,
    isTrending: true,
    adminBadge: "Featured",
  },
];

interface Props {
  initialVendors?: TrendingVendor[];
}

export function TrendingVendorsSection({ initialVendors }: Props) {
  const vendors = initialVendors && initialVendors.length > 0 ? initialVendors : SAMPLE_TRENDING_VENDORS;
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  const toggleSave = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <section className="py-12 bg-[#FAF7F2] border-y border-[#EBE4D8]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Title Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-[#FFF5E6] text-[#A97B3E]">
                <Flame className="w-4 h-4 fill-[#A97B3E]" />
              </span>
              <span className="text-xs font-semibold tracking-widest uppercase text-[#A97B3E]">
                Most Sought After
              </span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-[#0F4C45] tracking-tight mt-1">
              Trending Vendors This Week
            </h2>
          </div>

          <Link
            href="/vendors"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0F4C45] hover:text-[#A97B3E] transition-colors group"
          >
            <span>Explore All Trending</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Vendors Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {vendors.map((vendor) => {
            const isSaved = savedIds.has(vendor.id);
            return (
              <div
                key={vendor.id}
                className="group relative bg-white rounded-3xl overflow-hidden border border-[#EBE4D8] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                {/* Image & Top Badges Container */}
                <div className="relative h-60 w-full overflow-hidden bg-[#EBE4D8]">
                  <img
                    src={vendor.coverImage}
                    alt={vendor.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex justify-between items-center z-10">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {vendor.adminBadge && (
                        <span className="px-2.5 py-0.5 rounded-full bg-[#0F4C45] text-white text-[11px] font-semibold tracking-wide shadow-sm">
                          {vendor.adminBadge}
                        </span>
                      )}
                      {vendor.isTrending && (
                        <span className="px-2.5 py-0.5 rounded-full bg-[#FFF5E6] text-[#A97B3E] border border-[#A97B3E]/30 text-[11px] font-semibold flex items-center gap-1">
                          <Flame className="w-3 h-3 fill-[#A97B3E]" />
                          Trending
                        </span>
                      )}
                    </div>

                    {/* Heart Save Button */}
                    <button
                      onClick={(e) => toggleSave(e, vendor.id)}
                      aria-label="Save Vendor"
                      className="w-9 h-9 rounded-full bg-white/80 backdrop-blur-md text-[#0F4C45] flex items-center justify-center hover:bg-white hover:scale-110 transition-all shadow-sm"
                    >
                      <Heart className={`w-4 h-4 transition-colors ${isSaved ? "fill-[#8C3A48] text-[#8C3A48]" : "text-[#0F4C45]"}`} />
                    </button>
                  </div>

                  {/* Bottom Image Info overlay: Rating */}
                  <div className="absolute bottom-3 left-3 z-10 flex items-center gap-2 text-white">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-black/50 backdrop-blur-md text-xs font-semibold">
                      <Star className="w-3.5 h-3.5 fill-[#C8A96A] text-[#C8A96A]" />
                      {vendor.rating.toFixed(1)} ({vendor.reviewCount})
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-[#7A776E] mb-1">
                      <span className="font-medium text-[#0F4C45]">{vendor.category}</span>
                      <span>•</span>
                      <span className="flex items-center gap-0.5">
                        <MapPin className="w-3 h-3 text-[#A97B3E]" />
                        {vendor.city}
                      </span>
                    </div>

                    <h3 className="font-display text-lg font-bold text-[#0F4C45] leading-snug group-hover:text-[#A97B3E] transition-colors line-clamp-1">
                      {vendor.name}
                    </h3>

                    <p className="text-xs text-[#5C5549] mt-1 font-light line-clamp-2 leading-relaxed">
                      {vendor.tagline}
                    </p>
                  </div>

                  {/* Response Time & Price Row */}
                  <div className="pt-3 border-t border-[#F5EFE6] space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1 text-[#7A776E]">
                        <Clock className="w-3.5 h-3.5 text-[#A97B3E]" />
                        {vendor.responseTime}
                      </span>
                      {vendor.isVerified && (
                        <span className="flex items-center gap-1 text-[#0F4C45] font-medium text-[11px]">
                          <ShieldCheck className="w-3.5 h-3.5 text-[#0F4C45]" />
                          Verified
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <div>
                        <span className="text-[10px] uppercase text-[#7A776E] tracking-wider block">Starts From</span>
                        <span className="font-bold text-[#0F4C45] text-sm">{vendor.startingPrice}</span>
                      </div>

                      <Link
                        href={`/vendors/${vendor.slug || vendor.id}`}
                        className="inline-flex items-center gap-1 px-4 py-2 rounded-full bg-[#FAF7F2] text-[#0F4C45] border border-[#D7C2A0]/60 text-xs font-semibold hover:bg-[#0F4C45] hover:text-white transition-all"
                      >
                        <span>View Profile</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
