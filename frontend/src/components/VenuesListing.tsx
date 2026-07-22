"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useMemo } from "react";
import { ArrowLeft, Search, SlidersHorizontal, Heart, Star, MapPin } from "lucide-react";
import { BottomNavBar } from "@/components/BottomNavBar";

type Venue = {
  id: string;
  name: string;
  location: string;
  city: string;
  rating: number;
  reviews: number;
  image: string;
  tags: string[];
  capacity?: string;
  price?: string;
};

const venues: Venue[] = [
  {
    id: "palace-estate",
    name: "The Palace Estate",
    location: "Udaipur, Rajasthan",
    city: "Udaipur",
    rating: 4.8,
    reviews: 138,
    image: "https://images.unsplash.com/photo-1519167758481-83f552bb8c74?auto=format&fit=crop&w=800&q=80",
    tags: ["Luxury", "Destination"],
    capacity: "500–1200 guests",
    price: "₹8L – ₹25L",
  },
  {
    id: "taj-lake-palace",
    name: "Taj Lake Palace",
    location: "Udaipur, Rajasthan",
    city: "Udaipur",
    rating: 4.9,
    reviews: 94,
    image: "https://images.unsplash.com/photo-1570544820323-66a7e58ce1d8?auto=format&fit=crop&w=800&q=80",
    tags: ["Luxury", "Destination", "Indoor"],
    capacity: "200–800 guests",
    price: "₹15L – ₹50L",
  },
  {
    id: "leela-palace",
    name: "The Leela Palace",
    location: "New Delhi, India",
    city: "Delhi",
    rating: 4.7,
    reviews: 110,
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
    tags: ["Luxury", "Indoor"],
    capacity: "300–1000 guests",
    price: "₹10L – ₹35L",
  },
  {
    id: "six-senses-fort-barwara",
    name: "Six Senses Fort Barwara",
    location: "Sawai Madhopur, Rajasthan",
    city: "Rajasthan",
    rating: 4.8,
    reviews: 81,
    image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80",
    tags: ["Luxury", "Destination", "Outdoor"],
    capacity: "100–400 guests",
    price: "₹20L – ₹60L",
  },
  {
    id: "umaid-bhawan",
    name: "Umaid Bhawan Palace",
    location: "Jodhpur, Rajasthan",
    city: "Rajasthan",
    rating: 4.9,
    reviews: 62,
    image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80",
    tags: ["Luxury", "Destination", "Outdoor"],
    capacity: "200–600 guests",
    price: "₹30L – ₹80L",
  },
  {
    id: "itc-grand-chola",
    name: "ITC Grand Chola",
    location: "Chennai, Tamil Nadu",
    city: "Chennai",
    rating: 4.6,
    reviews: 156,
    image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80",
    tags: ["Indoor", "Luxury"],
    capacity: "400–1500 guests",
    price: "₹6L – ₹20L",
  },
  {
    id: "oberoi-amarvilas",
    name: "The Oberoi Amarvilas",
    location: "Agra, Uttar Pradesh",
    city: "Agra",
    rating: 4.8,
    reviews: 73,
    image: "https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?auto=format&fit=crop&w=800&q=80",
    tags: ["Luxury", "Destination"],
    capacity: "150–500 guests",
    price: "₹18L – ₹45L",
  },
  {
    id: "golden-tulip-lawn",
    name: "Golden Tulip Lawns",
    location: "Pune, Maharashtra",
    city: "Pune",
    rating: 4.4,
    reviews: 201,
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80",
    tags: ["Outdoor", "Lawn"],
    capacity: "200–800 guests",
    price: "₹3L – ₹10L",
  },
];

const FILTERS = ["All", "Outdoor", "Indoor", "Destination", "Luxury"] as const;
type Filter = (typeof FILTERS)[number];

