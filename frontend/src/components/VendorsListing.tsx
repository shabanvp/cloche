"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useMemo, useEffect } from "react";
import {
  ArrowLeft,
  Search,
  SlidersHorizontal,
  Heart,
  Star,
  Users,
} from "lucide-react";
import { BottomNavBar } from "@/components/BottomNavBar";
import { Boutique } from "@/types";

// Map tags / plan keywords to display category labels
function resolveCategory(boutique: Boutique): string {
  const tags = (boutique.tags || "").toLowerCase();
  const plan = (boutique.plan || "").toLowerCase();
  const name = boutique.boutique_name.toLowerCase();

  if (tags.includes("videographer") || tags.includes("video") || name.includes("video") || name.includes("film") || name.includes("cinema")) return "Videographer";
  if (tags.includes("photo") || name.includes("photo") || name.includes("frame") || name.includes("media")) return "Photographer";
  if (tags.includes("makeup") || name.includes("makeup") || name.includes("beauty") || name.includes("glam")) return "Makeup Artist";
  if (tags.includes("wedding planner") || tags.includes("planner") || name.includes("sutra") || name.includes("planner")) return "Wedding Planner";
  if (tags.includes("flower decoration") || tags.includes("floral") || name.includes("flower")) return "Flower Decoration";
  if (tags.includes("decorator") || tags.includes("decor") || name.includes("decor")) return "Decorator";
  if (tags.includes("cake designer") || tags.includes("cake") || name.includes("bake")) return "Cake Designer";
  if (tags.includes("entertainment") || tags.includes("dj") || tags.includes("music") || name.includes("band")) return "Entertainment";
  if (tags.includes("choreographer") || tags.includes("dance") || name.includes("dance") || name.includes("choreo")) return "Choreographer";
  if (tags.includes("car rental") || tags.includes("car") || tags.includes("transport") || name.includes("car")) return "Car Rental";
  if (tags.includes("rental services") || tags.includes("rental") || name.includes("rental") || name.includes("rent")) return "Rental Services";
  if (tags.includes("gift store") || tags.includes("gift") || tags.includes("favor") || name.includes("gift")) return "Gift Store";
  if (tags.includes("honeymoon planners") || tags.includes("honeymoon") || tags.includes("travel") || name.includes("tour")) return "Honeymoon Planners";
  if (tags.includes("groom wear") || tags.includes("groom") || name.includes("sherwani") || name.includes("tuxedo")) return "Groom Wear";
  if (tags.includes("jewel") || name.includes("jewel") || name.includes("gold") || name.includes("diamond")) return "Jewellery";
  if (tags.includes("catering") || name.includes("cater") || name.includes("food")) return "Catering";
  if (tags.includes("mehendi") || name.includes("mehendi") || name.includes("henna")) return "Mehendi Artist";
  return "Bridal Wear";
}

const CATEGORY_FILTERS = [
  "All",
  "Photographers",
  "Makeup",
  "Decor",
  "Planners",
  "Jewellery",
  "Catering",
  "Bridal Wear",
  "Groom Wear",
  "Videographer",
  "Decorator",
  "Wedding Planner",
  "Cake Designer",
  "Entertainment",
  "Choreographer",
  "Car Rental",
  "Flower Decoration",
  "Rental Services",
  "Gift Store",
  "Honeymoon Planners",
] as const;
type CategoryFilter = (typeof CATEGORY_FILTERS)[number];

const FILTER_MATCH: Record<CategoryFilter, string> = {
  All: "",
  Photographers: "photo",
  Makeup: "makeup",
  Decor: "decor",
  Planners: "plan",
  Jewellery: "jewel",
  Catering: "cater",
  "Bridal Wear": "bridal",
  "Groom Wear": "groom",
  Videographer: "video",
  Decorator: "decor",
  "Wedding Planner": "plan",
  "Cake Designer": "cake",
  Entertainment: "entertain",
  Choreographer: "choreo",
  "Car Rental": "car",
  "Flower Decoration": "flower",
  "Rental Services": "rental",
  "Gift Store": "gift",
  "Honeymoon Planners": "honeymoon",
};

interface VendorsListingProps {
  boutiques: Boutique[];
}

