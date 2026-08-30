"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { AdBanner } from "@/components/AdBanner";
import { AutocompleteSearch } from "@/components/AutocompleteSearch";
import { DigitalInvitationsSection } from "@/components/DigitalInvitationsSection";
import { WhyChooseClocheSection } from "@/components/homepage/WhyChooseClocheSection";
import { TrendingVendorsSection, TrendingVendor } from "@/components/homepage/TrendingVendorsSection";
import { FeaturedVendorsSection } from "@/components/homepage/FeaturedVendorsSection";
import { WeddingInspirationSection } from "@/components/homepage/WeddingInspirationSection";
import { CuratedShopSection } from "@/components/homepage/CuratedShopSection";
import { RealWeddingsHighlightSection } from "@/components/homepage/RealWeddingsHighlightSection";
import { PlanningToolsSection } from "@/components/homepage/PlanningToolsSection";
import { DealsOffersSection } from "@/components/homepage/DealsOffersSection";
import { MobileAppDownloadSection } from "@/components/homepage/MobileAppDownloadSection";
import { SuccessStoriesSection } from "@/components/homepage/SuccessStoriesSection";
import { Sparkles, ArrowRight } from "lucide-react";
import { HOMEPAGE_CATEGORY_STRIP, CANONICAL_VENDOR_CATEGORIES } from "@/lib/categories";

export const dynamic = "force-dynamic";