export function VenuesListing() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<Filter>("All");
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    return venues.filter((venue) => {
      const matchesSearch =
        venue.name.toLowerCase().includes(search.toLowerCase()) ||
        venue.location.toLowerCase().includes(search.toLowerCase());

      const matchesFilter =
        activeFilter === "All" || venue.tags.includes(activeFilter);

      return matchesSearch && matchesFilter;
    });
  }, [search, activeFilter]);

  const toggleWishlist = (id: string) => {
    setWishlist((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#F5F0E8" }}>
      {/* Header */}
      <header
        className="sticky top-0 z-40 flex items-center justify-between px-4 py-4"
        style={{ background: "#F5F0E8" }}
      >
        <Link
          href="/categories"
          className="flex h-10 w-10 items-center justify-center rounded-full"
          style={{ background: "rgba(15,76,69,0.08)" }}
          aria-label="Back to categories"
        >
          <ArrowLeft className="h-5 w-5" style={{ color: "#0F4C45" }} />
        </Link>

        <h1
          className="font-display text-[20px] font-bold"
          style={{ color: "#0F4C45" }}
        >
          Venues
        </h1>

        <button
          className="flex h-10 w-10 items-center justify-center rounded-full"
          style={{ background: "rgba(15,76,69,0.08)" }}
          aria-label="Filter venues"
        >
          <SlidersHorizontal className="h-5 w-5" style={{ color: "#0F4C45" }} />
        </button>
      </header>

      {/* Search bar */}
      <div className="px-4 pb-3">
        <div
          className="flex items-center gap-3 rounded-2xl px-4 py-3"
          style={{ background: "#FFFFFF", boxShadow: "0 2px 12px rgba(15,76,69,0.07)" }}
        >
          <Search className="h-4 w-4 shrink-0" style={{ color: "#9A8D7D" }} />
          <input
            type="text"
            placeholder="Search venues..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-[15px] outline-none placeholder:text-[#B5A898]"
            style={{ color: "#2D2520" }}
          />
        </div>
      </div>

      {/* Filter chips */}
      <div className="flex gap-2 overflow-x-auto px-4 pb-4 scrollbar-none" style={{ WebkitOverflowScrolling: "touch" }}>
        {FILTERS.map((filter) => {
          const active = activeFilter === filter;
          return (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className="shrink-0 rounded-full px-4 py-1.5 text-[13px] font-semibold transition-all"
              style={{
                background: active ? "#0F4C45" : "#FFFFFF",
                color: active ? "#FFFFFF" : "#4A3F35",
                border: active ? "none" : "1px solid #E2D5C0",
                boxShadow: active ? "0 4px 14px rgba(15,76,69,0.22)" : "none",
              }}
            >
              {filter}
            </button>
          );
        })}
      </div>

      {/* Venue cards list */}
      <div className="flex-1 px-4 pb-28 flex flex-col gap-3">
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <MapPin className="h-10 w-10 mb-4" style={{ color: "#C8A96A" }} />
            <p className="font-display text-[20px]" style={{ color: "#0F4C45" }}>No venues found</p>
            <p className="mt-2 text-sm" style={{ color: "#6B5E52" }}>Try adjusting your search or filters.</p>
          </div>
        )}

        {filtered.map((venue) => {
          const isWishlisted = wishlist.has(venue.id);
          return (
            <div
              key={venue.id}
              className="relative flex items-stretch overflow-hidden rounded-2xl"
              style={{
                background: "#FFFFFF",
                boxShadow: "0 4px 20px rgba(15,76,69,0.08)",
              }}
            >
              {/* Venue image */}
              <div className="relative shrink-0 w-[120px] h-[100px]">
                <Image
                  src={venue.image}
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
                  {venue.location}
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
                    ({venue.reviews})
                  </span>
                </div>
              </div>

              {/* Wishlist / Heart */}
              <button
                onClick={() => toggleWishlist(venue.id)}
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
            </div>
          );
        })}
      </div>

      {/* Bottom nav */}
      <BottomNavBar activeTab="venues" />
    </div>
  );
}
