"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useMemo } from "react";
import { ArrowLeft, Search, Clock, Heart } from "lucide-react";
import { BottomNavBar } from "@/components/BottomNavBar";

type BlogPost = {
  id: string;
  title: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
};

const blogPosts: BlogPost[] = [
  {
    id: "perfect-wedding-venue",
    title: "How to Choose the Perfect Wedding Venue",
    category: "Planning",
    date: "July 28, 2026",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "bridal-fashion-trends-2026",
    title: "Top Bridal Fashion Trends of 2026",
    category: "Fashion",
    date: "July 20, 2026",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "destination-wedding-checklist",
    title: "Destination Wedding Checklist",
    category: "Inspiration",
    date: "July 12, 2026",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "royal-affair-udaipur",
    title: "Real Wedding: A Royal Affair in Udaipur",
    category: "Tips",
    date: "June 30, 2026",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=400&q=80",
  },
];

const FILTERS = ["All", "Planning", "Fashion", "Inspiration", "Tips"] as const;
type Filter = (typeof FILTERS)[number];

export function BlogsList() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<Filter>("All");

  const filtered = useMemo(() => {
    return blogPosts.filter((post) => {
      const matchesSearch = post.title.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = activeFilter === "All" || post.category === activeFilter;
      return matchesSearch && matchesFilter;
    });
  }, [search, activeFilter]);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#F5F0E8" }}>
      {/* Header */}
      <header className="sticky top-0 z-40 flex items-center justify-between px-4 py-4" style={{ background: "#F5F0E8" }}>
        <Link
          href="/"
          className="flex h-10 w-10 items-center justify-center rounded-full"
          style={{ background: "rgba(15,76,69,0.08)" }}
          aria-label="Back"
        >
          <ArrowLeft className="h-5 w-5" style={{ color: "#0F4C45" }} />
        </Link>
        <h1 className="font-display text-[20px] font-bold" style={{ color: "#0F4C45" }}>
          Blogs
        </h1>
        <button className="flex h-10 w-10 items-center justify-center rounded-full" style={{ background: "rgba(15,76,69,0.08)" }}>
          <Search className="h-5 w-5" style={{ color: "#0F4C45" }} />
        </button>
      </header>

      {/* Filter Chips */}
      <div className="flex gap-2 overflow-x-auto px-4 pb-4 scrollbar-none" style={{ WebkitOverflowScrolling: "touch" }}>
        {FILTERS.map((f) => {
          const active = activeFilter === f;
          return (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className="shrink-0 rounded-full px-4 py-1.5 text-[13px] font-semibold transition-all"
              style={{
                background: active ? "#0F4C45" : "#FFFFFF",
                color: active ? "#FFFFFF" : "#4A3F35",
                border: active ? "none" : "1px solid #E2D5C0",
              }}
            >
              {f}
            </button>
          );
        })}
      </div>

      {/* Blog Cards List */}
      <div className="flex-1 px-4 pb-28 flex flex-col gap-4">
        {filtered.map((post) => (
          <Link
            key={post.id}
            href={`/blogs/${post.id}`}
            className="flex gap-4 rounded-2xl p-3 bg-white transition-transform active:scale-[0.98]"
            style={{ boxShadow: "0 2px 12px rgba(15,76,69,0.04)" }}
          >
            {/* Image (left) */}
            <div className="relative shrink-0 rounded-xl overflow-hidden" style={{ width: "110px", height: "100px" }}>
              <Image src={post.image} alt={post.title} fill className="object-cover" />
            </div>

            {/* Text (right) */}
            <div className="flex-1 flex flex-col justify-center min-w-0">
              <h2 className="font-display text-[15px] font-bold leading-snug text-[#1A1410] line-clamp-2">
                {post.title}
              </h2>
              <div className="mt-2 flex items-center gap-1.5 text-[12px]" style={{ color: "#9A8D7D" }}>
                <span>{post.date}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {post.readTime}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <BottomNavBar activeTab="home" />
    </div>
  );
}
