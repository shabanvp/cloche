"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Camera, ArrowRight, Sparkles, Filter } from "lucide-react";
import { HomepageVendorCard, VendorCardItem } from "@/components/HomepageVendorCard";
import { VendorCardSkeleton } from "@/components/skeletons/VendorCardSkeleton";
import { photographers as registryPhotographers } from "@/lib/vendorLists";

interface PhotographersForYouSectionProps {
  initialVendors?: VendorCardItem[];
}

const STYLE_FILTERS = [
  { label: "All Photographers", key: "all" },
  { label: "Candid & Emotion", key: "candid" },
  { label: "Cinematic Films", key: "cinematic" },
  { label: "Pre-Wedding", key: "pre-wedding" },
  { label: "Traditional", key: "traditional" },
];

export function PhotographersForYouSection({
  initialVendors = [],
}: PhotographersForYouSectionProps) {
  const [activeFilter, setActiveFilter] = useState("all");
  const [photographersList, setPhotographersList] = useState<VendorCardItem[]>(() => {
    // Check if initial vendors contain any photographers
    const directPhotos = initialVendors.filter(
      (v) =>
        (v.category || "").toLowerCase().includes("photo") ||
        (v.categorySlug || "").toLowerCase().includes("photo")
    );
    if (directPhotos.length > 0) return directPhotos;

    // Fallback to verified registry photographers while fetching
    return registryPhotographers.slice(0, 8).map((p) => ({
      id: p.id,
      slug: p.id,
      name: p.name,
      category: "Wedding Photographer",
      categorySlug: "photographers",
      city: p.location.split(",")[0] || "Kerala",
      rating: p.rating || 4.9,
      reviewCount: p.reviews || 0,
      startingPrice: "₹65,000 / day",
      coverImage: p.images?.[0] || p.image || "/images/photographers-cover.png",
    }));
  });
  const [isLoading, setIsLoading] = useState(false);

  // Fetch real live photographer data from Cloche API
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    fetch("/api/v1/public/vendors?category=photographers&limit=8", { cache: "no-store" })
      .then((res) => res.json())
      .then((json) => {
        if (!isMounted) return;

        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          const livePhotographers: VendorCardItem[] = json.data.map((dbV: any) => ({
            id: String(dbV.id),
            slug: dbV.slug || String(dbV.id),
            name: dbV.name || "Wedding Photographer",
            category: dbV.category || "Wedding Photographer",
            categorySlug: "photographers",
            city: dbV.city || dbV.state || "Kerala",
            rating: Number(dbV.rating || 4.9),
            reviewCount: Number(dbV.reviewCount || dbV.reviewsCount || 0),
            startingPrice: dbV.startingPrice || "₹65,000 / day",
            coverImage:
              dbV.coverImage ||
              dbV.logo ||
              "/images/photographers-cover.png",
          }));

          // Merge live database vendors with verified registry partners for richness
          const liveIds = new Set(livePhotographers.map((p) => String(p.id)));
          const extraRegistry = registryPhotographers
            .filter((p) => !liveIds.has(p.id))
            .map((p) => ({
              id: p.id,
              slug: p.id,
              name: p.name,
              category: "Wedding Photographer",
              categorySlug: "photographers",
              city: p.location.split(",")[0] || "Kerala",
              rating: p.rating || 4.9,
              reviewCount: p.reviews || 0,
              startingPrice: "₹65,000 / day",
              coverImage: p.images?.[0] || p.image || "/images/photographers-cover.png",
            }));

          setPhotographersList([...livePhotographers, ...extraRegistry]);
        }
      })
      .catch((err) => {
        console.error("Error fetching live photographer data:", err);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Filter photographers based on selected style tab
  const filteredPhotographers = useMemo(() => {
    if (activeFilter === "all") return photographersList.slice(0, 4);

    const term = activeFilter.toLowerCase();
    const matches = photographersList.filter((p) => {
      const cat = (p.category || "").toLowerCase();
      const name = (p.name || "").toLowerCase();
      return cat.includes(term) || name.includes(term);
    });

    // If style filter has fewer than 2 matches, show top photographers to keep grid balanced
    if (matches.length === 0) return photographersList.slice(0, 4);
    return matches.slice(0, 4);
  }, [photographersList, activeFilter]);

  return (
    <section className="py-10 md:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF7F2] border border-[#C6A568]/20 text-[#064E43] text-xs font-bold tracking-wider uppercase">
              <Camera className="w-3.5 h-3.5 text-[#C6A568]" /> Visual Storytellers
            </div>
            <h2 className="text-2xl md:text-3xl font-bold font-serif text-[#242321]">
              Photographers For You
            </h2>
            <p className="text-xs sm:text-sm text-[#242321]/65 max-w-xl">
              Award-winning candid cinematographers, traditional wedding photographers &amp; drone specialists across Kerala
            </p>
          </div>

          <Link
            href="/photographers"
            className="hidden md:inline-flex items-center gap-1.5 text-sm font-bold text-[#064E43] hover:text-[#C6A568] transition-colors"
          >
            <span>View All Photographers</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Style Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-2 mb-6">
          {STYLE_FILTERS.map((filter) => {
            const isSelected = activeFilter === filter.key;
            return (
              <button
                key={filter.key}
                type="button"
                onClick={() => setActiveFilter(filter.key)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer border ${
                  isSelected
                    ? "bg-[#064E43] text-white border-[#064E43] shadow-xs"
                    : "bg-[#FAF7F2] text-[#242321]/70 border-[#C6A568]/20 hover:border-[#064E43] hover:text-[#064E43]"
                }`}
              >
                {filter.label}
              </button>
            );
          })}
        </div>

        {/* Photographers Card Grid (4 cols on desktop, horizontal snap scroll on mobile) */}
        {isLoading && photographersList.length === 0 ? (
          <div className="flex overflow-x-auto hide-scrollbar snap-x snap-mandatory gap-4 md:grid md:grid-cols-4 md:gap-6 md:overflow-visible pb-2">
            {[1, 2, 3, 4].map((i) => (
              <VendorCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredPhotographers.length > 0 ? (
          <div className="flex overflow-x-auto hide-scrollbar snap-x snap-mandatory gap-4 md:grid md:grid-cols-4 md:gap-6 md:overflow-visible pb-2">
            {filteredPhotographers.map((photographer) => (
              <HomepageVendorCard key={photographer.id} vendor={photographer} />
            ))}
          </div>
        ) : (
          <div className="p-8 sm:p-10 rounded-2xl bg-[#FAF7F2] border border-[#C6A568]/20 text-center max-w-lg mx-auto space-y-3">
            <div className="w-12 h-12 rounded-full bg-white border border-[#C6A568]/30 flex items-center justify-center mx-auto text-[#064E43] shadow-xs">
              <Camera className="w-6 h-6 text-[#C6A568]" />
            </div>
            <div className="space-y-1">
              <h3 className="font-serif font-bold text-base text-[#242321]">
                Explore Verified Wedding Photographers
              </h3>
              <p className="text-xs text-[#242321]/60 leading-relaxed">
                Connect with Kerala&apos;s most sought-after wedding cinematographers and studio professionals.
              </p>
            </div>
            <Link
              href="/photographers"
              className="inline-block px-5 py-2.5 rounded-full bg-[#064E43] text-white text-xs font-bold hover:bg-[#085C50] transition-colors shadow-2xs"
            >
              Browse Photographer Directory
            </Link>
          </div>
        )}

        {/* Mobile View All Link */}
        <div className="mt-6 text-center md:hidden">
          <Link
            href="/photographers"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#FAF7F2] border border-[#C6A568]/20 text-[#064E43] font-bold text-xs"
          >
            <span>View All Photographers</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>
    </section>
  );
}
