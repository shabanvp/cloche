"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Heart, Eye, Share2, Search, MapPin, 
  Calendar, ArrowRight, BookHeart, Plus, Loader2,
  ChevronRight, ChevronLeft, Sparkles, CheckCircle2,
  SlidersHorizontal, ArrowUpRight, BookOpen
} from "lucide-react";
import { SubmitWeddingModal } from "@/components/SubmitWeddingModal";
import { Footer } from "@/components/Footer";
import { RealWeddingStoryDb, VendorCreditItem, KERALA_REAL_WEDDING_STORIES } from "@/lib/realWeddingsData";

const STYLES_FILTER = [
  "All Curations",
  "Traditional Kerala",
  "Royal & Heritage",
  "Destination Wedding",
  "Beach & Waterfront",
  "Minimalist & Contemporary",
  "Luxury Grandeur",
  "Garden & Outdoor",
];

// Curated Category Inspiration Collections with verified cover photos
const INSPIRATION_COLLECTIONS = [
  {
    title: "Bridal Couture & Silks",
    subtitle: "Kanchipuram, Zardozi & Lehengas",
    href: "/categories/bridal-studio",
    image: "/images/bridal-studio-cover.png",
    tag: "Bridal Studio"
  },
  {
    title: "Bespoke Groom Styling",
    subtitle: "Sherwanis, Tuxedos & Bandhgalas",
    href: "/categories/groom-studio",
    image: "/images/groom-wear-cover.png",
    tag: "Groom Studio"
  },
  {
    title: "Heritage Venues & Palaces",
    subtitle: "Waterfront Lawns, Resorts & Island Halls",
    href: "/categories/venues",
    image: "/images/venues-cover.png",
    tag: "Venues"
  },
  {
    title: "Floral Decor & Scenography",
    subtitle: "Mandaps, Botanical Aisles & Ambient Lights",
    href: "/categories/decor-planning",
    image: "/images/decor-planning-cover.png",
    tag: "Decor & Planning"
  },
  {
    title: "Cinematography & Portraits",
    subtitle: "Candid Moments, 4K Teasers & Films",
    href: "/categories/photographers",
    image: "/images/photographers-cover.png",
    tag: "Photographers"
  },
  {
    title: "Heirloom Bridal Jewellery",
    subtitle: "Kundan Chokers, Polki & Temple Gold",
    href: "/categories/jewellery",
    image: "/images/jewellery-cover.png",
    tag: "Jewellery"
  }
];

// Editorial Guides (Blog Articles)
const EDITORIAL_GUIDES = [
  {
    id: "perfect-wedding-venue",
    title: "How to Choose the Perfect Wedding Venue in Kerala",
    category: "Venue Planning",
    readTime: "5 min read",
    image: "/images/venues-cover.png",
    date: "July 28, 2026",
    excerpt: "From backwater waterfronts to heritage palace courtyards, our definitive guide to capacity, monsoon contingencies, and catering permits."
  },
  {
    id: "bridal-fashion-trends-2026",
    title: "Top Bridal Fashion Trends Shaping 2026 Celebrations",
    category: "Couture Trends",
    readTime: "4 min read",
    image: "/images/bridal-studio-cover.png",
    date: "July 20, 2026",
    excerpt: "The renaissance of handwoven raw silk, dramatic veil capes, and personalized zardozi embroidery detailing the couple's history."
  },
  {
    id: "destination-wedding-checklist",
    title: "The Essential Destination Wedding Planning Checklist",
    category: "Logistics",
    readTime: "6 min read",
    image: "/images/wedding-studio-cover.png",
    date: "July 12, 2026",
    excerpt: "Mastering outstation guest hospitality, welcome kits, local artisan coordination, and multi-day itinerary flow without stress."
  },
  {
    id: "royal-affair-udaipur",
    title: "Scenography & Mandap Design: Contemporary Floral Notes",
    category: "Floral Design",
    readTime: "7 min read",
    image: "/images/decor-planning-cover.png",
    date: "June 30, 2026",
    excerpt: "Balancing local Kerala jasmine and marigolds with exotic pastel blooms for ethereal dusk ceremonies that photograph magnificently."
  }
];

