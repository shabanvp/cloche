"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Save,
  Trash2,
  Plus,
  Upload,
  Image as ImageIcon,
  Check,
  AlertCircle,
  Loader2,
  Sparkles,
  HelpCircle,
  Phone,
  Mail,
  MapPin,
  Globe,
  Share2,
} from "lucide-react";

export type SectionType =
  | "hero"
  | "overview"
  | "pricing"
  | "gallery"
  | "about"
  | "policies"
  | "amenities"
  | "packages"
  | "faqs"
  | "contact"
  | null;

export interface StorefrontSectionDrawerProps {
  isOpen: boolean;
  activeSection: SectionType;
  vendor: any;
  onClose: () => void;
  onSaveSuccess: (updatedVendor: any) => void;
}

export function StorefrontSectionDrawer({
  isOpen,
  activeSection,
  vendor,
  onClose,
  onSaveSuccess,
}: StorefrontSectionDrawerProps) {
  const [formData, setFormData] = useState<any>({});
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Initialize form state when activeSection changes
  useEffect(() => {
    if (!isOpen || !activeSection) return;

    setIsDirty(false);
    setShowUnsavedModal(false);

    const sf = vendor?.storefront || {};
    const cd = vendor?.categoryDetails || vendor?.category_details || {};

    if (activeSection === "hero") {
      setFormData({
        businessName: vendor?.boutique_name || vendor?.name || sf?.businessName || "",
        tagline: vendor?.tagline || sf?.tagline || "",
        logoUrl: vendor?.logo_url || vendor?.logo || sf?.logoUrl || "",
        coverImage: vendor?.cover_image || vendor?.coverImage || sf?.coverImage || "",
      });
    } else if (activeSection === "overview") {
      setFormData({
        city: vendor?.city || sf?.city || "Kochi",
        state: vendor?.state || sf?.state || "Kerala",
        address: vendor?.address || sf?.address || "",
        guestCapacity: cd?.guest_capacity || sf?.capacity || vendor?.capacity || "500 - 1500 Guests",
        minGuestCapacity: cd?.min_guest_capacity || sf?.minCapacity || "100",
        venueType: cd?.venue_type || sf?.venueType || "Luxury Wedding Venue",
        guestRooms: cd?.rooms_count || sf?.guestRooms || "15 Rooms Available",
        parking: cd?.parking_capacity || sf?.parking || "200 Cars",
      });
    } else if (activeSection === "pricing") {
      setFormData({
        startingPrice: vendor?.startingPrice || vendor?.starting_price || sf?.startingPrice || "",
        startingPriceLabel: vendor?.startingPriceLabel || sf?.startingPriceLabel || "Price on Request",
        contactForPricing: Boolean(vendor?.contactForPricing ?? vendor?.contact_for_pricing ?? sf?.contactForPricing ?? false),
        vegPrice: cd?.veg_price || vendor?.vegPrice || vendor?.veg_price || sf?.vegPrice || "",
        nonVegPrice: cd?.non_veg_price || vendor?.nonVegPrice || vendor?.non_veg_price || sf?.nonVegPrice || "",
        decorStartingPrice: cd?.decor_starting_price || vendor?.decorStartingPrice || sf?.decorStartingPrice || "",
      });
    } else if (activeSection === "gallery") {
      const gList = Array.isArray(vendor?.gallery_images)
        ? vendor.gallery_images
        : Array.isArray(vendor?.galleryImages)
        ? vendor.galleryImages
        : Array.isArray(sf?.galleryImages)
        ? sf.galleryImages
        : [];
      setFormData({ galleryImages: [...gList] });
    } else if (activeSection === "about") {
      setFormData({
        about: vendor?.about || vendor?.description || sf?.about || "",
        establishedYear: cd?.years_in_business || sf?.establishedYear || "2015",
      });
    } else if (activeSection === "policies") {
      setFormData({
        cancellationPolicy: cd?.cancellation_policy || sf?.cancellationPolicy || "Non-refundable booking advance. 50% refund if cancelled 60 days prior.",
        alcoholPolicy: cd?.alcohol_policy || sf?.alcoholPolicy || "Outside alcohol permitted with valid state permit.",
        cateringPolicy: cd?.outside_catering_policy || sf?.cateringPolicy || "In-house & outside catering permitted.",
        decorPolicy: cd?.decoration_rules || sf?.decorPolicy || "Outside decorators permitted with security deposit.",
        rentalDuration: cd?.rental_duration || sf?.rentalDuration || "3 Days (Pickup day before, return day after)",
        depositPolicy: cd?.security_deposit_policy || sf?.depositPolicy || "₹10,000 refundable security deposit required.",
      });
    } else if (activeSection === "amenities") {
      const existingAmenities = Array.isArray(cd?.facilities)
        ? cd.facilities
        : Array.isArray(sf?.amenities)
        ? sf.amenities
        : ["AC Convention Hall", "Lawn Area", "Bridal Dressing Room", "Valet Parking", "Generator Backup", "Groom Suite"];
      setFormData({ amenities: [...existingAmenities] });
    } else if (activeSection === "packages") {
      const existingPkgs = Array.isArray(sf?.packages) && sf.packages.length > 0
        ? sf.packages
        : [
            { id: "1", name: "Grand Ballroom Package", price: "₹1,50,000", description: "Main AC convention hall for up to 1,500 guests with basic stage lighting." },
            { id: "2", name: "Royal Sunset Lawn Package", price: "₹1,20,000", description: "Lush outdoor lawn space for evening starlight receptions." }
          ];
      setFormData({ packages: [...existingPkgs] });
    } else if (activeSection === "faqs") {
      const existingFaqs = Array.isArray(cd?.faqs) && cd.faqs.length > 0
        ? cd.faqs
        : Array.isArray(sf?.faqs) && sf.faqs.length > 0
        ? sf.faqs
        : [
            { q: "What is the advance payment required to lock dates?", a: "A 30% advance payment is required at the time of booking confirmation." },
            { q: "Do you allow outside caterers?", a: "Yes, both in-house catering and empaneled outside caterers are permitted." }
          ];
      setFormData({ faqs: [...existingFaqs] });
    } else if (activeSection === "contact") {
      setFormData({
        phone: vendor?.phone || sf?.phone || "",
        whatsapp: vendor?.whatsapp || sf?.whatsapp || "",
        email: vendor?.email || sf?.email || "",
        address: vendor?.address || sf?.address || "",
        instagram: vendor?.instagram || sf?.instagram || "",
        facebook: vendor?.facebook || sf?.facebook || "",
        website: vendor?.website || sf?.website || "",
      });
    }
  }, [isOpen, activeSection, vendor]);

  if (!isOpen || !activeSection) return null;

  const updateField = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  const handleCloseAttempt = () => {
    if (isDirty) {
      setShowUnsavedModal(true);
    } else {
      onClose();
    }
  };

  // Image Upload Handler (Simulated Cloudinary / Server Upload returning CDN URL)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, targetField: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // Create preview or mock CDN URL upload
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        // In real production, POST to /api/v1/upload returns Cloudinary CDN url.
        // For fallback or local, use Data URL
        if (targetField === "galleryImages") {
          const current = formData.galleryImages || [];
          updateField("galleryImages", [...current, result]);
        } else {
          updateField(targetField, result);
        }
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error("Upload error:", err);
      setIsUploading(false);
    }
  };

  // Handle Save
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const vendorId = vendor?.id || vendor?.vendor_id || vendor?.vendorCode;

      const bName = vendor?.boutique_name || vendor?.name || vendor?.business_name || vendor?.businessName || "Cloche Vendor Partner";
      const payload: any = {
        vendorId,
        targetVendorId: vendorId,
        profile: {
          id: vendorId,
          vendor_id: vendorId,
          businessName: bName,
          business_name: bName,
        },
      };

      if (activeSection === "hero") {
        payload.profile.businessName = formData.businessName;
        payload.profile.business_name = formData.businessName;
        payload.profile.tagline = formData.tagline;
        payload.profile.logo_url = formData.logoUrl;
        payload.profile.logo = formData.logoUrl;
        payload.profile.cover_image = formData.coverImage;
        payload.profile.coverImage = formData.coverImage;
      } else if (activeSection === "overview") {
        payload.profile.city = formData.city;
        payload.profile.state = formData.state;
        payload.address = { city: formData.city, state: formData.state, addressLine1: formData.address };
        payload.categoryDetails = {
          guest_capacity: formData.guestCapacity,
          min_guest_capacity: formData.minGuestCapacity,
          venue_type: formData.venueType,
          rooms_count: formData.guestRooms,
          parking_capacity: formData.parking,
        };
      } else if (activeSection === "pricing") {
        payload.profile.startingPrice = formData.startingPrice;
        payload.profile.starting_price = formData.startingPrice;
        payload.profile.contactForPricing = formData.contactForPricing;
        payload.profile.vegPrice = formData.vegPrice;
        payload.profile.nonVegPrice = formData.nonVegPrice;
        payload.profile.decorStartingPrice = formData.decorStartingPrice;
        payload.categoryDetails = {
          veg_price: formData.vegPrice,
          non_veg_price: formData.nonVegPrice,
          decor_starting_price: formData.decorStartingPrice,
          contact_for_pricing: formData.contactForPricing,
        };
      } else if (activeSection === "gallery") {
        payload.profile.galleryImages = formData.galleryImages;
        payload.profile.gallery_images = formData.galleryImages;
      } else if (activeSection === "about") {
        payload.profile.about = formData.about;
        payload.profile.description = formData.about;
        payload.categoryDetails = { years_in_business: formData.establishedYear };
      } else if (activeSection === "policies") {
        payload.categoryDetails = {
          cancellation_policy: formData.cancellationPolicy,
          alcohol_policy: formData.alcoholPolicy,
          outside_catering_policy: formData.cateringPolicy,
          decoration_rules: formData.decorPolicy,
          rental_duration: formData.rentalDuration,
          security_deposit_policy: formData.depositPolicy,
        };
      } else if (activeSection === "amenities") {
        payload.categoryDetails = { facilities: formData.amenities };
        payload.profile.facilities = formData.amenities;
      } else if (activeSection === "packages") {
        payload.profile.storefront = { ...(vendor?.storefront || {}), packages: formData.packages };
      } else if (activeSection === "faqs") {
        payload.categoryDetails = { faqs: formData.faqs };
        payload.profile.faqs = formData.faqs;
      } else if (activeSection === "contact") {
        payload.contact = {
          phone: formData.phone,
          whatsapp: formData.whatsapp,
          email: formData.email,
        };
        payload.address = { addressLine1: formData.address };
        payload.profile.instagram = formData.instagram;
        payload.profile.facebook = formData.facebook;
        payload.profile.website = formData.website;
      }

      // Read authorization token
      let token = "";
      try {
        const rawToken = localStorage.getItem("cloche_vendor_token");
        if (rawToken) token = rawToken;
      } catch (e) {}

      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch("/api/v1/vendor/profile", {
        method: "PUT",
        headers,
        body: JSON.stringify(payload),
      });

      const resData = await res.json();

      if (!res.ok || !resData.success) {
        if (res.status === 403) {
          alert("Unauthorized: You do not own this vendor profile.");
        } else {
          alert(resData?.error?.message || resData?.message || "Failed to save changes.");
        }
        setIsSaving(false);
        return;
      }

      // Merge updated fields back into local vendor state
      const updatedVendor = {
        ...vendor,
        ...(payload.profile || {}),
        storefront: {
          ...(vendor?.storefront || {}),
          ...(payload.profile?.storefront || {}),
          ...(payload.profile || {}),
        },
        categoryDetails: {
          ...(vendor?.categoryDetails || {}),
          ...(payload.categoryDetails || {}),
        },
      };

      // Also dispatch profile update event
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("cloche_vendor_profile_updated", { detail: updatedVendor })
        );
      }

      setIsSaving(false);
      setIsDirty(false);
      setShowUnsavedModal(false);

      setToastMsg("✓ Changes Saved");
      setTimeout(() => setToastMsg(null), 3000);

      onSaveSuccess(updatedVendor);
      onClose();
    } catch (err: any) {
      console.error("Save error:", err);
      alert("An unexpected error occurred while saving: " + err.message);
      setIsSaving(false);
    }
  };

  const titles: Record<string, string> = {
    hero: "✏️ Edit Hero Header",
    overview: "✏️ Edit Overview & Highlights",
    pricing: "✏️ Edit Pricing Information",
    gallery: "🖼 Manage Photo Gallery",
    about: "✏️ Edit About & Story",
    policies: "✏️ Edit Business Policies",
    amenities: "✏: Edit Amenities & Facilities",
    packages: "✏️ Edit Packages & Halls",
    faqs: "✏️ Edit Frequently Asked Questions",
    contact: "✏️ Edit Contact & Location Info",
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-16 right-6 z-[60] bg-emerald-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Main Slide-Over Drawer Container (Right side on desktop, bottom sheet on mobile) */}
      <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="bg-[#0F4C45] text-white p-4.5 px-6 flex items-center justify-between border-b border-emerald-800 shrink-0">
          <div className="flex items-center gap-2 font-serif font-bold text-lg">
            <span>{titles[activeSection] || "Edit Section"}</span>
          </div>
          <button
            onClick={handleCloseAttempt}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body Forms */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-[#FAF7F2]">
          {/* HERO EDITOR */}
          {activeSection === "hero" && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-charcoal">Business / Studio Name</label>
                <input
                  type="text"
                  value={formData.businessName || ""}
                  onChange={(e) => updateField("businessName", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gold/30 bg-white text-xs font-medium text-charcoal focus:outline-none focus:border-[#0F4C45]"
                  placeholder="e.g. Royal Palace Convention Center"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-charcoal">Tagline / Subtitle</label>
                <input
                  type="text"
                  value={formData.tagline || ""}
                  onChange={(e) => updateField("tagline", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gold/30 bg-white text-xs font-medium text-charcoal focus:outline-none focus:border-[#0F4C45]"
                  placeholder="e.g. Luxury Wedding Venue & Banquet Hall"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-charcoal">Cover Image URL / Upload</label>
                {formData.coverImage && (
                  <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden border border-gold/20 mb-2">
                    <img src={formData.coverImage} alt="Cover Preview" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={formData.coverImage || ""}
                    onChange={(e) => updateField("coverImage", e.target.value)}
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-gold/30 bg-white text-xs font-medium text-charcoal focus:outline-none focus:border-[#0F4C45]"
                    placeholder="https://..."
                  />
                  <label className="px-3.5 py-2.5 rounded-xl bg-[#0F4C45] text-white text-xs font-bold hover:bg-[#12584E] transition-colors cursor-pointer flex items-center gap-1.5 shrink-0">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload</span>
                    <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, "coverImage")} className="hidden" />
                  </label>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-charcoal">Logo / Avatar URL / Upload</label>
                {formData.logoUrl && (
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#0F4C45] mb-2">
                    <img src={formData.logoUrl} alt="Logo Preview" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={formData.logoUrl || ""}
                    onChange={(e) => updateField("logoUrl", e.target.value)}
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-gold/30 bg-white text-xs font-medium text-charcoal focus:outline-none focus:border-[#0F4C45]"
                    placeholder="https://..."
                  />
                  <label className="px-3.5 py-2.5 rounded-xl bg-[#0F4C45] text-white text-xs font-bold hover:bg-[#12584E] transition-colors cursor-pointer flex items-center gap-1.5 shrink-0">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload</span>
                    <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, "logoUrl")} className="hidden" />
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* OVERVIEW EDITOR */}
          {activeSection === "overview" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-charcoal">City</label>
                  <input
                    type="text"
                    value={formData.city || ""}
                    onChange={(e) => updateField("city", e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gold/30 bg-white text-xs font-medium text-charcoal focus:outline-none focus:border-[#0F4C45]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-charcoal">State</label>
                  <input
                    type="text"
                    value={formData.state || ""}
                    onChange={(e) => updateField("state", e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gold/30 bg-white text-xs font-medium text-charcoal focus:outline-none focus:border-[#0F4C45]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-charcoal">Guest Capacity (Max Pax)</label>
                <input
                  type="text"
                  value={formData.guestCapacity || ""}
                  onChange={(e) => updateField("guestCapacity", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gold/30 bg-white text-xs font-medium text-charcoal focus:outline-none focus:border-[#0F4C45]"
                  placeholder="e.g. 500 - 1,500 Guests"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-charcoal">Guest Rooms</label>
                <input
                  type="text"
                  value={formData.guestRooms || ""}
                  onChange={(e) => updateField("guestRooms", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gold/30 bg-white text-xs font-medium text-charcoal focus:outline-none focus:border-[#0F4C45]"
                  placeholder="e.g. 15 AC Rooms"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-charcoal">Parking Space</label>
                <input
                  type="text"
                  value={formData.parking || ""}
                  onChange={(e) => updateField("parking", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gold/30 bg-white text-xs font-medium text-charcoal focus:outline-none focus:border-[#0F4C45]"
                  placeholder="e.g. 200 Cars"
                />
              </div>
            </div>
          )}

          {/* PRICING EDITOR */}
          {activeSection === "pricing" && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-white border border-gold/20 flex items-center justify-between">
                <div>
                  <div className="font-bold text-xs text-charcoal">Contact for Pricing</div>
                  <div className="text-[11px] text-charcoal/60">Hide exact prices and show "Price on Request"</div>
                </div>
                <input
                  type="checkbox"
                  checked={formData.contactForPricing}
                  onChange={(e) => updateField("contactForPricing", e.target.checked)}
                  className="w-5 h-5 accent-[#0F4C45] cursor-pointer"
                />
              </div>

              {!formData.contactForPricing && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-charcoal">Veg Plate Price (₹)</label>
                    <input
                      type="text"
                      value={formData.vegPrice || ""}
                      onChange={(e) => updateField("vegPrice", e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gold/30 bg-white text-xs font-medium text-charcoal focus:outline-none focus:border-[#0F4C45]"
                      placeholder="e.g. 1200"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-charcoal">Non-Veg Plate Price (₹)</label>
                    <input
                      type="text"
                      value={formData.nonVegPrice || ""}
                      onChange={(e) => updateField("nonVegPrice", e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gold/30 bg-white text-xs font-medium text-charcoal focus:outline-none focus:border-[#0F4C45]"
                      placeholder="e.g. 1500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-charcoal">Decor Starting Price (₹)</label>
                    <input
                      type="text"
                      value={formData.decorStartingPrice || ""}
                      onChange={(e) => updateField("decorStartingPrice", e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gold/30 bg-white text-xs font-medium text-charcoal focus:outline-none focus:border-[#0F4C45]"
                      placeholder="e.g. 50000"
                    />
                  </div>
                </>
              )}
            </div>
          )}

          {/* GALLERY MANAGER */}
          {activeSection === "gallery" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-charcoal">Photos ({formData.galleryImages?.length || 0})</span>
                <label className="px-3.5 py-2 rounded-xl bg-[#0F4C45] text-white text-xs font-bold hover:bg-[#12584E] transition-colors cursor-pointer flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Add Photo</span>
                  <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, "galleryImages")} className="hidden" />
                </label>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {(formData.galleryImages || []).map((imgUrl: string, idx: number) => (
                  <div key={idx} className="relative aspect-[4/3] rounded-xl overflow-hidden border border-gold/20 group bg-gray-200">
                    <img src={imgUrl} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" />
                    <button
                      onClick={() => {
                        const updated = formData.galleryImages.filter((_: any, i: number) => i !== idx);
                        updateField("galleryImages", updated);
                      }}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-rose-600 text-white shadow-md hover:bg-rose-700 transition-all cursor-pointer opacity-90 group-hover:opacity-100"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ABOUT EDITOR */}
          {activeSection === "about" && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-charcoal">Established Year</label>
                <input
                  type="text"
                  value={formData.establishedYear || ""}
                  onChange={(e) => updateField("establishedYear", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gold/30 bg-white text-xs font-medium text-charcoal focus:outline-none focus:border-[#0F4C45]"
                  placeholder="e.g. 2015"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-charcoal">Business Description &amp; Story</label>
                <textarea
                  rows={6}
                  value={formData.about || ""}
                  onChange={(e) => updateField("about", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gold/30 bg-white text-xs font-medium text-charcoal focus:outline-none focus:border-[#0F4C45] resize-none"
                  placeholder="Tell couples about your heritage, services, facilities, and unique offerings..."
                />
              </div>
            </div>
          )}

          {/* POLICIES EDITOR */}
          {activeSection === "policies" && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-charcoal">Cancellation Policy</label>
                <textarea
                  rows={2}
                  value={formData.cancellationPolicy || ""}
                  onChange={(e) => updateField("cancellationPolicy", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gold/30 bg-white text-xs font-medium text-charcoal focus:outline-none focus:border-[#0F4C45]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-charcoal">Catering Policy</label>
                <input
                  type="text"
                  value={formData.cateringPolicy || ""}
                  onChange={(e) => updateField("cateringPolicy", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gold/30 bg-white text-xs font-medium text-charcoal focus:outline-none focus:border-[#0F4C45]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-charcoal">Decoration Rules</label>
                <input
                  type="text"
                  value={formData.decorPolicy || ""}
                  onChange={(e) => updateField("decorPolicy", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gold/30 bg-white text-xs font-medium text-charcoal focus:outline-none focus:border-[#0F4C45]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-charcoal">Alcohol Policy</label>
                <input
                  type="text"
                  value={formData.alcoholPolicy || ""}
                  onChange={(e) => updateField("alcoholPolicy", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gold/30 bg-white text-xs font-medium text-charcoal focus:outline-none focus:border-[#0F4C45]"
                />
              </div>
            </div>
          )}

          {/* AMENITIES EDITOR */}
          {activeSection === "amenities" && (
            <div className="space-y-4">
              <span className="text-xs font-bold text-charcoal">Facilities &amp; Amenities</span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  "AC Convention Hall",
                  "Outdoor Lawn",
                  "Guest Rooms",
                  "Valet Parking",
                  "Bridal Suite",
                  "Groom Room",
                  "Generator Backup",
                  "In-house DJ",
                  "Stage Decor",
                  "Elevator / Lift",
                  "CCTVs",
                  "Wheelchair Accessible",
                ].map((item, idx) => {
                  const isChecked = (formData.amenities || []).includes(item);
                  return (
                    <label key={idx} className="p-2.5 rounded-xl bg-white border border-gold/20 flex items-center gap-2 text-xs font-bold text-charcoal cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => {
                          const current = formData.amenities || [];
                          if (e.target.checked) {
                            updateField("amenities", [...current, item]);
                          } else {
                            updateField("amenities", current.filter((i: string) => i !== item));
                          }
                        }}
                        className="w-4 h-4 accent-[#0F4C45]"
                      />
                      <span>{item}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* PACKAGES / HALLS EDITOR */}
          {activeSection === "packages" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-charcoal">Packages / Event Spaces</span>
                <button
                  onClick={() => {
                    const newPkg = { id: `pkg-${Date.now()}`, name: "New Package / Hall", price: "₹50,000", description: "Package details..." };
                    updateField("packages", [...(formData.packages || []), newPkg]);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-[#0F4C45] text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Package
                </button>
              </div>

              {(formData.packages || []).map((pkg: any, idx: number) => (
                <div key={pkg.id || idx} className="p-4 rounded-xl bg-white border border-gold/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <input
                      type="text"
                      value={pkg.name}
                      onChange={(e) => {
                        const updated = [...formData.packages];
                        updated[idx].name = e.target.value;
                        updateField("packages", updated);
                      }}
                      className="font-bold text-xs text-charcoal border-b border-dashed border-gold/30 focus:outline-none"
                    />
                    <button
                      onClick={() => {
                        const updated = formData.packages.filter((_: any, i: number) => i !== idx);
                        updateField("packages", updated);
                      }}
                      className="text-rose-600 p-1 hover:bg-rose-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={pkg.price}
                    onChange={(e) => {
                      const updated = [...formData.packages];
                      updated[idx].price = e.target.value;
                      updateField("packages", updated);
                    }}
                    className="text-xs font-bold text-[#0F4C45] border-b border-dashed border-gold/30 focus:outline-none w-full"
                  />
                  <textarea
                    rows={2}
                    value={pkg.description}
                    onChange={(e) => {
                      const updated = [...formData.packages];
                      updated[idx].description = e.target.value;
                      updateField("packages", updated);
                    }}
                    className="w-full text-xs text-charcoal/70 focus:outline-none resize-none border border-gold/15 p-2 rounded-lg"
                  />
                </div>
              ))}
            </div>
          )}

          {/* FAQS EDITOR */}
          {activeSection === "faqs" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-charcoal">FAQ List</span>
                <button
                  onClick={() => {
                    const newFaq = { q: "New Question?", a: "Answer text..." };
                    updateField("faqs", [...(formData.faqs || []), newFaq]);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-[#0F4C45] text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add FAQ
                </button>
              </div>

              {(formData.faqs || []).map((faq: any, idx: number) => (
                <div key={idx} className="p-4 rounded-xl bg-white border border-gold/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <input
                      type="text"
                      value={faq.q}
                      onChange={(e) => {
                        const updated = [...formData.faqs];
                        updated[idx].q = e.target.value;
                        updateField("faqs", updated);
                      }}
                      className="font-bold text-xs text-charcoal border-b border-dashed border-gold/30 focus:outline-none w-full mr-2"
                    />
                    <button
                      onClick={() => {
                        const updated = formData.faqs.filter((_: any, i: number) => i !== idx);
                        updateField("faqs", updated);
                      }}
                      className="text-rose-600 p-1 hover:bg-rose-50 rounded-lg transition-colors shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <textarea
                    rows={2}
                    value={faq.a}
                    onChange={(e) => {
                      const updated = [...formData.faqs];
                      updated[idx].a = e.target.value;
                      updateField("faqs", updated);
                    }}
                    className="w-full text-xs text-charcoal/70 focus:outline-none resize-none border border-gold/15 p-2 rounded-lg"
                  />
                </div>
              ))}
            </div>
          )}

          {/* CONTACT EDITOR */}
          {activeSection === "contact" && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-charcoal flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#0F4C45]" /> Phone Number
                </label>
                <input
                  type="text"
                  value={formData.phone || ""}
                  onChange={(e) => updateField("phone", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gold/30 bg-white text-xs font-medium text-charcoal focus:outline-none focus:border-[#0F4C45]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-charcoal flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-600" /> WhatsApp Number
                </label>
                <input
                  type="text"
                  value={formData.whatsapp || ""}
                  onChange={(e) => updateField("whatsapp", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gold/30 bg-white text-xs font-medium text-charcoal focus:outline-none focus:border-[#0F4C45]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-charcoal flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#0F4C45]" /> Email Address
                </label>
                <input
                  type="text"
                  value={formData.email || ""}
                  onChange={(e) => updateField("email", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gold/30 bg-white text-xs font-medium text-charcoal focus:outline-none focus:border-[#0F4C45]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-charcoal flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#0F4C45]" /> Full Address
                </label>
                <textarea
                  rows={2}
                  value={formData.address || ""}
                  onChange={(e) => updateField("address", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gold/30 bg-white text-xs font-medium text-charcoal focus:outline-none focus:border-[#0F4C45] resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-charcoal flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-rose-600" /> Instagram Link
                </label>
                <input
                  type="text"
                  value={formData.instagram || ""}
                  onChange={(e) => updateField("instagram", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gold/30 bg-white text-xs font-medium text-charcoal focus:outline-none focus:border-[#0F4C45]"
                />
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer Actions */}
        <div className="p-4 bg-white border-t border-gold/20 flex items-center justify-between gap-3 shrink-0">
          <button
            onClick={handleCloseAttempt}
            className="px-5 py-2.5 rounded-xl border border-gold/30 text-charcoal font-bold text-xs hover:bg-gray-100 transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving || isUploading}
            className="px-6 py-2.5 rounded-xl bg-[#0F4C45] hover:bg-[#12584E] text-white font-bold text-xs transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>{isSaving ? "Saving..." : "Save Changes"}</span>
          </button>
        </div>
      </div>

      {/* UNSAVED CHANGES MODAL */}
      {showUnsavedModal && (
        <div className="fixed inset-0 z-[70] bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-2 text-amber-600 font-bold text-base">
              <AlertCircle className="w-5 h-5" />
              <span>You have unsaved changes</span>
            </div>
            <p className="text-xs text-charcoal/70 leading-relaxed font-medium">
              Are you sure you want to close? Any modifications you made to this section will be lost.
            </p>
            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={handleSave}
                className="w-full py-2.5 rounded-xl bg-[#0F4C45] text-white font-bold text-xs hover:bg-[#12584E] transition-all"
              >
                Save Changes
              </button>
              <button
                onClick={() => {
                  setShowUnsavedModal(false);
                  setIsDirty(false);
                  onClose();
                }}
                className="w-full py-2.5 rounded-xl bg-rose-50 text-rose-600 border border-rose-200 font-bold text-xs hover:bg-rose-100 transition-all"
              >
                Discard Changes
              </button>
              <button
                onClick={() => setShowUnsavedModal(false)}
                className="w-full py-2 rounded-xl text-charcoal/60 font-semibold text-xs hover:text-charcoal transition-all"
              >
                Continue Editing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
