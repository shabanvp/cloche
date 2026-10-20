"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { MapPin, Sparkles, ArrowRight } from "lucide-react";
import { HomepageVendorCard, VendorCardItem } from "@/components/HomepageVendorCard";
import { VendorCardSkeleton } from "@/components/skeletons/VendorCardSkeleton";

interface PopularNearYouSectionProps {
  vendors: VendorCardItem[];
  loading?: boolean;
}

const KERALA_CITIES = [
  "All Kerala",
  "Kochi",
  "Thrissur",
  "Calicut",
  "Trivandrum",
  "Kottayam",
];

export function PopularNearYouSection({
  vendors,
  loading = false,
}: PopularNearYouSectionProps) {
  const [selectedCity, setSelectedCity] = useState("All Kerala");

  // Filter vendors based on selected city
  const filteredVendors = useMemo(() => {
    if (!Array.isArray(vendors) || vendors.length === 0) return [];
    if (selectedCity === "All Kerala") {
      return vendors.slice(0, 4);
    }
    const target = selectedCity.toLowerCase();
    const matches = vendors.filter((v) => (v.city || "").toLowerCase().includes(target));
    return matches.slice(0, 4);
  }, [vendors, selectedCity]);

  return (
    <section className="py-10 md:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF7F2] border border-[#C6A568]/20 text-[#064E43] text-xs font-bold tracking-wider uppercase">
              <MapPin className="w-3.5 h-3.5 text-[#C6A568]" /> Local Wedding Discovery
            </div>
            <h2 className="text-2xl md:text-3xl font-bold font-serif text-[#242321]">
              Popular Near You
            </h2>
            <p className="text-xs sm:text-sm text-[#242321]/65 max-w-xl">
              Handpicked venues, studios, and wedding artisans curated by destination across Kerala
            </p>
          </div>

          <Link
            href={selectedCity === "All Kerala" ? "/boutiques" : `/boutiques?search=${encodeURIComponent(selectedCity)}`}
            className="hidden md:inline-flex items-center gap-1 text-sm font-bold text-[#064E43] hover:text-[#C6A568] transition-colors"
          >
            <span>Explore all in {selectedCity}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* City Filter Tabs (Horizontally scrollable with clean pills) */}
        <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-2 mb-6">
          {KERALA_CITIES.map((city) => {
            const isSelected = selectedCity === city;
            return (
              <button
                key={city}
                type="button"
                onClick={() => setSelectedCity(city)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer border ${
                  isSelected
                    ? "bg-[#064E43] text-white border-[#064E43] shadow-xs"
                    : "bg-[#FAF7F2] text-[#242321]/70 border-[#C6A568]/20 hover:border-[#064E43] hover:text-[#064E43]"
                }`}
              >
                {city}
              </button>
            );
          })}
        </div>

        {/* Vendor Content */}
        {loading ? (
          <div className="flex overflow-x-auto hide-scrollbar snap-x snap-mandatory gap-4 md:grid md:grid-cols-4 md:gap-6 md:overflow-visible pb-2">
            {[1, 2, 3, 4].map((i) => (
              <VendorCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredVendors.length > 0 ? (
          <div className="flex overflow-x-auto hide-scrollbar snap-x snap-mandatory gap-4 md:grid md:grid-cols-4 md:gap-6 md:overflow-visible pb-2">
            {filteredVendors.map((vendor) => (
              <HomepageVendorCard key={vendor.id} vendor={vendor} />
            ))}
          </div>
        ) : (
          /* Graceful, helpful empty state when selected city has no vendors */
          <div className="p-8 sm:p-10 rounded-2xl bg-[#FAF7F2] border border-[#C6A568]/20 text-center max-w-lg mx-auto space-y-3">
            <div className="w-12 h-12 rounded-full bg-white border border-[#C6A568]/30 flex items-center justify-center mx-auto text-[#064E43] shadow-xs">
              <Sparkles className="w-6 h-6 text-[#C6A568]" />
            </div>
            <div className="space-y-1">
              <h3 className="font-serif font-bold text-base text-[#242321]">
                No registered vendors found in {selectedCity} yet
              </h3>
              <p className="text-xs text-[#242321]/60 leading-relaxed">
                We are actively onboarding verified boutique partners in this region. You can discover top wedding professionals serving all across Kerala.
              </p>
            </div>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setSelectedCity("All Kerala")}
                className="px-4 py-2 rounded-full bg-[#064E43] text-white text-xs font-bold hover:bg-[#085C50] transition-colors shadow-2xs cursor-pointer"
              >
                Show All Kerala Vendors
              </button>
              <Link
                href="/boutiques"
                className="px-4 py-2 rounded-full bg-white border border-[#C6A568]/30 text-[#064E43] text-xs font-bold hover:bg-[#FAF7F2] transition-colors"
              >
                Browse Full Directory
              </Link>
            </div>
          </div>
        )}

        {/* Mobile View All Footer Link */}
        <div className="mt-6 text-center md:hidden">
          <Link
            href={selectedCity === "All Kerala" ? "/boutiques" : `/boutiques?search=${encodeURIComponent(selectedCity)}`}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#FAF7F2] border border-[#C6A568]/20 text-[#064E43] font-bold text-xs"
          >
            <span>View All in {selectedCity}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>
    </section>
  );
}
