"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { AdBanner } from "@/components/AdBanner";
import { AutocompleteSearch } from "@/components/AutocompleteSearch";
import { Sparkles, MapPin, Calendar, BookHeart, Plus, ArrowRight, Star, Heart, Flame } from "lucide-react";
import { RealWeddingStoryDb } from "@/lib/realWeddings";

export const dynamic = "force-dynamic";

interface VendorItem {
  id: string;
  slug: string;
  name: string;
  category: string;
  categorySlug?: string;
  city: string;
  rating: number;
  reviewCount?: number;
  startingPrice: string;
  coverImage?: string;
  logo?: string;
}

export default function Home() {
  const [trendingVendors, setTrendingVendors] = useState<VendorItem[]>([]);
  const [featuredVendors, setFeaturedVendors] = useState<VendorItem[]>([]);
  const [vendorsLoading, setVendorsLoading] = useState(true);
  const [stories, setStories] = useState<RealWeddingStoryDb[]>([]);
  const [storiesLoading, setStoriesLoading] = useState(true);

  // Fetch real registered vendors & boutiques with strict deduplication
  useEffect(() => {
    async function loadVendors() {
      try {
        const res = await fetch("/api/v1/public/vendors?limit=12");
        const data = await res.json();
        let allPublicVendors: VendorItem[] = [];

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

        // Fetch fallback boutiques for unique featured section listings
        let boutiqueVendors: VendorItem[] = [];
        try {
          const bRes = await fetch("/api/boutiques");
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
        } catch (bErr) {
          console.error("Boutiques fetch error:", bErr);
        }

        // Set Trending Vendors (Top 4)
        const trending = allPublicVendors.length > 0 ? allPublicVendors.slice(0, 4) : boutiqueVendors.slice(0, 4);
        setTrendingVendors(trending);

        // Deduplicate Featured Vendors so no vendor in Trending appears in Featured
        const trendingIds = new Set(trending.map((t) => String(t.id).toLowerCase()));
        const trendingSlugs = new Set(trending.map((t) => (t.slug || "").toLowerCase()));

        const candidates = [...allPublicVendors.slice(4), ...boutiqueVendors];
        const deduplicatedFeatured = candidates.filter(
          (v) => !trendingIds.has(String(v.id).toLowerCase()) && !trendingSlugs.has((v.slug || "").toLowerCase())
        );

        setFeaturedVendors(deduplicatedFeatured.slice(0, 4));
      } catch (err) {
        console.error("Failed to fetch vendors:", err);
      } finally {
        setVendorsLoading(false);
      }
    }

    // Fetch real published real wedding stories
    async function loadStories() {
      try {
        const res = await fetch("/api/v1/public/real-weddings?limit=6");
        const data = await res.json();
        if (data.success && Array.isArray(data.stories)) {
          setStories(data.stories);
        }
      } catch (err) {
        console.error("Failed to fetch real wedding stories:", err);
      } finally {
        setStoriesLoading(false);
      }
    }

    loadVendors();
    loadStories();
  }, []);

  const popularSearches = [
    {
      label: "Photographers",
      href: "/photographers",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAhu3icOJFqvCTS0Yc-P5E3dS49T9gfcnLUGMEJUhz1FH0rWgdSyks60a9D_mvFEwxqsDf-7NZqI2xdlVSWq7JNTdhk55a9ApAXK3tSrQ0LuAKMF_ERJTfXOe_plw1o4cWStgv3avsNJmKjj0TMI7Qh58nWN7PXxcshFJWIXmlUuaJM70m2qvh9dYeyCNM8tnlyWufnjAyXgQK3b0GDo5eomlGyLjh1VFgmzxgJx1sy5BxDx8uBwxXCpuwKcZjZkw6S_C_Tyd_KWhRG",
      alt: "Wedding Photographer"
    },
    {
      label: "Invitations",
      href: "/invitations",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCZAPbI_YUAMNRWikML7wsySzfjqEypSebODZuEtNr3ZGtyb6q_i5zWAfnhu5c76vzUNisHAj9nGpYaOro-C8D97o9kwmiYH7F9MtyqUWawQPDlHBNyTreVuBhB6JViI9JhamJ_6-okzLqjL5ZZOiJHQ3NRv3MQoYMaMcZ_L3HGRmxHD6IYa08ijWYMuTk6GUN6O-U1Sd0v-2RdUFoC9DObKocGyGm_zLg5T3q3QLDST-MD3cnfXaPhxA0k8qgUQG6JrbAstOv951YD",
      alt: "Wedding Invitations"
    },
    {
      label: "Catering",
      href: "/categories/catering",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAIttErFBHy9QscHEJk0OBcJyKoRuebpySjvFYxChzwBGdF0_CkESZFpAz7RwTeD47dIGBsebzVOM7njZsd3DIrvBXKh0Fnp8TIns3bKInyycQ5URRN8M-lQ-4gHSayBikcseL_SS7X8HPen8XdGz4b5KuheFjT3QYrN64ogJ0w4iYaaTUIOq0Fqc_uA7ed6IiNT5xz4zF2hQOjD_CNhCdT_4z7AdZ6GDEucyEYoVM_oM9xqSKVyWfhHh-jbFiuepkEs-ayDg8RQRgV",
      alt: "Wedding Catering"
    },
    {
      label: "Bridal Wear",
      href: "/categories/bridal-wear",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAEsY487mYFYvQkZCNfBcXsTzh1p5Yw4tRBQd_WTibQv72oGWZf2uTN8XzzW_Gv54COfSRIcj4brm8yydAp-aU43QT-AnIhikqUubUlu0TlLArULUjbT-lGAJbiYHlcAo85I3afH1s7monPfzLPp-11EVvmfl5CIZS3nyVlGTIZbozNQFrAKpDAFyy_8giP4chciVm0kfKj8XWC_ublaoicYNcafYSjpEXCSMZlZ8MA-RdOPuD-hbUJFoC7URHDwuD1pWjOz1Po3l2D",
      alt: "Bridal Wear"
    },
    {
      label: "Venues",
      href: "/venues",
      img: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=400&auto=format&fit=crop",
      alt: "Wedding Venues"
    },
    {
      label: "Makeup",
      href: "/makeup",
      img: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=400&q=80",
      alt: "Bridal Makeup"
    },
    {
      label: "Groom Wear",
      href: "/categories/groom-wear",
      img: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=400&q=80",
      alt: "Groom Wear"
    },
    {
      label: "Decor",
      href: "/categories/decor-planning",
      img: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=400&auto=format&fit=crop",
      alt: "Wedding Decor"
    }
  ];

  const categories = [
    {
      title: "Venues",
      subtitle: "Banquet Halls, Lawns, Resorts...",
      href: "/venues",
      bgColor: "bg-[#E3EAF3]",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDwImcvhKSNtY87jO7yUWDMGtC2wvA3zoPaGIT3jcrypuyx5VXIDR6QO2_N2252Yn5fh7UP4Hvwwu15tAYkGwVd65vIRmMZtjMrCFWMR8fmdQUy9Lr9E02Dd7ULRUKFoL0rh4BvtIUHiS_LV3mbhjdbd65tgwEGVwbXIHOITSxmU6sOk1GSjoTaNsTiToKmb2IrC4YnTSN-xeFiBq02iS1bts-wz5YLu9d6jMR1jB2AXrfS23xcT9V9zsyr5iEzT4Xxkdo9VgP3trFh",
      alt: "Wedding Venues"
    },
    {
      title: "Photographers",
      subtitle: "Wedding & Pre-wedding Photography",
      href: "/photographers",
      bgColor: "bg-[#FCEFE3]",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAXFaF6d056sykk48Tz6L5q9m1bVeLNZLe9rnljhUzM9UeIMi1Px322dGknokkhTOoF8LYbSEKq71TcBIjp9sXQiWXf40yP6gfdIjBlRSZFnKgwSB3nsdN2Ss1hdte3lNz9j_p-SCXGvq0tW5DCYm6bGgqsWLnQnFYgqx_TyxehrfezZ3ci1bLZ3gmFuAfaroY0BgHbhGVP9bHx2WmeeoPm45MQYdogWmzMfGuOY-pDhvXBXeiaravjlgykew9aGeueN_nH4dBq0lJr",
      alt: "Wedding Photographers"
    },
    {
      title: "Makeup",
      subtitle: "Bridal Makeup, Hair & Family Styling",
      href: "/makeup",
      bgColor: "bg-[#F6E5E5]",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAEYzOP_1Ub5JM0qYXF-kaJm2njnRsiVDwCImcpFQaRm-QwUwmvdjYzb-ua-KBG67BZvPTxJI0DqCS6VYnthiW-FUrcIpSnXFeQaOvfDkadu6a3WJnHmCZhve8oBlJ2cI5vDhQbq4C3VLHLPbjZMS61WB93IZGpFiCVtuWSbJHdpzT3f3BY8sNllRsxJhp2UmbppTGSyo9wlK_iRiOTMP7g5fQNBm-65h4XJQXdZFi20hbgOkfTDgf_8v7QMhQLKy0Z6iWbzSxOW29p",
      alt: "Bridal Makeup"
    },
    {
      title: "Bridal Wear",
      subtitle: "Lehengas, Kanchipuram Saris & Gowns",
      href: "/categories/bridal-wear",
      bgColor: "bg-[#EAF3E3]",
      img: "https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=800&q=80",
      alt: "Bridal Wear"
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
      <main className="pb-20">
        
        {/* Hero Section */}
        <section className="relative h-[480px] md:h-[520px] w-full flex flex-col justify-end">
          <div className="absolute inset-0 overflow-hidden rounded-b-3xl">
            <div 
              className="absolute inset-0 bg-cover bg-center" 
              style={{backgroundImage: 'url(https://lh3.googleusercontent.com/aida-public/AB6AXuDkuPHXhU7sXzDUvYbDriFUJ917zikz7COlOrOswDvuY6_7v5cQOlZuew5k-nQKjcfUP1uCWfNAZ_E3pzW0ZhxB3iG_Qgee-9xeWqV3kmcxYZjS4lZH63iptxjO4EQc-c1trOo4OB45RTiLcgN_4gKPeu41g5AiHIMElHe-KXqWqvejj3L13jYUx7jf5JgJ76IE74Db2TjqXh0ocXwWUZwTja1cDHAcysRGBp85vCe6HOhaQ8V2U10qxMCfXK6vEIuyz0bq1Y5eq9PQ)'}}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent"></div>
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
        <section className="py-10 max-w-7xl mx-auto">
          <div className="px-6 mb-6">
            <h2 className="text-2xl font-bold text-on-surface font-display">Popular Searches</h2>
          </div>
          
          {/* Responsive Layout: Scrollable on mobile (< md), Full clean grid on Laptop/Desktop (>= md) */}
          <div className="flex overflow-x-auto hide-scrollbar gap-4 px-6 md:grid md:grid-cols-4 lg:grid-cols-8 md:gap-6 md:overflow-visible">
            {popularSearches.map((item) => (
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
        <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center px-2 mb-6">
            <h2 className="text-2xl font-bold text-on-surface font-display">Wedding Categories</h2>
            <Link href="/categories" className="hidden md:flex items-center gap-1 text-primary font-bold text-sm hover:underline">
              View All Categories <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </Link>
          </div>

          {/* Stacked on mobile, 2 or 3 columns grid on Laptop */}
          <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6">
            {categories.map((cat) => (
              <Link 
                key={cat.title} 
                href={cat.href} 
                className={`${cat.bgColor} rounded-2xl overflow-hidden flex h-36 md:h-44 shadow-sm hover:shadow-md transition-all group`}
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

          <Link href="/categories" className="md:hidden w-full text-center py-4 text-primary font-bold text-sm flex items-center justify-center gap-1 mt-4">
            View All Categories <span className="material-symbols-outlined text-[18px]">chevron_right</span>
          </Link>
        </section>

        {/* Sponsored Homepage Banner */}
        <AdBanner placement="Homepage Between Categories" />

        {/* ── 🔥 TRENDING THIS WEEK SECTION ── */}
        <section className="py-12 bg-[#FAF7F2] my-8 border-y border-gold/15">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-amber-100 text-amber-800 text-[11px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-amber-300">
                  <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> Live Rankings
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-charcoal font-display">
                🔥 Trending This Week
              </h2>
              <p className="text-xs md:text-sm text-charcoal/70 mt-1">
                Most engaged wedding partners based on verified user views, inquiries, and authentic reviews.
              </p>
            </div>

            {vendorsLoading ? (
              <div className="flex overflow-x-auto hide-scrollbar snap-x snap-mandatory gap-4 -mx-6 px-6 md:mx-0 md:px-0 md:grid md:grid-cols-4 md:gap-6 md:overflow-visible pb-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex-shrink-0 w-72 sm:w-[300px] md:w-auto h-72 rounded-2xl bg-gray-200/60 animate-pulse snap-start" />
                ))}
              </div>
            ) : trendingVendors.length > 0 ? (
              <div className="flex overflow-x-auto hide-scrollbar snap-x snap-mandatory gap-4 -mx-6 px-6 md:mx-0 md:px-0 md:grid md:grid-cols-4 md:gap-6 md:overflow-visible pb-2">
                {trendingVendors.map((vendor, index) => (
                  <Link
                    key={vendor.id}
                    href={`/boutiques/${vendor.slug}`}
                    className="flex-shrink-0 w-72 sm:w-[300px] md:w-auto snap-start bg-white rounded-2xl overflow-hidden shadow-xs hover:shadow-md border border-gold/15 transition-all group flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative h-48 overflow-hidden bg-gray-100">
                        <img
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          src={vendor.coverImage}
                          alt={vendor.name}
                          loading="lazy"
                        />
                        {/* Rank Badge */}
                        <div className="absolute top-3 left-3 bg-[#0F4C45] text-white text-xs font-extrabold px-3 py-1 rounded-full shadow-md flex items-center gap-1 border border-white/20">
                          <span>#{index + 1}</span>
                        </div>
                        {/* Rating Badge / New Badge */}
                        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                          {vendor.rating > 0 && (vendor.reviewCount ?? 0) > 0 ? (
                            <>
                              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                              <span className="text-xs font-bold text-charcoal">{vendor.rating.toFixed(1)}</span>
                            </>
                          ) : (
                            <span className="text-[11px] font-bold text-[#0F4C45] px-1">New</span>
                          )}
                        </div>
                      </div>

                      <div className="p-5 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-gold uppercase tracking-wider">
                            {vendor.category}
                          </span>
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                            <Flame className="w-3 h-3 text-amber-500" /> Trending
                          </span>
                        </div>
                        <h3 className="font-bold text-base md:text-lg font-display text-charcoal group-hover:text-primary transition-colors line-clamp-1">
                          {vendor.name}
                        </h3>
                        <p className="text-xs text-charcoal/60 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#0F4C45]" /> {vendor.city || "Kerala"}
                        </p>
                      </div>
                    </div>

                    <div className="px-5 pb-5 pt-2 border-t border-gold/10 flex items-center justify-between">
                      <span className="text-xs text-charcoal/50 font-medium">Starting from</span>
                      <span className="text-sm font-bold text-[#0F4C45]">{vendor.startingPrice}</span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        </section>

        {/* App Banner */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 my-12">
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

            <div className="relative z-10 hidden lg:flex flex-col items-center justify-center p-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl text-center min-w-[260px]">
              <span className="material-symbols-outlined text-6xl text-gold mb-2">qr_code_2</span>
              <p className="font-bold text-sm">Scan to Install App</p>
              <p className="text-xs text-white/70 mt-1">Available on iOS & Android</p>
            </div>
          </div>
        </section>

        {/* ── REAL FEATURED VENDORS (DEDUPLICATED & STANDARDIZED) ── */}
        <section className="py-10 max-w-7xl mx-auto">
          <div className="px-6 mb-6 flex justify-between items-end">
            <div>
              <h2 className="text-2xl font-bold text-on-surface font-display">Featured Vendors</h2>
              <p className="text-xs md:text-sm text-outline mt-1">Handpicked luxury boutiques &amp; wedding experts across Kerala</p>
            </div>
            <Link href="/boutiques" className="text-primary text-sm font-bold hover:underline">View All</Link>
          </div>

          {vendorsLoading ? (
            <div className="flex overflow-x-auto hide-scrollbar snap-x snap-mandatory gap-4 -mx-6 px-6 md:mx-0 md:px-0 md:grid md:grid-cols-4 md:gap-6 md:overflow-visible pb-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex-shrink-0 w-72 sm:w-[300px] md:w-auto h-72 rounded-2xl bg-gray-100 animate-pulse border border-gold/10 snap-start" />
              ))}
            </div>
          ) : featuredVendors.length > 0 ? (
            <div className="flex overflow-x-auto hide-scrollbar snap-x snap-mandatory gap-4 -mx-6 px-6 md:mx-0 md:px-0 md:grid md:grid-cols-4 md:gap-6 md:overflow-visible pb-2">
              {featuredVendors.map((vendor) => (
                <Link 
                  key={vendor.id} 
                  href={`/boutiques/${vendor.slug}`} 
                  className="flex-shrink-0 w-72 sm:w-[300px] md:w-auto snap-start bg-white rounded-2xl overflow-hidden shadow-xs hover:shadow-md border border-gold/15 transition-all group flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-48 overflow-hidden bg-gray-100">
                      <img 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        src={vendor.coverImage} 
                        alt={vendor.name} 
                        loading="lazy"
                      />
                      <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                        {vendor.rating > 0 && (vendor.reviewCount ?? 0) > 0 ? (
                          <>
                            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                            <span className="text-xs font-bold text-charcoal">{vendor.rating.toFixed(1)}</span>
                          </>
                        ) : (
                          <span className="text-[11px] font-bold text-[#0F4C45] px-1">New</span>
                        )}
                      </div>
                    </div>
                    <div className="p-5 space-y-2">
                      <span className="text-[11px] font-bold text-gold uppercase tracking-wider block">
                        {vendor.category}
                      </span>
                      <h3 className="font-bold text-base md:text-lg font-display text-charcoal group-hover:text-primary transition-colors line-clamp-1">
                        {vendor.name}
                      </h3>
                      <p className="text-xs text-charcoal/60 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#0F4C45]" /> {vendor.city || "Kerala"}
                      </p>
                    </div>
                  </div>
                  <div className="px-5 pb-5 pt-2 border-t border-gold/10 flex items-center justify-between">
                    <span className="text-xs text-charcoal/50 font-medium">Starting from</span>
                    <span className="text-sm font-bold text-[#0F4C45]">{vendor.startingPrice}</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="px-6 py-8 text-center bg-white rounded-2xl border border-gold/15 max-w-md mx-auto">
              <p className="text-xs text-charcoal/60">Explore verified boutiques and registered wedding venues.</p>
              <Link href="/boutiques" className="inline-block mt-3 bg-[#0F4C45] text-white text-xs font-bold px-5 py-2 rounded-full">
                Browse All Vendors
              </Link>
            </div>
          )}
        </section>

        {/* ── REAL WEDDING STORIES (FETCHED LIVE FROM DATABASE) ── */}
        <section className="py-10 max-w-7xl mx-auto">
          <div className="px-6 mb-6 flex justify-between items-end">
            <div>
              <h2 className="text-2xl font-bold text-on-surface font-display">Real Wedding Stories</h2>
              <p className="text-xs md:text-sm text-outline mt-1">Get inspired by authentic real wedding celebrations in Kerala</p>
            </div>
            <Link href="/real-weddings" className="text-primary text-sm font-bold hover:underline">View All Stories</Link>
          </div>

          {storiesLoading ? (
            <div className="flex overflow-x-auto gap-4 px-6 md:grid md:grid-cols-3 md:gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex-shrink-0 w-80 md:w-auto h-72 rounded-2xl bg-gray-100 animate-pulse border border-gold/10" />
              ))}
            </div>
          ) : stories.length > 0 ? (
            <div className="flex overflow-x-auto hide-scrollbar gap-4 px-6 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible">
              {stories.map((story) => (
                <Link key={story.id} href={`/real-weddings/${story.slug}`} className="flex-shrink-0 w-80 md:w-auto group">
                  <div className="rounded-2xl overflow-hidden h-52 shadow-sm group-hover:shadow-md transition-all relative bg-gray-100">
                    <img 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      src={story.cover_image_url} 
                      alt={story.title} 
                    />
                    <span className="absolute top-3 left-3 bg-[#0F4C45]/90 backdrop-blur-xs text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                      {story.style}
                    </span>
                  </div>
                  <div className="py-4 space-y-1">
                    <div className="flex items-center justify-between text-xs text-outline">
                      <span className="flex items-center gap-1 font-semibold">
                        <MapPin className="w-3 h-3 text-[#0F4C45]" /> {story.city || "Kerala"}
                      </span>
                      {story.wedding_date && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-[#0F4C45]" /> {story.wedding_date}
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-on-surface text-base md:text-lg leading-tight font-display group-hover:text-primary transition-colors line-clamp-2">
                      {story.title}
                    </h3>
                    {story.couple_names && (
                      <p className="text-xs font-bold text-[#0F4C45]">{story.couple_names}</p>
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
            <div className="mx-6 p-8 sm:p-12 bg-white rounded-3xl border border-gold/20 shadow-md text-center max-w-2xl lg:mx-auto space-y-4">
              <div className="w-14 h-14 rounded-full bg-[#FAF7F2] border border-gold/30 text-[#0F4C45] flex items-center justify-center mx-auto shadow-inner">
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
                className="inline-flex items-center gap-2 bg-[#0F4C45] hover:bg-[#12584E] text-white text-xs font-bold px-6 py-3 rounded-full shadow-md transition-all"
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

