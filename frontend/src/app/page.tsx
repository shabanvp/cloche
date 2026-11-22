"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { AdBanner } from "@/components/AdBanner";
import { AutocompleteSearch } from "@/components/AutocompleteSearch";
import { DigitalInvitationsSection } from "@/components/DigitalInvitationsSection";
import { HomepageVendorCard, VendorCardItem } from "@/components/HomepageVendorCard";
import { PopularNearYouSection } from "@/components/PopularNearYouSection";
import { PhotographersForYouSection } from "@/components/PhotographersForYouSection";
import { WeddingPlanningJourneySection } from "@/components/WeddingPlanningJourneySection";
import { Sparkles, Plus, ArrowRight, Star, Heart, Flame } from "lucide-react";
import { HOMEPAGE_CATEGORY_STRIP } from "@/lib/categories";
import { VendorCardSkeleton } from "@/components/skeletons/VendorCardSkeleton";
import { WeddingInspirationSection } from "@/components/WeddingInspirationSection";
import { formatLocation, formatPrice } from "@/lib/format";
import { mapPublicVendor } from "@/lib/vendorMapper";

export const dynamic = "force-dynamic";

function mapHomepageVendor(source: Record<string, unknown>): VendorCardItem {
  const vendor = mapPublicVendor(source);
  return {
    id: String(vendor.id),
    slug: String(vendor.slug),
    name: String(vendor.name),
    category: String(vendor.category),
    categorySlug: String(vendor.categorySlug),
    city: formatLocation(vendor.city, vendor.district),
    rating: Number(vendor.rating || 0),
    reviewCount: Number(vendor.reviewCount || 0),
    createdAt: String(vendor.created_at || vendor.createdAt || ""),
    startingPrice: formatPrice(vendor.startingPrice),
    coverImage: String(vendor.coverImage || ""),
    profileImage: String(vendor.profileImage || vendor.logo || ""),
  };
}

function rankVendors(vendors: VendorCardItem[]): VendorCardItem[] {
  return [...vendors].sort((left, right) =>
    right.rating - left.rating ||
    (right.reviewCount || 0) - (left.reviewCount || 0) ||
    (Date.parse(right.createdAt || "") || 0) - (Date.parse(left.createdAt || "") || 0)
  );
}

