"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Store, Camera, MapPin, Link as LinkIcon, Phone, CheckCircle2, Building2, Clock, Globe, Save, AlertCircle } from "lucide-react";
import { Button } from "@/components/Button";
import { fetchAuthenticatedVendorFromDb, getActiveVendorIdentity, syncVendorProfileWithDatabase, showVendorToast } from "@/lib/vendorStore";
import { BottomNavBar } from "@/components/BottomNavBar";

export default function VendorProfile() {
  const [vendorId, setVendorId] = useState<string>("");
  const [logo, setLogo] = useState<string>("");
  const [coverImage, setCoverImage] = useState<string>("");
  const [boutiqueName, setBoutiqueName] = useState<string>("");
  const [ownerName, setOwnerName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [whatsapp, setWhatsapp] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [instagram, setInstagram] = useState<string>("");
  const [website, setWebsite] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [district, setDistrict] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [serviceAreas, setServiceAreas] = useState<string>("");
  const [workingHours, setWorkingHours] = useState<string>("");

  // States & Validation
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const populateFields = (active: any) => {
    if (!active) return;
    if (active.id) setVendorId(active.id);
    if (active.boutique_name || active.name) setBoutiqueName(active.boutique_name || active.name);
    if (active.owner_name || active.ownerName) setOwnerName(active.owner_name || active.ownerName);
    if (active.logo || active.logo_url) setLogo(active.logo || active.logo_url);
    if (active.coverImage || active.cover_image) setCoverImage(active.coverImage || active.cover_image);
    if (active.description) setDescription(active.description);
    if (active.whatsapp || active.phone) setWhatsapp(active.whatsapp || active.phone);
    if (active.email) setEmail(active.email);
    if (active.instagram) setInstagram(active.instagram);
    if (active.website) setWebsite(active.website);
    if (active.address) setAddress(active.address);
    if (active.district || active.city) setDistrict(active.district || active.city);
    if (active.category) setCategory(active.category);
    if (active.workingHours || active.working_hours) setWorkingHours(active.workingHours || active.working_hours);
    if (active.serviceAreas || active.service_areas) setServiceAreas(active.serviceAreas || active.service_areas);
  };

  const loadProfile = async () => {
    const cached = getActiveVendorIdentity();
    if (cached && cached.id) {
      populateFields(cached);
    }
    const active = await fetchAuthenticatedVendorFromDb();
    if (active && active.id) {
      populateFields(active);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setValidationError("Image file size should not exceed 10MB");
        return;
      }

      try {
        const { uploadImageToCloudinaryDetailed } = await import("@/lib/cloudinary");
        console.log("[IMAGE_FLOW] Uploading logo file to Cloudinary...");
        const res = await uploadImageToCloudinaryDetailed(file, "cloche/vendors/logos");

        if (res.secure_url && res.secure_url.startsWith("http")) {
          setLogo(res.secure_url);
          const dbResult = await syncVendorProfileWithDatabase({
            id: vendorId,
            boutique_name: boutiqueName || "Vendor",
            logo: res.secure_url,
            logo_url: res.secure_url,
          });
          showVendorToast("✓ Studio Logo saved!");
        }
      } catch (err) {
        console.error("[IMAGE_FLOW] Logo Cloudinary upload/save error:", err);
      }
    }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 15 * 1024 * 1024) {
        setValidationError("Cover image file size should not exceed 15MB");
        return;
      }

      try {
        const { uploadImageToCloudinaryDetailed } = await import("@/lib/cloudinary");
        console.log("[IMAGE_FLOW] Uploading cover image file to Cloudinary...");
        const res = await uploadImageToCloudinaryDetailed(file, "cloche/vendors/covers");

        if (res.secure_url && res.secure_url.startsWith("http")) {
          setCoverImage(res.secure_url);
          const dbResult = await syncVendorProfileWithDatabase({
            id: vendorId,
            boutique_name: boutiqueName || "Vendor",
            coverImage: res.secure_url,
            cover_image: res.secure_url,
          });
          showVendorToast("✓ Cover Photo saved!");
        }
      } catch (err) {
        console.error("[IMAGE_FLOW] Cover Cloudinary upload/save error:", err);
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Form Validation
    if (!boutiqueName.trim()) {
      setValidationError("Boutique / Studio Name is required.");
      return;
    }
    if (!whatsapp.trim() || whatsapp.length < 8) {
      setValidationError("Please enter a valid WhatsApp contact number.");
      return;
    }

    setIsSaving(true);
    try {
      let finalLogoUrl = logo;
      let finalCoverUrl = coverImage;

      // Upload logo to Cloudinary if base64/blob data URL
      if (logo && (logo.startsWith("data:") || logo.startsWith("blob:"))) {
        try {
          const { uploadImageToCloudinaryDetailed } = await import("@/lib/cloudinary");
          const res = await uploadImageToCloudinaryDetailed(logo, "cloche/vendors/logos");
          if (res.secure_url && res.secure_url.startsWith("http")) {
            finalLogoUrl = res.secure_url;
            setLogo(finalLogoUrl);
          }
        } catch (err) {
          console.warn("[VendorProfile] Logo Cloudinary upload warning:", err);
        }
      }

      // Upload cover to Cloudinary if base64/blob data URL
      if (coverImage && (coverImage.startsWith("data:") || coverImage.startsWith("blob:"))) {
        try {
          const { uploadImageToCloudinaryDetailed } = await import("@/lib/cloudinary");
          const res = await uploadImageToCloudinaryDetailed(coverImage, "cloche/vendors/covers");
          if (res.secure_url && res.secure_url.startsWith("http")) {
            finalCoverUrl = res.secure_url;
            setCoverImage(finalCoverUrl);
          }
        } catch (err) {
          console.warn("[VendorProfile] Cover Cloudinary upload warning:", err);
        }
      }

      const payload = {
        id: vendorId,
        boutique_name: boutiqueName.trim(),
        name: boutiqueName.trim(),
        owner_name: ownerName.trim(),
        ownerName: ownerName.trim(),
        logo: finalLogoUrl,
        logo_url: finalLogoUrl,
        coverImage: finalCoverUrl,
        cover_image: finalCoverUrl,
        description: description.trim(),
        whatsapp: whatsapp.trim(),
        phone: whatsapp.trim(),
        email: email.trim(),
        instagram: instagram.trim(),
        website: website.trim(),
        address: address.trim(),
        district: district.trim(),
        city: district.trim(),
        category: category,
        workingHours: workingHours.trim(),
        working_hours: workingHours.trim(),
        serviceAreas: serviceAreas.trim(),
        service_areas: serviceAreas.trim(),
      };

      const result = await syncVendorProfileWithDatabase(payload);

      if (result.success) {
        setSavedSuccess(true);
        showVendorToast("✓ Profile updated successfully");
        setTimeout(() => setSavedSuccess(false), 3500);
      } else {
        setValidationError("Unable to save profile changes. Please try again.");
        showVendorToast("Unable to save profile changes. Please try again.", "error");
      }
    } catch (err: any) {
      setValidationError(err.message || "Unable to save changes. Please try again.");
      showVendorToast("Unable to save changes. Please try again.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto font-sans pb-24">
      {/* Back Button & Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gold/15 pb-4 gap-4">
        <div>
          <Link
            href="/vendor"
            aria-label="Back to Dashboard"
            className="bg-[#FAF7F2] hover:bg-gold/20 text-[#0F4C45] p-2.5 rounded-xl border border-gold/20 transition-all inline-flex items-center justify-center cursor-pointer group mb-2"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
          </Link>
          <h1 className="text-3xl font-display font-bold text-charcoal">Vendor Profile Management</h1>
          <p className="text-sm text-charcoal/60 mt-1">Manage your business information, contact details, working hours, and media branding.</p>
        </div>
        {savedSuccess && (
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-200 shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Profile Saved & Verified!</span>
          </div>
        )}
      </div>

      {validationError && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        {/* Desktop 2-Column Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left Column: Business Information */}
          <section className="bg-white p-6 md:p-8 rounded-2xl shadow-xs border border-gold/15 space-y-6">
            <div className="flex items-center gap-2 border-b border-gold/10 pb-3">
              <Building2 className="w-5 h-5 text-[#0F4C45]" />
              <h2 className="text-lg font-display font-bold text-charcoal">Business Information</h2>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/60 mb-2">
                Business Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={boutiqueName}
                onChange={(e) => setBoutiqueName(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl p-3 text-sm text-charcoal focus:outline-none focus:border-[#0F4C45] font-semibold"
                placeholder="e.g. Dream Wedding Studio"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/60 mb-2">
                Owner Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl p-3 text-sm text-charcoal focus:outline-none focus:border-[#0F4C45] font-semibold"
                placeholder="e.g. John Doe"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/60">Registered Category</label>
                <span className="text-[10px] font-bold text-[#0F4C45] bg-[#0F4C45]/10 px-2 py-0.5 rounded-md flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-[#0F4C45]" /> Authoritative
                </span>
              </div>
              <input
                type="text"
                readOnly
                disabled
                value={category || "Verified Business Category"}
                className="w-full bg-[#FAF7F2]/80 border border-gold/20 rounded-xl p-3 text-sm text-charcoal font-semibold cursor-not-allowed opacity-90 select-none"
              />
              <p className="text-[11px] text-charcoal/50 mt-1">
                Your primary business category is authoritative and verified. To request a category change, contact Cloche Support.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/60 mb-2">About / Description</label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl p-3 text-sm text-charcoal focus:outline-none focus:border-[#0F4C45] leading-relaxed"
                placeholder="Describe your studio, services, experience, and style..."
              />
            </div>
          </section>

          {/* Right Column: Media Branding & Contact */}
          <div className="space-y-8">
            {/* Branding Section */}
            <section className="bg-white p-6 md:p-8 rounded-2xl shadow-xs border border-gold/15 space-y-6">
              <div className="flex items-center gap-2 border-b border-gold/10 pb-3">
                <Camera className="w-5 h-5 text-[#0F4C45]" />
                <h2 className="text-lg font-display font-bold text-charcoal">Media Branding</h2>
              </div>

              {/* Logo Section */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/60 mb-2">Studio Logo</label>
                {logo && (logo.startsWith("data:") || logo.startsWith("http") || logo.startsWith("/")) ? (
                  <div className="relative w-28 h-28 rounded-full border border-gold/30 overflow-hidden group shadow-xs bg-[#FAF7F2]">
                    <img src={logo} alt="Logo" className="w-full h-full object-cover" />
                    <label className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-opacity text-[10px] font-bold">
                      <Camera className="w-5 h-5 mb-1" />
                      <span>Change</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                    </label>
                  </div>
                ) : (
                  <label className="w-28 h-28 rounded-full border-2 border-dashed border-gold/30 flex flex-col items-center justify-center cursor-pointer hover:bg-[#FAF7F2] transition-colors group">
                    <Camera className="w-6 h-6 text-gold/70 mb-1 group-hover:scale-110 transition-transform" />
                    <span className="text-[11px] text-gold/80 font-medium">Upload Logo</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                  </label>
                )}
              </div>

              {/* Cover Image Section */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/60 mb-2">Cover Image (16:9)</label>
                {coverImage && (coverImage.startsWith("data:") || coverImage.startsWith("http") || coverImage.startsWith("/")) ? (
                  <div className="relative w-full h-40 rounded-xl border border-gold/30 overflow-hidden group shadow-xs bg-[#FAF7F2]">
                    <img src={coverImage} alt="Cover Image" className="w-full h-full object-cover" />
                    <label className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity text-xs font-bold gap-1">
                      <Camera className="w-5 h-5" />
                      <span>Change Cover Photo</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
                    </label>
                  </div>
                ) : (
                  <label className="w-full h-36 rounded-xl border-2 border-dashed border-gold/30 flex flex-col items-center justify-center cursor-pointer hover:bg-[#FAF7F2] transition-colors group">
                    <Camera className="w-6 h-6 text-gold/70 mb-1 group-hover:scale-110 transition-transform" />
                    <span className="text-xs text-gold/80 font-medium">Upload Cover Photo (16:9)</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
                  </label>
                )}
              </div>
            </section>

            {/* Contact & Location Section */}
            <section className="bg-white p-6 md:p-8 rounded-2xl shadow-xs border border-gold/15 space-y-4">
              <div className="flex items-center gap-2 border-b border-gold/10 pb-3">
                <MapPin className="w-5 h-5 text-[#0F4C45]" />
                <h2 className="text-lg font-display font-bold text-charcoal">Contact & Location</h2>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/60 mb-1">WhatsApp / Phone <span className="text-red-500">*</span></label>
                <input
                  type="tel"
                  required
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl p-3 text-sm text-charcoal focus:outline-none focus:border-[#0F4C45]"
                  placeholder="+91 9876543210"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/60 mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl p-3 text-sm text-charcoal focus:outline-none focus:border-[#0F4C45]"
                  placeholder="contact@studio.com"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/60 mb-1">District / City</label>
                  <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl p-3 text-sm text-charcoal focus:outline-none focus:border-[#0F4C45]"
                    placeholder="Ernakulam"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/60 mb-1">Instagram</label>
                  <input
                    type="text"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl p-3 text-sm text-charcoal focus:outline-none focus:border-[#0F4C45]"
                    placeholder="@yourstudio"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/60 mb-1">Address</label>
                <textarea
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl p-3 text-sm text-charcoal focus:outline-none focus:border-[#0F4C45]"
                  placeholder="Full studio address..."
                />
              </div>
            </section>
          </div>
        </div>

        {/* Save Button Bar */}
        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            disabled={isSaving}
            className="bg-[#0F4C45] hover:bg-[#135951] text-white rounded-full px-10 py-3.5 font-bold text-xs uppercase tracking-wider shadow-lg transition-all active:scale-95 cursor-pointer disabled:opacity-50 flex items-center gap-2"
          >
            <Save className="w-4 h-4 text-[#C8A96A]" />
            {isSaving ? "Saving..." : "Save Profile"}
          </Button>
        </div>
      </form>

      <BottomNavBar activeTab="vendors" />
    </div>
  );
}
