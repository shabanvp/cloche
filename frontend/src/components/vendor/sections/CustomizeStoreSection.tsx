"use client";

import { useState } from "react";
import { Palette, Upload, Image as ImageIcon, Sparkles, CheckCircle, Save, Eye } from "lucide-react";
import { VendorCategoryConfig } from "@/lib/vendor-categories";

interface CustomizeStoreSectionProps {
  categoryConfig: VendorCategoryConfig;
  vendorName: string;
}

export function CustomizeStoreSection({ categoryConfig, vendorName }: CustomizeStoreSectionProps) {
  const [saved, setSaved] = useState(false);
  const [logoUrl, setLogoUrl] = useState("https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop");
  const [coverUrl, setCoverUrl] = useState("https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop");

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 font-sans">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-gold/15 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-[#0F4C45] text-white text-[11px] font-bold px-3 py-0.5 rounded-full">
              Store Branding
            </span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-charcoal">Customize Storefront</h2>
          <p className="text-xs text-charcoal/60 mt-0.5">
            Personalize logo, banner image, brand aesthetic & highlight badges for couples on Cloche
          </p>
        </div>

        <button
          onClick={handleSave}
          className="bg-[#0F4C45] hover:bg-[#072B27] text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <Save className="w-4 h-4 text-gold" /> {saved ? "Store Branding Saved!" : "Save Branding"}
        </button>
      </div>

      {saved && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" /> Storefront branding updated successfully!
        </div>
      )}

      {/* Visual Live Preview Card */}
      <div className="bg-white rounded-2xl border border-gold/15 overflow-hidden shadow-xs space-y-0">
        <div className="p-4 bg-[#FAF7F2] border-b border-gold/10 flex items-center justify-between">
          <span className="text-xs font-serif font-bold text-charcoal flex items-center gap-1.5">
            <Eye className="w-4 h-4 text-[#0F4C45]" /> Live Storefront Preview ({categoryConfig.name})
          </span>
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
            Public View
          </span>
        </div>

        {/* Cover Banner & Logo Mockup */}
        <div className="relative h-44 sm:h-56 bg-gray-200">
          <img src={coverUrl} alt="Store Cover" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          <div className="absolute bottom-4 left-6 right-6 flex items-end gap-4 text-white">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-white overflow-hidden shadow-lg bg-white shrink-0">
              <img src={logoUrl} alt="Store Logo" className="w-full h-full object-cover" />
            </div>
            <div className="mb-1">
              <h3 className="text-xl sm:text-2xl font-serif font-bold drop-shadow-md">{vendorName || "Royal Wedding Partner"}</h3>
              <p className="text-xs text-white/90 font-medium">{categoryConfig.badge} • Jaipur, Rajasthan</p>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Logo Upload */}
        <div className="bg-white p-6 rounded-2xl border border-gold/15 space-y-4 shadow-xs">
          <h3 className="font-serif font-bold text-base text-charcoal flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-[#0F4C45]" /> Brand Logo / Emblem
          </h3>
          <p className="text-xs text-charcoal/60">Recommended square ratio (500x500 px PNG/JPG)</p>

          <div className="flex items-center gap-4">
            <img src={logoUrl} className="w-16 h-16 rounded-full border-2 border-gold/20 object-cover" alt="Logo" />
            <button className="bg-[#FAF7F2] border border-gold/20 hover:bg-[#F3EDE2] text-[#0F4C45] font-bold text-xs px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer">
              <Upload className="w-3.5 h-3.5" /> Upload New Logo
            </button>
          </div>
        </div>

        {/* Cover Banner Upload */}
        <div className="bg-white p-6 rounded-2xl border border-gold/15 space-y-4 shadow-xs">
          <h3 className="font-serif font-bold text-base text-charcoal flex items-center gap-2">
            <Palette className="w-4 h-4 text-[#0F4C45]" /> Store Cover Image
          </h3>
          <p className="text-xs text-charcoal/60">High resolution wide cover photo (1200x500 px)</p>

          <div className="flex items-center gap-4">
            <img src={coverUrl} className="w-24 h-14 rounded-lg border border-gold/20 object-cover" alt="Cover" />
            <button className="bg-[#FAF7F2] border border-gold/20 hover:bg-[#F3EDE2] text-[#0F4C45] font-bold text-xs px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer">
              <Upload className="w-3.5 h-3.5" /> Replace Cover
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
