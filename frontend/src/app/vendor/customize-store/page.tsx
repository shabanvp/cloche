"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Palette, Upload, Image as ImageIcon, Save, Check } from "lucide-react";

export default function VendorCustomizeStorePage() {
  const [vendorCategory, setVendorCategory] = useState("Bridal Wear");
  const [businessName, setBusinessName] = useState("Your Store");
  const [description, setDescription] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const rawUserData = localStorage.getItem("cloche_user_data");
        const rawVendors = localStorage.getItem("cloche_registered_vendors");
        if (rawUserData) {
          const u = JSON.parse(rawUserData);
          if (u.name || u.boutique_name) setBusinessName(u.name || u.boutique_name);
          if (u.category) setVendorCategory(u.category);
          if (u.description) setDescription(u.description);
          if (u.logo) setLogoUrl(u.logo);
          if (u.coverImage) setCoverUrl(u.coverImage);
        } else if (rawVendors) {
          const v = JSON.parse(rawVendors);
          if (v.length > 0) {
            const first = v[0];
            if (first.boutique_name || first.name) setBusinessName(first.boutique_name || first.name);
            if (first.category) setVendorCategory(first.category);
            if (first.description) setDescription(first.description);
            if (first.logo) setLogoUrl(first.logo);
            if (first.coverImage) setCoverUrl(first.coverImage);
          }
        }
      } catch (e) {}
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto p-4 sm:p-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gold/15 pb-4 gap-4">
        <div>
          <Link href="/vendor" className="text-xs font-semibold text-[#0F4C45] hover:underline flex items-center gap-1 mb-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Navigation Hub
          </Link>
          <h1 className="text-3xl font-display font-bold text-charcoal">Customize Store</h1>
          <p className="text-sm text-charcoal/70 mt-0.5">Manage branding, logo, cover media, description & gallery appearance for {businessName}.</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6 bg-white p-6 sm:p-8 rounded-3xl border border-gold/15 shadow-sm">
        {isSaved && (
          <div className="p-4 rounded-xl bg-emerald/10 border border-emerald/20 text-[#0F4C45] text-xs font-bold flex items-center gap-2">
            <Check className="w-4 h-4 text-[#0F4C45]" /> Store branding and appearance updated successfully!
          </div>
        )}

        {/* Branding Images */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Logo Upload */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-charcoal/70 block">Store Logo / Profile Picture</label>
            <div className="flex items-center gap-4 bg-[#FAF7F2] p-4 rounded-2xl border border-gold/20">
              <div className="w-16 h-16 rounded-full bg-white border border-gold/20 flex items-center justify-center overflow-hidden shadow-sm">
                {logoUrl ? (
                  <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-6 h-6 text-charcoal/40" />
                )}
              </div>
              <div>
                <button type="button" className="bg-[#0F4C45] text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-[#12584E] transition-colors flex items-center gap-1.5 shadow-sm">
                  <Upload className="w-3.5 h-3.5" /> Upload Logo
                </button>
                <p className="text-[11px] text-charcoal/50 mt-1">PNG, JPG or WEBP (Square 500x500)</p>
              </div>
            </div>
          </div>

          {/* Cover Image Upload */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-charcoal/70 block">Store Showcase Cover Image</label>
            <div className="flex items-center gap-4 bg-[#FAF7F2] p-4 rounded-2xl border border-gold/20">
              <div className="w-24 h-16 rounded-xl bg-white border border-gold/20 flex items-center justify-center overflow-hidden shadow-sm">
                {coverUrl ? (
                  <img src={coverUrl} alt="Cover" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-6 h-6 text-charcoal/40" />
                )}
              </div>
              <div>
                <button type="button" className="bg-[#0F4C45] text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-[#12584E] transition-colors flex items-center gap-1.5 shadow-sm">
                  <Upload className="w-3.5 h-3.5" /> Upload Cover
                </button>
                <p className="text-[11px] text-charcoal/50 mt-1">Landscape Banner (1200x600)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Business Name */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-charcoal/70 block">Display Business Name</label>
          <input
            type="text"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-4 py-3 text-sm text-charcoal font-medium focus:outline-none focus:border-[#0F4C45]"
          />
        </div>

        {/* Store Category Tag */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-charcoal/70 block">Registered Vendor Category</label>
          <input
            type="text"
            readOnly
            value={vendorCategory}
            className="w-full bg-gray-100 border border-gray-200 rounded-xl px-4 py-3 text-sm text-charcoal/60 font-semibold cursor-not-allowed"
          />
        </div>

        {/* Store Description */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-charcoal/70 block">Store Description / Tagline</label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your wedding services, specialty, and unique offerings for couples..."
            className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl p-4 text-sm text-charcoal font-medium focus:outline-none focus:border-[#0F4C45]"
          />
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            className="bg-[#0F4C45] hover:bg-[#12584E] text-white px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors shadow-md flex items-center gap-2"
          >
            <Save className="w-4 h-4" /> Save Store Customization
          </button>
        </div>
      </form>
    </div>
  );
}
