"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Star, MapPin, Heart, ArrowRight, Flame } from "lucide-react";
import { isItemInWishlist, toggleWishlistItem } from "@/lib/wishlistStore";
import { VendorCardImage } from "@/components/VendorCardImage";
import { formatCategory, formatLocation, formatPrice, formatReviews } from "@/lib/format";

export interface VendorCardItem {
  id: string;
  slug: string;
  name: string;
  category: string;
  categorySlug?: string;
  city: string;
  rating: number;
  reviewCount?: number;
  createdAt?: string;
  startingPrice: string;
  coverImage?: string;
  profileImage?: string;
  logo?: string;
  distanceKm?: number;
  distanceText?: string;
}

interface HomepageVendorCardProps {
  vendor: VendorCardItem;
  rankBadge?: number;
  isTrending?: boolean;
  priority?: boolean;
  distanceKm?: number;
}

export function HomepageVendorCard({
  vendor,
  rankBadge,
  isTrending = false,
  distanceKm,
}: HomepageVendorCardProps) {
  const effectiveDistance = typeof distanceKm === "number" ? distanceKm : vendor.distanceKm;
  const [isSaved, setIsSaved] = useState(false);
  const imgSrc = vendor.coverImage || vendor.profileImage || vendor.logo || "";

  // Sync wishlist status
  useEffect(() => {
    const updateSaved = () => {
      if (vendor.id) {
        setIsSaved(isItemInWishlist(vendor.id));
      }
    };
    updateSaved();
    window.addEventListener("cloche_wishlist_updated", updateSaved);
    return () => window.removeEventListener("cloche_wishlist_updated", updateSaved);
  }, [vendor.id]);

  // Wishlist toggle handler with isolated event
  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    toggleWishlistItem({
      id: vendor.id,
      name: vendor.name,
      category: vendor.category,
      price: vendor.startingPrice,
      image: imgSrc,
      city: vendor.city,
      rating: vendor.rating,
      href: `/boutiques/${vendor.slug || vendor.id}`,
    });
  };

  const hasRating = vendor.rating > 0 && (vendor.reviewCount ?? 0) > 0;

  return (
    <Link
      href={`/boutiques/${vendor.slug || vendor.id}`}
      className="flex-shrink-0 w-[280px] sm:w-[300px] md:w-auto snap-start bg-white rounded-2xl overflow-hidden border border-[#C6A568]/15 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between"
    >
      <div>
        {/* Standardized Aspect Ratio Container (4:3) with subtle zoom on hover */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F8F5EF]">
          <VendorCardImage vendorId={vendor.id} businessName={vendor.name} coverImage={vendor.coverImage} profileImage={vendor.profileImage || vendor.logo} className="group-hover:scale-105 transition-transform duration-500 ease-out" priority={false} />

          {/* Top Left: Rank Badge or Trending Badge */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
            {typeof rankBadge === "number" && (
              <span className="bg-[#064E43] text-white text-xs font-black px-3 py-1 rounded-full shadow-md border border-white/20">
                #{rankBadge}
              </span>
            )}
            {isTrending && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-900 bg-amber-50/95 backdrop-blur-xs px-2.5 py-0.5 rounded-full border border-amber-300 shadow-2xs">
                <Flame className="w-3 h-3 text-amber-500 fill-amber-500" /> Trending
              </span>
            )}
          </div>

          {/* Top Right: Wishlist Heart Button (Isolated from card link navigation) */}
          <button
            type="button"
            onClick={handleWishlistClick}
            aria-label={isSaved ? "Remove from wishlist" : "Add to wishlist"}
            className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 shadow-md backdrop-blur-md cursor-pointer z-10 active:scale-90 ${
              isSaved
                ? "bg-[#064E43] text-[#C6A568]"
                : "bg-white/90 text-[#242321]/70 hover:bg-white hover:text-red-500 hover:scale-105"
            }`}
          >
            <Heart className={`w-4 h-4 transition-transform ${isSaved ? "fill-[#C6A568] text-[#C6A568]" : ""}`} />
          </button>

          {/* Bottom Overlay Pill: Rating Badge */}
          <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm border border-black/5 z-10">
            {hasRating ? (
              <>
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span className="text-xs font-bold text-[#242321]">{vendor.rating.toFixed(1)}</span>
                <span className="text-[10px] text-[#242321]/50 font-medium">({formatReviews(vendor.reviewCount)})</span>
              </>
            ) : (
              <span className="text-[11px] font-bold text-[#064E43] px-1">Verified</span>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 space-y-2">
          {/* Category Tag */}
          <span className="text-[11px] font-bold text-[#C6A568] uppercase tracking-wider block truncate">
            {formatCategory(vendor.category)}
          </span>

          {/* Vendor Name */}
          <h3 className="font-serif font-bold text-base md:text-lg text-[#242321] group-hover:text-[#064E43] transition-colors line-clamp-1">
            {vendor.name}
          </h3>

          {/* Location & Kilometre Distance */}
          <div className="flex items-center justify-between gap-1 text-xs text-[#242321]/65">
            <p className="flex items-center gap-1 min-w-0 truncate">
              <MapPin className="w-3.5 h-3.5 text-[#064E43] shrink-0" />
              <span className="truncate">{formatLocation(vendor.city)}</span>
            </p>
            {typeof effectiveDistance === "number" && (
              <span className="text-[11px] font-bold text-[#064E43] bg-[#064E43]/7 border border-[#C6A568]/25 px-2 py-0.5 rounded-full shrink-0 shadow-2xs">
                {effectiveDistance < 1 ? "< 1 km away" : `${effectiveDistance} km away`}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Footer / Pricing & Enquiry Row */}
      <div className="px-4 sm:px-5 pb-4 pt-2.5 border-t border-[#C6A568]/15 flex items-center justify-between bg-[#FDFCFB]/50">
        <div className="min-w-0">
          <span className="text-[10px] text-[#242321]/50 uppercase tracking-wider font-medium block">
            Pricing
          </span>
          <span className="text-sm font-bold text-[#064E43] truncate block">
            {formatPrice(vendor.startingPrice)}
          </span>
        </div>

        <span className="text-xs font-bold text-[#064E43] group-hover:text-[#C6A568] flex items-center gap-1 transition-colors shrink-0 pl-2">
          <span>View</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </span>
      </div>
    </Link>
  );
}
