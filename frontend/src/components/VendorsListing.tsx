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

  if (tags.includes("photo") || name.includes("photo") || name.includes("frame")) return "Photographer";
  if (tags.includes("makeup") || name.includes("makeup") || name.includes("beauty")) return "Makeup Artist";
  if (tags.includes("plan") || name.includes("plan") || name.includes("sutra")) return "Wedding Planner";
  if (tags.includes("decor") || name.includes("decor") || name.includes("flower") || name.includes("floral")) return "Decorator";
  if (tags.includes("cinema") || name.includes("cinema") || name.includes("film") || name.includes("video")) return "Cinematographer";
  if (tags.includes("jewel") || name.includes("jewel") || name.includes("gold")) return "Jewellery";
  if (tags.includes("catering") || name.includes("cater") || name.includes("food")) return "Catering";
  if (tags.includes("mehendi") || name.includes("mehendi") || name.includes("henna")) return "Mehendi Artist";
  return "Bridal Boutique";
}

const CATEGORY_FILTERS = [
  "All",
  "Photographers",
  "Makeup",
  "Decor",
  "Planners",
  "Jewellery",
  "Catering",
] as const;
type CategoryFilter = (typeof CATEGORY_FILTERS)[number];

// Maps each filter chip label → keyword to match in resolveCategory output
const FILTER_MATCH: Record<CategoryFilter, string> = {
  All: "",
  Photographers: "Photographer",
  Makeup: "Makeup Artist",
  Decor: "Decorator",
  Planners: "Wedding Planner",
  Jewellery: "Jewellery",
  Catering: "Catering",
};

interface VendorsListingProps {
  boutiques: Boutique[];
}

export function VendorsListing({ boutiques: initialBoutiques }: VendorsListingProps) {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>("All");
  const [wishlist, setWishlist] = useState<Set<string | number>>(new Set());
  const [boutiquesList, setBoutiquesList] = useState<Boutique[]>(initialBoutiques);

  useEffect(() => {
    if (typeof window !== "undefined") {
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
        return;
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

      const matchesFilter =
        activeFilter === "All" || category === FILTER_MATCH[activeFilter];

      return matchesSearch && matchesFilter;
    });
  }, [boutiquesList, search, activeFilter]);

  const toggleWishlist = (e: React.MouseEvent, id: string | number) => {
    e.preventDefault();
    setWishlist((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
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
              onClick={() => setActiveFilter(f)}
              className="shrink-0 rounded-full px-4 py-1.5 text-[13px] font-semibold transition-all"
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

      {/* ── Vendors List ── */}
      <div
        className="flex-1 mx-4 mb-28 rounded-2xl overflow-hidden"
        style={{
          background: "#FFFFFF",
          boxShadow: "0 4px 20px rgba(15,76,69,0.07)",
        }}
      >
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-6">
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
          <ul>
            {filtered.map((boutique, idx) => {
              const isWishlisted = wishlist.has(boutique.id);
              const category = resolveCategory(boutique);
              const isLast = idx === filtered.length - 1;

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

              const validAvatar = isValidLogoUrl
                ? rawLogo
                : "https://images.unsplash.com/photo-1594938298596-70f594f74246?q=80&w=200&auto=format&fit=crop";

              return (
                <li key={boutique.id}>
                  <Link
                    href={`/boutiques/${boutique.id}`}
                    className="flex items-center gap-4 px-4 py-4 transition-colors active:bg-[#F5F0E8]/60"
                    style={{ display: "flex" }}
                  >
                    {/* Circular avatar */}
                    <div
                      className="relative shrink-0 rounded-full overflow-hidden"
                      style={{
                        width: "64px",
                        height: "64px",
                        border: "2px solid #F0E8D8",
                      }}
                    >
                      <Image
                        src={validAvatar}
                        alt={boutique.boutique_name}
                        fill
                        sizes="64px"
                        className="object-cover"
                        unoptimized={validAvatar.startsWith("data:")}
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p
                        className="font-display text-[16px] font-semibold leading-tight truncate"
                        style={{ color: "#1A1410" }}
                      >
                        {boutique.boutique_name}
                      </p>
                      <p
                        className="mt-0.5 text-[13px]"
                        style={{ color: "#7A6E65" }}
                      >
                        {category}
                      </p>
                      <div className="mt-1.5 flex items-center gap-1.5">
                        <Star
                          className="h-3.5 w-3.5 fill-current"
                          style={{ color: "#C8A96A" }}
                        />
                        <span
                          className="text-[13px] font-semibold"
                          style={{ color: "#1A1410" }}
                        >
                          {boutique.rating
                            ? boutique.rating.toFixed(1)
                            : "4.8"}
                        </span>
                        <span
                          className="text-[12px]"
                          style={{ color: "#9A8D7D" }}
                        >
                          ({Math.floor(Math.random() * 150 + 50)})
                        </span>
                      </div>
                    </div>

                    {/* Heart */}
                    <button
                      onClick={(e) => toggleWishlist(e, boutique.id)}
                      className="shrink-0 flex h-8 w-8 items-center justify-center rounded-full transition-transform active:scale-90"
                      aria-label={
                        isWishlisted
                          ? "Remove from wishlist"
                          : "Add to wishlist"
                      }
                    >
                      <Heart
                        className="h-5 w-5 transition-colors"
                        style={{
                          color: isWishlisted ? "#E8614A" : "#C8A96A",
                          fill: isWishlisted ? "#E8614A" : "none",
                          strokeWidth: 1.8,
                        }}
                      />
                    </button>
                  </Link>

                  {/* Divider (not on last) */}
                  {!isLast && (
                    <div
                      className="mx-4"
                      style={{ height: "1px", background: "#F0E8D8" }}
                    />
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* ── Bottom Nav ── */}
      <BottomNavBar activeTab="vendors" />
    </div>
  );
}
