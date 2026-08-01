"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  getVenueCmsData, saveVenueCmsData, getVenueVersionHistory, restoreVenueVersion, 
  VenueCmsData, CmsVersionSnapshot 
} from "@/lib/venueCmsStore";
import { VenueProfileTemplate } from "@/components/vendor-templates/VenueProfileTemplate";
import { 
  Building2, Save, Sparkles, CheckCircle2, History, RotateCcw, AlertTriangle, 
  Image as ImageIcon, Plus, Trash2, ShieldCheck, MapPin, Calendar, Star, MessageSquare, 
  HelpCircle, Search, Check, Lock, X, ExternalLink, Eye, LayoutGrid, Columns
} from "lucide-react";
import { Button } from "@/components/Button";

export default function VendorVenueCmsPage() {
  const mockVendorCategory = "Wedding Venue";
  const [vendorId, setVendorId] = useState<string>("v-solitaire");
  const [cmsData, setCmsData] = useState<VenueCmsData>(() => getVenueCmsData("v-solitaire"));
  const [activeTab, setActiveTab] = useState<"profile" | "hero" | "venueInfo" | "amenities" | "packages" | "availability" | "reviews" | "faqs" | "seo">("profile");
  const [viewMode, setViewMode] = useState<"split" | "editor" | "preview">("split");
  
  const [autoSaveStatus, setAutoSaveStatus] = useState<"Saved" | "Saving..." | "Unsaved Changes">("Saved");
  const [versionHistory, setVersionHistory] = useState<CmsVersionSnapshot[]>([]);
  const [isVersionModalOpen, setIsVersionModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New item draft states
  const [newPkgName, setNewPkgName] = useState("");
  const [newPkgPrice, setNewPkgPrice] = useState("");
  const [newFaqQ, setNewFaqQ] = useState("");
  const [newFaqA, setNewFaqA] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const regRaw = localStorage.getItem("cloche_registered_venues");
      if (regRaw) {
        try {
          const list = JSON.parse(regRaw);
          if (Array.isArray(list) && list.length > 0) {
            const latest = list[0];
            const resolvedId = latest.id || latest.vendorId || latest.slug;
            if (resolvedId) {
              setVendorId(resolvedId);
              const loaded = getVenueCmsData(resolvedId);
              setCmsData(loaded);
              setVersionHistory(getVenueVersionHistory(resolvedId));
              return;
            }
          }
        } catch (e) {}
      }
      setCmsData(getVenueCmsData(vendorId));
      setVersionHistory(getVenueVersionHistory(vendorId));
    }
  }, []);

  const isVenueVendor = mockVendorCategory === "Wedding Venue" || mockVendorCategory === "Wedding Venues";

  if (!isVenueVendor) {
    return (
      <div className="max-w-2xl mx-auto my-12 p-8 bg-white rounded-3xl border border-red-200 text-center space-y-4 shadow-xl">
        <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="font-display font-semibold text-2xl text-charcoal">Venue CMS Module Restricted</h2>
        <p className="text-sm text-charcoal/70">
          The Wedding Venue Customization Editor is exclusively available to registered <strong>Wedding Venue</strong> partners.
        </p>
        <div className="pt-2">
          <Link href="/vendor/dashboard" className="bg-[#0F4C45] text-white px-6 py-2.5 rounded-xl font-bold text-xs uppercase inline-block">
            Return to Vendor Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleUpdate = (updater: (prev: VenueCmsData) => VenueCmsData) => {
    setAutoSaveStatus("Saving...");
    setCmsData((prev) => {
      const updated = updater(prev);
      saveVenueCmsData(updated, "Draft");
      setTimeout(() => setAutoSaveStatus("Saved"), 400);
      return updated;
    });
  };

  const handlePublish = () => {
    saveVenueCmsData(cmsData, "Published");
    setVersionHistory(getVenueVersionHistory(cmsData.id));
    showToast("Venue Profile Published Live to Cloche!");
  };

  const handleRestoreVersion = (snapshot: CmsVersionSnapshot) => {
    const restored = restoreVenueVersion(snapshot);
    setCmsData(restored);
    setIsVersionModalOpen(false);
    showToast(`Restored profile snapshot from ${snapshot.timestamp}`);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-16">
      
      {/* Toast Banner */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-[100] bg-[#0F4C45] text-white px-6 py-3 rounded-2xl shadow-2xl font-bold text-xs flex items-center gap-2 border border-gold/30">
          <CheckCircle2 className="w-4 h-4 text-emerald" /> {toastMessage}
        </div>
      )}

      {/* Action Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 gap-4 border-b border-gold/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-[#0F4C45]/10 text-[#0F4C45] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 border border-[#0F4C45]/20">
              <Building2 className="w-3.5 h-3.5 text-gold" /> Exclusive Wedding Venue CMS
            </span>
            <span className="text-xs text-charcoal/60 font-semibold flex items-center gap-1">
              <Check className="w-3.5 h-3.5 text-emerald" /> {autoSaveStatus}
            </span>
          </div>
          <h1 className="text-3xl font-display text-charcoal font-semibold mt-1">Wedding Venue Store Customizer</h1>
        </div>

        {/* View Mode & Actions Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Layout Toggle */}
          <div className="bg-[#FBF8F1] border border-gold/20 p-1 rounded-xl flex items-center gap-1">
            <button
              onClick={() => setViewMode("editor")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                viewMode === "editor" ? "bg-[#0F4C45] text-white shadow" : "text-charcoal/70 hover:text-charcoal"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" /> Editor
            </button>
            <button
              onClick={() => setViewMode("split")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                viewMode === "split" ? "bg-[#0F4C45] text-white shadow" : "text-charcoal/70 hover:text-charcoal"
              }`}
            >
              <Columns className="w-3.5 h-3.5" /> Split View
            </button>
            <button
              onClick={() => setViewMode("preview")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                viewMode === "preview" ? "bg-[#0F4C45] text-white shadow" : "text-charcoal/70 hover:text-charcoal"
              }`}
            >
              <Eye className="w-3.5 h-3.5" /> Live Preview
            </button>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={() => setIsVersionModalOpen(true)}
            className="border-gold/20 text-charcoal rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
          >
            <History className="w-3.5 h-3.5 text-gold" /> History
          </Button>

          <Link
            href={`/venues/${cmsData.id}`}
            target="_blank"
            className="bg-white border border-[#0F4C45] text-[#0F4C45] px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider shadow-xs hover:bg-[#0F4C45]/5 flex items-center gap-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5" /> View Live Page
          </Link>

          <Button
            type="button"
            onClick={handlePublish}
            className="bg-[#0F4C45] text-white px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider shadow-md hover:bg-[#12584E]"
          >
            Publish Venue Changes
          </Button>
        </div>
      </div>

      {/* Main Container Grid depending on View Mode */}
      <div className={viewMode === "split" ? "grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" : "max-w-5xl mx-auto"}>
        
        {/* CMS Form Editor Panel */}
        {(viewMode === "editor" || viewMode === "split") && (
          <div className={viewMode === "split" ? "lg:col-span-5 space-y-6" : "space-y-6"}>
            
            {/* Section Navigation Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 border-b border-gold/10 hide-scrollbar">
              {[
                { id: "profile", label: "Profile" },
                { id: "hero", label: "Hero Gallery" },
                { id: "venueInfo", label: "Venue Info" },
                { id: "amenities", label: "Amenities" },
                { id: "packages", label: "Packages" },
                { id: "faqs", label: "FAQ" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                    activeTab === tab.id
                      ? "bg-[#0F4C45] text-white shadow-md"
                      : "bg-white text-charcoal/70 hover:bg-gold/10 border border-gold/15"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab 1: Business Profile */}
            {activeTab === "profile" && (
              <div className="bg-white rounded-3xl p-6 border border-gold/15 shadow-sm space-y-4">
                <h3 className="font-display text-xl text-charcoal font-semibold border-b border-gold/10 pb-3">1. Business Profile & Contact Details</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="font-semibold block text-charcoal/70 mb-1">Venue Name</label>
                    <input
                      type="text"
                      value={cmsData.businessProfile.businessName}
                      onChange={(e) => handleUpdate((p) => ({ ...p, businessProfile: { ...p.businessProfile, businessName: e.target.value } }))}
                      className="w-full bg-[#FBF8F1] border border-gold/20 rounded-xl p-2.5 font-bold text-charcoal outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-semibold block text-charcoal/70 mb-1">Tagline / Subtitle</label>
                    <input
                      type="text"
                      value={cmsData.businessProfile.tagline}
                      onChange={(e) => handleUpdate((p) => ({ ...p, businessProfile: { ...p.businessProfile, tagline: e.target.value } }))}
                      className="w-full bg-[#FBF8F1] border border-gold/20 rounded-xl p-2.5 text-charcoal outline-none"
                    />
                  </div>
                </div>

                <div className="text-xs">
                  <label className="font-semibold block text-charcoal/70 mb-1">Venue Overview & Story</label>
                  <textarea
                    rows={4}
                    value={cmsData.businessProfile.description}
                    onChange={(e) => handleUpdate((p) => ({ ...p, businessProfile: { ...p.businessProfile, description: e.target.value } }))}
                    className="w-full bg-[#FBF8F1] border border-gold/20 rounded-xl p-2.5 text-charcoal outline-none leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="font-semibold block text-charcoal/70 mb-1">Contact Phone</label>
                    <input
                      type="text"
                      value={cmsData.businessProfile.contactNumber}
                      onChange={(e) => handleUpdate((p) => ({ ...p, businessProfile: { ...p.businessProfile, contactNumber: e.target.value } }))}
                      className="w-full bg-[#FBF8F1] border border-gold/20 rounded-xl p-2.5 text-charcoal outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-semibold block text-charcoal/70 mb-1">WhatsApp Concierge</label>
                    <input
                      type="text"
                      value={cmsData.businessProfile.whatsapp}
                      onChange={(e) => handleUpdate((p) => ({ ...p, businessProfile: { ...p.businessProfile, whatsapp: e.target.value } }))}
                      className="w-full bg-[#FBF8F1] border border-gold/20 rounded-xl p-2.5 text-charcoal outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Hero Gallery */}
            {activeTab === "hero" && (
              <div className="bg-white rounded-3xl p-6 border border-gold/15 shadow-sm space-y-4">
                <div className="border-b border-gold/10 pb-3">
                  <h3 className="font-display text-xl text-charcoal font-semibold">2. Venue Photos & Gallery</h3>
                  <p className="text-xs text-charcoal/60 mt-1">
                    Upload high-resolution photos of your venue (lawns, banquets, stage & amenities). The first uploaded photo will automatically be featured as your main venue cover image.
                  </p>
                </div>

                <div className="space-y-4 pt-1">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold text-xs text-charcoal/70">Uploaded Venue Photos ({cmsData.heroGallery.images.length})</h4>
                    <label className="cursor-pointer bg-[#0F4C45] hover:bg-[#0F4C45]/90 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-sm transition-all active:scale-95">
                      <Plus className="w-4 h-4 text-gold" />
                      <span>+ Upload Venue Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={(e) => {
                          const files = Array.from(e.target.files || []);
                          if (files.length > 0) {
                            let loadedCount = 0;
                            const newAdditions: { id: string; url: string; caption: string }[] = [];
                            files.forEach((file) => {
                              const reader = new FileReader();
                              reader.onload = (ev) => {
                                const res = ev.target?.result as string;
                                if (res) {
                                  newAdditions.push({
                                    id: `hero-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
                                    url: res,
                                    caption: file.name.replace(/\.[^/.]+$/, ""),
                                  });
                                }
                                loadedCount++;
                                if (loadedCount === files.length) {
                                  handleUpdate((p) => {
                                    const nonDemo = p.heroGallery.images.filter(
                                      (i) => !i.id.startsWith("h1") && !i.id.startsWith("h2") && !i.id.startsWith("h3") && !i.url.includes("photo-1519167758481") && !i.url.includes("photo-1542314831") && !i.url.includes("photo-1566073771259")
                                    );
                                    const updatedImages = [...nonDemo, ...newAdditions];
                                    return {
                                      ...p,
                                      heroGallery: {
                                        coverImage: updatedImages[0]?.url || "",
                                        images: updatedImages,
                                      },
                                    };
                                  });
                                }
                              };
                              reader.readAsDataURL(file);
                            });
                          }
                        }}
                      />
                    </label>
                  </div>

                  {/* Add Image by URL Input */}
                  <div className="flex items-center gap-2 bg-[#FBF8F1] p-3 rounded-2xl border border-gold/15">
                    <input
                      type="text"
                      id="newHeroUrlInput"
                      placeholder="Or paste Image URL here (e.g. Unsplash or Cloudinary)..."
                      className="flex-1 bg-white border border-gold/20 rounded-xl p-2.5 text-xs text-charcoal outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const inputEl = document.getElementById("newHeroUrlInput") as HTMLInputElement;
                        const urlVal = inputEl?.value?.trim();
                        if (urlVal) {
                          const newImg = {
                            id: `hero-${Date.now()}`,
                            url: urlVal,
                            caption: "Venue Photo",
                          };
                          handleUpdate((p) => {
                            const nonDemo = p.heroGallery.images.filter(
                              (i) => !i.id.startsWith("h1") && !i.id.startsWith("h2") && !i.id.startsWith("h3") && !i.url.includes("photo-1519167758481") && !i.url.includes("photo-1542314831") && !i.url.includes("photo-1566073771259")
                            );
                            const updatedImages = [...nonDemo, newImg];
                            return {
                              ...p,
                              heroGallery: {
                                coverImage: updatedImages[0]?.url || urlVal,
                                images: updatedImages,
                              },
                            };
                          });
                          inputEl.value = "";
                        }
                      }}
                      className="bg-[#0F4C45] hover:bg-[#0F4C45]/90 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
                    >
                      <Plus className="w-4 h-4 text-gold" />
                      <span>Add URL</span>
                    </button>
                  </div>

                  {/* Photos Grid & List */}
                  {cmsData.heroGallery.images.length === 0 ? (
                    <div className="text-center py-10 border-2 border-dashed border-gold/20 rounded-2xl p-6 bg-[#FBF8F1]/50 space-y-2">
                      <ImageIcon className="w-10 h-10 text-gold mx-auto opacity-70" />
                      <p className="font-display text-base font-bold text-charcoal">No Venue Photos Uploaded Yet</p>
                      <p className="text-xs text-charcoal/60">Click above to upload photos of your lawns, banquet halls, or stage setups.</p>
                    </div>
                  ) : (
                    <div className="space-y-3 pt-2">
                      {cmsData.heroGallery.images.map((img, index) => (
                        <div key={img.id} className="flex items-center gap-3 bg-[#FBF8F1] p-3.5 rounded-2xl border border-gold/15 shadow-2xs">
                          <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-gold/20 shrink-0 bg-gray-100">
                            <img src={img.url} alt={`Photo ${index + 1}`} className="w-full h-full object-cover" />
                            {index === 0 && (
                              <span className="absolute bottom-0 inset-x-0 bg-[#0F4C45] text-white text-[9px] font-bold text-center py-0.5">
                                Main Cover
                              </span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0 space-y-1">
                            <input
                              type="text"
                              value={img.caption || ""}
                              placeholder="Photo caption (e.g. Grand Lawn Reception)..."
                              onChange={(e) => {
                                const updated = [...cmsData.heroGallery.images];
                                updated[index].caption = e.target.value;
                                handleUpdate((p) => ({ ...p, heroGallery: { ...p.heroGallery, images: updated } }));
                              }}
                              className="w-full bg-white border border-gold/20 rounded-xl px-3 py-1.5 text-xs text-charcoal outline-none font-medium"
                            />
                            <p className="text-[10px] text-charcoal/50">
                              Photo #{index + 1} {index === 0 ? "— Displayed as primary store banner" : ""}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = cmsData.heroGallery.images.filter((_, i) => i !== index);
                              handleUpdate((p) => ({
                                ...p,
                                heroGallery: {
                                  coverImage: updated[0]?.url || "https://images.unsplash.com/photo-1519167758481-83f552bb8c74?auto=format&fit=crop&w=1200&q=80",
                                  images: updated,
                                },
                              }));
                            }}
                            className="text-red-500 hover:bg-red-50 p-2.5 rounded-xl transition-colors cursor-pointer"
                            title="Delete venue photo"
                          >
                            <Trash2 className="w-4.5 h-4.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tab 3: Venue Information & Capacity */}
            {activeTab === "venueInfo" && (
              <div className="bg-white rounded-3xl p-6 border border-gold/15 shadow-sm space-y-4">
                <h3 className="font-display text-xl text-charcoal font-semibold border-b border-gold/10 pb-3">3. Venue Capacity & Property Specs</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="font-semibold block text-charcoal/70 mb-1">Starting Tariff Price</label>
                    <input
                      type="text"
                      value={cmsData.venueInfo.startingPrice}
                      onChange={(e) => handleUpdate((p) => ({ ...p, venueInfo: { ...p.venueInfo, startingPrice: e.target.value } }))}
                      className="w-full bg-[#FBF8F1] border border-gold/20 rounded-xl p-2.5 font-bold text-charcoal outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-semibold block text-charcoal/70 mb-1">Venue Layout Type</label>
                    <select
                      value={cmsData.venueInfo.venueType}
                      onChange={(e) => handleUpdate((p) => ({ ...p, venueInfo: { ...p.venueInfo, venueType: e.target.value as any } }))}
                      className="w-full bg-[#FBF8F1] border border-gold/20 rounded-xl p-2.5 font-bold text-charcoal outline-none"
                    >
                      <option value="Indoor + Outdoor">Indoor + Outdoor</option>
                      <option value="Indoor">Indoor Banquet Hall</option>
                      <option value="Outdoor">Outdoor Lawn</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="font-semibold block text-charcoal/70 mb-1">Min Guests</label>
                    <input
                      type="number"
                      value={cmsData.venueInfo.minGuests}
                      onChange={(e) => handleUpdate((p) => ({ ...p, venueInfo: { ...p.venueInfo, minGuests: Number(e.target.value) } }))}
                      className="w-full bg-[#FBF8F1] border border-gold/20 rounded-xl p-2.5 text-charcoal outline-none font-bold"
                    />
                  </div>

                  <div>
                    <label className="font-semibold block text-charcoal/70 mb-1">Max Guests</label>
                    <input
                      type="number"
                      value={cmsData.venueInfo.maxGuests}
                      onChange={(e) => handleUpdate((p) => ({ ...p, venueInfo: { ...p.venueInfo, maxGuests: Number(e.target.value) } }))}
                      className="w-full bg-[#FBF8F1] border border-gold/20 rounded-xl p-2.5 text-charcoal outline-none font-bold"
                    />
                  </div>

                  <div>
                    <label className="font-semibold block text-charcoal/70 mb-1">Guest Rooms</label>
                    <input
                      type="number"
                      value={cmsData.venueInfo.roomsCount}
                      onChange={(e) => handleUpdate((p) => ({ ...p, venueInfo: { ...p.venueInfo, roomsCount: Number(e.target.value) } }))}
                      className="w-full bg-[#FBF8F1] border border-gold/20 rounded-xl p-2.5 text-charcoal outline-none font-bold"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Tab 4: Amenities */}
            {activeTab === "amenities" && (
              <div className="bg-white rounded-3xl p-6 border border-gold/15 shadow-sm space-y-4">
                <h3 className="font-display text-xl text-charcoal font-semibold border-b border-gold/10 pb-3">4. Amenities & Facilities</h3>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  {Object.entries(cmsData.amenities).map(([key, val]) => (
                    <label key={key} className="flex items-center gap-2 p-2.5 bg-[#FBF8F1] rounded-xl border border-gold/15 font-semibold text-charcoal cursor-pointer">
                      <input
                        type="checkbox"
                        checked={Boolean(val)}
                        onChange={(e) => {
                          handleUpdate((p) => ({
                            ...p,
                            amenities: { ...p.amenities, [key]: e.target.checked }
                          }));
                        }}
                        className="rounded accent-[#0F4C45] w-4 h-4"
                      />
                      <span>{key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1")}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 5: Packages */}
            {activeTab === "packages" && (
              <div className="bg-white rounded-3xl p-6 border border-gold/15 shadow-sm space-y-4">
                <div className="flex justify-between items-center border-b border-gold/10 pb-3">
                  <h3 className="font-display text-xl text-charcoal font-semibold">5. Rental Packages & Tariffs</h3>
                  <button
                    type="button"
                    onClick={() => {
                      const newPkg = {
                        id: `pkg-${Date.now()}`,
                        name: "New Rental Package",
                        price: "₹2,50,000 / day",
                        description: "Full venue rental including basic banquet amenities.",
                        includedServices: ["Valet Parking", "Air Conditioning", "Stage Setup"],
                        isPopular: false,
                      };
                      handleUpdate((p) => ({ ...p, packages: [...p.packages, newPkg] }));
                    }}
                    className="bg-[#0F4C45] hover:bg-[#0F4C45]/90 text-white text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Add New Package</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {cmsData.packages.map((pkg, index) => (
                    <div key={pkg.id} className="bg-[#FBF8F1] p-4 rounded-2xl border border-gold/15 space-y-3 text-xs">
                      <div className="flex justify-between items-center gap-2">
                        <input
                          type="text"
                          value={pkg.name}
                          placeholder="Package Title (e.g. Grand Banquet Package)..."
                          onChange={(e) => {
                            const updated = [...cmsData.packages];
                            updated[index].name = e.target.value;
                            handleUpdate((p) => ({ ...p, packages: updated }));
                          }}
                          className="font-bold text-charcoal text-sm bg-white border border-gold/20 rounded-xl p-2 flex-1 outline-none"
                        />
                        <input
                          type="text"
                          value={pkg.price}
                          placeholder="Tariff Price (e.g. ₹4,50,000 / day)..."
                          onChange={(e) => {
                            const updated = [...cmsData.packages];
                            updated[index].price = e.target.value;
                            handleUpdate((p) => ({ ...p, packages: updated }));
                          }}
                          className="font-bold text-[#0F4C45] text-sm bg-white border border-gold/20 rounded-xl p-2 text-right w-40 outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const updated = cmsData.packages.filter((_, i) => i !== index);
                            handleUpdate((p) => ({ ...p, packages: updated }));
                          }}
                          className="text-red-500 hover:bg-red-50 p-2 rounded-xl border border-red-200 shrink-0"
                          title="Delete package"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div>
                        <label className="font-semibold block text-charcoal/70 mb-1">Package Description & Features</label>
                        <textarea
                          rows={2}
                          value={pkg.description || ""}
                          placeholder="Include services like valet parking, bridal suite, air conditioning..."
                          onChange={(e) => {
                            const updated = [...cmsData.packages];
                            updated[index].description = e.target.value;
                            handleUpdate((p) => ({ ...p, packages: updated }));
                          }}
                          className="w-full bg-white border border-gold/20 rounded-xl p-2 text-charcoal outline-none"
                        />
                      </div>
                    </div>
                  ))}
                  {cmsData.packages.length === 0 && (
                    <div className="text-center py-8 bg-[#FBF8F1] rounded-2xl border border-dashed border-gold/30">
                      <p className="text-xs text-charcoal/60 mb-3">No rental packages added yet.</p>
                      <button
                        type="button"
                        onClick={() => {
                          const newPkg = {
                            id: `pkg-${Date.now()}`,
                            name: "Grand Ballroom Package",
                            price: "₹3,50,000 / day",
                            description: "Full hall rental with air conditioning and valet parking.",
                            includedServices: ["Valet Parking", "Bridal Suite", "Air Conditioning"],
                            isPopular: true,
                          };
                          handleUpdate((p) => ({ ...p, packages: [newPkg] }));
                        }}
                        className="bg-[#0F4C45] text-white text-xs font-bold px-4 py-2 rounded-xl inline-flex items-center gap-1.5"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add First Package</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tab 6: FAQs */}
            {activeTab === "faqs" && (
              <div className="bg-white rounded-3xl p-6 border border-gold/15 shadow-sm space-y-4">
                <div className="flex justify-between items-center border-b border-gold/10 pb-3">
                  <h3 className="font-display text-xl text-charcoal font-semibold">6. Frequently Asked Questions</h3>
                  <button
                    type="button"
                    onClick={() => {
                      const newFaq = {
                        id: `faq-${Date.now()}`,
                        question: "What is your booking cancellation policy?",
                        answer: "Cancellations made 60 days prior receive a 80% refund of the advance deposit.",
                      };
                      handleUpdate((p) => ({ ...p, faqs: [...p.faqs, newFaq] }));
                    }}
                    className="bg-[#0F4C45] hover:bg-[#0F4C45]/90 text-white text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Add New Question</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {cmsData.faqs.map((faq, index) => (
                    <div key={faq.id} className="bg-[#FBF8F1] p-3.5 rounded-2xl border border-gold/15 space-y-2 text-xs">
                      <div className="flex justify-between items-center gap-2">
                        <input
                          type="text"
                          value={faq.question}
                          placeholder="Enter Question..."
                          onChange={(e) => {
                            const updated = [...cmsData.faqs];
                            updated[index].question = e.target.value;
                            handleUpdate((p) => ({ ...p, faqs: updated }));
                          }}
                          className="font-bold text-charcoal w-full bg-white border border-gold/20 rounded-xl p-2 outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const updated = cmsData.faqs.filter((_, i) => i !== index);
                            handleUpdate((p) => ({ ...p, faqs: updated }));
                          }}
                          className="text-red-500 hover:bg-red-50 p-2 rounded-xl border border-red-200 shrink-0"
                          title="Delete FAQ"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <textarea
                        rows={2}
                        value={faq.answer}
                        placeholder="Enter Answer..."
                        onChange={(e) => {
                          const updated = [...cmsData.faqs];
                          updated[index].answer = e.target.value;
                          handleUpdate((p) => ({ ...p, faqs: updated }));
                        }}
                        className="w-full bg-white border border-gold/20 rounded-xl p-2 text-charcoal outline-none"
                      />
                    </div>
                  ))}
                  {cmsData.faqs.length === 0 && (
                    <div className="text-center py-8 bg-[#FBF8F1] rounded-2xl border border-dashed border-gold/30">
                      <p className="text-xs text-charcoal/60 mb-3">No frequently asked questions added yet.</p>
                      <button
                        type="button"
                        onClick={() => {
                          const newFaq = {
                            id: `faq-${Date.now()}`,
                            question: "What is your advance booking deposit requirement?",
                            answer: "We require a 25% advance deposit to confirm and block your event date.",
                          };
                          handleUpdate((p) => ({ ...p, faqs: [newFaq] }));
                        }}
                        className="bg-[#0F4C45] text-white text-xs font-bold px-4 py-2 rounded-xl inline-flex items-center gap-1.5"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add First Question</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>
        )}

        {/* Live Preview Panel — Uses ONE SAME VenueProfileTemplate Component */}
        {(viewMode === "preview" || viewMode === "split") && (
          <div className={viewMode === "split" ? "lg:col-span-7 bg-white rounded-3xl p-4 border border-gold/20 shadow-xl overflow-hidden" : "bg-white rounded-3xl p-6 border border-gold/20 shadow-xl"}>
            <div className="mb-4 pb-2 border-b border-gold/10 flex justify-between items-center px-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0F4C45] flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-gold" /> Exact Public Profile Preview
              </span>
              <span className="text-[10px] text-charcoal/60 bg-[#FBF8F1] px-2.5 py-1 rounded-full border border-gold/15">
                Single Source of Truth Template
              </span>
            </div>

            <div className="rounded-2xl overflow-hidden border border-gold/15 bg-[#F5F0E8] max-h-[850px] overflow-y-auto">
              <VenueProfileTemplate cmsData={cmsData} preview={true} />
            </div>
          </div>
        )}

      </div>

      {/* Version History Modal */}
      {isVersionModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gold/20 space-y-4">
            <div className="flex justify-between items-center border-b border-gold/10 pb-3">
              <h3 className="font-display text-xl text-charcoal font-semibold flex items-center gap-2">
                <History className="w-5 h-5 text-gold" /> Venue CMS Version History
              </h3>
              <button onClick={() => setIsVersionModalOpen(false)} className="text-charcoal/50 hover:text-charcoal">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto">
              {versionHistory.map((snap) => (
                <div key={snap.versionId} className="bg-[#FBF8F1] p-3 rounded-2xl border border-gold/15 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-xs text-charcoal">{snap.data.businessProfile.businessName}</span>
                    <span className="text-[10px] text-charcoal/60 block">{snap.timestamp}</span>
                  </div>
                  <button
                    onClick={() => handleRestoreVersion(snap)}
                    className="bg-[#0F4C45] text-white px-3 py-1.5 rounded-lg text-xs font-bold uppercase flex items-center gap-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Restore
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
