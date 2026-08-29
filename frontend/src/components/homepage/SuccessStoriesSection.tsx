"use client";

import React from "react";
import Link from "next/link";
import { Quote, Heart, Star, MapPin, ArrowRight } from "lucide-react";

interface StoryItem {
  id: string;
  coupleName: string;
  location: string;
  quote: string;
  weddingDate: string;
  coverImage: string;
  venueName: string;
  photographerName: string;
}

const SAMPLE_STORIES: StoryItem[] = [
  {
    id: "story-1",
    coupleName: "Ananya & Rahul",
    location: "Kochi, Kerala",
    quote: "Cloche made our dream Bolgatty Island wedding completely seamless. Finding our photographer, makeup artist, and invitation design took less than a week!",
    weddingDate: "January 2026",
    coverImage: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
    venueName: "Grand Hyatt Bolgatty",
    photographerName: "Wedlock Cinema",
  },
  {
    id: "story-2",
    coupleName: "Meera & Siddharth",
    location: "Trivandrum, Kerala",
    quote: "The digital invitation with live WhatsApp RSVP and venue location maps saved us so much coordination effort. Our guests were wowed!",
    weddingDate: "December 2025",
    coverImage: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80",
    venueName: "Uday Samudra Resort",
    photographerName: "Frames & Stories",
  },
  {
    id: "story-3",
    coupleName: "Dr. Kavya & Varun",
    location: "Calicut, Kerala",
    quote: "From our Kanchipuram silk sari shopping to stage decor planning, Cloche connected us directly with verified vendors. Truly 5-star experience!",
    weddingDate: "November 2025",
    coverImage: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80",
    venueName: "Kadavu Resort",
    photographerName: "Flora Crafts",
  },
];

export function SuccessStoriesSection() {
  return (
    <section className="py-12 bg-[#FAF7F2] border-t border-[#EBE4D8]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 fill-[#8C3A48] text-[#8C3A48]" />
              <span className="text-xs font-semibold tracking-widest uppercase text-[#8C3A48]">
                Real Couples, Real Magic
              </span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-[#0F4C45] tracking-tight mt-1">
              Real Kerala Weddings & Stories
            </h2>
          </div>

          <Link
            href="/real-weddings"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0F4C45] hover:text-[#A97B3E] transition-colors group"
          >
            <span>View All Wedding Stories</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Stories Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {SAMPLE_STORIES.map((story) => (
            <div
              key={story.id}
              className="bg-white rounded-3xl overflow-hidden border border-[#EBE4D8] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              {/* Photo Header */}
              <div className="relative h-64 w-full bg-[#EBE4D8]">
                <img
                  src={story.coverImage}
                  alt={story.coupleName}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                <div className="absolute bottom-4 left-4 right-4 text-white z-10">
                  <span className="text-xs font-semibold uppercase text-[#C8A96A] tracking-wider block">
                    {story.weddingDate}
                  </span>
                  <h3 className="font-display text-2xl font-bold text-white leading-tight">
                    {story.coupleName}
                  </h3>
                  <p className="text-xs text-white/80 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-[#C8A96A]" />
                    {story.location}
                  </p>
                </div>
              </div>

              {/* Body Quote */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="relative">
                  <Quote className="w-8 h-8 text-[#EBE4D8] mb-1" />
                  <p className="text-xs text-[#5C5549] font-light leading-relaxed italic relative z-10">
                    "{story.quote}"
                  </p>
                </div>

                {/* Tagged Vendors */}
                <div className="pt-3 border-t border-[#F5EFE6] space-y-1 text-xs text-[#7A776E]">
                  <p><strong className="text-[#0F4C45]">Venue:</strong> {story.venueName}</p>
                  <p><strong className="text-[#0F4C45]">Photo:</strong> {story.photographerName}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
