"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Camera, Sparkles, MapPin, Paintbrush, Shirt, Utensils, Heart, Music, Gift, Car, Gem } from "lucide-react";

interface CategoryCard {
  id: string;
  title: string;
  countLabel: string;
  description: string;
  href: string;
  imageUrl: string;
  icon: React.ElementType;
  gradient: string;
}

const LUXURY_CATEGORIES: CategoryCard[] = [
  {
    id: "cat-photography",
    title: "Photographers",
    countLabel: "320+ Vendors",
    description: "Candid, Cinematic & Pre-Wedding Experts",
    href: "/photographers",
    imageUrl: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80",
    icon: Camera,
    gradient: "from-[#0F4C45]/80 via-[#0F4C45]/40 to-transparent",
  },
  {
    id: "cat-venues",
    title: "Venues",
    countLabel: "240+ Venues",
    description: "Banquet Halls, Resorts & Heritage Lawns",
    href: "/venues",
    imageUrl: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80",
    icon: MapPin,
    gradient: "from-[#9A7B3E]/80 via-[#9A7B3E]/40 to-transparent",
  },
  {
    id: "cat-makeup",
    title: "Makeup Artists",
    countLabel: "190+ Artists",
    description: "HD Bridal Glam, Hair & Styling",
    href: "/makeup",
    imageUrl: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80",
    icon: Sparkles,
    gradient: "from-[#8C3A48]/80 via-[#8C3A48]/40 to-transparent",
  },
  {
    id: "cat-bridal",
    title: "Bridal Studio",
    countLabel: "150+ Boutiques",
    description: "Kanchipuram Silk, Lehengas & Gowns",
    href: "/categories/bridal-studio",
    imageUrl: "https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=800&q=80",
    icon: Shirt,
    gradient: "from-[#0F4C45]/80 via-[#0F4C45]/40 to-transparent",
  },
  {
    id: "cat-groom",
    title: "Groom Studio",
    countLabel: "110+ Studios",
    description: "Sherwanis, Indo-Western & Tuxedos",
    href: "/categories/groom-studio",
    imageUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80",
    icon: Shirt,
    gradient: "from-[#2B2B2B]/80 via-[#2B2B2B]/40 to-transparent",
  },
  {
    id: "cat-decor",
    title: "Decor & Planning",
    countLabel: "210+ Planners",
    description: "Stage Themes, Florals & Coordination",
    href: "/categories/decor-planning",
    imageUrl: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=80",
    icon: Paintbrush,
    gradient: "from-[#0F4C45]/80 via-[#0F4C45]/40 to-transparent",
  },
  {
    id: "cat-catering",
    title: "Catering",
    countLabel: "140+ Caterers",
    description: "Traditional Kerala Sadya & International Buffets",
    href: "/categories/catering",
    imageUrl: "https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=800&auto=format&fit=crop",
    icon: Utensils,
    gradient: "from-[#9A7B3E]/80 via-[#9A7B3E]/40 to-transparent",
  },
  {
    id: "cat-jewellery",
    title: "Jewellery",
    countLabel: "95+ Stores",
    description: "Temple Jewellery, Antique Gold & Diamonds",
    href: "/jewellery",
    imageUrl: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80",
    icon: Gem,
    gradient: "from-[#8C3A48]/80 via-[#8C3A48]/40 to-transparent",
  },
];

export function LuxuryCategorySection() {
  return (
    <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-semibold tracking-widest uppercase text-[#A97B3E]">
            Explore By Specialization
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-[#0F4C45] tracking-tight mt-1">
            Curated Wedding Categories
          </h2>
        </div>
        <Link
          href="/categories"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0F4C45] hover:text-[#A97B3E] transition-colors group"
        >
          <span>View All Categories</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Category Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {LUXURY_CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          return (
            <Link
              key={cat.id}
              href={cat.href}
              className="group relative h-[300px] rounded-3xl overflow-hidden shadow-md border border-[#EBE4D8] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl cursor-pointer"
            >
              {/* Background Image */}
              <img
                src={cat.imageUrl}
                alt={cat.title}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />

              {/* Gradient Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-t ${cat.gradient}`} />
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />

              {/* Top Badge: Vendor Count */}
              <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[#0F4C45] text-xs font-semibold shadow-sm border border-white/40">
                <Icon className="w-3.5 h-3.5 text-[#A97B3E]" />
                <span>{cat.countLabel}</span>
              </div>

              {/* Bottom Card Info */}
              <div className="absolute bottom-0 inset-x-0 p-5 z-10 space-y-1.5">
                <h3 className="font-display text-2xl font-bold text-white tracking-tight group-hover:text-[#F3E6D0] transition-colors">
                  {cat.title}
                </h3>
                <p className="text-xs text-white/80 font-light line-clamp-1">
                  {cat.description}
                </p>

                {/* Explore Micro CTA */}
                <div className="pt-2 flex items-center gap-1.5 text-xs font-semibold text-[#C8A96A] group-hover:text-white transition-colors">
                  <span>Explore</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
