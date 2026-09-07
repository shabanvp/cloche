"use client";

import { useState, useEffect } from "react";
import {
  Palette,
  Upload,
  Image as ImageIcon,
  CheckCircle,
  Save,
  Eye,
  Loader2,
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
  Users,
  Award,
  Sparkles,
  Clock,
  ShieldCheck,
  Check,
  Star
} from "lucide-react";
import { uploadImageToCloudinaryDetailed } from "@/lib/cloudinary";
import { VendorStorefront } from "@/components/VendorStorefront";
import {
  fetchAuthenticatedVendorFromDb,
  getActiveVendorIdentity,
  syncVendorProfileWithDatabase,
  showVendorToast,
  VendorProfileData
} from "@/lib/vendorStore";

export const MEHENDI_STYLE_OPTIONS = [
  "Rajasthani Dulha-Dulhan Portrait",
  "Arabic Flowing Vines",
  "Indo-Arabic Fusion",
  "Traditional Indian Full Arm",
  "Minimalist Modern Geometric",
  "Moroccan Mesh & Mandalas",
  "Custom Couple Monogram Henna"
];

export const SERVICE_TYPE_OPTIONS = [
  "Full Bridal Mehendi (Hands & Feet)",
  "Guest / Relative Family Mehendi",
  "Sangeet & Mehendi Party Team",
  "Baby Shower & Festive Henna"
];

export interface MehendiCustomizeStoreSectionProps {
  vendorName?: string;
  artistName?: string;
  businessName?: string;
  onBack?: () => void;
}

