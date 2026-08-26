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
  ArrowRight,
  Sparkles,
  TrendingUp
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
        setCollectionsList(["Luxury Collection", "Bridal Edit", "New Arrival", "Trending Collection"]);
      }
    } catch (_) {
      setCollectionsList(["Luxury Collection", "Bridal Edit", "New Arrival", "Trending Collection"]);
    }
  }, [categoryKey]);

  const totalDresses = dresses.length;
  const activeDresses = dresses.filter((d) => d.stockStatus === "In Stock").length;
  const outOfStockDresses = dresses.filter((d) => d.stockStatus === "Out of Stock").length;
  const totalCollections = collectionsList.length || 4;

  const isBridal = categoryKey.includes("bridal");
  const isGroom = categoryKey.includes("groom");
  const studioLabel = isBridal ? "Bridal Studio" : isGroom ? "Groom Studio" : "Wedding Studio";

  return (
    <div className="space-[#0d3b30] space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#0F4C45] to-[#16665D] rounded-3xl p-6 md:p-8 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 rounded-full bg-white/5 pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-gold text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            {studioLabel} Portal
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold">
            Welcome back, {vendorData?.boutique_name || vendorData?.name || "Studio Partner"}!
          </h1>
          <p className="text-white/80 text-sm max-w-xl">
            Manage your boutique collections, dresses, rental policies, and store customization from one central dashboard.
          </p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Total Collections */}
        <div className="bg-white rounded-2xl p-5 border border-gold/15 shadow-xs flex flex-col justify-between hover:border-emerald/40 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-charcoal/60 uppercase tracking-wider">Collections</span>
            <div className="w-9 h-9 rounded-xl bg-emerald/10 text-emerald flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl md:text-3xl font-bold text-charcoal font-display">{totalCollections}</span>
            <p className="text-[11px] text-charcoal/60 mt-1">Organized edits</p>
          </div>
        </div>

        {/* Total Dresses */}
        <div className="bg-white rounded-2xl p-5 border border-gold/15 shadow-xs flex flex-col justify-between hover:border-emerald/40 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-charcoal/60 uppercase tracking-wider">Total Outfits</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl md:text-3xl font-bold text-charcoal font-display">{totalDresses}</span>
            <p className="text-[11px] text-charcoal/60 mt-1">Catalog outfits</p>
          </div>
        </div>

        {/* Active Dresses */}
        <div className="bg-white rounded-2xl p-5 border border-gold/15 shadow-xs flex flex-col justify-between hover:border-emerald/40 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-charcoal/60 uppercase tracking-wider">Active</span>
            <div className="w-9 h-9 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl md:text-3xl font-bold text-emerald font-display">{activeDresses}</span>
            <p className="text-[11px] text-charcoal/60 mt-1">In Stock</p>
          </div>
        </div>

        {/* Out of Stock Dresses */}
        <div className="bg-white rounded-2xl p-5 border border-gold/15 shadow-xs flex flex-col justify-between hover:border-emerald/40 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-charcoal/60 uppercase tracking-wider">Out of Stock</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl md:text-3xl font-bold text-amber-600 font-display">{outOfStockDresses}</span>
            <p className="text-[11px] text-charcoal/60 mt-1">Requires restock</p>
          </div>
        </div>

        {/* Profile Views */}
        <div className="bg-white rounded-2xl p-5 border border-gold/15 shadow-xs flex flex-col justify-between hover:border-emerald/40 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-charcoal/60 uppercase tracking-wider">Store Views</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl md:text-3xl font-bold text-charcoal font-display">{profileViews}</span>
            <p className="text-[11px] text-charcoal/60 mt-1">Profile visits</p>
          </div>
        </div>

        {/* Wishlist Count */}
        <div className="bg-white rounded-2xl p-5 border border-gold/15 shadow-xs flex flex-col justify-between hover:border-emerald/40 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-charcoal/60 uppercase tracking-wider">Wishlist</span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Heart className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl md:text-3xl font-bold text-charcoal font-display">{wishlistCount}</span>
            <p className="text-[11px] text-charcoal/60 mt-1">Saved by brides</p>
          </div>
        </div>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gold/15 shadow-xs space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald/10 text-emerald flex items-center justify-center font-bold">
              1
            </div>
            <h3 className="font-display font-bold text-lg text-charcoal">Customize Your Storefront</h3>
            <p className="text-xs text-charcoal/70 leading-relaxed">
              Update studio information, logo, cover image, services, and rental policies for customers.
            </p>
          </div>
          <button
            onClick={() => onNavigate("customize-store")}
            className="w-full py-2.5 px-4 rounded-xl bg-emerald hover:bg-emerald/90 text-white font-medium text-xs flex items-center justify-center gap-2 transition-colors"
          >
            Customize Studio <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gold/15 shadow-xs space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald/10 text-emerald flex items-center justify-center font-bold">
              2
            </div>
            <h3 className="font-display font-bold text-lg text-charcoal">Organize Collections</h3>
            <p className="text-xs text-charcoal/70 leading-relaxed">
              Create collections like Luxury Collection, Reception Edits, or New Arrivals to organize dresses.
            </p>
          </div>
          <button
            onClick={() => onNavigate("collections-manager")}
            className="w-full py-2.5 px-4 rounded-xl bg-emerald hover:bg-emerald/90 text-white font-medium text-xs flex items-center justify-center gap-2 transition-colors"
          >
            Manage Collections <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gold/15 shadow-xs space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald/10 text-emerald flex items-center justify-center font-bold">
              3
            </div>
            <h3 className="font-display font-bold text-lg text-charcoal">Add & Manage Outfits</h3>
            <p className="text-xs text-charcoal/70 leading-relaxed">
              Add new dresses, upload images, set rental/purchase prices, sizes, colors, and stock status.
            </p>
          </div>
          <button
            onClick={() => onNavigate("story-collections")}
            className="w-full py-2.5 px-4 rounded-xl bg-emerald hover:bg-emerald/90 text-white font-medium text-xs flex items-center justify-center gap-2 transition-colors"
          >
            Manage Outfits <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
