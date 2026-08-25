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
  Globe,
  FileText,
  X,
  Award,
  ShieldCheck,
  Clock,
  MapPin,
  Phone,
  MessageCircle,
  Calendar,
  Layers,
  ArrowUp,
  ArrowDown,
  Check,
  Heart,
  Users,
  Sparkle
} from "lucide-react";
import { uploadImageToCloudinaryDetailed } from "@/lib/cloudinary";
import { VendorStorefront } from "@/components/VendorStorefront";
import {
  fetchAuthenticatedVendorFromDb,
  getActiveVendorIdentity,
  syncVendorProfileWithDatabase,
  showVendorToast,
  VendorProfileData
} from "@/lib/vendorStore";
import {
  MEHENDI_COLOR_THEMES,
  MEHENDI_HIGHLIGHT_OPTIONS,
  ALL_MEHENDI_PACKAGE_OPTIONS,
  MehendiBrandTheme
} from "@/lib/mehendiTypes";

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

export interface MehendiCustomizeStoreSectionProps {
  artistName?: string;
  businessName?: string;
  onBack?: () => void;
}

export function MehendiCustomizeStoreSection({
  artistName,
  businessName,
  onBack,
}: MehendiCustomizeStoreSectionProps = {}) {
  const [vendorData, setVendorData] = useState<VendorProfileData | null>(null);

  // 1. Branding & Identity
  const [logoUrl, setLogoUrl] = useState<string>("");
  const [coverUrl, setCoverUrl] = useState<string>("");
  const [tagline, setTagline] = useState<string>("");
  const [about, setAbout] = useState<string>("");
  const [colorTheme, setColorTheme] = useState<string>("henna");
  const [galleryLayout, setGalleryLayout] = useState<string>("grid");
  const [galleryImages, setGalleryImages] = useState<string[]>([]);

  // 2. Social Links
  const [instagram, setInstagram] = useState<string>("");
  const [facebook, setFacebook] = useState<string>("");
  const [youtube, setYoutube] = useState<string>("");
  const [website, setWebsite] = useState<string>("");

  // 3. Mehendi Highlights Badges
  const [mehendiHighlights, setMehendiHighlights] = useState<string[]>([
    "100% Organic Henna",
    "Bridal Specialist",
    "Arabic & Indo-Arabic",
    "Custom Figure Portraits",
    "Fast Dark Stain",
    "Verified Partner",
  ]);

  // 4. Featured Packages & Henna Styles
  const [featuredPackages, setFeaturedPackages] = useState<string[]>([
    "Signature Bridal Mehendi",
    "Rajasthani Traditional Set",
    "Arabic & Minimalist Henna",
    "Royale Family & Guest Package",
  ]);

  // 5. Artist & Studio Information
  const [experienceYears, setExperienceYears] = useState<string>("10+");
  const [maxBridesPerDay, setMaxBridesPerDay] = useState<string>("2 Brides per Day");
  const [organicHennaCertified, setOrganicHennaCertified] = useState<boolean>(true);
  const [teamSize, setTeamSize] = useState<string>("4 Professional Artists");
  const [travelCities, setTravelCities] = useState<string>("Mumbai, Delhi, Jaipur, Outstation & International");
  const [languagesSpoken, setLanguagesSpoken] = useState<string>("English, Hindi, Gujarati, Marwari");

  // 6. Contact Action Buttons
  const [actionButtons, setActionButtons] = useState({
    callNow: true,
    whatsapp: true,
    bookAppointment: true,
    requestQuote: true,
    getDirections: true,
    website: true,
  });

  // 7. Studio Hours & Timings
  const [openingTime, setOpeningTime] = useState<string>("10:00 AM");
  const [closingTime, setClosingTime] = useState<string>("08:00 PM");
  const [weeklyHolidays, setWeeklyHolidays] = useState<string>("Tuesday Off (Open all Peak Wedding Dates)");
  const [appointmentNotice, setAppointmentNotice] = useState<string>("Guided Bridal Trials available by appointment");
  const [homeVisitAvailable, setHomeVisitAvailable] = useState<boolean>(true);

  // 8. Booking Policies & Henna Guidelines
  const [advanceBookingRequired, setAdvanceBookingRequired] = useState<string>(
    "Minimum 15 to 45 days advance booking recommended for peak bridal dates."
  );
  const [advancePaymentPolicy, setAdvancePaymentPolicy] = useState<string>(
    "30% advance on booking confirmation, 70% post-application completion."
  );
  const [cancellationPolicy, setCancellationPolicy] = useState<string>(
    "100% advance refund if cancelled 30+ days prior to scheduled wedding event."
  );
  const [stainCarePolicy, setStainCarePolicy] = useState<string>(
    "Complimentary organic stain-lock essential oil & aftercare instructions provided for maximum dark stain tone."
  );
  const [groupBookingPolicy, setGroupBookingPolicy] = useState<string>(
    "Dedicated team of assistant artists assigned for bridal family & sangeet guest mehendi."
  );
  const [travelPolicy, setTravelPolicy] = useState<string>(
    "Travel & lodging charges applicable for outstation wedding destinations."
  );

  // Accordion State
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({
    highlights: true,
    featuredPackages: true,
    artistInfo: true,
    actionButtons: false,
    timings: false,
    policies: false,
    theme: false,
    branding: false,
  });

  const toggleAccordion = (section: string) => {
    setOpenAccordions((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Upload States
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  // Initial Hydration
  useEffect(() => {
    const localVendor = getActiveVendorIdentity();
    if (localVendor) {
      setVendorData(localVendor);
      hydrateFields(localVendor);
    }

    async function loadDbVendor() {
      try {
        const dbVendor = await fetchAuthenticatedVendorFromDb();
        if (dbVendor) {
          setVendorData(dbVendor);
          hydrateFields(dbVendor);
        }
      } catch (e) {
        console.error("[MehendiCustomizeStore] Error loading vendor:", e);
      }
    }

    loadDbVendor();
  }, []);

  const hydrateFields = (data: Partial<VendorProfileData> & Record<string, any>) => {
    if (data.logo || data.logo_url) setLogoUrl(data.logo || data.logo_url || "");
    if (data.coverImage || data.cover_image) setCoverUrl(data.coverImage || data.cover_image || "");
    if (data.tagline) setTagline(data.tagline || "");
    if (data.about || data.description) setAbout(data.about || data.description || "");
    if (data.colorTheme || data.color_theme) setColorTheme(data.colorTheme || data.color_theme || "henna");


    const gallery = Array.isArray(data.galleryImages)
      ? data.galleryImages
      : Array.isArray(data.gallery_images)
      ? data.gallery_images
      : null;
    if (gallery) setGalleryImages(gallery);

    // Social Links
    if (data.instagram) setInstagram(data.instagram || "");
    if (data.facebook) setFacebook(data.facebook || "");
    if (data.website) setWebsite(data.website || "");
    if (data.youtube) setYoutube(data.youtube || "");

    // Mehendi Highlights
    const rawHighlights = data.mehendiHighlights || data.mehendi_highlights || data.storeHighlights || data.store_highlights;
    if (Array.isArray(rawHighlights) && rawHighlights.length > 0) setMehendiHighlights(rawHighlights);

    // Featured Packages
    const rawPackages = data.featuredPackages || data.featured_packages || data.featuredCollections || data.featured_collections;
    if (Array.isArray(rawPackages) && rawPackages.length > 0) setFeaturedPackages(rawPackages);

    // Artist Info
    if (data.experienceYears || data.experience_years || data.experience) {
      setExperienceYears(String(data.experienceYears || data.experience_years || data.experience || ""));
    }
    if (data.maxBridesPerDay || data.max_brides_per_day) setMaxBridesPerDay(data.maxBridesPerDay || data.max_brides_per_day || "");
    if (data.organicHennaCertified !== undefined || data.organic_henna_certified !== undefined) {
      setOrganicHennaCertified(Boolean(data.organicHennaCertified ?? data.organic_henna_certified));
    }
    if (data.teamSize || data.team_size) setTeamSize(data.teamSize || data.team_size || "");
    if (data.travelCities || data.serviceAreas || data.service_areas) {
      setTravelCities(data.travelCities || data.serviceAreas || data.service_areas || "");
    }
    if (data.languagesSpoken || data.languages_spoken) setLanguagesSpoken(data.languagesSpoken || data.languages_spoken || "");

    // Contact Buttons
    if (data.actionButtons || data.action_buttons) {
      const act = (data.actionButtons || data.action_buttons || {}) as Record<string, any>;
      setActionButtons({
        callNow: Boolean(act.callNow ?? true),
        whatsapp: Boolean(act.whatsapp ?? true),
        bookAppointment: Boolean(act.bookAppointment ?? act.bookVenueVisit ?? true),
        requestQuote: Boolean(act.requestQuote ?? true),
        getDirections: Boolean(act.getDirections ?? true),
        website: Boolean(act.website ?? true),
      });
    }

    // Timings
    if (data.openingTime || data.opening_time) setOpeningTime(data.openingTime || data.opening_time || "");
    if (data.closingTime || data.closing_time) setClosingTime(data.closingTime || data.closing_time || "");
    if (data.weeklyHolidays || data.weekly_holidays) setWeeklyHolidays(data.weeklyHolidays || data.weekly_holidays || "");
    if (data.appointmentNotice || data.publicHolidayAvailability) {
      setAppointmentNotice(data.appointmentNotice || data.publicHolidayAvailability || "");
    }

    // Policies
    if (data.advanceBookingRequired || data.advance_booking_required) {
      setAdvanceBookingRequired(data.advanceBookingRequired || data.advance_booking_required || "");
    }
    if (data.advancePaymentPolicy || data.advance_payment_policy) {
      setAdvancePaymentPolicy(data.advancePaymentPolicy || data.advance_payment_policy || "");
    }
    if (data.cancellationPolicy || data.cancellation_policy) {
      setCancellationPolicy(data.cancellationPolicy || data.cancellation_policy || "");
    }
    if (data.stainCarePolicy || data.stain_care_policy) {
      setStainCarePolicy(data.stainCarePolicy || data.stain_care_policy || "");
    }
    if (data.groupBookingPolicy || data.group_booking_policy) {
      setGroupBookingPolicy(data.groupBookingPolicy || data.group_booking_policy || "");
    }
    if (data.travelPolicy || data.travel_policy) {
      setTravelPolicy(data.travelPolicy || data.travel_policy || "");
    }
  };

  const activeTheme = MEHENDI_COLOR_THEMES.find((t) => t.id === colorTheme) || MEHENDI_COLOR_THEMES[1];
  const currentDisplayName = businessName || artistName || vendorData?.boutique_name || vendorData?.name || "Henna Artistry Studio";
  const currentLocation = [vendorData?.city, vendorData?.district].filter(Boolean).join(", ") || "Jaipur, Rajasthan";

  const initials = currentDisplayName
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .join("")
    .slice(0, 2)
    .toUpperCase() || "HA";

  const toggleHighlight = (badge: string) => {
    setMehendiHighlights((prev) =>
      prev.includes(badge) ? prev.filter((b) => b !== badge) : [...prev, badge]
    );
  };

  const togglePackage = (pkg: string) => {
    setFeaturedPackages((prev) =>
      prev.includes(pkg) ? prev.filter((p) => p !== pkg) : [...prev, pkg]
    );
  };

  const movePackage = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= featuredPackages.length) return;
    const newPkgs = [...featuredPackages];
    const temp = newPkgs[index];
    newPkgs[index] = newPkgs[targetIndex];
    newPkgs[targetIndex] = temp;
    setFeaturedPackages(newPkgs);
  };

  // Upload Handlers
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploadingLogo(true);
      const res = await uploadImageToCloudinaryDetailed(file, "cloche/vendors/logos");
      setLogoUrl(res.secure_url);
      showVendorToast("✓ Artist Logo uploaded successfully", "success");
    } catch (err: any) {
      showVendorToast(err?.message || "Failed to upload logo", "error");
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploadingCover(true);
      const res = await uploadImageToCloudinaryDetailed(file, "cloche/vendors/covers");
      setCoverUrl(res.secure_url);
      showVendorToast("✓ Henna Studio Cover photo uploaded successfully", "success");
    } catch (err: any) {
      showVendorToast(err?.message || "Failed to upload cover photo", "error");
    } finally {
      setIsUploadingCover(false);
    }
  };



  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    try {
      setIsUploadingGallery(true);
      const uploadPromises = Array.from(files).map((f) => uploadImageToCloudinaryDetailed(f, "cloche/vendors/gallery"));
      const results = await Promise.all(uploadPromises);
      const newUrls = results.map((r) => r.secure_url);
      setGalleryImages((prev) => [...prev, ...newUrls]);
      showVendorToast(`✓ Added ${newUrls.length} photos to Henna Portfolio`, "success");
    } catch (err: any) {
      showVendorToast(err?.message || "Failed to upload gallery images", "error");
    } finally {
      setIsUploadingGallery(false);
    }
  };

  const handleRemoveGalleryImage = (index: number) => {
    setGalleryImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Save All Changes
  const handleSave = async () => {
    try {
      setIsSaving(true);

      const payload: Partial<VendorProfileData> & Record<string, any> = {
        logo: logoUrl.trim(),
        logo_url: logoUrl.trim(),
        coverImage: coverUrl.trim(),
        cover_image: coverUrl.trim(),
        tagline: tagline.trim(),
        about: about.trim(),
        description: about.trim(),
        colorTheme,
        color_theme: colorTheme,

        galleryImages,
        gallery_images: galleryImages,

        // Social Links
        instagram: instagram.trim(),
        facebook: facebook.trim(),
        youtube: youtube.trim(),
        website: website.trim(),

        // Mehendi Highlights & Packages
        mehendiHighlights,
        mehendi_highlights: mehendiHighlights,
        storeHighlights: mehendiHighlights,
        store_highlights: mehendiHighlights,
        featuredPackages,
        featured_packages: featuredPackages,
        featuredCollections: featuredPackages,
        featured_collections: featuredPackages,

        // Artist Info
        experienceYears: experienceYears.trim(),
        experience_years: experienceYears.trim(),
        maxBridesPerDay: maxBridesPerDay.trim(),
        max_brides_per_day: maxBridesPerDay.trim(),
        organicHennaCertified,
        organic_henna_certified: organicHennaCertified,
        teamSize: teamSize.trim(),
        team_size: teamSize.trim(),
        travelCities: travelCities.trim(),
        serviceAreas: travelCities.trim(),
        service_areas: travelCities.trim(),
        languagesSpoken: languagesSpoken.trim(),
        languages_spoken: languagesSpoken.trim(),

        // Action Buttons
        actionButtons,
        action_buttons: actionButtons,

        // Hours & Visit
        openingTime: openingTime.trim(),
        opening_time: openingTime.trim(),
        closingTime: closingTime.trim(),
        closing_time: closingTime.trim(),
        weeklyHolidays: weeklyHolidays.trim(),
        weekly_holidays: weeklyHolidays.trim(),
        appointmentNotice: appointmentNotice.trim(),

        // Policies
        advanceBookingRequired: advanceBookingRequired.trim(),
        advance_booking_required: advanceBookingRequired.trim(),
        advancePaymentPolicy: advancePaymentPolicy.trim(),
        advance_payment_policy: advancePaymentPolicy.trim(),
        cancellationPolicy: cancellationPolicy.trim(),
        cancellation_policy: cancellationPolicy.trim(),
        stainCarePolicy: stainCarePolicy.trim(),
        stain_care_policy: stainCarePolicy.trim(),
        groupBookingPolicy: groupBookingPolicy.trim(),
        group_booking_policy: groupBookingPolicy.trim(),
        travelPolicy: travelPolicy.trim(),
        travel_policy: travelPolicy.trim(),

        storefront: {
          theme: colorTheme,
          brandColors: activeTheme,
          coverImage: coverUrl,
          logo: logoUrl,
          tagline: tagline.trim(),
          about: about.trim(),
          storeHighlights: mehendiHighlights,
          featuredCollections: featuredPackages,
          galleryLayout: galleryLayout,
          gallery: galleryImages.map((url, i) => ({ url, caption: `Henna Showcase ${i + 1}` })),
          actionButtons,
          businessInfo: {
            experienceYears: experienceYears.trim(),
            rentalAvailable: false,
            homeDeliveryAvailable: Boolean(travelCities),
            homeTrialAvailable: organicHennaCertified,
            collectionsCount: `${maxBridesPerDay} brides/day`,
            citiesServed: travelCities.trim(),
          },
          workingHours: {
            workingDays: "All Days",
            openingTime: openingTime.trim(),
            closingTime: closingTime.trim(),
            weeklyOff: weeklyHolidays.trim(),
            holidayNotice: appointmentNotice.trim(),
          },
          socialLinks: {
            instagram: instagram.trim(),
            facebook: facebook.trim(),
            youtube: youtube.trim(),
            website: website.trim(),
          },
        },
      };

      const res = await syncVendorProfileWithDatabase(payload);
      if (res.success) {
        setSaved(true);
        showVendorToast("Mehendi storefront customization saved successfully.", "success");
        setTimeout(() => setSaved(false), 3500);
      } else {
        showVendorToast("Unable to save storefront customization. Please try again.", "error");
      }
    } catch (err) {
      console.error("[MehendiCustomizeStore] Save error:", err);
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

      <input
        ref={galleryInputRef}
        type="file"
        multiple
        accept="image/png,image/jpeg,image/webp,image/jpg"
        className="hidden"
        onChange={handleGalleryUpload}
      />

      {/* Top Header Card with Quick Publish Action */}
      <div className="bg-white rounded-2xl p-6 border border-gold/15 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-[#0F4C45]" />
            <h2 className="text-xl font-serif font-bold text-charcoal">
              Customize Mehendi Storefront & Henna Art
            </h2>
          </div>
          <p className="text-xs text-charcoal/70">
            Real-time visual editor. Colors, banner, bridal highlights, package options, and stain policies update immediately on your public storefront.
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
              <Save className="w-4 h-4" /> Save Storefront
            </>
          )}
        </button>
      </div>

      {/* LIVE STOREFRONT PREVIEW PANE (Exact Unified Component) */}
      <div className="rounded-3xl border border-gold/20 shadow-md overflow-hidden transition-all">
        <VendorStorefront
          previewMode={true}
          vendor={{
            id: "preview-mehendi",
            name: currentDisplayName,
            business_name: currentDisplayName,
            boutique_name: currentDisplayName,
            category: "mehendi-artists",
            categoryLabel: "Bridal Mehendi Artist",
            location: currentLocation,
            city: vendorData?.city || "Kochi",
            state: "Kerala",
            rating: 5.0,
            reviews: 18,
            image: coverUrl,
            cover_image: coverUrl,
            coverImage: coverUrl,
            logo: logoUrl,
            logo_url: logoUrl,
            tagline: tagline,
            subtitle: tagline,
            about: about,
            description: about,
            colorTheme: colorTheme,
            galleryLayout: galleryLayout,
            galleryImages: galleryImages,
            gallery: galleryImages.map((url, i) => ({ url, caption: `Henna Showcase ${i + 1}` })),
            startingPrice: (vendorData as any)?.startingPrice || (vendorData as any)?.starting_price || "₹5,000",
            phone: "+91 98470 12345",
            whatsapp: "+91 98470 12345",
            email: "mehendi@cloche.com",
            address: `${currentLocation}, Kerala`,
            storeHighlights: mehendiHighlights,
            mehendiHighlights: mehendiHighlights,
            featuredCollections: featuredPackages,
            featuredPackages: featuredPackages,
            actionButtons: actionButtons,
            businessInfo: {
              experienceYears: experienceYears,
              rentalAvailable: false,
              homeDeliveryAvailable: Boolean(travelCities),
              homeTrialAvailable: organicHennaCertified,
              collectionsCount: `${maxBridesPerDay} brides/day`,
              citiesServed: travelCities,
            },
            workingHours: {
              workingDays: "All Days",
              openingTime: openingTime,
              closingTime: closingTime,
              weeklyOff: weeklyHolidays,
              holidayNotice: appointmentNotice,
            },
          }}
          storefront={{
            theme: colorTheme,
            brandColors: activeTheme,
            coverImage: coverUrl,
            logo: logoUrl,
            tagline: tagline,
            about: about,
            storeHighlights: mehendiHighlights,
            featuredCollections: featuredPackages,
            galleryLayout: galleryLayout,
            gallery: galleryImages.map((url, i) => ({ url, caption: `Henna Showcase ${i + 1}` })),
            actionButtons: actionButtons,
            businessInfo: {
              experienceYears: experienceYears,
              rentalAvailable: false,
              homeDeliveryAvailable: Boolean(travelCities),
              homeTrialAvailable: organicHennaCertified,
              collectionsCount: `${maxBridesPerDay} brides/day`,
              citiesServed: travelCities,
            },
            workingHours: {
              workingDays: "All Days",
              openingTime: openingTime,
              closingTime: closingTime,
              weeklyOff: weeklyHolidays,
              holidayNotice: appointmentNotice,
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
        {/* Section 1: Mehendi Style Highlights & Badges */}
        <div className="bg-white rounded-2xl border border-gold/15 overflow-hidden shadow-xs">
          <button
            type="button"
            onClick={() => toggleAccordion("highlights")}
            className="w-full p-5 text-left font-serif font-bold text-base text-charcoal flex items-center justify-between bg-[#FAF7F2]/60 hover:bg-[#FAF7F2] transition-colors"
          >
            <div className="flex items-center gap-3">
              <Award style={{ color: activeTheme.primary }} className="w-5 h-5" />
              <div>
                <span className="block">1. Mehendi Style Highlights & Badges</span>
                <span className="text-xs font-sans font-normal text-charcoal/60">
                  Select key artist badges to highlight your henna specialty on your public profile
                </span>
              </div>
            </div>
            {openAccordions.highlights ? <ChevronUp className="w-4 h-4 text-charcoal/40" /> : <ChevronDown className="w-4 h-4 text-charcoal/40" />}
          </button>

          {openAccordions.highlights && (
            <div className="p-5 border-t border-gold/10 space-y-4 text-xs animate-in fade-in duration-200">
              <p className="text-charcoal/70 leading-relaxed">
                Click to toggle Mehendi artist badges on your public storefront:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                {MEHENDI_HIGHLIGHT_OPTIONS.map((badge) => {
                  const isSelected = mehendiHighlights.includes(badge);
                  return (
                    <button
                      key={badge}
                      type="button"
                      onClick={() => toggleHighlight(badge)}
                      style={{
                        backgroundColor: isSelected ? activeTheme.primary : "#FAF7F2",
                        color: isSelected ? "#FFFFFF" : "#2D2520",
                        borderColor: isSelected ? activeTheme.primary : "#E8DFD1",
                      }}
                      className="p-3 rounded-xl border text-xs font-bold text-left transition-all flex items-center justify-between cursor-pointer"
                    >
                      <span>{badge}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Section 2: Featured Packages & Henna Styles (Reorderable) */}
        <div className="bg-white rounded-2xl border border-gold/15 overflow-hidden shadow-xs">
          <button
            type="button"
            onClick={() => toggleAccordion("featuredPackages")}
            className="w-full p-5 text-left font-serif font-bold text-base text-charcoal flex items-center justify-between bg-[#FAF7F2]/60 hover:bg-[#FAF7F2] transition-colors"
          >
            <div className="flex items-center gap-3">
              <Heart style={{ color: activeTheme.primary }} className="w-5 h-5" />
              <div>
                <span className="block">2. Featured Packages & Henna Styles</span>
                <span className="text-xs font-sans font-normal text-charcoal/60">
                  Select and pin featured bridal packages in your preferred display order
                </span>
              </div>
            </div>
            {openAccordions.featuredPackages ? <ChevronUp className="w-4 h-4 text-charcoal/40" /> : <ChevronDown className="w-4 h-4 text-charcoal/40" />}
          </button>

          {openAccordions.featuredPackages && (
            <div className="p-5 border-t border-gold/10 space-y-4 text-xs animate-in fade-in duration-200">
              <div>
                <span className="font-bold text-charcoal block mb-2">Available Packages & Styles (Click to Pin/Unpin):</span>
                <div className="flex flex-wrap gap-2">
                  {ALL_MEHENDI_PACKAGE_OPTIONS.map((pkg) => {
                    const isPinned = featuredPackages.includes(pkg);
                    return (
                      <button
                        key={pkg}
                        type="button"
                        onClick={() => togglePackage(pkg)}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                          isPinned
                            ? "bg-[#0F4C45] text-white border-[#0F4C45]"
                            : "bg-[#FAF7F2] text-charcoal border-gold/20 hover:bg-gold/15"
                        }`}
                      >
                        {pkg} {isPinned ? "✓" : "+"}
                      </button>
                    );
                  })}
                </div>
              </div>

              {featuredPackages.length > 0 && (
                <div className="pt-3 border-t border-gold/10 space-y-2">
                  <span className="font-bold text-charcoal block">Pinned Order (Use arrows to reorder):</span>
                  <div className="space-y-1.5">
                    {featuredPackages.map((pkg, idx) => (
                      <div
                        key={pkg}
                        className="p-3 bg-[#FAF7F2] rounded-xl border border-gold/15 flex items-center justify-between text-xs"
                      >
                        <span className="font-bold text-charcoal flex items-center gap-2">
                          <Heart className="w-3.5 h-3.5 text-[#0F4C45]" /> {idx + 1}. {pkg}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => movePackage(idx, "up")}
                            className="p-1 rounded bg-white text-charcoal hover:bg-gray-100 disabled:opacity-30 cursor-pointer"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={idx === featuredPackages.length - 1}
                            onClick={() => movePackage(idx, "down")}
                            className="p-1 rounded bg-white text-charcoal hover:bg-gray-100 disabled:opacity-30 cursor-pointer"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Section 3: Artist & Studio Information */}
        <div className="bg-white rounded-2xl border border-gold/15 overflow-hidden shadow-xs">
          <button
            type="button"
            onClick={() => toggleAccordion("artistInfo")}
            className="w-full p-5 text-left font-serif font-bold text-base text-charcoal flex items-center justify-between bg-[#FAF7F2]/60 hover:bg-[#FAF7F2] transition-colors"
          >
            <div className="flex items-center gap-3">
              <Layers style={{ color: activeTheme.primary }} className="w-5 h-5" />
              <div>
                <span className="block">3. Artist & Studio Information</span>
                <span className="text-xs font-sans font-normal text-charcoal/60">
                  Experience, daily limits, organic certification, team size & travel cities
                </span>
              </div>
            </div>
            {openAccordions.artistInfo ? <ChevronUp className="w-4 h-4 text-charcoal/40" /> : <ChevronDown className="w-4 h-4 text-charcoal/40" />}
          </button>

          {openAccordions.artistInfo && (
            <div className="p-5 border-t border-gold/10 space-y-4 text-xs animate-in fade-in duration-200">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="block font-bold text-charcoal">About Artist Studio / Bio</label>
                  <span className={`text-[10px] ${about.length > 500 ? "text-red-500 font-bold" : "text-charcoal/50"}`}>
                    {about.length}/500 chars
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  placeholder="Describe your henna artistry experience, intricate bridal figures, organic paste preparation..."
                  className="w-full p-2.5 bg-[#FAF7F2] border border-gold/15 rounded-xl outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-charcoal mb-1">Years of Experience</label>
                  <input
                    type="text"
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(e.target.value)}
                    placeholder="e.g. 10+"
                    className="w-full p-2.5 bg-[#FAF7F2] border border-gold/15 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-charcoal mb-1">Max Brides per Day</label>
                  <input
                    type="text"
                    value={maxBridesPerDay}
                    onChange={(e) => setMaxBridesPerDay(e.target.value)}
                    placeholder="e.g. 2 Brides per Day"
                    className="w-full p-2.5 bg-[#FAF7F2] border border-gold/15 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-charcoal mb-1">Team Strength / Artists Count</label>
                  <input
                    type="text"
                    value={teamSize}
                    onChange={(e) => setTeamSize(e.target.value)}
                    placeholder="e.g. 4 Professional Artists"
                    className="w-full p-2.5 bg-[#FAF7F2] border border-gold/15 rounded-xl outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-charcoal mb-1">Travel & Service Cities</label>
                  <input
                    type="text"
                    value={travelCities}
                    onChange={(e) => setTravelCities(e.target.value)}
                    placeholder="e.g. Mumbai, Delhi, Jaipur, Outstation & Destination Weddings"
                    className="w-full p-2.5 bg-[#FAF7F2] border border-gold/15 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-charcoal mb-1">Languages Spoken</label>
                  <input
                    type="text"
                    value={languagesSpoken}
                    onChange={(e) => setLanguagesSpoken(e.target.value)}
                    placeholder="e.g. English, Hindi, Gujarati, Marwari"
                    className="w-full p-2.5 bg-[#FAF7F2] border border-gold/15 rounded-xl outline-none"
                  />
                </div>

                <div className="sm:col-span-3 pt-1">
                  <label className="p-3 bg-[#FAF7F2] rounded-xl border border-gold/15 flex items-center justify-between cursor-pointer">
                    <div>
                      <span className="font-bold text-charcoal block">100% Natural Organic Henna Certified</span>
                      <span className="text-[11px] text-charcoal/60">Guarantee chemical-free organic henna paste mixed with essential oils</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={organicHennaCertified}
                      onChange={(e) => setOrganicHennaCertified(e.target.checked)}
                      className="rounded accent-[#0F4C45] w-4 h-4 shrink-0"
                    />
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Section 4: Contact Action Buttons */}
        <div className="bg-white rounded-2xl border border-gold/15 overflow-hidden shadow-xs">
          <button
            type="button"
            onClick={() => toggleAccordion("actionButtons")}
            className="w-full p-5 text-left font-serif font-bold text-base text-charcoal flex items-center justify-between bg-[#FAF7F2]/60 hover:bg-[#FAF7F2] transition-colors"
          >
            <div className="flex items-center gap-3">
              <Phone style={{ color: activeTheme.primary }} className="w-5 h-5" />
              <div>
                <span className="block">4. Contact Action Buttons</span>
                <span className="text-xs font-sans font-normal text-charcoal/60">
                  Select which call-to-action buttons appear on your public storefront
                </span>
              </div>
            </div>
            {openAccordions.actionButtons ? <ChevronUp className="w-4 h-4 text-charcoal/40" /> : <ChevronDown className="w-4 h-4 text-charcoal/40" />}
          </button>

          {openAccordions.actionButtons && (
            <div className="p-5 border-t border-gold/10 space-y-3 text-xs animate-in fade-in duration-200">
              <p className="text-charcoal/70">
                Enable or disable action buttons for visitors viewing your Mehendi artist profile:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <label className="p-3 bg-[#FAF7F2] rounded-xl border border-gold/15 flex items-center justify-between cursor-pointer">
                  <span className="font-bold text-charcoal flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#0F4C45]" /> Call Now
                  </span>
                  <input
                    type="checkbox"
                    checked={actionButtons.callNow}
                    onChange={(e) => setActionButtons((prev) => ({ ...prev, callNow: e.target.checked }))}
                    className="rounded accent-[#0F4C45] w-4 h-4"
                  />
                </label>

                <label className="p-3 bg-[#FAF7F2] rounded-xl border border-gold/15 flex items-center justify-between cursor-pointer">
                  <span className="font-bold text-charcoal flex items-center gap-1.5">
                    <MessageCircle className="w-3.5 h-3.5 text-[#0F4C45]" /> WhatsApp
                  </span>
                  <input
                    type="checkbox"
                    checked={actionButtons.whatsapp}
                    onChange={(e) => setActionButtons((prev) => ({ ...prev, whatsapp: e.target.checked }))}
                    className="rounded accent-[#0F4C45] w-4 h-4"
                  />
                </label>



                <label className="p-3 bg-[#FAF7F2] rounded-xl border border-gold/15 flex items-center justify-between cursor-pointer">
                  <span className="font-bold text-charcoal flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-[#0F4C45]" /> Request Quote
                  </span>
                  <input
                    type="checkbox"
                    checked={actionButtons.requestQuote}
                    onChange={(e) => setActionButtons((prev) => ({ ...prev, requestQuote: e.target.checked }))}
                    className="rounded accent-[#0F4C45] w-4 h-4"
                  />
                </label>

                <label className="p-3 bg-[#FAF7F2] rounded-xl border border-gold/15 flex items-center justify-between cursor-pointer">
                  <span className="font-bold text-charcoal flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#0F4C45]" /> Get Directions
                  </span>
                  <input
                    type="checkbox"
                    checked={actionButtons.getDirections}
                    onChange={(e) => setActionButtons((prev) => ({ ...prev, getDirections: e.target.checked }))}
                    className="rounded accent-[#0F4C45] w-4 h-4"
                  />
                </label>

                <label className="p-3 bg-[#FAF7F2] rounded-xl border border-gold/15 flex items-center justify-between cursor-pointer">
                  <span className="font-bold text-charcoal flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-[#0F4C45]" /> Official Website
                  </span>
                  <input
                    type="checkbox"
                    checked={actionButtons.website}
                    onChange={(e) => setActionButtons((prev) => ({ ...prev, website: e.target.checked }))}
                    className="rounded accent-[#0F4C45] w-4 h-4"
                  />
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Section 5: Studio Working Hours & Appointment Timings */}
        <div className="bg-white rounded-2xl border border-gold/15 overflow-hidden shadow-xs">
          <button
            type="button"
            onClick={() => toggleAccordion("timings")}
            className="w-full p-5 text-left font-serif font-bold text-base text-charcoal flex items-center justify-between bg-[#FAF7F2]/60 hover:bg-[#FAF7F2] transition-colors"
          >
            <div className="flex items-center gap-3">
              <Clock style={{ color: activeTheme.primary }} className="w-5 h-5" />
              <div>
                <span className="block">5. Studio Hours & Appointment Timings</span>
                <span className="text-xs font-sans font-normal text-charcoal/60">
                  Studio timings, weekly holidays & trial appointment guidance
                </span>
              </div>
            </div>
            {openAccordions.timings ? <ChevronUp className="w-4 h-4 text-charcoal/40" /> : <ChevronDown className="w-4 h-4 text-charcoal/40" />}
          </button>

          {openAccordions.timings && (
            <div className="p-5 border-t border-gold/10 space-y-4 text-xs animate-in fade-in duration-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-charcoal mb-1">Opening Time</label>
                  <input
                    type="text"
                    value={openingTime}
                    onChange={(e) => setOpeningTime(e.target.value)}
                    placeholder="e.g. 10:00 AM"
                    className="w-full p-2.5 bg-[#FAF7F2] border border-gold/15 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-charcoal mb-1">Closing Time</label>
                  <input
                    type="text"
                    value={closingTime}
                    onChange={(e) => setClosingTime(e.target.value)}
                    placeholder="e.g. 08:00 PM"
                    className="w-full p-2.5 bg-[#FAF7F2] border border-gold/15 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-charcoal mb-1">Weekly Off / Holidays</label>
                  <input
                    type="text"
                    value={weeklyHolidays}
                    onChange={(e) => setWeeklyHolidays(e.target.value)}
                    placeholder="e.g. Tuesday Off"
                    className="w-full p-2.5 bg-[#FAF7F2] border border-gold/15 rounded-xl outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-charcoal mb-1">Appointment & Trial Notice</label>
                  <input
                    type="text"
                    value={appointmentNotice}
                    onChange={(e) => setAppointmentNotice(e.target.value)}
                    placeholder="e.g. Guided Bridal Trials available by prior appointment"
                    className="w-full p-2.5 bg-[#FAF7F2] border border-gold/15 rounded-xl outline-none"
                  />
                </div>

                <div className="sm:col-span-3 pt-1">
                  <label className="p-3 bg-[#FAF7F2] rounded-xl border border-gold/15 flex items-center justify-between cursor-pointer">
                    <div>
                      <span className="font-bold text-charcoal block">Home & Venue Visit Available</span>
                      <span className="text-[11px] text-charcoal/60">Artist travels directly to bride's home/venue for application</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={homeVisitAvailable}
                      onChange={(e) => setHomeVisitAvailable(e.target.checked)}
                      className="rounded accent-[#0F4C45] w-4 h-4 shrink-0"
                    />
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Section 6: Booking Policies & Henna Guidelines */}
        <div className="bg-white rounded-2xl border border-gold/15 overflow-hidden shadow-xs">
          <button
            type="button"
            onClick={() => toggleAccordion("policies")}
            className="w-full p-5 text-left font-serif font-bold text-base text-charcoal flex items-center justify-between bg-[#FAF7F2]/60 hover:bg-[#FAF7F2] transition-colors"
          >
            <div className="flex items-center gap-3">
              <ShieldCheck style={{ color: activeTheme.primary }} className="w-5 h-5" />
              <div>
                <span className="block">6. Booking Policies & Henna Guidelines</span>
                <span className="text-xs font-sans font-normal text-charcoal/60">
                  Advance booking, stain care policy, group terms & travel rules
                </span>
              </div>
            </div>
            {openAccordions.policies ? <ChevronUp className="w-4 h-4 text-charcoal/40" /> : <ChevronDown className="w-4 h-4 text-charcoal/40" />}
          </button>

          {openAccordions.policies && (
            <div className="p-5 border-t border-gold/10 space-y-4 text-xs animate-in fade-in duration-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-charcoal mb-1">Advance Booking Lead Time</label>
                  <input
                    type="text"
                    value={advanceBookingRequired}
                    onChange={(e) => setAdvanceBookingRequired(e.target.value)}
                    placeholder="e.g. Minimum 15 to 45 days advance booking recommended"
                    className="w-full p-2.5 bg-[#FAF7F2] border border-gold/15 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-charcoal mb-1">Advance Payment Schedule</label>
                  <input
                    type="text"
                    value={advancePaymentPolicy}
                    onChange={(e) => setAdvancePaymentPolicy(e.target.value)}
                    placeholder="e.g. 30% advance on confirmation, 70% post-application"
                    className="w-full p-2.5 bg-[#FAF7F2] border border-gold/15 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-charcoal mb-1">Cancellation Refund Policy</label>
                  <input
                    type="text"
                    value={cancellationPolicy}
                    onChange={(e) => setCancellationPolicy(e.target.value)}
                    placeholder="e.g. 100% refund if cancelled 30+ days prior to event"
                    className="w-full p-2.5 bg-[#FAF7F2] border border-gold/15 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-charcoal mb-1">Organic Henna Stain Care Policy</label>
                  <input
                    type="text"
                    value={stainCarePolicy}
                    onChange={(e) => setStainCarePolicy(e.target.value)}
                    placeholder="e.g. Organic stain-lock oil provided with instructions"
                    className="w-full p-2.5 bg-[#FAF7F2] border border-gold/15 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-charcoal mb-1">Family & Guest Mehendi Terms</label>
                  <input
                    type="text"
                    value={groupBookingPolicy}
                    onChange={(e) => setGroupBookingPolicy(e.target.value)}
                    placeholder="e.g. Dedicated assistant team for sangeet guest mehendi"
                    className="w-full p-2.5 bg-[#FAF7F2] border border-gold/15 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-charcoal mb-1">Outstation Travel Policy</label>
                  <input
                    type="text"
                    value={travelPolicy}
                    onChange={(e) => setTravelPolicy(e.target.value)}
                    placeholder="e.g. Travel & stay covered for outstation weddings"
                    className="w-full p-2.5 bg-[#FAF7F2] border border-gold/15 rounded-xl outline-none"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Section 7: Brand Color Theme */}
        <div className="bg-white rounded-2xl border border-gold/15 overflow-hidden shadow-xs">
          <button
            type="button"
            onClick={() => toggleAccordion("theme")}
            className="w-full p-5 text-left font-serif font-bold text-base text-charcoal flex items-center justify-between bg-[#FAF7F2]/60 hover:bg-[#FAF7F2] transition-colors"
          >
            <div className="flex items-center gap-3">
              <Palette style={{ color: activeTheme.primary }} className="w-5 h-5" />
              <div>
                <span className="block">7. Brand Color Theme</span>
                <span className="text-xs font-sans font-normal text-charcoal/60">
                  Select a cohesive luxury palette for buttons, badges, and store accents
                </span>
              </div>
            </div>
            {openAccordions.theme ? <ChevronUp className="w-4 h-4 text-charcoal/40" /> : <ChevronDown className="w-4 h-4 text-charcoal/40" />}
          </button>

          {openAccordions.theme && (
            <div className="p-5 border-t border-gold/10 space-y-4 text-xs animate-in fade-in duration-200">
              <p className="text-charcoal/70">
                Choose a signature theme that highlights your Mehendi studio's aesthetic:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                {MEHENDI_COLOR_THEMES.map((theme) => {
                  const isSelected = colorTheme === theme.id;
                  return (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => setColorTheme(theme.id)}
                      className={`p-3 rounded-2xl border text-left transition-all relative cursor-pointer ${
                        isSelected
                          ? "border-charcoal shadow-sm ring-2 ring-charcoal/20 bg-white"
                          : "border-gold/20 bg-[#FAF7F2] hover:bg-gold/10"
                      }`}
                    >
                      <div className="flex items-center gap-1.5 mb-2">
                        <div
                          style={{ backgroundColor: theme.primary }}
                          className="w-4 h-4 rounded-full shadow-2xs shrink-0"
                        />
                        <div
                          style={{ backgroundColor: theme.accent }}
                          className="w-3 h-3 rounded-full shadow-2xs shrink-0"
                        />
                      </div>
                      <span className="font-bold text-charcoal block text-[11px] leading-tight">
                        {theme.label}
                      </span>
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-500" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Section 8: Artist Logo, Cover Banner & Media */}
        <div className="bg-white rounded-2xl border border-gold/15 overflow-hidden shadow-xs">
          <button
            type="button"
            onClick={() => toggleAccordion("branding")}
            className="w-full p-5 text-left font-serif font-bold text-base text-charcoal flex items-center justify-between bg-[#FAF7F2]/60 hover:bg-[#FAF7F2] transition-colors"
          >
            <div className="flex items-center gap-3">
              <ImageIcon style={{ color: activeTheme.primary }} className="w-5 h-5" />
              <div>
                <span className="block">8. Artist Logo, Cover Banner & Media</span>
                <span className="text-xs font-sans font-normal text-charcoal/60">
                  Emblem logo, studio cover banner, tagline & portfolio gallery
                </span>
              </div>
            </div>
            {openAccordions.branding ? <ChevronUp className="w-4 h-4 text-charcoal/40" /> : <ChevronDown className="w-4 h-4 text-charcoal/40" />}
          </button>

          {openAccordions.branding && (
            <div className="p-5 border-t border-gold/10 space-y-5 text-xs animate-in fade-in duration-200">
              {/* Media Upload Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Logo Upload Card */}
                <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-gold/15 flex flex-col items-center text-center space-y-3">
                  <div className="w-20 h-20 rounded-2xl bg-white border border-gold/20 flex items-center justify-center overflow-hidden relative shadow-xs">
                    {logoUrl ? (
                      <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
                    ) : (
                      <Heart className="w-8 h-8 text-charcoal/30" />
                    )}
                  </div>
                  <div>
                    <span className="font-bold text-charcoal block">Artist Logo / Emblem</span>
                    <span className="text-[10px] text-charcoal/50">PNG, JPG, WebP (Square 1:1)</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => logoInputRef.current?.click()}
                    disabled={isUploadingLogo}
                    className="w-full py-2 px-3 bg-white border border-gold/20 rounded-xl text-charcoal font-bold text-xs hover:bg-gold/10 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {isUploadingLogo ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" /> Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-3.5 h-3.5 text-[#0F4C45]" /> Upload Logo
                      </>
                    )}
                  </button>
                </div>

                {/* Cover Banner Upload Card */}
                <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-gold/15 flex flex-col items-center text-center space-y-3">
                  <div className="w-full h-20 rounded-2xl bg-white border border-gold/20 flex items-center justify-center overflow-hidden relative shadow-xs">
                    {coverUrl ? (
                      <img src={coverUrl} alt="Cover" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-charcoal/30" />
                    )}
                  </div>
                  <div>
                    <span className="font-bold text-charcoal block">Cover Banner Photo</span>
                    <span className="text-[10px] text-charcoal/50">Landscape (16:9 / 21:9)</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => coverInputRef.current?.click()}
                    disabled={isUploadingCover}
                    className="w-full py-2 px-3 bg-white border border-gold/20 rounded-xl text-charcoal font-bold text-xs hover:bg-gold/10 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {isUploadingCover ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" /> Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-3.5 h-3.5 text-[#0F4C45]" /> Upload Cover
                      </>
                    )}
                  </button>
                </div>


              </div>

              {/* Tagline Input */}
              <div>
                <label className="block font-bold text-charcoal mb-1">Mehendi Studio Tagline / Subtitle</label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="e.g. Royal Marwari Patterns, Intricate Figure Portraits & 100% Organic Henna"
                  className="w-full p-2.5 bg-[#FAF7F2] border border-gold/15 rounded-xl outline-none"
                />
              </div>

              {/* Portfolio Henna Photos */}
              <div className="space-y-3 pt-2 border-t border-gold/10">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-charcoal block">Henna Portfolio Photos ({galleryImages.length})</span>
                    <span className="text-[10px] text-charcoal/60">Upload high-resolution bridal mehendi photography</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => galleryInputRef.current?.click()}
                    disabled={isUploadingGallery}
                    className="py-1.5 px-3 bg-[#0F4C45] text-white font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    {isUploadingGallery ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
                    Add Photos
                  </button>
                </div>

                {galleryImages.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
                    {galleryImages.map((img, i) => (
                      <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-gold/15 group">
                        <img src={img} alt={`Henna Portfolio ${i + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveGalleryImage(i)}
                          className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Social Media Links */}
              <div className="space-y-3 pt-3 border-t border-gold/10">
                <span className="font-bold text-charcoal block">Social Media & Online Presence:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 bg-[#FAF7F2] p-2.5 rounded-xl border border-gold/15">
                    <InstagramIcon className="w-4 h-4 text-[#0F4C45] shrink-0" />
                    <input
                      type="text"
                      value={instagram}
                      onChange={(e) => setInstagram(e.target.value)}
                      placeholder="Instagram URL (e.g. instagram.com/hennabyrida)"
                      className="w-full bg-transparent outline-none text-xs"
                    />
                  </div>

                  <div className="flex items-center gap-2 bg-[#FAF7F2] p-2.5 rounded-xl border border-gold/15">
                    <FacebookIcon className="w-4 h-4 text-[#0F4C45] shrink-0" />
                    <input
                      type="text"
                      value={facebook}
                      onChange={(e) => setFacebook(e.target.value)}
                      placeholder="Facebook Page URL"
                      className="w-full bg-transparent outline-none text-xs"
                    />
                  </div>

                  <div className="flex items-center gap-2 bg-[#FAF7F2] p-2.5 rounded-xl border border-gold/15">
                    <Globe className="w-4 h-4 text-[#0F4C45] shrink-0" />
                    <input
                      type="text"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="Official Website URL"
                      className="w-full bg-transparent outline-none text-xs"
                    />
                  </div>

                  <div className="flex items-center gap-2 bg-[#FAF7F2] p-2.5 rounded-xl border border-gold/15">
                    <YoutubeIcon className="w-4 h-4 text-[#0F4C45] shrink-0" />
                    <input
                      type="text"
                      value={youtube}
                      onChange={(e) => setYoutube(e.target.value)}
                      placeholder="YouTube Channel URL"
                      className="w-full bg-transparent outline-none text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
