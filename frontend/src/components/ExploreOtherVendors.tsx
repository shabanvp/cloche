"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Star, MapPin, ChevronRight, Loader2, Building2, X } from "lucide-react";
import { VendorCardImage } from "@/components/VendorCardImage";

export interface ExploreOtherVendorsProps {
  category: string;
  currentVendorId?: string;
  currentVendorName?: string;
}

export interface ExploreVendorItem {
  id: string;
  name: string;
  image: string;
  coverImage?: string;
  profileImage?: string;
  rating: number;
  reviews: number;
  price: string;
  location: string;
  href: string;
  tagline?: string;
  isVerified?: boolean;
}

export function normalizeCategoryMeta(categorySlug: string) {
  const slug = (categorySlug || "").toLowerCase().trim();

  if (slug.includes("makeup") || slug.includes("beauty") || slug.includes("glam")) {
    return {
      key: "makeup",
      headingLabel: "Bridal Makeup Artists",
      seeAllHref: "/makeup",
      getItemHref: (id: string) => `/makeup/${id}`,
    };
  }
  if (slug.includes("mehendi") || slug.includes("henna") || slug.includes("mehndi")) {
    return {
      key: "mehendi",
      headingLabel: "Mehendi Artists",
      seeAllHref: "/categories/mehendi",
      getItemHref: (id: string) => `/categories/mehendi/${id}`,
    };
  }
  if (slug.includes("photo") || slug.includes("video") || slug.includes("camera")) {
    return {
      key: "photographers",
      headingLabel: "Photographers",
      seeAllHref: "/photographers",
      getItemHref: (id: string) => `/photographers/${id}`,
    };
  }
  if (slug.includes("venue") || slug.includes("palace") || slug.includes("lawn") || slug.includes("banquet")) {
    return {
      key: "venues",
      headingLabel: "Wedding Venues",
      seeAllHref: "/venues",
      getItemHref: (id: string) => `/venues/${id}`,
    };
  }
  if (slug.includes("cater") || slug.includes("food") || slug.includes("dining")) {
    return {
      key: "caterers",
      headingLabel: "Wedding Caterers",
      seeAllHref: "/catering",
      getItemHref: (id: string) => `/catering/${id}`,
    };
  }
  if (slug.includes("invite") || slug.includes("card") || slug.includes("stationery")) {
    return {
      key: "invitations",
      headingLabel: "Invitation Designers",
      seeAllHref: "/categories/invitations",
      getItemHref: (id: string) => `/categories/invitations/${id}`,
    };
  }
  if (slug.includes("jewel") || slug.includes("gold") || slug.includes("ornament") || slug.includes("polki")) {
    return {
      key: "jewellery",
      headingLabel: "Bridal Jewellery Stores",
      seeAllHref: "/categories/jewellery",
      getItemHref: (id: string) => `/categories/jewellery/${id}`,
    };
  }
  if (slug.includes("decor") || slug.includes("planner") || slug.includes("flower") || slug.includes("stage")) {
    return {
      key: "planners",
      headingLabel: "Event Planners & Decorators",
      seeAllHref: "/categories/decor-planning",
      getItemHref: (id: string) => `/categories/decor-planning/${id}`,
    };
  }
  if (slug.includes("groom")) {
    return {
      key: "groom-studio",
      headingLabel: "Groom Studios & Designers",
      seeAllHref: "/categories/groom-studio",
      getItemHref: (id: string) => `/categories/groom-studio/${id}`,
    };
  }
  if (slug.includes("wedding-studio") || slug === "wedding studio") {
    return {
      key: "wedding-studio",
      headingLabel: "Wedding Studios",
      seeAllHref: "/categories/wedding-studio",
      getItemHref: (id: string) => `/categories/wedding-studio/${id}`,
    };
  }
  if (slug.includes("bridal-studio") || slug.includes("bridal")) {
    return {
      key: "bridal-studio",
      headingLabel: "Bridal Studios & Boutiques",
      seeAllHref: "/categories/bridal-studio",
      getItemHref: (id: string) => `/categories/bridal-studio/${id}`,
    };
  }
  return {
    key: slug || "vendors",
    headingLabel: `${categorySlug.charAt(0).toUpperCase()}${categorySlug.slice(1)} Vendors`,
    seeAllHref: `/categories/${slug || "vendors"}`,
    getItemHref: (id: string) => `/vendors/${id}`,
  };
}

