"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Star, Heart, MapPin, ShoppingBag, Eye, ArrowRight } from "lucide-react";

export interface ShopProduct {
  id: string;
  name: string;
  designer: string;
  city: string;
  price: string;
  rating: number;
  reviewCount: number;
  image: string;
  badge?: "NEW" | "TRENDING";
}

const SAMPLE_SHOP_PRODUCTS: ShopProduct[] = [
  {
    id: "p-1",
    name: "Pure Kanchipuram Gold Tissue Sari",
    designer: "Milan Design Studio",
    city: "Kochi, Kerala",
    price: "₹38,500",
    rating: 4.9,
    reviewCount: 42,
    image: "https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=800&q=80",
    badge: "TRENDING",
  },
  {
    id: "p-2",
    name: "Hand-Embroidered Velvet Sherwani",
    designer: "Raymond Made-To-Measure",
    city: "Calicut, Kerala",
    price: "₹52,000",
    rating: 4.8,
    reviewCount: 28,
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80",
    badge: "NEW",
  },
  {
    id: "p-3",
    name: "Antique Temple Gold Choker Set",
    designer: "Bhima Heritage Jewels",
    city: "Trivandrum, Kerala",
    price: "₹1,85,000",
    rating: 5.0,
    reviewCount: 64,
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80",
    badge: "TRENDING",
  },
  {
    id: "p-4",
    name: "Pastel Zardosi Bridal Lehenga",
    designer: "Kimora Couture",
    city: "Kochi, Kerala",
    price: "₹89,000",
    rating: 4.9,
    reviewCount: 51,
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
    badge: "NEW",
  },
];

export function CuratedShopSection() {
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  const toggleWishlist = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
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
          <span className="text-xs font-semibold tracking-widest uppercase text-[#0F4C45]">
            Bridal & Groom Shopping
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-[#0F4C45] tracking-tight mt-1">
            Curated Luxury Collections
          </h2>
        </div>

        <Link
          href="/boutiques"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0F4C45] hover:text-[#A97B3E] transition-colors group"
        >
          <span>Browse All Products</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {SAMPLE_SHOP_PRODUCTS.map((prod) => {
          const isSaved = savedIds.has(prod.id);
          return (
            <Link
              key={prod.id}
              href={`/boutiques`}
              className="group relative bg-white rounded-3xl overflow-hidden border border-[#EBE4D8] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer"
            >
              {/* Product Image */}
              <div className="relative h-72 w-full overflow-hidden bg-[#EBE4D8]">
                <img
                  src={prod.image}
                  alt={prod.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />

                {/* Badges */}
                <div className="absolute top-3 left-3 z-10">
                  {prod.badge && (
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold shadow-sm ${prod.badge === "NEW" ? "bg-[#0F4C45] text-white" : "bg-[#C8A96A] text-[#0F4C45]"}`}>
                      {prod.badge}
                    </span>
                  )}
                </div>

                {/* Wishlist Button */}
                <button
                  onClick={(e) => toggleWishlist(e, prod.id)}
                  aria-label="Add to Wishlist"
                  className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/80 backdrop-blur-md text-[#0F4C45] flex items-center justify-center hover:bg-white hover:scale-110 transition-all shadow-sm"
                >
                  <Heart className={`w-4 h-4 transition-colors ${isSaved ? "fill-[#8C3A48] text-[#8C3A48]" : "text-[#0F4C45]"}`} />
                </button>
              </div>

              {/* Product Info Body */}
              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center text-xs text-[#7A776E] mb-1">
                    <span className="font-medium text-[#A97B3E]">{prod.designer}</span>
                    <span className="flex items-center gap-1 font-semibold text-[#0F4C45]">
                      <Star className="w-3 h-3 fill-[#C8A96A] text-[#C8A96A]" />
                      {prod.rating.toFixed(1)} ({prod.reviewCount})
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-[#0F4C45] text-base line-clamp-1 group-hover:text-[#A97B3E] transition-colors">
                    {prod.name}
                  </h3>

                  <p className="text-xs text-[#7A776E] flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3 text-[#A97B3E]" />
                    {prod.city}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#F5EFE6] flex items-center justify-between">
                  <span className="font-bold text-[#0F4C45] text-base">{prod.price}</span>

                  <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#FAF7F2] text-[#0F4C45] text-xs font-semibold group-hover:bg-[#0F4C45] group-hover:text-white transition-colors border border-[#D7C2A0]/60">
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>View Detail</span>
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
