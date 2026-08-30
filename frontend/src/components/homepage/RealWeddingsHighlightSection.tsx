"use client";

import React from "react";
import Link from "next/link";
import { Heart, MapPin, Calendar, ArrowRight, BookHeart } from "lucide-react";

interface RealWeddingHighlight {
  id: string;
  coupleName: string;
  location: string;
  weddingDate: string;
  storySummary: string;
  coverImage: string;
}

const HIGHLIGHT_STORIES: RealWeddingHighlight[] = [
  {
    id: "rw-1",
    coupleName: "Ananya & Rahul",
    location: "Bolgatty Palace, Kochi",
    weddingDate: "January 2026",
    storySummary: "A breathtaking waterfront royal wedding blending traditional Keralite Sadya with modern candlelit evening reception.",
    coverImage: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "rw-2",
    coupleName: "Meera & Siddharth",
    location: "Kovalam Beach, Trivandrum",
    weddingDate: "December 2025",
    storySummary: "Sunset beach muhurtham surrounded by lush marigold florals, traditional chenda melam, and customized digital invitations.",
    coverImage: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80",
  },
];

export function RealWeddingsHighlightSection() {
  return (
    <section className="py-12 bg-white border-y border-[#EBE4D8]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <BookHeart className="w-4 h-4 text-[#8C3A48]" />
              <span className="text-xs font-semibold tracking-widest uppercase text-[#8C3A48]">
                Real Couples, Real Experiences
              </span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-[#0F4C45] tracking-tight mt-1">
              Kerala Real Wedding Stories
            </h2>
          </div>

          <Link
            href="/real-weddings"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0F4C45] hover:text-[#A97B3E] transition-colors group"
          >
            <span>Explore All Real Weddings</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Real Wedding Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {HIGHLIGHT_STORIES.map((story) => (
            <div
              key={story.id}
              className="bg-[#FAF7F2] rounded-3xl overflow-hidden border border-[#EBE4D8] shadow-sm hover:shadow-xl transition-all duration-300 grid grid-cols-1 sm:grid-cols-12"
            >
              {/* Image (5 cols) */}
              <div className="sm:col-span-5 relative min-h-[240px] bg-[#EBE4D8]">
                <img src={story.coverImage} alt={story.coupleName} className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[#8C3A48] text-xs font-bold shadow-sm flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 fill-[#8C3A48]" />
                  Real Story
                </div>
              </div>

              {/* Story Content (7 cols) */}
              <div className="sm:col-span-7 p-6 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-xs text-[#7A776E] mb-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#A97B3E]" />
                      {story.weddingDate}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#A97B3E]" />
                      {story.location}
                    </span>
                  </div>

                  <h3 className="font-display text-2xl font-bold text-[#0F4C45]">
                    {story.coupleName}
                  </h3>

                  <p className="text-xs text-[#5C5549] mt-2 font-light leading-relaxed line-clamp-3">
                    {story.storySummary}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#EBE4D8]/60 flex justify-end">
                  <Link
                    href="/real-weddings"
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#0F4C45] text-white text-xs font-bold hover:bg-[#0A3732] shadow-sm transition-all"
                  >
                    <span>Read Full Story</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