export default function Home() {
  const [allVendors, setAllVendors] = useState<VendorCardItem[]>([]);
  const [topRatedVendors, setTopRatedVendors] = useState<VendorCardItem[]>([]);
  const [moreVendors, setMoreVendors] = useState<VendorCardItem[]>([]);
  const [vendorsLoading, setVendorsLoading] = useState(true);
  const [vendorsError, setVendorsError] = useState(false);
  // Fetch the public vendor catalog and legacy boutique catalog concurrently.
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      const results = await Promise.allSettled([
        fetch("/api/v1/public/vendors?limit=100").then(async (response) => {
          if (!response.ok) throw new Error("Public vendor request failed");
          return response.json();
        }),
        fetch("/api/boutiques").then(async (response) => {
          if (!response.ok) throw new Error("Boutique request failed");
          return response.json();
        }),
      ]);

      if (!isMounted) return;
      const publicData = results[0].status === "fulfilled" && results[0].value?.success && Array.isArray(results[0].value.data)
        ? results[0].value.data.map((vendor: Record<string, unknown>) => mapHomepageVendor(vendor))
        : [];
      const boutiqueData = results[1].status === "fulfilled" && Array.isArray(results[1].value)
        ? results[1].value.map((vendor: Record<string, unknown>) => mapHomepageVendor(vendor))
        : [];
      const sourceAvailable = publicData.length > 0 || boutiqueData.length > 0 ||
        (results[0].status === "fulfilled" && results[0].value?.success) ||
        (results[1].status === "fulfilled" && Array.isArray(results[1].value));

      const uniqueVendors = new Map<string, VendorCardItem>();
      [...publicData, ...boutiqueData].forEach((vendor) => {
        if (!uniqueVendors.has(vendor.id)) uniqueVendors.set(vendor.id, vendor);
      });

      const ranked = rankVendors(Array.from(uniqueVendors.values()));
      const topRated = ranked.filter((vendor) => vendor.rating > 0 && (vendor.reviewCount || 0) > 0).slice(0, 4);
      const topIds = new Set(topRated.map((vendor) => vendor.id));

      setAllVendors(ranked);
      setTopRatedVendors(topRated);
      setMoreVendors(ranked.filter((vendor) => !topIds.has(vendor.id)).slice(0, 4));
      setVendorsError(!sourceAvailable);
      setVendorsLoading(false);
    }

    loadData().catch((error) => {
      console.error("Failed to load homepage vendor data:", error);
      if (isMounted) {
        setVendorsError(true);
        setVendorsLoading(false);
      }
    });

    return () => { isMounted = false; };
  }, []);

  const categories = [
    {
      title: "Venues",
      subtitle: "Banquet Halls, Lawns, Resorts...",
      href: "/venues",
      bgColor: "bg-[#E3EAF3]",
      img: "/images/venues-cover.png",
      alt: "Wedding Venues"
    },
    {
      title: "Photographers",
      subtitle: "Wedding & Pre-wedding Photography",
      href: "/photographers",
      bgColor: "bg-[#FCEFE3]",
      img: "/images/photographers-cover-new.jpg",
      alt: "Wedding Photographers"
    },
    {
      title: "Makeup",
      subtitle: "Bridal Makeup, Hair & Family Styling",
      href: "/makeup",
      bgColor: "bg-[#F6E5E5]",
      img: "/images/makeup-cover.png",
      alt: "Bridal Makeup"
    },
    {
      title: "Bridal Studio",
      subtitle: "Lehengas, Kanchipuram Saris & Gowns",
      href: "/categories/bridal-studio",
      bgColor: "bg-[#EAF3E3]",
      img: "/images/bridal-studio-cover.png",
      alt: "Bridal Studio"
    },
    {
      title: "Groom Studio",
      subtitle: "Bespoke Sherwanis, Tuxedos & Suits",
      href: "/categories/groom-studio",
      bgColor: "bg-[#EBEFF3]",
      img: "/images/groom-wear-cover.png",
      alt: "Groom Studio"
    },
    {
      title: "Wedding Studio",
      subtitle: "Couple Couture & Ceremonial Outfits",
      href: "/categories/wedding-studio",
      bgColor: "bg-[#F7EBE5]",
      img: "/images/wedding-studio-cover.png",
      alt: "Wedding Studio"
    },
    {
      title: "Catering",
      subtitle: "Traditional Sadya, Buffet & Feasts",
      href: "/categories/catering",
      bgColor: "bg-[#F3EAF6]",
      img: "https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=800&auto=format&fit=crop",
      alt: "Catering"
    },
    {
      title: "Decor & Planning",
      subtitle: "Stage Decor, Florals & Planners",
      href: "/categories/decor-planning",
      bgColor: "bg-[#F6F3E5]",
      img: "/images/decor-planning-cover.png",
      alt: "Decor and Planning"
    }
  ];

  return (
    <>
      <main className="pb-20 w-full overflow-x-hidden">
        
        {/* Hero Section */}
        <section className="relative h-[480px] md:h-[520px] w-full flex flex-col justify-end">
          <div className="absolute inset-0 overflow-hidden rounded-b-3xl bg-charcoal">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDkuPHXhU7sXzDUvYbDriFUJ917zikz7COlOrOswDvuY6_7v5cQOlZuew5k-nQKjcfUP1uCWfNAZ_E3pzW0ZhxB3iG_Qgee-9xeWqV3kmcxYZjS4lZH63iptxjO4EQc-c1trOo4OB45RTiLcgN_4gKPeu41g5AiHIMElHe-KXqWqvejj3L13jYUx7jf5JgJ76IE74Db2TjqXh0ocXwWUZwTja1cDHAcysRGBp85vCe6HOhaQ8V2U10qxMCfXK6vEIuyz0bq1Y5eq9PQ=s0"
              alt="Real Wedding Celebration"
              className="w-full h-full object-cover object-center filter contrast-[1.06] brightness-[1.03] saturate-[1.05]"
              loading="eager"
              decoding="async"
              // @ts-ignore
              fetchPriority="high"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/10"></div>
          </div>
          
          <div className="relative z-10 max-w-7xl mx-auto w-full p-6 md:p-10 space-y-4">
            <h1 className="text-white text-4xl md:text-5xl font-extrabold tracking-tight font-display max-w-2xl">
              Where Every Wedding Begins
            </h1>
            <p className="text-white/90 text-lg md:text-xl max-w-xl font-light">
              Find the best wedding vendors with thousands of trusted reviews
            </p>
            
            <div className="mt-6 max-w-xl">
              <AutocompleteSearch placeholder="Search for vendors, venues, or boutiques..." />
            </div>
          </div>
        </section>

        {/* Popular Searches */}
        <section className="pt-6 pb-2 md:pt-8 md:pb-3 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-4">
            <h2 className="text-xl md:text-2xl font-bold text-on-surface font-display">Popular Searches</h2>
          </div>
          
          {/* Responsive Layout: Scrollable on mobile (< md), Full clean grid on Laptop/Desktop (>= md) */}
          <div className="flex overflow-x-auto hide-scrollbar gap-4 md:grid md:grid-cols-4 lg:grid-cols-9 md:gap-6 md:overflow-visible">
            {HOMEPAGE_CATEGORY_STRIP.map((item) => (
              <Link key={item.label} href={item.href} className="flex-shrink-0 flex flex-col items-center gap-2.5 group cursor-pointer">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden shadow-sm border border-gold/10 ring-2 ring-transparent group-hover:ring-primary group-hover:shadow-md transition-all">
                  <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" src={item.img} alt={item.alt} />
                </div>
                <span className="text-xs md:text-sm font-semibold text-on-surface text-center group-hover:text-primary transition-colors">
                  {item.label}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* ── SECTION A: POPULAR NEAR YOU (LOCAL CITY-FILTERED DISCOVERY) ── */}
        <PopularNearYouSection vendors={allVendors} loading={vendorsLoading} error={vendorsError} />

        {/* Wedding Categories */}
        <section className="pt-3 pb-6 md:pt-4 md:pb-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-on-surface font-display">Wedding Categories</h2>
            <Link href="/categories" className="hidden md:flex items-center gap-1 text-primary font-bold text-sm hover:underline">
              View All Categories <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </Link>
          </div>

          {/* Grid: 4 cards on Mobile (< md), 6 cards on Laptop/Desktop (>= md) */}
          <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6">
            {categories.slice(0, 6).map((cat, idx) => (
              <Link 
                key={cat.title} 
                href={cat.href} 
                className={`${cat.bgColor} rounded-2xl overflow-hidden flex h-36 md:h-44 shadow-sm hover:shadow-md transition-all group ${
                  idx >= 4 ? "hidden md:flex" : "flex"
                }`}
              >
                <div className="flex-1 p-5 md:p-6 flex flex-col justify-center">
                  <div className="flex items-center gap-1 font-bold text-on-primary-container text-lg md:text-xl font-display group-hover:text-primary transition-colors">
                    {cat.title} <span className="material-symbols-outlined text-sm md:text-base">expand_more</span>
                  </div>
                  <p className="text-on-surface-variant text-xs md:text-sm mt-1.5 line-clamp-2">{cat.subtitle}</p>
                </div>
                <div className="w-1/2 relative overflow-hidden">
                  <img 
                    className="w-full h-full object-cover rounded-l-[40%] group-hover:scale-105 transition-transform duration-500" 
                    src={cat.img} 
                    alt={cat.alt} 
                  />
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-4 text-center">
            <Link href="/categories" className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-white border border-gold/20 text-primary font-bold text-xs sm:text-sm hover:bg-[#F3EDE2] transition-colors shadow-2xs">
              View All Categories <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </Link>
          </div>
        </section>

        {/* Sponsored Homepage Banner */}
        <AdBanner placement="Homepage Between Categories" />

        {/* ── TRENDING THIS WEEK SECTION (STANDARDIZED WITH HOMEPAGE VENDOR CARDS) ── */}
        {(vendorsLoading || vendorsError || topRatedVendors.length > 0) && <section className="pt-3 pb-6 md:pt-4 md:pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-4 flex justify-between items-end">
              <div>
                <span className="text-[11px] font-bold text-[#C6A568] uppercase tracking-wider block mb-1">
                  Ranked by ratings, reviews, and listing recency
                </span>
                <h2 className="text-2xl md:text-3xl font-bold text-charcoal font-display">
                  Top Rated Vendors
                </h2>
              </div>
              <Link href="/boutiques" className="hidden sm:inline-flex items-center gap-1 text-sm font-bold text-[#064E43] hover:text-[#C6A568] transition-colors">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {vendorsLoading ? (
              <div className="flex overflow-x-auto hide-scrollbar snap-x snap-mandatory gap-4 md:grid md:grid-cols-4 md:gap-6 md:overflow-visible pb-2">
                {[1, 2, 3, 4].map((i) => (
                  <VendorCardSkeleton key={i} />
                ))}
              </div>
            ) : vendorsError ? (
              <p role="status" className="rounded-xl bg-amber-50 p-5 text-center text-sm text-amber-900">We couldn’t load vendors right now. Please try again shortly.</p>
            ) : topRatedVendors.length > 0 ? (
              <div className="flex overflow-x-auto hide-scrollbar snap-x snap-mandatory gap-4 md:grid md:grid-cols-4 md:gap-6 md:overflow-visible pb-2">
                {topRatedVendors.map((vendor, index) => (
                  <HomepageVendorCard
                    key={vendor.id}
                    vendor={vendor}
                    rankBadge={index + 1}
                  />
                ))}
              </div>
            ) : null}
          </div>
        </section>}

        {/* Digital Wedding Invitations Section */}
        <DigitalInvitationsSection />

        {/* ── SECTION B: PHOTOGRAPHERS FOR YOU ── */}
        <PhotographersForYouSection initialVendors={allVendors} />

        {/* App Banner */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-6 md:my-8">
          <div className="p-8 md:p-14 rounded-3xl bg-primary text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
            <div className="relative z-10 space-y-6 max-w-xl">
              <span className="bg-gold/20 text-gold px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider inline-block">
                Mobile Convenience
              </span>
              <h2 className="text-3xl md:text-4xl font-bold font-display leading-tight">
                Download The CLOCHE Mobile App Today!
              </h2>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-gold">flare</span>
                  <span className="text-sm md:text-base font-medium">Save & Share Wedding Ideas</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-gold">favorite</span>
                  <span className="text-sm md:text-base font-medium">Shortlist Top Boutiques & Vendors</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-gold">checklist</span>
                  <span className="text-sm md:text-base font-medium">Get Free Interactive Checklist</span>
                </li>
              </ul>
              <Link 
                href="/download" 
                className="inline-block bg-white text-primary px-8 py-3.5 rounded-full font-bold text-sm shadow-lg hover:bg-gray-100 transition-all hover:scale-105 active:scale-95"
              >
                Download App
              </Link>
            </div>

            <div className="relative z-10 hidden lg:flex flex-col items-center justify-center p-8 bg-[#0B3B2D]/80 backdrop-blur-md border border-white/20 rounded-3xl text-center min-w-[260px]">
              <span className="material-symbols-outlined text-6xl text-gold mb-2">qr_code_2</span>
              <p className="font-bold text-sm">Scan to Install App</p>
              <p className="text-xs text-white/70 mt-1">Available on iOS & Android</p>
            </div>
          </div>
        </section>

        {/* ── REAL FEATURED VENDORS (STANDARDIZED WITH HOMEPAGE VENDOR CARDS) ── */}
        {(vendorsLoading || vendorsError || moreVendors.length > 0) && <section className="pt-3 pb-6 md:pt-4 md:pb-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-4 flex justify-between items-end">
            <div>
              <span className="text-[11px] font-bold text-[#C6A568] uppercase tracking-wider block mb-1">
                Ranked by ratings, reviews, and listing recency
              </span>
              <h2 className="text-2xl font-bold text-on-surface font-display">More Wedding Professionals</h2>
            </div>
            <Link href="/boutiques" className="text-primary text-sm font-bold hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {vendorsLoading ? (
            <div className="flex overflow-x-auto hide-scrollbar snap-x snap-mandatory gap-4 md:grid md:grid-cols-4 md:gap-6 md:overflow-visible pb-2">
              {[1, 2, 3, 4].map((i) => (
                <VendorCardSkeleton key={i} />
              ))}
            </div>
          ) : vendorsError ? (
            <p role="status" className="rounded-xl bg-amber-50 p-5 text-center text-sm text-amber-900">We couldn’t load more listings right now. Please try again shortly.</p>
          ) : moreVendors.length > 0 ? (
            <div className="flex overflow-x-auto hide-scrollbar snap-x snap-mandatory gap-4 md:grid md:grid-cols-4 md:gap-6 md:overflow-visible pb-2">
              {moreVendors.map((vendor) => (
                <HomepageVendorCard key={vendor.id} vendor={vendor} />
              ))}
            </div>
          ) : null}
        </section>}

        {/* ── SECTION C: WEDDING PLANNING JOURNEY (USEFUL STEP-BY-STEP ROADMAP) ── */}
        <WeddingPlanningJourneySection />

        <WeddingInspirationSection />

        {/* Mobile Sticky Sponsored Banner */}
        <AdBanner placement="Mobile Sticky Banner" />

      </main>
      <Footer />
    </>
  );
}
