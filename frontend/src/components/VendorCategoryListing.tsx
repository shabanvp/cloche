"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  SlidersHorizontal,
  Heart,
  Star,
  MapPin,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Filter,
  Layers,
} from "lucide-react";
import { Footer } from "@/components/Footer";
import {
  CategoryConfig,
  VendorCategoryItem,
  VENDOR_CATEGORIES_DATA,
} from "@/lib/vendor-categories";

interface VendorCategoryListingProps {
  categorySlug?: string;
  initialCategoryConfig?: CategoryConfig;
}

export function VendorCategoryListing({
  categorySlug = "venues",
  initialCategoryConfig,
}: VendorCategoryListingProps) {
  // Resolve config based on categorySlug or fallback to venues
  const categoryConfig: CategoryConfig = useMemo(() => {
    if (initialCategoryConfig) return initialCategoryConfig;
    const slug = (categorySlug || "").toLowerCase().trim();
    if (VENDOR_CATEGORIES_DATA[slug]) {
      return VENDOR_CATEGORIES_DATA[slug];
    }
    // Fallback search in dictionary
    const foundKey = Object.keys(VENDOR_CATEGORIES_DATA).find(
      (k) => k.includes(slug) || slug.includes(k)
    );
    return foundKey ? VENDOR_CATEGORIES_DATA[foundKey] : VENDOR_CATEGORIES_DATA.venues;
  }, [categorySlug, initialCategoryConfig]);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeSubFilter, setActiveSubFilter] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [selectedSort, setSelectedSort] = useState("Popularity");
  const [wishlist, setWishlist] = useState<Set<string>>(() => {
    if (typeof window !== "undefined") {
      const { getWishlistItems } = require("@/lib/wishlistStore");
      return new Set(getWishlistItems().map((i: any) => String(i.id)));
    }
    return new Set();
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Dynamic category-filtered vendors
  const [allVendors, setAllVendors] = useState<VendorCategoryItem[]>([]);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    const updateWishlistSet = () => {
      const { getWishlistItems } = require("@/lib/wishlistStore");
      setWishlist(new Set(getWishlistItems().map((i: any) => String(i.id))));
    };

    if (typeof window !== "undefined") {
      updateWishlistSet();
      window.addEventListener("cloche_wishlist_updated", updateWishlistSet);

      const targetSlug = (categorySlug || "").toLowerCase().trim();

      fetch(`/api/v1/public/vendors?category=${encodeURIComponent(targetSlug)}&t=${Date.now()}`)
        .then((r) => r.json())
        .then((res) => {
          if (!isMounted) return;

          let apiVendors: VendorCategoryItem[] = [];
          if (res.success && Array.isArray(res.data)) {
            apiVendors = res.data.map((item: any, idx: number) => {
              const locCity = (item.city || "").trim();
              const locState = (item.state || "").trim();
              const formattedLoc =
                locCity && locState && locCity.toLowerCase() !== locState.toLowerCase()
                  ? `${locCity}, ${locState}`
                  : locCity || locState || "Kerala";

              return {
                id: item.id || item.slug || `api-${idx}`,
                name: item.name || "Wedding Partner",
                slug: item.slug || item.id || `partner-${idx}`,
                image:
                  item.coverImage ||
                  item.cover_image ||
                  item.cover_url ||
                  item.logoUrl ||
                  item.logo ||
                  item.logo_url ||
                  item.profile_logo ||
                  item.image_url ||
                  item.image ||
                  "",
                rating: Number(item.rating ?? 0),
                reviewsCount: Number(item.reviewCount ?? item.reviewsCount ?? 0),
                location: formattedLoc,
                startingPrice: item.startingPrice || "Contact for pricing",
                badge: item.badge || "Verified",
                verified: Boolean(item.isVerified),
                specialtyTag: item.category || categoryConfig.title,
                subCategory: "all",
              };
            });
          }
          // Only use real database vendors from API
          setAllVendors(apiVendors);
          setIsLoading(false);
        })
        .catch(() => {
          if (!isMounted) return;
          setAllVendors([]);
          setIsLoading(false);
        });
    }

    return () => {
      isMounted = false;
      window.removeEventListener("cloche_wishlist_updated", updateWishlistSet);
    };
  }, [categorySlug, categoryConfig]);

  // Reset filter sub-category when slug changes
  useEffect(() => {
    setActiveSubFilter("all");
    setCurrentPage(1);
  }, [categorySlug]);

  const toggleWishlist = (vendor: VendorCategoryItem, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const { toggleWishlistItem } = require("@/lib/wishlistStore");
    toggleWishlistItem({
      id: vendor.id,
      name: vendor.name,
      category: vendor.specialtyTag || categoryConfig.title,
      price: vendor.startingPrice,
      image: vendor.image,
      location: vendor.location,
      city: vendor.location ? vendor.location.split(",")[0] : "Kerala",
      rating: vendor.rating,
    });
  };

  // Filtering Logic
  const filteredVendors = useMemo(() => {
    return allVendors.filter((vendor) => {
      // Sub-category pill check
      if (activeSubFilter !== "all") {
        const sub = (vendor.subCategory || "").toLowerCase();
        const tag = (vendor.specialtyTag || "").toLowerCase();
        const badge = (vendor.badge || "").toLowerCase();
        if (
          !sub.includes(activeSubFilter) &&
          !tag.includes(activeSubFilter) &&
          !badge.includes(activeSubFilter)
        ) {
          return false;
        }
      }

      // Location check
      if (
        selectedLocation !== "All Locations" &&
        !vendor.location.toLowerCase().includes(selectedLocation.toLowerCase().split(",")[0])
      ) {
        return false;
      }

      // Search Query check
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchName = vendor.name.toLowerCase().includes(query);
        const matchLoc = vendor.location.toLowerCase().includes(query);
        const matchTag = (vendor.specialtyTag || "").toLowerCase().includes(query);
        if (!matchName && !matchLoc && !matchTag) return false;
      }

      return true;
    });
  }, [allVendors, activeSubFilter, selectedLocation, searchQuery]);

  return (
    <div className="min-h-screen bg-[#FBF8F1] font-sans text-charcoal flex flex-col justify-between">
      <main className="flex-grow pt-3 pb-6 sm:pt-4 sm:pb-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        {/* Category Title & Tagline - Centered & Tight Padding */}
        <div className="mb-4 text-center space-y-1">
          <h1 className="text-2xl sm:text-4xl font-display font-bold text-charcoal tracking-tight text-center">
            {categoryConfig.title}
          </h1>
          <p className="text-xs sm:text-sm text-charcoal/70 max-w-xl mx-auto text-center leading-relaxed">
            {categoryConfig.subtitle}
          </p>
        </div>

        {/* Search Input Bar with Filter Icon */}
        <div className="relative mb-4">
          <div className="relative flex items-center">
            <Search className="absolute left-4 w-5 h-5 text-charcoal/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={categoryConfig.searchPlaceholder}
              className="w-full bg-white border border-gold/20 rounded-2xl pl-12 pr-14 py-3 text-sm sm:text-base text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:border-[#0F4C45] shadow-xs transition-all"
            />
            <button
              onClick={() => setShowFilterDrawer(!showFilterDrawer)}
              className="absolute right-3.5 p-2 bg-[#FAF7F2] hover:bg-gold/20 rounded-xl text-charcoal border border-gold/15 transition-colors"
              title="Toggle Filters"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#0F4C45]" />
            </button>
          </div>
        </div>

        {/* Sub-category Filter Badges (Horizontal Scrollable Pill Bar) */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 mb-4 scrollbar-none">
          {categoryConfig.subFilters.map((filter) => {
            const isSelected = activeSubFilter === filter.value;
            return (
              <button
                key={filter.value}
                onClick={() => setActiveSubFilter(filter.value)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 border ${
                  isSelected
                    ? "bg-[#0F4C45] text-white border-[#0F4C45] shadow-sm"
                    : "bg-white text-charcoal/70 border-gold/20 hover:border-[#0F4C45] hover:text-[#0F4C45]"
                }`}
              >
                {filter.label}
              </button>
            );
          })}
        </div>

        {/* Vendor Cards Listing Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-4">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="bg-white rounded-2xl border border-gold/15 shadow-sm overflow-hidden animate-pulse">
                <div className="aspect-[4/3] bg-gold/10 w-full" />
                <div className="p-4 space-y-3">
                  <div className="h-5 bg-gold/15 rounded w-3/4" />
                  <div className="h-4 bg-gold/10 rounded w-1/2" />
                  <div className="h-4 bg-gold/10 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredVendors.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gold/15 shadow-sm space-y-4 my-8">
            <div className="w-16 h-16 bg-[#0F4C45]/10 text-[#0F4C45] rounded-full flex items-center justify-center mx-auto">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-display font-bold text-charcoal">No {categoryConfig.title} Found</h3>
            <p className="text-xs sm:text-sm text-charcoal/60 max-w-md mx-auto">
              We couldn't find any listings matching your search parameters. Try adjusting your search keywords or clearing sub-filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveSubFilter("all");
                setSelectedLocation("All Locations");
              }}
              className="bg-[#0F4C45] text-white px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-[#12584E] transition-all"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVendors.map((vendor) => {
              const isLiked = wishlist.has(vendor.id);
              const cardHref = `/boutiques/${vendor.id || vendor.slug}`;
              return (
                <Link
                  key={vendor.id}
                  href={cardHref}
                  className="bg-white rounded-2xl border border-gold/15 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
                >
                  <div>
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#0F4C45]">
                      {(() => {
                        const rawLogo = (
                          (vendor as any).logo_url ||
                          (vendor as any).logo ||
                          (vendor as any).profile_logo ||
                          vendor.image ||
                          (vendor as any).image_url ||
                          ""
                        ).toString().trim();
                        const isValid =
                          rawLogo.startsWith("data:image/") ||
                          rawLogo.startsWith("http://") ||
                          rawLogo.startsWith("https://") ||
                          (rawLogo.startsWith("/") && !rawLogo.startsWith("//"));

                        return isValid ? (
                          <img
                            src={rawLogo}
                            alt={vendor.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-[#0F4C45]">
                            <span className="font-serif text-5xl font-bold text-white tracking-wider">
                              {vendor.name ? vendor.name.charAt(0).toUpperCase() : "V"}
                            </span>
                          </div>
                        );
                      })()}

                      {/* Optional Overlay Badge (Indoor, Outdoor, Verified, Destination) */}
                      {vendor.badge && (
                        <span className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md text-charcoal text-[10px] font-bold px-3 py-1 rounded-full shadow-xs">
                          {vendor.badge}
                        </span>
                      )}

                      {/* Wishlist Heart Button */}
                      <button
                        onClick={(e) => toggleWishlist(vendor, e)}
                        className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all shadow-sm ${
                          isLiked
                            ? "bg-red-500 text-white"
                            : "bg-white/80 text-charcoal hover:bg-white hover:text-red-500"
                        }`}
                        title="Add to Wishlist"
                      >
                        <Heart className={`w-4 h-4 ${isLiked ? "fill-white" : ""}`} />
                      </button>
                    </div>

                    {/* Card Content Area */}
                    <div className="p-4 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-display font-bold text-base sm:text-lg text-charcoal group-hover:text-[#0F4C45] transition-colors truncate flex items-center gap-1.5">
                          {vendor.name}
                          {vendor.verified && (
                            <CheckCircle2 className="w-4 h-4 text-[#0F4C45] shrink-0 fill-[#0F4C45]/10" />
                          )}
                        </h3>
                      </div>

                      {/* Rating & Review */}
                      <div className="flex items-center gap-1.5 text-xs font-bold text-charcoal/80">
                        {Number(vendor.rating ?? 0) > 0 ? (
                          <>
                            <span className="text-amber-500 flex items-center gap-0.5">
                              ★ {Number(vendor.rating).toFixed(1)}
                            </span>
                            <span className="text-charcoal/50 font-normal">
                              ({vendor.reviewsCount ?? 0} reviews)
                            </span>
                          </>
                        ) : (
                          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded">
                            New
                          </span>
                        )}
                      </div>

                      {/* Location */}
                      <p className="text-xs text-charcoal/60 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-gold shrink-0" />
                        <span className="truncate">{vendor.location}</span>
                      </p>

                      {/* Price Tag */}
                      <div className="pt-1">
                        <p className="text-xs text-charcoal/60">
                          Starts from{" "}
                          <span className="font-bold text-charcoal text-sm">
                            {vendor.startingPrice}
                          </span>
                          {vendor.priceSuffix || categoryConfig.priceSuffix || ""}
                        </p>
                      </div>

                      {/* Specialty Tag Badge */}
                      {vendor.specialtyTag && (
                        <div className="pt-2">
                          <span className="inline-block bg-rose-50 text-rose-700 text-[10px] font-bold px-2.5 py-1 rounded-md border border-rose-100">
                            {vendor.specialtyTag}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Numbered Pagination Bar */}
        {filteredVendors.length > 0 && (
          <div className="flex items-center justify-center gap-2 mt-10 pt-6 border-t border-gold/15">
            <button className="w-9 h-9 rounded-full bg-white border border-gold/20 flex items-center justify-center text-charcoal hover:bg-[#0F4C45] hover:text-white transition-all shadow-2xs">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="w-9 h-9 rounded-full bg-[#0F4C45] text-white font-bold text-xs flex items-center justify-center shadow-xs">
              1
            </button>
            <button className="w-9 h-9 rounded-full bg-white border border-gold/20 text-charcoal hover:bg-gold/15 font-bold text-xs flex items-center justify-center transition-all">
              2
            </button>
            <button className="w-9 h-9 rounded-full bg-white border border-gold/20 text-charcoal hover:bg-gold/15 font-bold text-xs flex items-center justify-center transition-all">
              3
            </button>
            <span className="text-xs text-charcoal/50 px-1">...</span>
            <button className="w-9 h-9 rounded-full bg-white border border-gold/20 text-charcoal hover:bg-gold/15 font-bold text-xs flex items-center justify-center transition-all">
              13
            </button>
            <button className="w-9 h-9 rounded-full bg-white border border-gold/20 flex items-center justify-center text-charcoal hover:bg-[#0F4C45] hover:text-white transition-all shadow-2xs">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </main>

      {/* 2. Reuse existing Website Footer */}
      <Footer />
    </div>
  );
}
