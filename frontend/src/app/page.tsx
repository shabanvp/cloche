"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { AdBanner } from "@/components/AdBanner";
import { AutocompleteSearch } from "@/components/AutocompleteSearch";
import { DigitalInvitationsSection } from "@/components/DigitalInvitationsSection";
import { HomepageVendorCard, VendorCardItem } from "@/components/HomepageVendorCard";
import { PopularNearYouSection } from "@/components/PopularNearYouSection";
import { PhotographersForYouSection } from "@/components/PhotographersForYouSection";
import { WeddingPlanningJourneySection } from "@/components/WeddingPlanningJourneySection";
import { Sparkles, MapPin, Calendar, BookHeart, Plus, ArrowRight, Star, Heart, Flame } from "lucide-react";
import { HOMEPAGE_CATEGORY_STRIP } from "@/lib/categories";
import { RealWeddingStoryDb } from "@/lib/realWeddings";
import { VendorCardSkeleton } from "@/components/skeletons/VendorCardSkeleton";

export const dynamic = "force-dynamic";

export default function Home() {
  const [allVendors, setAllVendors] = useState<VendorCardItem[]>([]);
  const [trendingVendors, setTrendingVendors] = useState<VendorCardItem[]>([]);
  const [featuredVendors, setFeaturedVendors] = useState<VendorCardItem[]>([]);
  const [vendorsLoading, setVendorsLoading] = useState(true);
  const [stories, setStories] = useState<RealWeddingStoryDb[]>([]);
  const [storiesLoading, setStoriesLoading] = useState(true);

  // Fetch real registered vendors, boutiques, and real wedding stories concurrently
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const [vRes, bRes, sRes] = await Promise.all([
          fetch("/api/v1/public/vendors?limit=16").catch(() => null),
          fetch("/api/boutiques").catch(() => null),
          fetch("/api/v1/public/real-weddings?limit=3").catch(() => null),
        ]);

        if (!isMounted) return;

        // Process vendors & boutiques
        let allPublicVendors: VendorCardItem[] = [];
        if (vRes) {
          try {
            const data = await vRes.json();
            if (data.success && Array.isArray(data.data) && data.data.length > 0) {
              allPublicVendors = data.data.map((v: any) => ({
                id: v.id,
                slug: v.slug || v.id,
                name: v.name || "Verified Vendor",
                category: v.category || "Wedding Expert",
                categorySlug: v.categorySlug || "vendors",
                city: v.city || "Kerala",
                rating: Number(v.rating || 0),
                reviewCount: Number(v.reviewCount || 0),
                startingPrice: v.startingPrice || "Contact for pricing",
                coverImage:
                  v.coverImage ||
                  v.logo ||
                  "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
              }));
            }
          } catch (e) {}
        }

        let boutiqueVendors: VendorCardItem[] = [];
        if (bRes) {
          try {
            const bData = await bRes.json();
            if (Array.isArray(bData) && bData.length > 0) {
              boutiqueVendors = bData.map((b: any) => ({
                id: String(b.id),
                slug: b.slug || String(b.id),
                name: b.name || b.boutique_name || "Luxury Boutique",
                category: b.category || "Wedding Vendor",
                categorySlug: "venues",
                city: b.city || "Kerala",
                rating: Number(b.rating || 0),
                reviewCount: Number(b.review_count || 0),
                startingPrice: b.starting_price ? `₹${Number(b.starting_price).toLocaleString("en-IN")}` : "Contact for pricing",
                coverImage:
                  b.cover_image ||
                  b.logo ||
                  "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80",
              }));
            }
          } catch (e) {}
        }

        // Set Trending Vendors (Top 4)
        const trending = allPublicVendors.length > 0 ? allPublicVendors.slice(0, 4) : boutiqueVendors.slice(0, 4);
        setTrendingVendors(trending);

        // Deduplicate Featured Vendors
        const trendingIds = new Set(trending.map((t) => String(t.id).toLowerCase()));
        const trendingSlugs = new Set(trending.map((t) => (t.slug || "").toLowerCase()));

        const candidates = [...allPublicVendors.slice(4), ...boutiqueVendors];
        const deduplicatedFeatured = candidates.filter(
          (v) => !trendingIds.has(String(v.id).toLowerCase()) && !trendingSlugs.has((v.slug || "").toLowerCase())
        );

        setFeaturedVendors(deduplicatedFeatured.slice(0, 4));

        // Combined unique list for Popular Near You local discovery
        const combinedMap = new Map<string, VendorCardItem>();
        [...allPublicVendors, ...boutiqueVendors].forEach((v) => {
          if (!combinedMap.has(v.id)) {
            combinedMap.set(v.id, v);
          }
        });
        setAllVendors(Array.from(combinedMap.values()));

        // Process real wedding stories
        if (sRes) {
          try {
            const sData = await sRes.json();
            if (sData.success && Array.isArray(sData.stories)) {
              setStories(sData.stories);
            }
          } catch (e) {}
        }
      } catch (err) {
        console.error("Failed to load homepage data:", err);
      } finally {
        if (isMounted) {
          setVendorsLoading(false);
          setStoriesLoading(false);
        }
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  const categories = [
    {
      title: "Venues",
      subtitle: "Banquet Halls, Lawns, Resorts...",
      href: "/venues",
      bgColor: "bg-[#E3EAF3]",
      img: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80",
      alt: "Wedding Venues"
    },
    {
      title: "Photographers",
      subtitle: "Wedding & Pre-wedding Photography",
      href: "/photographers",
      bgColor: "bg-[#FCEFE3]",
      img: "/images/photographers-cover.png",
      alt: "Wedding Photographers"
    },
    {
      title: "Makeup",
      subtitle: "Bridal Makeup, Hair & Family Styling",
      href: "/makeup",
      bgColor: "bg-[#F6E5E5]",
      img: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80",
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
      img: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop",
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
        <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-on-surface font-display">Popular Searches</h2>
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

        {/* Wedding Categories */}
        <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
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

          <div className="mt-6 text-center">
            <Link href="/categories" className="inline-flex items-center gap-1.5 px-6 py-3 rounded-full bg-[#FAF7F2] border border-gold/20 text-primary font-bold text-sm hover:bg-[#F3EDE2] transition-colors shadow-sm">
              View All Categories <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </Link>
          </div>
        </section>

        {/* Sponsored Homepage Banner */}
        <AdBanner placement="Homepage Between Categories" />

        {/* ── TRENDING THIS WEEK SECTION (STANDARDIZED WITH HOMEPAGE VENDOR CARDS) ── */}
        <section className="py-12 bg-[#FAF7F2] my-8 border-y border-gold/15">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-6 flex justify-between items-end">
              <div>
                <span className="text-[11px] font-bold text-[#C6A568] uppercase tracking-wider block mb-1">
                  Verified Top Rated
                </span>
                <h2 className="text-2xl md:text-3xl font-bold text-charcoal font-display">
                  Trending This Week
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
            ) : trendingVendors.length > 0 ? (
              <div className="flex overflow-x-auto hide-scrollbar snap-x snap-mandatory gap-4 md:grid md:grid-cols-4 md:gap-6 md:overflow-visible pb-2">
                {trendingVendors.map((vendor, index) => (
                  <HomepageVendorCard
                    key={vendor.id}
                    vendor={vendor}
                    rankBadge={index + 1}
                    isTrending={true}
                  />
                ))}
              </div>
            ) : null}
          </div>
        </section>

        {/* ── SECTION A: POPULAR NEAR YOU (LOCAL CITY-FILTERED DISCOVERY) ── */}
        <PopularNearYouSection vendors={allVendors} loading={vendorsLoading} />

        {/* Digital Wedding Invitations Section */}
        <DigitalInvitationsSection />

        {/* ── SECTION B: PHOTOGRAPHERS FOR YOU ── */}
        <PhotographersForYouSection initialVendors={allVendors} />

        {/* App Banner */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-12">
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
        <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex justify-between items-end">
            <div>
              <span className="text-[11px] font-bold text-[#C6A568] uppercase tracking-wider block mb-1">
                Handpicked Excellence
              </span>
              <h2 className="text-2xl font-bold text-on-surface font-display">Featured Vendors</h2>
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
          ) : featuredVendors.length > 0 ? (
            <div className="flex overflow-x-auto hide-scrollbar snap-x snap-mandatory gap-4 md:grid md:grid-cols-4 md:gap-6 md:overflow-visible pb-2">
              {featuredVendors.map((vendor) => (
                <HomepageVendorCard key={vendor.id} vendor={vendor} />
              ))}
            </div>
          ) : (
            <div className="py-8 text-center bg-white rounded-2xl border border-gold/15 max-w-md mx-auto">
              <p className="text-xs text-charcoal/60">Explore verified boutiques and registered wedding venues.</p>
              <Link href="/boutiques" className="inline-block mt-3 bg-[#064E43] text-white text-xs font-bold px-5 py-2 rounded-full">
                Browse Directory
              </Link>
            </div>
          )}
        </section>

        {/* ── SECTION C: WEDDING PLANNING JOURNEY (USEFUL STEP-BY-STEP ROADMAP) ── */}
        <WeddingPlanningJourneySection />

        {/* ── REAL WEDDING STORIES (FETCHED LIVE FROM DATABASE) ── */}
        <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-on-surface font-display">Real Wedding Stories</h2>
            </div>
            <Link href="/real-weddings" className="text-primary text-sm font-bold hover:underline">View All Stories</Link>
          </div>

          {storiesLoading ? (
            <div className="flex overflow-x-auto hide-scrollbar gap-4 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex-shrink-0 w-80 md:w-auto h-72 rounded-2xl bg-gray-100 animate-pulse border border-gold/10" />
              ))}
            </div>
          ) : stories.length > 0 ? (
            <div className="flex overflow-x-auto hide-scrollbar gap-4 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible">
              {stories.slice(0, 3).map((story) => (
                <Link key={story.id} href={`/real-weddings/${story.slug}`} className="flex-shrink-0 w-80 md:w-auto group">
                  <div className="rounded-2xl overflow-hidden h-52 shadow-sm group-hover:shadow-md transition-all relative bg-gray-100">
                    <img 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      src={story.cover_image_url || "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80"} 
                      alt={story.title}
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80";
                      }}
                    />
                    <span className="absolute top-3 left-3 bg-[#064E43]/90 backdrop-blur-xs text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                      {story.style || "Wedding"}
                    </span>
                  </div>
                  <div className="py-4 space-y-1">
                    <div className="flex items-center justify-between text-xs text-outline">
                      <span className="flex items-center gap-1 font-semibold">
                        <MapPin className="w-3.5 h-3.5 text-[#064E43]" /> {story.city || "Kerala"}
                      </span>
                      {story.wedding_date && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-[#064E43]" /> {story.wedding_date}
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-on-surface text-base md:text-lg leading-tight font-display group-hover:text-primary transition-colors line-clamp-2">
                      {story.title}
                    </h3>
                    {story.couple_names && (
                      <p className="text-xs font-bold text-[#064E43]">{story.couple_names}</p>
                    )}
                    <p className="text-xs text-outline line-clamp-2 leading-relaxed">
                      {story.short_story || story.story_text}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            /* Honest Editorial Invitation when 0 published stories exist */
            <div className="p-8 sm:p-12 bg-white rounded-3xl border border-gold/20 shadow-md text-center max-w-2xl mx-auto space-y-4">
              <div className="w-14 h-14 rounded-full bg-[#FAF7F2] border border-gold/30 text-[#064E43] flex items-center justify-center mx-auto shadow-inner">
                <BookHeart className="w-7 h-7" />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-charcoal">
                  Share Your Real Wedding Story
                </h3>
                <p className="text-xs sm:text-sm text-charcoal/70 max-w-md mx-auto leading-relaxed">
                  Celebrate your love story on Cloche and give authentic credit to the photographers, decorators, and artisans who crafted your day.
                </p>
              </div>
              <Link
                href="/real-weddings"
                className="inline-flex items-center gap-2 bg-[#064E43] hover:bg-[#12584E] text-white text-xs font-bold px-6 py-3 rounded-full shadow-md transition-all"
              >
                <span>Submit Your Wedding</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </section>

        {/* Mobile Sticky Sponsored Banner */}
        <AdBanner placement="Mobile Sticky Banner" />

      </main>
      <Footer />
    </>
  );
}
