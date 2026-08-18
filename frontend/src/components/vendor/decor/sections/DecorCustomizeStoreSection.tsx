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
  Globe,
  FileText,
  X,
  Play,
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
  Sparkle,
  Sparkles as DecorIcon,
  Brush,
  Flower2,
  Boxes
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
  DECOR_COLOR_THEMES,
  DECOR_HIGHLIGHT_OPTIONS,
  ALL_DECOR_THEME_OPTIONS,
  ALL_DECOR_SERVICES_OPTIONS,
  DecorBrandTheme
} from "@/lib/decorTypes";

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

export interface DecorCustomizeStoreSectionProps {
  vendorName?: string;
  onBack?: () => void;
}

export function DecorCustomizeStoreSection({
  vendorName,
  onBack,
}: DecorCustomizeStoreSectionProps = {}) {
  const [vendorData, setVendorData] = useState<VendorProfileData | null>(null);

  // 1. Branding & Identity
  const [logoUrl, setLogoUrl] = useState<string>("");
  const [coverUrl, setCoverUrl] = useState<string>("");
  const [tagline, setTagline] = useState<string>("");
  const [about, setAbout] = useState<string>("");
  const [colorTheme, setColorTheme] = useState<string>("emerald");
  const [galleryLayout, setGalleryLayout] = useState<string>("grid");
  const [introVideo, setIntroVideo] = useState<string>("");
  const [galleryImages, setGalleryImages] = useState<string[]>([]);

  // 2. Social Links
  const [instagram, setInstagram] = useState<string>("");
  const [facebook, setFacebook] = useState<string>("");
  const [youtube, setYoutube] = useState<string>("");
  const [website, setWebsite] = useState<string>("");

  // 3. Decor Highlights Badges (Max 6)
  const [decorHighlights, setDecorHighlights] = useState<string[]>([
    "Floral Specialists",
    "Royal Mandap Designs",
    "3D Stage Renderings",
    "Custom Lighting Installation",
    "Verified Partner",
    "Outstation Travel Available",
  ]);

  // 4. Featured Decor Themes (Max 6, Reorderable)
  const [featuredThemes, setFeaturedThemes] = useState<string[]>([
    "Royal Heritage Rajwada",
    "Bohemian Garden Floral",
    "Minimalist Pastel Elegance",
    "Celestial Candlelight Staging",
  ]);

  // 5. Business Information & Metrics
  const [experienceYears, setExperienceYears] = useState<string>("12+");
  const [teamSize, setTeamSize] = useState<string>("25+ On-Site Craftsmen");
  const [eventsCompleted, setEventsCompleted] = useState<string>("350+ Weddings Decorated");
  const [citiesServed, setCitiesServed] = useState<string>("Delhi NCR, Udaipur, Goa & Destination Weddings");
  const [languagesSpoken, setLanguagesSpoken] = useState<string>("English, Hindi, Punjabi");
  const [decorServices, setDecorServices] = useState<string[]>([
    "Mandap & Stage Staging",
    "Floral Artistry & Installation",
    "Mood Lighting & Trussing",
    "Theme Tenting & Canopies",
    "Luxury Lounge Seating",
    "Entrance Gate Arches",
  ]);

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
  const [closingTime, setClosingTime] = useState<string>("07:30 PM");
  const [weeklyHolidays, setWeeklyHolidays] = useState<string>("Sunday Off (Open for Event Executions)");
  const [consultationNotice, setConsultationNotice] = useState<string>("In-person studio design consultations by prior appointment");
  const [siteSurveyAvailable, setSiteSurveyAvailable] = useState<boolean>(true);

  // 8. Booking Policies & Decor Guidelines
  const [advanceBookingRequired, setAdvanceBookingRequired] = useState<string>(
    "Minimum 30 to 60 days advance booking recommended for wedding season event dates."
  );
  const [advancePaymentPolicy, setAdvancePaymentPolicy] = useState<string>(
    "40% advance on design approval, 40% 7 days prior to event, 20% post-setup."
  );
  const [cancellationPolicy, setCancellationPolicy] = useState<string>(
    "100% advance deposit refund if cancelled 45+ days prior to scheduled event date."
  );
  const [setupTeardownPolicy, setSetupTeardownPolicy] = useState<string>(
    "Setup commences 12 hours prior to event commencement; teardown completed within 4 hours post-event."
  );
  const [propertyDamagePolicy, setPropertyDamagePolicy] = useState<string>(
    "Client responsible for major accidental damage to reusable props, structural trusses & custom lighting rigs."
  );
  const [travelPolicy, setTravelPolicy] = useState<string>(
    "Travel, logistics transport & lodging expenses applicable for outstation destination weddings."
  );

  // Accordion State
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({
    highlights: true,
    featuredThemes: true,
    businessInfo: true,
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
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
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
        console.error("[DecorCustomizeStore] Error loading vendor:", e);
      }
    }

    loadDbVendor();
  }, []);

  const hydrateFields = (data: Partial<VendorProfileData> & Record<string, any>) => {
    if (data.logo || data.logo_url) setLogoUrl(data.logo || data.logo_url || "");
    if (data.coverImage || data.cover_image) setCoverUrl(data.coverImage || data.cover_image || "");
    if (data.tagline) setTagline(data.tagline || "");
    if (data.about || data.description) setAbout(data.about || data.description || "");
    if (data.colorTheme || data.color_theme) setColorTheme(data.colorTheme || data.color_theme || "emerald");
    if (data.introVideo || data.intro_video || data.intro_video_url) {
      setIntroVideo(data.introVideo || data.intro_video || data.intro_video_url || "");
    }

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

    // Decor Highlights
    const rawHighlights = data.decorHighlights || data.decor_highlights || data.storeHighlights || data.store_highlights;
    if (Array.isArray(rawHighlights) && rawHighlights.length > 0) setDecorHighlights(rawHighlights);

    // Featured Themes
    const rawThemes = data.featuredThemes || data.featured_themes || data.featuredCollections || data.featured_collections;
    if (Array.isArray(rawThemes) && rawThemes.length > 0) setFeaturedThemes(rawThemes);

    // Business Info
    if (data.experienceYears || data.experience_years || data.experience) {
      setExperienceYears(String(data.experienceYears || data.experience_years || data.experience || ""));
    }
    if (data.teamSize || data.team_size) setTeamSize(data.teamSize || data.team_size || "");
    if (data.eventsCompleted || data.events_completed) setEventsCompleted(data.eventsCompleted || data.events_completed || "");
    if (data.citiesServed || data.cities_served || data.serviceAreas || data.service_areas) {
      setCitiesServed(data.citiesServed || data.cities_served || data.serviceAreas || data.service_areas || "");
    }
    if (data.languagesSpoken || data.languages_spoken) setLanguagesSpoken(data.languagesSpoken || data.languages_spoken || "");

    const rawServices = data.decorServices || data.decor_services || data.serviceTypes || data.service_types;
    if (Array.isArray(rawServices) && rawServices.length > 0) setDecorServices(rawServices);

    // Contact Buttons
    if (data.actionButtons || data.action_buttons) {
      const act = (data.actionButtons || data.action_buttons || {}) as Record<string, any>;
      setActionButtons({
        callNow: Boolean(act.callNow ?? true),
        whatsapp: Boolean(act.whatsapp ?? true),
        bookAppointment: Boolean(act.bookAppointment ?? true),
        requestQuote: Boolean(act.requestQuote ?? true),
        getDirections: Boolean(act.getDirections ?? true),
        website: Boolean(act.website ?? true),
      });
    }

    // Timings
    if (data.openingTime || data.opening_time) setOpeningTime(data.openingTime || data.opening_time || "");
    if (data.closingTime || data.closing_time) setClosingTime(data.closingTime || data.closing_time || "");
    if (data.weeklyHolidays || data.weekly_holidays) setWeeklyHolidays(data.weeklyHolidays || data.weekly_holidays || "");
    if (data.consultationNotice || data.holidayNotice || data.holiday_notice) {
      setConsultationNotice(data.consultationNotice || data.holidayNotice || data.holiday_notice || "");
    }
    if (data.siteSurveyAvailable !== undefined || data.site_survey_available !== undefined) {
      setSiteSurveyAvailable(Boolean(data.siteSurveyAvailable ?? data.site_survey_available));
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
    if (data.setupTeardownPolicy || data.setup_teardown_policy) {
      setSetupTeardownPolicy(data.setupTeardownPolicy || data.setup_teardown_policy || "");
    }
    if (data.propertyDamagePolicy || data.property_damage_policy) {
      setPropertyDamagePolicy(data.propertyDamagePolicy || data.property_damage_policy || "");
    }
    if (data.travelPolicy || data.travel_policy) {
      setTravelPolicy(data.travelPolicy || data.travel_policy || "");
    }
  };

  const activeTheme = DECOR_COLOR_THEMES.find((t) => t.id === colorTheme) || DECOR_COLOR_THEMES[0];
  const currentDisplayName = vendorName || vendorData?.boutique_name || vendorData?.name || "The Wedding Canvas Decorators";
  const currentLocation = [vendorData?.city, vendorData?.district].filter(Boolean).join(", ") || "Delhi NCR, India";

  const initials = currentDisplayName
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .join("")
    .slice(0, 2)
    .toUpperCase() || "WC";

  const toggleHighlight = (badge: string) => {
    if (!decorHighlights.includes(badge) && decorHighlights.length >= 6) {
      showVendorToast("Maximum 6 decor highlights can be selected for storefront display.", "info");
      return;
    }
    setDecorHighlights((prev) =>
      prev.includes(badge) ? prev.filter((b) => b !== badge) : [...prev, badge]
    );
  };

  const toggleTheme = (theme: string) => {
    if (!featuredThemes.includes(theme) && featuredThemes.length >= 6) {
      showVendorToast("Maximum 6 featured decor themes can be pinned.", "info");
      return;
    }
    setFeaturedThemes((prev) =>
      prev.includes(theme) ? prev.filter((t) => t !== theme) : [...prev, theme]
    );
  };

  const moveTheme = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= featuredThemes.length) return;
    const newThemes = [...featuredThemes];
    const temp = newThemes[index];
    newThemes[index] = newThemes[targetIndex];
    newThemes[targetIndex] = temp;
    setFeaturedThemes(newThemes);
  };

  const toggleDecorService = (service: string) => {
    setDecorServices((prev) =>
      prev.includes(service) ? prev.filter((s) => s !== service) : [...prev, service]
    );
  };

  // Upload Handlers
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploadingLogo(true);
      const res = await uploadImageToCloudinaryDetailed(file, "cloche/vendors/logos");
      setLogoUrl(res.secure_url);
      showVendorToast("✓ Decor Studio Logo uploaded successfully", "success");
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
      showVendorToast("✓ Stage & Setup Cover photo uploaded successfully", "success");
    } catch (err: any) {
      showVendorToast(err?.message || "Failed to upload cover photo", "error");
    } finally {
      setIsUploadingCover(false);
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 50 * 1024 * 1024) {
      showVendorToast("Video file exceeds the 50MB size limit.", "error");
      return;
    }
    try {
      setIsUploadingVideo(true);
      const res = await uploadImageToCloudinaryDetailed(file, "cloche/vendors/videos");
      setIntroVideo(res.secure_url);
      showVendorToast("✓ Setup Walkthrough Video uploaded successfully", "success");
    } catch (err: any) {
      showVendorToast(err?.message || "Failed to upload video", "error");
    } finally {
      setIsUploadingVideo(false);
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
      showVendorToast(`✓ Added ${newUrls.length} photos to Decor Portfolio`, "success");
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
        introVideo: introVideo.trim(),
        intro_video: introVideo.trim(),
        galleryImages,
        gallery_images: galleryImages,

        // Social Links
        instagram: instagram.trim(),
        facebook: facebook.trim(),
        youtube: youtube.trim(),
        website: website.trim(),

        // Decor Highlights & Themes
        decorHighlights,
        decor_highlights: decorHighlights,
        storeHighlights: decorHighlights,
        store_highlights: decorHighlights,
        featuredThemes,
        featured_themes: featuredThemes,
        featuredCollections: featuredThemes,
        featured_collections: featuredThemes,

        // Business Info & Metrics
        experienceYears: experienceYears.trim(),
        experience_years: experienceYears.trim(),
        teamSize: teamSize.trim(),
        team_size: teamSize.trim(),
        eventsCompleted: eventsCompleted.trim(),
        events_completed: eventsCompleted.trim(),
        citiesServed: citiesServed.trim(),
        cities_served: citiesServed.trim(),
        serviceAreas: citiesServed.trim(),
        service_areas: citiesServed.trim(),
        languagesSpoken: languagesSpoken.trim(),
        languages_spoken: languagesSpoken.trim(),
        decorServices,
        decor_services: decorServices,

        // Action Buttons
        actionButtons,
        action_buttons: actionButtons,

        // Hours & Consultation
        openingTime: openingTime.trim(),
        opening_time: openingTime.trim(),
        closingTime: closingTime.trim(),
        closing_time: closingTime.trim(),
        weeklyHolidays: weeklyHolidays.trim(),
        weekly_holidays: weeklyHolidays.trim(),
        consultationNotice: consultationNotice.trim(),
        holidayNotice: consultationNotice.trim(),
        siteSurveyAvailable,
        site_survey_available: siteSurveyAvailable,

        // Policies
        advanceBookingRequired: advanceBookingRequired.trim(),
        advance_booking_required: advanceBookingRequired.trim(),
        advancePaymentPolicy: advancePaymentPolicy.trim(),
        advance_payment_policy: advancePaymentPolicy.trim(),
        cancellationPolicy: cancellationPolicy.trim(),
        cancellation_policy: cancellationPolicy.trim(),
        setupTeardownPolicy: setupTeardownPolicy.trim(),
        setup_teardown_policy: setupTeardownPolicy.trim(),
        propertyDamagePolicy: propertyDamagePolicy.trim(),
        property_damage_policy: propertyDamagePolicy.trim(),
        travelPolicy: travelPolicy.trim(),
        travel_policy: travelPolicy.trim(),

        storefront: {
          theme: colorTheme,
          brandColors: activeTheme,
          coverImage: coverUrl,
          logo: logoUrl,
          tagline: tagline.trim(),
          about: about.trim(),
          storeHighlights: decorHighlights,
          featuredCollections: featuredThemes,
          galleryLayout: galleryLayout,
          gallery: galleryImages.map((url, i) => ({ url, caption: `Decor Concept ${i + 1}` })),
          actionButtons,
          businessInfo: {
            experienceYears: experienceYears.trim(),
            rentalAvailable: true,
            homeDeliveryAvailable: siteSurveyAvailable,
            homeTrialAvailable: false,
            collectionsCount: `${eventsCompleted} Events`,
            citiesServed: citiesServed.trim(),
          },
          workingHours: {
            workingDays: "All Days",
            openingTime: openingTime.trim(),
            closingTime: closingTime.trim(),
            weeklyOff: weeklyHolidays.trim(),
            holidayNotice: consultationNotice.trim(),
          },
          policies: {
            rentalPolicy: advanceBookingRequired.trim(),
            securityDepositPolicy: advancePaymentPolicy.trim(),
            cancellationPolicy: cancellationPolicy.trim(),
            refundPolicy: setupTeardownPolicy.trim(),
            damagePolicy: propertyDamagePolicy.trim(),
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
        showVendorToast("✓ Decorator storefront customization saved & synchronized!", "success");
        setTimeout(() => setSaved(false), 3500);
      } else {
        showVendorToast("Unable to save storefront customization. Please try again.", "error");
      }
    } catch (err) {
      console.error("[DecorCustomizeStore] Save error:", err);
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
        ref={videoInputRef}
        type="file"
        accept="video/mp4,video/webm,video/quicktime"
        className="hidden"
        onChange={handleVideoUpload}
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
              Customize Decorator Storefront &amp; Themes
            </h2>
          </div>
          <p className="text-xs text-charcoal/70">
            Real-time visual editor. Colors, banner, decor highlights, signature themes, and setup policies update immediately on your public storefront.
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
            id: "preview-decor",
            name: currentDisplayName,
            business_name: currentDisplayName,
            boutique_name: currentDisplayName,
            category: "wedding-decor",
            categoryLabel: "Wedding Decorator",
            location: currentLocation,
            city: vendorData?.city || "Kochi",
            state: "Kerala",
            rating: 5.0,
            reviews: 20,
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
            gallery: galleryImages.map((url, i) => ({ url, caption: `Decor Concept ${i + 1}` })),
            startingPrice: (vendorData as any)?.startingPrice || (vendorData as any)?.starting_price || "₹50,000",
            phone: "+91 98470 12345",
            whatsapp: "+91 98470 12345",
            email: "decor@cloche.com",
            address: `${currentLocation}, Kerala`,
            storeHighlights: decorHighlights,
            decorHighlights: decorHighlights,
            featuredCollections: featuredThemes,
            featuredThemes: featuredThemes,
            actionButtons: actionButtons,
            businessInfo: {
              experienceYears: experienceYears,
              rentalAvailable: true,
              homeDeliveryAvailable: siteSurveyAvailable,
              homeTrialAvailable: false,
              collectionsCount: `${eventsCompleted} Events`,
              citiesServed: citiesServed,
            },
            workingHours: {
              workingDays: "All Days",
              openingTime: openingTime,
              closingTime: closingTime,
              weeklyOff: weeklyHolidays,
              holidayNotice: consultationNotice,
            },
            policies: {
              rentalPolicy: advanceBookingRequired,
              securityDepositPolicy: advancePaymentPolicy,
              cancellationPolicy: cancellationPolicy,
              refundPolicy: setupTeardownPolicy,
              damagePolicy: propertyDamagePolicy,
            },
          }}
          storefront={{
            theme: colorTheme,
            brandColors: activeTheme,
            coverImage: coverUrl,
            logo: logoUrl,
            tagline: tagline,
            about: about,
            storeHighlights: decorHighlights,
            featuredCollections: featuredThemes,
            galleryLayout: galleryLayout,
            gallery: galleryImages.map((url, i) => ({ url, caption: `Decor Concept ${i + 1}` })),
            actionButtons: actionButtons,
            businessInfo: {
              experienceYears: experienceYears,
              rentalAvailable: true,
              homeDeliveryAvailable: siteSurveyAvailable,
              homeTrialAvailable: false,
              collectionsCount: `${eventsCompleted} Events`,
              citiesServed: citiesServed,
            },
            workingHours: {
              workingDays: "All Days",
              openingTime: openingTime,
              closingTime: closingTime,
              weeklyOff: weeklyHolidays,
              holidayNotice: consultationNotice,
            },
            policies: {
              rentalPolicy: advanceBookingRequired,
              securityDepositPolicy: advancePaymentPolicy,
              cancellationPolicy: cancellationPolicy,
              refundPolicy: setupTeardownPolicy,
              damagePolicy: propertyDamagePolicy,
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
        {/* Section 1: Store Highlights (Badges, Max 6) */}
        <div className="bg-white rounded-2xl border border-gold/15 overflow-hidden shadow-xs">
          <button
            type="button"
            onClick={() => toggleAccordion("highlights")}
            className="w-full p-5 text-left font-serif font-bold text-base text-charcoal flex items-center justify-between bg-[#FAF7F2]/60 hover:bg-[#FAF7F2] transition-colors"
          >
            <div className="flex items-center gap-3">
              <Award style={{ color: activeTheme.primary }} className="w-5 h-5" />
              <div>
                <span className="block">1. Store Highlights & Decor Badges (Max 6)</span>
                <span className="text-xs font-sans font-normal text-charcoal/60">
                  Select up to 6 key decorator badges to display on your public storefront ({decorHighlights.length}/6 selected)
                </span>
              </div>
            </div>
            {openAccordions.highlights ? <ChevronUp className="w-4 h-4 text-charcoal/40" /> : <ChevronDown className="w-4 h-4 text-charcoal/40" />}
          </button>

          {openAccordions.highlights && (
            <div className="p-5 border-t border-gold/10 space-y-4 text-xs animate-in fade-in duration-200">
              <p className="text-charcoal/70 leading-relaxed">
                Click to toggle Decorator badges (maximum 6 highlighted on public profile):
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                {DECOR_HIGHLIGHT_OPTIONS.map((badge) => {
                  const isSelected = decorHighlights.includes(badge);
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

        {/* Section 2: Featured Decor Themes (Max 6, Reorderable) */}
        <div className="bg-white rounded-2xl border border-gold/15 overflow-hidden shadow-xs">
          <button
            type="button"
            onClick={() => toggleAccordion("featuredThemes")}
            className="w-full p-5 text-left font-serif font-bold text-base text-charcoal flex items-center justify-between bg-[#FAF7F2]/60 hover:bg-[#FAF7F2] transition-colors"
          >
            <div className="flex items-center gap-3">
              <Brush style={{ color: activeTheme.primary }} className="w-5 h-5" />
              <div>
                <span className="block">2. Featured Decor Themes & Concepts (Max 6)</span>
                <span className="text-xs font-sans font-normal text-charcoal/60">
                  Select and pin signature decor themes in your preferred display order ({featuredThemes.length}/6 pinned)
                </span>
              </div>
            </div>
            {openAccordions.featuredThemes ? <ChevronUp className="w-4 h-4 text-charcoal/40" /> : <ChevronDown className="w-4 h-4 text-charcoal/40" />}
          </button>

          {openAccordions.featuredThemes && (
            <div className="p-5 border-t border-gold/10 space-y-4 text-xs animate-in fade-in duration-200">
              <div>
                <span className="font-bold text-charcoal block mb-2">Available Themes & Concepts (Click to Pin/Unpin):</span>
                <div className="flex flex-wrap gap-2">
                  {ALL_DECOR_THEME_OPTIONS.map((theme) => {
                    const isPinned = featuredThemes.includes(theme);
                    return (
                      <button
                        key={theme}
                        type="button"
                        onClick={() => toggleTheme(theme)}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                          isPinned
                            ? "bg-[#0F4C45] text-white border-[#0F4C45]"
                            : "bg-[#FAF7F2] text-charcoal border-gold/20 hover:bg-gold/15"
                        }`}
                      >
                        {theme} {isPinned ? "✓" : "+"}
                      </button>
                    );
                  })}
                </div>
              </div>

              {featuredThemes.length > 0 && (
                <div className="pt-3 border-t border-gold/10 space-y-2">
                  <span className="font-bold text-charcoal block">Pinned Display Order (Use arrows to reorder):</span>
                  <div className="space-y-1.5">
                    {featuredThemes.map((theme, idx) => (
                      <div
                        key={theme}
                        className="p-3 bg-[#FAF7F2] rounded-xl border border-gold/15 flex items-center justify-between text-xs"
                      >
                        <span className="font-bold text-charcoal flex items-center gap-2">
                          <Brush className="w-3.5 h-3.5 text-[#0F4C45]" /> {idx + 1}. {theme}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => moveTheme(idx, "up")}
                            className="p-1 rounded bg-white text-charcoal hover:bg-gray-100 disabled:opacity-30 cursor-pointer"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={idx === featuredThemes.length - 1}
                            onClick={() => moveTheme(idx, "down")}
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

        {/* Section 3: Business Information & Design Services */}
        <div className="bg-white rounded-2xl border border-gold/15 overflow-hidden shadow-xs">
          <button
            type="button"
            onClick={() => toggleAccordion("businessInfo")}
            className="w-full p-5 text-left font-serif font-bold text-base text-charcoal flex items-center justify-between bg-[#FAF7F2]/60 hover:bg-[#FAF7F2] transition-colors"
          >
            <div className="flex items-center gap-3">
              <Layers style={{ color: activeTheme.primary }} className="w-5 h-5" />
              <div>
                <span className="block">3. Decorator Business Information & Services</span>
                <span className="text-xs font-sans font-normal text-charcoal/60">
                  Experience, on-site crew size, completed weddings, service cities & design capabilities
                </span>
              </div>
            </div>
            {openAccordions.businessInfo ? <ChevronUp className="w-4 h-4 text-charcoal/40" /> : <ChevronDown className="w-4 h-4 text-charcoal/40" />}
          </button>

          {openAccordions.businessInfo && (
            <div className="p-5 border-t border-gold/10 space-y-4 text-xs animate-in fade-in duration-200">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="block font-bold text-charcoal">About Decorator Studio / Bio</label>
                  <span className={`text-[10px] ${about.length > 500 ? "text-red-500 font-bold" : "text-charcoal/50"}`}>
                    {about.length}/500 chars
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  placeholder="Describe your design philosophy, floral artistry, structural mandap staging & theme execution..."
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
                    placeholder="e.g. 12+ Years Exp."
                    className="w-full p-2.5 bg-[#FAF7F2] border border-gold/15 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-charcoal mb-1">On-Site Crew & Craftsmen</label>
                  <input
                    type="text"
                    value={teamSize}
                    onChange={(e) => setTeamSize(e.target.value)}
                    placeholder="e.g. 25+ On-Site Craftsmen"
                    className="w-full p-2.5 bg-[#FAF7F2] border border-gold/15 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-charcoal mb-1">Events & Weddings Completed</label>
                  <input
                    type="text"
                    value={eventsCompleted}
                    onChange={(e) => setEventsCompleted(e.target.value)}
                    placeholder="e.g. 350+ Weddings Decorated"
                    className="w-full p-2.5 bg-[#FAF7F2] border border-gold/15 rounded-xl outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-charcoal mb-1">Cities Covered & Service Areas</label>
                  <input
                    type="text"
                    value={citiesServed}
                    onChange={(e) => setCitiesServed(e.target.value)}
                    placeholder="e.g. Delhi NCR, Udaipur, Goa & Destination Weddings"
                    className="w-full p-2.5 bg-[#FAF7F2] border border-gold/15 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-charcoal mb-1">Languages Spoken</label>
                  <input
                    type="text"
                    value={languagesSpoken}
                    onChange={(e) => setLanguagesSpoken(e.target.value)}
                    placeholder="e.g. English, Hindi, Punjabi"
                    className="w-full p-2.5 bg-[#FAF7F2] border border-gold/15 rounded-xl outline-none"
                  />
                </div>

                <div className="sm:col-span-3 pt-2 space-y-2 border-t border-gold/10">
                  <span className="font-bold text-charcoal block">Design Services Offered (Select All That Apply):</span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {ALL_DECOR_SERVICES_OPTIONS.map((service) => {
                      const isChecked = decorServices.includes(service);
                      return (
                        <label
                          key={service}
                          className="p-2.5 bg-[#FAF7F2] rounded-xl border border-gold/15 flex items-center justify-between cursor-pointer"
                        >
                          <span className="font-bold text-[11px] text-charcoal">{service}</span>
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleDecorService(service)}
                            className="rounded accent-[#0F4C45] w-3.5 h-3.5"
                          />
                        </label>
                      );
                    })}
                  </div>
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
                Enable or disable action buttons for visitors viewing your Decorator studio profile:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <label className="p-3 bg-[#FAF7F2] rounded-xl border border-gold/15 flex items-center justify-between cursor-pointer">
                  <span className="font-bold text-charcoal flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#0F4C45]" /> Call Studio
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
                    <Calendar className="w-3.5 h-3.5 text-[#0F4C45]" /> Book Consultation
                  </span>
                  <input
                    type="checkbox"
                    checked={actionButtons.bookAppointment}
                    onChange={(e) => setActionButtons((prev) => ({ ...prev, bookAppointment: e.target.checked }))}
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

        {/* Section 5: Studio Hours & Consultation Timings */}
        <div className="bg-white rounded-2xl border border-gold/15 overflow-hidden shadow-xs">
          <button
            type="button"
            onClick={() => toggleAccordion("timings")}
            className="w-full p-5 text-left font-serif font-bold text-base text-charcoal flex items-center justify-between bg-[#FAF7F2]/60 hover:bg-[#FAF7F2] transition-colors"
          >
            <div className="flex items-center gap-3">
              <Clock style={{ color: activeTheme.primary }} className="w-5 h-5" />
              <div>
                <span className="block">5. Studio Hours & Consultation Timings</span>
                <span className="text-xs font-sans font-normal text-charcoal/60">
                  Studio timings, weekly holidays & site survey availability
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
                    placeholder="e.g. 07:30 PM"
                    className="w-full p-2.5 bg-[#FAF7F2] border border-gold/15 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-charcoal mb-1">Weekly Off / Holidays</label>
                  <input
                    type="text"
                    value={weeklyHolidays}
                    onChange={(e) => setWeeklyHolidays(e.target.value)}
                    placeholder="e.g. Sunday Off"
                    className="w-full p-2.5 bg-[#FAF7F2] border border-gold/15 rounded-xl outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-charcoal mb-1">Consultation Notice</label>
                  <input
                    type="text"
                    value={consultationNotice}
                    onChange={(e) => setConsultationNotice(e.target.value)}
                    placeholder="e.g. In-person studio design consultations by prior appointment"
                    className="w-full p-2.5 bg-[#FAF7F2] border border-gold/15 rounded-xl outline-none"
                  />
                </div>

                <div className="sm:col-span-3 pt-1">
                  <label className="p-3 bg-[#FAF7F2] rounded-xl border border-gold/15 flex items-center justify-between cursor-pointer">
                    <div>
                      <span className="font-bold text-charcoal block">On-Site Venue Recce & Survey Available</span>
                      <span className="text-[11px] text-charcoal/60">Design team conducts physical venue inspection prior to setup</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={siteSurveyAvailable}
                      onChange={(e) => setSiteSurveyAvailable(e.target.checked)}
                      className="rounded accent-[#0F4C45] w-4 h-4 shrink-0"
                    />
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Section 6: Booking Policies & Decor Guidelines */}
        <div className="bg-white rounded-2xl border border-gold/15 overflow-hidden shadow-xs">
          <button
            type="button"
            onClick={() => toggleAccordion("policies")}
            className="w-full p-5 text-left font-serif font-bold text-base text-charcoal flex items-center justify-between bg-[#FAF7F2]/60 hover:bg-[#FAF7F2] transition-colors"
          >
            <div className="flex items-center gap-3">
              <ShieldCheck style={{ color: activeTheme.primary }} className="w-5 h-5" />
              <div>
                <span className="block">6. Booking Policies & Decor Guidelines</span>
                <span className="text-xs font-sans font-normal text-charcoal/60">
                  Advance booking, payment schedule, setup timings, damage terms & travel rules
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
                    placeholder="e.g. Minimum 30 to 60 days advance booking recommended"
                    className="w-full p-2.5 bg-[#FAF7F2] border border-gold/15 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-charcoal mb-1">Advance Payment Schedule</label>
                  <input
                    type="text"
                    value={advancePaymentPolicy}
                    onChange={(e) => setAdvancePaymentPolicy(e.target.value)}
                    placeholder="e.g. 40% on design approval, 40% 7 days prior, 20% post-setup"
                    className="w-full p-2.5 bg-[#FAF7F2] border border-gold/15 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-charcoal mb-1">Cancellation Refund Policy</label>
                  <input
                    type="text"
                    value={cancellationPolicy}
                    onChange={(e) => setCancellationPolicy(e.target.value)}
                    placeholder="e.g. 100% refund if cancelled 45+ days prior to event"
                    className="w-full p-2.5 bg-[#FAF7F2] border border-gold/15 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-charcoal mb-1">Setup & Teardown Timings</label>
                  <input
                    type="text"
                    value={setupTeardownPolicy}
                    onChange={(e) => setSetupTeardownPolicy(e.target.value)}
                    placeholder="e.g. Setup 12h prior; teardown 4h post-event"
                    className="w-full p-2.5 bg-[#FAF7F2] border border-gold/15 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-charcoal mb-1">Property Damage & Props Policy</label>
                  <input
                    type="text"
                    value={propertyDamagePolicy}
                    onChange={(e) => setPropertyDamagePolicy(e.target.value)}
                    placeholder="e.g. Client responsible for major prop/truss damage"
                    className="w-full p-2.5 bg-[#FAF7F2] border border-gold/15 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-charcoal mb-1">Outstation Travel Policy</label>
                  <input
                    type="text"
                    value={travelPolicy}
                    onChange={(e) => setTravelPolicy(e.target.value)}
                    placeholder="e.g. Transport & stay covered for outstation weddings"
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
                Choose a signature theme that highlights your Decor studio's brand aesthetic:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                {DECOR_COLOR_THEMES.map((theme) => {
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

        {/* Section 8: Studio Logo, Cover Banner & Media */}
        <div className="bg-white rounded-2xl border border-gold/15 overflow-hidden shadow-xs">
          <button
            type="button"
            onClick={() => toggleAccordion("branding")}
            className="w-full p-5 text-left font-serif font-bold text-base text-charcoal flex items-center justify-between bg-[#FAF7F2]/60 hover:bg-[#FAF7F2] transition-colors"
          >
            <div className="flex items-center gap-3">
              <ImageIcon style={{ color: activeTheme.primary }} className="w-5 h-5" />
              <div>
                <span className="block">8. Studio Logo, Cover Banner & Media</span>
                <span className="text-xs font-sans font-normal text-charcoal/60">
                  Emblem logo, setup cover banner, tagline, walkthrough reel & portfolio gallery
                </span>
              </div>
            </div>
            {openAccordions.branding ? <ChevronUp className="w-4 h-4 text-charcoal/40" /> : <ChevronDown className="w-4 h-4 text-charcoal/40" />}
          </button>

          {openAccordions.branding && (
            <div className="p-5 border-t border-gold/10 space-y-5 text-xs animate-in fade-in duration-200">
              {/* Media Upload Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Logo Upload Card */}
                <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-gold/15 flex flex-col items-center text-center space-y-3">
                  <div className="w-20 h-20 rounded-2xl bg-white border border-gold/20 flex items-center justify-center overflow-hidden relative shadow-xs">
                    {logoUrl ? (
                      <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
                    ) : (
                      <Flower2 className="w-8 h-8 text-charcoal/30" />
                    )}
                  </div>
                  <div>
                    <span className="font-bold text-charcoal block">Studio Logo / Emblem</span>
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

                {/* Intro Video Upload Card */}
                <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-gold/15 flex flex-col items-center text-center space-y-3">
                  <div className="w-full h-20 rounded-2xl bg-white border border-gold/20 flex items-center justify-center overflow-hidden relative shadow-xs">
                    {introVideo ? (
                      <div className="flex items-center gap-1 text-emerald-700 font-bold text-xs">
                        <Play className="w-4 h-4 fill-emerald-700" /> Video Ready
                      </div>
                    ) : (
                      <Video className="w-8 h-8 text-charcoal/30" />
                    )}
                  </div>
                  <div>
                    <span className="font-bold text-charcoal block">Setup Walkthrough Reel</span>
                    <span className="text-[10px] text-charcoal/50">MP4, WebM (Max 50MB)</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => videoInputRef.current?.click()}
                    disabled={isUploadingVideo}
                    className="w-full py-2 px-3 bg-white border border-gold/20 rounded-xl text-charcoal font-bold text-xs hover:bg-gold/10 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {isUploadingVideo ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" /> Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-3.5 h-3.5 text-[#0F4C45]" /> Upload Video
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Tagline Input */}
              <div>
                <label className="block font-bold text-charcoal mb-1">Decorator Studio Tagline / Subtitle</label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="e.g. Breathtaking Mandaps, Impeccable Floral Artistry & Bespoke Wedding Concepts"
                  className="w-full p-2.5 bg-[#FAF7F2] border border-gold/15 rounded-xl outline-none"
                />
              </div>

              {/* Portfolio Decor Photos */}
              <div className="space-y-3 pt-2 border-t border-gold/10">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-charcoal block">Decor Portfolio Photos ({galleryImages.length})</span>
                    <span className="text-[10px] text-charcoal/60">Upload high-resolution stage & floral design photography</span>
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
                        <img src={img} alt={`Decor Portfolio ${i + 1}`} className="w-full h-full object-cover" />
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
                      placeholder="Instagram URL (e.g. instagram.com/theweddingcanvas)"
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
