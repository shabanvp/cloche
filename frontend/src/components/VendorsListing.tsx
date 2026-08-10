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
import { AutocompleteSearch } from "@/components/AutocompleteSearch";
import { Boutique } from "@/types";

// Map tags / plan keywords to display category labels
function resolveCategory(boutique: Boutique): string {
  const tags = (boutique.tags || "").toLowerCase();
  const plan = (boutique.plan || "").toLowerCase();
  const name = (boutique.boutique_name || (boutique as any).name || "").toLowerCase();

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

function normalizeImageUrl(value: any): string {
  if (!value) return "";
  const raw = String(value).trim();
  if (!raw) return "";

  let fullUrl = raw;
  if (!/^https?:\/\//i.test(raw) && !/^data:image\//i.test(raw)) {
    if (raw.startsWith("/") && !raw.startsWith("//")) {
      fullUrl = raw;
    } else {
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dycwsnzyd";
      const cleanPath = raw.replace(/^\/+/, "");
      fullUrl = `https://res.cloudinary.com/${cloudName}/image/upload/${cleanPath}`;
    }
  }

  // Inject Cloudinary auto-formatting and resizing parameters (w_600, f_auto, q_auto)
  if (fullUrl.includes("res.cloudinary.com") && fullUrl.includes("/image/upload/") && !fullUrl.includes("w_")) {
    fullUrl = fullUrl.replace("/image/upload/", "/image/upload/w_600,c_limit,f_auto,q_auto/");
  }

  return fullUrl;
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
        // Client-side fetch backup (uses HTTP caching)
        const loadRealDbVendors = async () => {
          const mergedMap = new Map<string, any>();
          const seenNames = new Set<string>();
          let dbItems = initialBoutiques || [];

          try {
            const res = await fetch("/api/boutiques");
            if (res.ok) {
              const data = await res.json();
              if (Array.isArray(data) && data.length > 0) {
                const combined = [...dbItems, ...data];
                dbItems = combined;
              }
            }
          } catch (e) {}

          // 1. Database fetched boutiques
          dbItems.forEach((item) => {
            const bName = item.boutique_name || (item as any).name || (item as any).businessName || "Wedding Vendor";
            const itemKey = String(item.id || (item as any).slug || bName);
            const normName = bName.toLowerCase().trim();
            if (itemKey && normName) {
              seenNames.add(normName);
              const logoSrc = item.logo_url || item.logo || (item as any).profile_logo || (item as any).image_url || "";
              mergedMap.set(itemKey, {
                ...item,
                boutique_name: bName,
                logo_url: logoSrc,
                logo: logoSrc,
                profile_logo: logoSrc,
              });
            }
          });

          const finalList = Array.from(mergedMap.values());
          if (finalList.length > 0) {
            setBoutiquesList(finalList);
          }
        };

        loadRealDbVendors();
      } catch (e) {
        console.error("Local vendor sync error:", e);
      }

      return () => window.removeEventListener("cloche_wishlist_updated", updateWishlistSet);
    }
  }, [initialBoutiques]);

  const toggleWishlist = (e: React.MouseEvent, boutique: Boutique) => {
    e.preventDefault();
    e.stopPropagation();
    const { toggleWishlistItem } = require("@/lib/wishlistStore");
    toggleWishlistItem({
      id: boutique.id,
      name: boutique.boutique_name,
      category: resolveCategory(boutique),
      price: boutique.starting_price || "Contact for pricing",
      image: boutique.logo_url || boutique.logo || boutique.image_url,
      location: boutique.city || boutique.area || "Kochi, Kerala",
      city: boutique.city || "Kochi",
      rating: Number(boutique.rating ?? 0),
    });
  };

  const filtered = useMemo(() => {
    let result = boutiquesList;

    if (activeFilter !== "All") {
      const matchTerm = FILTER_MATCH[activeFilter];
      if (matchTerm) {
        result = result.filter((b) => {
          const tags = (b.tags || "").toLowerCase();
          const name = (b.boutique_name || (b as any).name || "").toLowerCase();
          const category = resolveCategory(b).toLowerCase();
          return tags.includes(matchTerm) || name.includes(matchTerm) || category.includes(matchTerm);
        });
      }
    }

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter((b) => {
        const name = (b.boutique_name || (b as any).name || "").toLowerCase();
        const city = (b.city || "").toLowerCase();
        const area = (b.area || "").toLowerCase();
        const tags = (b.tags || "").toLowerCase();
        return name.includes(q) || city.includes(q) || area.includes(q) || tags.includes(q);
      });
    }

    return result;
  }, [boutiquesList, activeFilter, search]);

  return (
    <div className="min-h-screen bg-[#FAF7F2] font-sans pb-24 md:pb-12 text-charcoal">
      {/* Search Header */}
      <header className="sticky top-0 z-30 w-full bg-[#FAF7F2]/95 backdrop-blur-md border-b border-gold/15 px-4 py-3 sm:px-6 md:px-8 lg:px-12">
        <div className="w-full flex items-center justify-start gap-3">
          <Link
            href="/"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white border border-gold/20 text-charcoal hover:bg-gold/10 transition-colors shadow-2xs shrink-0"
            aria-label="Back to home"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <AutocompleteSearch placeholder="Search vendors..." className="w-full max-w-sm sm:max-w-md md:w-[420px] lg:w-[480px]" />
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white border border-gold/20 text-charcoal hover:bg-gold/10 transition-colors shadow-2xs shrink-0 md:hidden ml-auto"
            aria-label="Filters"
          >
            <SlidersHorizontal className="h-4 w-4 text-[#0F4C45]" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full px-4 sm:px-6 md:px-8 lg:px-12 pt-4 sm:pt-6">
        {/* Category Pills Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-4 scrollbar-none">
          {CATEGORY_FILTERS.map((cat) => {
            const isSelected = activeFilter === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveFilter(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 border ${
                  isSelected
                    ? "bg-[#0F4C45] text-white border-[#0F4C45] shadow-xs"
                    : "bg-white text-charcoal/70 border-gold/20 hover:border-[#0F4C45] hover:text-[#0F4C45]"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Vendor Cards Listing Grid */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gold/15 shadow-sm space-y-3 my-8">
            <div className="w-14 h-14 bg-[#0F4C45]/10 text-[#0F4C45] rounded-full flex items-center justify-center mx-auto">
              <Users className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-serif font-bold text-charcoal">No Vendors Found</h3>
            <p className="text-xs text-charcoal/60 max-w-sm mx-auto">
              Try adjusting your search or filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filtered.map((boutique, index) => {
              const isWishlisted = wishlist.has(boutique.id);
              const category = resolveCategory(boutique);
              const detailHref = resolveDetailHref(boutique);
              const isPriority = index < 4;

              // Strictly resolve LOGO image ONLY (Do NOT request or load cover images)
              const rawLogo = (
                boutique.logo_url ||
                boutique.logo ||
                (boutique as any).profile_logo ||
                (boutique as any).profile_pic ||
                (boutique as any).avatar ||
                (boutique as any).image_url ||
                (boutique as any).image ||
                ""
              ).toString().trim();

              const displayImage = normalizeImageUrl(rawLogo);

              const isValidImage = Boolean(
                displayImage &&
                (displayImage.startsWith("data:image/") ||
                 displayImage.startsWith("http://") ||
                 displayImage.startsWith("https://") ||
                 (displayImage.startsWith("/") && !displayImage.startsWith("//")))
              );

              const bName = boutique.boutique_name || (boutique as any).name || "Wedding Vendor";
              const locationText = `${boutique.city || "Kochi"}${boutique.area ? `, ${boutique.area}` : ""}`;
              const startingPrice =
                (boutique as any).starting_price ||
                (boutique as any).startingPrice ||
                "Contact for pricing";

              const overlayTag = category.includes("Venue")
                ? (boutique.id.toString().length % 2 === 0 ? "Outdoor" : "Indoor")
                : category;

              return (
                <Link
                  key={boutique.id}
                  href={detailHref}
                  className="bg-white rounded-2xl border border-gold/15 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
                >
                  {/* Card Image Header - Single Main Image Container displaying Vendor LOGO */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#0F4C45]">
                    {isValidImage ? (
                      <Image
                        src={displayImage}
                        alt={bName}
                        fill
                        priority={isPriority}
                        loading={isPriority ? "eager" : "lazy"}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        unoptimized={displayImage.startsWith("data:")}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#0F4C45]">
                        <span className="font-serif text-5xl font-bold text-white tracking-wider">
                          {bName ? bName.charAt(0).toUpperCase() : "V"}
                        </span>
                      </div>
                    )}

                    {/* Bottom Overlay Category Badge */}
                    <span className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-xs text-charcoal text-[10px] font-bold px-2.5 py-1 rounded-md shadow-xs z-10">
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
                          {bName}
                        </h3>
                        <CheckCircle2 className="h-4 w-4 text-[#0F4C45] shrink-0" />
                      </div>

                      <div className="flex items-center gap-1 text-xs text-charcoal/70">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400 shrink-0" />
                        {Number(boutique.rating ?? 0) > 0 ? (
                          <>
                            <span className="font-bold text-charcoal">
                              {Number(boutique.rating).toFixed(1)}
                            </span>
                            <span className="text-charcoal/50">
                              ({(boutique as any).review_count ?? (boutique as any).reviewCount ?? 0} reviews)
                            </span>
                          </>
                        ) : (
                          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded">
                            New
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-charcoal/60 flex items-center gap-1 truncate pt-0.5">
                        <MapPin className="h-3.5 w-3.5 text-charcoal/40 shrink-0" />
                        <span>{locationText}</span>
                      </p>
                    </div>

                    <div className="pt-2 border-t border-gold/10 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-charcoal/50 block">Starts from</span>
                        <span className="text-sm font-bold text-[#0F4C45]">{startingPrice}</span>
                      </div>
                      <span className="text-xs font-bold text-[#0F4C45] group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                        View Profile &rarr;
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>

      <BottomNavBar activeTab="vendors" />
    </div>
  );
}