export function RealWeddingsFeed() {
  const [stories, setStories] = useState<RealWeddingStoryDb[]>(KERALA_REAL_WEDDING_STORIES);
  const [loading, setLoading] = useState(false);
  const [filterStyle, setFilterStyle] = useState<string>("All Curations");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<"newest" | "popular" | "views">("newest");
  const [likedSlugs, setLikedSlugs] = useState<Set<string>>(new Set());
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState<number>(3);
  const [copyToast, setCopyToast] = useState<string | null>(null);

  const categoriesScrollRef = useRef<HTMLDivElement>(null);

  // Fetch published stories from API
  const fetchStories = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (filterStyle !== "All Curations" && filterStyle !== "All") {
        params.set("style", filterStyle);
      }
      if (searchQuery.trim()) {
        params.set("search", searchQuery.trim());
      }
      params.set("sortBy", sortBy);
      params.set("limit", "50");

      const res = await fetch(`/api/v1/public/real-weddings?${params.toString()}`);
      const data = await res.json();

      if (data.success && Array.isArray(data.stories) && data.stories.length > 0) {
        setStories(data.stories);
      } else if (!searchQuery.trim() && (filterStyle === "All Curations" || filterStyle === "All")) {
        setStories(KERALA_REAL_WEDDING_STORIES);
      } else if (data.success && Array.isArray(data.stories)) {
        setStories(data.stories);
      }
    } catch (err) {
      console.error("Failed to load real wedding stories:", err);
    }
  }, [filterStyle, searchQuery, sortBy]);

  useEffect(() => {
    fetchStories();
  }, [fetchStories]);

  // Reset pagination when filter or search changes
  useEffect(() => {
    setVisibleCount(3);
  }, [filterStyle, searchQuery, sortBy]);

  // Real Like Toggle Action
  const handleLikeToggle = async (slug: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const isCurrentlyLiked = likedSlugs.has(slug);
    const newLiked = !isCurrentlyLiked;

    // Optimistic UI update
    setLikedSlugs((prev) => {
      const next = new Set(prev);
      if (isCurrentlyLiked) next.delete(slug);
      else next.add(slug);
      return next;
    });

    setStories((prev) =>
      prev.map((s) =>
        s.slug === slug
          ? { ...s, like_count: Math.max(0, s.like_count + (newLiked ? 1 : -1)) }
          : s
      )
    );

    try {
      await fetch(`/api/v1/public/real-weddings/${encodeURIComponent(slug)}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ increment: newLiked }),
      });
    } catch (err) {
      console.error("Failed to update like count:", err);
    }
  };

  // Share story helper
  const handleShare = (story: RealWeddingStoryDb, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/real-weddings/${story.slug}`;
    if (navigator.share) {
      navigator.share({
        title: story.title,
        text: `Explore this real wedding story on Cloche: ${story.title}`,
        url,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url);
      setCopyToast("Story link copied to clipboard");
      setTimeout(() => setCopyToast(null), 3000);
    }
  };

  // Scroll categories horizontal helper
  const handleScrollCategories = (direction: "left" | "right") => {
    if (categoriesScrollRef.current) {
      const amount = direction === "left" ? -240 : 240;
      categoriesScrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
    }
  };

  // Featured Story (first featured or first story)
  const heroStory = useMemo(() => {
    if (stories.length === 0) return null;
    const explicitlyFeatured = stories.find((s) => s.is_featured);
    return explicitlyFeatured || stories[0];
  }, [stories]);

  // Grid stories (all stories except the heroStory to prevent duplicate card)
  const gridStories = useMemo(() => {
    if (!heroStory) return stories;
    return stories.filter((s) => s.id !== heroStory.id);
  }, [stories, heroStory]);

  // Paginated visible grid stories
  const visibleGridStories = useMemo(() => {
    return gridStories.slice(0, visibleCount);
  }, [gridStories, visibleCount]);

  const hasMore = visibleCount < gridStories.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 6, gridStories.length));
  };

  // Extract all authentic featured vendors credited across stories
  const featuredArtisans = useMemo(() => {
    const seen = new Set<string>();
    const list: VendorCreditItem[] = [];

    for (const story of stories) {
      if (Array.isArray(story.vendor_credits)) {
        for (const vc of story.vendor_credits) {
          const key = (vc.business_name || vc.vendor_id || "").toLowerCase().trim();
          if (key && !seen.has(key)) {
            seen.add(key);
            list.push(vc);
          }
        }
      }
    }
    return list.slice(0, 10);
  }, [stories]);

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#2B2B2B] flex flex-col font-sans selection:bg-[#C8A96A]/20 selection:text-[#0F4C45]">
      
      {/* Toast notification */}
      {copyToast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-[#0F4C45] text-white text-xs font-semibold px-5 py-2.5 rounded-full shadow-lg border border-[#C8A96A]/40 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-300">
          <CheckCircle2 className="w-4 h-4 text-[#C8A96A]" />
          <span>{copyToast}</span>
        </div>
      )}

      {/* 1. EDITORIAL HEADER & MASTHEAD */}
      <section className="border-b border-[#D7C2A0]/30 bg-gradient-to-b from-[#FAF7F2] to-[#FAF9F6] pt-12 pb-10 px-4 sm:px-6 lg:px-12">
        <div className="max-w-7xl mx-auto space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-2">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2 text-[11px] font-bold tracking-[0.25em] uppercase text-[#0F4C45]">
                <Sparkles className="w-3.5 h-3.5 text-[#C8A96A]" />
                <span>The Cloche Magazine • Volume IV</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#1C1C17] tracking-tight leading-[1.1]">
                Real Weddings & Editorial
              </h1>
              <p className="text-sm sm:text-base text-[#494740] font-light leading-relaxed">
                Curated love stories, authentic ceremonies, and the verified artisans who brought each dream celebration to life across Kerala and destination sanctuaries.
              </p>
            </div>

            {/* Submit Story Action */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => setIsSubmitModalOpen(true)}
                className="inline-flex items-center gap-2 bg-[#0F4C45] hover:bg-[#155E56] text-white px-5 py-2.5 rounded-full font-medium text-xs tracking-wider uppercase transition-all shadow-xs hover:shadow-md cursor-pointer border border-[#0F4C45]"
              >
                <Plus className="w-4 h-4 text-[#C8A96A]" />
                <span>Submit Celebration</span>
              </button>
            </div>
          </div>

          {/* Search, Filter & Sort Controls */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-4 border-t border-[#D7C2A0]/25">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A776E]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search weddings by couple, city, or style..."
                className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white text-xs text-[#1C1C17] placeholder-[#7A776E] border border-[#D7C2A0]/40 focus:outline-none focus:ring-2 focus:ring-[#0F4C45]/20 focus:border-[#0F4C45] transition-all shadow-2xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-[#7A776E] hover:text-[#1C1C17]"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Sort & Stats */}
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#0F4C45]" />
                <span className="text-[#494740] font-medium hidden sm:inline">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-white border border-[#D7C2A0]/40 rounded-full px-3 py-1.5 text-xs text-[#1C1C17] focus:outline-none focus:border-[#0F4C45] cursor-pointer shadow-2xs"
                >
                  <option value="newest">Latest Celebrations</option>
                  <option value="popular">Most Loved</option>
                  <option value="views">Most Viewed</option>
                </select>
              </div>

              <div className="h-4 w-px bg-[#D7C2A0]/40 hidden sm:block" />

              <span className="text-[#7A776E] font-medium text-[11px] uppercase tracking-wider">
                {stories.length} {stories.length === 1 ? "Story" : "Stories"}
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* 2. HORIZONTALLY SCROLLABLE STORY CATEGORIES */}
      <section className="border-b border-[#D7C2A0]/20 bg-[#FAF9F6] sticky top-16 z-30 backdrop-blur-md bg-[#FAF9F6]/95 py-3 px-4 sm:px-6 lg:px-12">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          
          <button
            onClick={() => handleScrollCategories("left")}
            className="hidden md:flex items-center justify-center w-8 h-8 rounded-full border border-[#D7C2A0]/40 text-[#494740] hover:text-[#0F4C45] hover:bg-white transition-all shrink-0 cursor-pointer"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div
            ref={categoriesScrollRef}
            className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1 scroll-smooth w-full"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {STYLES_FILTER.map((style) => {
              const isActive = filterStyle === style;
              return (
                <button
                  key={style}
                  onClick={() => setFilterStyle(style)}
                  className={`shrink-0 px-4 py-1.5 rounded-full text-xs transition-all duration-200 cursor-pointer font-medium ${
                    isActive
                      ? "bg-[#0F4C45] text-white shadow-xs border border-[#0F4C45]"
                      : "bg-white text-[#494740] hover:text-[#0F4C45] hover:bg-[#F3EFE6] border border-[#D7C2A0]/35"
                  }`}
                >
                  {style}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => handleScrollCategories("right")}
            className="hidden md:flex items-center justify-center w-8 h-8 rounded-full border border-[#D7C2A0]/40 text-[#494740] hover:text-[#0F4C45] hover:bg-white transition-all shrink-0 cursor-pointer"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

        </div>
      </section>

      {/* 3. MAIN EDITORIAL CONTENT: HERO FEATURED STORY & STORIES GRID */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-10 space-y-16 flex-1">
        
        {loading ? (
          <div className="text-center py-28 space-y-4">
            <Loader2 className="w-8 h-8 animate-spin text-[#0F4C45] mx-auto" />
            <p className="text-xs font-bold text-[#7A776E] uppercase tracking-widest">
              Curating Wedding Stories...
            </p>
          </div>
        ) : stories.length === 0 ? (
          /* HONEST EMPTY STATE */
          <div className="bg-white rounded-3xl border border-[#D7C2A0]/40 shadow-xs p-10 sm:p-16 text-center max-w-2xl mx-auto space-y-6">
            <div className="w-16 h-16 rounded-full bg-[#FAF7F2] border border-[#D7C2A0]/40 text-[#0F4C45] flex items-center justify-center mx-auto">
              <BookHeart className="w-8 h-8 text-[#C8A96A]" />
            </div>
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#0F4C45] bg-[#FAF7F2] px-3.5 py-1 rounded-full border border-[#D7C2A0]/30 inline-block">
                BE THE FIRST TO BE FEATURED
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#1C1C17] font-normal">
                No Celebrations Found
              </h2>
              <p className="text-xs sm:text-sm text-[#494740] font-light leading-relaxed max-w-md mx-auto">
                {searchQuery || filterStyle !== "All Curations"
                  ? "No stories match your current filter criteria. Try resetting the filters or submit your own wedding story."
                  : "Our Real Weddings showcase celebrates authentic celebrations and credits the verified creators behind them."}
              </p>
            </div>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              {(searchQuery || filterStyle !== "All Curations") && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setFilterStyle("All Curations");
                  }}
                  className="px-6 py-2.5 rounded-full text-xs font-medium text-[#0F4C45] border border-[#0F4C45]/30 hover:bg-[#0F4C45]/5 transition-all"
                >
                  Reset Filters
                </button>
              )}
              <button
                onClick={() => setIsSubmitModalOpen(true)}
                className="bg-[#0F4C45] hover:bg-[#155E56] text-white px-7 py-2.5 rounded-full font-medium text-xs uppercase tracking-wider transition-all shadow-xs cursor-pointer inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4 text-[#C8A96A]" />
                <span>Submit Your Wedding</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-16">
            
            {/* 4. FEATURED COVER STORY (60% IMAGE / 40% CONTENT DESKTOP LAYOUT) */}
            {heroStory && (
              <section aria-labelledby="featured-story-title">
                <div className="mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#C8A96A]" />
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#0F4C45]">
                    Editorial Cover Feature
                  </span>
                </div>

                <div className="bg-white rounded-2xl md:rounded-3xl border border-[#D7C2A0]/40 shadow-xs overflow-hidden grid grid-cols-1 lg:grid-cols-12 transition-all">
                  
                  {/* Image (~60% Desktop: col-span-7 or col-span-8) */}
                  <div className="lg:col-span-7 xl:col-span-8 relative min-h-[320px] sm:min-h-[440px] lg:min-h-[500px] bg-[#1C1C17] overflow-hidden group">
                    <img
                      src={heroStory.cover_image_url}
                      alt={heroStory.title}
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700"
                      loading="eager"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent lg:hidden" />
                    
                    {/* Top overlay badge */}
                    <div className="absolute top-4 left-4 flex items-center gap-2">
                      <span className="bg-[#0F4C45]/90 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-white/20">
                        {heroStory.style}
                      </span>
                    </div>

                    {/* Mobile bottom title overlay */}
                    <div className="absolute bottom-4 left-4 right-4 text-white lg:hidden space-y-1">
                      {heroStory.couple_names && (
                        <p className="text-xs font-semibold text-[#D7C2A0]">{heroStory.couple_names}</p>
                      )}
                      <h2 className="font-serif text-xl sm:text-2xl font-normal leading-snug drop-shadow-sm">
                        {heroStory.title}
                      </h2>
                    </div>
                  </div>

                  {/* Content (~40% Desktop: col-span-5 or col-span-4) */}
                  <div className="lg:col-span-5 xl:col-span-4 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6 bg-[#FAF9F6]/40">
                    
                    <div className="space-y-4">
                      {/* Top metadata row */}
                      <div className="flex items-center justify-between text-xs text-[#7A776E] border-b border-[#D7C2A0]/25 pb-3">
                        <span className="bg-[#FAF7F2] text-[#0F4C45] font-semibold text-[11px] uppercase tracking-wider px-3 py-1 rounded-full border border-[#D7C2A0]/30 hidden lg:inline-block">
                          {heroStory.style}
                        </span>

                        <div className="flex items-center gap-4 text-xs text-[#494740]">
                          <span className="flex items-center gap-1.5" title="Story views">
                            <Eye className="w-3.5 h-3.5 text-[#7A776E]" />
                            <span>{heroStory.view_count.toLocaleString("en-IN")}</span>
                          </span>

                          <button
                            onClick={(e) => handleLikeToggle(heroStory.slug, e)}
                            className="flex items-center gap-1.5 cursor-pointer hover:text-red-600 transition-colors"
                            aria-label="Like story"
                          >
                            <Heart className={`w-3.5 h-3.5 ${likedSlugs.has(heroStory.slug) ? "text-red-600 fill-red-600" : "text-[#7A776E]"}`} />
                            <span>{heroStory.like_count.toLocaleString("en-IN")}</span>
                          </button>
                        </div>
                      </div>

                      {/* Desktop Title & Couple Names */}
                      <div className="hidden lg:block space-y-2">
                        {heroStory.couple_names && (
                          <p className="text-xs font-semibold tracking-wider uppercase text-[#0F4C45]">
                            {heroStory.couple_names}
                          </p>
                        )}
                        <h2 id="featured-story-title" className="font-serif text-2xl xl:text-3xl font-normal text-[#1C1C17] leading-tight">
                          {heroStory.title}
                        </h2>
                      </div>

                      {/* Location & Wedding Date */}
                      <div className="flex flex-wrap items-center gap-4 text-xs text-[#494740]">
                        {heroStory.city && (
                          <span className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-[#0F4C45]" />
                            <span>{heroStory.city}</span>
                          </span>
                        )}
                        {heroStory.wedding_date && (
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-[#0F4C45]" />
                            <span>{heroStory.wedding_date}</span>
                          </span>
                        )}
                      </div>

                      {/* Short Description */}
                      <p className="text-xs sm:text-sm text-[#494740] font-light leading-relaxed line-clamp-4">
                        {heroStory.short_story || heroStory.story_text}
                      </p>

                      {/* Tagged Verified Artisans */}
                      {heroStory.vendor_credits && heroStory.vendor_credits.length > 0 && (
                        <div className="pt-2 border-t border-[#D7C2A0]/20 space-y-2">
                          <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#0F4C45] block">
                            Featured Creators & Venues:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {heroStory.vendor_credits.slice(0, 4).map((vc, i) => (
                              <Link
                                key={i}
                                href={`/boutiques/${vc.slug || vc.vendor_id}`}
                                className="bg-white hover:bg-[#0F4C45] hover:text-white border border-[#D7C2A0]/30 text-[10px] font-medium text-[#494740] px-2.5 py-1 rounded-md transition-colors inline-flex items-center gap-1"
                              >
                                <span className="text-[#0F4C45] group-hover:text-white font-semibold">{vc.role}:</span>
                                <span>{vc.business_name || "Verified Artisan"}</span>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Bottom CTA & Share */}
                    <div className="flex items-center justify-between pt-4 border-t border-[#D7C2A0]/25">
                      <Link
                        href={`/real-weddings/${heroStory.slug}`}
                        className="inline-flex items-center gap-2 bg-[#0F4C45] hover:bg-[#155E56] text-white text-xs font-medium px-6 py-3 rounded-full transition-all shadow-xs hover:shadow-md"
                      >
                        <span>Read Full Story</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#C8A96A]" />
                      </Link>

                      <button
                        onClick={(e) => handleShare(heroStory, e)}
                        className="p-2.5 rounded-full border border-[#D7C2A0]/40 text-[#494740] hover:text-[#0F4C45] hover:bg-white transition-all cursor-pointer"
                        title="Share celebration story"
                        aria-label="Share story"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>

                  </div>

                </div>
              </section>
            )}

            {/* 5. RESPONSIVE EDITORIAL STORIES GRID */}
            {gridStories.length > 0 && (
              <section className="space-y-8" aria-label="Wedding Stories Collection">
                
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[#D7C2A0]/30 pb-4">
                  <div>
                    <h3 className="font-serif text-2xl sm:text-3xl text-[#1C1C17] font-normal">
                      Curated Celebrations
                    </h3>
                    <p className="text-xs text-[#494740] font-light mt-1">
                      Inspiring wedding celebrations documented across intimate temples, royal ballrooms & coastal cliffs.
                    </p>
                  </div>
                  <span className="text-xs text-[#7A776E] font-medium">
                    Showing {visibleGridStories.length} of {gridStories.length} {gridStories.length === 1 ? "Story" : "Stories"}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                  {visibleGridStories.map((story) => (
                    <article
                      key={story.id}
                      className="bg-white rounded-2xl border border-[#D7C2A0]/35 shadow-2xs overflow-hidden flex flex-col justify-between group hover:shadow-md hover:border-[#D7C2A0]/60 transition-all duration-300"
                    >
                      <div>
                        {/* Cover Image */}
                        <Link href={`/real-weddings/${story.slug}`} className="block relative aspect-[16/10] bg-[#1C1C17] overflow-hidden">
                          <img
                            src={story.cover_image_url}
                            alt={story.title}
                            className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500"
                            loading="lazy"
                          />
                          <span className="absolute top-3 left-3 bg-[#0F4C45]/90 backdrop-blur-xs text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-white/20">
                            {story.style}
                          </span>
                        </Link>

                        {/* Card Body */}
                        <div className="p-5 sm:p-6 space-y-3">
                          
                          {/* City & Engagements */}
                          <div className="flex items-center justify-between text-xs text-[#7A776E]">
                            <span className="flex items-center gap-1 font-medium text-[#494740]">
                              <MapPin className="w-3.5 h-3.5 text-[#0F4C45]" />
                              <span>{story.city || "Kerala, India"}</span>
                            </span>

                            <div className="flex items-center gap-3">
                              <span className="flex items-center gap-1 text-[11px]" title="Views">
                                <Eye className="w-3 h-3 text-[#7A776E]" />
                                <span>{story.view_count}</span>
                              </span>
                              <button
                                onClick={(e) => handleLikeToggle(story.slug, e)}
                                className="flex items-center gap-1 cursor-pointer hover:text-red-600 transition-colors"
                                aria-label="Like story"
                              >
                                <Heart className={`w-3.5 h-3.5 ${likedSlugs.has(story.slug) ? "text-red-600 fill-red-600" : "text-[#7A776E]"}`} />
                                <span className="text-[11px]">{story.like_count}</span>
                              </button>
                            </div>
                          </div>

                          {/* Couple Names */}
                          {story.couple_names && (
                            <p className="text-[11px] font-bold uppercase tracking-wider text-[#0F4C45]">
                              {story.couple_names}
                            </p>
                          )}

                          {/* Story Title */}
                          <Link href={`/real-weddings/${story.slug}`}>
                            <h4 className="font-serif text-lg sm:text-xl font-normal text-[#1C1C17] group-hover:text-[#0F4C45] transition-colors leading-snug line-clamp-2">
                              {story.title}
                            </h4>
                          </Link>

                          {/* Short Description */}
                          <p className="text-xs text-[#494740] font-light line-clamp-2 leading-relaxed">
                            {story.short_story || story.story_text}
                          </p>

                          {/* Tagged Artisan Credits */}
                          {story.vendor_credits && story.vendor_credits.length > 0 && (
                            <div className="pt-2 border-t border-[#D7C2A0]/20 space-y-1">
                              <span className="text-[9px] font-bold uppercase tracking-wider text-[#0F4C45] block">
                                Verified Credits:
                              </span>
                              <div className="flex flex-wrap gap-1">
                                {story.vendor_credits.slice(0, 2).map((vc, i) => (
                                  <Link
                                    key={i}
                                    href={`/boutiques/${vc.slug || vc.vendor_id}`}
                                    className="text-[9px] font-medium bg-[#FAF7F2] hover:bg-[#0F4C45] hover:text-white px-2 py-0.5 rounded border border-[#D7C2A0]/30 transition-colors truncate max-w-[170px]"
                                  >
                                    <span className="text-[#0F4C45] font-semibold">{vc.role}:</span> {vc.business_name || "Artisan"}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          )}

                        </div>
                      </div>

                      {/* Card Footer */}
                      <div className="px-5 sm:px-6 pb-5 pt-3 flex items-center justify-between border-t border-[#D7C2A0]/20 bg-[#FAF9F6]/40">
                        <Link
                          href={`/real-weddings/${story.slug}`}
                          className="text-xs font-semibold text-[#0F4C45] hover:text-[#155E56] flex items-center gap-1 group-hover:underline"
                        >
                          <span>Explore Story</span>
                          <ArrowRight className="w-3 h-3 text-[#C8A96A]" />
                        </Link>

                        <button
                          onClick={(e) => handleShare(story, e)}
                          className="p-1.5 text-[#7A776E] hover:text-[#0F4C45] transition-colors cursor-pointer"
                          aria-label="Share story"
                          title="Share story link"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                    </article>
                  ))}
                </div>

                {/* 6. FUNCTIONAL PAGINATION / LOAD MORE CONTROL */}
                {hasMore && (
                  <div className="pt-6 text-center space-y-3">
                    <p className="text-xs text-[#7A776E]">
                      Showing {visibleGridStories.length} of {gridStories.length} celebrations
                    </p>
                    <button
                      onClick={handleLoadMore}
                      className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-white hover:bg-[#0F4C45] text-[#0F4C45] hover:text-white border border-[#D7C2A0]/50 hover:border-[#0F4C45] font-medium text-xs tracking-wider uppercase transition-all shadow-xs hover:shadow-md cursor-pointer"
                    >
                      <span>Load More Celebrations</span>
                      <ChevronRight className="w-4 h-4 text-[#C8A96A]" />
                    </button>
                  </div>
                )}

              </section>
            )}

            {/* 7. WEDDING INSPIRATION BY CATEGORY */}
            <section className="space-y-8 pt-6 border-t border-[#D7C2A0]/30" aria-labelledby="inspiration-heading">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] uppercase text-[#0F4C45]">
                    <Sparkles className="w-3.5 h-3.5 text-[#C8A96A]" />
                    <span>Curated Lookbooks</span>
                  </div>
                  <h3 id="inspiration-heading" className="font-serif text-2xl sm:text-3xl text-[#1C1C17] font-normal">
                    Explore Details & Category Inspirations
                  </h3>
                </div>
                <Link
                  href="/categories"
                  className="text-xs font-semibold text-[#0F4C45] hover:underline flex items-center gap-1"
                >
                  View All Categories <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
                {INSPIRATION_COLLECTIONS.map((col, idx) => (
                  <Link
                    key={idx}
                    href={col.href}
                    className="group relative rounded-2xl overflow-hidden aspect-[4/5] bg-[#1C1C17] border border-[#D7C2A0]/30 shadow-2xs hover:shadow-md transition-all flex flex-col justify-end p-3.5"
                  >
                    <Image
                      src={col.image}
                      alt={col.title}
                      fill
                      className="object-cover group-hover:scale-106 transition-transform duration-500"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                    
                    <div className="relative z-10 space-y-0.5">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-[#D7C2A0] block">
                        {col.tag}
                      </span>
                      <h4 className="font-serif text-sm text-white font-normal leading-snug line-clamp-2">
                        {col.title}
                      </h4>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {/* 8. VENDORS BEHIND THE WEDDING (CREDITED ARTISANS) */}
            {featuredArtisans.length > 0 && (
              <section className="space-y-6 pt-6 border-t border-[#D7C2A0]/30" aria-labelledby="vendors-behind-heading">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] uppercase text-[#0F4C45]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#0F4C45]" />
                      <span>Verified Credits</span>
                    </div>
                    <h3 id="vendors-behind-heading" className="font-serif text-2xl sm:text-3xl text-[#1C1C17] font-normal">
                      Vendors Behind the Wedding
                    </h3>
                    <p className="text-xs text-[#494740] font-light">
                      Connect directly with the verified photographers, venues, and ateliers featured in these wedding stories.
                    </p>
                  </div>
                  <Link
                    href="/vendors"
                    className="text-xs font-semibold text-[#0F4C45] hover:underline flex items-center gap-1"
                  >
                    Browse All Creators <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
                  {featuredArtisans.map((artisan, i) => (
                    <Link
                      key={i}
                      href={`/boutiques/${artisan.slug || artisan.vendor_id}`}
                      className="bg-white rounded-xl p-4 border border-[#D7C2A0]/30 hover:border-[#0F4C45] hover:shadow-sm transition-all flex flex-col justify-between space-y-2 group"
                    >
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#0F4C45] bg-[#FAF7F2] px-2 py-0.5 rounded border border-[#D7C2A0]/20 inline-block mb-1.5">
                          {artisan.role}
                        </span>
                        <h4 className="font-serif text-sm font-normal text-[#1C1C17] group-hover:text-[#0F4C45] transition-colors line-clamp-1">
                          {artisan.business_name || "Verified Creator"}
                        </h4>
                        <p className="text-[11px] text-[#7A776E] truncate">
                          Featured in Real Weddings
                        </p>
                      </div>

                      <span className="text-[10px] font-semibold text-[#0F4C45] flex items-center gap-1 pt-2 border-t border-[#D7C2A0]/15">
                        View Storefront <ArrowRight className="w-2.5 h-2.5 text-[#C8A96A]" />
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* 9. EDITORIAL PLANNING GUIDES */}
            <section className="space-y-6 pt-6 border-t border-[#D7C2A0]/30" aria-labelledby="editorial-notes-heading">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] uppercase text-[#0F4C45]">
                    <BookOpen className="w-3.5 h-3.5 text-[#C8A96A]" />
                    <span>Planning Notes</span>
                  </div>
                  <h3 id="editorial-notes-heading" className="font-serif text-2xl sm:text-3xl text-[#1C1C17] font-normal">
                    Editorial Guides &amp; Planning
                  </h3>
                  <p className="text-xs text-[#494740] font-light">
                    Practical wisdom from industry insiders on bridal couture, venue logistics & timeline planning.
                  </p>
                </div>
                <Link
                  href="/blogs"
                  className="text-xs font-semibold text-[#0F4C45] hover:underline flex items-center gap-1"
                >
                  View All Guides <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {EDITORIAL_GUIDES.map((guide) => (
                  <Link
                    key={guide.id}
                    href={`/blogs/${guide.id}`}
                    className="bg-white rounded-2xl border border-[#D7C2A0]/30 p-4 flex flex-col justify-between group hover:shadow-sm hover:border-[#D7C2A0]/60 transition-all space-y-3"
                  >
                    <div className="space-y-2.5">
                      <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-[#1C1C17]">
                        <Image
                          src={guide.image}
                          alt={guide.title}
                          fill
                          className="object-cover group-hover:scale-104 transition-transform duration-500"
                        />
                        <span className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-xs text-white text-[9px] font-semibold uppercase px-2 py-0.5 rounded-full">
                          {guide.category}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-[#7A776E]">
                        <span>{guide.date}</span>
                        <span>•</span>
                        <span>{guide.readTime}</span>
                      </div>

                      <h4 className="font-serif text-base font-normal text-[#1C1C17] group-hover:text-[#0F4C45] transition-colors line-clamp-2 leading-snug">
                        {guide.title}
                      </h4>

                      <p className="text-xs text-[#494740] font-light line-clamp-2 leading-relaxed">
                        {guide.excerpt}
                      </p>
                    </div>

                    <span className="text-xs font-semibold text-[#0F4C45] flex items-center gap-1 pt-2 border-t border-[#D7C2A0]/15">
                      Read Article <ArrowRight className="w-3 h-3 text-[#C8A96A]" />
                    </span>
                  </Link>
                ))}
              </div>
            </section>

            {/* 10. EDITORIAL VENDOR-DISCOVERY CALL-TO-ACTION */}
            <section className="bg-gradient-to-br from-[#0F4C45] via-[#12584E] to-[#0A3631] text-white rounded-3xl p-8 sm:p-12 lg:p-14 border border-[#C8A96A]/30 shadow-md relative overflow-hidden">
              {/* Subtle decorative circles */}
              <div className="absolute -right-16 -bottom-16 w-64 h-64 rounded-full bg-white/5 pointer-events-none" />
              <div className="absolute right-40 -top-20 w-48 h-48 rounded-full bg-[#C8A96A]/10 pointer-events-none" />

              <div className="relative z-10 max-w-2xl space-y-4">
                <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-[#C8A96A] inline-block">
                  Begin Your Journey
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal text-white leading-tight">
                  Craft Your Own Timeless Celebration with Verified Cloche Creators
                </h3>
                <p className="text-xs sm:text-sm text-white/80 font-light leading-relaxed">
                  Discover Kerala’s most sought-after wedding photographers, heritage lakeside venues, couture bridal ateliers, and floral scenographers—all vetted for exemplary craft and reliability.
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <Link
                    href="/vendors"
                    className="inline-flex items-center gap-2 bg-[#C8A96A] hover:bg-[#D7C2A0] text-[#0F4C45] font-semibold text-xs uppercase tracking-wider px-6 py-3 rounded-full transition-all shadow-sm"
                  >
                    <span>Explore Verified Creators</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <button
                    onClick={() => setIsSubmitModalOpen(true)}
                    className="inline-flex items-center gap-2 bg-transparent hover:bg-white/10 text-white font-medium text-xs uppercase tracking-wider px-6 py-3 rounded-full border border-white/30 transition-all cursor-pointer"
                  >
                    <span>Submit Your Wedding</span>
                  </button>
                </div>
              </div>
            </section>

          </div>
        )}

      </main>

      {/* 11. SUBMISSION MODAL */}
      <SubmitWeddingModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        onSubmitted={() => {
          fetchStories();
        }}
      />

      {/* 12. CONSISTENT FOOTER */}
      <Footer />

    </div>
  );
}
