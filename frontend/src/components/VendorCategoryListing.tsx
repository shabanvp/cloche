"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Heart,
  Star,
  MapPin,
  CheckCircle2,
  ChevronRight,
  Filter,
  Layers,
} from "lucide-react";
import { Footer } from "@/components/Footer";
import { VendorCardImage } from "@/components/VendorCardImage";
import { PaginationControls } from "@/components/PaginationControls";
import {
  CategoryConfig,
  VendorCategoryItem,
  VENDOR_CATEGORIES_DATA,
  getPublicCategoryConfig,
} from "@/lib/vendor-categories";

interface VendorCategoryListingProps {
  categorySlug?: string;
  initialCategoryConfig?: CategoryConfig;
}

export function VendorCategoryListing({
  categorySlug = "venues",
  initialCategoryConfig,
}: VendorCategoryListingProps) {
  // Resolve config based on categorySlug or fallback to correct matching category
  const categoryConfig: CategoryConfig = useMemo(() => {
    if (initialCategoryConfig) return initialCategoryConfig;
    return getPublicCategoryConfig(categorySlug);
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

      fetch(`/api/v1/public/vendors?category=${encodeURIComponent(targetSlug)}&limit=100&t=${Date.now()}`)
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
                coverImage: item.coverImage || item.cover_image || item.cover_url || "",
                profileImage: item.profileImage || item.logoUrl || item.logo || item.logo_url || "",
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

  // Reset filter sub-category and current page when slug changes
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

  // Reset to page 1 whenever active filter, location, or search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeSubFilter, selectedLocation, searchQuery]);

  // Dynamic Pagination
  const ITEMS_PER_PAGE = 9;
  const totalPages = Math.max(1, Math.ceil(filteredVendors.length / ITEMS_PER_PAGE));

  // Ensure current page does not exceed total pages
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const paginatedVendors = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredVendors.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredVendors, currentPage]);

  return (
    <div className="min-h-screen bg-[#FAF9F6] font-sans text-charcoal flex flex-col justify-between">
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

        {/* Search Input Bar */}
        <div className="relative mb-4">
          <div className="relative flex items-center">
            <Search className="absolute left-4 w-5 h-5 text-charcoal/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={categoryConfig.searchPlaceholder}
              className="w-full bg-white border border-gold/20 rounded-2xl pl-12 pr-4 py-3 text-sm sm:text-base text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:border-[#0F4C45] shadow-xs transition-all"
            />
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

        {/* Available Results & Page Indicator */}
        {!isLoading && filteredVendors.length > 0 && (
          <div className="flex items-center justify-between text-xs text-charcoal/60 mb-4 px-1">
            <span>
              Showing <span className="font-semibold text-charcoal">{paginatedVendors.length}</span> of{" "}
              <span className="font-semibold text-charcoal">{filteredVendors.length}</span> {categoryConfig.title}
            </span>
            <span className="font-medium text-[#0F4C45]">
              Page {currentPage} of {totalPages}
            </span>
          </div>
        )}

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
            {paginatedVendors.map((vendor) => {
              const isLiked = wishlist.has(vendor.id);
              const getCategoryRoutePrefix = (slug: string) => {
                const norm = (slug || "").toLowerCase();
                if (norm.includes("makeup")) return "makeup-artists";
                if (norm.includes("mehendi") || norm.includes("mehndi")) return "mehendi-artists";
                if (norm.includes("cater")) return "catering";
                if (norm.includes("photo") || norm.includes("video")) return "photographers";
                if (norm.includes("venue")) return "venues";
                if (norm.includes("jewel")) return "jewellery";
                if (norm.includes("wedding-story") || norm.includes("wedding-studio")) return "wedding-story";
                if (norm.includes("brides-story") || norm.includes("bridal-studio")) return "brides-story";
                if (norm.includes("grooms-story") || norm.includes("groom-studio")) return "grooms-story";
                if (norm.includes("bridal")) return "bridal-wear";
                if (norm.includes("groom")) return "groom-wear";
                if (norm.includes("decor")) return "decor-planning";
                if (norm.includes("invite")) return "invitations";
                return "boutiques";
              };

              const routePrefix = getCategoryRoutePrefix(categorySlug);
              const cardHref = `/${routePrefix}/${vendor.slug || vendor.id}`;

              const taglineVal = (vendor as any).tagline || "";
              const membershipVal = (vendor as any).membershipBadge || vendor.badge || "Verified";
              const isFeatured = (vendor as any).isFeatured;

              return (
                <Link
                  key={vendor.id}
                  href={cardHref}
                  className="bg-white rounded-2xl border border-gold/15 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
                >
                  <div>
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#104E45]">
                      <VendorCardImage vendorId={String(vendor.id)} businessName={vendor.name} coverImage={(vendor as any).coverImage} profileImage={(vendor as any).profileImage || (vendor as any).logo_url || (vendor as any).logo || vendor.image} className="group-hover:scale-105 transition-transform duration-500" />

                      {/* Featured Badge */}
                      {isFeatured && (
                        <span className="absolute top-3 left-3 bg-[#C8A96A] text-[#0F4C45] text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs uppercase tracking-wider">
                          Featured
                        </span>
                      )}

                      {/* Membership / Overlay Badge */}
                      {membershipVal && (
                        <span className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md text-charcoal text-[10px] font-bold px-3 py-1 rounded-full shadow-xs">
                          {membershipVal}
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
                      <div className="space-y-0.5">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-display font-bold text-base sm:text-lg text-charcoal group-hover:text-[#0F4C45] transition-colors truncate flex items-center gap-1.5">
                            {vendor.name}
                            {vendor.verified && (
                              <CheckCircle2 className="w-4 h-4 text-[#0F4C45] shrink-0 fill-[#0F4C45]/10" />
                            )}
                          </h3>
                        </div>
                        {taglineVal && (
                          <p className="text-xs text-[#0F4C45] italic font-medium truncate">
                            "{taglineVal}"
                          </p>
                        )}
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

                      {/* Specialty Tag / Category Badge */}
                      {vendor.specialtyTag && (
                        <div className="pt-2 flex items-center gap-1.5 flex-wrap">
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

        {/* Dynamic Numbered Pagination Bar */}
        {filteredVendors.length > 0 && (
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        )}
      </main>

      {/* 2. Reuse existing Website Footer */}
      <Footer />
    </div>
  );
}
