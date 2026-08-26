"use client";

import { useState, useEffect } from "react";
import { 
  Layers, 
  ShoppingBag, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  Heart, 
  ArrowRight,
  Store,
  Sparkles,
  Shirt
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
    <div className="space-y-8 font-sans">
      {/* 1. Hero Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gold/15 shadow-sm space-y-2 relative overflow-hidden">
        <div className="flex items-center gap-2 mb-1">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0d3b30]/10 text-[#0d3b30] text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#c9a86a]" />
            Wedding Studio Portal
          </span>
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0d3b30] tracking-wide">
          Welcome back, {studioName}.
        </h1>
        <p className="text-gray-600 text-sm max-w-2xl leading-relaxed">
          Manage your bridal and groom collections, dresses, and boutique profile from one place.
        </p>
      </div>

      {/* 2. Overview Cards (Exactly Six Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Total Collections */}
        <div className="bg-white rounded-2xl p-5 border border-gold/15 shadow-xs flex flex-col justify-between hover:border-[#0d3b30]/30 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Total Collections</span>
            <div className="w-8 h-8 rounded-xl bg-[#0d3b30]/10 text-[#0d3b30] flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-bold text-[#0d3b30] font-serif block">{totalCollections}</span>
            <p className="text-[11px] text-gray-500 mt-0.5">Organized edits</p>
          </div>
        </div>

        {/* Total Dresses */}
        <div className="bg-white rounded-2xl p-5 border border-gold/15 shadow-xs flex flex-col justify-between hover:border-[#0d3b30]/30 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Total Dresses</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-bold text-[#0d3b30] font-serif block">{totalDresses}</span>
            <p className="text-[11px] text-gray-500 mt-0.5">Total outfits</p>
          </div>
        </div>

        {/* Active Dresses */}
        <div className="bg-white rounded-2xl p-5 border border-gold/15 shadow-xs flex flex-col justify-between hover:border-[#0d3b30]/30 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Active Dresses</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-bold text-emerald-700 font-serif block">{activeDresses}</span>
            <p className="text-[11px] text-emerald-600 font-medium mt-0.5">In Stock</p>
          </div>
        </div>

        {/* Out of Stock */}
        <div className="bg-white rounded-2xl p-5 border border-gold/15 shadow-xs flex flex-col justify-between hover:border-[#0d3b30]/30 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Out of Stock</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-bold text-amber-600 font-serif block">{outOfStockDresses}</span>
            <p className="text-[11px] text-amber-600 font-medium mt-0.5">Needs restock</p>
          </div>
        </div>

        {/* Profile Views */}
        <div className="bg-white rounded-2xl p-5 border border-gold/15 shadow-xs flex flex-col justify-between hover:border-[#0d3b30]/30 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Profile Views</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-bold text-[#0d3b30] font-serif block">{profileViews}</span>
            <p className="text-[11px] text-gray-500 mt-0.5">Visits</p>
          </div>
        </div>

        {/* Wishlist Saves */}
        <div className="bg-white rounded-2xl p-5 border border-gold/15 shadow-xs flex flex-col justify-between hover:border-[#0d3b30]/30 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Wishlist Saves</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Heart className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-bold text-[#0d3b30] font-serif block">{wishlistCount}</span>
            <p className="text-[11px] text-gray-500 mt-0.5">Saved outfits</p>
          </div>
        </div>
      </div>

      {/* 3. Quick Actions (Three Prominent Action Cards Only) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Customize Studio Card */}
        <div className="bg-white rounded-3xl p-6 border border-gold/15 shadow-sm space-y-5 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#0d3b30]/10 text-[#0d3b30] flex items-center justify-center">
              <Store className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-xl text-[#0d3b30]">Customize Studio</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Update your store logo, cover image, about description, contact details, business hours, and rental policies.
            </p>
            <div className="pt-1 flex flex-wrap gap-1.5 text-[11px] text-gray-600 font-medium">
              <span className="px-2 py-0.5 rounded-md bg-[#F8F6F2] border border-gray-200">Logo</span>
              <span className="px-2 py-0.5 rounded-md bg-[#F8F6F2] border border-gray-200">Cover Image</span>
              <span className="px-2 py-0.5 rounded-md bg-[#F8F6F2] border border-gray-200">About</span>
              <span className="px-2 py-0.5 rounded-md bg-[#F8F6F2] border border-gray-200">Contact</span>
              <span className="px-2 py-0.5 rounded-md bg-[#F8F6F2] border border-gray-200">Business Hours</span>
              <span className="px-2 py-0.5 rounded-md bg-[#F8F6F2] border border-gray-200">Rental Policies</span>
            </div>
          </div>
          <button
            onClick={() => onNavigate("customize-store")}
            className="w-full py-3 px-4 rounded-xl bg-[#0d3b30] hover:bg-[#082921] text-white font-medium text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
          >
            Customize Studio <ArrowRight className="w-4 h-4 text-[#c9a86a]" />
          </button>
        </div>

        {/* Collections Card */}
        <div className="bg-white rounded-3xl p-6 border border-gold/15 shadow-sm space-y-5 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#0d3b30]/10 text-[#0d3b30] flex items-center justify-center">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-xl text-[#0d3b30]">Collections</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Organize your dresses into curated collections for easy browsing by brides and grooms.
            </p>
            <div className="pt-1 flex flex-wrap gap-1.5 text-[11px] text-gray-600 font-medium">
              <span className="px-2 py-0.5 rounded-md bg-[#F8F6F2] border border-gray-200">Bridal Collection</span>
              <span className="px-2 py-0.5 rounded-md bg-[#F8F6F2] border border-gray-200">Groom Collection</span>
              <span className="px-2 py-0.5 rounded-md bg-[#F8F6F2] border border-gray-200">Reception Collection</span>
              <span className="px-2 py-0.5 rounded-md bg-[#F8F6F2] border border-gray-200">Luxury Collection</span>
            </div>
          </div>
          <button
            onClick={() => onNavigate("collections-manager")}
            className="w-full py-3 px-4 rounded-xl bg-[#0d3b30] hover:bg-[#082921] text-white font-medium text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
          >
            Manage Collections <ArrowRight className="w-4 h-4 text-[#c9a86a]" />
          </button>
        </div>

        {/* Dresses Card */}
        <div className="bg-white rounded-3xl p-6 border border-gold/15 shadow-sm space-y-5 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#0d3b30]/10 text-[#0d3b30] flex items-center justify-center">
              <Shirt className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-xl text-[#0d3b30]">Dresses</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Upload outfits, set rental and purchase prices, available sizes, colors, fabric details, and stock availability.
            </p>
            <div className="pt-1 flex flex-wrap gap-1.5 text-[11px] text-gray-600 font-medium">
              <span className="px-2 py-0.5 rounded-md bg-[#F8F6F2] border border-gray-200">Photos</span>
              <span className="px-2 py-0.5 rounded-md bg-[#F8F6F2] border border-gray-200">Pricing</span>
              <span className="px-2 py-0.5 rounded-md bg-[#F8F6F2] border border-gray-200">Sizes & Colors</span>
              <span className="px-2 py-0.5 rounded-md bg-[#F8F6F2] border border-gray-200">Stock Status</span>
            </div>
          </div>
          <button
            onClick={() => onNavigate("story-collections")}
            className="w-full py-3 px-4 rounded-xl bg-[#0d3b30] hover:bg-[#082921] text-white font-medium text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
          >
            Manage Dresses <ArrowRight className="w-4 h-4 text-[#c9a86a]" />
          </button>
        </div>
      </div>
    </div>
  );
}
