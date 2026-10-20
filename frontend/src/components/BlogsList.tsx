"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useMemo } from "react";
import { Search, Clock, Calendar, ArrowRight, BookHeart, Sparkles, Filter as FilterIcon } from "lucide-react";
import { Footer } from "@/components/Footer";

type BlogPost = {
  id: string;
  title: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
  excerpt: string;
  author: string;
};

const blogPosts: BlogPost[] = [
  {
    id: "perfect-wedding-venue",
    title: "How to Choose the Perfect Luxury Heritage Wedding Venue in Kerala",
    category: "Planning",
    date: "July 28, 2026",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80",
    excerpt: "From tranquil backwater resorts to regal palace lawns, our definitive guide to securing the quintessential Kerala venue tailored to your celebration scale.",
    author: "Editorial Team",
  },
  {
    id: "bridal-fashion-trends-2026",
    title: "Top Bridal Couture & Heirloom Silk Trends of 2026",
    category: "Fashion",
    date: "July 20, 2026",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=80",
    excerpt: "Handwoven Kanchipuram revivals, antique zardozi work, and delicate contemporary silhouettes dominating this season's high-fashion weddings.",
    author: "Fashion Editor",
  },
  {
    id: "destination-wedding-checklist",
    title: "The Ultimate Backwaters Destination Wedding Checklist",
    category: "Inspiration",
    date: "July 12, 2026",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80",
    excerpt: "Logistics, guest hospitality suites, monsoon contingencies, and curated sunset cruises for an unforgettable waterfront celebration.",
    author: "Destination Specialist",
  },
  {
    id: "royal-affair-udaipur",
    title: "Real Wedding: A Majestic Palace Affair on Lake Pichola",
    category: "Real Weddings",
    date: "June 30, 2026",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=80",
    excerpt: "Inside Priya and Arjun's palace vows with bespoke regal textiles, midnight fireworks, and lakeside mandap artistry.",
    author: "Features Writer",
  },
];

const FILTERS = ["All", "Planning", "Fashion", "Inspiration", "Real Weddings"] as const;
type Filter = (typeof FILTERS)[number];

