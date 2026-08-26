"use client";

import { useState, useEffect, useRef } from "react";
import { 
  Store, 
  Upload, 
  Image as ImageIcon, 
  Sparkles, 
  CheckCircle, 
  Save, 
  Eye, 
  Loader2, 
  Palette, 
  ShieldCheck, 
  Clock, 
  MapPin, 
  Phone, 
  MessageCircle, 
  FileText, 
  Check, 
  Tag, 
  Layers
} from "lucide-react";
import { COLOR_THEMES } from "../sections/CustomizeStoreSection";
import { uploadImageToCloudinaryDetailed } from "@/lib/cloudinary";
import { VendorStorefront } from "@/components/VendorStorefront";
import { 
  getActiveVendorIdentity, 
  fetchAuthenticatedVendorFromDb, 
  syncVendorProfileWithDatabase, 
  showVendorToast 
} from "@/lib/vendorStore";

interface StoryBoutiqueCustomizeProps {
  categoryKey: string;
  vendorName: string;
}

export function StoryBoutiqueCustomize({ categoryKey, vendorName }: StoryBoutiqueCustomizeProps) {
  const [vendorData, setVendorData] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showLivePreview, setShowLivePreview] = useState(false);

  // Basic Information
  const [studioName, setStudioName] = useState(vendorName || "");
  const [aboutStudio, setAboutStudio] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [googleMapsLocation, setGoogleMapsLocation] = useState("");

  // Business Hours
  const [openingTime, setOpeningTime] = useState("10:00 AM");
  const [closingTime, setClosingTime] = useState("08:00 PM");
  const [workingDays, setWorkingDays] = useState("Monday - Saturday");
  const [weeklyOff, setWeeklyOff] = useState("Sunday");

  // Services Toggles
  const [services, setServices] = useState({
    rentalAvailable: true,
    purchaseAvailable: true,
    customStitching: true,
    alterationService: true,
    accessoriesAvailable: true,
  });

  // Studio Categories Selection
  const isBridal = categoryKey.includes("bridal");
  const isGroom = categoryKey.includes("groom");

  const bridalCategoryOptions = [
    "Bridal Sarees",
    "Bridal Lehengas",
    "Bridal Gowns",
    "Reception Dresses",
    "Engagement Dresses",
    "Mehendi Dresses",
    "Haldi Dresses",
    "Nikah Dresses",
  ];

  const groomCategoryOptions = [
    "Sherwani",
    "Suit",
    "Tuxedo",
    "Blazer",
    "Kurta Set",
    "Pathani Suit",
    "Mundu Set",
    "Reception Suit",
  ];

  const availableCategoryOptions = isBridal
    ? bridalCategoryOptions
    : isGroom
    ? groomCategoryOptions
    : [...bridalCategoryOptions, ...groomCategoryOptions];

  const [selectedStudioCategories, setSelectedStudioCategories] = useState<string[]>(availableCategoryOptions);

  // Rental Policies
  const [rentalDuration, setRentalDuration] = useState("3 Days");
  const [securityDeposit, setSecurityDeposit] = useState("50% of rental amount (refundable)");
  const [damagePolicy, setDamagePolicy] = useState("Minor wear & tear covered. Severe tears or permanent stains charged at cost.");
  const [returnPolicy, setReturnPolicy] = useState("Return by 7:00 PM on the final rental day to avoid late fees.");
  const [cancellationPolicy, setCancellationPolicy] = useState("Full refund if cancelled 7 days before event date.");

  // Brand Theme
  const [colorTheme, setColorTheme] = useState("emerald");

  const logoInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadIdentity = (identity: any) => {
      setVendorData(identity);
      if (identity.boutique_name || identity.name) setStudioName(identity.boutique_name || identity.name);
      if (identity.about || identity.description || identity.aboutText) setAboutStudio(identity.about || identity.description || identity.aboutText);
      if (identity.logo || identity.logo_url) setLogoUrl(identity.logo || identity.logo_url);
      if (identity.coverImage || identity.cover_image) setCoverUrl(identity.coverImage || identity.cover_image);
      if (Array.isArray(identity.galleryImages || identity.gallery_images)) setGalleryImages(identity.galleryImages || identity.gallery_images);
      if (identity.phone) setPhone(identity.phone);
      if (identity.whatsapp) setWhatsapp(identity.whatsapp);
      if (identity.email) setEmail(identity.email);
      if (identity.address) setAddress(identity.address);
      if (identity.city) setCity(identity.city);
      if (identity.district) setDistrict(identity.district);
      if (identity.googleMapsLocation || identity.google_maps) setGoogleMapsLocation(identity.googleMapsLocation || identity.google_maps);

      if (identity.workingHours) {
        if (identity.workingHours.openingTime) setOpeningTime(identity.workingHours.openingTime);
        if (identity.workingHours.closingTime) setClosingTime(identity.workingHours.closingTime);
        if (identity.workingHours.workingDays) setWorkingDays(identity.workingHours.workingDays);
        if (identity.workingHours.weeklyOff) setWeeklyOff(identity.workingHours.weeklyOff);
      }

      if (identity.services) {
        setServices((prev) => ({ ...prev, ...identity.services }));
      }

      if (Array.isArray(identity.studioCategories)) {
        setSelectedStudioCategories(identity.studioCategories);
      }

      if (identity.rentalPolicies) {
        if (identity.rentalPolicies.rentalDuration) setRentalDuration(identity.rentalPolicies.rentalDuration);
        if (identity.rentalPolicies.securityDeposit) setSecurityDeposit(identity.rentalPolicies.securityDeposit);
        if (identity.rentalPolicies.damagePolicy) setDamagePolicy(identity.rentalPolicies.damagePolicy);
        if (identity.rentalPolicies.returnPolicy) setReturnPolicy(identity.rentalPolicies.returnPolicy);
        if (identity.rentalPolicies.cancellationPolicy) setCancellationPolicy(identity.rentalPolicies.cancellationPolicy);
      }
    };

    const cached = getActiveVendorIdentity();
    if (cached) loadIdentity(cached);

    fetchAuthenticatedVendorFromDb().then((identity) => {
      if (identity) loadIdentity(identity);
    });
  }, []);

  const toggleCategory = (cat: string) => {
    setSelectedStudioCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const res = await uploadImageToCloudinaryDetailed(file, "cloche/vendors/logos");
      if (res.secure_url) {
        setLogoUrl(res.secure_url);
        showVendorToast("Logo uploaded successfully!", "success");
      }
    } catch (_) {
      showVendorToast("Logo upload failed", "error");
    }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const res = await uploadImageToCloudinaryDetailed(file, "cloche/vendors/covers");
      if (res.secure_url) {
        setCoverUrl(res.secure_url);
        showVendorToast("Cover image uploaded successfully!", "success");
      }
    } catch (_) {
      showVendorToast("Cover upload failed", "error");
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    const updatedPayload = {
      id: vendorData?.id,
      boutique_name: studioName,
      name: studioName,
      about: aboutStudio,
      description: aboutStudio,
      logo: logoUrl,
      logo_url: logoUrl,
      coverImage: coverUrl,
      cover_image: coverUrl,
      galleryImages: galleryImages,
      phone,
      whatsapp,
      email,
      address,
      city,
      district,
      googleMapsLocation,
      workingHours: {
        openingTime,
        closingTime,
        workingDays,
        weeklyOff,
      },
      services,
      studioCategories: selectedStudioCategories,
      rentalPolicies: {
        rentalDuration,
        securityDeposit,
        damagePolicy,
        returnPolicy,
        cancellationPolicy,
      },
      colorTheme,
    };

    const success = await syncVendorProfileWithDatabase(updatedPayload as any);
    setIsSaving(false);
    if (success) {
      showVendorToast("✓ Studio profile & customization saved successfully!", "success");
    } else {
      showVendorToast("Profile saved locally!", "info");
    }
  };

  // Build live preview object
  const liveProfileObj = {
    id: vendorData?.id || "preview-studio",
    name: studioName || "Studio Name",
    boutique_name: studioName || "Studio Name",
    category: isBridal ? "Bridal Studio" : isGroom ? "Groom Studio" : "Wedding Studio",
    about: aboutStudio || "Exclusive rental and purchase wedding boutique.",
    logo: logoUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
    coverImage: coverUrl || "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1200&auto=format&fit=crop",
    phone,
    whatsapp,
    email,
    city: city || "Kochi",
    district: district || "Ernakulam",
    address,
    googleMapsLocation,
    workingHours: { openingTime, closingTime, workingDays, weeklyOff },
    services,
    studioCategories: selectedStudioCategories,
    rentalPolicies: { rentalDuration, securityDeposit, damagePolicy, returnPolicy, cancellationPolicy },
    galleryImages,
    colorTheme,
  };

  return (
    <div className="space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gold/15 shadow-xs">
        <div>
          <h2 className="font-display text-xl font-bold text-charcoal flex items-center gap-2">
            <Store className="w-5 h-5 text-emerald" /> Customize Studio Profile
          </h2>
          <p className="text-xs text-charcoal/70 mt-1">
            Information updated here automatically reflects on your public studio storefront.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowLivePreview(!showLivePreview)}
            className="py-2.5 px-4 rounded-xl border border-gold/20 text-xs font-semibold text-charcoal hover:bg-ivory flex items-center gap-2 transition-colors"
          >
            <Eye className="w-4 h-4 text-emerald" /> {showLivePreview ? "Hide Preview" : "Live Storefront Preview"}
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="py-2.5 px-6 rounded-xl bg-emerald hover:bg-emerald/90 text-white font-medium text-xs flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
          </button>
        </div>
      </div>

      {/* Live Preview Modal */}
      {showLivePreview && (
        <div className="bg-white p-6 rounded-3xl border border-emerald/30 shadow-lg space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-gold/10 pb-3">
            <span className="text-xs font-bold text-emerald uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> Live Public Profile Preview
            </span>
            <button onClick={() => setShowLivePreview(false)} className="text-xs font-semibold text-charcoal/60 hover:text-charcoal">
              Close Preview ✕
            </button>
          </div>
          <VendorStorefront vendor={liveProfileObj} previewMode={true} />
        </div>
      )}

      {/* Basic Information */}
      <div className="bg-white p-6 rounded-2xl border border-gold/15 shadow-xs space-y-6">
        <h3 className="font-display font-bold text-lg text-charcoal border-b border-gold/10 pb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald" /> Basic Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-charcoal/70 uppercase tracking-wider">Studio Name *</label>
            <input
              type="text"
              value={studioName}
              onChange={(e) => setStudioName(e.target.value)}
              placeholder="E.g. Milan Bridal Studio"
              className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-charcoal/70 uppercase tracking-wider">Email Address *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="contact@studio.com"
              className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-charcoal/70 uppercase tracking-wider">Contact Phone *</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="9876543210"
              className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-charcoal/70 uppercase tracking-wider">WhatsApp Number *</label>
            <input
              type="tel"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="9876543210"
              className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald"
            />
          </div>

          <div className="space-y-1 md:col-span-2">
            <label className="text-xs font-semibold text-charcoal/70 uppercase tracking-wider">About Studio *</label>
            <textarea
              rows={3}
              value={aboutStudio}
              onChange={(e) => setAboutStudio(e.target.value)}
              placeholder="Describe your studio, specialties, fabrics, and bridal/groom wear craftsmanship..."
              className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl p-3 text-sm focus:outline-none focus:border-emerald"
            />
          </div>

          <div className="space-y-1 md:col-span-2">
            <label className="text-xs font-semibold text-charcoal/70 uppercase tracking-wider">Street Address *</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Main Street, Building No..."
              className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-charcoal/70 uppercase tracking-wider">City *</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="E.g. Kochi"
              className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-charcoal/70 uppercase tracking-wider">District *</label>
            <input
              type="text"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              placeholder="E.g. Ernakulam"
              className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald"
            />
          </div>

          <div className="space-y-1 md:col-span-2">
            <label className="text-xs font-semibold text-charcoal/70 uppercase tracking-wider">Google Maps Embed / Location Link</label>
            <input
              type="text"
              value={googleMapsLocation}
              onChange={(e) => setGoogleMapsLocation(e.target.value)}
              placeholder="https://maps.google.com/..."
              className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald"
            />
          </div>
        </div>

        {/* Media Uploads */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gold/10">
          <div>
            <label className="text-xs font-semibold text-charcoal/70 uppercase tracking-wider mb-2 block">Studio Logo</label>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 border border-gold/20 overflow-hidden shrink-0">
                {logoUrl ? <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" /> : <Store className="w-8 h-8 text-gray-400 m-auto mt-4" />}
              </div>
              <button
                type="button"
                onClick={() => logoInputRef.current?.click()}
                className="py-2 px-4 rounded-xl border border-gold/20 text-xs font-semibold text-charcoal hover:bg-ivory flex items-center gap-2"
              >
                <Upload className="w-3.5 h-3.5" /> Upload Logo
              </button>
              <input ref={logoInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-charcoal/70 uppercase tracking-wider mb-2 block">Cover Banner</label>
            <div className="flex items-center gap-4">
              <div className="w-24 h-16 rounded-2xl bg-gray-100 border border-gold/20 overflow-hidden shrink-0">
                {coverUrl ? <img src={coverUrl} alt="Cover" className="w-full h-full object-cover" /> : <ImageIcon className="w-8 h-8 text-gray-400 m-auto mt-4" />}
              </div>
              <button
                type="button"
                onClick={() => coverInputRef.current?.click()}
                className="py-2 px-4 rounded-xl border border-gold/20 text-xs font-semibold text-charcoal hover:bg-ivory flex items-center gap-2"
              >
                <Upload className="w-3.5 h-3.5" /> Upload Cover Banner
              </button>
              <input ref={coverInputRef} type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
            </div>
          </div>
        </div>
      </div>

      {/* Services Options Toggles */}
      <div className="bg-white p-6 rounded-2xl border border-gold/15 shadow-xs space-y-4">
        <h3 className="font-display font-bold text-lg text-charcoal border-b border-gold/10 pb-3 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald" /> Studio Services Offered
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { key: "rentalAvailable", label: "Rental Available" },
            { key: "purchaseAvailable", label: "Purchase Available" },
            { key: "customStitching", label: "Custom Stitching" },
            { key: "alterationService", label: "Alteration Service" },
            { key: "accessoriesAvailable", label: "Accessories Available" },
          ].map((srv) => {
            const isChecked = (services as any)[srv.key];
            return (
              <label
                key={srv.key}
                className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  isChecked ? "bg-emerald/5 border-emerald text-emerald font-semibold" : "bg-[#FAF7F2] border-gold/15 text-charcoal/80"
                }`}
              >
                <span className="text-xs">{srv.label}</span>
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={(e) => setServices({ ...services, [srv.key]: e.target.checked })}
                  className="rounded text-emerald focus:ring-emerald w-4 h-4"
                />
              </label>
            );
          })}
        </div>
      </div>

      {/* Studio Categories Selection */}
      <div className="bg-white p-6 rounded-2xl border border-gold/15 shadow-xs space-y-4">
        <h3 className="font-display font-bold text-lg text-charcoal border-b border-gold/10 pb-3 flex items-center gap-2">
          <Tag className="w-4 h-4 text-emerald" /> Studio Outfit Categories
        </h3>
        <p className="text-xs text-charcoal/70">
          Select all outfit categories available at your studio:
        </p>
        <div className="flex flex-wrap gap-2.5">
          {availableCategoryOptions.map((cat) => {
            const isSelected = selectedStudioCategories.includes(cat);
            return (
              <button
                key={cat}
                type="button"
                onClick={() => toggleCategory(cat)}
                className={`py-2 px-4 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  isSelected
                    ? "bg-emerald text-white shadow-xs"
                    : "bg-[#FAF7F2] border border-gold/20 text-charcoal/70 hover:bg-gray-100"
                }`}
              >
                {isSelected && <Check className="w-3.5 h-3.5" />}
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Rental Policies */}
      <div className="bg-white p-6 rounded-2xl border border-gold/15 shadow-xs space-y-6">
        <h3 className="font-display font-bold text-lg text-charcoal border-b border-gold/10 pb-3 flex items-center gap-2">
          <FileText className="w-4 h-4 text-emerald" /> Rental & Fitting Policies
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-charcoal/70 uppercase tracking-wider">Rental Duration</label>
            <input
              type="text"
              value={rentalDuration}
              onChange={(e) => setRentalDuration(e.target.value)}
              placeholder="E.g. 3 Days / 5 Days"
              className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-charcoal/70 uppercase tracking-wider">Security Deposit</label>
            <input
              type="text"
              value={securityDeposit}
              onChange={(e) => setSecurityDeposit(e.target.value)}
              placeholder="E.g. 50% refundable deposit"
              className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald"
            />
          </div>

          <div className="space-y-1 md:col-span-2">
            <label className="text-xs font-semibold text-charcoal/70 uppercase tracking-wider">Damage Policy</label>
            <textarea
              rows={2}
              value={damagePolicy}
              onChange={(e) => setDamagePolicy(e.target.value)}
              placeholder="State your studio policy for minor vs major garment damage..."
              className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl p-3 text-sm focus:outline-none focus:border-emerald"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-charcoal/70 uppercase tracking-wider">Return Policy</label>
            <input
              type="text"
              value={returnPolicy}
              onChange={(e) => setReturnPolicy(e.target.value)}
              placeholder="E.g. Return by 7:00 PM on final day"
              className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-charcoal/70 uppercase tracking-wider">Cancellation Policy</label>
            <input
              type="text"
              value={cancellationPolicy}
              onChange={(e) => setCancellationPolicy(e.target.value)}
              placeholder="E.g. Full refund up to 7 days before event"
              className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
