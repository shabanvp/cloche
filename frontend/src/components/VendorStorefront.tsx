"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Phone,
  MessageCircle,
  Calendar,
  Layers,
  FileText,
  Building,
  Clock,
  MapPin,
  Tag,
  Star,
  Heart,
  Share2,
  ExternalLink,
  ChevronRight,
  Check,
  CheckCircle2,
  Award,
  Image as ImageIcon,
  Play,
  Mail,
  Eye,
  X,
  Send,
  Loader2,
  Sparkle
} from "lucide-react";
import { COLOR_THEMES, ColorThemeOption } from "@/components/vendor/sections/CustomizeStoreSection";

export interface VendorStorefrontProps {
  vendor: any;
  storefront?: any;
  previewMode?: boolean;
}

export function VendorStorefront({ vendor, storefront: propStorefront, previewMode = false }: VendorStorefrontProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeModal, setActiveModal] = useState<null | "quote" | "appointment" | "share">(null);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  // Quote form state
  const [quoteName, setQuoteName] = useState("");
  const [quotePhone, setQuotePhone] = useState("");
  const [quoteDate, setQuoteDate] = useState("");
  const [quoteNotes, setQuoteNotes] = useState("");
  const [quoteSubmitted, setQuoteSubmitted] = useState(false);
  const [quoteLoading, setQuoteLoading] = useState(false);

  // Merge storefront data from vendor prop, storefront config, or direct properties
  const sf = useMemo(() => {
    const raw = propStorefront || vendor?.storefront || vendor?.storefront_config || {};
    return typeof raw === "object" ? raw : {};
  }, [propStorefront, vendor]);

  // Color Theme Resolution
  const themeId = sf.theme || vendor?.colorTheme || vendor?.color_theme || "emerald";
  const activeTheme: ColorThemeOption = useMemo(() => {
    const matched = COLOR_THEMES.find((t) => t.id === themeId);
    if (matched) {
      if (sf.brandColors) {
        return {
          ...matched,
          ...sf.brandColors,
        };
      }
      return matched;
    }
    return COLOR_THEMES[0];
  }, [themeId, sf.brandColors]);

  // Vendor Visuals
  const rawCover =
    vendor?.cover_image ||
    vendor?.coverImage ||
    vendor?.image ||
    sf.coverImage ||
    "";
  const coverUrl = rawCover && !rawCover.includes("images.unsplash.com") ? rawCover : (sf.coverImage || "");

  const logoUrl =
    vendor?.logo_url ||
    vendor?.logo ||
    sf.logo ||
    "";

  const displayName =
    vendor?.business_name ||
    vendor?.boutique_name ||
    vendor?.name ||
    sf.businessName ||
    "Verified Wedding Partner";

  const initials = useMemo(() => {
    return displayName
      .split(" ")
      .map((w: string) => w[0])
      .filter(Boolean)
      .join("")
      .slice(0, 2)
      .toUpperCase() || "CL";
  }, [displayName]);

  const tagline = vendor?.tagline || vendor?.subtitle || sf.tagline || "";
  const categoryLabel = vendor?.categoryLabel || vendor?.category || "Wedding Partner";
  const location =
    vendor?.address ||
    vendor?.location ||
    [vendor?.city, vendor?.state].filter(Boolean).join(", ") ||
    "";

  const about = vendor?.about || vendor?.description || sf.about || "";

  // Store Highlights (Badges)
  const storeHighlights: string[] = useMemo(() => {
    if (Array.isArray(sf.storeHighlights) && sf.storeHighlights.length > 0) return sf.storeHighlights;
    if (Array.isArray(vendor?.storeHighlights) && vendor.storeHighlights.length > 0) return vendor.storeHighlights;
    if (Array.isArray(vendor?.store_highlights) && vendor.store_highlights.length > 0) return vendor.store_highlights;
    if (Array.isArray(vendor?.venueHighlights) && vendor.venueHighlights.length > 0) return vendor.venueHighlights;
    if (Array.isArray(vendor?.mehendiHighlights) && vendor.mehendiHighlights.length > 0) return vendor.mehendiHighlights;
    if (Array.isArray(vendor?.decorHighlights) && vendor.decorHighlights.length > 0) return vendor.decorHighlights;
    return [];
  }, [sf.storeHighlights, vendor]);

  // Featured Collections
  const featuredCollections: string[] = useMemo(() => {
    if (Array.isArray(sf.featuredCollections) && sf.featuredCollections.length > 0) return sf.featuredCollections;
    if (Array.isArray(vendor?.featuredCollections) && vendor.featuredCollections.length > 0) return vendor.featuredCollections;
    if (Array.isArray(vendor?.featured_collections) && vendor.featured_collections.length > 0) return vendor.featured_collections;
    if (Array.isArray(vendor?.featuredHalls) && vendor.featuredHalls.length > 0) return vendor.featuredHalls;
    if (Array.isArray(vendor?.featuredPackages) && vendor.featuredPackages.length > 0) return vendor.featuredPackages;
    if (Array.isArray(vendor?.featuredThemes) && vendor.featuredThemes.length > 0) return vendor.featuredThemes;
    return [];
  }, [sf.featuredCollections, vendor]);

  // Action Buttons
  const actionButtons = useMemo(() => {
    const rawButtons = sf.actionButtons || vendor?.actionButtons || vendor?.action_buttons || {};
    return {
      callNow: rawButtons.callNow ?? true,
      whatsapp: rawButtons.whatsapp ?? true,
      bookAppointment: rawButtons.bookAppointment ?? true,
      viewCollection: rawButtons.viewCollection ?? true,
      getQuote: rawButtons.getQuote ?? true,
      visitStore: rawButtons.visitStore ?? true,
    };
  }, [sf.actionButtons, vendor]);

  // Business Info
  const businessInfo = useMemo(() => {
    const b = sf.businessInfo || {};
    return {
      experienceYears: b.experienceYears || vendor?.experienceYears || vendor?.experience_years || vendor?.yearsInBusiness || "",
      rentalAvailable: b.rentalAvailable ?? vendor?.rentalAvailable ?? vendor?.rental_available ?? false,
      homeDeliveryAvailable: b.homeDeliveryAvailable ?? vendor?.homeDeliveryAvailable ?? vendor?.home_delivery_available ?? false,
      homeTrialAvailable: b.homeTrialAvailable ?? vendor?.homeTrialAvailable ?? vendor?.home_trial_available ?? false,
      customJewelleryAvailable: b.customJewelleryAvailable ?? vendor?.customJewelleryAvailable ?? vendor?.custom_jewellery_available ?? false,
      collectionsCount: b.collectionsCount || vendor?.collectionsCount || vendor?.collections_count || "",
      guestCapacity: b.guestCapacity || vendor?.guestCapacity || vendor?.guest_capacity || "",
      parkingCapacity: b.parkingCapacity || vendor?.parkingCapacity || vendor?.parking_capacity || "",
    };
  }, [sf.businessInfo, vendor]);

  // Working Hours (Reads from sf.workingHours, vendor.workingHours, vendor.working_hours, or categoryDetail)
  const workingHours = useMemo(() => {
    const w = (typeof sf.workingHours === "object" && sf.workingHours !== null ? sf.workingHours : {}) as Record<string, any>;
    const vW = (typeof vendor?.workingHours === "object" && vendor.workingHours !== null ? vendor.workingHours : {}) as Record<string, any>;

    const days = w.workingDays || vW.workingDays || vendor?.working_days || vendor?.workingDays || "";
    const open = w.openingTime || vW.openingTime || vendor?.opening_time || vendor?.openingTime || "";
    const close = w.closingTime || vW.closingTime || vendor?.closing_time || vendor?.closingTime || "";
    const off = w.weeklyOff || vW.weeklyOff || vendor?.weekly_off || vendor?.weeklyOff || vendor?.weeklyHolidays || vendor?.weekly_holidays || "";
    const notice = w.holidayNotice || vW.holidayNotice || vendor?.holiday_notice || vendor?.holidayNotice || vendor?.publicHolidayAvailability || vendor?.public_holiday_availability || "";

    const rawStr = typeof vendor?.workingHours === "string" ? vendor.workingHours : typeof vendor?.working_hours === "string" ? vendor.working_hours : (w.rawString || vW.rawString || "");

    return {
      workingDays: days,
      openingTime: open,
      closingTime: close,
      weeklyOff: off,
      holidayNotice: notice,
      rawString: rawStr,
    };
  }, [sf.workingHours, vendor]);

  // Gallery href resolution to avoid 404
  const galleryHref = useMemo(() => {
    const cat = (vendor?.categorySlug || vendor?.category || "").toLowerCase();
    const idVal = vendor?.id || vendor?.slug || "preview";
    if (cat.includes("venue")) return `/venues/${idVal}/gallery`;
    if (cat.includes("photo")) return `/photographers/${idVal}/gallery`;
    if (cat.includes("makeup")) return `/makeup-artists/${idVal}/gallery`;
    if (cat.includes("decor") || cat.includes("planner")) return `/decor-planning/${idVal}/gallery`;
    if (cat.includes("mehendi") || cat.includes("mehndi")) return `/mehendi-artists/${idVal}/gallery`;
    if (cat.includes("bridal")) return `/bridal-wear/${idVal}/gallery`;
    if (cat.includes("groom")) return `/groom-wear/${idVal}/gallery`;
    if (cat.includes("wedding-story") || cat.includes("wedding-studio")) return `/wedding-story/${idVal}/gallery`;
    if (cat.includes("jewel")) return `/jewellery/${idVal}/gallery`;
    if (cat.includes("invite") || cat.includes("card")) return `/invitations/${idVal}/gallery`;
    if (cat.includes("cater")) return `/catering/${idVal}/gallery`;
    return `/vendors/${cat || "general"}/${idVal}/gallery`;
  }, [vendor]);

  // Automatically record view event for trending analytics engine
  React.useEffect(() => {
    if (vendor?.id && !previewMode) {
      fetch("/api/v1/public/analytics/view", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vendor_id: String(vendor.id) }),
      }).catch(() => null);
    }
  }, [vendor?.id, previewMode]);

  // Gallery Layout & Photos (ONLY real photos uploaded by vendor, ZERO demo / unsplash images)
  const galleryLayout = sf.galleryLayout || vendor?.galleryLayout || vendor?.gallery_layout || "grid";
  const galleryPhotos: Array<{ url: string; caption?: string }> = useMemo(() => {
    const list: Array<{ url: string; caption?: string }> = [];

    const isUploadedPhoto = (url: any): boolean => {
      if (!url || typeof url !== "string") return false;
      const clean = url.trim();
      if (!clean) return false;
      if (clean.includes("images.unsplash.com")) return false;
      if (clean.includes("via.placeholder.com") || clean.includes("placeholder")) return false;
      return true;
    };

    // 1. Storefront gallery items (direct customizer upload)
    if (Array.isArray(sf.gallery)) {
      for (const item of sf.gallery) {
        const url = typeof item === "string" ? item : item?.url || item?.image_url || item?.image;
        const caption = typeof item === "object" ? item?.caption || item?.title : undefined;
        if (isUploadedPhoto(url) && !list.some((p) => p.url === url)) {
          list.push({ url, caption: caption || `Showcase Photo ${list.length + 1}` });
        }
      }
    }

    // 2. Vendor galleryImages array
    if (Array.isArray(vendor?.galleryImages)) {
      for (const item of vendor.galleryImages) {
        const url = typeof item === "string" ? item : item?.url || item?.image_url;
        const caption = typeof item === "object" ? item?.caption || item?.title : undefined;
        if (isUploadedPhoto(url) && !list.some((p) => p.url === url)) {
          list.push({ url, caption: caption || `Showcase Photo ${list.length + 1}` });
        }
      }
    }

    // 3. Vendor gallery_images array (snake_case database field)
    if (Array.isArray(vendor?.gallery_images)) {
      for (const item of vendor.gallery_images) {
        const url = typeof item === "string" ? item : item?.url || item?.image_url;
        const caption = typeof item === "object" ? item?.caption || item?.title : undefined;
        if (isUploadedPhoto(url) && !list.some((p) => p.url === url)) {
          list.push({ url, caption: caption || `Showcase Photo ${list.length + 1}` });
        }
      }
    }

    // 4. Vendor database highlights (table vendor_gallery)
    if (Array.isArray(vendor?.highlights)) {
      for (const h of vendor.highlights) {
        const url = h?.image || h?.url || h?.image_url;
        if (isUploadedPhoto(url) && !list.some((p) => p.url === url)) {
          list.push({ url, caption: h?.name || h?.caption || h?.title || `Showcase Photo ${list.length + 1}` });
        }
      }
    }

    // 5. Hall images (for wedding venues)
    if (Array.isArray(vendor?.hallImages)) {
      for (const h of vendor.hallImages) {
        const url = typeof h === "string" ? h : h?.url || h?.image;
        if (isUploadedPhoto(url) && !list.some((p) => p.url === url)) {
          list.push({ url, caption: typeof h === "object" ? h?.caption || h?.title : `Hall Photo ${list.length + 1}` });
        }
      }
    }

    // 6. Vendor portfolio items
    if (Array.isArray(vendor?.portfolio)) {
      for (const p of vendor.portfolio) {
        const url = typeof p === "string" ? p : p?.url || p?.image || p?.image_url;
        if (isUploadedPhoto(url) && !list.some((item) => item.url === url)) {
          list.push({ url, caption: typeof p === "object" ? p?.caption || p?.title : `Portfolio Photo ${list.length + 1}` });
        }
      }
    }

    return list;
  }, [sf.gallery, vendor]);

  // Contact Info
  const phone = sf.contactInfo?.phone || vendor?.phone || "";
  const whatsapp = sf.contactInfo?.whatsapp || vendor?.whatsapp || phone;
  const email = sf.contactInfo?.email || vendor?.email || "";
  const address = sf.contactInfo?.address || vendor?.address || location;

  // Social Links
  const instagram = sf.socialLinks?.instagram || vendor?.instagram || vendor?.socialLinks?.instagram || "";
  const facebook = sf.socialLinks?.facebook || vendor?.facebook || vendor?.socialLinks?.facebook || "";
  const youtube = sf.socialLinks?.youtube || vendor?.youtube || vendor?.socialLinks?.youtube || "";
  const website = sf.socialLinks?.website || vendor?.website || vendor?.socialLinks?.website || "";

  // Ratings
  const rating = Number(vendor?.rating || 0).toFixed(1);
  const reviewsCount = Number(vendor?.reviews || vendor?.userReviews?.length || 0);

  // Handlers
  const handleShare = () => {
    if (previewMode) return;
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (navigator.share) {
      navigator.share({
        title: displayName,
        text: `Explore ${displayName} on Cloche Luxury Wedding Platform`,
        url,
      });
    } else if (url) {
      navigator.clipboard.writeText(url);
      alert("Storefront link copied to clipboard! 📋");
    }
  };

  const handleSendQuote = (e: React.FormEvent) => {
    e.preventDefault();
    setQuoteLoading(true);
    setTimeout(() => {
      setQuoteLoading(false);
    }, 800);
  };

  const [isFullPreview, setIsFullPreview] = useState(false);

  // Compact Live Storefront Preview (used inside Customize Storefront pages)
  if (previewMode && !isFullPreview) {
    return (
      <div className="w-full bg-[#FAF7F2] text-charcoal font-sans rounded-3xl border border-gold/25 shadow-md overflow-hidden transition-all mb-6">
        {/* PREVIEW TOP BAR */}
        <div className="bg-[#0F4C45] text-white px-4 py-2.5 text-xs font-bold flex items-center justify-between border-b border-gold/20">
          <span className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#C8A96A]" /> Live Storefront Preview (Updates in real time)
          </span>
          <div className="flex items-center gap-3">
            <span
              style={{ color: activeTheme.accent }}
              className="text-[10px] uppercase font-extrabold tracking-wider bg-black/40 px-2.5 py-0.5 rounded-full border border-white/10"
            >
              {activeTheme.label} Theme
            </span>
            <button
              onClick={() => setIsFullPreview(true)}
              className="text-[11px] bg-white/15 hover:bg-white/25 text-white px-3 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer font-semibold border border-white/20"
            >
              <Eye className="w-3.5 h-3.5 text-[#C8A96A]" /> Expand Full View
            </button>
          </div>
        </div>

        {/* COMPACT HERO BANNER */}
        <div className="relative overflow-hidden bg-charcoal">
          <div className="relative h-[200px] sm:h-[240px] w-full overflow-hidden">
            <img src={coverUrl} alt={displayName} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          </div>

          {/* Profile Card Overlay */}
          <div className="absolute bottom-4 left-4 right-4 flex items-end gap-4 z-10">
            {/* Logo Badge */}
            <div
              style={{ backgroundColor: activeTheme.primary }}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 border-white overflow-hidden shadow-xl shrink-0 flex items-center justify-center text-white"
            >
              {logoUrl ? (
                <img src={logoUrl} alt={displayName} className="w-full h-full object-cover" />
              ) : (
                <span className="font-serif text-xl sm:text-2xl font-bold tracking-wider">{initials}</span>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1 min-w-0 text-white drop-shadow-md space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-white leading-tight">
                  {displayName}
                </h3>
                <span className="inline-flex items-center gap-1 bg-white/95 text-[#0F4C45] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow-xs">
                  <ShieldCheck className="w-3 h-3 text-[#0F4C45]" /> Verified Partner
                </span>
              </div>

              {tagline ? (
                <p style={{ color: activeTheme.accent }} className="text-xs font-semibold italic truncate">
                  "{tagline}"
                </p>
              ) : (
                <p className="text-xs text-white/90 font-medium truncate">
                  {categoryLabel}{location ? ` • ${location}` : ""}
                </p>
              )}

              {/* Store Highlights Badges */}
              {storeHighlights.length > 0 && (
                <div className="flex flex-wrap items-center gap-1 pt-1">
                  {storeHighlights.slice(0, 4).map((badge) => (
                    <span
                      key={badge}
                      style={{ borderColor: activeTheme.accent }}
                      className="bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full border shadow-2xs flex items-center gap-1"
                    >
                      <Sparkles className="w-2.5 h-2.5 text-[#C8A96A]" /> {badge}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* COMPACT ACTION BUTTONS BAR */}
        <div className="p-4 bg-white border-t border-gold/15 space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {actionButtons.callNow && (
              <div
                style={{ backgroundColor: activeTheme.primary }}
                className="w-full px-3 py-2.5 rounded-xl text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs text-center"
              >
                <Phone className="w-3.5 h-3.5 shrink-0" /> <span>Call Now</span>
              </div>
            )}
            {actionButtons.whatsapp && (
              <div
                style={{ backgroundColor: activeTheme.secondary }}
                className="w-full px-3 py-2.5 rounded-xl text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs text-center"
              >
                <MessageCircle className="w-3.5 h-3.5 shrink-0" /> <span>WhatsApp Us</span>
              </div>
            )}
            {actionButtons.getQuote && (
              <div
                style={{ backgroundColor: activeTheme.accent, color: activeTheme.secondary }}
                className="w-full px-3 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs text-center"
              >
                <FileText className="w-3.5 h-3.5 shrink-0" /> <span>Get Custom Quote</span>
              </div>
            )}
            {actionButtons.visitStore && (
              <div className="w-full px-3 py-2.5 rounded-xl bg-[#FAF7F2] border border-gold/25 text-charcoal text-xs font-bold flex items-center justify-center gap-1.5 text-center">
                <Building className="w-3.5 h-3.5 text-[#0F4C45] shrink-0" /> <span>Get Directions</span>
              </div>
            )}
          </div>

          {/* BUSINESS HOURS LIVE PREVIEW CHIP */}
          {(workingHours.workingDays || workingHours.openingTime || workingHours.closingTime || workingHours.weeklyOff || workingHours.rawString) && (
            <div className="flex items-center justify-between text-[11px] bg-[#FAF7F2] border border-gold/15 p-2.5 rounded-xl text-charcoal/80 font-medium">
              <span className="flex items-center gap-1.5 font-semibold text-[#0F4C45]">
                <Clock className="w-3.5 h-3.5 text-[#0F4C45]" /> Operating Schedule:
              </span>
              <span className="font-bold text-charcoal">
                {workingHours.workingDays ? `${workingHours.workingDays}: ` : ""}
                {[workingHours.openingTime, workingHours.closingTime].filter(Boolean).join(" - ") || workingHours.rawString || "Open All Days"}
                {workingHours.weeklyOff ? ` (Off: ${workingHours.weeklyOff})` : ""}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#FBF8F1] text-charcoal font-sans antialiased min-h-screen pb-24">
      
      {/* PREVIEW BANNER (IF IN DASHBOARD FULL PREVIEW MODE) */}
      {previewMode && (
        <div className="bg-[#0B3B36] text-white px-4 py-2 text-xs font-bold flex items-center justify-between border-b border-gold/20">
          <span className="flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-[#C8A96A]" /> Full Storefront View (Expanded)
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsFullPreview(false)}
              className="text-[10px] uppercase font-bold bg-white/20 hover:bg-white/30 text-white px-2.5 py-0.5 rounded-full border border-white/20 transition-all cursor-pointer"
            >
              Switch to Compact Preview
            </button>
            <span
              style={{ color: activeTheme.accent }}
              className="text-[10px] uppercase tracking-wider bg-black/40 px-2.5 py-0.5 rounded-full border border-white/10"
            >
              {activeTheme.label} Theme
            </span>
          </div>
        </div>
      )}

      {/* ── 1. LUXURY STOREFRONT HERO HEADER ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        <div className="relative rounded-[28px] sm:rounded-[36px] overflow-hidden shadow-xl border border-gold/20 bg-charcoal">
          
          {/* Cover Photo */}
          <div className="relative h-[280px] sm:h-[400px] lg:h-[460px] w-full overflow-hidden">
            <img src={coverUrl} alt={displayName} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          </div>

          {/* Top Quick Actions Bar */}
          <div className="absolute top-4 sm:top-6 left-4 sm:left-6 right-4 sm:right-6 flex items-center justify-between z-10">
            <Link
              href={previewMode ? "#" : "/boutiques"}
              className="bg-black/50 hover:bg-black/70 backdrop-blur-md text-white text-xs font-bold px-3.5 py-2 rounded-full border border-white/20 flex items-center gap-1.5 transition-all"
            >
              <span>← Explore Boutiques</span>
            </Link>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="bg-black/50 hover:bg-black/70 backdrop-blur-md text-white p-2.5 rounded-full border border-white/20 transition-all cursor-pointer"
                title="Share Storefront"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className="bg-black/50 hover:bg-black/70 backdrop-blur-md text-white p-2.5 rounded-full border border-white/20 transition-all cursor-pointer"
                title="Save to Wishlist"
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? "text-red-500 fill-red-500" : ""}`} />
              </button>
            </div>
          </div>

          {/* Hero Profile Details Card */}
          <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 flex flex-col sm:flex-row items-start sm:items-end gap-4 sm:gap-6 z-10">
            
            {/* Logo Badge */}
            <div
              style={{ backgroundColor: activeTheme.primary }}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl sm:rounded-3xl border-2 sm:border-4 border-white overflow-hidden shadow-2xl shrink-0 flex items-center justify-center text-white relative"
            >
              {logoUrl ? (
                <img src={logoUrl} alt={displayName} className="w-full h-full object-cover" />
              ) : (
                <span className="font-serif text-2xl sm:text-3xl font-bold tracking-wider">{initials}</span>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1 min-w-0 text-white drop-shadow-md space-y-1.5">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl sm:text-4xl font-serif font-bold text-white leading-tight">
                  {displayName}
                </h1>
                <span className="inline-flex items-center gap-1 bg-white/95 backdrop-blur-md text-[#0F4C45] text-[11px] font-extrabold px-3 py-0.5 rounded-full shadow-xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#0F4C45]" /> Verified Partner
                </span>
                {reviewsCount > 0 && (
                  <span className="inline-flex items-center gap-1 bg-amber-400/90 text-charcoal text-[11px] font-extrabold px-2.5 py-0.5 rounded-full shadow-xs">
                    <Star className="w-3 h-3 fill-current text-charcoal" /> {rating} ({reviewsCount})
                  </span>
                )}
              </div>

              {tagline ? (
                <p style={{ color: activeTheme.accent }} className="text-xs sm:text-sm font-semibold italic">
                  "{tagline}"
                </p>
              ) : (
                <p className="text-xs sm:text-sm text-white/90 font-medium">
                  {categoryLabel}{location ? ` • ${location}` : ""}
                </p>
              )}

              {/* Dynamic Store Highlights Badges */}
              {storeHighlights.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {storeHighlights.map((badge) => (
                    <span
                      key={badge}
                      style={{ borderColor: activeTheme.accent }}
                      className="bg-black/60 backdrop-blur-md text-white text-[10px] sm:text-[11px] font-bold px-3 py-0.5 rounded-full border shadow-2xs flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3 text-[#C8A96A]" /> {badge}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Price Tag if available */}
            {vendor?.startingPrice && (
              <div className="bg-white/95 backdrop-blur-md rounded-2xl p-3 sm:p-4 text-charcoal shadow-lg shrink-0 border border-gold/20 text-right hidden lg:block">
                <span className="text-[10px] uppercase font-bold text-charcoal/60 block">Starting Package</span>
                <span style={{ color: activeTheme.primary }} className="font-serif text-xl font-bold block">
                  {vendor.startingPrice}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── 2. MAIN STOREFRONT CONTENT LAYOUT ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 sm:mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        
        {/* LEFT COLUMN (8 COLS): Content, Gallery, Packages, Reviews, Policies */}
        <div className="lg:col-span-8 space-y-6 sm:space-y-8">
          
          {/* A. STOREFRONT CONTACT & INTERACTIVE ACTION BUTTONS */}
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-gold/15 shadow-sm">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {actionButtons.callNow && phone && (
                <a
                  href={previewMode ? "#" : `tel:${phone}`}
                  style={{ backgroundColor: activeTheme.primary }}
                  className="w-full px-4 py-3.5 rounded-2xl text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-xs hover:opacity-90 transition-all cursor-pointer text-center"
                >
                  <Phone className="w-4 h-4 shrink-0" /> <span>Call Now</span>
                </a>
              )}

              {actionButtons.whatsapp && whatsapp && (
                <a
                  href={previewMode ? "#" : `https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}?text=Hi%20${encodeURIComponent(displayName)},%20I%20saw%20your%20storefront%20on%20Cloche!`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ backgroundColor: activeTheme.secondary }}
                  className="w-full px-4 py-3.5 rounded-2xl text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-xs hover:opacity-90 transition-all cursor-pointer text-center"
                >
                  <MessageCircle className="w-4 h-4 shrink-0" /> <span>WhatsApp Us</span>
                </a>
              )}

              {actionButtons.getQuote && (
                <button
                  onClick={() => setActiveModal("quote")}
                  style={{ backgroundColor: activeTheme.accent, color: activeTheme.secondary }}
                  className="w-full px-4 py-3.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-xs hover:opacity-90 transition-all cursor-pointer text-center"
                >
                  <FileText className="w-4 h-4 shrink-0" /> <span>Get Custom Quote</span>
                </button>
              )}

              {actionButtons.visitStore && (address || location) && (
                <a
                  href={previewMode ? "#" : `https://maps.google.com/?q=${encodeURIComponent(address || location)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full px-4 py-3.5 rounded-2xl bg-[#FAF7F2] border border-gold/25 text-charcoal text-xs sm:text-sm font-bold flex items-center justify-center gap-2 hover:bg-gold/15 transition-all text-center"
                >
                  <Building className="w-4 h-4 text-[#0F4C45] shrink-0" /> <span>Get Directions</span>
                </a>
              )}
            </div>
          </div>

          {/* B. BUSINESS SNAPSHOT CARDS */}
          {(businessInfo.experienceYears || businessInfo.collectionsCount || businessInfo.guestCapacity || businessInfo.parkingCapacity) && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {businessInfo.experienceYears && (
                <div className="p-4 rounded-2xl bg-white border border-gold/15 shadow-2xs space-y-1">
                  <span className="text-[10px] uppercase font-bold text-charcoal/50 block">Experience</span>
                  <span style={{ color: activeTheme.primary }} className="font-serif font-bold text-lg sm:text-xl block">
                    {businessInfo.experienceYears} {businessInfo.experienceYears.toLowerCase().includes("year") ? "" : "Years"}
                  </span>
                </div>
              )}

              {businessInfo.collectionsCount && (
                <div className="p-4 rounded-2xl bg-white border border-gold/15 shadow-2xs space-y-1">
                  <span className="text-[10px] uppercase font-bold text-charcoal/50 block">Collections Count</span>
                  <span style={{ color: activeTheme.primary }} className="font-serif font-bold text-lg sm:text-xl block">
                    {businessInfo.collectionsCount}
                  </span>
                </div>
              )}

              {businessInfo.guestCapacity && (
                <div className="p-4 rounded-2xl bg-white border border-gold/15 shadow-2xs space-y-1">
                  <span className="text-[10px] uppercase font-bold text-charcoal/50 block">Guest Capacity</span>
                  <span style={{ color: activeTheme.primary }} className="font-serif font-bold text-lg sm:text-xl block">
                    {businessInfo.guestCapacity}
                  </span>
                </div>
              )}

              {businessInfo.parkingCapacity && (
                <div className="p-4 rounded-2xl bg-white border border-gold/15 shadow-2xs space-y-1">
                  <span className="text-[10px] uppercase font-bold text-charcoal/50 block">Parking</span>
                  <span style={{ color: activeTheme.primary }} className="font-serif font-bold text-lg sm:text-xl block">
                    {businessInfo.parkingCapacity}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* C. PINNED FEATURED COLLECTIONS */}
          {featuredCollections.length > 0 && (
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gold/15 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-serif font-bold text-base text-charcoal flex items-center gap-2">
                  <Tag style={{ color: activeTheme.primary }} className="w-4 h-4" /> Featured &amp; Pinned Collections
                </h3>
                <span className="text-[10px] font-bold text-charcoal/50 uppercase">Pinned by Store</span>
              </div>
              <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1">
                {featuredCollections.map((col) => (
                  <span
                    key={col}
                    style={{ backgroundColor: activeTheme.primary }}
                    className="text-white text-xs font-bold px-4 py-2 rounded-xl shrink-0 shadow-2xs flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3 h-3 text-[#C8A96A]" /> {col}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* D. ABOUT & BRAND STORY */}
          {about && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gold/15 shadow-sm space-y-4">
              <h2 className="font-serif text-2xl font-bold text-charcoal">About {displayName}</h2>
              <p className="text-sm text-charcoal/80 leading-relaxed whitespace-pre-line font-sans">
                {about}
              </p>

              {/* Social Media Links */}
              {(instagram || facebook || youtube || website) && (
                <div className="pt-4 border-t border-gold/10 flex items-center gap-3 flex-wrap">
                  <span className="text-xs font-bold text-charcoal/60">Connect Online:</span>
                  {instagram && (
                    <a
                      href={instagram.startsWith("http") ? instagram : `https://instagram.com/${instagram.replace("@", "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-full bg-[#FAF7F2] hover:bg-gold/15 border border-gold/20 text-xs font-bold text-charcoal flex items-center gap-1.5 transition-colors"
                    >
                      <span>Instagram</span> <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  {facebook && (
                    <a
                      href={facebook.startsWith("http") ? facebook : `https://facebook.com/${facebook}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-full bg-[#FAF7F2] hover:bg-gold/15 border border-gold/20 text-xs font-bold text-charcoal flex items-center gap-1.5 transition-colors"
                    >
                      <span>Facebook</span> <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  {website && (
                    <a
                      href={website.startsWith("http") ? website : `https://${website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-full bg-[#FAF7F2] hover:bg-gold/15 border border-gold/20 text-xs font-bold text-charcoal flex items-center gap-1.5 transition-colors"
                    >
                      <span>Official Website</span> <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              )}
            </div>
          )}

          {/* E. STOREFRONT PORTFOLIO & GALLERY (FIXED PREVIEW GRID: 6 Desktop/Tablet, 4 Mobile) */}
          {galleryPhotos.length > 0 && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-charcoal">Portfolio &amp; Showcase</h2>
                  <p className="text-xs text-charcoal/60">High-resolution authentic imagery crafted by {displayName}</p>
                </div>
                <span className="text-xs font-bold text-[#0F4C45] bg-white px-3 py-1 rounded-full border border-gold/20">
                  {galleryPhotos.length} Photos
                </span>
              </div>

              {/* Fixed Preview Grid Layout: 3x2 Desktop (6), 2x3 Tablet (6), 2x2 Mobile (4) */}
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
                {galleryPhotos.slice(0, 6).map((photo, i) => (
                  <div
                    key={i}
                    onClick={() => setSelectedPhoto(photo.url)}
                    className={`relative aspect-[4/3] rounded-2xl overflow-hidden border border-gold/20 shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer group bg-gray-100 ${
                      i >= 4 ? "hidden md:block" : ""
                    }`}
                  >
                    <img
                      src={photo.url}
                      alt={photo.caption || `Portfolio Photo ${i + 1}`}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex items-end">
                      <span className="text-white font-bold text-xs line-clamp-1">{photo.caption || "Showcase Photo"}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* View All Portfolio Redirect Action */}
              <div className="pt-1 flex justify-center">
                <Link
                  href={galleryHref}
                  className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-white border border-gold/25 text-charcoal font-bold text-xs hover:bg-[#FAF7F2] hover:border-gold/40 shadow-xs transition-all flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <span>View All Portfolio ({galleryPhotos.length})</span>
                  <ArrowRight className="w-4 h-4 text-[#0F4C45] group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          )}

          {/* E2. PREVIEW EMPTY STATE (When vendor has not uploaded gallery photos yet) */}
          {galleryPhotos.length === 0 && previewMode && (
            <div className="bg-[#FAF7F2] rounded-3xl p-8 border border-dashed border-gold/30 text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-white border border-gold/20 flex items-center justify-center mx-auto text-[#0F4C45]">
                <Sparkles className="w-5 h-5 text-[#0F4C45]" />
              </div>
              <h3 className="font-serif font-bold text-base text-charcoal">No Portfolio Photos Uploaded Yet</h3>
              <p className="text-xs text-charcoal/60 max-w-md mx-auto">
                Upload your authentic high-resolution event photos in the gallery upload section to display your portfolio here on your live storefront.
              </p>
            </div>
          )}

          {/* F. SERVICES & PACKAGES (IF DEFINED) */}
          {vendor?.packages && vendor.packages.length > 0 && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gold/15 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-gold/10 pb-4">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-charcoal">Curated Packages &amp; Pricing</h2>
                  <p className="text-xs text-charcoal/60 mt-0.5">Transparent wedding packages with verified inclusions</p>
                </div>
                <span className="text-xs font-bold text-[#0F4C45] bg-[#FAF7F2] px-3 py-1 rounded-full border border-gold/20">
                  {vendor.packages.length} Packages
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {vendor.packages.map((pkg: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-[#FAF7F2] border border-gold/15 space-y-3 flex flex-col justify-between hover:shadow-md transition-shadow"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <h4 className="font-serif font-bold text-base text-charcoal">{pkg.name}</h4>
                        {pkg.isPopular && (
                          <span className="bg-[#C8A96A] text-[#082F2C] text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full">
                            Most Popular
                          </span>
                        )}
                      </div>
                      {pkg.tagline && <p className="text-xs text-charcoal/60">{pkg.tagline}</p>}
                      <div className="text-lg font-serif font-bold text-[#0F4C45] pt-1">
                        {pkg.price}
                        {pkg.originalPrice && (
                          <span className="text-xs text-charcoal/40 line-through ml-2 font-sans font-normal">
                            {pkg.originalPrice}
                          </span>
                        )}
                      </div>
                      {pkg.features && Array.isArray(pkg.features) && (
                        <ul className="space-y-1 pt-2 border-t border-gold/10 text-xs text-charcoal/70">
                          {pkg.features.map((feat: string, fIdx: number) => (
                            <li key={fIdx} className="flex items-center gap-1.5">
                              <CheckCircle2 className="w-3 h-3 text-[#0F4C45] shrink-0" />
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <button
                      onClick={() => setActiveModal("quote")}
                      style={{ backgroundColor: activeTheme.primary }}
                      className="w-full py-2.5 rounded-xl text-white text-xs font-bold shadow-2xs hover:opacity-90 transition-all cursor-pointer text-center"
                    >
                      Inquire for this Package
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN (4 COLS): Timings, Location, Inquiry Card */}
        <aside className="lg:col-span-4 space-y-6">
          
          {/* 1. BUSINESS TIMINGS CARD */}
          {(workingHours.workingDays || workingHours.openingTime || workingHours.closingTime || workingHours.weeklyOff || workingHours.holidayNotice || workingHours.rawString) && (
            <div className="bg-[#FAF7F2] p-6 rounded-3xl border border-gold/15 shadow-sm space-y-4 text-xs">
              <h3 className="font-serif font-bold text-lg text-charcoal flex items-center gap-2 border-b border-gold/10 pb-3">
                <Clock style={{ color: activeTheme.primary }} className="w-4 h-4" /> Business Hours
              </h3>
              <div className="space-y-2">
                {workingHours.workingDays && (
                  <div className="flex justify-between py-1 border-b border-gray-100/60">
                    <span className="text-charcoal/60 font-medium">Working Days:</span>
                    <span className="font-bold text-charcoal">{workingHours.workingDays}</span>
                  </div>
                )}
                {(workingHours.openingTime || workingHours.closingTime) ? (
                  <div className="flex justify-between py-1 border-b border-gray-100/60">
                    <span className="text-charcoal/60 font-medium">Store Hours:</span>
                    <span className="font-bold text-[#0F4C45]">
                      {[workingHours.openingTime, workingHours.closingTime].filter(Boolean).join(" - ")}
                    </span>
                  </div>
                ) : workingHours.rawString ? (
                  <div className="flex justify-between py-1 border-b border-gray-100/60">
                    <span className="text-charcoal/60 font-medium">Store Hours:</span>
                    <span className="font-bold text-[#0F4C45]">{workingHours.rawString}</span>
                  </div>
                ) : null}
                {workingHours.weeklyOff && (
                  <div className="flex justify-between py-1 border-b border-gray-100/60">
                    <span className="text-charcoal/60 font-medium">Weekly Holiday:</span>
                    <span className="font-bold text-charcoal">{workingHours.weeklyOff}</span>
                  </div>
                )}
                {workingHours.holidayNotice && (
                  <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 font-semibold text-[11px] mt-2">
                    🔔 {workingHours.holidayNotice}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 2. DIRECT INQUIRY & BOOKING CARD */}
          <div className="bg-white p-6 rounded-3xl border border-gold/20 shadow-md space-y-4">
            <div className="text-center space-y-1">
              <span className="text-2xl">✨</span>
              <h3 className="font-serif font-bold text-lg text-charcoal">Contact {displayName}</h3>
              <p className="text-xs text-charcoal/60">
                Get response directly from the store manager within 2 hours.
              </p>
            </div>

            {quoteSubmitted ? (
              <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-2xl text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-xs text-emerald-900">Inquiry Sent Successfully!</h4>
                <p className="text-[11px] text-emerald-700">
                  {displayName} has received your details and will call/WhatsApp you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendQuote} className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-charcoal/70 block mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={quoteName}
                    onChange={(e) => setQuoteName(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#0F4C45]"
                  />
                </div>

                <div>
                  <label className="font-bold text-charcoal/70 block mb-1">Phone Number (WhatsApp)</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={quotePhone}
                    onChange={(e) => setQuotePhone(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#0F4C45]"
                  />
                </div>

                <div>
                  <label className="font-bold text-charcoal/70 block mb-1">Wedding / Event Date</label>
                  <input
                    type="date"
                    value={quoteDate}
                    onChange={(e) => setQuoteDate(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#0F4C45]"
                  />
                </div>

                <div>
                  <label className="font-bold text-charcoal/70 block mb-1">Message / Requirements</label>
                  <textarea
                    rows={3}
                    placeholder="Ask about pricing, availability, or rental options..."
                    value={quoteNotes}
                    onChange={(e) => setQuoteNotes(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#0F4C45]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={quoteLoading}
                  style={{ backgroundColor: activeTheme.primary }}
                  className="w-full py-3 rounded-xl text-white font-bold text-xs shadow-md hover:opacity-90 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {quoteLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  <span>Submit Inquiry Directly</span>
                </button>
              </form>
            )}
          </div>

        </aside>

      </div>

      {/* ── PHOTO LIGHTBOX MODAL ── */}
      {selectedPhoto && (
        <div
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl">
            <img src={selectedPhoto} alt="Zoomed view" className="max-w-full max-h-[85vh] object-contain rounded-2xl" />
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-3 right-3 bg-black/60 text-white p-2 rounded-full hover:bg-black transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}



      {/* ── QUOTE MODAL ── */}
      {activeModal === "quote" && (
        <div
          onClick={() => setActiveModal(null)}
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-gold/25 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200"
          >
            <div className="flex items-center justify-between border-b border-gold/15 pb-3">
              <h3 className="font-serif font-bold text-xl text-charcoal">Get Custom Quotation</h3>
              <button onClick={() => setActiveModal(null)} className="text-charcoal/40 hover:text-charcoal p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-charcoal/70">
              Receive a tailored proposal and quote for your wedding date from <strong>{displayName}</strong>.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("Quote request submitted! You will receive pricing on WhatsApp.");
                setActiveModal(null);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="font-bold text-charcoal/70 block mb-1">Your Name</label>
                <input required type="text" placeholder="Full name" className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-3.5 py-2" />
              </div>
              <div>
                <label className="font-bold text-charcoal/70 block mb-1">WhatsApp Number</label>
                <input required type="tel" placeholder="+91" className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-3.5 py-2" />
              </div>
              <div>
                <label className="font-bold text-charcoal/70 block mb-1">Estimated Guest Count / Requirement</label>
                <input type="text" placeholder="e.g. 300 guests, bridal lehenga rental..." className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-3.5 py-2" />
              </div>
              <button
                type="submit"
                style={{ backgroundColor: activeTheme.primary }}
                className="w-full py-3 rounded-xl text-white font-bold text-xs shadow-md mt-2 cursor-pointer"
              >
                Send Request
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
