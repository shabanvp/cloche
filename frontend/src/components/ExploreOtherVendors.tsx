"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, MapPin, ChevronRight, Loader2 } from "lucide-react";
import { makeupArtists, photographers } from "@/lib/vendorLists";
import { mehendiVendors } from "@/lib/mehendiData";
import { cateringVendors } from "@/lib/cateringData";
import { jewelleryVendors } from "@/lib/jewelleryData";
import { decorVendors } from "@/lib/decorData";
import { bridalBoutiqueVendors, invitationVendors } from "@/lib/bridalAndInvitationData";
import { groomWearVendors } from "@/lib/groomWearData";

export interface ExploreOtherVendorsProps {
  category: string;
  currentVendorId?: string;
  currentVendorName?: string;
}

export interface ExploreVendorItem {
  id: string;
  name: string;
  image: string;
  rating: number;
  reviews: number;
  price: string;
  location: string;
  href: string;
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
  if (slug.includes("groom") || slug.includes("sherwani") || slug.includes("suit")) {
    return {
      key: "groom-wear",
      headingLabel: "Groom Wear Designers",
      seeAllHref: "/groom-wear",
      getItemHref: (id: string) => `/groom-wear/${id}`,
    };
  }
  return {
    key: "bridal-wear",
    headingLabel: "Bridal Wear Boutiques",
    seeAllHref: "/bridal-wear",
    getItemHref: (id: string) => `/bridal-wear/${id}`,
  };
}

export function getStaticCategoryVendors(categoryKey: string): ExploreVendorItem[] {
  switch (categoryKey) {
    case "makeup":
      return makeupArtists.map((v: any) => ({
        id: v.id,
        name: v.name,
        image: v.image || v.images?.[0] || v.gallery?.[0] || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
        rating: Number(v.rating || 4.8),
        reviews: Number(v.reviews || v.reviewCount || 45),
        price: v.price || v.startingPrice || "₹18,000",
        location: v.location || "Kerala, India",
        href: `/makeup/${v.id}`,
      }));
    case "mehendi":
      return mehendiVendors.map((v: any) => ({
        id: v.id,
        name: v.name,
        image: v.image || v.portfolio?.[0] || v.gallery?.[0] || "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=400&q=80",
        rating: Number(v.rating || 4.9),
        reviews: Number(v.reviews || v.reviewCount || 38),
        price: v.price || v.startingPrice || "₹5,000",
        location: v.location || "Kerala, India",
        href: `/categories/mehendi/${v.id}`,
      }));
    case "photographers":
      return photographers.map((v: any) => ({
        id: v.id,
        name: v.name,
        image: v.image || v.images?.[0] || v.gallery?.[0] || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
        rating: Number(v.rating || 4.9),
        reviews: Number(v.reviews || v.reviewCount || 85),
        price: v.price || v.startingPrice || "₹45,000",
        location: v.location || "Kerala, India",
        href: `/photographers/${v.id}`,
      }));
    case "caterers":
      return cateringVendors.map((v: any) => ({
        id: v.id,
        name: v.name,
        image: v.image || v.gallery?.[0] || "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=400&q=80",
        rating: Number(v.rating || 4.8),
        reviews: Number(v.reviews || v.reviewCount || 92),
        price: v.startingPrice || v.price || "₹450 / plate",
        location: v.location || "Kerala, India",
        href: `/catering/${v.id}`,
      }));
    case "jewellery":
      return jewelleryVendors.map((v: any) => ({
        id: v.id,
        name: v.name,
        image: v.image || v.gallery?.[0] || "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=400&q=80",
        rating: Number(v.rating || 4.9),
        reviews: Number(v.reviews || v.reviewCount || 64),
        price: v.startingPrice || v.price || "₹35,000",
        location: v.location || "Kerala, India",
        href: `/categories/jewellery/${v.id}`,
      }));
    case "invitations":
      return invitationVendors.map((v: any) => ({
        id: v.id,
        name: v.name,
        image: v.image || v.gallery?.[0] || "https://images.unsplash.com/photo-1509315811355-57bd367776b3?auto=format&fit=crop&w=400&q=80",
        rating: Number(v.rating || 4.8),
        reviews: Number(v.reviews || v.reviewCount || 42),
        price: v.startingPrice || v.price || "₹120 / card",
        location: v.location || "Kerala, India",
        href: `/categories/invitations/${v.id}`,
      }));
    case "planners":
      return decorVendors.map((v: any) => ({
        id: v.id,
        name: v.name,
        image: v.image || v.gallery?.[0] || "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=400&q=80",
        rating: Number(v.rating || 4.9),
        reviews: Number(v.reviews || v.reviewCount || 78),
        price: v.startingPrice || v.price || "₹75,000",
        location: v.location || "Kerala, India",
        href: `/categories/decor-planning/${v.id}`,
      }));
    case "groom-wear":
      return groomWearVendors.map((v: any) => ({
        id: v.id,
        name: v.name,
        image: v.image || v.gallery?.[0] || "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=400&q=80",
        rating: Number(v.rating || 4.8),
        reviews: Number(v.reviews || v.reviewCount || 54),
        price: v.startingPrice || v.price || "₹15,000",
        location: v.location || "Kerala, India",
        href: `/groom-wear/${v.id}`,
      }));
    default:
      return bridalBoutiqueVendors.map((v: any) => ({
        id: v.id,
        name: v.name,
        image: v.image || v.gallery?.[0] || "https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=400&q=80",
        rating: Number(v.rating || 4.8),
        reviews: Number(v.reviews || v.reviewCount || 60),
        price: v.startingPrice || v.price || "₹25,000",
        location: v.location || "Kerala, India",
        href: `/bridal-wear/${v.id}`,
      }));
  }
}

