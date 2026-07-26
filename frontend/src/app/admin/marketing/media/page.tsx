"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getMediaAssets, createMediaAsset, MediaAsset } from "@/lib/adStore";
import { Image as ImageIcon, Upload, Search, Tag, Eye, Layers, Plus, FileText } from "lucide-react";
import { Button } from "@/components/Button";

export default function AdminMarketingMediaLibraryPage() {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=80");
  const [type, setType] = useState<MediaAsset["type"]>("image");
  const [tagsInput, setTagsInput] = useState("Bridal, Hero");

  useEffect(() => {
    setAssets(getMediaAssets());
  }, []);

  const refreshAssets = () => {
    setAssets(getMediaAssets());
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMediaAsset({
      name,
      type,
      url,
      tags: tagsInput.split(",").map((t) => t.trim()),
    });
    refreshAssets();
    setIsUploadModalOpen(false);
    alert("New media asset added to Marketing Library!");
  };

  const filteredAssets = assets.filter((a) => {
    const matchesType = typeFilter === "All" || a.type === typeFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch = a.name.toLowerCase().includes(q) || a.tags.some((t) => t.toLowerCase().includes(q));
    return matchesType && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end pb-4 gap-4 border-b border-gold/10">
        <div>
          <h1 className="text-3xl font-display text-charcoal font-semibold">Digital Media & Asset Library</h1>
          <p className="text-sm text-charcoal/70 mt-1">
            Store, tag, and reuse high-resolution advertisement banners, logos, videos, and documents across campaigns.
          </p>
        </div>
        <Button
          onClick={() => setIsUploadModalOpen(true)}
          className="bg-[#0F4C45] text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-md hover:bg-[#12584E] transition-all flex items-center gap-2"
        >
          <Upload className="w-4 h-4" /> Upload Asset
        </Button>
      </div>

      {/* Submenu Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-gold/10 hide-scrollbar">
        <Link href="/admin/marketing" className="bg-white text-charcoal/70 hover:bg-gold/10 border border-gold/15 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
          Overview & Campaigns
        </Link>
        <Link href="/admin/marketing/inventory" className="bg-white text-charcoal/70 hover:bg-gold/10 border border-gold/15 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
          Inventory
        </Link>
        <Link href="/admin/marketing/calendar" className="bg-white text-charcoal/70 hover:bg-gold/10 border border-gold/15 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
          Campaign Calendar
        </Link>
        <Link href="/admin/marketing/media" className="bg-charcoal text-white px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
          Media Library ({assets.length})
        </Link>
        <Link href="/admin/marketing/contracts" className="bg-white text-charcoal/70 hover:bg-gold/10 border border-gold/15 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
          Contracts & Documents
        </Link>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 bg-white p-4 rounded-2xl border border-gold/15 shadow-sm">
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
          {["All", "image", "video", "logo", "document"].map((tab) => (
            <button
              key={tab}
              onClick={() => setTypeFilter(tab)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-colors ${
                typeFilter === tab ? "bg-charcoal text-white" : "bg-gray-100 text-charcoal/70 hover:bg-gray-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="relative sm:w-64">
          <input
            type="text"
            placeholder="Search assets or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#FBF8F1] border border-gold/20 rounded-full py-2 pl-9 pr-4 text-xs focus:outline-none focus:border-emerald text-charcoal"
          />
          <Search className="w-4 h-4 text-charcoal/40 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Assets Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredAssets.map((asset) => (
          <div key={asset.id} className="bg-white rounded-3xl border border-gold/20 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
            <div className="relative h-44 w-full bg-[#FBF8F1] border-b border-gold/10 overflow-hidden">
              <img src={asset.url} alt={asset.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <span className="absolute top-2 left-2 bg-[#0F4C45] text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow">
                {asset.type}
              </span>
            </div>

            <div className="p-4 space-y-2">
              <h4 className="font-display font-semibold text-charcoal text-sm leading-snug line-clamp-1">{asset.name}</h4>
              <div className="flex justify-between items-center text-[11px] text-charcoal/60">
                <span>{asset.resolution || asset.size}</span>
                <span>Used {asset.usageCount}x</span>
              </div>

              <div className="flex flex-wrap gap-1 pt-1">
                {asset.tags.map((t) => (
                  <span key={t} className="bg-gold/15 text-charcoal text-[9px] font-semibold px-2 py-0.5 rounded">
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleUploadSubmit} className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gold/20 space-y-4">
            <h3 className="font-display text-xl text-charcoal font-semibold border-b border-gold/10 pb-3">Upload Media Asset</h3>
            
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block text-charcoal/70 mb-1">Asset Name</label>
                <input
                  required
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#FBF8F1] border border-gold/20 rounded-xl p-2.5 text-charcoal outline-none"
                />
              </div>

              <div>
                <label className="font-semibold block text-charcoal/70 mb-1">Upload File / Image URL</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => setUrl(reader.result as string);
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="text-xs text-charcoal/80 mb-2"
                />
                <input
                  required
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full bg-[#FBF8F1] border border-gold/20 rounded-xl p-2.5 text-charcoal outline-none"
                />
              </div>

              <div>
                <label className="font-semibold block text-charcoal/70 mb-1">Asset Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full bg-[#FBF8F1] border border-gold/20 rounded-xl p-2.5 text-charcoal outline-none"
                >
                  <option value="image">Image Banner</option>
                  <option value="logo">Vendor Logo</option>
                  <option value="video">Video Banner</option>
                  <option value="document">Document PDF</option>
                </select>
              </div>

              <div>
                <label className="font-semibold block text-charcoal/70 mb-1">Tags (Comma Separated)</label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  className="w-full bg-[#FBF8F1] border border-gold/20 rounded-xl p-2.5 text-charcoal outline-none"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-3 border-t border-gold/10">
              <Button type="button" variant="ghost" onClick={() => setIsUploadModalOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-[#0F4C45] text-white rounded-xl text-xs font-bold uppercase">Save Asset</Button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
