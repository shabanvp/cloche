"use client";

import { useState, useEffect, useRef } from "react";
import { Palette, Upload, Image as ImageIcon, Sparkles, CheckCircle, Save, Eye, Loader2 } from "lucide-react";
import { VendorCategoryConfig } from "@/lib/vendor-categories";
import { uploadImageToCloudinaryDetailed } from "@/lib/cloudinary";
import { fetchAuthenticatedVendorFromDb, getActiveVendorIdentity, syncVendorProfileWithDatabase, showVendorToast } from "@/lib/vendorStore";

interface CustomizeStoreSectionProps {
  categoryConfig: VendorCategoryConfig;
  vendorName: string;
}

export function CustomizeStoreSection({ categoryConfig, vendorName }: CustomizeStoreSectionProps) {
  const [vendorData, setVendorData] = useState<any>(null);
  const [logoUrl, setLogoUrl] = useState<string>("");
  const [coverUrl, setCoverUrl] = useState<string>("");
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // 1. Check cached active vendor identity first
    const cached = getActiveVendorIdentity();
    if (cached && cached.id) {
      setVendorData(cached);
      if (cached.logo || cached.logo_url) setLogoUrl(cached.logo || cached.logo_url || "");
      if (cached.coverImage || cached.cover_image) setCoverUrl(cached.coverImage || cached.cover_image || "");
    }

    // 2. Fetch authoritative database profile
    fetchAuthenticatedVendorFromDb().then((identity) => {
      if (identity && identity.id) {
        setVendorData(identity);
        if (identity.logo || identity.logo_url) setLogoUrl(identity.logo || identity.logo_url || "");
        if (identity.coverImage || identity.cover_image) setCoverUrl(identity.coverImage || identity.cover_image || "");
      }
    });
  }, []);

  const currentDisplayName = vendorData?.boutique_name || vendorData?.name || vendorName || "Vendor Partner";
  const currentCategoryBadge = vendorData?.category || categoryConfig.badge || categoryConfig.name;
  const currentLocation = [vendorData?.city, vendorData?.district].filter(Boolean).join(", ") || "Kerala, India";

  const initials = currentDisplayName
    .split(" ")
    .map((w: string) => w[0])
    .filter(Boolean)
    .join("")
    .slice(0, 2)
    .toUpperCase() || "CL";

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingLogo(true);
    try {
      const res = await uploadImageToCloudinaryDetailed(file, "cloche/vendors/logos");
      if (res.secure_url) {
        setLogoUrl(res.secure_url);
        showVendorToast("✓ Brand logo uploaded! Saving...", "info");

        // Immediately persist to database
        const syncResult = await syncVendorProfileWithDatabase({
          id: vendorData?.id,
          logo: res.secure_url,
          logo_url: res.secure_url,
        });

        if (syncResult.success) {
          showVendorToast("✓ Brand logo updated and saved!", "success");
        } else {
          showVendorToast("Logo uploaded. Click 'Save Branding' to finalize.", "info");
        }
      }
    } catch (err) {
      console.error("[CustomizeStore] Logo upload failed:", err);
      showVendorToast("Logo upload failed. Please try again.", "error");
    } finally {
      setIsUploadingLogo(false);
      if (logoInputRef.current) logoInputRef.current.value = "";
    }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingCover(true);
    try {
      const res = await uploadImageToCloudinaryDetailed(file, "cloche/vendors/covers");
      if (res.secure_url) {
        setCoverUrl(res.secure_url);
        showVendorToast("✓ Store cover photo uploaded! Saving...", "info");

        // Immediately persist to database
        const syncResult = await syncVendorProfileWithDatabase({
          id: vendorData?.id,
          coverImage: res.secure_url,
          cover_image: res.secure_url,
        });

        if (syncResult.success) {
          showVendorToast("✓ Store cover photo updated and saved!", "success");
        } else {
          showVendorToast("Cover uploaded. Click 'Save Branding' to finalize.", "info");
        }
      }
    } catch (err) {
      console.error("[CustomizeStore] Cover upload failed:", err);
      showVendorToast("Cover photo upload failed. Please try again.", "error");
    } finally {
      setIsUploadingCover(false);
      if (coverInputRef.current) coverInputRef.current.value = "";
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload = {
        id: vendorData?.id,
        logo: logoUrl,
        logo_url: logoUrl,
        coverImage: coverUrl,
        cover_image: coverUrl,
      };

      const res = await syncVendorProfileWithDatabase(payload);
      if (res.success) {
        setSaved(true);
        showVendorToast("✓ Storefront branding saved successfully!", "success");
        setTimeout(() => setSaved(false), 3500);
      } else {
        showVendorToast("Unable to save branding. Please try again.", "error");
      }
    } catch (err) {
      console.error("[CustomizeStore] Save error:", err);
      showVendorToast("Unable to save branding. Please try again.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 font-sans">
      {/* Hidden File Inputs */}
      <input
        ref={logoInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/jpg"
        className="hidden"
        onChange={handleLogoUpload}
      />
      <input
        ref={coverInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/jpg"
        className="hidden"
        onChange={handleCoverUpload}
      />

      {/* Header */}
      <div className="bg-white rounded-2xl border border-gold/15 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-[#0F4C45] text-white text-[11px] font-bold px-3 py-0.5 rounded-full">
              Store Branding
            </span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-charcoal">Customize Storefront</h2>
          <p className="text-xs text-charcoal/60 mt-0.5">
            Personalize logo, banner image, brand aesthetic & highlight badges for couples on Cloche
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving || isUploadingLogo || isUploadingCover}
          className="bg-[#0F4C45] hover:bg-[#072B27] disabled:opacity-50 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-2 shrink-0 cursor-pointer"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 text-gold animate-spin" /> Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 text-gold" /> {saved ? "Store Branding Saved!" : "Save Branding"}
            </>
          )}
        </button>
      </div>

      {saved && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" /> Storefront branding updated successfully!
        </div>
      )}

      {/* Visual Live Preview Card */}
      <div className="bg-white rounded-2xl border border-gold/15 overflow-hidden shadow-xs space-y-0">
        <div className="p-4 bg-[#FAF7F2] border-b border-gold/10 flex items-center justify-between">
          <span className="text-xs font-serif font-bold text-charcoal flex items-center gap-1.5">
            <Eye className="w-4 h-4 text-[#0F4C45]" /> Live Storefront Preview ({currentCategoryBadge})
          </span>
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
            Public View
          </span>
        </div>

        {/* Cover Banner & Logo Mockup */}
        <div className="relative h-44 sm:h-56 bg-[#0F4C45] overflow-hidden">
          {coverUrl ? (
            <img src={coverUrl} alt="Store Cover" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#0F4C45] via-[#165a52] to-[#0a3530] flex items-center justify-center">
              <span className="text-white/20 font-serif text-3xl tracking-widest font-bold select-none">{currentDisplayName}</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />
          
          <div className="absolute bottom-4 left-6 right-6 flex items-end gap-4 text-white">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-white overflow-hidden shadow-lg bg-[#0F4C45] shrink-0 relative flex items-center justify-center text-white">
              {logoUrl ? (
                <img src={logoUrl} alt="Store Logo" className="w-full h-full object-cover" />
              ) : (
                <span className="font-serif text-xl sm:text-2xl font-bold tracking-wider">{initials}</span>
              )}
              {isUploadingLogo && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <Loader2 className="w-6 h-6 text-white animate-spin" />
                </div>
              )}
            </div>
            <div className="mb-1 drop-shadow-md">
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-white leading-tight">{currentDisplayName}</h3>
              <p className="text-xs text-white/90 font-medium mt-0.5">{currentCategoryBadge} • {currentLocation}</p>
            </div>
          </div>

          {isUploadingCover && (
            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-2 text-white">
              <Loader2 className="w-8 h-8 text-gold animate-spin" />
              <span className="text-xs font-bold uppercase tracking-wider">Uploading Cover Photo...</span>
            </div>
          )}
        </div>
      </div>

      {/* Upload Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Logo Upload */}
        <div className="bg-white p-6 rounded-2xl border border-gold/15 space-y-4 shadow-xs">
          <h3 className="font-serif font-bold text-base text-charcoal flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-[#0F4C45]" /> Brand Logo / Emblem
          </h3>
          <p className="text-xs text-charcoal/60">Recommended square ratio (500x500 px PNG/JPG)</p>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full border-2 border-gold/20 overflow-hidden shrink-0 bg-[#0F4C45] relative flex items-center justify-center text-white">
              {logoUrl ? (
                <img src={logoUrl} className="w-full h-full object-cover" alt="Logo" />
              ) : (
                <span className="font-serif text-base font-bold tracking-wider">{initials}</span>
              )}
              {isUploadingLogo && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Loader2 className="w-5 h-5 text-white animate-spin" />
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => logoInputRef.current?.click()}
              disabled={isUploadingLogo}
              className="bg-[#FAF7F2] border border-gold/20 hover:bg-[#F3EDE2] disabled:opacity-50 text-[#0F4C45] font-bold text-xs px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer"
            >
              {isUploadingLogo ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Uploading Logo...
                </>
              ) : (
                <>
                  <Upload className="w-3.5 h-3.5" /> Upload New Logo
                </>
              )}
            </button>
          </div>
        </div>

        {/* Cover Banner Upload */}
        <div className="bg-white p-6 rounded-2xl border border-gold/15 space-y-4 shadow-xs">
          <h3 className="font-serif font-bold text-base text-charcoal flex items-center gap-2">
            <Palette className="w-4 h-4 text-[#0F4C45]" /> Store Cover Image
          </h3>
          <p className="text-xs text-charcoal/60">High resolution wide cover photo (1200x500 px)</p>

          <div className="flex items-center gap-4">
            <div className="w-24 h-14 rounded-lg border border-gold/20 overflow-hidden shrink-0 bg-[#0F4C45] relative flex items-center justify-center text-white">
              {coverUrl ? (
                <img src={coverUrl} className="w-full h-full object-cover" alt="Cover" />
              ) : (
                <span className="font-serif text-xs font-bold opacity-60">No Cover</span>
              )}
              {isUploadingCover && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Loader2 className="w-5 h-5 text-white animate-spin" />
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => coverInputRef.current?.click()}
              disabled={isUploadingCover}
              className="bg-[#FAF7F2] border border-gold/20 hover:bg-[#F3EDE2] disabled:opacity-50 text-[#0F4C45] font-bold text-xs px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer"
            >
              {isUploadingCover ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Uploading Cover...
                </>
              ) : (
                <>
                  <Upload className="w-3.5 h-3.5" /> Replace Cover
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