export function BlogsList() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<Filter>("All");

  const filtered = useMemo(() => {
    return blogPosts.filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(search.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(search.toLowerCase()) ||
        post.category.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = activeFilter === "All" || post.category === activeFilter;
      return matchesSearch && matchesFilter;
    });
  }, [search, activeFilter]);

  const heroPost = filtered[0] || blogPosts[0];
  const gridPosts = filtered.slice(1);

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#1A1A1A] antialiased selection:bg-[#C8A96A]/20">
      {/* Editorial Journal Masthead */}
      <section className="border-b border-[#D7C2A0]/30 bg-[#FAF9F6] pt-10 pb-8 sm:pt-14 sm:pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#D7C2A0]/25">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="h-px w-8 bg-[#C8A96A]" />
                <span className="text-[11px] font-medium tracking-[0.25em] text-[#C8A96A] uppercase">
                  Cloche Editorial Journal & Guides
                </span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#0F4C45] tracking-tight leading-[1.08] font-normal">
                Wedding Insights &amp; Style
              </h1>
              <p className="mt-3 text-sm sm:text-base text-[#4A3F35]/80 max-w-2xl font-light leading-relaxed">
                Expert planning blueprints, couture bridal fashion forecasts, and intimate destination insights curated by Cloche editors.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/real-weddings"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#C8A96A] text-[#0F4C45] bg-[#FAF9F6] text-xs font-medium tracking-wider uppercase hover:bg-[#0F4C45] hover:text-[#FAF9F6] hover:border-[#0F4C45] transition-all shadow-sm"
              >
                <BookHeart className="w-3.5 h-3.5 text-[#C8A96A]" />
                <span>Real Weddings Magazine</span>
              </Link>
            </div>
          </div>

          {/* Search & Category Filter Navigation */}
          <div className="mt-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none" style={{ WebkitOverflowScrolling: "touch" }}>
              <span className="text-[11px] tracking-widest text-[#7A6E65] uppercase font-medium mr-1 hidden sm:inline">
                Topic:
              </span>
              {FILTERS.map((f) => {
                const active = activeFilter === f;
                return (
                  <button
                    key={f}
                    onClick={() => setActiveFilter(f)}
                    className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs transition-all duration-200 border ${
                      active
                        ? "bg-[#0F4C45] text-[#FAF9F6] border-[#0F4C45] shadow-sm font-medium"
                        : "bg-white/80 text-[#4A3F35] border-[#D7C2A0]/40 hover:border-[#0F4C45] hover:bg-white"
                    }`}
                  >
                    {f}
                  </button>
                );
              })}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-[#7A6E65] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search editorial guides..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/90 border border-[#D7C2A0]/50 rounded-full text-xs text-[#1A1A1A] placeholder:text-[#7A6E65] focus:outline-none focus:border-[#0F4C45] focus:ring-1 focus:ring-[#0F4C45] transition-all"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Story Lead Article */}
      {heroPost && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="bg-white rounded-2xl border border-[#D7C2A0]/40 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
              {/* Media Block (desktop 60%) */}
              <div className="lg:col-span-7 relative min-h-[300px] sm:min-h-[420px] bg-[#1C1C17] overflow-hidden">
                <Image
                  src={heroPost.image}
                  alt={heroPost.title}
                  fill
                  priority
                  className="object-cover transition-transform duration-700 hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-[#FAF9F6]/95 backdrop-blur-sm rounded-full text-[10px] uppercase tracking-wider text-[#0F4C45] font-semibold border border-[#D7C2A0]/60">
                    Featured Editorial
                  </span>
                </div>
              </div>

              {/* Text Block (desktop 40%) */}
              <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between bg-white">
                <div>
                  <div className="flex items-center gap-3 text-xs text-[#7A6E65] mb-3">
                    <span className="font-semibold text-[#0F4C45] uppercase tracking-widest text-[10px]">
                      {heroPost.category}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#C8A96A]" />
                      {heroPost.readTime}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#C8A96A]" />
                      {heroPost.date}
                    </span>
                  </div>

                  <h2 className="font-serif text-2xl sm:text-3xl text-[#0F4C45] font-normal leading-snug">
                    <Link href={`/blogs/${heroPost.id}`} className="hover:text-[#C8A96A] transition-colors">
                      {heroPost.title}
                    </Link>
                  </h2>

                  <p className="mt-4 text-sm text-[#4A3F35]/80 font-light leading-relaxed">
                    {heroPost.excerpt}
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-[#D7C2A0]/25 flex items-center justify-between">
                  <span className="text-xs text-[#7A6E65]">By {heroPost.author}</span>
                  <Link
                    href={`/blogs/${heroPost.id}`}
                    className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#0F4C45] hover:text-[#C8A96A] transition-colors group"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Grid of Remaining Articles */}
      {gridPosts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="flex items-center justify-between mb-8 pb-3 border-b border-[#D7C2A0]/25">
            <div>
              <span className="text-[11px] font-medium tracking-[0.25em] text-[#C8A96A] uppercase">
                Curated Volumes
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#0F4C45] font-normal mt-1">
                More From the Journal
              </h2>
            </div>
            <span className="text-xs text-[#7A6E65]">{gridPosts.length} Guides Available</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {gridPosts.map((post) => (
              <article
                key={post.id}
                className="group bg-white rounded-xl border border-[#D7C2A0]/35 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col"
              >
                <Link href={`/blogs/${post.id}`} className="relative aspect-[16/10] bg-[#1C1C17] overflow-hidden block">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    loading="lazy"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-0.5 bg-[#FAF9F6]/90 backdrop-blur-sm rounded-full text-[9px] uppercase tracking-wider font-semibold text-[#0F4C45] border border-[#D7C2A0]/40">
                      {post.category}
                    </span>
                  </div>
                </Link>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-[11px] text-[#7A6E65] mb-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#C8A96A]" />
                        {post.date}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#C8A96A]" />
                        {post.readTime}
                      </span>
                    </div>

                    <h3 className="font-serif text-lg text-[#0F4C45] font-normal leading-snug group-hover:text-[#C8A96A] transition-colors">
                      <Link href={`/blogs/${post.id}`}>{post.title}</Link>
                    </h3>

                    <p className="mt-2.5 text-xs text-[#4A3F35]/75 font-light leading-relaxed line-clamp-2">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-[#D7C2A0]/20 flex items-center justify-between">
                    <span className="text-[11px] text-[#7A6E65]">By {post.author}</span>
                    <Link
                      href={`/blogs/${post.id}`}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-[#0F4C45] group-hover:text-[#C8A96A] transition-colors"
                    >
                      <span>Read Story</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Discovery Call-to-Action to Real Kerala Weddings */}
      <section className="bg-[#0F4C45] text-[#FAF9F6] py-14 border-t border-[#D7C2A0]/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF9F6]/10 border border-[#C8A96A]/40 text-[#C8A96A] text-xs uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Living Wedding Portfolio</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal leading-tight">
            Immerse Yourself in Real Kerala Celebrations
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#FAF9F6]/80 max-w-2xl mx-auto font-light leading-relaxed">
            Discover authentic celebrations curated with verified vendor credits, direct boutique connections, and real love stories.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/real-weddings"
              className="px-6 py-3 rounded-full bg-[#C8A96A] text-[#0F4C45] font-semibold text-xs tracking-wider uppercase hover:bg-white transition-all shadow-md"
            >
              Explore Real Weddings
            </Link>
            <Link
              href="/vendors"
              className="px-6 py-3 rounded-full border border-[#D7C2A0]/40 text-[#FAF9F6] font-medium text-xs tracking-wider uppercase hover:bg-white/10 transition-all"
            >
              Browse Verified Artisans
            </Link>
          </div>
        </div>
      </section>

      {/* Consistent Luxury Footer */}
      <Footer />
    </div>
  );
}