export function ExploreOtherVendors({ category, currentVendorId, currentVendorName }: ExploreOtherVendorsProps) {
  const meta = normalizeCategoryMeta(category);
  const [vendors, setVendors] = useState<ExploreVendorItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    async function loadCategoryVendors() {
      // 1. Get real category static data first
      const staticList = getStaticCategoryVendors(meta.key);

      // 2. Fetch live vendors from DB API for this exact category
      let apiItems: ExploreVendorItem[] = [];
      try {
        const res = await fetch(`/api/v1/vendors?category=${encodeURIComponent(meta.key)}`, {
          cache: "no-store",
        });
        if (res.ok) {
          const json = await res.json();
          const rows = Array.isArray(json.data) ? json.data : Array.isArray(json) ? json : [];
          apiItems = rows.map((r: any) => ({
            id: r.id || r.vendor_id || `v-${Math.random()}`,
            name: r.boutique_name || r.name || r.business_name || "Cloche Vendor",
            image: r.logo || r.logo_url || r.coverImage || r.cover_image || r.image || staticList[0]?.image || "",
            rating: Number(r.rating || r.average_rating || 4.8),
            reviews: Number(r.reviews || r.review_count || 24),
            price: r.starting_price ? `₹${r.starting_price.toLocaleString()}` : r.price || "₹20,000",
            location: [r.city, r.state || r.district].filter(Boolean).join(", ") || r.location || "Kerala, India",
            href: meta.getItemHref(r.id || r.vendor_id),
          }));
        }
      } catch (_) {}

      // Combine API & Static items for this EXACT category, avoiding duplicates
      const combined = [...apiItems, ...staticList];
      const uniqueMap = new Map<string, ExploreVendorItem>();

      for (const item of combined) {
        if (!item.id || !item.name) continue;
        // Strict exclusion of currently viewed vendor
        const isCurrentId = currentVendorId && item.id.toLowerCase() === currentVendorId.toLowerCase();
        const isCurrentName = currentVendorName && item.name.toLowerCase().trim() === currentVendorName.toLowerCase().trim();

        if (isCurrentId || isCurrentName) continue;

        if (!uniqueMap.has(item.id)) {
          uniqueMap.set(item.id, item);
        }
      }

      const filteredList = Array.from(uniqueMap.values()).slice(0, 5);

      if (isMounted) {
        setVendors(filteredList);
        setLoading(false);
      }
    }

    loadCategoryVendors();

    return () => {
      isMounted = false;
    };
  }, [category, currentVendorId, currentVendorName, meta.key]);

  return (
    <section className="rounded-2xl bg-white p-4 sm:p-5 md:p-6 lg:p-8 border border-gold/15 shadow-xs font-sans space-y-4 my-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-lg sm:text-xl md:text-2xl font-bold text-[#1A1410]">
            Explore Other {meta.headingLabel}
          </h2>
          <p className="text-xs text-[#7A6E65] mt-0.5">
            Discover verified {meta.headingLabel.toLowerCase()} available for your wedding date
          </p>
        </div>

        <Link
          href={meta.seeAllHref}
          className="text-xs sm:text-sm font-bold text-[#0F4C45] hover:text-[#C8A96A] transition-colors flex items-center gap-1 shrink-0"
        >
          See All <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {loading ? (
        <div className="py-8 flex items-center justify-center text-xs text-[#7A6E65] gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-[#0F4C45]" /> Loading other {meta.headingLabel.toLowerCase()}...
        </div>
      ) : vendors.length > 0 ? (
        <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 overflow-x-auto md:overflow-visible hide-scrollbar pb-2 md:pb-0">
          {vendors.map((v) => (
            <Link
              key={v.id}
              href={v.href}
              className="flex-shrink-0 min-w-[200px] w-[65vw] sm:w-56 md:w-auto rounded-2xl overflow-hidden bg-[#FAF7F2] border border-gold/15 shadow-2xs hover:border-[#0F4C45] hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="relative h-36 sm:h-40 w-full bg-gray-200 overflow-hidden">
                  <Image
                    src={v.image}
                    alt={v.name}
                    fill
                    sizes="(max-width: 768px) 65vw, 250px"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
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
                <span className="text-[10px] text-[#7A6E65] uppercase font-bold tracking-wider">Starts From</span>
                <span className="font-bold text-[#0F4C45] text-xs sm:text-sm">{v.price}</span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="py-8 px-4 rounded-xl bg-[#FAF7F2] border border-gold/15 text-center space-y-1">
          <p className="text-xs font-serif font-bold text-[#1A1410]">
            More {meta.headingLabel} coming soon to Cloche!
          </p>
          <p className="text-[11px] text-[#7A6E65]">
            Check back shortly as we expand our verified partner network across Kerala.
          </p>
        </div>
      )}
    </section>
  );
}
