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
  HelpCircle, Search, Check, Lock, X, ExternalLink, Eye, LayoutGrid, Columns, Loader2,
  ChevronUp, ChevronDown, Edit3, AlertCircle, Crown, Wand2
} from "lucide-react";
import { uploadImageToCloudinary } from "@/lib/cloudinary";
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
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  // Custom Amenity form draft states
  const [isAmenityModalOpen, setIsAmenityModalOpen] = useState(false);
  const [editingAmenityId, setEditingAmenityId] = useState<string | null>(null);
  const [amenityName, setAmenityName] = useState("");
  const [amenityIcon, setAmenityIcon] = useState("check_circle");
  const [amenityDesc, setAmenityDesc] = useState("");
  const [amenityAvailable, setAmenityAvailable] = useState(true);

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
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gold/10 pb-3 gap-2">
                  <div>
                    <h3 className="font-display text-xl text-charcoal font-semibold flex items-center gap-2">
                      2. Venue Photos & Gallery
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        cmsData.heroGallery.images.length >= 2 && cmsData.heroGallery.images.length <= 10
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                          : "bg-amber-100 text-amber-800 border border-amber-300"
                      }`}>
                        {cmsData.heroGallery.images.length} / 10 Photos
                      </span>
                    </h3>
                    <p className="text-xs text-charcoal/60 mt-1">
                      Upload between <strong>2 and 10 photos</strong> of your venue. Set any photo as Main Cover, reorder, or replace photos.
                    </p>
                  </div>
                </div>

                {/* Validation Notice */}
                {cmsData.heroGallery.images.length < 2 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 flex items-center gap-2.5 text-xs text-amber-900 font-semibold">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Minimum 2 venue photos required. Please upload at least {2 - cmsData.heroGallery.images.length} more photo(s).</span>
                  </div>
                )}
                {cmsData.heroGallery.images.length > 10 && (
                  <div className="bg-red-50 border border-red-200 rounded-2xl p-3.5 flex items-center gap-2.5 text-xs text-red-900 font-semibold">
                    <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                    <span>Maximum limit of 10 photos reached ({cmsData.heroGallery.images.length}/10). Please delete or reduce photo count.</span>
                  </div>
                )}

                <div className="space-y-4 pt-1">
                  <div className="flex flex-wrap justify-between items-center gap-2">
                    <h4 className="font-semibold text-xs text-charcoal/70">Gallery Image Management</h4>
                    <label className={`cursor-pointer bg-[#0F4C45] hover:bg-[#0F4C45]/90 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-sm transition-all active:scale-95 ${isUploadingPhoto ? "opacity-75 cursor-not-allowed" : ""}`}>
                      {isUploadingPhoto ? (
                        <Loader2 className="w-4 h-4 text-gold animate-spin" />
                      ) : (
                        <Plus className="w-4 h-4 text-gold" />
                      )}
                      <span>{isUploadingPhoto ? "Uploading to Cloudinary..." : "+ Upload Venue Photo"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        disabled={isUploadingPhoto}
                        className="hidden"
                        onChange={async (e) => {
                          const files = Array.from(e.target.files || []);
                          if (files.length > 0) {
                            setIsUploadingPhoto(true);
                            try {
                              const newAdditions: { id: string; url: string; caption: string }[] = [];
                              for (const file of files) {
                                const cloudinaryUrl = await uploadImageToCloudinary(file);
                                if (cloudinaryUrl) {
                                  newAdditions.push({
                                    id: `hero-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
                                    url: cloudinaryUrl,
                                    caption: file.name.replace(/\.[^/.]+$/, ""),
                                  });
                                }
                              }

                              if (newAdditions.length > 0) {
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
                                showToast(`Successfully uploaded ${newAdditions.length} photo(s) to Cloudinary!`);
                              }
                            } catch (err) {
                              console.error("Upload failed:", err);
                              showToast("Failed to upload photo. Please try again.");
                            } finally {
                              setIsUploadingPhoto(false);
                            }
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
                      placeholder="Or paste Image URL here (e.g. Cloudinary or Unsplash)..."
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
                          showToast("Photo URL added to gallery!");
                        }
                      }}
                      className="bg-[#0F4C45] hover:bg-[#0F4C45]/90 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
                    >
                      <Plus className="w-4 h-4 text-gold" />
                      <span>Add URL</span>
                    </button>
                  </div>

                  {/* Photos List */}
                  {cmsData.heroGallery.images.length === 0 ? (
                    <div className="text-center py-10 border-2 border-dashed border-gold/20 rounded-2xl p-6 bg-[#FBF8F1]/50 space-y-2">
                      <ImageIcon className="w-10 h-10 text-gold mx-auto opacity-70" />
                      <p className="font-display text-base font-bold text-charcoal">No Venue Photos Uploaded Yet</p>
                      <p className="text-xs text-charcoal/60">Upload between 2 and 10 photos of your lawns, banquet halls, or stage setups.</p>
                    </div>
                  ) : (
                    <div className="space-y-3 pt-2">
                      {cmsData.heroGallery.images.map((img, index) => {
                        const isCover = img.isMainCover || index === 0 || cmsData.heroGallery.coverImage === img.url;
                        return (
                          <div key={img.id} className={`flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3.5 rounded-2xl border transition-all ${
                            isCover ? "bg-[#0F4C45]/5 border-[#0F4C45]/30 shadow-xs" : "bg-[#FBF8F1] border-gold/15"
                          }`}>
                            <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-gold/20 shrink-0 bg-gray-100">
                              <img src={img.url} alt={`Photo ${index + 1}`} className="w-full h-full object-cover" />
                              {isCover && (
                                <span className="absolute bottom-0 inset-x-0 bg-[#0F4C45] text-white text-[9px] font-bold text-center py-0.5">
                                  Main Cover
                                </span>
                              )}
                            </div>

                            <div className="flex-1 min-w-0 space-y-1.5 w-full">
                              <div className="flex flex-wrap items-center justify-between gap-1">
                                <span className="text-xs font-bold text-charcoal flex items-center gap-1.5">
                                  Photo #{index + 1}
                                  {isCover && <Crown className="w-3.5 h-3.5 text-amber-500 fill-amber-400 inline" />}
                                </span>
                                <div className="flex items-center gap-1">
                                  {/* Move Up */}
                                  <button
                                    type="button"
                                    disabled={index === 0}
                                    onClick={() => {
                                      const updated = [...cmsData.heroGallery.images];
                                      const temp = updated[index];
                                      updated[index] = updated[index - 1];
                                      updated[index - 1] = temp;
                                      handleUpdate((p) => ({
                                        ...p,
                                        heroGallery: {
                                          coverImage: updated[0]?.url || p.heroGallery.coverImage,
                                          images: updated,
                                        },
                                      }));
                                    }}
                                    className="p-1 rounded bg-white border border-gold/20 text-charcoal/70 hover:bg-gold/10 disabled:opacity-30 cursor-pointer"
                                    title="Move photo up"
                                  >
                                    <ChevronUp className="w-3.5 h-3.5" />
                                  </button>
                                  {/* Move Down */}
                                  <button
                                    type="button"
                                    disabled={index === cmsData.heroGallery.images.length - 1}
                                    onClick={() => {
                                      const updated = [...cmsData.heroGallery.images];
                                      const temp = updated[index];
                                      updated[index] = updated[index + 1];
                                      updated[index + 1] = temp;
                                      handleUpdate((p) => ({
                                        ...p,
                                        heroGallery: {
                                          coverImage: updated[0]?.url || p.heroGallery.coverImage,
                                          images: updated,
                                        },
                                      }));
                                    }}
                                    className="p-1 rounded bg-white border border-gold/20 text-charcoal/70 hover:bg-gold/10 disabled:opacity-30 cursor-pointer"
                                    title="Move photo down"
                                  >
                                    <ChevronDown className="w-3.5 h-3.5" />
                                  </button>
                                  {/* Set as Main Cover button */}
                                  {!isCover && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const updated = cmsData.heroGallery.images.map((item, i) => ({
                                          ...item,
                                          isMainCover: i === index,
                                        }));
                                        // Move selected main cover photo to top of list
                                        const targetItem = updated[index];
                                        const filtered = updated.filter((_, i) => i !== index);
                                        const reordered = [targetItem, ...filtered];
                                        handleUpdate((p) => ({
                                          ...p,
                                          heroGallery: {
                                            coverImage: targetItem.url,
                                            images: reordered,
                                          },
                                        }));
                                        showToast("Selected photo set as Main Cover!");
                                      }}
                                      className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-[10px] font-bold shadow-xs cursor-pointer"
                                    >
                                      Set as Main Cover
                                    </button>
                                  )}
                                </div>
                              </div>

                              <input
                                type="text"
                                value={img.caption || ""}
                                placeholder="Photo caption (e.g. Grand Lawn Reception)..."
                                onChange={(e) => {
                                  const updated = [...cmsData.heroGallery.images];
                                  updated[index].caption = e.target.value;
                                  handleUpdate((p) => ({ ...p, heroGallery: { ...p.heroGallery, images: updated } }));
                                }}
                                className="w-full bg-white border border-gold/20 rounded-xl px-3 py-1 text-xs text-charcoal outline-none font-medium"
                              />
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                              {/* Replace button */}
                              <label className="p-2 rounded-xl bg-white border border-gold/20 text-[#0F4C45] hover:bg-[#0F4C45]/10 cursor-pointer" title="Replace image">
                                <ImageIcon className="w-4 h-4" />
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      showToast("Uploading replacement photo...");
                                      const newUrl = await uploadImageToCloudinary(file);
                                      if (newUrl) {
                                        const updated = [...cmsData.heroGallery.images];
                                        updated[index] = { ...updated[index], url: newUrl };
                                        handleUpdate((p) => ({
                                          ...p,
                                          heroGallery: {
                                            coverImage: index === 0 || isCover ? newUrl : p.heroGallery.coverImage,
                                            images: updated,
                                          },
                                        }));
                                        showToast("Photo replaced successfully!");
                                      }
                                    }
                                  }}
                                />
                              </label>

                              {/* Delete button */}
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = cmsData.heroGallery.images.filter((_, i) => i !== index);
                                  handleUpdate((p) => ({
                                    ...p,
                                    heroGallery: {
                                      coverImage: updated[0]?.url || "",
                                      images: updated,
                                    },
                                  }));
                                }}
                                className="text-red-500 hover:bg-red-50 p-2 rounded-xl transition-colors cursor-pointer"
                                title="Delete venue photo"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
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

            {/* Tab 4: Amenities (Predefined + Custom Amenities Management) */}
            {activeTab === "amenities" && (
              <div className="bg-white rounded-3xl p-6 border border-gold/15 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gold/10 pb-3 gap-2">
                  <div>
                    <h3 className="font-display text-xl text-charcoal font-semibold">4. Venue Amenities & Custom Features</h3>
                    <p className="text-xs text-charcoal/60 mt-1">
                      Manage standard property amenities and add custom features (e.g. Helipad, Beach Access, VIP Lounge).
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingAmenityId(null);
                      setAmenityName("");
                      setAmenityIcon("check_circle");
                      setAmenityDesc("");
                      setAmenityAvailable(true);
                      setIsAmenityModalOpen(true);
                    }}
                    className="bg-[#0F4C45] hover:bg-[#0F4C45]/90 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <Plus className="w-4 h-4 text-gold" />
                    <span>+ Add Custom Amenity</span>
                  </button>
                </div>

                {/* Standard Predefined Amenities */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-xs text-charcoal/70 uppercase tracking-wider">Standard Venue Amenities</h4>
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

                {/* Custom Amenities Section */}
                <div className="space-y-3 pt-4 border-t border-gold/10">
                  <h4 className="font-semibold text-xs text-charcoal/70 uppercase tracking-wider">
                    Custom Amenities ({ (cmsData.customAmenities || []).length })
                  </h4>

                  {(!cmsData.customAmenities || cmsData.customAmenities.length === 0) ? (
                    <div className="text-center py-6 border border-dashed border-gold/20 rounded-2xl bg-[#FBF8F1]/50 p-4 space-y-1">
                      <Sparkles className="w-8 h-8 text-gold mx-auto opacity-70" />
                      <p className="text-xs font-bold text-charcoal">No Custom Amenities Added</p>
                      <p className="text-[11px] text-charcoal/60">Add unique features like Helipad, Beach Access, VIP Lounge, or Private Pier.</p>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {cmsData.customAmenities.map((ca) => (
                        <div key={ca.id} className="flex items-center justify-between bg-[#FBF8F1] p-3 rounded-2xl border border-gold/15 gap-3 text-xs">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-8 h-8 rounded-xl bg-[#0F4C45]/10 text-[#0F4C45] flex items-center justify-center font-bold text-sm shrink-0">
                              ✓
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-charcoal truncate">{ca.name}</p>
                              {ca.description && <p className="text-[10px] text-charcoal/60 truncate">{ca.description}</p>}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {/* Available toggle badge */}
                            <button
                              type="button"
                              onClick={() => {
                                const updated = (cmsData.customAmenities || []).map((item) =>
                                  item.id === ca.id ? { ...item, isAvailable: !item.isAvailable } : item
                                );
                                handleUpdate((p) => ({ ...p, customAmenities: updated }));
                              }}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors ${
                                ca.isAvailable !== false
                                  ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                                  : "bg-gray-200 text-gray-600 border border-gray-300"
                              }`}
                            >
                              {ca.isAvailable !== false ? "Available" : "Disabled"}
                            </button>

                            {/* Edit button */}
                            <button
                              type="button"
                              onClick={() => {
                                setEditingAmenityId(ca.id);
                                setAmenityName(ca.name);
                                setAmenityIcon(ca.icon || "check_circle");
                                setAmenityDesc(ca.description || "");
                                setAmenityAvailable(ca.isAvailable !== false);
                                setIsAmenityModalOpen(true);
                              }}
                              className="p-1.5 rounded-lg bg-white border border-gold/20 text-charcoal/70 hover:bg-gold/10"
                              title="Edit custom amenity"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>

                            {/* Delete button */}
                            <button
                              type="button"
                              onClick={() => {
                                const updated = (cmsData.customAmenities || []).filter((item) => item.id !== ca.id);
                                handleUpdate((p) => ({ ...p, customAmenities: updated }));
                                showToast("Custom amenity deleted.");
                              }}
                              className="p-1.5 rounded-lg text-red-500 hover:bg-red-50"
                              title="Delete custom amenity"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Add/Edit Custom Amenity Modal */}
                {isAmenityModalOpen && (
                  <div className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-gold/20 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
                      <div className="flex justify-between items-center border-b border-gold/10 pb-3">
                        <h4 className="font-display text-lg font-bold text-charcoal">
                          {editingAmenityId ? "Edit Custom Amenity" : "Add Custom Amenity"}
                        </h4>
                        <button
                          type="button"
                          onClick={() => setIsAmenityModalOpen(false)}
                          className="text-charcoal/50 hover:text-charcoal p-1"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="space-y-3 text-xs">
                        <div>
                          <label className="font-semibold block text-charcoal/70 mb-1">Amenity Name *</label>
                          <input
                            type="text"
                            value={amenityName}
                            placeholder="e.g. Rooftop Helipad, Private Beach Pier..."
                            onChange={(e) => setAmenityName(e.target.value)}
                            className="w-full bg-[#FBF8F1] border border-gold/20 rounded-xl p-2.5 text-charcoal font-bold outline-none"
                          />
                        </div>

                        <div>
                          <label className="font-semibold block text-charcoal/70 mb-1">Optional Description</label>
                          <input
                            type="text"
                            value={amenityDesc}
                            placeholder="e.g. Exclusive helicopter landing & VIP lounge"
                            onChange={(e) => setAmenityDesc(e.target.value)}
                            className="w-full bg-[#FBF8F1] border border-gold/20 rounded-xl p-2.5 text-charcoal outline-none"
                          />
                        </div>

                        <div className="flex items-center gap-2 pt-1">
                          <label className="flex items-center gap-2 font-semibold text-charcoal cursor-pointer">
                            <input
                              type="checkbox"
                              checked={amenityAvailable}
                              onChange={(e) => setAmenityAvailable(e.target.checked)}
                              className="rounded accent-[#0F4C45] w-4 h-4"
                            />
                            <span>Currently Available for Bookings</span>
                          </label>
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-2 border-t border-gold/10">
                        <button
                          type="button"
                          onClick={() => setIsAmenityModalOpen(false)}
                          className="px-4 py-2 rounded-xl text-xs font-bold text-charcoal/70 bg-gray-100 hover:bg-gray-200"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (!amenityName.trim()) {
                              alert("Please enter amenity name");
                              return;
                            }
                            const current = cmsData.customAmenities || [];
                            let updated: typeof current;
                            if (editingAmenityId) {
                              updated = current.map((item) =>
                                item.id === editingAmenityId
                                  ? { ...item, name: amenityName.trim(), description: amenityDesc.trim(), isAvailable: amenityAvailable }
                                  : item
                              );
                            } else {
                              const newObj = {
                                id: `ca-${Date.now()}`,
                                name: amenityName.trim(),
                                icon: amenityIcon,
                                description: amenityDesc.trim(),
                                isAvailable: amenityAvailable,
                              };
                              updated = [...current, newObj];
                            }
                            handleUpdate((p) => ({ ...p, customAmenities: updated }));
                            setIsAmenityModalOpen(false);
                            showToast(editingAmenityId ? "Custom amenity updated!" : "Custom amenity added!");
                          }}
                          className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#0F4C45] hover:bg-[#0F4C45]/90 shadow-sm"
                        >
                          Save Amenity
                        </button>
                      </div>
                    </div>
                  </div>
                )}
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
