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
  Clock, 
  MapPin, 
  Phone, 
  MessageCircle, 
  FileText, 
  Share2,
  Globe,
  ShieldAlert
} from "lucide-react";
import { uploadImageToCloudinaryDetailed } from "@/lib/cloudinary";
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
  const [isUploading, setIsUploading] = useState(false);

  // 1. Studio Information
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

  // 2. Business Details
  const [openingTime, setOpeningTime] = useState("10:00 AM");
  const [closingTime, setClosingTime] = useState("08:00 PM");
  const [workingDays, setWorkingDays] = useState("Monday - Saturday");
  const [weeklyOff, setWeeklyOff] = useState("Sunday");

  const [services, setServices] = useState({
    rentalAvailable: true,
    purchaseAvailable: true,
    customStitching: true,
    alterationService: true,
    accessoriesAvailable: true,
  });

  // 3. Rental Policies
  const [rentalDuration, setRentalDuration] = useState("3 Days");
  const [securityDeposit, setSecurityDeposit] = useState("₹10,000 (Refundable upon return)");
  const [returnPolicy, setReturnPolicy] = useState("Return within agreed rental duration. Delayed returns attract ₹1,000/day late fee.");
  const [cancellationPolicy, setCancellationPolicy] = useState("Full refund up to 7 days before pickup date. 50% deposit retained if cancelled within 3 days.");
  const [damagePolicy, setDamagePolicy] = useState("Minor wear & tear is acceptable. Stains, tears or severe fabric damage will be deducted from security deposit.");

  // 4. Social Media
  const [instagram, setInstagram] = useState("");
  const [facebook, setFacebook] = useState("");
  const [website, setWebsite] = useState("");

  const logoInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const cached = getActiveVendorIdentity();
    if (cached) populateForm(cached);

    fetchAuthenticatedVendorFromDb().then((profile) => {
      if (profile) populateForm(profile);
    });
  }, [categoryKey]);

  function populateForm(data: any) {
    if (!data) return;
    setVendorData(data);
    const sf = (data && typeof data.storefront === "object" && data.storefront !== null) ? data.storefront : {};
    const sfWh = sf.workingHours || {};
    const sfPol = sf.policies || {};
    const sfCi = sf.contactInfo || {};
    const sfSl = sf.socialLinks || {};

    const nameVal = sf.studioName || data.boutique_name || data.business_name || data.name || vendorName;
    if (nameVal) setStudioName(nameVal);

    const aboutVal = sf.about || data.description || data.about;
    if (aboutVal) setAboutStudio(aboutVal);

    const logoVal = sf.logo || data.logo || data.logo_url;
    if (logoVal) setLogoUrl(logoVal);

    const coverVal = sf.coverImage || data.coverImage || data.cover_image;
    if (coverVal) setCoverUrl(coverVal);

    const phoneVal = sfCi.phone || data.phone || data.contact_number;
    if (phoneVal) setPhone(phoneVal);

    const whatsappVal = sfCi.whatsapp || data.whatsapp || data.phone;
    if (whatsappVal) setWhatsapp(whatsappVal);

    const emailVal = sfCi.email || data.email;
    if (emailVal) setEmail(emailVal);

    const addressVal = sfCi.address || data.address;
    if (addressVal) setAddress(addressVal);

    const cityVal = sfCi.city || data.city;
    if (cityVal) setCity(cityVal);

    const districtVal = sfCi.district || data.district || data.state;
    if (districtVal) setDistrict(districtVal);

    const mapsVal = sfCi.googleMaps || data.googleMapsLocation || data.maps_url || data.google_maps_url || data.googleMaps;
    if (mapsVal) setGoogleMapsLocation(mapsVal);

    const instaVal = sfSl.instagram || data.instagram;
    if (instaVal) setInstagram(instaVal);

    const fbVal = sfSl.facebook || data.facebook;
    if (fbVal) setFacebook(fbVal);

    const webVal = sfSl.website || data.website;
    if (webVal) setWebsite(webVal);

    // Business Hours
    const openVal = sfWh.openingTime || data.openingTime || data.opening_time;
    if (openVal) setOpeningTime(openVal);

    const closeVal = sfWh.closingTime || data.closingTime || data.closing_time;
    if (closeVal) setClosingTime(closeVal);

    const daysVal = sfWh.workingDays || data.workingDays || data.working_days;
    if (daysVal) setWorkingDays(daysVal);

    const offVal = sfWh.weeklyOff || data.weeklyOff || data.weekly_off;
    if (offVal) setWeeklyOff(offVal);

    // Policies
    const durVal = sfPol.rentalDuration || data.rentalDuration || data.rental_duration;
    if (durVal) setRentalDuration(durVal);

    const depVal = sfPol.securityDeposit || data.securityDeposit || data.security_deposit;
    if (depVal) setSecurityDeposit(depVal);

    const retVal = sfPol.returnPolicy || data.returnPolicy || data.return_policy;
    if (retVal) setReturnPolicy(retVal);

    const cancVal = sfPol.cancellationPolicy || data.cancellationPolicy || data.cancellation_policy;
    if (cancVal) setCancellationPolicy(cancVal);

    const damVal = sfPol.damagePolicy || data.damagePolicy || data.damage_policy;
    if (damVal) setDamagePolicy(damVal);

    // Services & Availability Flags
    if (data.rentalAvailable !== undefined || data.rental_available !== undefined) {
      setServices((prev) => ({
        ...prev,
        rentalAvailable: Boolean(data.rentalAvailable ?? data.rental_available),
      }));
    }
    if (data.purchaseAvailable !== undefined || data.purchase_available !== undefined) {
      setServices((prev) => ({
        ...prev,
        purchaseAvailable: Boolean(data.purchaseAvailable ?? data.purchase_available),
      }));
    }

    // Gallery
    const rawGallery = Array.isArray(data.galleryImages) && data.galleryImages.length > 0 ? data.galleryImages : Array.isArray(data.gallery_images) && data.gallery_images.length > 0 ? data.gallery_images : Array.isArray(sf.gallery) ? sf.gallery.map((x: any) => typeof x === "string" ? x : x?.url || x?.image_url) : Array.isArray(data.gallery) ? data.gallery : [];
    if (Array.isArray(rawGallery) && rawGallery.length > 0) {
      setGalleryImages(rawGallery.map((x: any) => (typeof x === "string" ? x : x?.url || x?.image_url || x?.image)).filter(Boolean));
    }
  }

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const res = await uploadImageToCloudinaryDetailed(file);
      setLogoUrl(res.secure_url || (res as any).secureUrl);
      showVendorToast("Logo uploaded successfully!", "success");
    } catch (err: any) {
      showVendorToast(err.message || "Failed to upload logo", "error");
    } finally {
      setIsUploading(false);
    }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const res = await uploadImageToCloudinaryDetailed(file);
      setCoverUrl(res.secure_url || (res as any).secureUrl);
      showVendorToast("Cover image uploaded successfully!", "success");
    } catch (err: any) {
      showVendorToast(err.message || "Failed to upload cover image", "error");
    } finally {
      setIsUploading(false);
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setIsUploading(true);
    try {
      const uploadPromises = files.map((file) => uploadImageToCloudinaryDetailed(file));
      const results = await Promise.all(uploadPromises);
      const newUrls = results.map((r) => r.secure_url || (r as any).secureUrl);
      setGalleryImages((prev) => [...prev, ...newUrls]);
      showVendorToast(`${newUrls.length} gallery images uploaded!`, "success");
    } catch (err: any) {
      showVendorToast("Failed to upload gallery images", "error");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveGalleryImage = (index: number) => {
    setGalleryImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    const customizationData = {
      studioName,
      aboutStudio,
      logoUrl,
      coverUrl,
      galleryImages,
      phone,
      whatsapp,
      email,
      address,
      city,
      district,
      googleMapsLocation,
      openingTime,
      closingTime,
      workingDays,
      weeklyOff,
      services,
      rentalDuration,
      securityDeposit,
      returnPolicy,
      cancellationPolicy,
      damagePolicy,
      instagram,
      facebook,
      website,
    };

    // Save to LocalStorage
    const storageKey = `cloche_boutique_customization_${categoryKey}`;
    try {
      localStorage.setItem(storageKey, JSON.stringify(customizationData));
    } catch (_) {}

    // Sync with DB
    try {
      await syncVendorProfileWithDatabase({
        boutique_name: studioName,
        business_name: studioName,
        name: studioName,
        about: aboutStudio,
        description: aboutStudio,
        logo: logoUrl,
        logo_url: logoUrl,
        coverImage: coverUrl,
        cover_image: coverUrl,
        galleryImages,
        gallery_images: galleryImages,
        phone,
        whatsapp,
        email,
        address,
        city,
        district,
        maps_url: googleMapsLocation,
        opening_time: openingTime,
        openingTime: openingTime,
        closing_time: closingTime,
        closingTime: closingTime,
        working_days: workingDays,
        workingDays: workingDays,
        weekly_off: weeklyOff,
        weeklyOff: weeklyOff,
        rentalDuration,
        securityDeposit,
        returnPolicy,
        cancellationPolicy,
        damagePolicy,
        rentalAvailable: services.rentalAvailable,
        purchaseAvailable: services.purchaseAvailable,
        rental_available: services.rentalAvailable,
        purchase_available: services.purchaseAvailable,
        instagram,
        facebook,
        website,
        businessInfo: {
          rentalAvailable: services.rentalAvailable,
          purchaseAvailable: services.purchaseAvailable,
        },
        storefront: {
          theme: "emerald",
          coverImage: coverUrl,
          logo: logoUrl,
          about: aboutStudio,
          gallery: galleryImages.map((url, i) => ({ url, caption: `Studio Photo ${i + 1}` })),
          workingHours: {
            workingDays,
            openingTime,
            closingTime,
            weeklyOff,
          },
          policies: {
            rentalDuration,
            securityDeposit,
            returnPolicy,
            cancellationPolicy,
            damagePolicy,
          },
          businessInfo: {
            rentalAvailable: services.rentalAvailable,
            purchaseAvailable: services.purchaseAvailable,
          },
          socialLinks: {
            instagram,
            facebook,
            website,
          },
          contactInfo: {
            phone,
            whatsapp,
            email,
            address,
            googleMaps: googleMapsLocation,
          },
        },
      });
      showVendorToast("Studio details saved & updated live on profile!", "success");
    } catch (_) {
      showVendorToast("Saved locally to studio profile!", "info");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 font-sans pb-12">
      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gold/15 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0d3b30]/10 text-[#0d3b30] text-xs font-semibold uppercase tracking-wider mb-2">
            <Store className="w-3.5 h-3.5 text-[#c9a86a]" /> Complete Boutique Management
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0d3b30]">
            Customize Studio Profile
          </h1>
          <p className="text-xs text-gray-500 mt-1 max-w-xl">
            Update your studio branding, contact details, business hours, and rental policies. All changes reflect live on your public storefront.
          </p>
        </div>

        <button
          onClick={handleSaveAll}
          disabled={isSaving || isUploading}
          className="py-3 px-6 rounded-xl bg-[#0d3b30] hover:bg-[#082921] text-white font-medium text-xs flex items-center justify-center gap-2 transition-colors shadow-xs shrink-0 disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin text-[#c9a86a]" /> : <Save className="w-4 h-4 text-[#c9a86a]" />}
          <span>Save Studio Settings</span>
        </button>
      </div>

      {/* SECTION 1: Studio Information */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gold/15 shadow-sm space-y-6">
        <div className="border-b border-gold/15 pb-4">
          <h2 className="font-serif text-xl font-bold text-[#0d3b30] flex items-center gap-2">
            <Store className="w-5 h-5 text-[#c9a86a]" /> 1. Studio Information
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">Basic studio details, branding assets, gallery images, and location contact info.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Studio Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Studio Name *</label>
            <input
              type="text"
              value={studioName}
              onChange={(e) => setStudioName(e.target.value)}
              placeholder="E.g. Royal Wedding Studio"
              className="w-full bg-[#F8F6F2] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0d3b30]"
            />
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Phone Number *</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="E.g. +91 98765 43210"
              className="w-full bg-[#F8F6F2] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0d3b30]"
            />
          </div>

          {/* WhatsApp */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">WhatsApp Number</label>
            <input
              type="text"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="E.g. +91 98765 43210"
              className="w-full bg-[#F8F6F2] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0d3b30]"
            />
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E.g. studio@cloche.com"
              className="w-full bg-[#F8F6F2] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0d3b30]"
            />
          </div>
        </div>

        {/* About Studio */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">About Studio</label>
          <textarea
            rows={3}
            value={aboutStudio}
            onChange={(e) => setAboutStudio(e.target.value)}
            placeholder="Describe your studio heritage, designer outfits, bespoke tailoring services, and specialties..."
            className="w-full bg-[#F8F6F2] border border-gray-200 rounded-xl p-4 text-sm focus:outline-none focus:border-[#0d3b30]"
          />
        </div>

        {/* Address & Location */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Studio street address, landmark, building name"
              className="w-full bg-[#F8F6F2] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0d3b30]"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">City / Location</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="E.g. Kochi, Calicut, Trivandrum"
              className="w-full bg-[#F8F6F2] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0d3b30]"
            />
          </div>
        </div>

        {/* Google Maps URL */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Google Maps Link</label>
          <input
            type="url"
            value={googleMapsLocation}
            onChange={(e) => setGoogleMapsLocation(e.target.value)}
            placeholder="Paste Google Maps URL for easy navigation by brides & grooms"
            className="w-full bg-[#F8F6F2] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0d3b30]"
          />
        </div>

        {/* Logo & Cover Images */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Logo Upload */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Studio Logo</label>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-2xl bg-[#F8F6F2] border border-gray-200 flex items-center justify-center overflow-hidden shrink-0">
                {logoUrl ? (
                  <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <Store className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <input ref={logoInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
              <button
                type="button"
                onClick={() => logoInputRef.current?.click()}
                disabled={isUploading}
                className="py-2.5 px-4 rounded-xl border border-gray-200 hover:bg-gray-50 text-xs font-semibold text-gray-700 flex items-center gap-2 transition-colors"
              >
                <Upload className="w-4 h-4 text-[#0d3b30]" /> Change Logo
              </button>
            </div>
          </div>

          {/* Cover Upload */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Cover Banner</label>
            <div className="flex items-center gap-4">
              <div className="w-32 h-20 rounded-2xl bg-[#F8F6F2] border border-gray-200 flex items-center justify-center overflow-hidden shrink-0">
                {coverUrl ? (
                  <img src={coverUrl} alt="Cover" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <input ref={coverInputRef} type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
              <button
                type="button"
                onClick={() => coverInputRef.current?.click()}
                disabled={isUploading}
                className="py-2.5 px-4 rounded-xl border border-gray-200 hover:bg-gray-50 text-xs font-semibold text-gray-700 flex items-center gap-2 transition-colors"
              >
                <Upload className="w-4 h-4 text-[#0d3b30]" /> Change Cover
              </button>
            </div>
          </div>
        </div>

        {/* Studio Gallery Images */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Studio Gallery Showcase</label>
            <input ref={galleryInputRef} type="file" multiple accept="image/*" className="hidden" onChange={handleGalleryUpload} />
            <button
              type="button"
              onClick={() => galleryInputRef.current?.click()}
              disabled={isUploading}
              className="py-1.5 px-3 rounded-lg border border-gray-200 hover:bg-gray-50 text-xs font-medium text-[#0d3b30] flex items-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" /> Upload Photos
            </button>
          </div>
          {galleryImages.length > 0 ? (
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {galleryImages.map((img, idx) => (
                <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group border border-gray-200">
                  <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveGalleryImage(idx)}
                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-400 italic">No gallery photos added yet. Upload interior photos, trial rooms & mannequin setups.</p>
          )}
        </div>
      </div>

      {/* SECTION 2: Business Details */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gold/15 shadow-sm space-y-6">
        <div className="border-b border-gold/15 pb-4">
          <h2 className="font-serif text-xl font-bold text-[#0d3b30] flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#c9a86a]" /> 2. Business Details
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">Operating hours, working days, and available studio services.</p>
        </div>

        {/* Business Hours */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Opening Time</label>
            <input
              type="text"
              value={openingTime}
              onChange={(e) => setOpeningTime(e.target.value)}
              placeholder="10:00 AM"
              className="w-full bg-[#F8F6F2] border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0d3b30]"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Closing Time</label>
            <input
              type="text"
              value={closingTime}
              onChange={(e) => setClosingTime(e.target.value)}
              placeholder="08:00 PM"
              className="w-full bg-[#F8F6F2] border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0d3b30]"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Working Days</label>
            <input
              type="text"
              value={workingDays}
              onChange={(e) => setWorkingDays(e.target.value)}
              placeholder="Monday - Saturday"
              className="w-full bg-[#F8F6F2] border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0d3b30]"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Weekly Off</label>
            <input
              type="text"
              value={weeklyOff}
              onChange={(e) => setWeeklyOff(e.target.value)}
              placeholder="Sunday"
              className="w-full bg-[#F8F6F2] border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0d3b30]"
            />
          </div>
        </div>

        {/* Studio Services Checklist Toggles */}
        <div className="space-y-3 pt-2">
          <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider block">Boutique Services Offered</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { key: "rentalAvailable", label: "Rental Available" },
              { key: "purchaseAvailable", label: "Purchase Available" },
              { key: "customStitching", label: "Custom Stitching" },
              { key: "alterationService", label: "Alteration Service" },
              { key: "accessoriesAvailable", label: "Accessories" },
            ].map((s) => {
              const active = (services as any)[s.key];
              return (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => setServices((prev) => ({ ...prev, [s.key]: !active }))}
                  className={`p-3.5 rounded-xl border text-xs font-semibold text-left transition-all flex items-center justify-between ${
                    active ? "bg-[#0d3b30]/10 border-[#0d3b30] text-[#0d3b30]" : "bg-[#F8F6F2] border-gray-200 text-gray-500 hover:border-gray-300"
                  }`}
                >
                  <span>{s.label}</span>
                  {active && <CheckCircle className="w-4 h-4 text-[#0d3b30]" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* SECTION 3: Rental Policies */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gold/15 shadow-sm space-y-6">
        <div className="border-b border-gold/15 pb-4">
          <h2 className="font-serif text-xl font-bold text-[#0d3b30] flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#c9a86a]" /> 3. Rental Policies
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">Specify rental duration, security deposit rules, return deadlines, and cancellation terms.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Rental Duration</label>
            <input
              type="text"
              value={rentalDuration}
              onChange={(e) => setRentalDuration(e.target.value)}
              placeholder="E.g. 3 Days (Pickup day before event, Return day after)"
              className="w-full bg-[#F8F6F2] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0d3b30]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Security Deposit</label>
            <input
              type="text"
              value={securityDeposit}
              onChange={(e) => setSecurityDeposit(e.target.value)}
              placeholder="E.g. ₹10,000 (Refundable upon inspection)"
              className="w-full bg-[#F8F6F2] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0d3b30]"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Return Policy</label>
          <textarea
            rows={2}
            value={returnPolicy}
            onChange={(e) => setReturnPolicy(e.target.value)}
            placeholder="Specify return deadline, late fee charges, and pickup conditions..."
            className="w-full bg-[#F8F6F2] border border-gray-200 rounded-xl p-3.5 text-sm focus:outline-none focus:border-[#0d3b30]"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Cancellation Policy</label>
            <textarea
              rows={2}
              value={cancellationPolicy}
              onChange={(e) => setCancellationPolicy(e.target.value)}
              placeholder="Specify cancellation timeframe and deposit refund terms..."
              className="w-full bg-[#F8F6F2] border border-gray-200 rounded-xl p-3.5 text-sm focus:outline-none focus:border-[#0d3b30]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Damage Policy</label>
            <textarea
              rows={2}
              value={damagePolicy}
              onChange={(e) => setDamagePolicy(e.target.value)}
              placeholder="Specify acceptable wear & tear vs stain/tear damage liabilities..."
              className="w-full bg-[#F8F6F2] border border-gray-200 rounded-xl p-3.5 text-sm focus:outline-none focus:border-[#0d3b30]"
            />
          </div>
        </div>
      </div>

      {/* SECTION 4: Social Media */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gold/15 shadow-sm space-y-6">
        <div className="border-b border-gold/15 pb-4">
          <h2 className="font-serif text-xl font-bold text-[#0d3b30] flex items-center gap-2">
            <Share2 className="w-5 h-5 text-[#c9a86a]" /> 4. Social Media Links
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">Link your official Instagram, Facebook, and website for brand trust.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
              <Share2 className="w-4 h-4 text-pink-600" /> Instagram Handle
            </label>
            <input
              type="text"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              placeholder="@royalweddingstudio"
              className="w-full bg-[#F8F6F2] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0d3b30]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-blue-600" /> Facebook Page
            </label>
            <input
              type="text"
              value={facebook}
              onChange={(e) => setFacebook(e.target.value)}
              placeholder="facebook.com/royalweddingstudio"
              className="w-full bg-[#F8F6F2] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0d3b30]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-emerald-600" /> Official Website
            </label>
            <input
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://www.royalweddingstudio.com"
              className="w-full bg-[#F8F6F2] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0d3b30]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