export function MehendiCustomizeStoreSection({
  vendorName,
  artistName,
  businessName,
  onBack,
}: MehendiCustomizeStoreSectionProps = {}) {
  const [vendorData, setVendorData] = useState<VendorProfileData | null>(null);

  // 1. Branding & Basic Info
  const [logoUrl, setLogoUrl] = useState<string>("");
  const [coverUrl, setCoverUrl] = useState<string>("");
  const [tagline, setTagline] = useState<string>("");
  const [about, setAbout] = useState<string>("");
  const [galleryImages, setGalleryImages] = useState<string[]>([]);

  // 2. Mehendi Specific Fields
  const [mehendiStyles, setMehendiStyles] = useState<string[]>([
    "Rajasthani Dulha-Dulhan Portrait",
    "Arabic Flowing Vines",
    "Indo-Arabic Fusion"
  ]);
  const [serviceTypes, setServiceTypes] = useState<string[]>([
    "Full Bridal Mehendi (Hands & Feet)",
    "Guest / Relative Family Mehendi"
  ]);
  const [avgApplicationTime, setAvgApplicationTime] = useState<string>(
    "4 Hours for Full Bridal Hands & Feet • 12 mins per guest hand"
  );
  const [artistsCount, setArtistsCount] = useState<string>(
    "Team of 4 Professional Artists available for large guest parties"
  );
  const [stainCarePolicy, setStainCarePolicy] = useState<string>(
    "100% Chemical-Free Organic Rajasthani Henna Cones • Rich Mahogany Stain Guarantee (24-48 hrs peak)"
  );
  const [organicHennaCertified, setOrganicHennaCertified] = useState<boolean>(true);

  // 3. Featured Henna Designs Showcase
  const [featuredDesigns, setFeaturedDesigns] = useState<
    Array<{ title: string; style: string; image: string; applicationTime: string }>
  >([
    {
      title: "Royal Rajwada Dulha-Dulhan Baraat Motif",
      style: "Rajasthani Dulha-Dulhan Portrait",
      image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop",
      applicationTime: "4.5 Hours"
    },
    {
      title: "Bold Arabic Rose Palms & Wrist Cuffs",
      style: "Arabic Flowing Vines",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop",
      applicationTime: "1.5 Hours"
    }
  ]);

  // UI state
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showLivePreview, setShowLivePreview] = useState(false);

  // Accordion state
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    branding: true,
    mehendiFields: true,
    featuredDesigns: true
  });

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  useEffect(() => {
    const cached = getActiveVendorIdentity();
    if (cached) {
      populateState(cached);
    }
    fetchAuthenticatedVendorFromDb().then((identity) => {
      if (identity) {
        populateState(identity);
      }
    });
  }, []);

  const populateState = (data: any) => {
    setVendorData(data);
    setLogoUrl(data.logo_url || data.logo || "");
    setCoverUrl(data.cover_image || data.coverImage || "");
    setTagline(data.tagline || "");
    setAbout(data.about || data.description || "");
    setGalleryImages(data.gallery_images || data.galleryImages || []);

    if (data.mehendi_styles && Array.isArray(data.mehendi_styles)) {
      setMehendiStyles(data.mehendi_styles);
    }
    if (data.service_types && Array.isArray(data.service_types)) {
      setServiceTypes(data.service_types);
    }
    if (data.avg_application_time || data.avgApplicationTime) {
      setAvgApplicationTime(data.avg_application_time || data.avgApplicationTime);
    }
    if (data.artists_count || data.artistsCount) {
      setArtistsCount(data.artists_count || data.artistsCount);
    }
    if (data.stain_care_policy || data.stainCarePolicy) {
      setStainCarePolicy(data.stain_care_policy || data.stainCarePolicy);
    }
    if (data.organic_henna_certified !== undefined) {
      setOrganicHennaCertified(Boolean(data.organic_henna_certified));
    }
    if (data.featured_designs && Array.isArray(data.featured_designs) && data.featured_designs.length > 0) {
      setFeaturedDesigns(data.featured_designs);
    }
  };

  const handleImageUpload = async (
    file: File,
    target: "logo" | "cover" | "design",
    index?: number
  ) => {
    try {
      const result = await uploadImageToCloudinaryDetailed(file);
      if (result.secure_url) {
        const url = result.secure_url;
        if (target === "logo") setLogoUrl(url);
        if (target === "cover") setCoverUrl(url);
        if (target === "design" && index !== undefined) {
          const updated = [...featuredDesigns];
          updated[index].image = url;
          setFeaturedDesigns(updated);
        }
        showVendorToast("Image uploaded successfully!", "success");
      } else {
        showVendorToast("Upload failed", "error");
      }
    } catch (err: any) {
      showVendorToast("Upload error: " + err.message, "error");
    }
  };

  const handleToggleStyle = (item: string) => {
    setMehendiStyles((prev) =>
      prev.includes(item) ? prev.filter((s) => s !== item) : [...prev, item]
    );
  };

  const handleToggleService = (item: string) => {
    setServiceTypes((prev) =>
      prev.includes(item) ? prev.filter((s) => s !== item) : [...prev, item]
    );
  };

  const handleAddDesign = () => {
    setFeaturedDesigns((prev) => [
      ...prev,
      {
        title: "New Custom Henna Pattern",
        style: "Rajasthani Dulha-Dulhan Portrait",
        image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop",
        applicationTime: "3 Hours"
      }
    ]);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);

    const payload: Partial<VendorProfileData> & Record<string, any> = {
      logo_url: logoUrl,
      cover_image: coverUrl,
      tagline,
      about,
      gallery_images: galleryImages,
      mehendi_styles: mehendiStyles,
      service_types: serviceTypes,
      avg_application_time: avgApplicationTime,
      artists_count: artistsCount,
      stain_care_policy: stainCarePolicy,
      organic_henna_certified: organicHennaCertified,
      featured_designs: featuredDesigns
    };

    try {
      const res = await syncVendorProfileWithDatabase(payload);
      if (res.success) {
        setSaveSuccess(true);
        showVendorToast("Mehendi Artist storefront saved successfully to Supabase!", "success");
        setTimeout(() => setSaveSuccess(false), 4000);
      } else {
        showVendorToast("Failed to save changes. Please try again.", "error");
      }
    } catch (err: any) {
      showVendorToast("Error saving mehendi profile: " + err.message, "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-24">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gold/15 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-[#0F4C45]/10 text-[#0F4C45] rounded-xl">
              <Palette className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-serif font-bold text-charcoal">Mehendi Artist Customization</h2>
          </div>
          <p className="text-xs text-charcoal/60 mt-1">
            Configure design styles, bridal vs guest services, application timings, artist team size, and organic stain policy.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={() => setShowLivePreview(!showLivePreview)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gold/30 text-xs font-bold text-charcoal hover:bg-[#FAF7F2] transition-colors"
          >
            <Eye className="w-4 h-4 text-[#0F4C45]" />
            {showLivePreview ? "Edit Mode" : "Live Preview"}
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0F4C45] text-white text-xs font-bold hover:bg-[#0A3732] transition-all shadow-md disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isSaving ? "Saving to Supabase..." : "Save Storefront"}
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl flex items-center gap-3 text-xs font-semibold animate-in fade-in duration-200">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Your Mehendi Artist Storefront modifications were saved permanently to Supabase!</span>
        </div>
      )}

      {showLivePreview ? (
        <div className="bg-white rounded-3xl border border-gold/20 p-4 sm:p-8 shadow-sm">
          <div className="mb-4 pb-3 border-b border-gold/15 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-widest text-[#0F4C45] flex items-center gap-2">
              <Eye className="w-4 h-4" /> Live Mehendi Artist Profile Preview
            </span>
            <span className="text-xs text-charcoal/60">Live Public View</span>
          </div>
          <VendorStorefront
            vendor={{
              id: vendorData?.id || "preview-id",
              name: vendorName || vendorData?.name || "Royal Henna Artistry",
              boutique_name: vendorName || vendorData?.boutique_name || "Royal Henna Artistry",
              category: "mehendi",
              logo_url: logoUrl,
              cover_image: coverUrl,
              tagline: tagline || "Bespoke Bridal Portrait Henna & Intricate Arabic Patterns",
              about: about || "Creating deep mahogany stains using 100% chemical-free organic Rajasthani henna cones.",
              mehendiStyles,
              serviceTypes,
              avgApplicationTime,
              artistsCount,
              stainCarePolicy,
              featuredDesigns
            }}
          />
        </div>
      ) : (
        <div className="space-y-6">
          {/* SECTION 1: Brand Header */}
          <div className="bg-white rounded-3xl border border-gold/15 shadow-sm overflow-hidden">
            <button
              onClick={() => toggleSection("branding")}
              className="w-full flex items-center justify-between p-6 bg-white hover:bg-[#FAF7F2] transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <Palette className="w-5 h-5 text-[#0F4C45]" />
                <div>
                  <h3 className="font-serif font-bold text-base text-charcoal">1. Studio Logo & Cover Banner</h3>
                  <p className="text-xs text-charcoal/60">Set studio logo, header cover image, tagline and artist bio</p>
                </div>
              </div>
              {openSections.branding ? <ChevronUp className="w-5 h-5 text-charcoal/40" /> : <ChevronDown className="w-5 h-5 text-charcoal/40" />}
            </button>

            {openSections.branding && (
              <div className="p-6 pt-0 border-t border-gold/10 space-y-6 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-2">Artist / Studio Logo</label>
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 rounded-2xl border-2 border-dashed border-gold/30 bg-[#FAF7F2] overflow-hidden flex items-center justify-center relative">
                        {logoUrl ? (
                          <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
                        ) : (
                          <Palette className="w-8 h-8 text-charcoal/30" />
                        )}
                      </div>
                      <div>
                        <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0F4C45]/10 text-[#0F4C45] text-xs font-bold hover:bg-[#0F4C45]/20 transition-colors">
                          <Upload className="w-4 h-4" /> Upload Logo
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], "logo")}
                          />
                        </label>
                        <p className="text-[11px] text-charcoal/50 mt-1">Square format logo or portrait headshot</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-2">Cover Banner</label>
                    <div className="flex items-center gap-4">
                      <div className="w-36 h-20 rounded-2xl border-2 border-dashed border-gold/30 bg-[#FAF7F2] overflow-hidden flex items-center justify-center relative">
                        {coverUrl ? (
                          <img src={coverUrl} alt="Cover" className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon className="w-8 h-8 text-charcoal/30" />
                        )}
                      </div>
                      <div>
                        <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0F4C45]/10 text-[#0F4C45] text-xs font-bold hover:bg-[#0F4C45]/20 transition-colors">
                          <Upload className="w-4 h-4" /> Upload Cover
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], "cover")}
                          />
                        </label>
                        <p className="text-[11px] text-charcoal/50 mt-1">High-res photo of bridal henna work</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">Tagline</label>
                    <input
                      type="text"
                      value={tagline}
                      onChange={(e) => setTagline(e.target.value)}
                      placeholder="e.g. Royal Rajasthani Portraits & Dark Organic Henna Stains"
                      className="w-full px-4 py-2.5 rounded-xl border border-gold/20 text-xs text-charcoal"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">Artist Bio & Henna Experience</label>
                    <textarea
                      rows={3}
                      value={about}
                      onChange={(e) => setAbout(e.target.value)}
                      placeholder="Describe your design heritage, chemical-free henna cone formula, and bridal booking policy..."
                      className="w-full px-4 py-2.5 rounded-xl border border-gold/20 text-xs text-charcoal"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SECTION 2: Design Styles & Service Types */}
          <div className="bg-white rounded-3xl border border-gold/15 shadow-sm overflow-hidden">
            <button
              onClick={() => toggleSection("mehendiFields")}
              className="w-full flex items-center justify-between p-6 bg-white hover:bg-[#FAF7F2] transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-[#0F4C45]" />
                <div>
                  <h3 className="font-serif font-bold text-base text-charcoal">2. Design Styles, Application Time & Artist Team</h3>
                  <p className="text-xs text-charcoal/60">Configure design specialities, application hours, and organic stain policy</p>
                </div>
              </div>
              {openSections.mehendiFields ? <ChevronUp className="w-5 h-5 text-charcoal/40" /> : <ChevronDown className="w-5 h-5 text-charcoal/40" />}
            </button>

            {openSections.mehendiFields && (
              <div className="p-6 pt-0 border-t border-gold/10 space-y-6 mt-4">
                {/* Design Styles */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-3">Design Style Specialities</label>
                  <div className="flex flex-wrap gap-2">
                    {MEHENDI_STYLE_OPTIONS.map((item) => {
                      const selected = mehendiStyles.includes(item);
                      return (
                        <button
                          key={item}
                          type="button"
                          onClick={() => handleToggleStyle(item)}
                          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                            selected
                              ? "bg-[#0F4C45] text-white shadow-xs"
                              : "bg-[#FAF7F2] text-charcoal border border-gold/20 hover:border-gold/40"
                          }`}
                        >
                          {selected ? <Check className="w-3.5 h-3.5 text-gold" /> : <Plus className="w-3.5 h-3.5 text-charcoal/40" />}
                          {item}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Service Types */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-3">Service Types Offered</label>
                  <div className="flex flex-wrap gap-2">
                    {SERVICE_TYPE_OPTIONS.map((item) => {
                      const selected = serviceTypes.includes(item);
                      return (
                        <button
                          key={item}
                          type="button"
                          onClick={() => handleToggleService(item)}
                          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                            selected
                              ? "bg-[#0F4C45] text-white shadow-xs"
                              : "bg-[#FAF7F2] text-charcoal border border-gold/20 hover:border-gold/40"
                          }`}
                        >
                          {selected ? <Check className="w-3.5 h-3.5 text-gold" /> : <Plus className="w-3.5 h-3.5 text-charcoal/40" />}
                          {item}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">Average Application Time</label>
                    <input
                      type="text"
                      value={avgApplicationTime}
                      onChange={(e) => setAvgApplicationTime(e.target.value)}
                      placeholder="e.g. 4 Hours for Full Bridal • 12 mins per guest hand"
                      className="w-full px-4 py-2.5 rounded-xl border border-gold/20 text-xs text-charcoal"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">Number of Artists Available</label>
                    <input
                      type="text"
                      value={artistsCount}
                      onChange={(e) => setArtistsCount(e.target.value)}
                      placeholder="e.g. Lead Artist + Team of 4 Assistants for Guest Groups"
                      className="w-full px-4 py-2.5 rounded-xl border border-gold/20 text-xs text-charcoal"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">Organic Stain & Cone Quality Guarantee</label>
                  <textarea
                    rows={2}
                    value={stainCarePolicy}
                    onChange={(e) => setStainCarePolicy(e.target.value)}
                    placeholder="e.g. 100% Chemical-Free Organic Sojat Henna Cones with Aftercare Oil & Deep Stain Guarantee."
                    className="w-full px-4 py-2.5 rounded-xl border border-gold/20 text-xs text-charcoal"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="organic-cert"
                    checked={organicHennaCertified}
                    onChange={(e) => setOrganicHennaCertified(e.target.checked)}
                    className="accent-[#0F4C45]"
                  />
                  <label htmlFor="organic-cert" className="text-xs font-semibold text-charcoal cursor-pointer flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#0F4C45]" /> Certified 100% Organic & Chemical-Free Henna Cones
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* SECTION 3: Featured Henna Designs */}
          <div className="bg-white rounded-3xl border border-gold/15 shadow-sm overflow-hidden">
            <button
              onClick={() => toggleSection("featuredDesigns")}
              className="w-full flex items-center justify-between p-6 bg-white hover:bg-[#FAF7F2] transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-[#0F4C45]" />
                <div>
                  <h3 className="font-serif font-bold text-base text-charcoal">3. Featured Design Showcase Items</h3>
                  <p className="text-xs text-charcoal/60">Highlight your best bridal henna patterns, portraits & Arabic cuffs</p>
                </div>
              </div>
              {openSections.featuredDesigns ? <ChevronUp className="w-5 h-5 text-charcoal/40" /> : <ChevronDown className="w-5 h-5 text-charcoal/40" />}
            </button>

            {openSections.featuredDesigns && (
              <div className="p-6 pt-0 border-t border-gold/10 space-y-6 mt-4">
                <div className="space-y-4">
                  {featuredDesigns.map((item, idx) => (
                    <div key={idx} className="p-4 rounded-2xl border border-gold/20 bg-[#FAF7F2] space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#0F4C45]">Design #{idx + 1}</span>
                        <button
                          type="button"
                          onClick={() => setFeaturedDesigns((prev) => prev.filter((_, i) => i !== idx))}
                          className="text-red-500 hover:text-red-700 text-xs flex items-center gap-1 font-bold"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Remove
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="sm:col-span-1">
                          <label className="block text-[11px] font-bold text-charcoal mb-1">Design Photo</label>
                          <div className="h-28 rounded-xl border border-gold/30 bg-white overflow-hidden relative flex items-center justify-center">
                            {item.image ? (
                              <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                            ) : (
                              <Palette className="w-6 h-6 text-charcoal/30" />
                            )}
                          </div>
                          <label className="cursor-pointer mt-2 inline-flex items-center justify-center gap-1.5 w-full py-1.5 rounded-lg bg-[#0F4C45]/10 text-[#0F4C45] text-[11px] font-bold">
                            <Upload className="w-3 h-3" /> Change Photo
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], "design", idx)}
                            />
                          </label>
                        </div>

                        <div className="sm:col-span-2 space-y-3">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[11px] font-bold text-charcoal mb-1">Design Title</label>
                              <input
                                type="text"
                                value={item.title}
                                onChange={(e) => {
                                  const updated = [...featuredDesigns];
                                  updated[idx].title = e.target.value;
                                  setFeaturedDesigns(updated);
                                }}
                                className="w-full px-3 py-2 rounded-lg border border-gold/20 text-xs text-charcoal"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold text-charcoal mb-1">Design Style</label>
                              <select
                                value={item.style}
                                onChange={(e) => {
                                  const updated = [...featuredDesigns];
                                  updated[idx].style = e.target.value;
                                  setFeaturedDesigns(updated);
                                }}
                                className="w-full px-3 py-2 rounded-lg border border-gold/20 text-xs text-charcoal bg-white"
                              >
                                {MEHENDI_STYLE_OPTIONS.map((st) => (
                                  <option key={st} value={st}>
                                    {st}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-charcoal mb-1">Application Time Required</label>
                            <input
                              type="text"
                              value={item.applicationTime}
                              onChange={(e) => {
                                const updated = [...featuredDesigns];
                                updated[idx].applicationTime = e.target.value;
                                setFeaturedDesigns(updated);
                              }}
                              placeholder="e.g. 3.5 Hours"
                              className="w-full px-3 py-2 rounded-lg border border-gold/20 text-xs text-charcoal"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleAddDesign}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-[#0F4C45]/40 text-[#0F4C45] text-xs font-bold hover:bg-[#0F4C45]/5 w-full justify-center"
                >
                  <Plus className="w-4 h-4" /> Add Another Showcase Design
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
