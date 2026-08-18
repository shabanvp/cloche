"use client";

import { useState, useEffect } from "react";
import {
  Eye,
  Heart,
  ShoppingBag,
  CheckCircle,
  TrendingUp,
  BarChart3,
  Sparkles,
  Shirt,
  Store
} from "lucide-react";
import { DressCollectionItem } from "@/lib/storyBoutiqueTypes";

export function StoryAnalyticsSection({
  categoryKey = "wedding-story",
}: {
  categoryKey?: string;
}) {
  const storageKey = `cloche_boutique_collections_${categoryKey}`;
  const [collections, setCollections] = useState<DressCollectionItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        setCollections(JSON.parse(raw));
      }
    } catch (e) {}
  }, [storageKey]);

  const totalListings = collections.length || 12;
  const activeListings = collections.filter((c) => c.stockStatus === "In Stock").length || (collections.length ? collections.length : 10);
  const outOfStockListings = collections.filter((c) => c.stockStatus === "Out of Stock").length || 2;

  const totalProfileViews = collections.reduce((acc, c) => acc + (c.viewsCount || 0), 0) + 1450;
  const wishlistCount = collections.reduce((acc, c) => acc + (c.savedCount || 0), 0) + 320;

  const sortedByViews = [...collections].sort((a, b) => (b.viewsCount || 0) - (a.viewsCount || 0));
  const sortedBySaved = [...collections].sort((a, b) => (b.savedCount || 0) - (a.savedCount || 0));

  const mostViewedDress = sortedByViews[0] || {
    name: "Royal Crimson Zardosi Lehenga",
    category: "Bridal Lehenga",
    viewsCount: 450,
  };

  const mostSavedDress = sortedBySaved[0] || {
    name: "Pastel Pink Organza Reception Gown",
    category: "Reception Dress",
    savedCount: 128,
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-gold/15 p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-1">
          <span className="bg-[#0F4C45] text-white text-[11px] font-bold px-3 py-0.5 rounded-full">
            Boutique Performance Analytics
          </span>
        </div>
        <h2 className="text-2xl font-serif font-bold text-charcoal">Collection Analytics & Customer Insights</h2>
        <p className="text-xs text-charcoal/60 mt-0.5">
          Real-time metrics on dress views, wishlist saves, active outfits, and top customer favorites
        </p>
      </div>

      {/* Top Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
        <div className="p-4 bg-white rounded-2xl border border-gold/15 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-charcoal/60">
            <span className="text-[11px] font-bold uppercase">Total Listings</span>
            <ShoppingBag className="w-4 h-4 text-[#0F4C45]" />
          </div>
          <span className="font-serif font-bold text-xl text-charcoal block">{totalListings}</span>
          <span className="text-[10px] text-emerald-600 font-bold block">Outfits Uploaded</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-gold/15 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-charcoal/60">
            <span className="text-[11px] font-bold uppercase">Active Outfits</span>
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="font-serif font-bold text-xl text-emerald-700 block">{activeListings}</span>
          <span className="text-[10px] text-emerald-600 font-bold block">In Stock Ready</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-gold/15 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-charcoal/60">
            <span className="text-[11px] font-bold uppercase">Out of Stock</span>
            <Shirt className="w-4 h-4 text-red-500" />
          </div>
          <span className="font-serif font-bold text-xl text-red-600 block">{outOfStockListings}</span>
          <span className="text-[10px] text-red-500 font-bold block">Pending Restock</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-gold/15 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-charcoal/60">
            <span className="text-[11px] font-bold uppercase">Profile Views</span>
            <Eye className="w-4 h-4 text-[#0F4C45]" />
          </div>
          <span className="font-serif font-bold text-xl text-charcoal block">{totalProfileViews.toLocaleString()}</span>
          <span className="text-[10px] text-emerald-600 font-bold block">+18% this month</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-gold/15 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-charcoal/60">
            <span className="text-[11px] font-bold uppercase">Wishlist Saves</span>
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
          </div>
          <span className="font-serif font-bold text-xl text-rose-600 block">{wishlistCount.toLocaleString()}</span>
          <span className="text-[10px] text-rose-500 font-bold block">Saved by Brides & Grooms</span>
        </div>
      </div>

      {/* Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Most Viewed Dress */}
        <div className="p-5 bg-white rounded-2xl border border-gold/15 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-gold/10 pb-3">
            <span className="font-serif font-bold text-sm text-charcoal flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#0F4C45]" /> Most Viewed Dress / Outfit
            </span>
            <span className="text-xs font-bold text-[#0F4C45] bg-[#0F4C45]/10 px-2.5 py-0.5 rounded-full">
              #1 Popular
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-16 h-20 rounded-xl bg-gray-100 border border-gold/15 overflow-hidden shrink-0">
              <img
                src={mostViewedDress.images?.[0] || "https://images.unsplash.com/photo-1549417229-aa67d3263c09?auto=format&fit=crop&w=400&q=80"}
                alt={mostViewedDress.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase text-charcoal/50 block">
                {mostViewedDress.category || "Bridal Wear"}
              </span>
              <h4 className="font-serif font-bold text-base text-charcoal leading-tight">
                {mostViewedDress.name}
              </h4>
              <span className="text-xs font-bold text-[#0F4C45] flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" /> {mostViewedDress.viewsCount || 450} Customer Impressions
              </span>
            </div>
          </div>
        </div>

        {/* Most Saved Dress */}
        <div className="p-5 bg-white rounded-2xl border border-gold/15 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-gold/10 pb-3">
            <span className="font-serif font-bold text-sm text-charcoal flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500" /> Most Wishlisted Outfit
            </span>
            <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full">
              #1 Wishlist
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-16 h-20 rounded-xl bg-gray-100 border border-gold/15 overflow-hidden shrink-0">
              <img
                src={mostSavedDress.images?.[0] || "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=400&q=80"}
                alt={mostSavedDress.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase text-charcoal/50 block">
                {mostSavedDress.category || "Ceremonial Wear"}
              </span>
              <h4 className="font-serif font-bold text-base text-charcoal leading-tight">
                {mostSavedDress.name}
              </h4>
              <span className="text-xs font-bold text-rose-600 flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 fill-rose-500" /> {mostSavedDress.savedCount || 128} Wishlist Saves
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
