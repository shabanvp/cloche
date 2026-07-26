"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  getVendorProfileConfig, saveVendorProfileConfig, VendorProfileConfig, CategoryType 
} from "@/lib/vendorTemplates";
import { DynamicVendorProfileRouter } from "@/components/vendor-templates/DynamicVendorProfileRouter";
import { 
  Palette, Eye, Save, Sparkles, CheckCircle2, ArrowLeft, Monitor, Smartphone, Layers
} from "lucide-react";
import { Button } from "@/components/Button";

export default function VendorCustomizeStorePage() {
  // Mock current logged in vendor
  const vendorId = "v-hyatt";
  const [config, setConfig] = useState<VendorProfileConfig>(getVendorProfileConfig(vendorId, "Wedding Venues"));
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("mobile");
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setConfig(getVendorProfileConfig(vendorId, "Wedding Venues"));
  }, []);

  const handleFieldChange = (field: keyof VendorProfileConfig, value: any) => {
    setConfig((prev) => ({ ...prev, [field]: value }));
  };

  const handleVisibilityToggle = (key: keyof VendorProfileConfig["visibility"]) => {
    setConfig((prev) => ({
      ...prev,
      visibility: { ...prev.visibility, [key]: !prev.visibility[key] },
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveVendorProfileConfig(config);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
    alert("Store Profile Template settings saved!");
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end pb-4 gap-4 border-b border-gold/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-gold/20 text-charcoal px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1">
              <Palette className="w-3.5 h-3.5 text-gold" /> Category Template Editor: {config.category}
            </span>
          </div>
          <h1 className="text-3xl font-display text-charcoal font-semibold mt-2">Customize Vendor Store Profile</h1>
          <p className="text-sm text-charcoal/70 mt-1">
            Update your category-specific content, specifications, and toggle section visibility.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={handleSave}
            className="bg-[#0F4C45] text-white px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-md hover:bg-[#12584E] transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" /> Save Template Changes
          </Button>
        </div>
      </div>

      {/* Editor & Live Device Preview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Form Editor (7 cols) */}
        <form onSubmit={handleSave} className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-gold/15 shadow-xl space-y-6">
          
          {/* Section 1: Business Branding */}
          <div className="space-y-4">
            <h3 className="font-display font-semibold text-lg text-charcoal flex items-center gap-2 border-b border-gold/10 pb-2">
              <span className="w-6 h-6 rounded-full bg-[#0F4C45] text-white text-xs flex items-center justify-center">1</span>
              Business Profile & Branding
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-semibold block text-charcoal/70 mb-1">Business Name</label>
                <input
                  type="text"
                  value={config.businessName}
                  onChange={(e) => handleFieldChange("businessName", e.target.value)}
                  className="w-full bg-[#FBF8F1] border border-gold/20 rounded-xl p-2.5 text-charcoal outline-none focus:border-emerald"
                />
              </div>

              <div>
                <label className="font-semibold block text-charcoal/70 mb-1">Tagline / Subtitle</label>
                <input
                  type="text"
                  value={config.tagline}
                  onChange={(e) => handleFieldChange("tagline", e.target.value)}
                  className="w-full bg-[#FBF8F1] border border-gold/20 rounded-xl p-2.5 text-charcoal outline-none focus:border-emerald"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-semibold block text-charcoal/70 mb-1">Cover Image URL</label>
                <input
                  type="text"
                  value={config.coverImage}
                  onChange={(e) => handleFieldChange("coverImage", e.target.value)}
                  className="w-full bg-[#FBF8F1] border border-gold/20 rounded-xl p-2.5 text-charcoal outline-none"
                />
              </div>

              <div>
                <label className="font-semibold block text-charcoal/70 mb-1">Logo Image URL</label>
                <input
                  type="text"
                  value={config.logo}
                  onChange={(e) => handleFieldChange("logo", e.target.value)}
                  className="w-full bg-[#FBF8F1] border border-gold/20 rounded-xl p-2.5 text-charcoal outline-none"
                />
              </div>
            </div>

            <div className="text-xs">
              <label className="font-semibold block text-charcoal/70 mb-1">About / Business Story</label>
              <textarea
                rows={3}
                value={config.aboutText}
                onChange={(e) => handleFieldChange("aboutText", e.target.value)}
                className="w-full bg-[#FBF8F1] border border-gold/20 rounded-xl p-2.5 text-charcoal outline-none"
              />
            </div>
          </div>

          {/* Section 2: Category Specific Fields */}
          <div className="space-y-4 pt-2">
            <h3 className="font-display font-semibold text-lg text-charcoal flex items-center gap-2 border-b border-gold/10 pb-2">
              <span className="w-6 h-6 rounded-full bg-[#0F4C45] text-white text-xs flex items-center justify-center">2</span>
              Category Specific Specifications ({config.category})
            </h3>

            {config.category === "Wedding Venues" && config.venueSpecs && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-[#FBF8F1] p-4 rounded-2xl border border-gold/15">
                <div>
                  <label className="font-semibold block text-charcoal/70 mb-1">Guest Capacity</label>
                  <input
                    type="text"
                    value={config.venueSpecs.guestCapacity}
                    onChange={(e) => handleFieldChange("venueSpecs", { ...config.venueSpecs, guestCapacity: e.target.value })}
                    className="w-full bg-white border border-gold/20 rounded-xl p-2 text-charcoal outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold block text-charcoal/70 mb-1">Guest Rooms</label>
                  <input
                    type="number"
                    value={config.venueSpecs.roomsCount}
                    onChange={(e) => handleFieldChange("venueSpecs", { ...config.venueSpecs, roomsCount: Number(e.target.value) })}
                    className="w-full bg-white border border-gold/20 rounded-xl p-2 text-charcoal outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold block text-charcoal/70 mb-1">Indoor / Outdoor</label>
                  <select
                    value={config.venueSpecs.indoorOutdoor}
                    onChange={(e) => handleFieldChange("venueSpecs", { ...config.venueSpecs, indoorOutdoor: e.target.value as any })}
                    className="w-full bg-white border border-gold/20 rounded-xl p-2 text-charcoal outline-none"
                  >
                    <option value="Both Indoor & Outdoor">Both Indoor & Outdoor</option>
                    <option value="Indoor Hall">Indoor Hall Only</option>
                    <option value="Outdoor Lawn">Outdoor Lawn Only</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold block text-charcoal/70 mb-1">Parking Capacity</label>
                  <input
                    type="text"
                    value={config.venueSpecs.parkingCapacity}
                    onChange={(e) => handleFieldChange("venueSpecs", { ...config.venueSpecs, parkingCapacity: e.target.value })}
                    className="w-full bg-white border border-gold/20 rounded-xl p-2 text-charcoal outline-none"
                  />
                </div>
              </div>
            )}

            {config.category === "Photographers" && config.photographerSpecs && (
              <div className="space-y-3 text-xs bg-[#FBF8F1] p-4 rounded-2xl border border-gold/15">
                <div>
                  <label className="font-semibold block text-charcoal/70 mb-1">Photography Styles (Comma Separated)</label>
                  <input
                    type="text"
                    value={config.photographerSpecs.photographyStyles.join(", ")}
                    onChange={(e) => handleFieldChange("photographerSpecs", { ...config.photographerSpecs, photographyStyles: e.target.value.split(",").map(s => s.trim()) })}
                    className="w-full bg-white border border-gold/20 rounded-xl p-2 text-charcoal outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold block text-charcoal/70 mb-1">Camera Equipment (Comma Separated)</label>
                  <input
                    type="text"
                    value={config.photographerSpecs.cameraEquipment.join(", ")}
                    onChange={(e) => handleFieldChange("photographerSpecs", { ...config.photographerSpecs, cameraEquipment: e.target.value.split(",").map(s => s.trim()) })}
                    className="w-full bg-white border border-gold/20 rounded-xl p-2 text-charcoal outline-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Section Visibility Toggles */}
          <div className="space-y-4 pt-2">
            <h3 className="font-display font-semibold text-lg text-charcoal flex items-center gap-2 border-b border-gold/10 pb-2">
              <span className="w-6 h-6 rounded-full bg-[#0F4C45] text-white text-xs flex items-center justify-center">3</span>
              Section Visibility Toggles
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              {Object.entries(config.visibility).map(([key, isVisible]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleVisibilityToggle(key as any)}
                  className={`p-2.5 rounded-xl border text-left font-bold capitalize transition-colors flex items-center justify-between ${
                    isVisible
                      ? "bg-[#0F4C45]/10 border-[#0F4C45] text-[#0F4C45]"
                      : "bg-gray-50 border-gray-200 text-gray-400"
                  }`}
                >
                  <span>{key.replace(/([A-Z])/g, " $1")}</span>
                  <span>{isVisible ? "✓ On" : "Off"}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <Button type="submit" className="bg-[#0F4C45] text-white rounded-xl px-8 py-3 font-bold uppercase text-xs">
              Save Store Profile
            </Button>
          </div>

        </form>

        {/* Right Column: Live Interactive Device Preview (5 cols) */}
        <div className="lg:col-span-5 sticky top-6 space-y-4">
          <div className="flex justify-between items-center bg-white p-3 rounded-2xl border border-gold/15 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-charcoal flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-gold" /> Live Store Preview
            </span>
            
            <div className="bg-[#F8F6F0] p-1 rounded-xl flex items-center gap-1">
              <button
                type="button"
                onClick={() => setPreviewDevice("mobile")}
                className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors ${
                  previewDevice === "mobile" ? "bg-[#0F4C45] text-white" : "text-charcoal/70"
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" /> Mobile
              </button>
              <button
                type="button"
                onClick={() => setPreviewDevice("desktop")}
                className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors ${
                  previewDevice === "desktop" ? "bg-[#0F4C45] text-white" : "text-charcoal/70"
                }`}
              >
                <Monitor className="w-3.5 h-3.5" /> Desktop
              </button>
            </div>
          </div>

          {/* Device Canvas Frame */}
          <div className="bg-[#F5F0E8] p-4 rounded-3xl border border-gold/20 shadow-xl overflow-hidden max-h-[750px] overflow-y-auto">
            <div className={`mx-auto bg-white rounded-2xl overflow-hidden shadow-2xl ${previewDevice === "mobile" ? "max-w-[340px]" : "w-full"}`}>
              <div className="p-3 border-b border-gray-100 bg-gray-50 text-[10px] font-mono text-gray-500 flex justify-between">
                <span>cloche.luxury/boutiques/{config.vendorId}</span>
                <span>Category: {config.category}</span>
              </div>
              <div className="p-3 scale-95 transform-gpu origin-top">
                <DynamicVendorProfileRouter vendorId={config.vendorId} initialConfig={config} />
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
