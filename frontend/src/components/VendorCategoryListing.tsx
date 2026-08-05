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
import { Navbar } from "@/components/Navbar";
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
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);

  // Combine static config vendors with dynamic user-registered vendors from localStorage
  const [allVendors, setAllVendors] = useState<VendorCategoryItem[]>(categoryConfig.vendors);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const rawVendors = localStorage.getItem("cloche_registered_vendors");
        const rawBoutiques = localStorage.getItem("cloche_registered_boutiques");
        const localList: any[] = [];
        if (rawVendors) localList.push(...JSON.parse(rawVendors));
        if (rawBoutiques) localList.push(...JSON.parse(rawBoutiques));

        if (localList.length > 0) {
          const formattedLocal: VendorCategoryItem[] = localList.map((item, idx) => ({
            id: item.id || `local-${idx}`,
            name: item.boutique_name || item.name || item.businessName || "Wedding Partner",
            slug: item.slug || item.id || `partner-${idx}`,
            image: item.logo || item.image_url || item.image || categoryConfig.vendors[0]?.image || "",
            rating: item.rating || 4.9,
            reviewsCount: item.reviewsCount || item.review_count || 120,
            location: item.location || (item.city ? `${item.city}, Kerala` : "Kochi, Kerala"),
            startingPrice: item.startingPrice || item.starting_price || "₹50,000",
            badge: "Verified",
            verified: true,
            specialtyTag: item.category || categoryConfig.title,
            subCategory: "all",
          }));

          setAllVendors([...formattedLocal, ...categoryConfig.vendors]);
        } else {
          setAllVendors(categoryConfig.vendors);
        }
      } catch (e) {
        setAllVendors(categoryConfig.vendors);
      }
    }
  }, [categoryConfig]);

  // Reset filter sub-category when slug changes
  useEffect(() => {
    setActiveSubFilter("all");
    setCurrentPage(1);
  }, [categorySlug]);

  const toggleWishlist = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlist((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
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
      {/* 1. Reuse existing Website Navbar Header */}
      <Navbar />

      <main className="flex-grow py-6 sm:py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        {/* Breadcrumb Header */}
        <nav className="flex items-center gap-2 text-xs text-charcoal/60 mb-4 font-medium">
          <Link href="/" className="hover:text-[#0F4C45] transition-colors">
            Home
          </Link>
          <span>›</span>
          <span className="text-[#0F4C45] font-bold">{categoryConfig.title}</span>
        </nav>

        {/* Category Title & Tagline */}
        <div className="mb-6 space-y-1">
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-charcoal tracking-tight">
            {categoryConfig.title}
          </h1>
          <p className="text-sm sm:text-base text-charcoal/70 max-w-xl leading-relaxed">
            {categoryConfig.subtitle}
          </p>
        </div>

        {/* Search Input Bar with Filter Icon */}
        <div className="relative mb-6">
          <div className="relative flex items-center">
            <Search className="absolute left-4 w-5 h-5 text-charcoal/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={categoryConfig.searchPlaceholder}
              className="w-full bg-white border border-gold/20 rounded-2xl pl-12 pr-14 py-3.5 text-sm sm:text-base text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:border-[#0F4C45] shadow-xs transition-all"
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
        <div className="flex items-center gap-2.5 overflow-x-auto pb-3 mb-6 scrollbar-none">
          {categoryConfig.subFilters.map((filter) => {
            const isSelected = activeSubFilter === filter.value;
            return (
              <button
                key={filter.value}
                onClick={() => setActiveSubFilter(filter.value)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 border ${
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

        {/* Filter & Sort Dropdown Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pt-2 border-t border-gold/15">
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Location Select */}
            <div className="relative">
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="appearance-none bg-white border border-gold/20 rounded-xl px-4 py-2 pr-8 text-xs font-bold text-charcoal focus:outline-none focus:border-[#0F4C45] shadow-2xs cursor-pointer"
              >
                {categoryConfig.locationOptions.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-charcoal/50 pointer-events-none" />
            </div>

            {/* Sort Select */}
            <div className="relative">
              <select
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value)}
                className="appearance-none bg-white border border-gold/20 rounded-xl px-4 py-2 pr-8 text-xs font-bold text-charcoal focus:outline-none focus:border-[#0F4C45] shadow-2xs cursor-pointer"
              >
                {categoryConfig.sortOptions.map((sort) => (
                  <option key={sort} value={sort}>
                    {sort}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-charcoal/50 pointer-events-none" />
            </div>
          </div>

          {/* Results Count */}
          <div className="text-xs font-bold text-charcoal/60">
            Showing 1-{filteredVendors.length} of {filteredVendors.length} {categoryConfig.title.toLowerCase()}
          </div>
        </div>

        {/* Vendor Cards Listing Grid */}
        {filteredVendors.length === 0 ? (
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
              const cardHref = categoryConfig.slug === "venues" ? `/venues/${vendor.slug || vendor.id}` : `/venues/${vendor.slug || vendor.id}`;
              return (
                <Link
                  key={vendor.id}
                  href={cardHref}
                  className="bg-white rounded-2xl border border-gold/15 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
                >
                  <div>
                    {/* Image Area with Badge & Wishlist */}
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-ivory">
                      <img
                        src={vendor.image}
                        alt={vendor.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />

                      {/* Optional Overlay Badge (Indoor, Outdoor, Verified, Destination) */}
                      {vendor.badge && (
                        <span className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md text-charcoal text-[10px] font-bold px-3 py-1 rounded-full shadow-xs">
                          {vendor.badge}
                        </span>
                      )}

                      {/* Wishlist Heart Button */}
                      <button
                        onClick={(e) => toggleWishlist(vendor.id, e)}
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
                        <span className="text-amber-500 flex items-center gap-0.5">
                          ★ {vendor.rating}
                        </span>
                        <span className="text-charcoal/50 font-normal">
                          ({vendor.reviewsCount})
                        </span>
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
