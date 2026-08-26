"use client";

import { useState, useEffect } from "react";
import { 
  Layers, 
  ShoppingBag, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  Heart, 
  Plus,
  Store,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Clock,
  Sparkle
} from "lucide-react";
import { getActiveVendorIdentity, fetchAuthenticatedVendorFromDb } from "@/lib/vendorStore";
import { DressCollectionItem } from "@/lib/storyBoutiqueTypes";

interface StoryBoutiqueOverviewProps {
  categoryKey: string;
  onNavigate: (tabId: string) => void;
}

export function StoryBoutiqueOverview({ categoryKey, onNavigate }: StoryBoutiqueOverviewProps) {
  const [vendorData, setVendorData] = useState<any>(null);
  const [dresses, setDresses] = useState<DressCollectionItem[]>([]);
  const [collectionsList, setCollectionsList] = useState<string[]>([]);
  const [profileViews, setProfileViews] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  useEffect(() => {
    const cached = getActiveVendorIdentity();
    if (cached) setVendorData(cached);

    fetchAuthenticatedVendorFromDb().then((identity) => {
      if (identity) {
        setVendorData(identity);
        setProfileViews((identity as any).profileViews || (identity as any).view_count || 142);
        setWishlistCount((identity as any).wishlistCount || (identity as any).wishlist_count || 38);
      }
    });

    const storageKey = `cloche_boutique_collections_${categoryKey}`;
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setDresses(parsed);
        }
      }
    } catch (_) {}

    const collectionsStorageKey = `cloche_studio_collections_list_${categoryKey}`;
    try {
      const storedCols = localStorage.getItem(collectionsStorageKey);
      if (storedCols) {
        const parsedCols = JSON.parse(storedCols);
        if (Array.isArray(parsedCols)) {
          setCollectionsList(parsedCols.map((c: any) => typeof c === "string" ? c : c.name));
        }
      } else {
        setCollectionsList(["Bridal Collection", "Groom Collection", "Reception Collection", "Luxury Collection"]);
      }
    } catch (_) {
      setCollectionsList(["Bridal Collection", "Groom Collection", "Reception Collection", "Luxury Collection"]);
    }
  }, [categoryKey]);

  const totalDresses = dresses.length;
  const activeDresses = dresses.filter((d) => d.stockStatus === "In Stock").length;
  const outOfStockDresses = dresses.filter((d) => d.stockStatus === "Out of Stock").length;
  const totalCollections = collectionsList.length || 4;

  const studioName = vendorData?.boutique_name || vendorData?.name || "Royal Wedding Studio";

  return (
    <div className="space-y-8 font-sans pb-8">
      {/* 1. Welcoming Hero Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gold/15 shadow-sm space-y-3 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0d3b30]/10 text-[#0d3b30] text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#c9a86a]" />
            Wedding Studio Portal
          </span>
          <span className="text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Live Storefront Active
          </span>
        </div>

        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0d3b30] tracking-wide">
          Welcome back, {studioName}.
        </h1>
        <p className="text-gray-600 text-xs sm:text-sm max-w-2xl leading-relaxed">
          Manage your bridal and groom collections, outfits, pricing, and studio profile to attract couples and grow your rental bookings.
        </p>

        {/* Top Quick Actions Buttons */}
        <div className="pt-2 flex flex-wrap items-center gap-3">
          <button
            onClick={() => onNavigate("story-collections")}
            className="py-2.5 px-4 rounded-xl bg-[#0d3b30] hover:bg-[#082921] text-white font-medium text-xs flex items-center gap-2 transition-all shadow-xs"
          >
            <Plus className="w-4 h-4 text-[#c9a86a]" /> Add New Outfit
          </button>

          <button
            onClick={() => onNavigate("collections-manager")}
            className="py-2.5 px-4 rounded-xl bg-[#F8F6F2] hover:bg-[#FAF7F2] text-[#0d3b30] border border-gray-200 font-medium text-xs flex items-center gap-2 transition-all"
          >
            <Layers className="w-4 h-4 text-[#0d3b30]" /> Create Collection
          </button>

          <button
            onClick={() => onNavigate("customize-store")}
            className="py-2.5 px-4 rounded-xl bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 font-medium text-xs flex items-center gap-2 transition-all"
          >
            <Store className="w-4 h-4 text-[#0d3b30]" /> Edit Studio Profile
          </button>
        </div>
      </div>

      {/* 2. Three Core Questions Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Question 1: How is my studio performing? */}
        <div className="bg-white rounded-3xl p-6 border border-gold/15 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-serif font-bold text-base text-[#0d3b30] flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#c9a86a]" /> Studio Performance
              </h3>
              <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                Healthy
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="p-3 bg-[#F8F6F2] rounded-2xl border border-gray-100 space-y-1">
                <span className="text-[10px] font-semibold text-gray-500 uppercase block">Profile Views</span>
                <span className="font-serif font-bold text-xl text-[#0d3b30] block">{profileViews}</span>
                <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
                  <Eye className="w-3 h-3" /> Visits
                </span>
              </div>

              <div className="p-3 bg-[#F8F6F2] rounded-2xl border border-gray-100 space-y-1">
                <span className="text-[10px] font-semibold text-gray-500 uppercase block">Wishlist Saves</span>
                <span className="font-serif font-bold text-xl text-rose-600 block">{wishlistCount}</span>
                <span className="text-[10px] text-rose-500 font-medium flex items-center gap-1">
                  <Heart className="w-3 h-3 fill-rose-500" /> Saved
                </span>
              </div>

              <div className="p-3 bg-[#F8F6F2] rounded-2xl border border-gray-100 space-y-1">
                <span className="text-[10px] font-semibold text-gray-500 uppercase block">Active Outfits</span>
                <span className="font-serif font-bold text-xl text-emerald-700 block">{activeDresses}</span>
                <span className="text-[10px] text-emerald-600 font-medium block">Ready to Rent</span>
              </div>

              <div className="p-3 bg-[#F8F6F2] rounded-2xl border border-gray-100 space-y-1">
                <span className="text-[10px] font-semibold text-gray-500 uppercase block">Collections</span>
                <span className="font-serif font-bold text-xl text-[#0d3b30] block">{totalCollections}</span>
                <span className="text-[10px] text-gray-500 block">Themes</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate("story-analytics")}
            className="w-full py-2.5 px-4 rounded-xl bg-gray-50 hover:bg-gray-100 text-[#0d3b30] font-medium text-xs flex items-center justify-center gap-2 transition-colors border border-gray-200"
          >
            View Detailed Insights <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Question 2: What needs my attention today? */}
        <div className="bg-white rounded-3xl p-6 border border-gold/15 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-serif font-bold text-base text-[#0d3b30] flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-500" /> Needs Attention Today
              </h3>
              <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full">
                {outOfStockDresses > 0 ? `${outOfStockDresses} Alerts` : "All Clear"}
              </span>
            </div>

            {outOfStockDresses > 0 ? (
              <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200/60 space-y-2">
                <div className="flex items-center gap-2 text-amber-800 font-semibold text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                  <span>{outOfStockDresses} Outfits Out of Stock</span>
                </div>
                <p className="text-xs text-amber-700/90 leading-relaxed">
                  Couples cannot book rentals for out-of-stock items. Restock or toggle their status to keep catalog fresh.
                </p>
              </div>
            ) : (
              <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200/60 space-y-2">
                <div className="flex items-center gap-2 text-emerald-800 font-semibold text-xs">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>All Outfits In Stock</span>
                </div>
                <p className="text-xs text-emerald-700/90 leading-relaxed">
                  Your outfit inventory is active and ready for couple inquiries on Cloche.
                </p>
              </div>
            )}

            <div className="p-3 bg-[#F8F6F2] rounded-2xl border border-gray-100 flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-xs font-semibold text-gray-800 block">Studio Profile Completeness</span>
                <span className="text-[11px] text-gray-500 block">Photos, Contact & Rental Policies</span>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
                95% Complete
              </span>
            </div>
          </div>

          <button
            onClick={() => onNavigate("story-collections")}
            className="w-full py-2.5 px-4 rounded-xl bg-gray-50 hover:bg-gray-100 text-[#0d3b30] font-medium text-xs flex items-center justify-center gap-2 transition-colors border border-gray-200"
          >
            Manage Outfit Inventory <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Question 3: What should I do next? */}
        <div className="bg-white rounded-3xl p-6 border border-gold/15 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-serif font-bold text-base text-[#0d3b30] flex items-center gap-2">
                <Sparkle className="w-4 h-4 text-[#c9a86a]" /> Recommended Next Steps
              </h3>
              <span className="text-[11px] font-semibold text-[#0d3b30] bg-[#0d3b30]/10 px-2.5 py-0.5 rounded-full">
                Growth Tips
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 bg-[#F8F6F2] rounded-2xl border border-gray-100 space-y-1">
                <span className="font-semibold text-gray-800 block">1. Add New Season Outfits</span>
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  Boutiques with 10+ active outfits receive 3x more WhatsApp inquiries from brides.
                </p>
              </div>

              <div className="p-3 bg-[#F8F6F2] rounded-2xl border border-gray-100 space-y-1">
                <span className="font-semibold text-gray-800 block">2. Organize a Reception Edit</span>
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  Create a dedicated collection for evening reception gowns & tuxedos.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate("collections-manager")}
            className="w-full py-2.5 px-4 rounded-xl bg-gray-50 hover:bg-gray-100 text-[#0d3b30] font-medium text-xs flex items-center justify-center gap-2 transition-colors border border-gray-200"
          >
            Create New Collection <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
