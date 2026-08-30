"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Heart, Bookmark } from "lucide-react";

interface InspirationItem {
  id: string;
  title: string;
  category: "Reception" | "Mandap" | "Bridal Looks" | "Mehendi" | "Decor" | "Photography";
  image: string;
  likes: number;
}

const SAMPLE_INSPIRATION_ITEMS: InspirationItem[] = [
  {
    id: "insp-1",
    title: "Royal Floral Mandap under Starlight",
    category: "Mandap",
    image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=80",
    likes: 342,
  },
  {
    id: "insp-2",
    title: "Traditional Kanchipuram Silk & Temple Gold",
    category: "Bridal Looks",
    image: "https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=800&q=80",
    likes: 489,
  },
  {
    id: "insp-3",
    title: "Minimal Water-Lily Lagoon Reception",
    category: "Reception",
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80",
    likes: 215,
  },
  {
    id: "insp-4",
    title: "Candid Golden Hour Sunset Frames",
    category: "Photography",
    image: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80",
    likes: 560,
  },
  {
    id: "insp-5",
    title: "Henna Artistry with Marigold Accents",
    category: "Mehendi",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80",
    likes: 198,
  },
  {
    id: "insp-6",
    title: "Fairy-Light Canopy & Stage Florals",
    category: "Decor",
    image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80",
    likes: 410,
  },
];

const CATEGORIES = ["All", "Reception", "Mandap", "Bridal Looks", "Mehendi", "Decor", "Photography"] as const;

export function WeddingInspirationSection() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  const filtered = activeCategory === "All"
    ? SAMPLE_INSPIRATION_ITEMS
    : SAMPLE_INSPIRATION_ITEMS.filter((item) => item.category === activeCategory);

  const toggleSave = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#A97B3E]" />
            <span className="text-xs font-semibold tracking-widest uppercase text-[#A97B3E]">
              Curated Moodboard
            </span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-[#0F4C45] tracking-tight mt-1">
            Wedding Inspiration Gallery
          </h2>
        </div>

        <Link
          href="/real-weddings"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0F4C45] hover:text-[#A97B3E] transition-colors group"
        >
          <span>Explore Full Inspiration Board</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all shrink-0 ${activeCategory === cat ? "bg-[#0F4C45] text-white shadow-sm" : "bg-white text-[#7A776E] border border-[#EBE4D8] hover:border-[#0F4C45]"}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Pinterest-style Masonry/Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((item) => {
          const isSaved = savedIds.has(item.id);
          return (
            <div
              key={item.id}
              className="group relative h-80 rounded-3xl overflow-hidden shadow-md border border-[#EBE4D8] hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* Top Tag & Bookmark Button */}
              <div className="absolute top-3 left-3 right-3 flex justify-between items-center z-10">
                <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[#0F4C45] text-xs font-bold shadow-sm">
                  {item.category}
                </span>

                <button
                  onClick={(e) => toggleSave(e, item.id)}
                  aria-label="Save to Moodboard"
                  className="w-9 h-9 rounded-full bg-white/80 backdrop-blur-md text-[#0F4C45] flex items-center justify-center hover:bg-white hover:scale-110 transition-all shadow-sm"
                >
                  <Bookmark className={`w-4 h-4 transition-colors ${isSaved ? "fill-[#0F4C45] text-[#0F4C45]" : "text-[#0F4C45]"}`} />
                </button>
              </div>

              {/* Bottom Info Overlay */}
              <div className="relative z-10 p-5 space-y-1">
                <h3 className="font-display font-bold text-white text-lg leading-snug group-hover:text-[#C8A96A] transition-colors">
                  {item.title}
                </h3>
                <div className="flex items-center justify-between text-xs text-white/80 pt-1">
                  <span className="flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 fill-[#C8A96A] text-[#C8A96A]" />
                    {item.likes} Saved
                  </span>

                  <Link
                    href="/real-weddings"
                    className="inline-flex items-center gap-1 text-[#C8A96A] font-semibold hover:text-white transition-colors"
                  >
                    <span>View Idea</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