export function ExploreOtherVendors({ category, currentVendorId, currentVendorName }: ExploreOtherVendorsProps) {
  const meta = normalizeCategoryMeta(category);
  const [vendors, setVendors] = useState<ExploreVendorItem[]>([]);
  const [allCategoryVendors, setAllCategoryVendors] = useState<ExploreVendorItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFullModal, setShowFullModal] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    async function fetchLiveSupabaseVendors() {
      try {
        // Direct Live Supabase Database API query (/api/v1/public/vendors)
        const res = await fetch(`/api/v1/public/vendors?category=${encodeURIComponent(meta.key)}`, {
          cache: "no-store",
        });

        if (res.ok) {
          const json = await res.json();
          const rows = Array.isArray(json.data) ? json.data : [];

          // Map live Supabase database records
          const liveItems: ExploreVendorItem[] = rows
            .map((r: any) => {
              const vendorId = String(r.id || r.vendor_id || "");
              const vendorName = String(r.name || r.boutique_name || r.business_name || "Cloche Vendor");

              // Strict exclusion of currently viewed vendor by ID or Name
              if (currentVendorId && vendorId.toLowerCase() === String(currentVendorId).toLowerCase()) {
                return null;
              }
              if (currentVendorName && vendorName.toLowerCase().trim() === currentVendorName.toLowerCase().trim()) {
                return null;
              }

              const coverImg = r.coverImage || r.cover_image || "";
              const profileImg = r.profileImage || r.logo || r.logoUrl || "";
              const cityState = [r.city, r.state].filter(Boolean).join(", ") || "Kerala, India";

              return {
                id: vendorId,
                name: vendorName,
                image: coverImg,
                coverImage: coverImg,
                profileImage: profileImg,
                rating: Number(r.rating || 4.8),
                reviews: Number(r.reviewCount || r.reviews || 0),
                price: r.startingPrice || "Contact for Pricing",
                location: cityState,
                href: meta.getItemHref(vendorId),
                tagline: r.tagline || "",
                isVerified: Boolean(r.isVerified),
              };
            })
            .filter((item: ExploreVendorItem | null): item is ExploreVendorItem => item !== null);

          if (isMounted) {
            setAllCategoryVendors(liveItems);
            setVendors(liveItems.slice(0, 4));
          }
        } else {
          if (isMounted) {
            setVendors([]);
            setAllCategoryVendors([]);
          }
        }
      } catch (err) {
        console.error("[ExploreOtherVendors] Supabase Fetch Error:", err);
        if (isMounted) {
          setVendors([]);
          setAllCategoryVendors([]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchLiveSupabaseVendors();

    return () => {
      isMounted = false;
    };
  }, [category, currentVendorId, currentVendorName, meta.key]);

  return (
    <>
      <section className="rounded-2xl bg-white p-4 sm:p-5 md:p-6 lg:p-8 border border-gold/15 shadow-xs font-sans space-y-4 my-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-lg sm:text-xl md:text-2xl font-bold text-[#1A1410]">
              Explore Other {meta.headingLabel}
            </h2>
            <p className="text-xs text-[#7A6E65] mt-0.5">
              Live verified {meta.headingLabel.toLowerCase()} across Kerala
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowFullModal(true)}
            className="text-xs sm:text-sm font-bold text-[#0F4C45] hover:text-[#C8A96A] transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
          >
            See All ({allCategoryVendors.length}) <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {loading ? (
          <div className="py-10 flex items-center justify-center text-xs text-[#7A6E65] gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-[#0F4C45]" /> Fetching live Supabase vendors...
          </div>
        ) : vendors.length > 0 ? (
          <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 overflow-x-auto md:overflow-visible hide-scrollbar pb-2 md:pb-0">
            {vendors.map((v) => (
              <Link
                key={v.id}
                href={v.href}
                className="flex-shrink-0 min-w-[200px] w-[65vw] sm:w-56 md:w-auto rounded-2xl overflow-hidden bg-white border border-gold/15 shadow-2xs hover:border-[#0F4C45] hover:shadow-md transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-36 sm:h-40 w-full bg-gray-200 overflow-hidden">
                    <VendorCardImage vendorId={v.id} businessName={v.name} coverImage={v.coverImage} profileImage={v.profileImage} className="group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />
                    <span className="absolute bottom-2 left-2 text-[10px] font-bold text-white bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                      <MapPin className="w-2.5 h-2.5 text-[#C8A96A]" /> {v.location.split(",")[0]}
                    </span>
                  </div>

                  <div className="p-3 space-y-1.5">
                    <h4 className="text-xs sm:text-sm font-serif font-bold text-[#1A1410] line-clamp-1 group-hover:text-[#0F4C45] transition-colors">
                      {v.name}
                    </h4>

                    <div className="flex items-center gap-1.5 text-[11px] text-[#7A6E65]">
                      <div className="flex items-center gap-0.5 bg-amber-50 text-amber-900 font-bold px-1.5 py-0.5 rounded-md text-[10px]">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        <span>{v.rating}</span>
                      </div>
                      <span>({v.reviews} Reviews)</span>
                    </div>
                  </div>
                </div>

                <div className="px-3 pb-3 pt-1 border-t border-gold/10 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-[#7A6E65] uppercase font-bold tracking-wider">Starting From</span>
                  <span className="font-bold text-[#0F4C45] text-xs sm:text-sm">{v.price}</span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-10 px-4 rounded-xl bg-[#FAF9F6] border border-gold/15 text-center space-y-1">
            <Building2 className="w-8 h-8 text-[#0F4C45]/40 mx-auto mb-2" />
            <p className="text-sm font-serif font-bold text-[#1A1410]">
              No other {meta.headingLabel} listed yet
            </p>
            <p className="text-xs text-[#7A6E65]">
              As new verified {meta.headingLabel.toLowerCase()} register in Supabase, they will automatically appear here.
            </p>
          </div>
        )}
      </section>

      {/* Full Category Vendors Modal for 'See All' */}
      {showFullModal && (
        <div className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl max-h-[85vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col font-sans">
            <div className="p-5 bg-[#FAF9F6] border-b border-gold/15 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-serif font-bold text-[#1A1410]">
                  All {meta.headingLabel} ({allCategoryVendors.length})
                </h3>
                <p className="text-xs text-[#7A6E65]">
                  Full live Supabase directory list excluding currently viewed vendor
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowFullModal(false)}
                className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              {allCategoryVendors.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {allCategoryVendors.map((v) => (
                    <Link
                      key={v.id}
                      href={v.href}
                      onClick={() => setShowFullModal(false)}
                      className="rounded-2xl overflow-hidden bg-white border border-gold/15 shadow-xs hover:border-[#0F4C45] hover:shadow-md transition-all group flex flex-col justify-between"
                    >
                      <div>
                        <div className="relative h-40 w-full bg-gray-200 overflow-hidden">
                          <VendorCardImage vendorId={v.id} businessName={v.name} coverImage={v.coverImage} profileImage={v.profileImage} className="group-hover:scale-105 transition-transform duration-300" />
                          <span className="absolute bottom-2 left-2 text-[10px] font-bold text-white bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                            <MapPin className="w-2.5 h-2.5 text-[#C8A96A]" /> {v.location}
                          </span>
                        </div>

                        <div className="p-3.5 space-y-1">
                          <h4 className="text-sm font-serif font-bold text-[#1A1410] line-clamp-1 group-hover:text-[#0F4C45] transition-colors">
                            {v.name}
                          </h4>
                          {v.tagline && <p className="text-xs text-[#C8A96A] font-semibold italic line-clamp-1">"{v.tagline}"</p>}
                          <div className="flex items-center gap-1.5 text-xs text-[#7A6E65]">
                            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                            <span className="font-bold text-[#1A1410]">{v.rating}</span>
                            <span>({v.reviews} Reviews)</span>
                          </div>
                        </div>
                      </div>

                      <div className="px-3.5 py-2.5 bg-white border-t border-gold/10 flex items-center justify-between text-xs font-bold text-[#0F4C45]">
                        <span>Starting From</span>
                        <span>{v.price}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-xs text-[#7A6E65]">
                  No other {meta.headingLabel} listed yet.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
