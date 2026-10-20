"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ArrowLeft, MapPin, Calendar, Heart, Eye, Share2, 
  Sparkles, ExternalLink, Building2, CheckCircle2 
} from "lucide-react";
import { RealWeddingStoryDb } from "@/lib/realWeddingsData";
import { Footer } from "@/components/Footer";

export function RealWeddingStoryClient({
  story,
  relatedStories,
}: {
  story: RealWeddingStoryDb;
  relatedStories: RealWeddingStoryDb[];
}) {
  const [likeCount, setLikeCount] = useState(story.like_count || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [viewCount, setViewCount] = useState(story.view_count || 0);

  // Automatically increment view count once on mount
  useEffect(() => {
    fetch(`/api/v1/public/real-weddings/${encodeURIComponent(story.slug)}/view`, {
      method: "POST",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && typeof data.view_count === "number") {
          setViewCount(data.view_count);
        }
      })
      .catch(() => {});
  }, [story.slug]);

  // Real Like Toggle
  const handleLikeToggle = async () => {
    const nextState = !isLiked;
    setIsLiked(nextState);
    setLikeCount((prev) => Math.max(0, prev + (nextState ? 1 : -1)));

    try {
      const res = await fetch(`/api/v1/public/real-weddings/${encodeURIComponent(story.slug)}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ increment: nextState }),
      });
      const data = await res.json();
      if (data.success && typeof data.like_count === "number") {
        setLikeCount(data.like_count);
      }
    } catch (err) {
      console.error("Failed to toggle like:", err);
    }
  };

  // Share
  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: story.title,
        text: `Check out ${story.couple_names || story.title} on Cloche!`,
        url,
      });
    } else {
      navigator.clipboard.writeText(url);
      alert("Story link copied to clipboard! 📋");
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF8F1] text-charcoal pb-24 animate-in fade-in duration-300">
      
      {/* 1. TOP EDITORIAL NAVIGATION */}
      <header className="sticky top-16 z-40 bg-[#FBF8F1]/95 backdrop-blur-md border-b border-gold/15 px-4 sm:px-6 lg:px-12 py-3">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-xs font-semibold">
          <Link href="/real-weddings" className="flex items-center gap-2 text-[#0F4C45] hover:underline font-bold">
            <ArrowLeft className="w-4 h-4" /> Back to Real Weddings
          </Link>
          <div className="flex items-center gap-3">
            <span className="bg-gold/15 text-[#0F4C45] px-3 py-1 rounded-full text-[10px] uppercase font-extrabold border border-gold/20">
              {story.style}
            </span>
          </div>
        </div>
      </header>

      {/* 2. HERO COVER IMAGE & TITLE */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 mt-6">
        <div className="relative h-[440px] sm:h-[560px] rounded-[32px] overflow-hidden shadow-2xl border border-gold/20">
          <img src={story.cover_image_url} alt={story.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-6 sm:p-12 flex flex-col justify-end text-white">
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <span className="bg-[#C8A96A] text-[#082F2C] font-bold text-[10px] uppercase tracking-widest px-3 py-1 rounded-full shadow-xs">
                CLOCHE EDITORIAL SHOWCASE
              </span>
              {story.city && (
                <span className="bg-white/20 backdrop-blur-md text-white font-semibold text-xs px-3 py-1 rounded-full flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#C8A96A]" /> {story.city}
                </span>
              )}
              {story.wedding_date && (
                <span className="bg-white/20 backdrop-blur-md text-white font-semibold text-xs px-3 py-1 rounded-full flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#C8A96A]" /> {story.wedding_date}
                </span>
              )}
            </div>

            <h1 className="font-display text-3xl sm:text-5xl font-bold leading-tight max-w-4xl">{story.title}</h1>
            {story.couple_names && (
              <p className="text-base sm:text-xl font-bold text-[#D4B66E] mt-2">{story.couple_names}</p>
            )}

            {/* Live Engagement Bar on Hero */}
            <div className="flex items-center gap-4 mt-4 pt-3 border-t border-white/20 text-xs">
              <span className="flex items-center gap-1.5 opacity-90">
                <Eye className="w-4 h-4 text-[#C8A96A]" /> {viewCount} Views
              </span>
              <button
                onClick={handleLikeToggle}
                className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-md px-3.5 py-1.5 rounded-full transition-colors cursor-pointer"
              >
                <Heart className={`w-4 h-4 ${isLiked ? "text-red-500 fill-red-500" : "text-white"}`} />
                <span className="font-bold">{likeCount} {likeCount === 1 ? "Like" : "Likes"}</span>
              </button>
              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-md px-3.5 py-1.5 rounded-full transition-colors cursor-pointer ml-auto"
              >
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. MAIN STORY NARRATIVE & VENDOR CREDITS */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 mt-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left 8 Columns: Narrative & Gallery */}
        <div className="lg:col-span-8 space-y-10">
          
          {/* Story Narrative Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gold/15 shadow-sm space-y-4">
            <h2 className="font-display text-2xl font-bold text-charcoal">The Wedding Celebration Story</h2>
            <div className="text-sm text-charcoal/80 leading-relaxed font-sans space-y-4 whitespace-pre-line">
              {story.story_text}
            </div>
          </div>

          {/* VERIFIED VENDOR CREDITS SHOWCASE */}
          {story.vendor_credits && story.vendor_credits.length > 0 && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gold/15 shadow-sm space-y-6">
              <div className="flex justify-between items-center border-b border-gold/10 pb-4">
                <div>
                  <h2 className="font-display text-2xl font-bold text-charcoal flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#C8A96A]" /> Verified Vendor Credits
                  </h2>
                  <p className="text-xs text-charcoal/60 mt-0.5">
                    Real registered Kerala artisans &amp; partners who brought this celebration to life.
                  </p>
                </div>
                <span className="text-xs text-[#0F4C45] font-extrabold bg-[#FAF7F2] px-3 py-1 rounded-full border border-gold/20 shrink-0">
                  {story.vendor_credits.length} Verified Partners
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {story.vendor_credits.map((vc, i) => (
                  <Link
                    key={i}
                    href={`/boutiques/${vc.slug || vc.vendor_id}`}
                    className="bg-[#FAF7F2]/70 hover:bg-[#0F4C45] hover:text-white p-4 rounded-2xl border border-gold/15 flex items-center justify-between hover:shadow-md transition-all group min-h-[64px]"
                  >
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#0F4C45] group-hover:text-[#C8A96A] block">
                        {vc.role}
                      </span>
                      <span className="font-extrabold text-charcoal text-sm group-hover:text-white block mt-0.5">
                        {vc.business_name || "Verified Vendor"}
                      </span>
                    </div>
                    <span className="bg-white group-hover:bg-[#C8A96A] text-[#0F4C45] group-hover:text-[#082F2C] p-2 rounded-xl text-xs font-bold shrink-0 transition-colors shadow-2xs">
                      View Profile →
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* WEDDING PHOTO GALLERY */}
          {story.gallery && story.gallery.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-2xl font-bold text-charcoal">Celebration Gallery Highlights</h2>
                <span className="text-xs text-charcoal/60 font-semibold">{story.gallery.length} Photos</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {story.gallery.map((photo, i) => (
                  <div key={i} className="relative h-72 sm:h-80 rounded-2xl overflow-hidden border border-gold/20 shadow-xs group bg-gray-100">
                    <img src={photo.url} alt={photo.caption || `Photo ${i + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    {photo.caption && (
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex items-end">
                        <span className="text-white font-bold text-xs">{photo.caption}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right 4 Columns: Highlights & Related Stories */}
        <aside className="lg:col-span-4 space-y-8">
          
          {/* Quick Info Summary */}
          <div className="bg-white p-6 rounded-3xl border border-gold/15 shadow-sm space-y-3 text-xs">
            <h3 className="font-serif font-bold text-lg text-charcoal border-b border-gold/10 pb-2">Celebration Snapshot</h3>
            {story.couple_names && (
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-charcoal/60 font-medium">Couple:</span>
                <span className="font-bold text-charcoal">{story.couple_names}</span>
              </div>
            )}
            {story.city && (
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-charcoal/60 font-medium">Location:</span>
                <span className="font-bold text-charcoal">{story.city}</span>
              </div>
            )}
            {story.wedding_date && (
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-charcoal/60 font-medium">Date:</span>
                <span className="font-bold text-charcoal">{story.wedding_date}</span>
              </div>
            )}
            <div className="flex justify-between py-1 border-b border-gray-50">
              <span className="text-charcoal/60 font-medium">Style:</span>
              <span className="font-bold text-[#0F4C45]">{story.style}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-charcoal/60 font-medium">Verified Partners:</span>
              <span className="font-bold text-charcoal">{story.vendor_credits?.length || 0}</span>
            </div>
          </div>

          {/* Related Stories */}
          {relatedStories.length > 0 && (
            <div className="bg-white p-6 rounded-3xl border border-gold/15 shadow-sm space-y-4">
              <h3 className="font-serif font-bold text-lg text-charcoal border-b border-gold/10 pb-2">More Real Weddings</h3>
              <div className="space-y-3">
                {relatedStories.map((rel) => (
                  <Link key={rel.slug} href={`/real-weddings/${rel.slug}`} className="flex items-center gap-3 group">
                    <img src={rel.cover_image_url} alt={rel.title} className="w-16 h-16 rounded-xl object-cover shrink-0 border border-gold/20" />
                    <div>
                      <h4 className="font-serif font-bold text-xs text-charcoal group-hover:text-[#0F4C45] line-clamp-1">{rel.title}</h4>
                      <span className="text-[10px] text-charcoal/60 block mt-0.5">{rel.city || "Kerala"} • {rel.style}</span>
                      <span className="text-[9px] font-bold text-red-500 flex items-center gap-1 mt-0.5">
                        <Heart className="w-2.5 h-2.5 fill-current" /> {rel.like_count}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Editorial Submission CTA Box */}
          <div className="bg-[#0B3B36] text-white p-6 rounded-3xl border border-[#C8A96A]/30 shadow-md space-y-3 text-center">
            <span className="text-2xl">💍</span>
            <h4 className="font-serif text-lg font-bold text-[#F7F3EC]">Had a Cloche Wedding?</h4>
            <p className="text-xs text-[#F7F3EC]/80 leading-relaxed">
              Submit your wedding photos and story to be featured on Cloche and give authentic exposure to your vendors.
            </p>
            <Link
              href="/real-weddings"
              className="inline-block bg-[#C8A96A] hover:bg-[#b89859] text-[#082F2C] px-5 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider transition-all shadow-xs"
            >
              Submit Your Story
            </Link>
          </div>
        </aside>

      </main>

      <Footer />
    </div>
  );
}
