"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  CheckCircle2,
  FolderHeart,
  Globe,
  Image as ImageIcon,
  Layers,
  Loader2,
  Paintbrush,
  Palette,
  Save,
  Sparkles,
  Star,
  Upload,
} from "lucide-react";
import {
  MEHENDI_COLOR_THEMES,
  type MehendiCollectionItem,
  type MehendiCustomizeStoreData,
  type MehendiPortfolioDesignItem,
  type MehendiProfileData,
} from "../types";

export interface MehendiCustomizeStoreSectionProps {
  customStore?: MehendiCustomizeStoreData | null;
  profile?: MehendiProfileData | null;
  portfolio?: MehendiPortfolioDesignItem[];
  collections?: MehendiCollectionItem[];
  onRefresh?: () => Promise<void>;
  showToast?: (msg: string, type?: "success" | "error") => void;
  vendorName?: string;
  artistName?: string;
  businessName?: string;
  onBack?: () => void;
}

export function MehendiCustomizeStoreSection({
  customStore = null,
  profile = null,
  portfolio = [],
  collections = [],
  onRefresh,
  showToast,
  vendorName,
  artistName,
  businessName,
  onBack,
}: MehendiCustomizeStoreSectionProps = {}) {
  const [themeId, setThemeId] = useState<string>(customStore?.themeId || "emerald");
  const [featuredDesignIds, setFeaturedDesignIds] = useState<string[]>(
    customStore?.featuredDesignIds || []
  );
  const [featuredCollectionIds, setFeaturedCollectionIds] = useState<string[]>(
    customStore?.featuredCollectionIds || []
  );
  const [portfolioOrder, setPortfolioOrder] = useState<"newest" | "featured" | "popular">(
    customStore?.portfolioDisplayOrder || "featured"
  );
  const [collectionOrder, setCollectionOrder] = useState<"manual" | "alphabetical" | "popular">(
    customStore?.collectionDisplayOrder || "manual"
  );

  const [saving, setSaving] = useState(false);

  const handleToggleFeaturedDesign = (id: string) => {
    setFeaturedDesignIds((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };

  const handleToggleFeaturedCollection = (id: string) => {
    setFeaturedCollectionIds((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/vendor/mehendi/customize", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          themeId,
          featuredDesignIds,
          featuredCollectionIds,
          portfolioDisplayOrder: portfolioOrder,
          collectionDisplayOrder: collectionOrder,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to save store customization");

      if (showToast) showToast("Store branding & customization saved live!");
      if (onRefresh) await onRefresh();
    } catch (err: any) {
      if (showToast) showToast(err.message || "Failed to save changes", "error");
    } finally {
      setSaving(false);
    }
  };

  const slug = profile?.slug || profile?.vendorId || "";

  return (
    <form onSubmit={handleSave} className="space-y-8 animate-in fade-in duration-300 pb-16">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6E6259] hover:text-[#2B2523] -mb-4 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
        </button>
      )}
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E6DDD0] pb-5">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#2B2523]">Customize Storefront</h2>
          <p className="text-xs text-[#7A6F67]">
            Select brand palette, showcase your finest henna work, and order your collections.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {slug && (
            <a
              href={`/mehendi-artists/${encodeURIComponent(slug)}?preview=1`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border border-[#E6DDD0] bg-white text-[#2B2523] hover:border-[#C8A96A]"
            >
              <Globe className="w-3.5 h-3.5 text-[#0F4C45]" />
              Live Store Preview
              <ArrowUpRight className="w-3.5 h-3.5 text-[#7A6F67]" />
            </a>
          )}
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold rounded-xl bg-[#0F4C45] text-white hover:bg-[#072B27] shadow-xs disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            {saving ? "Saving Changes..." : "Save Customization"}
          </button>
        </div>
      </div>

      {/* 1. Theme Color Palette */}
      <div className="bg-white rounded-2xl border border-[#E6DDD0] p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-3 border-b border-[#F0EAE0] pb-3">
          <Palette className="w-5 h-5 text-[#0F4C45]" />
          <div>
            <h3 className="font-serif font-bold text-base text-[#2B2523]">Storefront Brand Accent Theme</h3>
            <p className="text-xs text-[#7A6F67]">Choose the signature luxury palette that reflects your henna aesthetic</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {MEHENDI_COLOR_THEMES.map((theme) => {
            const active = themeId === theme.id;
            return (
              <div
                key={theme.id}
                onClick={() => setThemeId(theme.id)}
                className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between space-y-3 ${
                  active ? "border-[#0F4C45] shadow-xs bg-[#FAF7F2]" : "border-[#E6DDD0] hover:border-gray-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#2B2523]">{theme.label}</span>
                  {active && <Check className="w-4 h-4 text-[#0F4C45]" />}
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-6 rounded-full shadow-2xs" style={{ backgroundColor: theme.primary }} />
                  <div className="w-6 h-6 rounded-full shadow-2xs" style={{ backgroundColor: theme.secondary }} />
                  <div className="w-6 h-6 rounded-full shadow-2xs" style={{ backgroundColor: theme.accent }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Featured Portfolio Designs */}
      <div className="bg-white rounded-2xl border border-[#E6DDD0] p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#F0EAE0] pb-3">
          <div className="flex items-center gap-3">
            <Paintbrush className="w-5 h-5 text-[#0F4C45]" />
            <div>
              <h3 className="font-serif font-bold text-base text-[#2B2523]">Featured Designs Section</h3>
              <p className="text-xs text-[#7A6F67]">Pick your top designs to spotlight at the very top of your public profile</p>
            </div>
          </div>
          <span className="text-xs font-bold text-[#0F4C45]">
            {featuredDesignIds.length} Selected
          </span>
        </div>

        {portfolio.length === 0 ? (
          <p className="text-xs text-[#7A6F67] italic py-4 text-center">
            Upload designs in the Portfolio section first to select them as featured.
          </p>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 max-h-64 overflow-y-auto p-2 border border-[#E6DDD0] rounded-xl bg-[#FAF7F2]">
            {portfolio.map((p) => {
              const selected = featuredDesignIds.includes(p.id);
              return (
                <div
                  key={p.id}
                  onClick={() => handleToggleFeaturedDesign(p.id)}
                  className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                    selected ? "border-[#0F4C45] scale-95 shadow-xs" : "border-transparent opacity-75 hover:opacity-100"
                  }`}
                >
                  <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover" />
                  {selected && (
                    <div className="absolute inset-0 bg-[#0F4C45]/30 flex items-center justify-center">
                      <Star className="w-5 h-5 text-white fill-white" />
                    </div>
                  )}
                  <span className="absolute bottom-1 left-1 right-1 bg-black/60 text-white text-[9px] px-1 rounded truncate text-center">
                    {p.title}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 3. Featured Design Collections */}
      <div className="bg-white rounded-2xl border border-[#E6DDD0] p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#F0EAE0] pb-3">
          <div className="flex items-center gap-3">
            <FolderHeart className="w-5 h-5 text-[#0F4C45]" />
            <div>
              <h3 className="font-serif font-bold text-base text-[#2B2523]">Featured Collections Spotlight</h3>
              <p className="text-xs text-[#7A6F67]">Highlight your top collections on the homepage profile</p>
            </div>
          </div>
          <span className="text-xs font-bold text-[#0F4C45]">
            {featuredCollectionIds.length} Selected
          </span>
        </div>

        {collections.length === 0 ? (
          <p className="text-xs text-[#7A6F67] italic py-4 text-center">
            Create collections in the Design Collections section to feature them here.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {collections.map((c) => {
              const selected = featuredCollectionIds.includes(c.id);
              return (
                <div
                  key={c.id}
                  onClick={() => handleToggleFeaturedCollection(c.id)}
                  className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-3 ${
                    selected ? "border-[#0F4C45] bg-[#0F4C45]/5" : "border-[#E6DDD0] hover:border-gray-300"
                  }`}
                >
                  <div className="w-12 h-12 rounded-lg bg-[#FAF7F2] overflow-hidden shrink-0 border border-[#E6DDD0]">
                    {c.coverUrl ? (
                      <img src={c.coverUrl} alt={c.name} className="w-full h-full object-cover" />
                    ) : (
                      <FolderHeart className="w-6 h-6 text-[#C8A96A] m-auto mt-3" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-[#2B2523] truncate">{c.name}</p>
                    <p className="text-[10px] text-[#7A6F67]">{c.selectedDesignIds.length} designs</p>
                  </div>
                  {selected && <Check className="w-4 h-4 text-[#0F4C45] shrink-0" />}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. Display Ordering Options */}
      <div className="bg-white rounded-2xl border border-[#E6DDD0] p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-3 border-b border-[#F0EAE0] pb-3">
          <Layers className="w-5 h-5 text-[#0F4C45]" />
          <div>
            <h3 className="font-serif font-bold text-base text-[#2B2523]">Display Ordering Options</h3>
            <p className="text-xs text-[#7A6F67]">Configure how customers sort through your portfolio and sets</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#2B2523] mb-1">Portfolio Design Ordering</label>
            <select
              value={portfolioOrder}
              onChange={(e) => setPortfolioOrder(e.target.value as any)}
              className="w-full rounded-xl border border-[#E6DDD0] px-3.5 py-2 text-xs bg-white focus:outline-none focus:border-[#C8A96A]"
            >
              <option value="featured">Featured First, then Newest</option>
              <option value="newest">Newest Uploads First</option>
              <option value="popular">Most Viewed Designs First</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2B2523] mb-1">Collection Ordering</label>
            <select
              value={collectionOrder}
              onChange={(e) => setCollectionOrder(e.target.value as any)}
              className="w-full rounded-xl border border-[#E6DDD0] px-3.5 py-2 text-xs bg-white focus:outline-none focus:border-[#C8A96A]"
            >
              <option value="manual">Custom Curated Order</option>
              <option value="alphabetical">Alphabetical (A-Z)</option>
              <option value="popular">Most Inquired Collections</option>
            </select>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-8 py-3 text-sm font-semibold rounded-xl bg-[#0F4C45] text-white hover:bg-[#072B27] shadow-sm disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? "Saving Changes..." : "Save Customization"}
        </button>
      </div>
    </form>
  );
}