export default function Home() {
  const [trendingVendors, setTrendingVendors] = useState<TrendingVendor[]>([]);

  useEffect(() => {
    async function loadVendors() {
      try {
        const res = await fetch("/api/v1/public/vendors?limit=8");
        const data = await res.json();

        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          const mapped: TrendingVendor[] = data.data.map((v: any, idx: number) => ({
            id: v.id,
            slug: v.slug || v.id,
            name: v.name || "Verified Vendor",
            category: v.category || "Wedding Expert",
            city: v.city || "Kerala",
            rating: Number(v.rating || 4.8),
            reviewCount: Number(v.reviewCount || 45),
            startingPrice: v.startingPrice || "Contact for pricing",
            coverImage:
              v.coverImage ||
              v.logo ||
              "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
            responseTime: "< 1 hr response",
            tagline: "Curated premium wedding specialization & luxury service",
            isVerified: true,
            isTrending: true,
            adminBadge: idx % 4 === 0 ? "Editor's Choice" : idx % 4 === 1 ? "Trending" : idx % 4 === 2 ? "Premium" : "Featured",
          }));
          setTrendingVendors(mapped);
        }
      } catch (err) {
        console.error("Failed to fetch homepage vendors:", err);
      }
    }

    loadVendors();
  }, []);

  return (
    <>
      <main className="min-h-screen bg-[#FAF7F2] text-[#2B2B2B]">
        
        {/* ── SECTION 1 — HERO ── */}
        <div className="relative min-h-[580px] sm:min-h-[640px] flex items-center justify-center bg-charcoal overflow-hidden pt-12 pb-16">
          {/* Hero Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2000&q=85"
              alt="Cloche Luxury Wedding Backdrop"
              fill
              priority
              quality={90}
              className="object-cover object-center opacity-40 scale-105 transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-charcoal/80 via-transparent to-charcoal/80" />
          </div>

          {/* Hero Content Overlay */}
          <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6">
            
            {/* Seasonal Tag Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-gold/30 text-gold text-xs font-bold uppercase tracking-widest shadow-md">
              <Sparkles className="w-3.5 h-3.5 text-gold" />
              <span>Wedding Season 2026 • Kerala's Premier Luxury Platform</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-ivory tracking-tight leading-tight">
              Find Everything For Your <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-gold via-amber-200 to-gold bg-clip-text text-transparent">
                Dream Wedding
              </span>
            </h1>

            <p className="text-sm sm:text-base text-white/80 max-w-2xl mx-auto font-sans font-light leading-relaxed">
              Discover vetted photographers, luxury venues, bridal boutiques, and custom digital invitations across Kerala.
            </p>

            {/* Primary Search CTA with Autocomplete & Recent Searches */}
            <div className="max-w-2xl mx-auto pt-2">
              <AutocompleteSearch
                placeholder="Search for photographers, venues, makeup artists, or boutiques..."
                className="shadow-2xl"
                inputClassName="py-4 text-base rounded-full shadow-lg"
              />
            </div>

            {/* SECTION 2 — POPULAR SEARCHES STRIP */}
            <div className="pt-6">
              <span className="text-xs text-white/60 font-semibold tracking-wider uppercase block mb-3">
                Popular Searches Strip
              </span>
              <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
                {HOMEPAGE_CATEGORY_STRIP.slice(0, 6).map((cat) => (
                  <Link
                    key={cat.label}
                    href={cat.href}
                    className="group relative px-4 py-2 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-md border border-gold/20 text-white text-xs font-semibold transition-all hover:scale-105 flex items-center gap-2 shadow-xs"
                  >
                    <span>{cat.label}</span>
                    {cat.vendorCount && (
                      <span className="text-[10px] text-gold font-bold bg-black/30 px-1.5 py-0.5 rounded-full">
                        {cat.vendorCount}
                      </span>
                    )}
                    {cat.badge && (
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    )}
                  </Link>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Promotional Top Ad Banner */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <AdBanner placement="homepage_top" position="homepage_top" />
        </div>

        {/* ── SECTION 3 — WEDDING CATEGORIES GRID ── */}
        <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-8">
            <div>
              <span className="text-xs font-semibold tracking-widest uppercase text-[#A97B3E]">
                Explore Directory
              </span>
              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0F4C45] tracking-tight mt-1">
                Wedding Categories
              </h2>
            </div>
            <Link
              href="/categories"
              className="text-xs sm:text-sm font-bold text-[#0F4C45] hover:text-[#A97B3E] transition-colors flex items-center gap-1 group"
            >
              <span>View All Categories</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {CANONICAL_VENDOR_CATEGORIES.slice(0, 8).map((cat, idx) => {
              const Icon = cat.icon;
              const matchingStrip = HOMEPAGE_CATEGORY_STRIP.find(
                (s) => s.label.toLowerCase().includes(cat.title.toLowerCase()) || cat.title.toLowerCase().includes(s.label.toLowerCase())
              );
              const vendorCount = matchingStrip?.vendorCount || "200+ Vendors";
              const isMostBooked = idx === 0 || idx === 3;

              return (
                <Link
                  key={cat.slug}
                  href={`/categories/${cat.slug}`}
                  className="group relative bg-white rounded-3xl p-5 border border-[#EBE4D8] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1.5"
                >
                  {/* Category Image Header */}
                  <div className="relative h-36 w-full rounded-2xl overflow-hidden mb-4 bg-gray-100">
                    <img
                      src={cat.image}
                      alt={cat.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    
                    {/* Badge */}
                    <div className="absolute top-2.5 left-2.5 z-10 flex gap-1">
                      {isMostBooked && (
                        <span className="bg-[#0F4C45] text-white text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm">
                          Most Booked
                        </span>
                      )}
                    </div>

                    <div className="absolute bottom-2.5 left-2.5 z-10 text-white font-bold text-xs flex items-center gap-1.5">
                      <div className="w-6 h-6 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center">
                        <Icon className="w-3.5 h-3.5 text-white" />
                      </div>
                      <span>{vendorCount}</span>
                    </div>
                  </div>

                  {/* Card Meta */}
                  <div className="space-y-1">
                    <h3 className="font-display font-bold text-base text-[#0F4C45] group-hover:text-[#A97B3E] transition-colors">
                      {cat.title}
                    </h3>
                    <p className="text-xs text-[#7A776E] line-clamp-2 leading-relaxed">
                      {cat.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#EBE4D8]/60 mt-3 flex items-center justify-between text-xs font-bold text-[#0F4C45] group-hover:text-[#A97B3E]">
                    <span>Explore</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* ── NEW SECTION 1 — WHY CHOOSE CLOCHE (TRUST CARDS) ── */}
        <WhyChooseClocheSection />

        {/* ── SECTION 4 — TRENDING VENDORS ── */}
        <TrendingVendorsSection initialVendors={trendingVendors} />

        {/* ── SECTION 5 — FEATURED VENDORS ── */}
        <FeaturedVendorsSection />

        {/* ── SECTION 6 — DIGITAL INVITATIONS ── */}
        <DigitalInvitationsSection />

        {/* ── NEW SECTION 2 — WEDDING INSPIRATION GALLERY ── */}
        <WeddingInspirationSection />

        {/* ── SECTION 7 — WEDDING SHOP ── */}
        <CuratedShopSection />

        {/* ── NEW SECTION 3 — REAL WEDDINGS TRUST HIGHLIGHT ── */}
        <RealWeddingsHighlightSection />

        {/* ── SECTION 8 — WEDDING PLANNING TOOLS ── */}
        <PlanningToolsSection />

        {/* ── SECTION 9 — DEALS & OFFERS ── */}
        <DealsOffersSection />

        {/* ── SECTION 10 — DOWNLOAD APP STRIP ── */}
        <MobileAppDownloadSection />

        {/* ── SECTION 11 — SUCCESS STORIES & TESTIMONIALS ── */}
        <SuccessStoriesSection />

        {/* Mobile Sticky Sponsored Banner */}
        <AdBanner placement="Mobile Sticky Banner" position="Mobile Sticky Banner" />

      </main>

      {/* ── SECTION 12 — LUXURY FOOTER ── */}
      <Footer />
    </>
  );
}
