"use client";

import { useState, useEffect, useRef } from "react";
import {
  Palette,
  Upload,
  Image as ImageIcon,
  Sparkles,
  CheckCircle,
  Save,
  Eye,
  Loader2,
  ChevronDown,
  ChevronUp,
  Video,
  LayoutGrid,
  Globe,
  Instagram,
  Facebook,
  Youtube,
  FileText,
  X,
  Play
} from "lucide-react";
import { VendorCategoryConfig } from "@/lib/vendor-categories";
import { uploadImageToCloudinaryDetailed } from "@/lib/cloudinary";
import {
  fetchAuthenticatedVendorFromDb,
  getActiveVendorIdentity,
  syncVendorProfileWithDatabase,
  showVendorToast
} from "@/lib/vendorStore";

interface CustomizeStoreSectionProps {
  categoryConfig: VendorCategoryConfig;
  vendorName: string;
}

export interface ColorThemeOption {
  id: string;
  label: string;
  primary: string;
  secondary: string;
  accent: string;
  badgeBg: string;
  badgeText: string;
}

export const COLOR_THEMES: ColorThemeOption[] = [
  { id: "emerald", label: "Emerald Green", primary: "#0F4C45", secondary: "#072B27", accent: "#C8A96A", badgeBg: "#0F4C45", badgeText: "#FFFFFF" },
  { id: "rosegold", label: "Rose Gold", primary: "#B87333", secondary: "#915622", accent: "#E8A598", badgeBg: "#B87333", badgeText: "#FFFFFF" },
  { id: "burgundy", label: "Burgundy", primary: "#800020", secondary: "#4A0012", accent: "#D4AF37", badgeBg: "#800020", badgeText: "#FFFFFF" },
  { id: "beige", label: "Beige / Sand", primary: "#8C7355", secondary: "#604E38", accent: "#D4B896", badgeBg: "#8C7355", badgeText: "#FFFFFF" },
  { id: "blackgold", label: "Black & Gold", primary: "#1A1A1A", secondary: "#0A0A0A", accent: "#C8A96A", badgeBg: "#1A1A1A", badgeText: "#C8A96A" },
  { id: "softpink", label: "Soft Pink", primary: "#C27BA0", secondary: "#9E5A7E", accent: "#F4C2C2", badgeBg: "#C27BA0", badgeText: "#FFFFFF" },
];

export const GALLERY_LAYOUTS = [
  { id: "grid", label: "Grid", desc: "Classic balanced tile grid" },
  { id: "masonry", label: "Masonry", desc: "Dynamic editorial staggered look" },
  { id: "carousel", label: "Carousel", desc: "Interactive horizontal swipe" },
  { id: "hero", label: "Large Hero Gallery", desc: "Featured hero photo + grid" },
];

