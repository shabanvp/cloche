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
  MapPin,
  CheckCircle2,
} from "lucide-react";
import { BottomNavBar } from "@/components/BottomNavBar";
import { Boutique } from "@/types";

// Map tags / plan keywords to display category labels
function resolveCategory(boutique: Boutique): string {
  const tags = (boutique.tags || "").toLowerCase();
  const plan = (boutique.plan || "").toLowerCase();
  const name = (boutique.boutique_name || "").toLowerCase();

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

function resolveDetailHref(boutique: Boutique): string {
  const category = resolveCategory(boutique).toLowerCase();
  const id = boutique.id;
  if (category.includes("venue")) return `/venues/${id}`;
  if (category.includes("photo")) return `/photographers/${id}`;
  if (category.includes("makeup")) return `/makeup-artists/${id}`;
  if (category.includes("decor") || category.includes("planner")) return `/decor-planning/${id}`;
  if (category.includes("cater")) return `/catering/${id}`;
  if (category.includes("jewel")) return `/jewellery/${id}`;
  if (category.includes("invitat")) return `/invitations/${id}`;
  if (category.includes("mehendi")) return `/mehendi-artists/${id}`;
  if (category.includes("bridal")) return `/bridal-wear/${id}`;
  if (category.includes("groom")) return `/groom-wear/${id}`;
  return `/boutiques/${id}`;
}

const CATEGORY_FILTERS = [
  "All",
  "Photographers",
  "Makeup",
  "Decor",
  "Planners",
  "Catering",
  "Mehendi",
  "Bridal Wear",
  "Groom Wear",
  "Jewellery",
  "Invitations",
  "Videographer",
  "Decorator",
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
  Catering: "cater",
  Mehendi: "mehendi",
  "Bridal Wear": "bridal",
  "Groom Wear": "groom",
  Jewellery: "jewel",
  Invitations: "invitat",
  Videographer: "video",
  Decorator: "decor",
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
        const rawUserData = localStorage.getItem("cloche_user_data");
        const localList: any[] = [];
        if (rawUserData) localList.push(JSON.parse(rawUserData));
        if (rawVendors) localList.push(...JSON.parse(rawVendors));
        if (rawBoutiques) localList.push(...JSON.parse(rawBoutiques));

        const mergedMap = new Map<string, any>();
        const seenNames = new Set<string>();

        // 1. Database fetched boutiques (initialBoutiques) get top priority for real DB profile images
        initialBoutiques.forEach((item) => {
          const itemKey = String(item.id || item.boutique_name);
          const normName = (item.boutique_name || "").toLowerCase().trim();
          if (itemKey && normName) {
            seenNames.add(normName);
            const logoSrc = item.logo_url || item.logo || (item as any).profile_logo || item.image_url || (item as any).cover_url || (item as any).coverImage || "";
            mergedMap.set(itemKey, {
              ...item,
              logo_url: logoSrc,
              logo: logoSrc,
              profile_logo: logoSrc,
              image_url: item.image_url || logoSrc,
            });
          }
        });

        // 2. Local storage registered vendors
        if (localList.length > 0) {
          localList.forEach((item) => {
            const itemKey = String(item.id || item.slug || item.boutique_name);
            const normName = (item.boutique_name || item.name || "").toLowerCase().trim();
            if (itemKey && normName) {
              const existing = mergedMap.get(itemKey);
              const logoSrc = item.logo_url || item.logo || item.profile_logo || item.image_url || item.image || item.coverImage || item.cover || "";
              if (!existing) {
                seenNames.add(normName);
                mergedMap.set(itemKey, {
                  id: itemKey,
                  boutique_name: item.boutique_name || item.name || "Wedding Vendor",
                  image_url: logoSrc,
                  logo_url: logoSrc,
                  profile_logo: logoSrc,
                  logo: logoSrc,
                  rating: item.rating || 4.8,
                  city: item.city || "Kochi",
                  area: item.district || item.location || "Kerala",
                  tags: item.category || item.tags || "Bridal Boutique",
                  starting_price: item.startingPrice || item.starting_price || "₹50,000",
                });
              } else if (logoSrc) {
                existing.logo_url = existing.logo_url || logoSrc;
                existing.logo = existing.logo || logoSrc;
                existing.profile_logo = existing.profile_logo || logoSrc;
                existing.image_url = existing.image_url || logoSrc;
              }
            }
          });
        }

        // 3. Fallback System Vendors across all categories
        const { getAllSystemVendors } = require("@/lib/allSystemVendors");
        const systemVendors = getAllSystemVendors();
        systemVendors.forEach((item: any) => {
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
  }, [initialBoutiques]);

  const filtered = useMemo(() => {
    return boutiquesList.filter((b) => {
      const category = resolveCategory(b);
      const matchesSearch =
        (b.boutique_name || "").toLowerCase().includes(search.toLowerCase()) ||
        (b.city || "").toLowerCase().includes(search.toLowerCase()) ||
        (b.area || "").toLowerCase().includes(search.toLowerCase()) ||
        category.toLowerCase().includes(search.toLowerCase());

      const targetKeyword = FILTER_MATCH[activeFilter].toLowerCase();
      const matchesFilter =
        activeFilter === "All" ||
        category.toLowerCase().includes(targetKeyword) ||
        (b.tags || "").toLowerCase().includes(targetKeyword) ||
        (b.boutique_name || "").toLowerCase().includes(targetKeyword);

      return matchesSearch && matchesFilter;
    });
  }, [boutiquesList, search, activeFilter]);

  const toggleWishlist = (e: React.MouseEvent, boutique: Boutique) => {
    e.preventDefault();
    e.stopPropagation();
    const { toggleWishlistItem } = require("@/lib/wishlistStore");
    const category = resolveCategory(boutique);
    toggleWishlistItem({
      id: boutique.id,
      name: boutique.boutique_name,
      category,
      city: boutique.city || boutique.area || "Kerala",
      boutique_name: boutique.boutique_name,
      rating: boutique.rating || 4.8,
      image: boutique.logo_url || boutique.image_url || (boutique as any).coverImage || (boutique as any).logo,
    });
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col font-sans">
      {/* ── Top Header Bar ── */}
      <header className="flex items-center justify-between px-4 pt-4 pb-2">
        <Link
          href="/"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EDE7DD] text-charcoal transition-colors hover:bg-[#E2D8C8]"
          aria-label="Go back to home"
        >
          <ArrowLeft className="h-5 w-5" style={{ color: "#0F4C45" }} />
        </Link>
        <h1
          className="font-serif text-[24px] font-bold tracking-tight text-center flex-1"
          style={{ color: "#0F4C45" }}
        >
          Vendors
        </h1>
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EDE7DD] transition-colors hover:bg-[#E2D8C8]"
          aria-label="Filter vendors"
        >
          <SlidersHorizontal className="h-5 w-5" style={{ color: "#0F4C45" }} />
        </button>
      </header>

      {/* ── Search Bar ── */}
      <div className="px-4 pb-3">
        <div
          className="flex items-center gap-3 rounded-2xl px-4 py-3 bg-white border border-gold/15 shadow-xs"
        >
          <Search className="h-4 w-4 shrink-0 text-charcoal/40" />
          <input
            type="text"
            placeholder="Search vendors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-[15px] outline-none placeholder:text-charcoal/40 text-charcoal"
          />
        </div>
      </div>

      {/* ── Filter Chips ── */}
      <div
        className="flex gap-2 overflow-x-auto px-4 pb-4 scrollbar-none"
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
              }}
            >
              {f}
            </button>
          );
        })}
      </div>

      {/* ── Vendors Grid ── */}
      <div className="flex-1 px-4 mb-28">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-6 bg-white rounded-2xl border border-gold/15">
            <Users className="h-10 w-10 mb-4 text-gold" />
            <p className="font-serif text-[20px] text-[#0F4C45] font-bold">
              No vendors found
            </p>
            <p className="mt-2 text-sm text-charcoal/60">
              Try adjusting your search or filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filtered.map((boutique) => {
              const isWishlisted = wishlist.has(boutique.id);
              const category = resolveCategory(boutique);
              const detailHref = resolveDetailHref(boutique);

              const rawLogo = (
                boutique.logo_url ||
                boutique.logo ||
                (boutique as any).profile_logo ||
                (boutique as any).profile_pic ||
                (boutique as any).avatar ||
                boutique.image_url ||
                (boutique as any).coverImage ||
                (boutique as any).cover ||
                (boutique as any).cover_url ||
                (boutique as any).image ||
                ""
              ).toString().trim();

              const isValidCover =
                rawLogo.startsWith("data:image/") ||
                rawLogo.startsWith("http://") ||
                rawLogo.startsWith("https://") ||
                (rawLogo.startsWith("/") && !rawLogo.startsWith("//"));

              const locationText = `${boutique.city || "Kochi"}${boutique.area ? `, ${boutique.area}` : ""}`;
              const startingPrice =
                (boutique as any).starting_price ||
                (boutique as any).startingPrice ||
                (category.includes("Venue") ? "₹1,80,000" : "₹50,000");

              const overlayTag = category.includes("Venue")
                ? (boutique.id.toString().length % 2 === 0 ? "Outdoor" : "Indoor")
                : category;

              const specialtyTag = category.includes("Venue")
                ? "Grand Ballroom"
                : category.includes("Makeup")
                ? "Bridal Makeover"
                : category.includes("Photo")
                ? "Cinematic Films"
                : category.includes("Decor")
                ? "Luxury Wedding Setup"
                : category.includes("Cater")
                ? "Royal Feast"
                : category.includes("Jewel")
                ? "Kundan & Gold"
                : "Luxury Partner";

              return (
                <Link
                  key={boutique.id}
                  href={detailHref}
                  className="bg-white rounded-2xl border border-gold/15 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
                >
                  {/* Card Image Header */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#0F4C45]">
                    {isValidCover ? (
                      <Image
                        src={rawLogo}
                        alt={boutique.boutique_name || "Vendor"}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        unoptimized={rawLogo.startsWith("data:")}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#0F4C45]">
                        <span className="font-serif text-5xl font-bold text-white tracking-wider">
                          {boutique.boutique_name ? boutique.boutique_name.charAt(0).toUpperCase() : "V"}
                        </span>
                      </div>
                    )}

                    {/* Top Overlay Badge */}
                    <span className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-xs text-charcoal text-[10px] font-bold px-2.5 py-1 rounded-md shadow-xs z-10">
                      {overlayTag}
                    </span>

                    {/* Wishlist Button */}
                    <button
                      type="button"
                      onClick={(e) => toggleWishlist(e, boutique)}
                      className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-md transition-transform active:scale-95 z-10"
                      aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                    >
                      <Heart
                        className={`h-4 w-4 transition-colors ${
                          isWishlisted ? "fill-red-500 text-red-500" : "text-white fill-none"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Card Content */}
                  <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-serif font-bold text-base text-charcoal group-hover:text-[#0F4C45] transition-colors truncate">
                          {boutique.boutique_name}
                        </h3>
                        <CheckCircle2 className="h-4 w-4 text-[#0F4C45] shrink-0" />
                      </div>

                      <div className="flex items-center gap-1 text-xs text-charcoal/70">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400 shrink-0" />
                        <span className="font-bold text-charcoal">
                          {boutique.rating ? boutique.rating.toFixed(1) : "4.8"}
                        </span>
                        <span className="text-charcoal/50">
                          ({(Math.abs((boutique.boutique_name || "").length * 17) % 120) + 40})
                        </span>
                      </div>

                      <p className="text-xs text-charcoal/60 flex items-center gap-1 truncate pt-0.5">
                        <MapPin className="h-3.5 w-3.5 text-charcoal/40 shrink-0" />
                        <span>{locationText}</span>
                      </p>

                      <p className="text-xs font-semibold text-charcoal pt-1">
                        Starts from <span className="font-bold text-[#0F4C45]">{startingPrice}</span>
                      </p>
                    </div>

                    {/* Specialty Pill */}
                    <div className="pt-2">
                      <span className="inline-block bg-rose-50 text-rose-700 text-[10px] font-bold px-2.5 py-1 rounded-md border border-rose-100">
                        {specialtyTag}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      <BottomNavBar activeTab="vendors" />
    </div>
  );
}
