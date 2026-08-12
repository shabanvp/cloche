"use client";

<<<<<<< HEAD
import { useState, useEffect } from "react";
import { Palette, Upload, Image as ImageIcon, CheckCircle, Save, Eye, Loader2 } from "lucide-react";
import { fetchAuthenticatedVendorFromDb, syncVendorProfileWithDatabase, showVendorToast } from "@/lib/vendorStore";
=======
import { useState, useEffect, useRef } from "react";
import { Palette, Upload, Image as ImageIcon, CheckCircle, Save, Eye, Loader2 } from "lucide-react";
import { uploadImageToCloudinaryDetailed } from "@/lib/cloudinary";
import { fetchAuthenticatedVendorFromDb, getActiveVendorIdentity, syncVendorProfileWithDatabase, showVendorToast } from "@/lib/vendorStore";
>>>>>>> fc383a1cf04355bb0ae22d59ff3df8caaba20fe4

interface MehendiCustomizeStoreSectionProps {
  artistName: string;
  businessName: string;
}

export function MehendiCustomizeStoreSection({ artistName, businessName }: MehendiCustomizeStoreSectionProps) {
  const [vendorData, setVendorData] = useState<any>(null);
  const [logoUrl, setLogoUrl] = useState<string>("");
  const [coverUrl, setCoverUrl] = useState<string>("");
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
<<<<<<< HEAD
  const [isSaving, setIsSaving] = useState(false);
  const [logoUrl, setLogoUrl] = useState("");
  const [coverUrl, setCoverUrl] = useState("");

  useEffect(() => {
    let isMounted = true;
    fetchAuthenticatedVendorFromDb().then((profile) => {
      if (!isMounted) return;
      if (profile) {
        setLogoUrl(profile.logo || profile.logo_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop");
        setCoverUrl(profile.coverImage || profile.cover_image || "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1200&auto=format&fit=crop");
      }
    });
    return () => { isMounted = false; };
  }, [artistName, businessName]);

  const handleSave = async () => {
    setIsSaving(true);
    const res = await syncVendorProfileWithDatabase({
      logo_url: logoUrl,
      logo: logoUrl,
      cover_image: coverUrl,
      coverImage: coverUrl,
    });

    setIsSaving(false);
    if (res.success) {
      setSaved(true);
      showVendorToast("Mehendi store branding updated!");
      setTimeout(() => setSaved(false), 3000);
    } else {
      showVendorToast("Failed to save branding.", "error");
=======

  const logoInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const cached = getActiveVendorIdentity();
    if (cached && cached.id) {
      setVendorData(cached);
      if (cached.logo || cached.logo_url) setLogoUrl(cached.logo || cached.logo_url || "");
      if (cached.coverImage || cached.cover_image) setCoverUrl(cached.coverImage || cached.cover_image || "");
    }

    fetchAuthenticatedVendorFromDb().then((identity) => {
      if (identity && identity.id) {
        setVendorData(identity);
        if (identity.logo || identity.logo_url) setLogoUrl(identity.logo || identity.logo_url || "");
        if (identity.coverImage || identity.cover_image) setCoverUrl(identity.coverImage || identity.cover_image || "");
      }
    });
  }, []);

  const currentDisplayName = vendorData?.boutique_name || vendorData?.name || businessName || artistName || "Mehendi Studio";
  const currentLocation = [vendorData?.city, vendorData?.district].filter(Boolean).join(", ") || "Jaipur, Rajasthan";

  const initials = currentDisplayName
    .split(" ")
    .map((w: string) => w[0])
    .filter(Boolean)
    .join("")
    .slice(0, 2)
    .toUpperCase() || "HN";

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingLogo(true);
    try {
      const res = await uploadImageToCloudinaryDetailed(file, "cloche/vendors/logos");
      if (res.secure_url) {
        setLogoUrl(res.secure_url);
        showVendorToast("✓ Brand logo uploaded! Saving...", "info");

        const syncResult = await syncVendorProfileWithDatabase({
          id: vendorData?.id,
          logo: res.secure_url,
          logo_url: res.secure_url,
        });

        if (syncResult.success) {
          showVendorToast("✓ Brand logo updated and saved!", "success");
        }
      }
    } catch (err) {
      console.error("[MehendiCustomizeStore] Logo upload failed:", err);
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

        const syncResult = await syncVendorProfileWithDatabase({
          id: vendorData?.id,
          coverImage: res.secure_url,
          cover_image: res.secure_url,
        });

        if (syncResult.success) {
          showVendorToast("✓ Store cover photo updated and saved!", "success");
        }
      }
    } catch (err) {
      console.error("[MehendiCustomizeStore] Cover upload failed:", err);
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
        showVendorToast("✓ Henna store branding saved successfully!", "success");
        setTimeout(() => setSaved(false), 3500);
      } else {
        showVendorToast("Unable to save branding. Please try again.", "error");
      }
    } catch (err) {
      console.error("[MehendiCustomizeStore] Save error:", err);
      showVendorToast("Unable to save branding. Please try again.", "error");
    } finally {
      setIsSaving(false);
>>>>>>> fc383a1cf04355bb0ae22d59ff3df8caaba20fe4
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 font-sans">
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

      <div className="bg-white rounded-3xl border border-gold/15 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-[#0d3b30] text-white text-[11px] font-bold px-3 py-0.5 rounded-full">
              Henna Store Branding
            </span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-charcoal">Customize Storefront</h2>
          <p className="text-xs text-charcoal/60 mt-0.5">
            Personalize logo, cover banner image & store branding theme for brides on Cloche
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving || isUploadingLogo || isUploadingCover}
          className="bg-[#0d3b30] hover:bg-[#072B27] disabled:opacity-50 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-2 shrink-0 cursor-pointer"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 text-[#C8A96A] animate-spin" /> Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 text-[#C8A96A]" /> {saved ? "Saved Branding!" : "Save Branding"}
            </>
          )}
        </button>
      </div>

      {saved && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" /> Mehendi store branding updated successfully!
        </div>
      )}

      {/* Visual Live Storefront Preview */}
      <div className="bg-white rounded-3xl border border-gold/15 overflow-hidden shadow-xs space-y-0">
        <div className="p-4 bg-[#FAF7F2] border-b border-gold/10 flex items-center justify-between">
          <span className="text-xs font-serif font-bold text-charcoal flex items-center gap-1.5">
            <Eye className="w-4 h-4 text-[#0d3b30]" /> Live Storefront Preview (Mehendi Artist Studio)
          </span>
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
            Public Bride View
          </span>
        </div>

        <div className="relative h-48 sm:h-56 bg-[#0d3b30] overflow-hidden">
          {coverUrl ? (
            <img src={coverUrl} alt="Store Cover" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#0d3b30] via-[#145243] to-[#07251e] flex items-center justify-center">
              <span className="text-white/20 font-serif text-3xl tracking-widest font-bold select-none">{currentDisplayName}</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />
          
          <div className="absolute bottom-4 left-6 right-6 flex items-end gap-4 text-white">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-white overflow-hidden shadow-lg bg-[#0d3b30] shrink-0 relative flex items-center justify-center text-white">
              {logoUrl ? (
                <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
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
              <p className="text-xs text-white/90 font-medium mt-0.5">Rajasthani & Arabic Bridal Mehendi • {currentLocation}</p>
            </div>
          </div>

          {isUploadingCover && (
            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-2 text-white">
              <Loader2 className="w-8 h-8 text-[#C8A96A] animate-spin" />
              <span className="text-xs font-bold uppercase tracking-wider">Uploading Cover Photo...</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gold/15 space-y-4 shadow-xs">
          <h3 className="font-serif font-bold text-base text-charcoal flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-[#0d3b30]" /> Artist Logo / Emblem
          </h3>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full border-2 border-gold/20 overflow-hidden shrink-0 bg-[#0d3b30] relative flex items-center justify-center text-white">
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
              className="bg-[#FAF7F2] border border-gold/20 hover:bg-[#F3EDE2] disabled:opacity-50 text-[#0d3b30] font-bold text-xs px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer"
            >
              {isUploadingLogo ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Uploading Logo...
                </>
              ) : (
                <>
                  <Upload className="w-3.5 h-3.5" /> Upload Logo
                </>
              )}
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gold/15 space-y-4 shadow-xs">
          <h3 className="font-serif font-bold text-base text-charcoal flex items-center gap-2">
            <Palette className="w-4 h-4 text-[#0d3b30]" /> Cover Banner Image
          </h3>
          <div className="flex items-center gap-4">
            <div className="w-24 h-14 rounded-lg border border-gold/20 overflow-hidden shrink-0 bg-[#0d3b30] relative flex items-center justify-center text-white">
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
              className="bg-[#FAF7F2] border border-gold/20 hover:bg-[#F3EDE2] disabled:opacity-50 text-[#0d3b30] font-bold text-xs px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer"
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
