"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useMemo } from "react";
import {
  ArrowLeft,
  Search,
  SlidersHorizontal,
  Heart,
  Star,
  MapPin,
} from "lucide-react";
import { BottomNavBar } from "@/components/BottomNavBar";
import { getAllVenues, VenueDetail, venues } from "@/lib/venueData";
import { useEffect } from "react";
import { getCategoryFallbackImage } from "@/lib/categories";
import { PaginationControls } from "@/components/PaginationControls";
import { formatCategory, formatLocation, formatPrice, formatReviews } from "@/lib/format";

const FILTERS = ["All", "Outdoor", "Indoor", "Destination", "Luxury"] as const;
type Filter = (typeof FILTERS)[number];

export function VenuesListing() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<Filter | string>("All");
  const [wishlist, setWishlist] = useState<Set<string>>(() => {
    if (typeof window !== "undefined") {
      const { getWishlistItems } = require("@/lib/wishlistStore");
      return new Set(getWishlistItems().map((i: any) => String(i.id)));
    }
    return new Set();
  });
  const [allVenuesList, setAllVenuesList] = useState<any[]>(venues);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetch("/api/v1/public/vendors?category=venues&limit=100", { cache: "no-store" })
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          const fallbackImg = getCategoryFallbackImage("venues");
          const mapped = json.data.map((dbV: any) => ({
            id: dbV.id,
            name: dbV.name,
            image: dbV.coverImage || dbV.logo || fallbackImg,
            image_url: dbV.coverImage || dbV.logo || fallbackImg,
            location: formatLocation(dbV.city, dbV.district),
            rating: dbV.rating || 4.9,
            reviews: dbV.reviewCount ?? 0,
            review_count: dbV.reviewCount ?? 0,
            price_per_plate: formatPrice(dbV.startingPrice),
            startingPrice: formatPrice(dbV.startingPrice),
            category: formatCategory(dbV.category),
            max_capacity: 1000,
            venue_type: "Banquet Hall & Lawns",
          }));

          const dbIds = new Set(mapped.map((m: any) => m.id));
          const existingFiltered = venues.filter((v) => !dbIds.has(v.id));
          setAllVenuesList([...mapped, ...existingFiltered]);
        }
      })
      .catch((err) => console.error("Error fetching live venue vendors:", err));
  }, []);

  const filtered = useMemo(() => {
    return allVenuesList.filter((v) => {
      const matchesSearch =
        v.name.toLowerCase().includes(search.toLowerCase()) ||
        (v.location && v.location.toLowerCase().includes(search.toLowerCase())) ||
        (v.venue_type && v.venue_type.toLowerCase().includes(search.toLowerCase()));

      const matchesFilter =
        activeFilter === "All" ||
        (activeFilter === "Outdoor" && (v.venue_type || "").includes("Lawns")) ||
        (activeFilter === "Indoor" && (v.venue_type || "").includes("Hall")) ||
        (activeFilter === "Destination" && ((v.location || "").includes("Goa") || (v.location || "").includes("Udaipur") || (v.location || "").includes("Kumarakom"))) ||
        (activeFilter === "Luxury" && (v.rating >= 4.8 || (v.venue_type || "").includes("Palace")));

      return matchesSearch && matchesFilter;
    });
  }, [allVenuesList, search, activeFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, activeFilter]);

  const ITEMS_PER_PAGE = 8;
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const paginatedVenues = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filtered, currentPage]);

  const toggleWishlist = (e: React.MouseEvent, venue: VenueDetail) => {
    e.preventDefault();
    const { toggleWishlistItem } = require("@/lib/wishlistStore");
    toggleWishlistItem({
      id: venue.id,
      name: venue.name,
      category: "Wedding Venues",
      image: venue.image || (venue as any).image_url,
      location: venue.location,
      rating: venue.rating,
      price: venue.startingPrice || (venue as any).price_per_plate,
    });
    setWishlist((prev) => {
      const next = new Set(prev);
      if (next.has(venue.id)) next.delete(venue.id);
      else next.add(venue.id);
      return next;
    });
  };

  return (
    <div
      className="min-h-screen flex flex-col font-sans"
      style={{ background: "#FAF9F6" }}
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <Link
          href="/"
          className="flex h-10 w-10 items-center justify-center rounded-full transition-transform active:scale-95"
          style={{ background: "#EFE9DF" }}
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5" style={{ color: "#0F4C45" }} />
        </Link>
        <span
          className="font-serif text-[18px] font-bold tracking-wide"
          style={{ color: "#0F4C45" }}
        >
          Wedding Venues
        </span>
        <div className="w-10" />
      </div>

      {/* Title block */}
      <div className="px-4 pt-1 pb-3">
        <h1
          className="font-serif text-[26px] leading-tight font-bold"
          style={{ color: "#0F4C45" }}
        >
          Find your dream venue
        </h1>
        <p className="mt-1 text-[13px]" style={{ color: "#5A6561" }}>
          Curated banquet halls, heritage palaces &amp; beachside resorts in Kerala
        </p>
      </div>

      {/* Search pill */}
      <div className="px-4 pb-3">
        <div
          className="flex items-center gap-3 rounded-full px-4 py-2.5 shadow-sm"
          style={{
            background: "#FFFFFF",
            boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
          }}
        >
          <Search className="h-4 w-4 shrink-0" style={{ color: "#8C827A" }} />
          <input
            type="text"
            placeholder="Search by venue name, city, style..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-[14px] outline-none placeholder:text-[#AAA29A]"
            style={{ color: "#1A1410" }}
          />
        </div>
      </div>

      {/* Filter pills */}
      <div className="flex items-center gap-2 overflow-x-auto px-4 pb-4 scrollbar-none">
        <button
          className="flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[12px] font-medium"
          style={{ background: "#EFE9DF", color: "#0F4C45" }}
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          Filter
        </button>
        {FILTERS.map((f) => {
          const active = activeFilter === f;
          return (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className="shrink-0 rounded-full px-4 py-1.5 text-[12px] font-medium transition-all"
              style={{
                background: active ? "#0F4C45" : "#FFFFFF",
                color: active ? "#FFFFFF" : "#4A3F35",
                boxShadow: active
                  ? "0 2px 8px rgba(15,76,69,0.3)"
                  : "0 1px 4px rgba(0,0,0,0.06)",
              }}
            >
              {f}
            </button>
          );
        })}
      </div>

      {/* Results header and page indicator */}
      {filtered.length > 0 && (
        <div className="flex items-center justify-between px-4 pb-2 text-xs text-[#7A6E65]">
          <span>
            Showing <span className="font-semibold text-[#1A1410]">{paginatedVenues.length}</span> of{" "}
            <span className="font-semibold text-[#1A1410]">{filtered.length}</span> venues
          </span>
          <span className="font-semibold text-[#0F4C45]">
            Page {currentPage} of {totalPages}
          </span>
        </div>
      )}

      {/* Venue cards list */}
      <div className="flex-1 px-4 pb-12 flex flex-col gap-3">
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <MapPin className="h-10 w-10 mb-4" style={{ color: "#C8A96A" }} />
            <p className="font-display text-[20px]" style={{ color: "#0F4C45" }}>
              No venues found
            </p>
            <p className="mt-2 text-sm" style={{ color: "#6B5E52" }}>
              Try adjusting your search or filters.
            </p>
          </div>
        )}

        {paginatedVenues.map((venue) => {
          const isWishlisted = wishlist.has(venue.id);
          return (
            <Link
              key={venue.id}
              href={`/venues/${venue.id}`}
              className="relative flex items-stretch overflow-hidden rounded-2xl transition-transform active:scale-[0.98]"
              style={{
                background: "#FFFFFF",
                boxShadow: "0 4px 20px rgba(15,76,69,0.08)",
              }}
            >
              {/* Venue image */}
              <div className="relative shrink-0 w-[120px] h-[100px]">
                <Image
                  src={venue.image || venue.image_url || "/images/venues-cover.png"}
                  alt={venue.name}
                  fill
                  sizes="120px"
                  className="object-cover"
                />
                {/* subtle overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/5" />
              </div>

              {/* Info */}
              <div className="flex flex-1 flex-col justify-center px-4 py-3 min-w-0">
                <p
                  className="font-display text-[16px] leading-snug truncate"
                  style={{ color: "#1A1410" }}
                >
                  {venue.name}
                </p>
                <p className="mt-0.5 text-[12px] truncate" style={{ color: "#7A6E65" }}>
                  {formatLocation(venue.location)}
                </p>
                <div className="mt-2 flex items-center gap-1.5">
                  <Star
                    className="h-3.5 w-3.5 fill-current"
                    style={{ color: "#C8A96A" }}
                  />
                  <span className="text-[13px] font-semibold" style={{ color: "#1A1410" }}>
                    {venue.rating}
                  </span>
                  <span className="text-[12px]" style={{ color: "#9A8D7D" }}>
                    ({formatReviews(venue.reviews ?? venue.review_count)})
                  </span>
                </div>
              </div>

              {/* Wishlist / Heart */}
              <button
                onClick={(e) => toggleWishlist(e, venue as any)}
                className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full transition-transform active:scale-90"
                style={{
                  background: "rgba(255,255,255,0.85)",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
                aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart
                  className="h-4 w-4 transition-colors"
                  style={{
                    color: isWishlisted ? "#E8614A" : "#C8A96A",
                    fill: isWishlisted ? "#E8614A" : "none",
                    strokeWidth: 1.8,
                  }}
                />
              </button>
            </Link>
          );
        })}

        {/* Dynamic Numbered Pagination Bar */}
        {filtered.length > 0 && (
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        )}
      </div>

      {/* Bottom nav */}
      <BottomNavBar />
    </div>
  );
}
