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
  LayoutGrid,
  Globe,
  FileText,
  X,
  Award,
  ShieldCheck,
  Tag,
  Clock,
  MapPin,
  Phone,
  MessageCircle,
  Calendar,
  Layers,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  Check,
  Building,
  HelpCircle
} from "lucide-react";

function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function FacebookIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function YoutubeIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-1.96C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 1.96A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-1.96c.32-1.74.46-3.56.46-5.33s-.14-3.59-.46-5.28zM9.75 15.02V8.48l5.75 3.27-5.75 3.27z" />
    </svg>
  );
}

import { VendorCategoryConfig } from "@/lib/vendor-categories";
import { uploadImageToCloudinaryDetailed } from "@/lib/cloudinary";
import { VendorStorefront } from "@/components/VendorStorefront";
import {
  fetchAuthenticatedVendorFromDb,
  getActiveVendorIdentity,
  syncVendorProfileWithDatabase,
  showVendorToast
} from "@/lib/vendorStore";

interface CustomizeStoreSectionProps {
  categoryConfig: VendorCategoryConfig;
  vendorName: string;
  onBack?: () => void;
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

export const STORE_HIGHLIGHT_OPTIONS = [
  "Verified Partner",
  "Premium Store",
  "Bridal Specialist",
  "Rental Available",
  "Home Delivery",
  "Custom Jewellery",
  "Trusted Seller",
  "Certified Store",
];

export const ALL_COLLECTION_OPTIONS = [
  "Bridal Collection",
  "Temple Jewellery",
  "Antique Collection",
  "Reception Collection",
  "Diamond Collection",
  "Gold Collection",
  "Silver Collection",
  "Trending Collection",
  "Best Sellers",
  "New Arrivals",
];

export function CustomizeStoreSection({ categoryConfig, vendorName, onBack }: CustomizeStoreSectionProps) {
  const [vendorData, setVendorData] = useState<any>(null);

  // 1. Branding & Identity
  const [logoUrl, setLogoUrl] = useState<string>("");
  const [coverUrl, setCoverUrl] = useState<string>("");
  const [tagline, setTagline] = useState<string>("");
  const [about, setAbout] = useState<string>("");
  const [colorTheme, setColorTheme] = useState<string>("emerald");
  const [galleryLayout, setGalleryLayout] = useState<string>("grid");
  const [galleryImages, setGalleryImages] = useState<string[]>([]);

  // 2. Social Links
  const [instagram, setInstagram] = useState<string>("");
  const [facebook, setFacebook] = useState<string>("");
  const [youtube, setYoutube] = useState<string>("");
  const [website, setWebsite] = useState<string>("");

  // 3. Store Highlights
  const [storeHighlights, setStoreHighlights] = useState<string[]>([
    "Verified Partner",
    "Bridal Specialist",
    "Rental Available",
    "Home Delivery",
  ]);

  // 4. Featured Collections (with reordering)
  const [featuredCollections, setFeaturedCollections] = useState<string[]>([
    "Bridal Collection",
    "Temple Jewellery",
    "Antique Collection",
    "Diamond Collection",
  ]);

  // 5. Business Information
  const [experienceYears, setExperienceYears] = useState<string>("8");
  const [rentalAvailable, setRentalAvailable] = useState<boolean>(true);
  const [homeTrialAvailable, setHomeTrialAvailable] = useState<boolean>(true);
  const [homeDeliveryAvailable, setHomeDeliveryAvailable] = useState<boolean>(true);
  const [customJewelleryAvailable, setCustomJewelleryAvailable] = useState<boolean>(true);
  const [collectionsCount, setCollectionsCount] = useState<string>("50+ Sets");
  const [citiesServed, setCitiesServed] = useState<string>("Kochi, Trivandrum, Kozhikode, Thrissur");

  // 6. Contact Action Buttons
  const [actionButtons, setActionButtons] = useState({
    callNow: true,
    whatsapp: true,
    bookAppointment: true,
    viewCollection: true,
    getQuote: true,
    visitStore: true,
  });

  // 7. Working Hours
  const [openingTime, setOpeningTime] = useState<string>("10:00 AM");
  const [closingTime, setClosingTime] = useState<string>("08:00 PM");
  const [workingDays, setWorkingDays] = useState<string>("Monday - Saturday");
  const [weeklyOff, setWeeklyOff] = useState<string>("Sunday");
  const [holidayNotice, setHolidayNotice] = useState<string>("Open on wedding season dates by prior appointment");

  // 8. Rental Policies
  const [rentalDuration, setRentalDuration] = useState<string>("3 Days");
  const [securityDepositPolicy, setSecurityDepositPolicy] = useState<string>("Refundable deposit required");
  const [damagePolicy, setDamagePolicy] = useState<string>("Minor wear and tear allowed. Major damage will be deducted from deposit.");
  const [returnPolicy, setReturnPolicy] = useState<string>("Must be returned by noon on the 4th day");

  // Loading & Upload states
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Accordion Sections State
    const [activeStep, setActiveStep] = useState<number>(1);
  const [devicePreviewMode, setDevicePreviewMode] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [autoSaveStatus, setAutoSaveStatus] = useState<string>("✔ Saved just now");

  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({
    branding: true,
    theme: true,
    highlights: true,
    featuredCollections: false,
    businessInfo: false,
    actionButtons: false,
    workingHours: false,
    policies: false,
    about: false,
    media: false,
    social: false,
  });

  const [activePolicyTab, setActivePolicyTab] = useState<string>("rental");

  const logoInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const toggleAccordion = (key: string) => {
    setOpenAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const populateFromIdentity = (identity: any) => {
    if (!identity) return;
    setVendorData(identity);
    const sf = (identity && typeof identity.storefront === "object" && identity.storefront !== null) ? identity.storefront : {};
    const sfWh = sf.workingHours || {};
    const sfSl = sf.socialLinks || {};

    const logoVal = identity.logo || identity.logo_url || sf.logo || "";
    if (logoVal) setLogoUrl(logoVal);

    const coverVal = identity.coverImage || identity.cover_image || sf.coverImage || "";
    if (coverVal) setCoverUrl(coverVal);

    const taglineVal = identity.tagline || sf.tagline || "";
    if (taglineVal) setTagline(taglineVal);

    const aboutVal = identity.about || identity.description || sf.about || "";
    if (aboutVal) setAbout(aboutVal);

    const themeVal = identity.color_theme || identity.colorTheme || sf.theme || "emerald";
    if (themeVal) setColorTheme(themeVal);

    const layoutVal = identity.gallery_layout || identity.galleryLayout || sf.galleryLayout || "grid";
    if (layoutVal) setGalleryLayout(layoutVal);

    if (identity.instagram || sfSl.instagram) setInstagram(identity.instagram || sfSl.instagram || "");
    if (identity.facebook || sfSl.facebook) setFacebook(identity.facebook || sfSl.facebook || "");
    if (identity.youtube || sfSl.youtube) setYoutube(identity.youtube || sfSl.youtube || "");
    if (identity.website || sfSl.website) setWebsite(identity.website || sfSl.website || "");

    const rawHighlights = identity.storeHighlights || identity.store_highlights || sf.storeHighlights;
    if (Array.isArray(rawHighlights)) setStoreHighlights(rawHighlights);

    const rawFeat = identity.featuredCollections || identity.featured_collections || sf.featuredCollections;
    if (Array.isArray(rawFeat)) setFeaturedCollections(rawFeat);

    const rawGallery = Array.isArray(identity.galleryImages) && identity.galleryImages.length > 0
      ? identity.galleryImages
      : Array.isArray(identity.gallery_images) && identity.gallery_images.length > 0
      ? identity.gallery_images
      : Array.isArray(sf.gallery)
      ? sf.gallery.map((x: any) => typeof x === "string" ? x : x?.url || x?.image_url)
      : Array.isArray(identity.gallery)
      ? identity.gallery
      : null;
    if (Array.isArray(rawGallery)) {
      setGalleryImages(rawGallery.map((x: any) => (typeof x === "string" ? x : x?.url || x?.image_url || x?.image)).filter(Boolean));
    }

    if (identity.experienceYears || identity.experience_years || identity.experience) {
      setExperienceYears(identity.experienceYears || identity.experience_years || identity.experience || "");
    }
    if (identity.rentalAvailable !== undefined) setRentalAvailable(Boolean(identity.rentalAvailable));
    if (identity.homeTrialAvailable !== undefined) setHomeTrialAvailable(Boolean(identity.homeTrialAvailable));
    if (identity.homeDeliveryAvailable !== undefined) setHomeDeliveryAvailable(Boolean(identity.homeDeliveryAvailable));
    if (identity.customJewelleryAvailable !== undefined) setCustomJewelleryAvailable(Boolean(identity.customJewelleryAvailable));
    if (identity.collectionsCount || identity.collections_count) setCollectionsCount(identity.collectionsCount || identity.collections_count || "");
    if (identity.citiesServed || identity.cities_served) setCitiesServed(identity.citiesServed || identity.cities_served || "");

    if (identity.actionButtons || identity.action_buttons) {
      const act: Record<string, any> = (identity.actionButtons || identity.action_buttons || {}) as Record<string, any>;
      setActionButtons({ ...actionButtons, ...act });
    }

    const openVal = sfWh.openingTime || identity.openingTime || identity.opening_time || "";
    const closeVal = sfWh.closingTime || identity.closingTime || identity.closing_time || "";
    const daysVal = sfWh.workingDays || identity.workingDays || identity.working_days || "";
    const offVal = sfWh.weeklyOff || identity.weeklyOff || identity.weekly_off || "";
    const noticeVal = sfWh.holidayNotice || identity.holidayNotice || identity.holiday_notice || "";

    if (openVal) setOpeningTime(openVal);
    if (closeVal) setClosingTime(closeVal);
    if (daysVal) setWorkingDays(daysVal);
    if (offVal) setWeeklyOff(offVal);
    if (noticeVal) setHolidayNotice(noticeVal);

    if (identity.rentalDuration || identity.rental_duration) setRentalDuration(identity.rentalDuration || identity.rental_duration);
    if (identity.securityDepositPolicy || identity.security_deposit_policy) setSecurityDepositPolicy(identity.securityDepositPolicy || identity.security_deposit_policy);
    if (identity.damagePolicy || identity.damage_policy) setDamagePolicy(identity.damagePolicy || identity.damage_policy);
    if (identity.returnPolicy || identity.return_policy) setReturnPolicy(identity.returnPolicy || identity.return_policy);
  };

  useEffect(() => {
    const cached = getActiveVendorIdentity();
    if (cached && cached.id) {
      populateFromIdentity(cached);
    }

    fetchAuthenticatedVendorFromDb().then((identity) => {
      if (identity && identity.id) {
        populateFromIdentity(identity);
      }
    });
  }, []);

  const currentDisplayName = vendorData?.boutique_name || vendorData?.name || vendorName || "Jewellery Studio";
  const currentCategoryBadge = vendorData?.category || categoryConfig.badge || categoryConfig.name;
  const currentLocation = [vendorData?.city, vendorData?.district].filter(Boolean).join(", ") || "Kerala, India";

  const activeTheme = COLOR_THEMES.find((t) => t.id === colorTheme) || COLOR_THEMES[0];

  const initials = currentDisplayName
    .split(" ")
    .map((w: string) => w[0])
    .filter(Boolean)
    .join("")
    .slice(0, 2)
    .toUpperCase() || "JW";

  const toggleHighlight = (badge: string) => {
    setStoreHighlights((prev) =>
      prev.includes(badge) ? prev.filter((b) => b !== badge) : [...prev, badge]
    );
  };

  const toggleFeaturedCollection = (col: string) => {
    setFeaturedCollections((prev) =>
      prev.includes(col) ? prev.filter((c) => c !== col) : [...prev, col]
    );
  };

  const moveCollection = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= featuredCollections.length) return;
    const copy = [...featuredCollections];
    const [moved] = copy.splice(index, 1);
    copy.splice(targetIndex, 0, moved);
    setFeaturedCollections(copy);
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingLogo(true);
    try {
      const res = await uploadImageToCloudinaryDetailed(file, "cloche/vendors/logos");
      if (res.secure_url) {
        setLogoUrl(res.secure_url);
        showVendorToast("✓ Brand logo uploaded! Saving...", "info");

        await syncVendorProfileWithDatabase({
          id: vendorData?.id,
          logo: res.secure_url,
          logo_url: res.secure_url,
        });
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

        await syncVendorProfileWithDatabase({
          id: vendorData?.id,
          coverImage: res.secure_url,
          cover_image: res.secure_url,
        });
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
        tagline: tagline.trim(),
        about: about.trim(),
        description: about.trim(),

        instagram: instagram.trim(),
        facebook: facebook.trim(),
        youtube: youtube.trim(),
        website: website.trim(),
        
        rentalAvailable,
        rental_available: rentalAvailable,

        openingTime: openingTime,
        closingTime: closingTime,
        workingDays: workingDays,
        weeklyOff: weeklyOff,
        holidayNotice: holidayNotice,

        rentalDuration: rentalDuration,
        securityDepositPolicy: securityDepositPolicy,
        damagePolicy: damagePolicy,
        returnPolicy: returnPolicy,

        storeHighlights: storeHighlights,
        featuredCollections: featuredCollections,
      };

      const res = await syncVendorProfileWithDatabase(payload);
      if (res.success) {
        setSaved(true);
        showVendorToast("Storefront customization saved successfully.", "success");
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


      {/* PROFILE COMPLETION & 6-STEP WIZARD HEADER */}
      <div className="bg-white rounded-3xl p-6 border border-gold/15 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gold/10 pb-4">
          <div className="space-y-0.5">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#0F4C45] bg-[#FAF7F2] px-2.5 py-0.5 rounded-full border border-gold/20">
              Vendor Storefront Onboarding Wizard
            </span>
            <h2 className="text-xl font-serif font-bold text-charcoal">Customization &amp; Profile Setup</h2>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> {autoSaveStatus}
            </span>
            <button
              onClick={handleSave}
              className="px-4 py-1.5 rounded-xl bg-[#FAF7F2] hover:bg-gold/15 border border-gold/20 text-xs font-bold text-charcoal transition-colors cursor-pointer"
            >
              Continue Later
            </button>
          </div>
        </div>

        {/* Profile Completion Tracker */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-bold text-charcoal">
            <span>Profile Completion Progress</span>
            <span className="text-[#0F4C45]">82% Completed</span>
          </div>
          <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden border border-gold/15">
            <div className="h-full bg-gradient-to-r from-[#0F4C45] to-[#C8A96A] rounded-full w-[82%] transition-all duration-500" />
          </div>
          <p className="text-[11px] text-charcoal/60 font-medium">
            Remaining: • Add Gallery Photos • Add Packages • Add FAQs
          </p>
        </div>

        {/* 6-Step Navigation Wizard Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 pt-2">
          {[
            { step: 1, label: "1. Basic Info" },
            { step: 2, label: "2. Gallery & Media" },
            { step: 3, label: "3. Venue Details" },
            { step: 4, label: "4. Amenities" },
            { step: 5, label: "5. Packages" },
            { step: 6, label: "6. Preview & Publish" },
          ].map((s) => (
            <button
              key={s.step}
              type="button"
              onClick={() => setActiveStep(s.step)}
              className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all text-center cursor-pointer border ${
                activeStep === s.step
                  ? "bg-[#0F4C45] text-white border-[#0F4C45] shadow-xs"
                  : "bg-[#FAF7F2] text-charcoal/70 hover:bg-gold/15 border-gold/15"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3-DEVICE LIVE PREVIEW MODE BAR (STEP 6 MODE TOGGLES) */}
      <div className="bg-[#0B3B36] text-white p-4 rounded-3xl border border-gold/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-2 text-xs font-bold">
          <Eye className="w-4 h-4 text-[#C8A96A]" />
          <span>3-Device Live Storefront Preview:</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setDevicePreviewMode("mobile")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
              devicePreviewMode === "mobile" ? "bg-[#C8A96A] text-[#0F4C45]" : "bg-white/10 hover:bg-white/20 text-white"
            }`}
          >
            📱 Mobile
          </button>
          <button
            type="button"
            onClick={() => setDevicePreviewMode("tablet")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
              devicePreviewMode === "tablet" ? "bg-[#C8A96A] text-[#0F4C45]" : "bg-white/10 hover:bg-white/20 text-white"
            }`}
          >
            💻 Tablet
          </button>
          <button
            type="button"
            onClick={() => setDevicePreviewMode("desktop")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
              devicePreviewMode === "desktop" ? "bg-[#C8A96A] text-[#0F4C45]" : "bg-white/10 hover:bg-white/20 text-white"
            }`}
          >
            🖥 Desktop
          </button>
        </div>
      </div>


      {/* Top Header Card with Quick Publish Action */}
      <div className="bg-white rounded-2xl p-6 border border-gold/15 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-[#0F4C45]" />
            <h2 className="text-xl font-serif font-bold text-charcoal">
              Customize Storefront &amp; Branding
            </h2>
          </div>
          <p className="text-xs text-charcoal/70">
            Real-time visual editor. Colors, banner, highlights, and policies update immediately on your public storefront.
          </p>
        </div>

        <button
          type="button"
          disabled={isSaving}
          onClick={handleSave}
          className="px-6 py-2.5 rounded-xl bg-[#0F4C45] hover:bg-[#12584E] text-white text-xs font-bold shadow-sm transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 shrink-0"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Saving Settings...
            </>
          ) : saved ? (
            <>
              <CheckCircle className="w-4 h-4 text-emerald-300" /> Saved to Live Store!
            </>
          ) : (
            <>
              <Save className="w-4 h-4" /> Save Customization
            </>
          )}
        </button>
      </div>

      {/* LIVE STOREFRONT PREVIEW PANE (Exact Unified Component) */}
      <div className="rounded-3xl border border-gold/20 shadow-md overflow-hidden transition-all">
        <VendorStorefront
          previewMode={true}
          vendor={{
            id: "preview-vendor",
            name: currentDisplayName,
            business_name: currentDisplayName,
            boutique_name: currentDisplayName,
            category: categoryConfig.slug,
            categoryLabel: currentCategoryBadge,
            location: currentLocation,
            city: vendorData?.city || "Kochi",
            state: "Kerala",
            rating: 5.0,
            reviews: 12,
            image: coverUrl,
            cover_image: coverUrl,
            coverImage: coverUrl,
            logo: logoUrl,
            logo_url: logoUrl,
            tagline: tagline,
            subtitle: tagline,
            about: about,
            description: about,
            gallery: galleryImages.map((url, i) => ({ url, caption: `Showcase Photo ${i + 1}` })),
            startingPrice: "₹25,000",
            phone: "+91 98470 12345",
            whatsapp: "+91 98470 12345",
            email: "store@cloche.com",
            address: `${currentLocation}, Kerala`,
            businessInfo: {
              rentalAvailable: rentalAvailable,
            },
            socialLinks: {
              instagram: instagram.trim(),
              facebook: facebook.trim(),
              youtube: youtube.trim(),
              website: website.trim(),
            },
          }}
        />
      </div>

      {/* ACCORDION FORM CONFIGURATOR SECTIONS */}
      <div className="space-y-4">


        {/* Section 1: Brand Logo, Cover & Tagline */}
        <div className="bg-white rounded-2xl border border-gold/15 overflow-hidden shadow-xs">
          <button
            type="button"
            onClick={() => toggleAccordion("branding")}
            className="w-full p-5 text-left font-serif font-bold text-base text-charcoal flex items-center justify-between bg-[#FAF7F2]/60 hover:bg-[#FAF7F2] transition-colors"
          >
            <div className="flex items-center gap-3">
              <ImageIcon style={{ color: activeTheme.primary }} className="w-5 h-5" />
              <div>
                <span className="block">1. Logo, Cover Image & Tagline</span>
                <span className="text-xs font-sans font-normal text-charcoal/60">
                  Update primary brand visual assets
                </span>
              </div>
            </div>
            {openAccordions.branding ? <ChevronUp className="w-4 h-4 text-charcoal/40" /> : <ChevronDown className="w-4 h-4 text-charcoal/40" />}
          </button>

          {openAccordions.branding && (
            <div className="p-5 border-t border-gold/10 space-y-4 text-xs animate-in fade-in duration-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-[#FAF7F2] rounded-xl border border-gold/15 space-y-2">
                  <span className="font-bold text-charcoal block">Brand Logo</span>
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-full bg-white border border-gold/20 overflow-hidden shrink-0 flex items-center justify-center">
                      {logoUrl ? <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" /> : initials}
                    </div>
                    <button
                      type="button"
                      onClick={() => logoInputRef.current?.click()}
                      className="px-3.5 py-2 bg-[#0F4C45] text-white font-bold rounded-xl text-xs hover:bg-[#072B27]"
                    >
                      Upload Logo
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-[#FAF7F2] rounded-xl border border-gold/15 space-y-2">
                  <span className="font-bold text-charcoal block">Store Cover Photo</span>
                  <div className="flex items-center gap-3">
                    <div className="w-20 h-14 rounded-xl bg-white border border-gold/20 overflow-hidden shrink-0 flex items-center justify-center">
                      {coverUrl ? <img src={coverUrl} alt="Cover" className="w-full h-full object-cover" /> : <ImageIcon className="w-5 h-5 text-gray-400" />}
                    </div>
                    <button
                      type="button"
                      onClick={() => coverInputRef.current?.click()}
                      className="px-3.5 py-2 bg-[#0F4C45] text-white font-bold rounded-xl text-xs hover:bg-[#072B27]"
                    >
                      Upload Cover
                    </button>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-charcoal mb-1">Store Tagline</label>
                  <input
                    type="text"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    placeholder="e.g. Royal Bridal Jewels & Heritage Temple Ornaments"
                    className="w-full p-2.5 bg-[#FAF7F2] border border-gold/15 rounded-xl outline-none"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Section 2: Business Information */}
        <div className="bg-white rounded-2xl border border-gold/15 overflow-hidden shadow-xs">
          <button
            type="button"
            onClick={() => toggleAccordion("businessInfo")}
            className="w-full p-5 text-left font-serif font-bold text-base text-charcoal flex items-center justify-between bg-[#FAF7F2]/60 hover:bg-[#FAF7F2] transition-colors"
          >
            <div className="flex items-center gap-3">
              <Building style={{ color: activeTheme.primary }} className="w-5 h-5" />
              <div>
                <span className="block">2. Business Information</span>
                <span className="text-xs font-sans font-normal text-charcoal/60">
                  Experience, services availability & coverage areas
                </span>
              </div>
            </div>
            {openAccordions.businessInfo ? <ChevronUp className="w-4 h-4 text-charcoal/40" /> : <ChevronDown className="w-4 h-4 text-charcoal/40" />}
          </button>

          {openAccordions.businessInfo && (
            <div className="p-5 border-t border-gold/10 space-y-4 text-xs animate-in fade-in duration-200">
              {/* Service Flags Toggles */}
              <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <label className="p-3 bg-[#FAF7F2] rounded-xl border border-gold/15 flex items-center justify-between cursor-pointer">
                  <span className="font-bold text-charcoal">Rental Available</span>
                  <input
                    type="checkbox"
                    checked={rentalAvailable}
                    onChange={(e) => setRentalAvailable(e.target.checked)}
                    className="rounded accent-[#0F4C45] w-4 h-4"
                  />
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Section 3: Business Hours */}
        <div className="bg-white rounded-2xl border border-gold/15 overflow-hidden shadow-xs">
          <button
            type="button"
            onClick={() => toggleAccordion("workingHours")}
            className="w-full p-5 text-left font-serif font-bold text-base text-charcoal flex items-center justify-between bg-[#FAF7F2]/60 hover:bg-[#FAF7F2] transition-colors"
          >
            <div className="flex items-center gap-3">
              <Clock style={{ color: activeTheme.primary }} className="w-5 h-5" />
              <div>
                <span className="block">3. Business Hours</span>
                <span className="text-xs font-sans font-normal text-charcoal/60">
                  Set your standard operating hours
                </span>
              </div>
            </div>
            {openAccordions.workingHours ? <ChevronUp className="w-4 h-4 text-charcoal/40" /> : <ChevronDown className="w-4 h-4 text-charcoal/40" />}
          </button>
          {openAccordions.workingHours && (
            <div className="p-5 border-t border-gold/10 space-y-4 text-xs animate-in fade-in duration-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-charcoal mb-1">Opening Time</label>
                  <input type="time" value={openingTime} onChange={(e) => setOpeningTime(e.target.value)} className="w-full p-2.5 bg-[#FAF7F2] border border-gold/15 rounded-xl outline-none" />
                </div>
                <div>
                  <label className="block font-bold text-charcoal mb-1">Closing Time</label>
                  <input type="time" value={closingTime} onChange={(e) => setClosingTime(e.target.value)} className="w-full p-2.5 bg-[#FAF7F2] border border-gold/15 rounded-xl outline-none" />
                </div>
                <div>
                  <label className="block font-bold text-charcoal mb-1">Working Days</label>
                  <input type="text" value={workingDays} onChange={(e) => setWorkingDays(e.target.value)} placeholder="e.g. Monday - Saturday" className="w-full p-2.5 bg-[#FAF7F2] border border-gold/15 rounded-xl outline-none" />
                </div>
                <div>
                  <label className="block font-bold text-charcoal mb-1">Weekly Off</label>
                  <input type="text" value={weeklyOff} onChange={(e) => setWeeklyOff(e.target.value)} placeholder="e.g. Sunday" className="w-full p-2.5 bg-[#FAF7F2] border border-gold/15 rounded-xl outline-none" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-bold text-charcoal mb-1">Holiday Notice</label>
                  <input type="text" value={holidayNotice} onChange={(e) => setHolidayNotice(e.target.value)} placeholder="e.g. Open on wedding season dates by prior appointment" className="w-full p-2.5 bg-[#FAF7F2] border border-gold/15 rounded-xl outline-none" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Section 4: Rental Policies */}
        <div className="bg-white rounded-2xl border border-gold/15 overflow-hidden shadow-xs">
          <button
            type="button"
            onClick={() => toggleAccordion("policies")}
            className="w-full p-5 text-left font-serif font-bold text-base text-charcoal flex items-center justify-between bg-[#FAF7F2]/60 hover:bg-[#FAF7F2] transition-colors"
          >
            <div className="flex items-center gap-3">
              <ShieldCheck style={{ color: activeTheme.primary }} className="w-5 h-5" />
              <div>
                <span className="block">4. Rental Policies</span>
                <span className="text-xs font-sans font-normal text-charcoal/60">
                  Duration, deposits, damage & return policies
                </span>
              </div>
            </div>
            {openAccordions.policies ? <ChevronUp className="w-4 h-4 text-charcoal/40" /> : <ChevronDown className="w-4 h-4 text-charcoal/40" />}
          </button>
          {openAccordions.policies && (
            <div className="p-5 border-t border-gold/10 space-y-4 text-xs animate-in fade-in duration-200">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block font-bold text-charcoal mb-1">Rental Duration</label>
                  <input type="text" value={rentalDuration} onChange={(e) => setRentalDuration(e.target.value)} placeholder="e.g. 3 Days" className="w-full p-2.5 bg-[#FAF7F2] border border-gold/15 rounded-xl outline-none" />
                </div>
                <div>
                  <label className="block font-bold text-charcoal mb-1">Security Deposit</label>
                  <input type="text" value={securityDepositPolicy} onChange={(e) => setSecurityDepositPolicy(e.target.value)} placeholder="e.g. Refundable deposit required" className="w-full p-2.5 bg-[#FAF7F2] border border-gold/15 rounded-xl outline-none" />
                </div>
                <div>
                  <label className="block font-bold text-charcoal mb-1">Damage Policy</label>
                  <textarea rows={2} value={damagePolicy} onChange={(e) => setDamagePolicy(e.target.value)} placeholder="e.g. Minor wear and tear allowed. Major damage deducted from deposit." className="w-full p-2.5 bg-[#FAF7F2] border border-gold/15 rounded-xl outline-none" />
                </div>
                <div>
                  <label className="block font-bold text-charcoal mb-1">Return Policy</label>
                  <textarea rows={2} value={returnPolicy} onChange={(e) => setReturnPolicy(e.target.value)} placeholder="e.g. Must be returned by noon on the 4th day" className="w-full p-2.5 bg-[#FAF7F2] border border-gold/15 rounded-xl outline-none" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Section 5: Store Highlights */}
        <div className="bg-white rounded-2xl border border-gold/15 overflow-hidden shadow-xs">
          <button
            type="button"
            onClick={() => toggleAccordion("highlights")}
            className="w-full p-5 text-left font-serif font-bold text-base text-charcoal flex items-center justify-between bg-[#FAF7F2]/60 hover:bg-[#FAF7F2] transition-colors"
          >
            <div className="flex items-center gap-3">
              <Sparkles style={{ color: activeTheme.primary }} className="w-5 h-5" />
              <div>
                <span className="block">5. Store Highlights</span>
                <span className="text-xs font-sans font-normal text-charcoal/60">
                  Select badges to display on your profile
                </span>
              </div>
            </div>
            {openAccordions.highlights ? <ChevronUp className="w-4 h-4 text-charcoal/40" /> : <ChevronDown className="w-4 h-4 text-charcoal/40" />}
          </button>
          {openAccordions.highlights && (
            <div className="p-5 border-t border-gold/10 text-xs animate-in fade-in duration-200">
              <div className="flex flex-wrap gap-2">
                {STORE_HIGHLIGHT_OPTIONS.map((badge) => {
                  const isActive = storeHighlights.includes(badge);
                  return (
                    <button
                      key={badge}
                      type="button"
                      onClick={() => toggleHighlight(badge)}
                      className={`px-3 py-1.5 rounded-full border transition-all flex items-center gap-1 ${
                        isActive
                          ? "border-[#0F4C45] bg-[#0F4C45]/5 text-[#0F4C45] font-bold shadow-sm"
                          : "border-gold/20 bg-white text-charcoal/60 hover:border-gold/50"
                      }`}
                    >
                      {isActive && <CheckCircle className="w-3 h-3" />}
                      {badge}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Section 6: Featured Collections */}
        <div className="bg-white rounded-2xl border border-gold/15 overflow-hidden shadow-xs">
          <button
            type="button"
            onClick={() => toggleAccordion("featuredCollections")}
            className="w-full p-5 text-left font-serif font-bold text-base text-charcoal flex items-center justify-between bg-[#FAF7F2]/60 hover:bg-[#FAF7F2] transition-colors"
          >
            <div className="flex items-center gap-3">
              <Tag style={{ color: activeTheme.primary }} className="w-5 h-5" />
              <div>
                <span className="block">6. Featured Collections</span>
                <span className="text-xs font-sans font-normal text-charcoal/60">
                  Manage your showcased categories
                </span>
              </div>
            </div>
            {openAccordions.featuredCollections ? <ChevronUp className="w-4 h-4 text-charcoal/40" /> : <ChevronDown className="w-4 h-4 text-charcoal/40" />}
          </button>
          {openAccordions.featuredCollections && (
            <div className="p-5 border-t border-gold/10 space-y-4 text-xs animate-in fade-in duration-200">
              <div className="space-y-2">
                <span className="font-bold text-charcoal block">Select Collections</span>
                <div className="flex flex-wrap gap-2">
                  {ALL_COLLECTION_OPTIONS.map((col) => {
                    const isActive = featuredCollections.includes(col);
                    return (
                      <button
                        key={col}
                        type="button"
                        onClick={() => toggleFeaturedCollection(col)}
                        className={`px-3 py-1.5 rounded-full border transition-all ${
                          isActive
                            ? "border-[#0F4C45] bg-[#0F4C45] text-white font-bold shadow-sm"
                            : "border-gold/20 bg-white text-charcoal/60 hover:border-gold/50"
                        }`}
                      >
                        {col}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