export function VendorsListing({ boutiques: initialBoutiques }: VendorsListingProps) {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>("All");
  const [wishlist, setWishlist] = useState<Set<string | number>>(() => {
    if (typeof window !== "undefined") {
      const { getWishlistItems } = require("@/lib/wishlistStore");
      const items = getWishlistItems();
      return new Set(items.map((i: any) => String(i.id)));
    }
    return new Set();
  });
  const [boutiquesList, setBoutiquesList] = useState<Boutique[]>(initialBoutiques);

  useEffect(() => {
    const updateWishlistSet = () => {
      const { getWishlistItems } = require("@/lib/wishlistStore");
      const items = getWishlistItems();
      setWishlist(new Set(items.map((i: any) => String(i.id))));
    };

    if (typeof window !== "undefined") {
      updateWishlistSet();
      window.addEventListener("cloche_wishlist_updated", updateWishlistSet);

      try {
        const rawVendors = localStorage.getItem("cloche_registered_vendors");
        const rawBoutiques = localStorage.getItem("cloche_registered_boutiques");
        const localList: any[] = [];
        if (rawVendors) localList.push(...JSON.parse(rawVendors));
        if (rawBoutiques) localList.push(...JSON.parse(rawBoutiques));

        const mergedMap = new Map<string, any>();
        const seenNames = new Set<string>();

        if (localList.length > 0) {
          localList.forEach((item) => {
            const itemKey = item.id || item.slug || item.boutique_name;
            const normName = (item.boutique_name || item.name || "").toLowerCase().trim();
            if (itemKey && normName && !mergedMap.has(itemKey) && !seenNames.has(normName)) {
              seenNames.add(normName);
              const logoSrc = item.logo || item.logo_url || item.profile_logo || item.image_url || item.image || "";
              mergedMap.set(itemKey, {
                id: itemKey,
                boutique_name: item.boutique_name || item.name || "Wedding Vendor",
                image_url: logoSrc,
                logo_url: logoSrc,
                logo: logoSrc,
                rating: item.rating || 5.0,
                city: item.city || "Kochi",
                area: item.district || item.location || "Kerala",
                tags: item.category || item.tags || "Bridal Boutique",
              });
            }
          });
        }

        initialBoutiques.forEach((item) => {
          const itemKey = String(item.id || item.boutique_name);
          const normName = (item.boutique_name || "").toLowerCase().trim();
          if (itemKey && normName && !mergedMap.has(itemKey) && !seenNames.has(normName)) {
            seenNames.add(normName);
            mergedMap.set(itemKey, item);
          }
        });

        setBoutiquesList(Array.from(mergedMap.values()));
        return () => window.removeEventListener("cloche_wishlist_updated", updateWishlistSet);
      } catch (e) {}
    }
    setBoutiquesList(initialBoutiques);
  }, [initialBoutiques]);

  const filtered = useMemo(() => {
    return boutiquesList.filter((b) => {
      const category = resolveCategory(b);
      const matchesSearch =
        b.boutique_name.toLowerCase().includes(search.toLowerCase()) ||
        (b.city || "").toLowerCase().includes(search.toLowerCase()) ||
        (b.area || "").toLowerCase().includes(search.toLowerCase()) ||
        category.toLowerCase().includes(search.toLowerCase());

      const targetKeyword = FILTER_MATCH[activeFilter].toLowerCase();
      const matchesFilter =
        activeFilter === "All" ||
        category.toLowerCase().includes(targetKeyword) ||
        (b.tags || "").toLowerCase().includes(targetKeyword) ||
        b.boutique_name.toLowerCase().includes(targetKeyword);

      return matchesSearch && matchesFilter;
    });
  }, [boutiquesList, search, activeFilter]);

  const toggleWishlist = (e: React.MouseEvent, boutique: Boutique) => {
    e.preventDefault();
    const { toggleWishlistItem } = require("@/lib/wishlistStore");
    const category = resolveCategory(boutique);
    toggleWishlistItem({
      id: boutique.id,
      name: boutique.boutique_name,
      category,
      city: boutique.city || boutique.area || "Kerala",
      boutique_name: boutique.boutique_name,
      rating: boutique.rating || 4.9,
      image: boutique.image_url || (boutique as any).logo_url || (boutique as any).logo,
    });
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#F5F0E8" }}>
      {/* ── Header ── */}
      <header
        className="sticky top-0 z-40 flex items-center justify-between px-4 py-4"
        style={{ background: "#F5F0E8" }}
      >
        <Link
          href="/"
          className="flex h-10 w-10 items-center justify-center rounded-full"
          style={{ background: "rgba(15,76,69,0.08)" }}
          aria-label="Back"
        >
          <ArrowLeft className="h-5 w-5" style={{ color: "#0F4C45" }} />
        </Link>

        <h1
          className="font-display text-[20px] font-bold"
          style={{ color: "#0F4C45" }}
        >
          Vendors
        </h1>

        <button
          className="flex h-10 w-10 items-center justify-center rounded-full"
          style={{ background: "rgba(15,76,69,0.08)" }}
          aria-label="Filter vendors"
        >
          <SlidersHorizontal className="h-5 w-5" style={{ color: "#0F4C45" }} />
        </button>
      </header>

      {/* ── Search Bar ── */}
      <div className="px-4 pb-3">
        <div
          className="flex items-center gap-3 rounded-2xl px-4 py-3"
          style={{
            background: "#FFFFFF",
            boxShadow: "0 2px 12px rgba(15,76,69,0.07)",
          }}
        >
          <Search className="h-4 w-4 shrink-0" style={{ color: "#9A8D7D" }} />
          <input
            type="text"
            placeholder="Search vendors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-[15px] outline-none placeholder:text-[#B5A898]"
            style={{ color: "#2D2520" }}
          />
        </div>
      </div>

      {/* ── Filter Chips ── */}
      <div
        className="flex gap-2 overflow-x-auto px-4 pb-3 scrollbar-none"
        style={{ WebkitOverflowScrolling: "touch" } as React.CSSProperties}
      >
        {CATEGORY_FILTERS.map((f) => {
          const active = activeFilter === f;
          return (
            <button
              key={f}
              type="button"
              onClick={() => setActiveFilter(f)}
              aria-label={`Filter by ${f}`}
              className="shrink-0 rounded-full px-4 py-1.5 text-[13px] font-semibold transition-all cursor-pointer"
              style={{
                background: active ? "#0F4C45" : "#FFFFFF",
                color: active ? "#FFFFFF" : "#4A3F35",
                border: active ? "none" : "1px solid #E2D5C0",
                boxShadow: active ? "0 4px 14px rgba(15,76,69,0.22)" : "none",
              }}
            >
              {f}
            </button>
          );
        })}
      </div>

      {/* ── Vendors Grid ── */}
      <div className="flex-1 mx-4 mb-28">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-6 rounded-2xl bg-white border border-[#F0E8D8] shadow-xs">
            <Users className="h-10 w-10 mb-4" style={{ color: "#C8A96A" }} />
            <p
              className="font-display text-[20px]"
              style={{ color: "#0F4C45" }}
            >
              No vendors found
            </p>
            <p className="mt-2 text-sm" style={{ color: "#6B5E52" }}>
              Try adjusting your search or filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {filtered.map((boutique) => {
              const isWishlisted = wishlist.has(boutique.id);
              const category = resolveCategory(boutique);

              const rawLogo = (
                (boutique as any).logo ||
                (boutique as any).logo_url ||
                (boutique as any).profile_logo ||
                boutique.image_url ||
                ""
              ).toString().trim();

              const isValidLogoUrl =
                rawLogo.startsWith("data:image/") ||
                rawLogo.startsWith("http://") ||
                rawLogo.startsWith("https://") ||
                (rawLogo.startsWith("/") && !rawLogo.startsWith("//"));

              const initialLetter = (boutique.boutique_name || "W").charAt(0).toUpperCase();
              const reviewCountVal = Number((boutique as any).reviewCount ?? (boutique as any).reviewsCount ?? (boutique as any).review_count ?? 0);
              const displayRating = boutique.rating ? boutique.rating.toFixed(1) : "New";

              return (
                <div
                  key={boutique.id}
                  className="group relative flex flex-col rounded-2xl overflow-hidden bg-white border border-[#F0E8D8] shadow-xs hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Wishlist Heart Button Overlay */}
                  <button
                    onClick={(e) => toggleWishlist(e, boutique)}
                    className="absolute top-2.5 right-2.5 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/85 backdrop-blur-md shadow-xs transition-transform active:scale-90 hover:bg-white"
                    aria-label={
                      isWishlisted
                        ? "Remove from wishlist"
                        : "Add to wishlist"
                    }
                  >
                    <Heart
                      className="h-4.5 w-4.5 transition-colors"
                      style={{
                        color: isWishlisted ? "#E8614A" : "#1A1410",
                        fill: isWishlisted ? "#E8614A" : "none",
                        strokeWidth: 2,
                      }}
                    />
                  </button>

                  <Link href={`/boutiques/${boutique.id}`} className="flex flex-col flex-1">
                    {/* Photo / Initial Banner Container */}
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#0F4C45]">
                      {isValidLogoUrl ? (
                        <Image
                          src={rawLogo}
                          alt={boutique.boutique_name}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          unoptimized={rawLogo.startsWith("data:")}
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-[#0F4C45] text-[#F0E8D8]">
                          <span className="font-display text-3xl sm:text-4xl font-bold tracking-wider">
                            {initialLetter}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Card Content Info */}
                    <div className="flex flex-col flex-1 p-3 sm:p-4">
                      <h3 className="font-display text-[15px] sm:text-[17px] font-bold text-[#1A1410] leading-tight truncate group-hover:text-[#0F4C45] transition-colors">
                        {boutique.boutique_name}
                      </h3>
                      <p className="mt-0.5 text-[12px] sm:text-[13px] text-[#7A6E65] truncate">
                        {category}
                      </p>

                      <div className="mt-auto pt-2.5 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <Star
                            className="h-3.5 w-3.5 fill-[#C8A96A] text-[#C8A96A]"
                          />
                          <span className="text-[13px] font-bold text-[#1A1410]">
                            {displayRating}
                          </span>
                          <span className="text-[12px] text-[#9A8D7D]">
                            {reviewCountVal > 0 ? `(${reviewCountVal})` : "(New)"}
                          </span>
                        </div>
                        {boutique.district && (
                          <span className="text-[11px] font-medium text-[#7A6E65] truncate max-w-[80px]">
                            {boutique.district}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Bottom Nav ── */}
      <BottomNavBar activeTab="vendors" />
    </div>
  );
}
