"use client";

import { useState, useEffect } from "react";
import {
  Sparkles,
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
  Heart,
  Palette,
  Clock,
  MapPin,
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

export const MAKEUP_STYLE_OPTIONS = [
  "HD Bridal Makeup",
  "Airbrush Glam",
  "Natural / No-Makeup Glow",
  "Bridal Traditional Rajasthani/South Indian",
  "Smokey Eye Reception Look",
  "Sangeet & Party Makeup",
  "Editorial & Pre-Wedding Shoot Styling"
];

export const BRAND_OPTIONS = [
  "MAC Cosmetics",
  "Bobbi Brown",
  "NARS",
  "Charlotte Tilbury",
  "Huda Beauty",
  "Dior Beauty",
  "Estée Lauder",
  "Kryolan",
  "Fenty Beauty",
  "Anastasya Beverly Hills",
  "Chanel",
  "Too Faced"
];

export interface MakeupCustomizeStoreSectionProps {
  vendorName?: string;
  onBack?: () => void;
}

export function MakeupCustomizeStoreSection({
  vendorName,
  onBack,
}: MakeupCustomizeStoreSectionProps = {}) {
  const [vendorData, setVendorData] = useState<VendorProfileData | null>(null);

  // 1. Branding & Basic Info
  const [logoUrl, setLogoUrl] = useState<string>("");
  const [coverUrl, setCoverUrl] = useState<string>("");
  const [tagline, setTagline] = useState<string>("");
  const [about, setAbout] = useState<string>("");
  const [galleryImages, setGalleryImages] = useState<string[]>([]);

  // 2. Makeup Specific Fields
  const [makeupStyles, setMakeupStyles] = useState<string[]>([
    "HD Bridal Makeup",
    "Airbrush Glam",
    "Smokey Eye Reception Look",
    "Sangeet & Party Makeup"
  ]);
  const [brandsUsed, setBrandsUsed] = useState<string[]>([
    "MAC Cosmetics",
    "Bobbi Brown",
    "NARS",
    "Charlotte Tilbury",
    "Huda Beauty"
  ]);
  const [customBrandInput, setCustomBrandInput] = useState<string>("");

  const [trialPolicy, setTrialPolicy] = useState<string>(
    "Paid Trial Available (Fee is deductible from final bridal package bill)"
  );
  const [locationAvailability, setLocationAvailability] = useState<string>(
    "Both Studio & On-Location Venue Travel"
  );
  const [travelRadius, setTravelRadius] = useState<string>(
    "Within City + Destination Wedding Outstation Travel Available"
  );
  const [teamSize, setTeamSize] = useState<string>(
    "Lead Artist + 2 Senior Assistants (Hair Stylist & Saree/Dupatta Draping Specialist)"
  );

  // 3. Before & After Paired Photo Transformations
  const [beforeAfterGallery, setBeforeAfterGallery] = useState<
    Array<{ beforeImage: string; afterImage: string; lookTitle: string; styleTag: string }>
  >([
    {
      beforeImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop",
      afterImage: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=600&auto=format&fit=crop",
      lookTitle: "Royal Dewy HD Bridal Transformation",
      styleTag: "HD Bridal Makeup"
    }
  ]);

  // 4. Featured Looks Showcase
  const [featuredLooks, setFeaturedLooks] = useState<
    Array<{ title: string; image: string; styleTag: string; products: string }>
  >([
    {
      title: "Pastel Sangeet Hollywood Waves",
      image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=800&auto=format&fit=crop",
      styleTag: "Airbrush Glam",
      products: "Charlotte Tilbury Flawless Filter & NARS Orgasm Blush"
    }
  ]);

  // UI state
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showLivePreview, setShowLivePreview] = useState(false);

  // Accordion state
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    branding: true,
    stylesAndBrands: true,
    policyAndTravel: true,
    beforeAfter: true,
    featuredLooks: true
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

    if (data.makeup_styles && Array.isArray(data.makeup_styles)) {
      setMakeupStyles(data.makeup_styles);
    }
    if (data.brands_used && Array.isArray(data.brands_used)) {
      setBrandsUsed(data.brands_used);
    }
    if (data.trial_policy || data.trialPolicy) {
      setTrialPolicy(data.trial_policy || data.trialPolicy);
    }
    if (data.location_availability || data.locationAvailability) {
      setLocationAvailability(data.location_availability || data.locationAvailability);
    }
    if (data.travel_radius || data.travelRadius) {
      setTravelRadius(data.travel_radius || data.travelRadius);
    }
    if (data.team_size || data.teamSize) {
      setTeamSize(data.team_size || data.teamSize);
    }
    if (data.before_after_gallery && Array.isArray(data.before_after_gallery) && data.before_after_gallery.length > 0) {
      setBeforeAfterGallery(data.before_after_gallery);
    }
    if (data.featured_looks && Array.isArray(data.featured_looks) && data.featured_looks.length > 0) {
      setFeaturedLooks(data.featured_looks);
    }
  };

  const handleImageUpload = async (
    file: File,
    target: "logo" | "cover" | "before" | "after" | "look",
    index?: number
  ) => {
    try {
      const result = await uploadImageToCloudinaryDetailed(file);
      if (result.secure_url) {
        const url = result.secure_url;
        if (target === "logo") setLogoUrl(url);
        if (target === "cover") setCoverUrl(url);
        if (target === "before" && index !== undefined) {
          const updated = [...beforeAfterGallery];
          updated[index].beforeImage = url;
          setBeforeAfterGallery(updated);
        }
        if (target === "after" && index !== undefined) {
          const updated = [...beforeAfterGallery];
          updated[index].afterImage = url;
          setBeforeAfterGallery(updated);
        }
        if (target === "look" && index !== undefined) {
          const updated = [...featuredLooks];
          updated[index].image = url;
          setFeaturedLooks(updated);
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
    setMakeupStyles((prev) =>
      prev.includes(item) ? prev.filter((s) => s !== item) : [...prev, item]
    );
  };

  const handleToggleBrand = (item: string) => {
    setBrandsUsed((prev) =>
      prev.includes(item) ? prev.filter((b) => b !== item) : [...prev, item]
    );
  };

  const handleAddCustomBrand = () => {
    if (customBrandInput.trim() && !brandsUsed.includes(customBrandInput.trim())) {
      setBrandsUsed((prev) => [...prev, customBrandInput.trim()]);
      setCustomBrandInput("");
    }
  };

  const handleAddBeforeAfter = () => {
    setBeforeAfterGallery((prev) => [
      ...prev,
      {
        beforeImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop",
        afterImage: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=600&auto=format&fit=crop",
        lookTitle: "New Transformation",
        styleTag: "HD Makeup"
      }
    ]);
  };

  const handleAddFeaturedLook = () => {
    setFeaturedLooks((prev) => [
      ...prev,
      {
        title: "New Featured Look",
        image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=800&auto=format&fit=crop",
        styleTag: "Bridal Traditional",
        products: "MAC, Huda Beauty & NARS"
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
      makeup_styles: makeupStyles,
      brands_used: brandsUsed,
      trial_policy: trialPolicy,
      location_availability: locationAvailability,
      travel_radius: travelRadius,
      team_size: teamSize,
      before_after_gallery: beforeAfterGallery,
      featured_looks: featuredLooks
    };

    try {
      const res = await syncVendorProfileWithDatabase(payload);
      if (res.success) {
        setSaveSuccess(true);
        showVendorToast("Makeup Artist storefront saved successfully to Supabase!", "success");
        setTimeout(() => setSaveSuccess(false), 4000);
      } else {
        showVendorToast("Failed to save changes. Please try again.", "error");
      }
    } catch (err: any) {
      showVendorToast("Error saving makeup profile: " + err.message, "error");
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
              <Sparkles className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-serif font-bold text-charcoal">Makeup Artist Customization</h2>
          </div>
          <p className="text-xs text-charcoal/60 mt-1">
            Configure your makeup styles, cosmetic brand list, trial policy, travel radius, and Before & After transformations.
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
          <span>Your Makeup Artist Storefront modifications were saved permanently to Supabase!</span>
        </div>
      )}

      {showLivePreview ? (
        <div className="bg-white rounded-3xl border border-gold/20 p-4 sm:p-8 shadow-sm">
          <div className="mb-4 pb-3 border-b border-gold/15 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-widest text-[#0F4C45] flex items-center gap-2">
              <Eye className="w-4 h-4" /> Live Makeup Artist Profile Preview
            </span>
            <span className="text-xs text-charcoal/60">Live Public View</span>
          </div>
          <VendorStorefront
            vendor={{
              id: vendorData?.id || "preview-id",
              name: vendorName || vendorData?.name || "Glamour HD Makeup Studio",
              boutique_name: vendorName || vendorData?.boutique_name || "Glamour HD Makeup Studio",
              category: "makeup",
              logo_url: logoUrl,
              cover_image: coverUrl,
              tagline: tagline || "Bespoke HD & Airbrush Bridal Transformations",
              about: about || "Specializing in luxury skin preparation, lightweight HD bridal makeup, and long-lasting airbrush glam.",
              makeupStyles,
              brandsUsed,
              trialPolicy,
              locationAvailability,
              travelRadius,
              beforeAfterGallery,
              featuredLooks
            }}
          />
        </div>
      ) : (
        <div className="space-y-6">
          {/* SECTION 1: Brand & Cover */}
          <div className="bg-white rounded-3xl border border-gold/15 shadow-sm overflow-hidden">
            <button
              onClick={() => toggleSection("branding")}
              className="w-full flex items-center justify-between p-6 bg-white hover:bg-[#FAF7F2] transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-[#0F4C45]" />
                <div>
                  <h3 className="font-serif font-bold text-base text-charcoal">1. Brand Logo & Cover Banner</h3>
                  <p className="text-xs text-charcoal/60">Set studio logo, header banner, tagline and artist bio</p>
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
                          <Sparkles className="w-8 h-8 text-charcoal/30" />
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
                        <p className="text-[11px] text-charcoal/50 mt-1">High-res landscape portrait or look showcase</p>
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
                      placeholder="e.g. Flawless HD & Airbrush Bridal Transformations"
                      className="w-full px-4 py-2.5 rounded-xl border border-gold/20 text-xs text-charcoal"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">Artist Bio & Experience</label>
                    <textarea
                      rows={3}
                      value={about}
                      onChange={(e) => setAbout(e.target.value)}
                      placeholder="Describe your makeup philosophy, certifications, hygiene standards, skin prep techniques..."
                      className="w-full px-4 py-2.5 rounded-xl border border-gold/20 text-xs text-charcoal"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SECTION 2: Makeup Styles & Cosmetic Brands Used */}
          <div className="bg-white rounded-3xl border border-gold/15 shadow-sm overflow-hidden">
            <button
              onClick={() => toggleSection("stylesAndBrands")}
              className="w-full flex items-center justify-between p-6 bg-white hover:bg-[#FAF7F2] transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <Palette className="w-5 h-5 text-[#0F4C45]" />
                <div>
                  <h3 className="font-serif font-bold text-base text-charcoal">2. Makeup Specialities & Brands Used</h3>
                  <p className="text-xs text-charcoal/60">Multi-select makeup styles and luxury cosmetic brands you stock</p>
                </div>
              </div>
              {openSections.stylesAndBrands ? <ChevronUp className="w-5 h-5 text-charcoal/40" /> : <ChevronDown className="w-5 h-5 text-charcoal/40" />}
            </button>

            {openSections.stylesAndBrands && (
              <div className="p-6 pt-0 border-t border-gold/10 space-y-6 mt-4">
                {/* Style Specialities */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-3">Makeup Style Specialities</label>
                  <div className="flex flex-wrap gap-2">
                    {MAKEUP_STYLE_OPTIONS.map((item) => {
                      const selected = makeupStyles.includes(item);
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

                {/* Brands Used */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-3">Beauty Brands Used (Clients check this for sensitive skin)</label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {BRAND_OPTIONS.map((brand) => {
                      const selected = brandsUsed.includes(brand);
                      return (
                        <button
                          key={brand}
                          type="button"
                          onClick={() => handleToggleBrand(brand)}
                          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                            selected
                              ? "bg-[#0F4C45] text-white shadow-xs"
                              : "bg-[#FAF7F2] text-charcoal border border-gold/20 hover:border-gold/40"
                          }`}
                        >
                          {selected ? <Check className="w-3.5 h-3.5 text-gold" /> : <Plus className="w-3.5 h-3.5 text-charcoal/40" />}
                          {brand}
                        </button>
                      );
                    })}
                  </div>

                  {/* Add Custom Brand */}
                  <div className="flex gap-2 max-w-md">
                    <input
                      type="text"
                      value={customBrandInput}
                      onChange={(e) => setCustomBrandInput(e.target.value)}
                      placeholder="Add custom brand (e.g. Huda Beauty, Huda Desert Dusk)"
                      className="flex-1 px-3 py-2 rounded-xl border border-gold/20 text-xs text-charcoal"
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomBrand}
                      className="px-4 py-2 rounded-xl bg-[#0F4C45]/10 text-[#0F4C45] text-xs font-bold hover:bg-[#0F4C45]/20"
                    >
                      Add Brand
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SECTION 3: Trial Policy & Travel Radius */}
          <div className="bg-white rounded-3xl border border-gold/15 shadow-sm overflow-hidden">
            <button
              onClick={() => toggleSection("policyAndTravel")}
              className="w-full flex items-center justify-between p-6 bg-white hover:bg-[#FAF7F2] transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-[#0F4C45]" />
                <div>
                  <h3 className="font-serif font-bold text-base text-charcoal">3. Trial Session Policy & Travel Radius</h3>
                  <p className="text-xs text-charcoal/60">Define your trial session terms, studio vs. venue availability & team size</p>
                </div>
              </div>
              {openSections.policyAndTravel ? <ChevronUp className="w-5 h-5 text-charcoal/40" /> : <ChevronDown className="w-5 h-5 text-charcoal/40" />}
            </button>

            {openSections.policyAndTravel && (
              <div className="p-6 pt-0 border-t border-gold/10 space-y-4 mt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">Trial Session Policy</label>
                    <input
                      type="text"
                      value={trialPolicy}
                      onChange={(e) => setTrialPolicy(e.target.value)}
                      placeholder="e.g. Paid Trial Available (Deductible upon booking final bridal package)"
                      className="w-full px-4 py-2.5 rounded-xl border border-gold/20 text-xs text-charcoal"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">Location Availability</label>
                    <select
                      value={locationAvailability}
                      onChange={(e) => setLocationAvailability(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gold/20 text-xs text-charcoal bg-white"
                    >
                      <option value="Both Studio & On-Location Venue Travel">Both Studio & On-Location Venue Travel</option>
                      <option value="On-Location Venue Travel Only">On-Location Venue Travel Only</option>
                      <option value="Studio Only">Studio Only</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">Travel Radius / Destination Weddings</label>
                    <input
                      type="text"
                      value={travelRadius}
                      onChange={(e) => setTravelRadius(e.target.value)}
                      placeholder="e.g. Worldwide Travel & Destination Weddings Available"
                      className="w-full px-4 py-2.5 rounded-xl border border-gold/20 text-xs text-charcoal"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">Team Size & Assistant Support</label>
                    <input
                      type="text"
                      value={teamSize}
                      onChange={(e) => setTeamSize(e.target.value)}
                      placeholder="e.g. Solo Artist + 2 Assistants for Hair & Family Draping"
                      className="w-full px-4 py-2.5 rounded-xl border border-gold/20 text-xs text-charcoal"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SECTION 4: Before & After Transformation Gallery */}
          <div className="bg-white rounded-3xl border border-gold/15 shadow-sm overflow-hidden">
            <button
              onClick={() => toggleSection("beforeAfter")}
              className="w-full flex items-center justify-between p-6 bg-white hover:bg-[#FAF7F2] transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <Heart className="w-5 h-5 text-[#0F4C45]" />
                <div>
                  <h3 className="font-serif font-bold text-base text-charcoal">4. Before & After Transformations (Paired Photos)</h3>
                  <p className="text-xs text-charcoal/60">Upload side-by-side before & after photo pairs showcasing your skill</p>
                </div>
              </div>
              {openSections.beforeAfter ? <ChevronUp className="w-5 h-5 text-charcoal/40" /> : <ChevronDown className="w-5 h-5 text-charcoal/40" />}
            </button>

            {openSections.beforeAfter && (
              <div className="p-6 pt-0 border-t border-gold/10 space-y-6 mt-4">
                <div className="space-y-4">
                  {beforeAfterGallery.map((item, idx) => (
                    <div key={idx} className="p-4 rounded-2xl border border-gold/20 bg-[#FAF7F2] space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#0F4C45]">Transformation #{idx + 1}</span>
                        <button
                          type="button"
                          onClick={() => setBeforeAfterGallery((prev) => prev.filter((_, i) => i !== idx))}
                          className="text-red-500 hover:text-red-700 text-xs flex items-center gap-1 font-bold"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Remove
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Before photo */}
                        <div>
                          <label className="block text-[11px] font-bold text-charcoal mb-1">Before Photo</label>
                          <div className="h-32 rounded-xl border border-gold/30 bg-white overflow-hidden relative flex items-center justify-center">
                            {item.beforeImage ? (
                              <img src={item.beforeImage} alt="Before" className="w-full h-full object-cover" />
                            ) : (
                              <ImageIcon className="w-6 h-6 text-charcoal/30" />
                            )}
                          </div>
                          <label className="cursor-pointer mt-2 inline-flex items-center justify-center gap-1.5 w-full py-1.5 rounded-lg bg-[#0F4C45]/10 text-[#0F4C45] text-[11px] font-bold">
                            <Upload className="w-3 h-3" /> Upload Before
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], "before", idx)}
                            />
                          </label>
                        </div>

                        {/* After photo */}
                        <div>
                          <label className="block text-[11px] font-bold text-charcoal mb-1">After Photo (Final Glam)</label>
                          <div className="h-32 rounded-xl border border-gold/30 bg-white overflow-hidden relative flex items-center justify-center">
                            {item.afterImage ? (
                              <img src={item.afterImage} alt="After" className="w-full h-full object-cover" />
                            ) : (
                              <Sparkles className="w-6 h-6 text-charcoal/30" />
                            )}
                          </div>
                          <label className="cursor-pointer mt-2 inline-flex items-center justify-center gap-1.5 w-full py-1.5 rounded-lg bg-[#0F4C45]/10 text-[#0F4C45] text-[11px] font-bold">
                            <Upload className="w-3 h-3" /> Upload After
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], "after", idx)}
                            />
                          </label>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-charcoal mb-1">Look Title</label>
                          <input
                            type="text"
                            value={item.lookTitle}
                            onChange={(e) => {
                              const updated = [...beforeAfterGallery];
                              updated[idx].lookTitle = e.target.value;
                              setBeforeAfterGallery(updated);
                            }}
                            className="w-full px-3 py-2 rounded-lg border border-gold/20 text-xs text-charcoal"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-charcoal mb-1">Style Tag</label>
                          <input
                            type="text"
                            value={item.styleTag}
                            onChange={(e) => {
                              const updated = [...beforeAfterGallery];
                              updated[idx].styleTag = e.target.value;
                              setBeforeAfterGallery(updated);
                            }}
                            className="w-full px-3 py-2 rounded-lg border border-gold/20 text-xs text-charcoal"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleAddBeforeAfter}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-[#0F4C45]/40 text-[#0F4C45] text-xs font-bold hover:bg-[#0F4C45]/5 w-full justify-center"
                >
                  <Plus className="w-4 h-4" /> Add Another Transformation Pair
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
