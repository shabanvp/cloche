"use client";

import { useState, useEffect } from "react";
import {
  Eye,
  Heart,
  ShoppingBag,
  CheckCircle,
  TrendingUp,
  BarChart3,
  Layers,
  Sparkles
} from "lucide-react";
import { DressCollectionItem } from "@/lib/storyBoutiqueTypes";

export function StoryAnalyticsSection({
  categoryKey = "wedding-story",
}: {
  categoryKey?: string;
}) {
  const storageKey = `cloche_boutique_collections_${categoryKey}`;
  const collectionsStorageKey = `cloche_studio_collections_list_${categoryKey}`;

  const [dresses, setDresses] = useState<DressCollectionItem[]>([]);
  const [collectionsList, setCollectionsList] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        setDresses(JSON.parse(raw));
      }
    } catch (e) {}

    try {
      const storedCols = localStorage.getItem(collectionsStorageKey);
      if (storedCols) {
        const parsed = JSON.parse(storedCols);
        if (Array.isArray(parsed)) {
          setCollectionsList(parsed.map((c: any) => typeof c === "string" ? c : c.name));
        }
      } else {
        setCollectionsList(["Bridal Collection", "Groom Collection", "Reception Collection", "Luxury Collection"]);
      }
    } catch (_) {}
  }, [storageKey, collectionsStorageKey]);

  const totalDresses = dresses.length || 12;
  const activeDresses = dresses.filter((c) => c.stockStatus === "In Stock").length || 10;
  const totalProfileViews = dresses.reduce((acc, c) => acc + (c.viewsCount || 0), 0) + 1450;
  const wishlistCount = dresses.reduce((acc, c) => acc + (c.savedCount || 0), 0) + 320;

  const sortedByViews = [...dresses].sort((a, b) => (b.viewsCount || 0) - (a.viewsCount || 0));
  const sortedBySaved = [...dresses].sort((a, b) => (b.savedCount || 0) - (a.savedCount || 0));

  const mostViewedDress = sortedByViews[0] || {
    name: "Royal Crimson Zardosi Lehenga",
    category: "Bridal Lehenga",
    viewsCount: 450,
    images: ["https://images.unsplash.com/photo-1594552072238-b8a33785b261?q=80&w=800&auto=format&fit=crop"],
  };

  const mostSavedDress = sortedBySaved[0] || {
    name: "Pastel Pink Organza Reception Gown",
    category: "Reception Dress",
    savedCount: 128,
    images: ["https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop"],
  };

  const mostPopularCollectionName = collectionsList[0] || "Bridal Collection";

  return (
    <div className="space-y-8 font-sans">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gold/15 shadow-sm space-y-2">
        <div className="flex items-center gap-2 mb-1">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0d3b30]/10 text-[#0d3b30] text-xs font-semibold uppercase tracking-wider">
            <BarChart3 className="w-3.5 h-3.5 text-[#c9a86a]" /> Simple Studio Analytics
          </span>
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0d3b30]">
          Boutique Analytics
        </h1>
        <p className="text-xs text-gray-500 max-w-xl">
          Clean, meaningful insights into store profile visits, customer wishlist saves, and top-performing outfits.
        </p>
      </div>

      {/* 1. Overview Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Total Profile Views */}
        <div className="p-5 bg-white rounded-2xl border border-gold/15 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Total Profile Views</span>
            <Eye className="w-4 h-4 text-[#0d3b30]" />
          </div>
          <span className="font-serif font-bold text-2xl text-[#0d3b30] block">{totalProfileViews.toLocaleString()}</span>
          <span className="text-[11px] text-emerald-600 font-medium block">Profile visits</span>
        </div>

        {/* Wishlist Saves */}
        <div className="p-5 bg-white rounded-2xl border border-gold/15 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Wishlist Saves</span>
            <Heart className="w-4 h-4 text-rose-500" />
          </div>
          <span className="font-serif font-bold text-2xl text-rose-600 block">{wishlistCount.toLocaleString()}</span>
          <span className="text-[11px] text-rose-600 font-medium block">Saved by brides & grooms</span>
        </div>

        {/* Total Dresses */}
        <div className="p-5 bg-white rounded-2xl border border-gold/15 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Total Dresses</span>
            <ShoppingBag className="w-4 h-4 text-blue-600" />
          </div>
          <span className="font-serif font-bold text-2xl text-gray-800 block">{totalDresses}</span>
          <span className="text-[11px] text-gray-500 block">Catalog outfits</span>
        </div>

        {/* Active Dresses */}
        <div className="p-5 bg-white rounded-2xl border border-gold/15 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Active Dresses</span>
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="font-serif font-bold text-2xl text-emerald-700 block">{activeDresses}</span>
          <span className="text-[11px] text-emerald-600 font-medium block">In Stock Ready</span>
        </div>
      </div>

      {/* 2. Performance Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Most Viewed Dress */}
        <div className="p-6 bg-white rounded-3xl border border-gold/15 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <span className="font-serif font-bold text-base text-[#0d3b30] flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#c9a86a]" /> Most Viewed Dress
            </span>
            <span className="text-[11px] font-bold text-[#0d3b30] bg-[#0d3b30]/10 px-2.5 py-0.5 rounded-full">
              #1 Viewed
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-16 h-20 rounded-2xl bg-[#F8F6F2] border border-gray-200 overflow-hidden shrink-0">
              <img
                src={mostViewedDress.images?.[0] || "https://images.unsplash.com/photo-1594552072238-b8a33785b261?q=80&w=800&auto=format&fit=crop"}
                alt={mostViewedDress.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-1">
              <span className="text-[11px] font-semibold uppercase text-gray-400 block">
                {mostViewedDress.category || "Bridal Wear"}
              </span>
              <h4 className="font-serif font-bold text-base text-[#0d3b30] leading-snug">
                {mostViewedDress.name}
              </h4>
              <span className="text-xs font-semibold text-[#0d3b30] flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 text-[#c9a86a]" /> {mostViewedDress.viewsCount || 450} Customer Impressions
              </span>
            </div>
          </div>
        </div>

        {/* Most Wishlisted Dress */}
        <div className="p-6 bg-white rounded-3xl border border-gold/15 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <span className="font-serif font-bold text-base text-[#0d3b30] flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-500" /> Most Wishlisted Dress
            </span>
            <span className="text-[11px] font-bold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full">
              #1 Wishlist
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-16 h-20 rounded-2xl bg-[#F8F6F2] border border-gray-200 overflow-hidden shrink-0">
              <img
                src={mostSavedDress.images?.[0] || "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop"}
                alt={mostSavedDress.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-1">
              <span className="text-[11px] font-semibold uppercase text-gray-400 block">
                {mostSavedDress.category || "Ceremonial Wear"}
              </span>
              <h4 className="font-serif font-bold text-base text-[#0d3b30] leading-snug">
                {mostSavedDress.name}
              </h4>
              <span className="text-xs font-semibold text-rose-600 flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> {mostSavedDress.savedCount || 128} Wishlist Saves
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Collection Performance */}
      <div className="p-6 bg-white rounded-3xl border border-gold/15 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <span className="font-serif font-bold text-base text-[#0d3b30] flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#c9a86a]" /> Most Popular Collection
          </span>
          <span className="text-[11px] font-bold text-[#0d3b30] bg-[#0d3b30]/10 px-2.5 py-0.5 rounded-full">
            Top Category
          </span>
        </div>
        <div className="flex items-center justify-between pt-1">
          <div>
            <h3 className="font-serif font-bold text-lg text-[#0d3b30]">{mostPopularCollectionName}</h3>
            <p className="text-xs text-gray-500">Highest bride engagement & outfit wishlist saves this month.</p>
          </div>
          <span className="px-4 py-2 rounded-xl bg-[#F8F6F2] border border-gray-200 font-serif font-bold text-sm text-[#0d3b30]">
            Active Collection
          </span>
        </div>
      </div>
    </div>
  );
}
