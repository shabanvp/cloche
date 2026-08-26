"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { 
  Heart, Eye, Share2, Search, Sparkles, MapPin, 
  Calendar, ArrowRight, BookHeart, Plus, Loader2
} from "lucide-react";
import { SubmitWeddingModal } from "@/components/SubmitWeddingModal";
import { RealWeddingStoryDb } from "@/lib/realWeddings";

const STYLES_FILTER = [
  "All",
  "Traditional Kerala",
  "Royal & Heritage",
  "Destination Wedding",
  "Beach & Waterfront",
  "Minimalist & Contemporary",
  "Luxury Grandeur",
  "Garden & Outdoor",
];

export function RealWeddingsFeed() {
  const [stories, setStories] = useState<RealWeddingStoryDb[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStyle, setFilterStyle] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<"newest" | "popular" | "views">("newest");
  const [likedSlugs, setLikedSlugs] = useState<Set<string>>(new Set());
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  // Fetch published stories from API
  const fetchStories = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterStyle !== "All") params.set("style", filterStyle);
      if (searchQuery.trim()) params.set("search", searchQuery.trim());
      params.set("sortBy", sortBy);
      params.set("limit", "30");

      const res = await fetch(`/api/v1/public/real-weddings?${params.toString()}`);
      const data = await res.json();

      if (data.success && Array.isArray(data.stories)) {
        setStories(data.stories);
      } else {
        setStories([]);
      }
    } catch (err) {
      console.error("Failed to load real wedding stories:", err);
      setStories([]);
    } finally {
      setLoading(false);
    }
  }, [filterStyle, searchQuery, sortBy]);

  useEffect(() => {
    fetchStories();
  }, [fetchStories]);

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

  // Share
  const handleShare = (story: RealWeddingStoryDb, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/real-weddings/${story.slug}`;
    if (navigator.share) {
      navigator.share({
        title: story.title,
        text: `Check out this real wedding story on Cloche: ${story.title}`,
        url,
      });
    } else {
      navigator.clipboard.writeText(url);
      alert("Story link copied to clipboard! 📋");
    }
  };

  // Hero Story (first featured or newest story)
  const heroStory = stories.length > 0 ? stories[0] : null;
  const remainingStories = stories.length > 1 ? stories.slice(1) : [];

  return (
    <div className="min-h-screen bg-[#FBF8F1] text-charcoal pb-24">
      
      {/* 3. MAIN CONTENT: HERO STORY OR HONEST EMPTY STATE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pt-8">
        {loading ? (
          <div className="text-center py-24 space-y-4">
            <Loader2 className="w-8 h-8 animate-spin text-[#0F4C45] mx-auto" />
            <p className="text-xs font-bold text-charcoal/60 uppercase tracking-widest">
              Loading Real Wedding Stories...
            </p>
          </div>
        ) : stories.length === 0 ? (
          /* HONEST EMPTY STATE (NO FAKE PLACEHOLDERS) */
          <div className="bg-white rounded-[28px] border border-gold/20 shadow-lg p-8 sm:p-16 text-center max-w-2xl mx-auto space-y-6">
            <div className="w-20 h-20 rounded-full bg-[#FAF7F2] border border-gold/30 text-[#0F4C45] flex items-center justify-center mx-auto shadow-inner">
              <BookHeart className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#0F4C45] bg-[#FAF7F2] px-3 py-1 rounded-full border border-gold/20 inline-block">
                BE THE FIRST TO BE FEATURED
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal">
                Share Your Cloche Wedding Story
              </h2>
              <p className="text-xs sm:text-sm text-charcoal/70 leading-relaxed max-w-md mx-auto">
                Our Real Weddings showcase celebrates authentic celebrations and gives real exposure to the verified photographers, decorators, bridal designers, and venues who made your dream wedding come true.
              </p>
            </div>
            <div className="pt-2">
              <button
                onClick={() => setIsSubmitModalOpen(true)}
                className="bg-[#0F4C45] hover:bg-[#12584E] text-white px-8 py-3.5 rounded-full font-bold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Submit Your Wedding Celebration</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-12">
            
            {/* HERO FEATURED STORY */}
            {heroStory && (
              <div className="bg-white rounded-[28px] border border-gold/20 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
                <div className="lg:col-span-8 relative h-[360px] sm:h-[480px] bg-charcoal overflow-hidden group">
                  <img
                    src={heroStory.cover_image_url}
                    alt={heroStory.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4 bg-[#0F4C45]/90 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-white/20">
                    FEATURED EDITORIAL STORY
                  </div>
                </div>

                <div className="lg:col-span-4 p-6 sm:p-8 flex flex-col justify-between space-y-6 bg-gradient-to-br from-white via-[#FBF8F1] to-white">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="bg-gold/15 text-charcoal font-bold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-md">
                        {heroStory.style}
                      </span>
                      <div className="flex items-center gap-3 text-xs text-charcoal/60">
                        <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {heroStory.view_count}</span>
                        <button
                          onClick={(e) => handleLikeToggle(heroStory.slug, e)}
                          className="flex items-center gap-1 cursor-pointer hover:text-red-500 transition-colors"
                        >
                          <Heart className={`w-3.5 h-3.5 ${likedSlugs.has(heroStory.slug) ? "text-red-500 fill-red-500" : ""}`} />
                          <span>{heroStory.like_count}</span>
                        </button>
                      </div>
                    </div>

                    <h2 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal leading-snug">
                      {heroStory.title}
                    </h2>

                    {heroStory.couple_names && (
                      <p className="text-xs font-bold text-[#0F4C45]">{heroStory.couple_names}</p>
                    )}

                    <p className="text-xs text-charcoal/70 line-clamp-3 leading-relaxed">
                      {heroStory.short_story || heroStory.story_text}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-charcoal/60 pt-1">
                      {heroStory.city && (
                        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-[#0F4C45]" /> {heroStory.city}</span>
                      )}
                      {heroStory.wedding_date && (
                        <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-[#0F4C45]" /> {heroStory.wedding_date}</span>
                      )}
                    </div>
                  </div>

                  {/* Tagged Verified Vendors */}
                  {heroStory.vendor_credits && heroStory.vendor_credits.length > 0 && (
                    <div className="space-y-2 border-t border-gold/15 pt-3">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#0F4C45] block">
                        Featured Verified Vendors:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {heroStory.vendor_credits.slice(0, 3).map((vc, i) => (
                          <Link
                            key={i}
                            href={`/boutiques/${vc.slug || vc.vendor_id}`}
                            className="bg-white hover:bg-[#0F4C45] hover:text-white border border-gold/20 text-[10px] font-bold px-2.5 py-1 rounded-md transition-colors"
                          >
                            {vc.role}: {vc.business_name || "Verified Vendor"}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-gold/15">
                    <Link
                      href={`/real-weddings/${heroStory.slug}`}
                      className="inline-flex items-center gap-2 bg-[#0F4C45] hover:bg-[#12584E] text-white text-xs font-bold px-5 py-2.5 rounded-full transition-all shadow-md"
                    >
                      <span>Read Full Story</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    <button
                      onClick={(e) => handleShare(heroStory, e)}
                      className="p-2 rounded-full border border-gold/20 text-charcoal hover:bg-gold/10 transition-colors cursor-pointer"
                      title="Share story"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* STORIES GRID */}
            {remainingStories.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-gold/15 pb-3">
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-charcoal">
                    More Real Wedding Stories
                  </h3>
                  <span className="text-xs text-charcoal/60 font-semibold">
                    {remainingStories.length} {remainingStories.length === 1 ? "Story" : "Stories"}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {remainingStories.map((story) => (
                    <div
                      key={story.id}
                      className="bg-white rounded-[24px] border border-gold/20 shadow-md overflow-hidden flex flex-col justify-between group hover:shadow-xl transition-all duration-300"
                    >
                      <div>
                        {/* Cover Image */}
                        <Link href={`/real-weddings/${story.slug}`} className="block relative h-56 bg-gray-100 overflow-hidden">
                          <img
                            src={story.cover_image_url}
                            alt={story.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <span className="absolute top-3 left-3 bg-[#0F4C45]/90 backdrop-blur-xs text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                            {story.style}
                          </span>
                        </Link>

                        {/* Card Body */}
                        <div className="p-5 sm:p-6 space-y-3">
                          <div className="flex items-center justify-between text-xs text-charcoal/60">
                            <span className="flex items-center gap-1 font-semibold"><MapPin className="w-3.5 h-3.5 text-[#0F4C45]" /> {story.city || "Kerala"}</span>
                            <div className="flex items-center gap-2.5">
                              <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {story.view_count}</span>
                              <button
                                onClick={(e) => handleLikeToggle(story.slug, e)}
                                className="flex items-center gap-1 cursor-pointer hover:text-red-500"
                              >
                                <Heart className={`w-3.5 h-3.5 ${likedSlugs.has(story.slug) ? "text-red-500 fill-red-500" : ""}`} />
                                <span>{story.like_count}</span>
                              </button>
                            </div>
                          </div>

                          <Link href={`/real-weddings/${story.slug}`}>
                            <h4 className="font-serif text-lg font-bold text-charcoal group-hover:text-[#0F4C45] transition-colors leading-snug line-clamp-2">
                              {story.title}
                            </h4>
                          </Link>

                          {story.couple_names && (
                            <p className="text-[11px] font-bold text-[#0F4C45]">{story.couple_names}</p>
                          )}

                          <p className="text-xs text-charcoal/70 line-clamp-2 leading-relaxed">
                            {story.short_story || story.story_text}
                          </p>

                          {/* Vendor Credits */}
                          {story.vendor_credits && story.vendor_credits.length > 0 && (
                            <div className="pt-2 border-t border-gold/10 space-y-1">
                              <span className="text-[9px] font-bold uppercase tracking-wider text-[#0F4C45] block">
                                Verified Credits:
                              </span>
                              <div className="flex flex-wrap gap-1">
                                {story.vendor_credits.slice(0, 2).map((vc, i) => (
                                  <Link
                                    key={i}
                                    href={`/boutiques/${vc.slug || vc.vendor_id}`}
                                    className="text-[9px] font-semibold bg-[#FAF7F2] hover:bg-[#0F4C45] hover:text-white px-2 py-0.5 rounded border border-gold/15 transition-colors truncate max-w-[160px]"
                                  >
                                    {vc.role}: {vc.business_name || "Vendor"}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Card Footer */}
                      <div className="px-5 sm:px-6 pb-5 pt-2 flex items-center justify-between border-t border-gold/10">
                        <Link
                          href={`/real-weddings/${story.slug}`}
                          className="text-xs font-bold text-[#0F4C45] hover:underline flex items-center gap-1"
                        >
                          Read Story <ArrowRight className="w-3 h-3" />
                        </Link>
                        <button
                          onClick={(e) => handleShare(story, e)}
                          className="p-1.5 text-charcoal/50 hover:text-charcoal cursor-pointer"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* SUBMISSION MODAL */}
      <SubmitWeddingModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        onSubmitted={() => {
          fetchStories();
        }}
      />
    </div>
  );
}
