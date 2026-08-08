"use client";

import { useState, useEffect } from "react";
import { Store, Camera, MapPin, Link as LinkIcon, Phone, CheckCircle2, Building2, Clock, Globe, Save, AlertCircle } from "lucide-react";
import { Button } from "@/components/Button";
import { fetchAuthenticatedVendorFromDb, syncVendorProfileWithDatabase, showVendorToast } from "@/lib/vendorStore";

export default function VendorProfile() {
  const [vendorId, setVendorId] = useState<string>("");
  const [logo, setLogo] = useState<string>("");
  const [coverImage, setCoverImage] = useState<string>("");
  const [boutiqueName, setBoutiqueName] = useState<string>("");
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

  const loadProfile = async () => {
    const active = await fetchAuthenticatedVendorFromDb();
    setVendorId(active.id || "");
    setBoutiqueName(active.boutique_name || active.name || "");
    setLogo(active.logo || active.logo_url || "");
    setCoverImage(active.coverImage || active.cover_image || "");
    setDescription(active.description || "");
    setWhatsapp(active.whatsapp || active.phone || "");
    setEmail(active.email || "");
    setInstagram(active.instagram || "");
    setWebsite(active.website || "");
    setAddress(active.address || "");
    setDistrict(active.district || active.city || "");
    setCategory(active.category || "");
    setWorkingHours(active.workingHours || active.working_hours || "");
    setServiceAreas(active.serviceAreas || active.service_areas || "");
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setValidationError("Image file size should not exceed 10MB");
        return;
      }
      const previewUrl = URL.createObjectURL(file);
      setLogo(previewUrl);

      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", "cloche/vendors/logos");
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (data.url || data.secure_url) {
          setLogo(data.url || data.secure_url);
        }
      } catch (err) {
        console.warn("[VendorProfile] Logo Cloudinary upload warning:", err);
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
      const previewUrl = URL.createObjectURL(file);
      setCoverImage(previewUrl);

      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", "cloche/vendors/covers");
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (data.url || data.secure_url) {
          setCoverImage(data.url || data.secure_url);
        }
      } catch (err) {
        console.warn("[VendorProfile] Cover Cloudinary upload warning:", err);
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
      if (logo && (logo.startsWith("data:image/") || logo.startsWith("blob:"))) {
        try {
          const { uploadImageToCloudinary } = await import("@/lib/cloudinary");
          finalLogoUrl = await uploadImageToCloudinary(logo, "cloche/vendors/logos");
          setLogo(finalLogoUrl);
        } catch (err) {
          console.warn("[VendorProfile] Logo Cloudinary upload warning:", err);
        }
      }

      // Upload cover to Cloudinary if base64/blob data URL
      if (coverImage && (coverImage.startsWith("data:image/") || coverImage.startsWith("blob:"))) {
        try {
          const { uploadImageToCloudinary } = await import("@/lib/cloudinary");
          finalCoverUrl = await uploadImageToCloudinary(coverImage, "cloche/vendors/covers");
          setCoverImage(finalCoverUrl);
        } catch (err) {
          console.warn("[VendorProfile] Cover Cloudinary upload warning:", err);
        }
      }

      const payload = {
        id: vendorId,
        boutique_name: boutiqueName.trim(),
        name: boutiqueName.trim(),
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
      
      {/* Header */}
      <div className="border-b border-gold/15 pb-4 flex justify-between items-center">
        <div>
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
                Boutique / Studio Name <span className="text-red-500">*</span>
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
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/60 mb-2">Category</label>
              <input
                type="text"
                readOnly
                value={category}
                className="w-full bg-gray-100 border border-gray-200 rounded-xl p-3 text-sm text-charcoal/60 font-semibold cursor-not-allowed"
              />
            </div>

            {/* Logo & Cover Branding */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/60 mb-2">Studio Logo</label>
                {logo && (logo.startsWith("data:") || logo.startsWith("http") || logo.startsWith("/")) ? (
                  <div className="relative w-28 h-28 rounded-full border-2 border-gold/30 overflow-hidden group shadow-sm bg-[#FAF7F2]">
                    <img src={logo} alt="Logo" className="w-full h-full object-cover" />
                    <label className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-opacity text-[10px] font-bold">
                      <Camera className="w-5 h-5 mb-1" />
                      <span>Change Logo</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                    </label>
                  </div>
                ) : (
                  <label className="w-28 h-28 rounded-full border-2 border-dashed border-gold/30 flex flex-col items-center justify-center cursor-pointer hover:bg-[#FAF7F2] transition-colors group">
                    <Camera className="w-6 h-6 text-gold mb-1 opacity-70 group-hover:opacity-100" />
                    <span className="text-[10px] text-charcoal/60 font-medium">Upload Logo</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                  </label>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/60 mb-2">Gallery Cover Photo (16:9)</label>
                {coverImage && (coverImage.startsWith("data:") || coverImage.startsWith("http") || coverImage.startsWith("/")) ? (
                  <div className="relative w-full h-36 rounded-xl border-2 border-gold/30 overflow-hidden group shadow-sm bg-[#FAF7F2]">
                    <img src={coverImage} alt="Cover Image" className="w-full h-full object-cover" />
                    <label className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity text-xs font-bold gap-1">
                      <Camera className="w-5 h-5" />
                      <span>Change Cover Photo</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
                    </label>
                  </div>
                ) : (
                  <label className="w-full h-36 rounded-xl border-2 border-dashed border-gold/30 flex flex-col items-center justify-center cursor-pointer hover:bg-[#FAF7F2] transition-colors group">
                    <Camera className="w-6 h-6 text-gold mb-1 opacity-70 group-hover:opacity-100" />
                    <span className="text-xs text-charcoal/60 font-medium">Upload Cover Photo (16:9)</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
                  </label>
                )}
              </div>
            </div>
          </section>

          {/* Right Column: Contact Information */}
          <section className="bg-white p-6 md:p-8 rounded-2xl shadow-xs border border-gold/15 space-y-6">
            <div className="flex items-center gap-2 border-b border-gold/10 pb-3">
              <Phone className="w-5 h-5 text-[#0F4C45]" />
              <h2 className="text-lg font-display font-bold text-charcoal">Contact & Social Links</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/60 mb-2">
                  WhatsApp / Phone Contact <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-charcoal/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl p-3 pl-10 text-sm text-charcoal focus:outline-none focus:border-[#0F4C45]"
                    placeholder="+919876543210"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/60 mb-2">Instagram Handle</label>
                <div className="relative">
                  <LinkIcon className="w-4 h-4 text-charcoal/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl p-3 pl-10 text-sm text-charcoal focus:outline-none focus:border-[#0F4C45]"
                    placeholder="@yourstudio"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/60 mb-2">Official Website</label>
                <div className="relative">
                  <Globe className="w-4 h-4 text-charcoal/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl p-3 pl-10 text-sm text-charcoal focus:outline-none focus:border-[#0F4C45]"
                    placeholder="https://yourwebsite.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/60 mb-2">District / City Location</label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl p-3 text-sm text-charcoal focus:outline-none focus:border-[#0F4C45] font-semibold"
                  placeholder="City / Location"
                />
              </div>
            </div>
          </section>

        </div>

        {/* Additional Details */}
        <section className="bg-white p-6 md:p-8 rounded-2xl shadow-xs border border-gold/15 space-y-6">
          <h2 className="text-lg font-display font-bold text-charcoal border-b border-gold/10 pb-3">Additional Business Details</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/60 mb-2">About Your Business</label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl p-3 text-sm text-charcoal focus:outline-none focus:border-[#0F4C45] leading-relaxed"
                placeholder="Describe your studio specialty, experience, and custom offerings for couples..."
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/60 mb-2">
                Complete Address <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={4}
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl p-3 text-sm text-charcoal focus:outline-none focus:border-[#0F4C45]"
                placeholder="Building Name, MG Road, Kochi"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/60 mb-2">Working Hours</label>
              <div className="relative">
                <Clock className="w-4 h-4 text-charcoal/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={workingHours}
                  onChange={(e) => setWorkingHours(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl p-3 pl-10 text-sm text-charcoal focus:outline-none focus:border-[#0F4C45]"
                  placeholder="Mon – Sat: 10:00 AM – 8:00 PM"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/60 mb-2">Primary Service Areas</label>
              <input
                type="text"
                value={serviceAreas}
                onChange={(e) => setServiceAreas(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl p-3 text-sm text-charcoal focus:outline-none focus:border-[#0F4C45]"
                placeholder="Kochi, Trivandrum, Kozhikode, Thrissur"
              />
            </div>
          </div>
        </section>

        {/* Sticky Desktop Save Button Footer */}
        <div className="sticky bottom-6 bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-gold/20 shadow-lg flex items-center justify-between z-20">
          <div className="text-xs text-charcoal/70 hidden sm:block">
            Updates will immediately sync with Supabase database and reflect on public storefronts.
          </div>
          <Button 
            type="submit" 
            disabled={isSaving}
            className="bg-[#0F4C45] hover:bg-[#135951] text-white rounded-full px-8 py-3 font-bold text-xs uppercase tracking-wider shadow-md flex items-center gap-2 ml-auto cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4 text-[#C8A96A]" /> {isSaving ? "Saving to Database..." : "Save Profile Changes"}
          </Button>
        </div>

      </form>
    </div>
  );
}
