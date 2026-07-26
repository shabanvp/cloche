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
  HelpCircle, Search, Monitor, Smartphone, Check, Lock, X
} from "lucide-react";
import { Button } from "@/components/Button";

export default function VendorVenueCmsPage() {
  // Mock current logged in vendor category
  const mockVendorCategory = "Wedding Venue"; // Change to test permission restriction
  const vendorId = "v-hyatt";

  const [cmsData, setCmsData] = useState<VenueCmsData>(getVenueCmsData(vendorId));
  const [activeTab, setActiveTab] = useState<"profile" | "hero" | "venueInfo" | "amenities" | "packages" | "availability" | "reviews" | "faqs" | "seo">("profile");
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("mobile");
  
  const [autoSaveStatus, setAutoSaveStatus] = useState<"Saved" | "Saving..." | "Unsaved Changes">("Saved");
  const [versionHistory, setVersionHistory] = useState<CmsVersionSnapshot[]>([]);
  const [isVersionModalOpen, setIsVersionModalOpen] = useState(false);

  // New item draft states
  const [newPkgName, setNewPkgName] = useState("");
  const [newPkgPrice, setNewPkgPrice] = useState("");
  const [newFaqQ, setNewFaqQ] = useState("");
  const [newFaqA, setNewFaqA] = useState("");

  useEffect(() => {
    setCmsData(getVenueCmsData(vendorId));
    setVersionHistory(getVenueVersionHistory());
  }, []);

  // Category Guard Verification
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

  // Update State & Trigger Auto-Save
  const handleUpdate = (updater: (prev: VenueCmsData) => VenueCmsData) => {
    setAutoSaveStatus("Saving...");
    setCmsData((prev) => {
      const updated = updater(prev);
      saveVenueCmsData(updated, "Draft");
      setTimeout(() => setAutoSaveStatus("Saved"), 600);
      return updated;
    });
  };

  const handlePublish = () => {
    saveVenueCmsData(cmsData, "Published");
    setVersionHistory(getVenueVersionHistory());
    alert("Venue CMS content published live to Cloche!");
  };

  const handleRestoreVersion = (snapshot: CmsVersionSnapshot) => {
    const restored = restoreVenueVersion(snapshot);
    setCmsData(restored);
    setIsVersionModalOpen(false);
    alert(`Restored venue profile to snapshot from ${snapshot.timestamp}`);
  };

  // Convert Venue Cms Data to VenueProfileTemplate Config format for real-time live preview
  const livePreviewConfig = {
    id: cmsData.id,
    vendorId: cmsData.vendorId,
    category: cmsData.category,
    businessName: cmsData.businessProfile.businessName,
    tagline: cmsData.businessProfile.tagline,
    logo: cmsData.heroGallery.coverImage,
    coverImage: cmsData.heroGallery.coverImage,
    aboutText: cmsData.businessProfile.description,
    phone: cmsData.businessProfile.contactNumber,
    whatsapp: cmsData.businessProfile.whatsapp,
    email: cmsData.businessProfile.email,
    instagram: cmsData.businessProfile.instagram,
    website: cmsData.businessProfile.website,
    city: cmsData.businessProfile.city,
    district: cmsData.businessProfile.district,
    address: cmsData.businessProfile.address,
    visibility: {
      heroBanner: true,
      gallery: true,
      packages: true,
      categoryFields: true,
      aboutStory: true,
      amenitiesOrSpecs: true,
      reviews: true,
      locationMap: true,
      contactCTA: true,
      awardsOrFAQ: true,
    },
    venueSpecs: {
      guestCapacity: `${cmsData.venueInfo.minGuests} to ${cmsData.venueInfo.maxGuests} Guests`,
      indoorOutdoor: (cmsData.venueInfo.venueType === "Indoor" ? "Indoor Hall" : cmsData.venueInfo.venueType === "Outdoor" ? "Outdoor Lawn" : "Both Indoor & Outdoor") as any,
      roomsCount: cmsData.venueInfo.roomsCount,
      parkingCapacity: cmsData.venueInfo.parkingCapacity,
      cateringOption: (cmsData.venueInfo.foodPolicy === "In-house Catering Only" ? "In-house Catering" : cmsData.venueInfo.foodPolicy === "External Catering Allowed" ? "External Allowed" : "Both") as any,
    },
    galleryImages: cmsData.heroGallery.images.map((i) => i.url),
    packagesList: cmsData.packages.map((p) => ({
      name: p.name,
      price: p.price,
      description: p.description,
      features: p.includedServices,
    })),
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-16">
      
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

        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsVersionModalOpen(true)}
            className="border-gold/20 text-charcoal rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
          >
            <History className="w-3.5 h-3.5 text-gold" /> History
          </Button>
          <Button
            type="button"
            onClick={handlePublish}
            className="bg-[#0F4C45] text-white px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider shadow-md hover:bg-[#12584E]"
          >
            Publish Venue Changes
          </Button>
        </div>
      </div>

      {/* Editor & Live Mobile Preview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Venue CMS Editor (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Section Navigation Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 border-b border-gold/10 hide-scrollbar">
            {[
              { id: "profile", label: "Profile" },
              { id: "hero", label: "Hero Gallery" },
              { id: "venueInfo", label: "Venue Info" },
              { id: "amenities", label: "Amenities" },
              { id: "packages", label: "Packages" },
              { id: "availability", label: "Calendar" },
              { id: "reviews", label: "Reviews" },
              { id: "faqs", label: "FAQ" },
              { id: "seo", label: "SEO" },
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
              <h3 className="font-display text-xl text-charcoal font-semibold border-b border-gold/10 pb-3">2. Hero Banner & Cover Image</h3>

              <div className="text-xs">
                <label className="font-semibold block text-charcoal/70 mb-1">Cover Image URL</label>
                <input
                  type="text"
                  value={cmsData.heroGallery.coverImage}
                  onChange={(e) => handleUpdate((p) => ({ ...p, heroGallery: { ...p.heroGallery, coverImage: e.target.value } }))}
                  className="w-full bg-[#FBF8F1] border border-gold/20 rounded-xl p-2.5 text-charcoal outline-none"
                />
              </div>

              <div className="space-y-3 pt-2">
                <h4 className="font-semibold text-xs text-charcoal/70">Hero Slider Images ({cmsData.heroGallery.images.length})</h4>
                {cmsData.heroGallery.images.map((img, index) => (
                  <div key={img.id} className="flex items-center gap-3 bg-[#FBF8F1] p-3 rounded-2xl border border-gold/15">
                    <img src={img.url} alt="Hero" className="w-14 h-14 rounded-xl object-cover" />
                    <input
                      type="text"
                      value={img.caption || ""}
                      placeholder="Caption..."
                      onChange={(e) => {
                        const updated = [...cmsData.heroGallery.images];
                        updated[index].caption = e.target.value;
                        handleUpdate((p) => ({ ...p, heroGallery: { ...p.heroGallery, images: updated } }));
                      }}
                      className="flex-1 bg-white border border-gold/20 rounded-xl p-2 text-xs text-charcoal outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updated = cmsData.heroGallery.images.filter((_, i) => i !== index);
                        handleUpdate((p) => ({ ...p, heroGallery: { ...p.heroGallery, images: updated } }));
                      }}
                      className="text-red-500 hover:bg-red-50 p-2 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
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

          {/* Tab 4: Packages */}
          {activeTab === "packages" && (
            <div className="bg-white rounded-3xl p-6 border border-gold/15 shadow-sm space-y-4">
              <h3 className="font-display text-xl text-charcoal font-semibold border-b border-gold/10 pb-3">4. Rental Packages & Tariffs</h3>

              <div className="space-y-3">
                {cmsData.packages.map((pkg, index) => (
                  <div key={pkg.id} className="bg-[#FBF8F1] p-4 rounded-2xl border border-gold/15 space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <input
                        type="text"
                        value={pkg.name}
                        onChange={(e) => {
                          const updated = [...cmsData.packages];
                          updated[index].name = e.target.value;
                          handleUpdate((p) => ({ ...p, packages: updated }));
                        }}
                        className="font-bold text-charcoal text-sm bg-white border border-gold/20 rounded-lg p-1.5"
                      />
                      <input
                        type="text"
                        value={pkg.price}
                        onChange={(e) => {
                          const updated = [...cmsData.packages];
                          updated[index].price = e.target.value;
                          handleUpdate((p) => ({ ...p, packages: updated }));
                        }}
                        className="font-bold text-emerald text-sm bg-white border border-gold/20 rounded-lg p-1.5 text-right w-32"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Real Public Venue Profile Preview (5 cols) */}
        <div className="lg:col-span-5 sticky top-6 space-y-4">
          <div className="flex justify-between items-center bg-white p-3 rounded-2xl border border-gold/15 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-charcoal flex items-center gap-1.5">
              <Monitor className="w-4 h-4 text-gold" /> Real Venue Profile Preview
            </span>
            <div className="bg-[#F8F6F0] p-1 rounded-xl flex items-center gap-1">
              <button
                type="button"
                onClick={() => setPreviewDevice("mobile")}
                className={`p-1.5 rounded-lg text-xs font-bold transition-colors ${
                  previewDevice === "mobile" ? "bg-[#0F4C45] text-white" : "text-charcoal/70"
                }`}
              >
                Mobile
              </button>
              <button
                type="button"
                onClick={() => setPreviewDevice("desktop")}
                className={`p-1.5 rounded-lg text-xs font-bold transition-colors ${
                  previewDevice === "desktop" ? "bg-[#0F4C45] text-white" : "text-charcoal/70"
                }`}
              >
                Desktop
              </button>
            </div>
          </div>

          <div className="bg-[#F5F0E8] p-4 rounded-3xl border border-gold/20 shadow-xl max-h-[750px] overflow-y-auto">
            <div className={`mx-auto bg-white rounded-2xl overflow-hidden shadow-2xl ${previewDevice === "mobile" ? "max-w-[340px]" : "w-full"}`}>
              <div className="p-3 bg-gray-50 border-b border-gray-100 text-[10px] font-mono text-gray-500 flex justify-between">
                <span>cloche.luxury/venues/{cmsData.vendorId}</span>
                <span>STATUS: {cmsData.status}</span>
              </div>
              <div className="p-3 scale-95 transform-gpu origin-top">
                <VenueProfileTemplate config={livePreviewConfig} />
              </div>
            </div>
          </div>
        </div>

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
