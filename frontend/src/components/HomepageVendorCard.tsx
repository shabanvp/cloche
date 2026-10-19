"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Star, MapPin, Heart, ArrowRight, Flame } from "lucide-react";
import { isItemInWishlist, toggleWishlistItem } from "@/lib/wishlistStore";

export interface VendorCardItem {
  id: string;
  slug: string;
  name: string;
  category: string;
  categorySlug?: string;
  city: string;
  rating: number;
  reviewCount?: number;
  startingPrice: string;
  coverImage?: string;
  logo?: string;
}

interface HomepageVendorCardProps {
  vendor: VendorCardItem;
  rankBadge?: number;
  isTrending?: boolean;
  priority?: boolean;
}

// Category-appropriate fallback images
function getCategoryFallback(category: string): string {
  const cat = (category || "").toLowerCase();
  if (cat.includes("venue") || cat.includes("hall") || cat.includes("palace") || cat.includes("resort")) {
    return "/images/venues-cover.png";
  }
  if (cat.includes("photo") || cat.includes("camera") || cat.includes("video")) {
    return "/images/photographers-cover.png";
  }
  if (cat.includes("makeup") || cat.includes("glam") || cat.includes("beauty")) {
    return "/images/makeup-cover.png";
  }
  if (cat.includes("bridal") || cat.includes("sari") || cat.includes("lehenga")) {
    return "/images/bridal-studio-cover.png";
  }
  if (cat.includes("groom") || cat.includes("sherwani") || cat.includes("suit")) {
    return "/images/groom-wear-cover.png";
  }
  if (cat.includes("cater") || cat.includes("food") || cat.includes("sadya")) {
    return "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=800&q=80";
  }
  if (cat.includes("decor") || cat.includes("flower") || cat.includes("planner")) {
    return "/images/decor-planning-cover.png";
  }
  if (cat.includes("invite") || cat.includes("card")) {
    return "/images/invitations-cover.png";
  }
  if (cat.includes("jewel") || cat.includes("gold") || cat.includes("ornament")) {
    return "/images/jewellery-cover.png";
  }
  return "/images/wedding-studio-cover.png";
}

export function HomepageVendorCard({
  vendor,
  rankBadge,
  isTrending = false,
}: HomepageVendorCardProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [imgSrc, setImgSrc] = useState<string>(() => {
    return vendor.coverImage || vendor.logo || getCategoryFallback(vendor.category);
  });
  const [imgError, setImgError] = useState(false);

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

  const handleImageError = () => {
    if (!imgError) {
      setImgError(true);
      setImgSrc(getCategoryFallback(vendor.category));
    }
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
          <img
            src={imgSrc}
            alt={vendor.name}
            onError={handleImageError}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />

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
                {vendor.reviewCount ? (
                  <span className="text-[10px] text-[#242321]/50 font-medium">({vendor.reviewCount})</span>
                ) : null}
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
            {vendor.category}
          </span>

          {/* Vendor Name */}
          <h3 className="font-serif font-bold text-base md:text-lg text-[#242321] group-hover:text-[#064E43] transition-colors line-clamp-1">
            {vendor.name}
          </h3>

          {/* Location */}
          <p className="text-xs text-[#242321]/65 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-[#064E43] shrink-0" />
            <span className="truncate">{vendor.city || "Kerala"}</span>
          </p>
        </div>
      </div>

      {/* Footer / Pricing & Enquiry Row */}
      <div className="px-4 sm:px-5 pb-4 pt-2.5 border-t border-[#C6A568]/15 flex items-center justify-between bg-[#FDFCFB]/50">
        <div className="min-w-0">
          <span className="text-[10px] text-[#242321]/50 uppercase tracking-wider font-medium block">
            Starting from
          </span>
          <span className="text-sm font-bold text-[#064E43] truncate block">
            {vendor.startingPrice}
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