export function CustomizeStoreSection({ categoryConfig, vendorName }: CustomizeStoreSectionProps) {
  const [vendorData, setVendorData] = useState<any>(null);

  // Storefront Customization Fields
  const [logoUrl, setLogoUrl] = useState<string>("");
  const [coverUrl, setCoverUrl] = useState<string>("");
  const [tagline, setTagline] = useState<string>("");
  const [about, setAbout] = useState<string>("");
  const [colorTheme, setColorTheme] = useState<string>("emerald");
  const [galleryLayout, setGalleryLayout] = useState<string>("grid");
  const [introVideo, setIntroVideo] = useState<string>("");

  // Social Links
  const [instagram, setInstagram] = useState<string>("");
  const [facebook, setFacebook] = useState<string>("");
  const [youtube, setYoutube] = useState<string>("");
  const [website, setWebsite] = useState<string>("");

  // Loading & Upload states
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Accordion Sections State
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({
    branding: true,
    theme: true,
    about: false,
    media: false,
    social: false,
  });

  const logoInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const toggleAccordion = (key: string) => {
    setOpenAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const populateFromIdentity = (identity: any) => {
    if (!identity) return;
    setVendorData(identity);
    if (identity.logo || identity.logo_url) setLogoUrl(identity.logo || identity.logo_url || "");
    if (identity.coverImage || identity.cover_image) setCoverUrl(identity.coverImage || identity.cover_image || "");
    if (identity.tagline) setTagline(identity.tagline || "");
    if (identity.about || identity.description) setAbout(identity.about || identity.description || "");
    if (identity.color_theme || identity.colorTheme) setColorTheme(identity.color_theme || identity.colorTheme || "emerald");
    if (identity.gallery_layout || identity.galleryLayout) setGalleryLayout(identity.gallery_layout || identity.galleryLayout || "grid");
    if (identity.intro_video || identity.intro_video_url || identity.introVideo) {
      setIntroVideo(identity.intro_video || identity.intro_video_url || identity.introVideo || "");
    }
    if (identity.instagram) setInstagram(identity.instagram || "");
    if (identity.facebook) setFacebook(identity.facebook || "");
    if (identity.youtube) setYoutube(identity.youtube || "");
    if (identity.website) setWebsite(identity.website || "");
  };

  useEffect(() => {
    // 1. Check cached active vendor identity first
    const cached = getActiveVendorIdentity();
    if (cached && cached.id) {
      populateFromIdentity(cached);
    }

    // 2. Fetch authoritative database profile
    fetchAuthenticatedVendorFromDb().then((identity) => {
      if (identity && identity.id) {
        populateFromIdentity(identity);
      }
    });
  }, []);

  const currentDisplayName = vendorData?.boutique_name || vendorData?.name || vendorName || "Makeup Artist Studio";
  const currentCategoryBadge = vendorData?.category || categoryConfig.badge || categoryConfig.name;
  const currentLocation = [vendorData?.city, vendorData?.district].filter(Boolean).join(", ") || "Kerala, India";

  const activeTheme = COLOR_THEMES.find((t) => t.id === colorTheme) || COLOR_THEMES[0];

  const initials = currentDisplayName
    .split(" ")
    .map((w: string) => w[0])
    .filter(Boolean)
    .join("")
    .slice(0, 2)
    .toUpperCase() || "MA";

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
      console.error("[CustomizeStore] Cover upload failed:", err);
      showVendorToast("Cover photo upload failed. Please try again.", "error");
    } finally {
      setIsUploadingCover(false);
      if (coverInputRef.current) coverInputRef.current.value = "";
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) {
      showVendorToast("Intro video size must be under 50MB.", "error");
      return;
    }

    setIsUploadingVideo(true);
    try {
      const res = await uploadImageToCloudinaryDetailed(file, "cloche/vendors/videos");
      if (res.secure_url) {
        setIntroVideo(res.secure_url);
        showVendorToast("✓ Intro video uploaded successfully!", "success");
      }
    } catch (err) {
      console.error("[CustomizeStore] Video upload failed:", err);
      showVendorToast("Video upload failed. Please try again.", "error");
    } finally {
      setIsUploadingVideo(false);
      if (videoInputRef.current) videoInputRef.current.value = "";
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
        tagline: tagline.trim(),
        about: about.trim(),
        description: about.trim(),
        color_theme: colorTheme,
        colorTheme: colorTheme,
        gallery_layout: galleryLayout,
        galleryLayout: galleryLayout,
        intro_video: introVideo,
        intro_video_url: introVideo,
        introVideo: introVideo,
        instagram: instagram.trim(),
        facebook: facebook.trim(),
        youtube: youtube.trim(),
        website: website.trim(),
      };

      const res = await syncVendorProfileWithDatabase(payload);
      if (res.success) {
        setSaved(true);
        showVendorToast("✓ Storefront customization saved successfully!", "success");
        setTimeout(() => setSaved(false), 3500);
      } else {
        showVendorToast("Unable to save storefront customization. Please try again.", "error");
      }
    } catch (err) {
      console.error("[CustomizeStore] Save error:", err);
      showVendorToast("Unable to save storefront customization. Please try again.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 font-sans">
      {/* Hidden Device File Inputs */}
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
      <input
        ref={videoInputRef}
        type="file"
        accept="video/mp4,video/webm,video/quicktime"
        className="hidden"
        onChange={handleVideoUpload}
      />

      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-gold/15 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              style={{ backgroundColor: activeTheme.primary }}
              className="text-white text-[11px] font-bold px-3 py-0.5 rounded-full transition-colors"
            >
              Storefront Customization
            </span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-charcoal">Customize Storefront</h2>
          <p className="text-xs text-charcoal/60 mt-0.5">
            Personalize logo, tagline, brand theme, intro video, gallery layout & social links
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving || isUploadingLogo || isUploadingCover || isUploadingVideo}
          style={{ backgroundColor: activeTheme.primary }}
          className="hover:opacity-90 disabled:opacity-50 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-2 shrink-0 cursor-pointer"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 text-gold animate-spin" /> Saving Storefront...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 text-gold" /> {saved ? "Storefront Customization Saved!" : "Save Customization"}
            </>
          )}
        </button>
      </div>

      {saved && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" /> Storefront customization updated successfully!
        </div>
      )}

      {/* Real-time Live Storefront Preview Card */}
      <div className="bg-white rounded-2xl border border-gold/15 overflow-hidden shadow-xs space-y-0">
        <div className="p-4 bg-[#FAF7F2] border-b border-gold/10 flex items-center justify-between">
          <span className="text-xs font-serif font-bold text-charcoal flex items-center gap-1.5">
            <Eye className="w-4 h-4 text-[#0F4C45]" /> Real-time Live Storefront Preview ({currentCategoryBadge})
          </span>
          <span
            style={{ backgroundColor: `${activeTheme.primary}15`, color: activeTheme.primary }}
            className="text-[10px] font-bold px-2.5 py-0.5 rounded-full"
          >
            Live Public View
          </span>
        </div>

        {/* Banner Hero & Branding Header */}
        <div style={{ backgroundColor: activeTheme.secondary }} className="relative h-48 sm:h-60 overflow-hidden transition-colors">
          {coverUrl ? (
            <img src={coverUrl} alt="Store Cover" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-white/20 font-serif text-3xl tracking-widest font-bold select-none">
                {currentDisplayName}
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />

          <div className="absolute bottom-4 left-6 right-6 flex items-end gap-4 text-white">
            <div
              style={{ backgroundColor: activeTheme.primary }}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-white overflow-hidden shadow-lg shrink-0 relative flex items-center justify-center text-white"
            >
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

            <div className="mb-1 drop-shadow-md flex-1 min-w-0">
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-white leading-tight truncate">
                {currentDisplayName}
              </h3>
              {tagline ? (
                <p style={{ color: activeTheme.accent }} className="text-xs font-semibold mt-0.5 italic truncate">
                  "{tagline}"
                </p>
              ) : (
                <p className="text-xs text-white/80 font-medium mt-0.5 truncate">
                  {currentCategoryBadge} • {currentLocation}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Live Preview Accent Bar & Buttons */}
        <div className="p-4 sm:p-5 bg-white border-b border-gold/10 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span
                style={{ backgroundColor: activeTheme.primary }}
                className="text-white font-bold text-[10px] uppercase px-3 py-1 rounded-full shadow-xs"
              >
                {activeTheme.label} Theme
              </span>
              <span className="text-[11px] font-semibold text-charcoal/70">
                Gallery: {GALLERY_LAYOUTS.find((l) => l.id === galleryLayout)?.label}
              </span>
            </div>

            {/* Social Icons Strip Preview */}
            <div className="flex items-center gap-2">
              {instagram && (
                <span className="w-7 h-7 rounded-full bg-pink-50 text-pink-600 flex items-center justify-center text-xs font-bold shadow-xs">
                  <Instagram className="w-3.5 h-3.5" />
                </span>
              )}
              {facebook && (
                <span className="w-7 h-7 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold shadow-xs">
                  <Facebook className="w-3.5 h-3.5" />
                </span>
              )}
              {youtube && (
                <span className="w-7 h-7 rounded-full bg-red-50 text-red-600 flex items-center justify-center text-xs font-bold shadow-xs">
                  <Youtube className="w-3.5 h-3.5" />
                </span>
              )}
              {website && (
                <span className="w-7 h-7 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center text-xs font-bold shadow-xs">
                  <Globe className="w-3.5 h-3.5" />
                </span>
              )}
            </div>
          </div>

          {/* Intro Video Badge in Preview */}
          {introVideo && (
            <div className="p-3 bg-[#FAF7F2] rounded-xl border border-gold/20 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <div
                  style={{ backgroundColor: activeTheme.primary }}
                  className="w-8 h-8 rounded-full text-white flex items-center justify-center shrink-0"
                >
                  <Play className="w-4 h-4 fill-white" />
                </div>
                <div>
                  <span className="font-serif font-bold text-charcoal block">Intro Brand Reel Active</span>
                  <span className="text-[10px] text-charcoal/60">30-60s Brand Introduction Video</span>
                </div>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                Video Attached
              </span>
            </div>
          )}

          {/* Live About Preview */}
          {about && (
            <div className="p-3.5 bg-gray-50/80 rounded-xl border border-gray-100 text-xs text-charcoal/80 space-y-1">
              <span className="font-serif font-bold text-charcoal block">About Brand Preview:</span>
              <p className="text-[11px] leading-relaxed line-clamp-3 font-medium text-charcoal/70">{about}</p>
            </div>
          )}
        </div>
      </div>

      {/* Accordion Form Controls */}
      <div className="space-y-4">
        {/* Accordion 1: Branding & Basic Identity */}
        <div className="bg-white rounded-2xl border border-gold/15 overflow-hidden shadow-xs">
          <button
            type="button"
            onClick={() => toggleAccordion("branding")}
            className="w-full p-5 text-left font-serif font-bold text-base text-charcoal flex items-center justify-between bg-[#FAF7F2]/60 hover:bg-[#FAF7F2] transition-colors"
          >
            <span className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-[#0F4C45]" /> 1. Brand Logo, Cover Photo & Store Tagline
            </span>
            {openAccordions.branding ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {openAccordions.branding && (
            <div className="p-6 border-t border-gold/10 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Logo Uploader */}
                <div className="space-y-3">
                  <label className="block text-xs font-bold text-charcoal/80 uppercase tracking-wider">Brand Logo / Avatar</label>
                  <div className="flex items-center gap-4">
                    <div
                      style={{ backgroundColor: activeTheme.primary }}
                      className="w-16 h-16 rounded-full border-2 border-gold/20 overflow-hidden shrink-0 relative flex items-center justify-center text-white shadow-xs"
                    >
                      {logoUrl ? (
                        <img src={logoUrl} className="w-full h-full object-cover" alt="Logo" />
                      ) : (
                        <span className="font-serif text-base font-bold tracking-wider">{initials}</span>
                      )}
                      {isUploadingLogo && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <Loader2 className="w-5 h-5 text-white animate-spin" />
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => logoInputRef.current?.click()}
                      disabled={isUploadingLogo}
                      className="bg-[#FAF7F2] border border-gold/20 hover:bg-[#F3EDE2] text-[#0F4C45] font-bold text-xs px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isUploadingLogo ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                      Upload Logo
                    </button>
                  </div>
                </div>

                {/* Cover Uploader */}
                <div className="space-y-3">
                  <label className="block text-xs font-bold text-charcoal/80 uppercase tracking-wider">Store Cover Photo</label>
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-14 rounded-lg border border-gold/20 overflow-hidden shrink-0 bg-gray-100 relative flex items-center justify-center text-white shadow-xs">
                      {coverUrl ? (
                        <img src={coverUrl} className="w-full h-full object-cover" alt="Cover" />
                      ) : (
                        <span className="font-serif text-xs font-bold text-charcoal/40">No Cover</span>
                      )}
                      {isUploadingCover && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <Loader2 className="w-5 h-5 text-white animate-spin" />
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => coverInputRef.current?.click()}
                      disabled={isUploadingCover}
                      className="bg-[#FAF7F2] border border-gold/20 hover:bg-[#F3EDE2] text-[#0F4C45] font-bold text-xs px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isUploadingCover ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                      Replace Cover
                    </button>
                  </div>
                </div>
              </div>

              {/* Tagline Field with Live Counter */}
              <div className="space-y-1.5 pt-2 border-t border-gold/10">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-charcoal/80 uppercase tracking-wider">Store Tagline</label>
                  <span className={`text-[11px] font-mono font-bold ${tagline.length > 80 ? "text-red-600" : "text-charcoal/50"}`}>
                    {tagline.length} / 80 chars
                  </span>
                </div>
                <input
                  type="text"
                  maxLength={80}
                  placeholder="e.g. Luxury Bridal Makeup Artist | HD & Airbrush Specialist"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-4 py-2.5 text-xs text-charcoal font-medium focus:outline-none focus:border-[#0F4C45]"
                />
                <p className="text-[11px] text-charcoal/50">Reflects immediately under your studio name on live storefront.</p>
              </div>
            </div>
          )}
        </div>

        {/* Accordion 2: Brand Color Theme */}
        <div className="bg-white rounded-2xl border border-gold/15 overflow-hidden shadow-xs">
          <button
            type="button"
            onClick={() => toggleAccordion("theme")}
            className="w-full p-5 text-left font-serif font-bold text-base text-charcoal flex items-center justify-between bg-[#FAF7F2]/60 hover:bg-[#FAF7F2] transition-colors"
          >
            <span className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-[#0F4C45]" /> 2. Brand Color Theme Palette
            </span>
            {openAccordions.theme ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {openAccordions.theme && (
            <div className="p-6 border-t border-gold/10 space-y-4">
              <p className="text-xs text-charcoal/70">
                Select your signature brand color. This theme will styled your action buttons, highlights, and badges on your public storefront.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {COLOR_THEMES.map((theme) => {
                  const isSelected = colorTheme === theme.id;
                  return (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => setColorTheme(theme.id)}
                      className={`p-3.5 rounded-xl border transition-all text-left flex flex-col justify-between space-y-3 cursor-pointer ${
                        isSelected
                          ? "border-[#0F4C45] ring-2 ring-[#0F4C45]/20 bg-[#FAF7F2]"
                          : "border-gold/20 bg-white hover:border-gold/40"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-charcoal">{theme.label}</span>
                        {isSelected && <CheckCircle className="w-4 h-4 text-[#0F4C45]" />}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-full shadow-xs border border-white" style={{ backgroundColor: theme.primary }} />
                        <div className="w-4 h-4 rounded-full shadow-xs border border-white" style={{ backgroundColor: theme.secondary }} />
                        <div className="w-4 h-4 rounded-full shadow-xs border border-white" style={{ backgroundColor: theme.accent }} />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Accordion 3: About Brand */}
        <div className="bg-white rounded-2xl border border-gold/15 overflow-hidden shadow-xs">
          <button
            type="button"
            onClick={() => toggleAccordion("about")}
            className="w-full p-5 text-left font-serif font-bold text-base text-charcoal flex items-center justify-between bg-[#FAF7F2]/60 hover:bg-[#FAF7F2] transition-colors"
          >
            <span className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#0F4C45]" /> 3. About Brand & Biography
            </span>
            {openAccordions.about ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {openAccordions.about && (
            <div className="p-6 border-t border-gold/10 space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-charcoal/80 uppercase tracking-wider">About Brand Story</label>
                <span className={`text-[11px] font-mono font-bold ${about.length > 500 ? "text-red-600" : "text-charcoal/50"}`}>
                  {about.length} / 500 chars (Rec: 200 - 500)
                </span>
              </div>
              <textarea
                rows={4}
                maxLength={500}
                placeholder="Share your artistry story, experience years, product brands used (MAC, Dior, Charlotte Tilbury), and beauty philosophy..."
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl p-3.5 text-xs text-charcoal font-medium focus:outline-none focus:border-[#0F4C45] resize-none"
              />
              <p className="text-[11px] text-charcoal/50">Displayed directly under the cover image on your public storefront page.</p>
            </div>
          )}
        </div>

        {/* Accordion 4: Featured Gallery Layout & Intro Video */}
        <div className="bg-white rounded-2xl border border-gold/15 overflow-hidden shadow-xs">
          <button
            type="button"
            onClick={() => toggleAccordion("media")}
            className="w-full p-5 text-left font-serif font-bold text-base text-charcoal flex items-center justify-between bg-[#FAF7F2]/60 hover:bg-[#FAF7F2] transition-colors"
          >
            <span className="flex items-center gap-2">
              <LayoutGrid className="w-4 h-4 text-[#0F4C45]" /> 4. Featured Gallery Layout & Intro Brand Reel
            </span>
            {openAccordions.media ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {openAccordions.media && (
            <div className="p-6 border-t border-gold/10 space-y-6">
              {/* Layout Selector */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-charcoal/80 uppercase tracking-wider">Featured Gallery Layout</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {GALLERY_LAYOUTS.map((layout) => {
                    const isSelected = galleryLayout === layout.id;
                    return (
                      <button
                        key={layout.id}
                        type="button"
                        onClick={() => setGalleryLayout(layout.id)}
                        className={`p-4 rounded-xl border transition-all text-left flex items-start justify-between cursor-pointer ${
                          isSelected
                            ? "border-[#0F4C45] ring-2 ring-[#0F4C45]/20 bg-[#FAF7F2]"
                            : "border-gold/20 bg-white hover:border-gold/40"
                        }`}
                      >
                        <div>
                          <span className="text-xs font-bold text-charcoal block">{layout.label}</span>
                          <span className="text-[11px] text-charcoal/60 mt-0.5 block">{layout.desc}</span>
                        </div>
                        {isSelected && <CheckCircle className="w-4 h-4 text-[#0F4C45] shrink-0 mt-0.5" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Device Intro Video Upload */}
              <div className="space-y-3 pt-4 border-t border-gold/10">
                <label className="block text-xs font-bold text-charcoal/80 uppercase tracking-wider">Intro Promotional Video Reel (30 - 60s)</label>

                {introVideo ? (
                  <div className="p-4 bg-[#FAF7F2] rounded-xl border border-gold/20 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
                        <Video className="w-4 h-4 text-[#0F4C45]" /> Intro Video Reel Uploaded
                      </div>
                      <button
                        type="button"
                        onClick={() => setIntroVideo("")}
                        className="text-xs font-bold text-red-600 hover:text-red-800 flex items-center gap-1 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" /> Remove Video
                      </button>
                    </div>
                    <video src={introVideo} controls className="w-full max-h-48 rounded-lg border border-gold/15 bg-black" />
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => videoInputRef.current?.click()}
                      disabled={isUploadingVideo}
                      className="bg-[#FAF7F2] border border-gold/20 hover:bg-[#F3EDE2] text-[#0F4C45] font-bold text-xs px-5 py-3 rounded-xl transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isUploadingVideo ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-[#0F4C45]" /> Uploading Video File...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4" /> Upload Video from Device
                        </>
                      )}
                    </button>
                    <span className="text-[11px] text-charcoal/60">MP4, WEBM (Max 50MB). Hidden on storefront if left empty.</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Accordion 5: Social Media Links */}
        <div className="bg-white rounded-2xl border border-gold/15 overflow-hidden shadow-xs">
          <button
            type="button"
            onClick={() => toggleAccordion("social")}
            className="w-full p-5 text-left font-serif font-bold text-base text-charcoal flex items-center justify-between bg-[#FAF7F2]/60 hover:bg-[#FAF7F2] transition-colors"
          >
            <span className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#0F4C45]" /> 5. Social Media Connections
            </span>
            {openAccordions.social ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {openAccordions.social && (
            <div className="p-6 border-t border-gold/10 space-y-4">
              <p className="text-xs text-charcoal/60">
                Provide links to your active social profiles. Icons will be displayed on your public storefront only for platforms you fill in.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-charcoal/80 mb-1 flex items-center gap-1.5">
                    <Instagram className="w-3.5 h-3.5 text-pink-600" /> Instagram Profile
                  </label>
                  <input
                    type="url"
                    placeholder="https://instagram.com/yourhandle"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-3.5 py-2 text-xs text-charcoal focus:outline-none focus:border-[#0F4C45]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-charcoal/80 mb-1 flex items-center gap-1.5">
                    <Facebook className="w-3.5 h-3.5 text-blue-600" /> Facebook Page
                  </label>
                  <input
                    type="url"
                    placeholder="https://facebook.com/yourpage"
                    value={facebook}
                    onChange={(e) => setFacebook(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-3.5 py-2 text-xs text-charcoal focus:outline-none focus:border-[#0F4C45]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-charcoal/80 mb-1 flex items-center gap-1.5">
                    <Youtube className="w-3.5 h-3.5 text-red-600" /> YouTube Channel
                  </label>
                  <input
                    type="url"
                    placeholder="https://youtube.com/@yourchannel"
                    value={youtube}
                    onChange={(e) => setYoutube(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-3.5 py-2 text-xs text-charcoal focus:outline-none focus:border-[#0F4C45]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-charcoal/80 mb-1 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-amber-700" /> Personal Website
                  </label>
                  <input
                    type="url"
                    placeholder="https://yourwebsite.com"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-3.5 py-2 text-xs text-charcoal focus:outline-none focus:border-[#0F4C45]"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Save Action Bar */}
      <div className="bg-white rounded-2xl border border-gold/15 p-5 shadow-xs flex items-center justify-between">
        <span className="text-xs text-charcoal/60 font-medium">
          Saved storefront branding updates live for all couples on Cloche.
        </span>
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving || isUploadingLogo || isUploadingCover || isUploadingVideo}
          style={{ backgroundColor: activeTheme.primary }}
          className="hover:opacity-90 disabled:opacity-50 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 text-gold animate-spin" /> Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 text-gold" /> {saved ? "Storefront Saved!" : "Save Branding"}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
