"use client";

import { useState, useEffect } from "react";
import {
  UtensilsCrossed,
  Upload,
  Image as ImageIcon,
  CheckCircle,
  Save,
  Eye,
  Loader2,
  ChevronDown,
  ChevronUp,
  Globe,
  Plus,
  Trash2,
  Users,
  Award,
  Sparkles,
  ChefHat,
  Coffee,
  Flame,
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

export const CUISINE_OPTIONS = [
  "North Indian",
  "South Indian",
  "Continental / Western",
  "Chinese & Pan-Asian",
  "Live Street Food Counters",
  "Mughlai & Nawabi",
  "Italian & Wood-Fired Pizza",
  "Mexican & Tacos",
  "Regional (Rajasthani/Gujarati/Bengali)",
  "Traditional Sweets & Desserts",
  "Gourmet Mocktails & Beverages"
];

export const DIETARY_OPTIONS = [
  "Pure Veg",
  "Non-Veg",
  "Jain Food (No Onion / Garlic)",
  "Vegan Options",
  "Gluten-Free Options",
  "Halal Certified",
  "Nut-Free Options"
];

export const SERVICE_STYLES = [
  "Buffet Service Tiers",
  "Plated Table Service",
  "Live Cooking & Chef Stations",
  "Family Style Platters",
  "Finger Food & Passing Trays"
];

export interface CateringCustomizeStoreSectionProps {
  vendorName?: string;
  onBack?: () => void;
}

export function CateringCustomizeStoreSection({
  vendorName,
  onBack,
}: CateringCustomizeStoreSectionProps = {}) {
  const [vendorData, setVendorData] = useState<VendorProfileData | null>(null);

  // 1. Branding & Basic Info
  const [logoUrl, setLogoUrl] = useState<string>("");
  const [coverUrl, setCoverUrl] = useState<string>("");
  const [tagline, setTagline] = useState<string>("");
  const [about, setAbout] = useState<string>("");
  const [colorTheme, setColorTheme] = useState<string>("emerald");
  const [galleryImages, setGalleryImages] = useState<string[]>([]);

  // 2. Catering Specific Fields
  const [cuisineTypes, setCuisineTypes] = useState<string[]>([
    "North Indian",
    "South Indian",
    "Live Street Food Counters",
    "Mughlai & Nawabi",
    "Traditional Sweets & Desserts"
  ]);
  const [dietaryOptions, setDietaryOptions] = useState<string[]>([
    "Pure Veg",
    "Non-Veg",
    "Jain Food (No Onion / Garlic)"
  ]);
  const [serviceStyles, setServiceStyles] = useState<string[]>([
    "Buffet Service Tiers",
    "Live Cooking & Chef Stations"
  ]);
  const [minGuests, setMinGuests] = useState<string>("100");
  const [maxGuests, setMaxGuests] = useState<string>("2500");
  const [staffingDetails, setStaffingDetails] = useState<string>(
    "Uniformed Waitstaff (1 per 15 guests), Live Station Chefs & On-Site Supervisor Included"
  );

  // Signature Dishes
  const [featuredDishes, setFeaturedDishes] = useState<
    Array<{ name: string; category: string; description: string; image: string; isVeg: boolean }>
  >([
    {
      name: "Royal Dal Baati Churma & Gatte",
      category: "Main Course",
      description: "Authentic Marwari feast cooked in pure desi ghee with wooden-clay aromatics",
      image: "https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=800&auto=format&fit=crop",
      isVeg: true
    },
    {
      name: "Artisanal Live Chaat & Pani Puri Bar",
      category: "Live Counter",
      description: "6 flavored waters, crispy tikkis, and custom street snacks made live",
      image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800&auto=format&fit=crop",
      isVeg: true
    }
  ]);

  // Social Links
  const [instagram, setInstagram] = useState<string>("");
  const [website, setWebsite] = useState<string>("");

  // UI state
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showLivePreview, setShowLivePreview] = useState(false);

  // Accordion state
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    branding: true,
    cuisines: true,
    capacity: true,
    signatureDishes: true
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
    setColorTheme(data.color_theme || data.colorTheme || "emerald");
    setGalleryImages(data.gallery_images || data.galleryImages || []);
    setInstagram(data.instagram || "");
    setWebsite(data.website || "");

    if (data.cuisine_types && Array.isArray(data.cuisine_types)) {
      setCuisineTypes(data.cuisine_types);
    }
    if (data.dietary_options && Array.isArray(data.dietary_options)) {
      setDietaryOptions(data.dietary_options);
    }
    if (data.service_styles && Array.isArray(data.service_styles)) {
      setServiceStyles(data.service_styles);
    }
    if (data.min_guests || data.minGuests) {
      setMinGuests(data.min_guests || data.minGuests);
    }
    if (data.max_guests || data.maxGuests) {
      setMaxGuests(data.max_guests || data.maxGuests);
    }
    if (data.staffing_details || data.staffingDetails) {
      setStaffingDetails(data.staffing_details || data.staffingDetails);
    }
    if (data.featured_dishes && Array.isArray(data.featured_dishes) && data.featured_dishes.length > 0) {
      setFeaturedDishes(data.featured_dishes);
    }
  };

  const handleImageUpload = async (
    file: File,
    target: "logo" | "cover" | "gallery" | "dish",
    dishIndex?: number
  ) => {
    try {
      const result = await uploadImageToCloudinaryDetailed(file);
      if (result.secure_url) {
        const url = result.secure_url;
        if (target === "logo") setLogoUrl(url);
        if (target === "cover") setCoverUrl(url);
        if (target === "gallery") setGalleryImages((prev) => [...prev, url]);
        if (target === "dish" && dishIndex !== undefined) {
          const updated = [...featuredDishes];
          updated[dishIndex].image = url;
          setFeaturedDishes(updated);
        }
        showVendorToast("Image uploaded successfully!", "success");
      } else {
        showVendorToast("Upload failed", "error");
      }
    } catch (err: any) {
      showVendorToast("Upload error: " + err.message, "error");
    }
  };

  const handleToggleCuisine = (item: string) => {
    setCuisineTypes((prev) =>
      prev.includes(item) ? prev.filter((c) => c !== item) : [...prev, item]
    );
  };

  const handleToggleDietary = (item: string) => {
    setDietaryOptions((prev) =>
      prev.includes(item) ? prev.filter((d) => d !== item) : [...prev, item]
    );
  };

  const handleToggleServiceStyle = (item: string) => {
    setServiceStyles((prev) =>
      prev.includes(item) ? prev.filter((s) => s !== item) : [...prev, item]
    );
  };

  const handleAddDish = () => {
    setFeaturedDishes((prev) => [
      ...prev,
      {
        name: "New Signature Dish",
        category: "Main Course",
        description: "Freshly prepared specialty using traditional recipes",
        image: "https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=800&auto=format&fit=crop",
        isVeg: true
      }
    ]);
  };

  const handleRemoveDish = (index: number) => {
    setFeaturedDishes((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);

    const payload: Partial<VendorProfileData> & Record<string, any> = {
      logo_url: logoUrl,
      cover_image: coverUrl,
      tagline,
      about,
      color_theme: colorTheme,
      gallery_images: galleryImages,
      instagram,
      website,
      cuisine_types: cuisineTypes,
      dietary_options: dietaryOptions,
      service_styles: serviceStyles,
      min_guests: minGuests,
      max_guests: maxGuests,
      staffing_details: staffingDetails,
      featured_dishes: featuredDishes
    };

    try {
      const res = await syncVendorProfileWithDatabase(payload);
      if (res.success) {
        setSaveSuccess(true);
        showVendorToast("Catering customization saved successfully to Supabase!", "success");
        setTimeout(() => setSaveSuccess(false), 4000);
      } else {
        showVendorToast("Failed to save changes. Please try again.", "error");
      }
    } catch (err: any) {
      showVendorToast("Error saving catering details: " + err.message, "error");
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
              <UtensilsCrossed className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-serif font-bold text-charcoal">Catering Storefront Customization</h2>
          </div>
          <p className="text-xs text-charcoal/60 mt-1">
            Configure your cuisines, dietary options, service styles, guest capacity, and signature menu items.
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
          <span>Your Catering Storefront modifications were saved permanently to Supabase and are live!</span>
        </div>
      )}

      {showLivePreview ? (
        <div className="bg-white rounded-3xl border border-gold/20 p-4 sm:p-8 shadow-sm">
          <div className="mb-4 pb-3 border-b border-gold/15 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-widest text-[#0F4C45] flex items-center gap-2">
              <Eye className="w-4 h-4" /> Live Catering Profile Preview
            </span>
            <span className="text-xs text-charcoal/60">Live Public View</span>
          </div>
          <VendorStorefront
            vendor={{
              id: vendorData?.id || "preview-id",
              name: vendorName || vendorData?.name || "Gourmet Catering Co.",
              boutique_name: vendorName || vendorData?.boutique_name || "Gourmet Catering Co.",
              category: "catering",
              logo_url: logoUrl,
              cover_image: coverUrl,
              tagline: tagline || "Exquisite Multi-Cuisine Feasts & Live Culinary Stations",
              about: about || "Mastering royal thalis, international live counters, and high-end wedding buffets.",
              cuisineTypes,
              dietaryOptions,
              serviceStyles,
              guestCapacity: `${minGuests} - ${maxGuests} Guests`,
              featuredDishes
            }}
          />
        </div>
      ) : (
        <div className="space-y-6">
          {/* SECTION 1: Brand & Cover Identity */}
          <div className="bg-white rounded-3xl border border-gold/15 shadow-sm overflow-hidden">
            <button
              onClick={() => toggleSection("branding")}
              className="w-full flex items-center justify-between p-6 bg-white hover:bg-[#FAF7F2] transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <ChefHat className="w-5 h-5 text-[#0F4C45]" />
                <div>
                  <h3 className="font-serif font-bold text-base text-charcoal">1. Brand Identity & Header Cover</h3>
                  <p className="text-xs text-charcoal/60">Set your catering brand logo, cover banner, tagline & description</p>
                </div>
              </div>
              {openSections.branding ? <ChevronUp className="w-5 h-5 text-charcoal/40" /> : <ChevronDown className="w-5 h-5 text-charcoal/40" />}
            </button>

            {openSections.branding && (
              <div className="p-6 pt-0 border-t border-gold/10 space-y-6 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Logo Upload */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-2">Catering Logo</label>
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 rounded-2xl border-2 border-dashed border-gold/30 bg-[#FAF7F2] overflow-hidden flex items-center justify-center relative">
                        {logoUrl ? (
                          <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
                        ) : (
                          <ChefHat className="w-8 h-8 text-charcoal/30" />
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
                        <p className="text-[11px] text-charcoal/50 mt-1">PNG, JPG or WEBP (Square format recommended)</p>
                      </div>
                    </div>
                  </div>

                  {/* Cover Image Upload */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-2">Header Cover Banner</label>
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
                        <p className="text-[11px] text-charcoal/50 mt-1">High-res landscape image of food setup</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">Catering Tagline</label>
                    <input
                      type="text"
                      value={tagline}
                      onChange={(e) => setTagline(e.target.value)}
                      placeholder="e.g. Royal Marwari Thalis & Gourmet Live Street Food Counters"
                      className="w-full px-4 py-2.5 rounded-xl border border-gold/20 text-xs text-charcoal focus:outline-none focus:border-[#0F4C45]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">Catering Description / About</label>
                    <textarea
                      rows={3}
                      value={about}
                      onChange={(e) => setAbout(e.target.value)}
                      placeholder="Describe your culinary heritage, chef credentials, hygiene standards, and event specialities..."
                      className="w-full px-4 py-2.5 rounded-xl border border-gold/20 text-xs text-charcoal focus:outline-none focus:border-[#0F4C45]"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SECTION 2: Cuisines & Dietary Accommodations */}
          <div className="bg-white rounded-3xl border border-gold/15 shadow-sm overflow-hidden">
            <button
              onClick={() => toggleSection("cuisines")}
              className="w-full flex items-center justify-between p-6 bg-white hover:bg-[#FAF7F2] transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <UtensilsCrossed className="w-5 h-5 text-[#0F4C45]" />
                <div>
                  <h3 className="font-serif font-bold text-base text-charcoal">2. Cuisines & Dietary Accommodations</h3>
                  <p className="text-xs text-charcoal/60">Multi-select the cuisines you offer and dietary options handled</p>
                </div>
              </div>
              {openSections.cuisines ? <ChevronUp className="w-5 h-5 text-charcoal/40" /> : <ChevronDown className="w-5 h-5 text-charcoal/40" />}
            </button>

            {openSections.cuisines && (
              <div className="p-6 pt-0 border-t border-gold/10 space-y-6 mt-4">
                {/* Cuisines offered */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-3">Cuisines Offered (Multi-Select)</label>
                  <div className="flex flex-wrap gap-2">
                    {CUISINE_OPTIONS.map((item) => {
                      const selected = cuisineTypes.includes(item);
                      return (
                        <button
                          key={item}
                          type="button"
                          onClick={() => handleToggleCuisine(item)}
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

                {/* Dietary Accommodations */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-3">Dietary Accommodations (Multi-Select)</label>
                  <div className="flex flex-wrap gap-2">
                    {DIETARY_OPTIONS.map((item) => {
                      const selected = dietaryOptions.includes(item);
                      return (
                        <button
                          key={item}
                          type="button"
                          onClick={() => handleToggleDietary(item)}
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

                {/* Service Styles */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-3">Service Styles Offered</label>
                  <div className="flex flex-wrap gap-2">
                    {SERVICE_STYLES.map((item) => {
                      const selected = serviceStyles.includes(item);
                      return (
                        <button
                          key={item}
                          type="button"
                          onClick={() => handleToggleServiceStyle(item)}
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
              </div>
            )}
          </div>

          {/* SECTION 3: Guest Capacity & Staffing Included */}
          <div className="bg-white rounded-3xl border border-gold/15 shadow-sm overflow-hidden">
            <button
              onClick={() => toggleSection("capacity")}
              className="w-full flex items-center justify-between p-6 bg-white hover:bg-[#FAF7F2] transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-[#0F4C45]" />
                <div>
                  <h3 className="font-serif font-bold text-base text-charcoal">3. Guest Capacity Range & Staffing Details</h3>
                  <p className="text-xs text-charcoal/60">Define your catering scale limits and on-site staff inclusion</p>
                </div>
              </div>
              {openSections.capacity ? <ChevronUp className="w-5 h-5 text-charcoal/40" /> : <ChevronDown className="w-5 h-5 text-charcoal/40" />}
            </button>

            {openSections.capacity && (
              <div className="p-6 pt-0 border-t border-gold/10 space-y-4 mt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">Minimum Guest Capacity</label>
                    <input
                      type="text"
                      value={minGuests}
                      onChange={(e) => setMinGuests(e.target.value)}
                      placeholder="e.g. 50"
                      className="w-full px-4 py-2.5 rounded-xl border border-gold/20 text-xs text-charcoal focus:outline-none focus:border-[#0F4C45]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">Maximum Guest Capacity</label>
                    <input
                      type="text"
                      value={maxGuests}
                      onChange={(e) => setMaxGuests(e.target.value)}
                      placeholder="e.g. 3000"
                      className="w-full px-4 py-2.5 rounded-xl border border-gold/20 text-xs text-charcoal focus:outline-none focus:border-[#0F4C45]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">Staffing & Service Included</label>
                  <textarea
                    rows={2}
                    value={staffingDetails}
                    onChange={(e) => setStaffingDetails(e.target.value)}
                    placeholder="e.g. Includes uniformed waiters, live counter chefs, head supervisor, stainless steel cutlery & premium crockery."
                    className="w-full px-4 py-2.5 rounded-xl border border-gold/20 text-xs text-charcoal focus:outline-none focus:border-[#0F4C45]"
                  />
                </div>
              </div>
            )}
          </div>

          {/* SECTION 4: Featured Signature Dishes Builder */}
          <div className="bg-white rounded-3xl border border-gold/15 shadow-sm overflow-hidden">
            <button
              onClick={() => toggleSection("signatureDishes")}
              className="w-full flex items-center justify-between p-6 bg-white hover:bg-[#FAF7F2] transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <Flame className="w-5 h-5 text-[#0F4C45]" />
                <div>
                  <h3 className="font-serif font-bold text-base text-charcoal">4. Featured Signature Dishes & Food Showcase</h3>
                  <p className="text-xs text-charcoal/60">Add signature dishes with dish photos, category & descriptions</p>
                </div>
              </div>
              {openSections.signatureDishes ? <ChevronUp className="w-5 h-5 text-charcoal/40" /> : <ChevronDown className="w-5 h-5 text-charcoal/40" />}
            </button>

            {openSections.signatureDishes && (
              <div className="p-6 pt-0 border-t border-gold/10 space-y-6 mt-4">
                <div className="space-y-4">
                  {featuredDishes.map((dish, idx) => (
                    <div key={idx} className="p-4 rounded-2xl border border-gold/20 bg-[#FAF7F2] space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#0F4C45]">Dish #{idx + 1}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveDish(idx)}
                          className="text-red-500 hover:text-red-700 text-xs flex items-center gap-1 font-bold"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Remove
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="sm:col-span-1">
                          <label className="block text-[11px] font-bold text-charcoal mb-1">Dish Photo</label>
                          <div className="h-28 rounded-xl border border-gold/30 bg-white overflow-hidden relative flex items-center justify-center">
                            {dish.image ? (
                              <img src={dish.image} alt={dish.name} className="w-full h-full object-cover" />
                            ) : (
                              <UtensilsCrossed className="w-6 h-6 text-charcoal/30" />
                            )}
                          </div>
                          <label className="cursor-pointer mt-2 inline-flex items-center justify-center gap-1.5 w-full py-1.5 rounded-lg bg-[#0F4C45]/10 text-[#0F4C45] text-[11px] font-bold">
                            <Upload className="w-3 h-3" /> Change Photo
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], "dish", idx)}
                            />
                          </label>
                        </div>

                        <div className="sm:col-span-2 space-y-3">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[11px] font-bold text-charcoal mb-1">Dish Name</label>
                              <input
                                type="text"
                                value={dish.name}
                                onChange={(e) => {
                                  const updated = [...featuredDishes];
                                  updated[idx].name = e.target.value;
                                  setFeaturedDishes(updated);
                                }}
                                className="w-full px-3 py-2 rounded-lg border border-gold/20 text-xs text-charcoal"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold text-charcoal mb-1">Course / Category</label>
                              <select
                                value={dish.category}
                                onChange={(e) => {
                                  const updated = [...featuredDishes];
                                  updated[idx].category = e.target.value;
                                  setFeaturedDishes(updated);
                                }}
                                className="w-full px-3 py-2 rounded-lg border border-gold/20 text-xs text-charcoal bg-white"
                              >
                                <option value="Starter / Snack">Starter / Snack</option>
                                <option value="Main Course">Main Course</option>
                                <option value="Live Counter">Live Counter</option>
                                <option value="Dessert / Sweets">Dessert / Sweets</option>
                                <option value="Beverage / Mocktail">Beverage / Mocktail</option>
                              </select>
                            </div>
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-charcoal mb-1">Dish Description</label>
                            <input
                              type="text"
                              value={dish.description}
                              onChange={(e) => {
                                const updated = [...featuredDishes];
                                updated[idx].description = e.target.value;
                                setFeaturedDishes(updated);
                              }}
                              placeholder="Ingredients or prep style..."
                              className="w-full px-3 py-2 rounded-lg border border-gold/20 text-xs text-charcoal"
                            />
                          </div>

                          <div className="flex items-center gap-2 pt-1">
                            <input
                              type="checkbox"
                              id={`veg-${idx}`}
                              checked={dish.isVeg}
                              onChange={(e) => {
                                const updated = [...featuredDishes];
                                updated[idx].isVeg = e.target.checked;
                                setFeaturedDishes(updated);
                              }}
                              className="accent-[#0F4C45]"
                            />
                            <label htmlFor={`veg-${idx}`} className="text-xs font-semibold text-charcoal cursor-pointer">
                              Pure Vegetarian Item
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleAddDish}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-[#0F4C45]/40 text-[#0F4C45] text-xs font-bold hover:bg-[#0F4C45]/5 w-full justify-center"
                >
                  <Plus className="w-4 h-4" /> Add Another Signature Dish
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
