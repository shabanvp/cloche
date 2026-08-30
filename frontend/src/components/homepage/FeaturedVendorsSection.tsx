"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Star, Heart, MapPin, CheckCircle2, ShieldCheck, Clock, CalendarCheck, Eye, Scale, ArrowRight } from "lucide-react";

export interface FeaturedVendor {
  id: string;
  slug: string;
  name: string;
  category: string;
  city: string;
  rating: number;
  reviewCount: number;
  startingPrice: string;
  bookedWeddingsCount: number;
  responseTime: string;
  coverImage: string;
  portfolioPreviews: string[];
}

const SAMPLE_FEATURED_VENDORS: FeaturedVendor[] = [
  {
    id: "fv-1",
    slug: "charming-bride-boutique",
    name: "Charming Bride Luxury Studio",
    category: "Bridal Studio & Couture",
    city: "Kochi, Kerala",
    rating: 4.9,
    reviewCount: 168,
    startingPrice: "₹45,000",
    bookedWeddingsCount: 54,
    responseTime: "< 1 hr",
    coverImage: "https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=800&q=80",
    portfolioPreviews: [
      "https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=300&q=80",
      "https://images.unsplash.com/photo-1546804784-896d0dca3800?auto=format&fit=crop&w=300&q=80",
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=300&q=80",
    ],
  },
  {
    id: "fv-2",
    slug: "maritus-events",
    name: "Maritus Events & Planners",
    category: "Wedding Planner",
    city: "Ernakulam, Kerala",
    rating: 5.0,
    reviewCount: 210,
    startingPrice: "₹2,00,000",
    bookedWeddingsCount: 78,
    responseTime: "< 30 mins",
    coverImage: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=80",
    portfolioPreviews: [
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=300&q=80",
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=300&q=80",
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=300&q=80",
    ],
  },
];

export function FeaturedVendorsSection() {
  const [comparedIds, setComparedIds] = useState<Set<string>>(new Set());
  const [quickViewVendor, setQuickViewVendor] = useState<FeaturedVendor | null>(null);

  const toggleCompare = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setComparedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-semibold tracking-widest uppercase text-[#0F4C45]">
            Handpicked Excellence
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-[#0F4C45] tracking-tight mt-1">
            Featured Partner Profiles
          </h2>
        </div>
        <Link
          href="/vendors?filter=featured"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0F4C45] hover:text-[#A97B3E] transition-colors group"
        >
          <span>View All Featured</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Featured Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {SAMPLE_FEATURED_VENDORS.map((vendor) => {
          const isComparing = comparedIds.has(vendor.id);
          return (
            <div
              key={vendor.id}
              className="bg-white rounded-3xl overflow-hidden border border-[#EBE4D8] shadow-md hover:shadow-xl transition-all duration-300 grid grid-cols-1 sm:grid-cols-12"
            >
              {/* Left Column: Cover Image & Badges (5 cols) */}
              <div className="sm:col-span-5 relative min-h-[260px] bg-[#EBE4D8]">
                <img
                  src={vendor.coverImage}
                  alt={vendor.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start z-10">
                  <span className="px-3 py-1 rounded-full bg-[#C8A96A] text-[#0F4C45] text-xs font-bold shadow-sm">
                    PREMIUM
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-md text-[#0F4C45] text-[11px] font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#0F4C45]" />
                    Verified
                  </span>
                </div>

                <button
                  onClick={() => setQuickViewVendor(vendor)}
                  className="absolute bottom-3 left-3 z-10 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-medium hover:bg-black/80 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Quick Preview</span>
                </button>
              </div>

              {/* Right Column: Info & Actions (7 cols) */}
              <div className="sm:col-span-7 p-6 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-semibold uppercase text-[#A97B3E] tracking-wider">
                      {vendor.category}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-[#0F4C45]">
                      <Star className="w-3.5 h-3.5 fill-[#C8A96A] text-[#C8A96A]" />
                      {vendor.rating.toFixed(1)} ({vendor.reviewCount})
                    </span>
                  </div>

                  <h3 className="font-display text-xl font-bold text-[#0F4C45] mt-1 line-clamp-1">
                    {vendor.name}
                  </h3>

                  <p className="text-xs text-[#7A776E] flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-[#A97B3E]" />
                    {vendor.city}
                  </p>
                </div>

                {/* Key Metrics Strip */}
                <div className="grid grid-cols-2 gap-2 bg-[#FAF7F2] p-3 rounded-2xl border border-[#EBE4D8]/60 text-xs">
                  <div>
                    <span className="text-[10px] text-[#7A776E] block">Bookings</span>
                    <span className="font-semibold text-[#0F4C45] flex items-center gap-1">
                      <CalendarCheck className="w-3.5 h-3.5 text-[#A97B3E]" />
                      {vendor.bookedWeddingsCount}+ Booked
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#7A776E] block">Response</span>
                    <span className="font-semibold text-[#0F4C45] flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#A97B3E]" />
                      {vendor.responseTime}
                    </span>
                  </div>
                </div>

                {/* Portfolio Previews Strip */}
                <div>
                  <span className="text-[10px] uppercase font-semibold text-[#7A776E] tracking-wider block mb-1.5">
                    Portfolio Preview
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {vendor.portfolioPreviews.map((img, idx) => (
                      <div key={idx} className="h-14 rounded-xl overflow-hidden bg-[#EBE4D8]">
                        <img src={img} alt="Portfolio thumbnail" className="w-full h-full object-cover hover:scale-110 transition-transform" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price & Action Buttons */}
                <div className="pt-2 border-t border-[#F5EFE6] flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] text-[#7A776E] block">Starting Price</span>
                    <span className="font-bold text-[#0F4C45] text-sm">{vendor.startingPrice}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => toggleCompare(e, vendor.id)}
                      className={`p-2 rounded-full border text-xs font-medium transition-all ${isComparing ? "bg-[#0F4C45] text-white border-[#0F4C45]" : "bg-white text-[#7A776E] border-[#EBE4D8] hover:text-[#0F4C45]"}`}
                      title="Compare Vendor"
                    >
                      <Scale className="w-4 h-4" />
                    </button>

                    <Link
                      href={`/vendors/${vendor.slug || vendor.id}`}
                      className="px-5 py-2 rounded-full bg-[#0F4C45] text-white text-xs font-semibold hover:bg-[#0A3732] shadow-sm transition-all"
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick View Modal */}
      {quickViewVendor && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white max-w-lg w-full rounded-3xl p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setQuickViewVendor(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 font-bold text-lg"
            >
              ✕
            </button>
            <h3 className="font-display text-2xl font-bold text-[#0F4C45]">{quickViewVendor.name}</h3>
            <img src={quickViewVendor.coverImage} alt={quickViewVendor.name} className="w-full h-48 object-cover rounded-2xl" />
            <p className="text-sm text-[#5C5549]">{quickViewVendor.category} • {quickViewVendor.city}</p>
            <div className="flex justify-between items-center pt-2">
              <span className="font-bold text-[#0F4C45]">{quickViewVendor.startingPrice}</span>
              <Link
                href={`/vendors/${quickViewVendor.slug}`}
                className="px-6 py-2.5 rounded-full bg-[#0F4C45] text-white text-xs font-bold hover:bg-[#0A3732]"
              >
                Go to Full Profile
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
