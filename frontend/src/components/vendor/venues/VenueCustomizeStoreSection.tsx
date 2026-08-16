"use client";

import { useState, useEffect, useRef } from "react";
import {
  Building2,
  Palette,
  Image as ImageIcon,
  Sparkles,
  CheckCircle,
  Save,
  Eye,
  Loader2,
  Video,
  Globe,
  FileText,
  Clock,
  MapPin,
  Phone,
  MessageCircle,
  Calendar,
  Layers,
  Check,
  Building,
  Users,
  Compass,
  Car,
  ShieldCheck,
  ArrowUpRight,
  HelpCircle,
  X,
  Play
} from "lucide-react";
import { VendorImageUploader } from "@/components/ui/VendorImageUploader";
import { uploadImageToCloudinaryDetailed } from "@/lib/cloudinary";
import {
  fetchAuthenticatedVendorFromDb,
  getActiveVendorIdentity,
  syncVendorProfileWithDatabase,
  showVendorToast
} from "@/lib/vendorStore";

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

export interface ColorThemeOption {
  id: string;
  label: string;
  primary: string;
  secondary: string;
  accent: string;
  badgeBg: string;
  badgeText: string;
}

export const VENUE_COLOR_THEMES: ColorThemeOption[] = [
  { id: "emerald", label: "Emerald Green", primary: "#0F4C45", secondary: "#072B27", accent: "#C8A96A", badgeBg: "#0F4C45", badgeText: "#FFFFFF" },
  { id: "rosegold", label: "Rose Gold", primary: "#B87333", secondary: "#915622", accent: "#E8A598", badgeBg: "#B87333", badgeText: "#FFFFFF" },
  { id: "burgundy", label: "Burgundy", primary: "#800020", secondary: "#4A0012", accent: "#D4AF37", badgeBg: "#800020", badgeText: "#FFFFFF" },
  { id: "beige", label: "Beige / Sand", primary: "#8C7355", secondary: "#604E38", accent: "#D4B896", badgeBg: "#8C7355", badgeText: "#FFFFFF" },
  { id: "blackgold", label: "Black & Gold", primary: "#1A1A1A", secondary: "#0A0A0A", accent: "#C8A96A", badgeBg: "#1A1A1A", badgeText: "#C8A96A" },
  { id: "softpink", label: "Soft Pink", primary: "#C27BA0", secondary: "#9E5A7E", accent: "#F4C2C2", badgeBg: "#C27BA0", badgeText: "#FFFFFF" },
];

export const VENUE_HIGHLIGHT_OPTIONS = [
  "Premium Wedding Venue",
  "Luxury Venue",
  "Outdoor Lawn",
  "Indoor AC Hall",
  "Beach Venue",
  "Destination Wedding",
  "Parking Available",
  "Bridal Suite",
  "Catering Available",
  "Decoration Included",
  "Wheelchair Accessible",
  "Verified Partner",
];

export const VENUE_FACILITIES_OPTIONS = [
  "Indoor Hall",
  "Outdoor Lawn",
  "Banquet Hall",
  "AC Hall",
  "Bridal Room",
  "Groom Room",
  "Dining Area",
  "Stage",
  "LED Wall",
  "Sound System",
  "DJ Area",
  "Generator Backup",
  "Power Backup",
  "Parking",
  "Valet Parking",
  "Lift",
  "Wheelchair Access",
  "Kids Area",
  "Accommodation Rooms",
  "Swimming Pool",
  "Garden Area",
];

export const CONTACT_ACTION_OPTIONS = [
  { id: "call", label: "Call Now", icon: Phone },
  { id: "whatsapp", label: "WhatsApp", icon: MessageCircle },
  { id: "visit", label: "Book Venue Visit", icon: Calendar },
  { id: "quote", label: "Request Quote", icon: FileText },
  { id: "directions", label: "Get Directions", icon: Compass },
  { id: "website", label: "Website", icon: Globe },
];

interface VenueCustomizeStoreSectionProps {
  vendorName?: string;
}

export function VenueCustomizeStoreSection({ vendorName = "Wedding Venue" }: VenueCustomizeStoreSectionProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const videoInputRef = useRef<HTMLInputElement>(null);

  // 1. Branding & Visual Identity
  const [venueName, setVenueName] = useState(vendorName);
  const [logoUrl, setLogoUrl] = useState<string>("");
  const [coverUrl, setCoverUrl] = useState<string>("");
  const [tagline, setTagline] = useState<string>("");
  const [about, setAbout] = useState<string>("");
  const [colorTheme, setColorTheme] = useState<string>("emerald");
  const [introVideo, setIntroVideo] = useState<string>("");

  // 2. Social Media Links
  const [instagram, setInstagram] = useState<string>("");
  const [facebook, setFacebook] = useState<string>("");
  const [website, setWebsite] = useState<string>("");
  const [youtube, setYoutube] = useState<string>("");

  // 3. Venue Highlights
  const [venueHighlights, setVenueHighlights] = useState<string[]>([
    "Premium Wedding Venue",
    "Luxury Venue",
    "Outdoor Lawn",
    "Indoor AC Hall",
    "Parking Available",
    "Bridal Suite",
  ]);

  // 4. Venue Facilities
  const [facilities, setFacilities] = useState<string[]>([
    "Indoor Hall",
    "Outdoor Lawn",
    "Banquet Hall",
    "AC Hall",
    "Bridal Room",
    "Dining Area",
    "Stage",
    "Generator Backup",
    "Parking",
    "Valet Parking",
  ]);

  // 5. Business Information
  const [yearsInBusiness, setYearsInBusiness] = useState<string>("12");
  const [guestCapacity, setGuestCapacity] = useState<string>("500 - 1500 Guests");
  const [numberOfHalls, setNumberOfHalls] = useState<string>("3 Halls");
  const [indoorCapacity, setIndoorCapacity] = useState<string>("800 Guests");
  const [outdoorCapacity, setOutdoorCapacity] = useState<string>("1200 Guests");
  const [parkingCapacity, setParkingCapacity] = useState<string>("250 Cars");
  const [serviceAreas, setServiceAreas] = useState<string>("Kochi, Ernakulam & Kerala");
  const [languagesSpoken, setLanguagesSpoken] = useState<string>("English, Malayalam, Hindi, Tamil");
  const [locationStr, setLocationStr] = useState<string>("Kochi, Kerala");

  // 6. Contact Action Buttons
  const [contactActions, setContactActions] = useState<string[]>([
    "Call Now",
    "WhatsApp",
    "Book Venue Visit",
    "Request Quote",
    "Get Directions",
    "Website",
  ]);

  // 7. Working Hours & Timings
  const [openingTime, setOpeningTime] = useState<string>("08:00 AM");
  const [closingTime, setClosingTime] = useState<string>("10:00 PM");
  const [weeklyHolidays, setWeeklyHolidays] = useState<string>("None / Open 7 Days");
  const [publicHolidayAvailability, setPublicHolidayAvailability] = useState<string>("Available for events on all public holidays");
  const [venueVisitTimings, setVenueVisitTimings] = useState<string>("10:00 AM - 06:00 PM (Prior appointment recommended)");

  // 8. Booking Policies
  const [advanceBookingRequired, setAdvanceBookingRequired] = useState<string>("Minimum 2 to 4 months in advance recommended for peak wedding dates.");
  const [advancePaymentPolicy, setAdvancePaymentPolicy] = useState<string>("25% advance upon booking confirmation, 50% 30 days prior to event, balance 25% on event day.");
  const [cancellationPolicy, setCancellationPolicy] = useState<string>("Full refund if cancelled 90+ days prior; 50% refund within 30 to 89 days; Non-refundable within 30 days.");
  const [refundPolicy, setRefundPolicy] = useState<string>("Security damage deposit is refunded via bank transfer within 48 hours post-event walkthrough inspection.");
  const [overtimeCharges, setOvertimeCharges] = useState<string>("₹15,000 per additional hour beyond the reserved morning/evening slot timing.");
  const [decorationRules, setDecorationRules] = useState<string>("In-house empanelled decorators and external approved decorators are welcome with prior venue approval.");
  const [outsideCateringPolicy, setOutsideCateringPolicy] = useState<string>("Both in-house catering and external professional catering are permitted with a standard kitchen access fee.");
  const [outsidePhotographyPolicy, setOutsidePhotographyPolicy] = useState<string>("Outside candid photographers, cinematographers, and drone pilots are fully permitted.");
  const [noiseRestrictions, setNoiseRestrictions] = useState<string>("Outdoor amplified music permitted until 10:00 PM per municipal guidelines. Indoor acoustic halls support 24/7 events.");
  const [alcoholPolicy, setAlcoholPolicy] = useState<string>("Permitted with a valid state excise temporary event license. Dedicated bar setup areas provided.");
  const [eventTimingRules, setEventTimingRules] = useState<string>("Morning Slot: 06:00 AM - 03:00 PM | Evening Slot: 05:00 PM - 11:30 PM | Full Day: 06:00 AM - 11:30 PM.");

  // Pre-fill from Supabase on mount
  useEffect(() => {
    async function loadVenueData() {
      setIsLoading(true);
      try {
        const cached = getActiveVendorIdentity();
        if (cached) {
          hydrateState(cached);
        }

        const fresh = await fetchAuthenticatedVendorFromDb();
        if (fresh) {
          hydrateState(fresh);
        }
      } catch (err) {
        console.error("Failed to load venue customization:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadVenueData();
  }, []);

  const hydrateState = (data: any) => {
    if (data.name || data.boutique_name || data.business_name) {
      setVenueName(data.name || data.boutique_name || data.business_name);
    }
    if (data.logo || data.logo_url) setLogoUrl(data.logo || data.logo_url);
    if (data.coverImage || data.cover_image) setCoverUrl(data.coverImage || data.cover_image);
    if (data.tagline) setTagline(data.tagline);
    if (data.about || data.description) setAbout(data.about || data.description);
    if (data.colorTheme || data.color_theme) setColorTheme(data.colorTheme || data.color_theme);
    if (data.introVideo || data.intro_video_url || data.intro_video) {
      setIntroVideo(data.introVideo || data.intro_video_url || data.intro_video);
    }

    // Social Links
    if (data.instagram) setInstagram(data.instagram);
    if (data.facebook) setFacebook(data.facebook);
    if (data.website) setWebsite(data.website);
    if (data.youtube) setYoutube(data.youtube);

    // Venue Highlights
    const hl = data.venueHighlights || data.venue_highlights || data.storeHighlights || data.store_highlights;
    if (Array.isArray(hl) && hl.length > 0) setVenueHighlights(hl);

    // Facilities
    const fac = data.facilities || data.venue_facilities;
    if (Array.isArray(fac) && fac.length > 0) setFacilities(fac);

    // Business Info
    if (data.yearsInBusiness || data.years_in_business || data.experience_years || data.experience) {
      setYearsInBusiness(String(data.yearsInBusiness || data.years_in_business || data.experience_years || data.experience));
    }
    if (data.guestCapacity || data.guest_capacity) setGuestCapacity(data.guestCapacity || data.guest_capacity);
    if (data.numberOfHalls || data.number_of_halls) setNumberOfHalls(data.numberOfHalls || data.number_of_halls);
    if (data.indoorCapacity || data.indoor_capacity) setIndoorCapacity(data.indoorCapacity || data.indoor_capacity);
    if (data.outdoorCapacity || data.outdoor_capacity) setOutdoorCapacity(data.outdoorCapacity || data.outdoor_capacity);
    if (data.parkingCapacity || data.parking_capacity) setParkingCapacity(data.parkingCapacity || data.parking_capacity);
    if (data.serviceAreas || data.service_areas) setServiceAreas(data.serviceAreas || data.service_areas);
    if (data.languagesSpoken || data.languages_spoken) setLanguagesSpoken(data.languagesSpoken || data.languages_spoken);
    if (data.location || data.city) setLocationStr(data.location || `${data.city || "Kochi"}, ${data.state || "Kerala"}`);

    // Contact Actions
    const ca = data.contactActions || data.contact_actions;
    if (Array.isArray(ca) && ca.length > 0) setContactActions(ca);

    // Timings
    if (data.openingTime || data.opening_time) setOpeningTime(data.openingTime || data.opening_time);
    if (data.closingTime || data.closing_time) setClosingTime(data.closingTime || data.closing_time);
    if (data.weeklyHolidays || data.weekly_holidays) setWeeklyHolidays(data.weeklyHolidays || data.weekly_holidays);
    if (data.publicHolidayAvailability || data.public_holiday_availability) {
      setPublicHolidayAvailability(data.publicHolidayAvailability || data.public_holiday_availability);
    }
    if (data.venueVisitTimings || data.venue_visit_timings) setVenueVisitTimings(data.venueVisitTimings || data.venue_visit_timings);

    // Booking Policies
    if (data.advanceBookingRequired || data.advance_booking_required) setAdvanceBookingRequired(data.advanceBookingRequired || data.advance_booking_required);
    if (data.advancePaymentPolicy || data.advance_payment_policy) setAdvancePaymentPolicy(data.advancePaymentPolicy || data.advance_payment_policy);
    if (data.cancellationPolicy || data.cancellation_policy) setCancellationPolicy(data.cancellationPolicy || data.cancellation_policy);
    if (data.refundPolicy || data.refund_policy) setRefundPolicy(data.refundPolicy || data.refund_policy);
    if (data.overtimeCharges || data.overtime_charges) setOvertimeCharges(data.overtimeCharges || data.overtime_charges);
    if (data.decorationRules || data.decoration_rules) setDecorationRules(data.decorationRules || data.decoration_rules);
    if (data.outsideCateringPolicy || data.outside_catering_policy) setOutsideCateringPolicy(data.outsideCateringPolicy || data.outside_catering_policy);
    if (data.outsidePhotographyPolicy || data.outside_photography_policy) setOutsidePhotographyPolicy(data.outsidePhotographyPolicy || data.outside_photography_policy);
    if (data.noiseRestrictions || data.noise_restrictions) setNoiseRestrictions(data.noiseRestrictions || data.noise_restrictions);
    if (data.alcoholPolicy || data.alcohol_policy) setAlcoholPolicy(data.alcoholPolicy || data.alcohol_policy);
    if (data.eventTimingRules || data.event_timing_rules) setEventTimingRules(data.eventTimingRules || data.event_timing_rules);
  };

  const handleToggleHighlight = (badge: string) => {
    setVenueHighlights((prev) =>
      prev.includes(badge) ? prev.filter((b) => b !== badge) : [...prev, badge]
    );
  };

  const handleToggleFacility = (facility: string) => {
    setFacilities((prev) =>
      prev.includes(facility) ? prev.filter((f) => f !== facility) : [...prev, facility]
    );
  };

  const handleToggleAction = (actionLabel: string) => {
    setContactActions((prev) =>
      prev.includes(actionLabel) ? prev.filter((a) => a !== actionLabel) : [...prev, actionLabel]
    );
  };

  // Video Upload Handler
  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) {
      showVendorToast("Video file must be under 50MB.", "error");
      return;
    }

    setUploadingVideo(true);
    try {
      const res = await uploadImageToCloudinaryDetailed(file, "cloche/vendors/venues/videos");
      if (res.secure_url) {
        setIntroVideo(res.secure_url);
        showVendorToast("Intro video uploaded successfully!", "success");
      } else {
        showVendorToast("Failed to upload video.", "error");
      }
    } catch (err: any) {
      showVendorToast(err.message || "Failed to upload video.", "error");
    } finally {
      setUploadingVideo(false);
    }
  };

  // Unified Save Action
  const handleSaveStore = async () => {
    setIsSaving(true);
    try {
      const payload = {
        name: venueName,
        business_name: venueName,
        boutique_name: venueName,
        logo: logoUrl,
        logo_url: logoUrl,
        coverImage: coverUrl,
        cover_image: coverUrl,
        tagline,
        about,
        description: about,
        colorTheme,
        color_theme: colorTheme,
        introVideo,
        intro_video_url: introVideo,
        intro_video: introVideo,
        instagram,
        facebook,
        website,
        youtube,
        // Venue Extension Fields (Stored in venue_details)
        venueHighlights,
        venue_highlights: venueHighlights,
        storeHighlights: venueHighlights,
        store_highlights: venueHighlights,
        facilities,
        venue_facilities: facilities,
        yearsInBusiness,
        years_in_business: yearsInBusiness,
        experience_years: yearsInBusiness,
        guestCapacity,
        guest_capacity: guestCapacity,
        numberOfHalls,
        number_of_halls: numberOfHalls,
        indoorCapacity,
        indoor_capacity: indoorCapacity,
        outdoorCapacity,
        outdoor_capacity: outdoorCapacity,
        parkingCapacity,
        parking_capacity: parkingCapacity,
        serviceAreas,
        service_areas: serviceAreas,
        languagesSpoken,
        languages_spoken: languagesSpoken,
        contactActions,
        contact_actions: contactActions,
        openingTime,
        opening_time: openingTime,
        closingTime,
        closing_time: closingTime,
        weeklyHolidays,
        weekly_holidays: weeklyHolidays,
        publicHolidayAvailability,
        public_holiday_availability: publicHolidayAvailability,
        venueVisitTimings,
        venue_visit_timings: venueVisitTimings,
        advanceBookingRequired,
        advance_booking_required: advanceBookingRequired,
        advancePaymentPolicy,
        advance_payment_policy: advancePaymentPolicy,
        cancellationPolicy,
        cancellation_policy: cancellationPolicy,
        refundPolicy,
        refund_policy: refundPolicy,
        overtimeCharges,
        overtime_charges: overtimeCharges,
        decorationRules,
        decoration_rules: decorationRules,
        outsideCateringPolicy,
        outside_catering_policy: outsideCateringPolicy,
        outsidePhotographyPolicy,
        outside_photography_policy: outsidePhotographyPolicy,
        noiseRestrictions,
        noise_restrictions: noiseRestrictions,
        alcoholPolicy,
        alcohol_policy: alcoholPolicy,
        eventTimingRules,
        event_timing_rules: eventTimingRules,
      };

      const res = await syncVendorProfileWithDatabase(payload);
      if (res?.success) {
        showVendorToast("Wedding Venue Storefront saved successfully! ✨", "success");
      } else {
        showVendorToast("Storefront updated locally. Connect database for global sync.", "success");
      }
    } catch (err: any) {
      showVendorToast(err.message || "Failed to save venue storefront.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const activeTheme = VENUE_COLOR_THEMES.find((t) => t.id === colorTheme) || VENUE_COLOR_THEMES[0];

  if (isLoading) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center space-y-3 border border-gold/15 shadow-sm">
        <Loader2 className="w-8 h-8 animate-spin text-[#0F4C45] mx-auto" />
        <p className="text-xs font-bold text-charcoal/60">Loading venue customization profile...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Action Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gold/15 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#0F4C45]/10 text-[#0F4C45]">
              <Building2 className="w-5 h-5" />
            </span>
            <h2 className="font-serif text-2xl font-bold text-charcoal">Customize Venue Storefront</h2>
          </div>
          <p className="text-xs text-charcoal/60 mt-1 max-w-xl">
            Configure your wedding venue badges, hall facilities, capacity metrics, visit timings, and booking policies for prospective couples.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handleSaveStore}
            disabled={isSaving}
            className="bg-[#0F4C45] hover:bg-[#072B27] text-white font-bold text-xs px-6 py-3 rounded-2xl shadow-sm hover:shadow transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin text-[#C8A96A]" /> : <Save className="w-4 h-4 text-[#C8A96A]" />}
            <span>Save Storefront</span>
          </button>
        </div>
      </div>

      {/* Main 2-Column Split: Form Controls (Left) vs Live Preview (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Controls (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">

          {/* 1. Venue Highlights Badges */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gold/15 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gold/10 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#C8A96A]" />
                <h3 className="font-serif text-base font-bold text-charcoal">1. Venue Highlights</h3>
              </div>
              <span className="text-[11px] font-bold text-[#0F4C45]">
                {venueHighlights.length} Badges Selected
              </span>
            </div>
            <p className="text-xs text-charcoal/60 leading-relaxed">
              Select key highlights that appear immediately beneath your venue name on search cards and your public storefront:
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              {VENUE_HIGHLIGHT_OPTIONS.map((badge) => {
                const isSelected = venueHighlights.includes(badge);
                return (
                  <button
                    key={badge}
                    type="button"
                    onClick={() => handleToggleHighlight(badge)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? "bg-[#0F4C45] text-white shadow-xs scale-[1.02]"
                        : "bg-[#FAF7F2] text-charcoal/70 border border-gold/20 hover:border-[#0F4C45]"
                    }`}
                  >
                    <Sparkles className={`w-3 h-3 ${isSelected ? "text-[#C8A96A]" : "text-charcoal/40"}`} />
                    <span>{badge}</span>
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Venue Facilities (Toggle List) */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gold/15 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gold/10 pb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#0F4C45]" />
                <h3 className="font-serif text-base font-bold text-charcoal">2. Venue Facilities & Spaces</h3>
              </div>
              <span className="text-[11px] font-bold text-[#0F4C45]">
                {facilities.length} Active Facilities
              </span>
            </div>
            <p className="text-xs text-charcoal/60 leading-relaxed">
              Enable the amenities and spaces available at your property. These appear automatically in the "Venue Facilities" grid on your public profile:
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
              {VENUE_FACILITIES_OPTIONS.map((fac) => {
                const isEnabled = facilities.includes(fac);
                return (
                  <button
                    key={fac}
                    type="button"
                    onClick={() => handleToggleFacility(fac)}
                    className={`p-3 rounded-2xl text-left text-xs font-bold transition-all border flex items-center justify-between cursor-pointer ${
                      isEnabled
                        ? "bg-[#FAF5EA] border-[#0F4C45] text-[#0F4C45] shadow-xs"
                        : "bg-[#FAF7F2] border-gold/15 text-charcoal/60 hover:bg-gold/10"
                    }`}
                  >
                    <span className="truncate pr-1">{fac}</span>
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0 border ${
                      isEnabled ? "bg-[#0F4C45] text-white border-[#0F4C45]" : "bg-white border-charcoal/20"
                    }`}>
                      {isEnabled && <Check className="w-3 h-3 stroke-[3]" />}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Business & Capacity Information */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gold/15 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-gold/10 pb-3">
              <Building className="w-4 h-4 text-[#0F4C45]" />
              <h3 className="font-serif text-base font-bold text-charcoal">3. Business & Capacity Information</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
              <div>
                <label className="block text-xs font-bold text-charcoal/80 mb-1">
                  Years in Business / Operating Experience
                </label>
                <input
                  type="text"
                  placeholder="e.g. 15 Years"
                  value={yearsInBusiness}
                  onChange={(e) => setYearsInBusiness(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-3.5 py-2.5 text-xs text-charcoal font-medium focus:outline-none focus:border-[#0F4C45]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal/80 mb-1">
                  Overall Guest Capacity Range
                </label>
                <input
                  type="text"
                  placeholder="e.g. 500 - 2,500 Guests"
                  value={guestCapacity}
                  onChange={(e) => setGuestCapacity(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-3.5 py-2.5 text-xs text-charcoal font-medium focus:outline-none focus:border-[#0F4C45]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal/80 mb-1">
                  Number of Banquet Halls & Spaces
                </label>
                <input
                  type="text"
                  placeholder="e.g. 3 AC Banquet Halls + 2 Lawns"
                  value={numberOfHalls}
                  onChange={(e) => setNumberOfHalls(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-3.5 py-2.5 text-xs text-charcoal font-medium focus:outline-none focus:border-[#0F4C45]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal/80 mb-1">
                  Indoor AC Hall Capacity
                </label>
                <input
                  type="text"
                  placeholder="e.g. 1,000 Floating / 600 Seated"
                  value={indoorCapacity}
                  onChange={(e) => setIndoorCapacity(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-3.5 py-2.5 text-xs text-charcoal font-medium focus:outline-none focus:border-[#0F4C45]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal/80 mb-1">
                  Outdoor Lawn / Open Space Capacity
                </label>
                <input
                  type="text"
                  placeholder="e.g. 1,500 Floating Guests"
                  value={outdoorCapacity}
                  onChange={(e) => setOutdoorCapacity(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-3.5 py-2.5 text-xs text-charcoal font-medium focus:outline-none focus:border-[#0F4C45]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal/80 mb-1">
                  Parking Capacity & Valet
                </label>
                <input
                  type="text"
                  placeholder="e.g. 300 Cars with Valet Facility"
                  value={parkingCapacity}
                  onChange={(e) => setParkingCapacity(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-3.5 py-2.5 text-xs text-charcoal font-medium focus:outline-none focus:border-[#0F4C45]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal/80 mb-1">
                  Service & Operating Districts
                </label>
                <input
                  type="text"
                  placeholder="e.g. Kochi, Ernakulam, Alappuzha"
                  value={serviceAreas}
                  onChange={(e) => setServiceAreas(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-3.5 py-2.5 text-xs text-charcoal font-medium focus:outline-none focus:border-[#0F4C45]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal/80 mb-1">
                  Languages Spoken by Staff
                </label>
                <input
                  type="text"
                  placeholder="e.g. English, Malayalam, Hindi, Tamil"
                  value={languagesSpoken}
                  onChange={(e) => setLanguagesSpoken(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-3.5 py-2.5 text-xs text-charcoal font-medium focus:outline-none focus:border-[#0F4C45]"
                />
              </div>
            </div>
          </div>

          {/* 4. Contact Action Buttons (Public CTAs) */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gold/15 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gold/10 pb-3">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#0F4C45]" />
                <h3 className="font-serif text-base font-bold text-charcoal">4. Contact Action Buttons (Public CTAs)</h3>
              </div>
              <span className="text-[11px] font-bold text-[#0F4C45]">
                {contactActions.length} Buttons Active
              </span>
            </div>
            <p className="text-xs text-charcoal/60 leading-relaxed">
              Choose which high-intent action buttons are displayed to couples visiting your storefront:
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
              {CONTACT_ACTION_OPTIONS.map((action) => {
                const isEnabled = contactActions.includes(action.label);
                const IconComp = action.icon;
                return (
                  <button
                    key={action.id}
                    type="button"
                    onClick={() => handleToggleAction(action.label)}
                    className={`p-3 rounded-2xl text-xs font-bold transition-all border flex items-center justify-between cursor-pointer ${
                      isEnabled
                        ? "bg-[#0F4C45] text-white border-[#0F4C45] shadow-xs"
                        : "bg-[#FAF7F2] border-gold/15 text-charcoal/70 hover:bg-gold/10"
                    }`}
                  >
                    <span className="flex items-center gap-1.5 truncate">
                      <IconComp className={`w-3.5 h-3.5 ${isEnabled ? "text-[#C8A96A]" : "text-charcoal/50"}`} />
                      <span>{action.label}</span>
                    </span>
                    {isEnabled && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5. Working Hours & Visit Timings */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gold/15 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-gold/10 pb-3">
              <Clock className="w-4 h-4 text-[#0F4C45]" />
              <h3 className="font-serif text-base font-bold text-charcoal">5. Working Hours & Venue Visit Timings</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
              <div>
                <label className="block text-xs font-bold text-charcoal/80 mb-1">
                  Office Opening Time
                </label>
                <input
                  type="text"
                  placeholder="e.g. 08:00 AM"
                  value={openingTime}
                  onChange={(e) => setOpeningTime(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-3.5 py-2.5 text-xs text-charcoal font-medium focus:outline-none focus:border-[#0F4C45]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal/80 mb-1">
                  Office Closing Time
                </label>
                <input
                  type="text"
                  placeholder="e.g. 10:00 PM"
                  value={closingTime}
                  onChange={(e) => setClosingTime(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-3.5 py-2.5 text-xs text-charcoal font-medium focus:outline-none focus:border-[#0F4C45]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal/80 mb-1">
                  Weekly Holidays / Office Off Days
                </label>
                <input
                  type="text"
                  placeholder="e.g. None / Open All 7 Days"
                  value={weeklyHolidays}
                  onChange={(e) => setWeeklyHolidays(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-3.5 py-2.5 text-xs text-charcoal font-medium focus:outline-none focus:border-[#0F4C45]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal/80 mb-1">
                  Public Holiday Availability
                </label>
                <input
                  type="text"
                  placeholder="e.g. Available for wedding bookings on all public holidays"
                  value={publicHolidayAvailability}
                  onChange={(e) => setPublicHolidayAvailability(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-3.5 py-2.5 text-xs text-charcoal font-medium focus:outline-none focus:border-[#0F4C45]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-charcoal/80 mb-1">
                  Venue Visit & Guided Tour Timings for Couples
                </label>
                <input
                  type="text"
                  placeholder="e.g. 10:00 AM - 06:00 PM (Prior appointment recommended)"
                  value={venueVisitTimings}
                  onChange={(e) => setVenueVisitTimings(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-3.5 py-2.5 text-xs text-charcoal font-medium focus:outline-none focus:border-[#0F4C45]"
                />
              </div>
            </div>
          </div>

          {/* 6. Booking Policies & Event Rules */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gold/15 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-gold/10 pb-3">
              <FileText className="w-4 h-4 text-[#0F4C45]" />
              <h3 className="font-serif text-base font-bold text-charcoal">6. Booking Policies & Venue Guidelines</h3>
            </div>
            <p className="text-xs text-charcoal/60 leading-relaxed">
              Transparent terms displayed under "Venue Policies" to set clear expectations with clients:
            </p>

            <div className="space-y-3.5 text-xs font-sans">
              <div>
                <label className="block text-xs font-bold text-charcoal/80 mb-1">
                  Advance Booking Lead Time
                </label>
                <input
                  type="text"
                  value={advanceBookingRequired}
                  onChange={(e) => setAdvanceBookingRequired(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-3.5 py-2.5 text-xs text-charcoal font-medium focus:outline-none focus:border-[#0F4C45]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal/80 mb-1">
                  Advance Payment Schedule & Milestones
                </label>
                <input
                  type="text"
                  value={advancePaymentPolicy}
                  onChange={(e) => setAdvancePaymentPolicy(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-3.5 py-2.5 text-xs text-charcoal font-medium focus:outline-none focus:border-[#0F4C45]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-charcoal/80 mb-1">
                    Cancellation Policy
                  </label>
                  <textarea
                    rows={2}
                    value={cancellationPolicy}
                    onChange={(e) => setCancellationPolicy(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl p-3 text-xs text-charcoal font-medium focus:outline-none focus:border-[#0F4C45] resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal/80 mb-1">
                    Security Deposit & Refund Terms
                  </label>
                  <textarea
                    rows={2}
                    value={refundPolicy}
                    onChange={(e) => setRefundPolicy(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl p-3 text-xs text-charcoal font-medium focus:outline-none focus:border-[#0F4C45] resize-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-charcoal/80 mb-1">
                    Overtime / Extra Hour Charges
                  </label>
                  <input
                    type="text"
                    value={overtimeCharges}
                    onChange={(e) => setOvertimeCharges(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-3.5 py-2.5 text-xs text-charcoal font-medium focus:outline-none focus:border-[#0F4C45]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal/80 mb-1">
                    Decoration Rules & Guidelines
                  </label>
                  <input
                    type="text"
                    value={decorationRules}
                    onChange={(e) => setDecorationRules(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-3.5 py-2.5 text-xs text-charcoal font-medium focus:outline-none focus:border-[#0F4C45]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-charcoal/80 mb-1">
                    Outside Catering Policy
                  </label>
                  <input
                    type="text"
                    value={outsideCateringPolicy}
                    onChange={(e) => setOutsideCateringPolicy(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-3.5 py-2.5 text-xs text-charcoal font-medium focus:outline-none focus:border-[#0F4C45]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal/80 mb-1">
                    Outside Photography & Drone Policy
                  </label>
                  <input
                    type="text"
                    value={outsidePhotographyPolicy}
                    onChange={(e) => setOutsidePhotographyPolicy(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-3.5 py-2.5 text-xs text-charcoal font-medium focus:outline-none focus:border-[#0F4C45]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-charcoal/80 mb-1">
                    Music & Noise Restriction Timing
                  </label>
                  <input
                    type="text"
                    value={noiseRestrictions}
                    onChange={(e) => setNoiseRestrictions(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-3.5 py-2.5 text-xs text-charcoal font-medium focus:outline-none focus:border-[#0F4C45]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal/80 mb-1">
                    Alcohol & Bar Policy
                  </label>
                  <input
                    type="text"
                    value={alcoholPolicy}
                    onChange={(e) => setAlcoholPolicy(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-3.5 py-2.5 text-xs text-charcoal font-medium focus:outline-none focus:border-[#0F4C45]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal/80 mb-1">
                  Event Timing Slot Rules
                </label>
                <input
                  type="text"
                  value={eventTimingRules}
                  onChange={(e) => setEventTimingRules(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-3.5 py-2.5 text-xs text-charcoal font-medium focus:outline-none focus:border-[#0F4C45]"
                />
              </div>
            </div>
          </div>

          {/* 7. Brand Theme */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gold/15 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-gold/10 pb-3">
              <Palette className="w-4 h-4 text-[#0F4C45]" />
              <h3 className="font-serif text-base font-bold text-charcoal">7. Storefront Brand Theme</h3>
            </div>
            <p className="text-xs text-charcoal/60 leading-relaxed">
              Select your venue's primary color theme. This dynamically styles your CTA buttons, badges, highlights, and storefront cards:
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
              {VENUE_COLOR_THEMES.map((theme) => {
                const isSelected = colorTheme === theme.id;
                return (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => setColorTheme(theme.id)}
                    className={`p-3.5 rounded-2xl border text-left transition-all relative cursor-pointer ${
                      isSelected
                        ? "border-[#0F4C45] bg-[#FAF5EA] ring-2 ring-[#0F4C45]/20 shadow-xs"
                        : "border-gold/15 bg-[#FAF7F2] hover:bg-gold/10"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-5 h-5 rounded-full border border-black/10 shadow-2xs shrink-0" style={{ backgroundColor: theme.primary }} />
                      <span className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0" style={{ backgroundColor: theme.accent }} />
                    </div>
                    <span className="font-serif font-bold text-xs text-charcoal block truncate">{theme.label}</span>
                    {isSelected && (
                      <span className="absolute top-3 right-3 text-[#0F4C45]">
                        <Check className="w-4 h-4 stroke-[3]" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 8. Branding, Logo & Intro Video */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gold/15 shadow-sm space-y-5">
            <div className="flex items-center gap-2 border-b border-gold/10 pb-3">
              <Building2 className="w-4 h-4 text-[#0F4C45]" />
              <h3 className="font-serif text-base font-bold text-charcoal">8. Venue Branding & Media</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-charcoal/80 mb-1">
                  Venue Name
                </label>
                <input
                  type="text"
                  value={venueName}
                  onChange={(e) => setVenueName(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-3.5 py-2.5 text-xs text-charcoal font-medium focus:outline-none focus:border-[#0F4C45]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal/80 mb-1">
                  Venue Tagline
                </label>
                <input
                  type="text"
                  placeholder="e.g. Royal Heritage Palaces & Grand Wedding Lawns"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-3.5 py-2.5 text-xs text-charcoal font-medium focus:outline-none focus:border-[#0F4C45]"
                />
              </div>

              {/* About Venue with live character counter */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-charcoal/80">
                    About Venue Description
                  </label>
                  <span className={`text-[10px] font-bold ${about.length >= 300 && about.length <= 500 ? "text-emerald-700" : "text-charcoal/40"}`}>
                    {about.length} / 500 chars (Min 300 recommended)
                  </span>
                </div>
                <textarea
                  rows={4}
                  placeholder="Describe your architecture, hospitality, parking space, banquet capacity, and scenic beauty (300 to 500 characters)..."
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  maxLength={600}
                  className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl p-3 text-xs text-charcoal font-medium focus:outline-none focus:border-[#0F4C45] resize-none leading-relaxed"
                />
              </div>

              {/* Logo & Cover Media Uploaders */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <VendorImageUploader
                  label="Venue Logo"
                  sublabel="Square ratio, transparent or white background"
                  value={logoUrl}
                  onChange={(url) => setLogoUrl(Array.isArray(url) ? url[0] || "" : url)}
                  folder="cloche/vendors/venues/logos"
                />

                <VendorImageUploader
                  label="Venue Cover Photo"
                  sublabel="Hero landscape photo of your ballroom or lawn"
                  value={coverUrl}
                  onChange={(url) => setCoverUrl(Array.isArray(url) ? url[0] || "" : url)}
                  folder="cloche/vendors/venues/covers"
                />
              </div>

              {/* Intro Video Upload (Device Picker) */}
              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-gold/15 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Video className="w-4 h-4 text-[#0F4C45]" />
                    <span className="text-xs font-bold text-charcoal">Venue Cinematic Intro Reel / Video</span>
                  </div>
                  {introVideo && (
                    <button
                      type="button"
                      onClick={() => setIntroVideo("")}
                      className="text-[11px] text-red-600 hover:underline font-bold cursor-pointer"
                    >
                      Remove Video
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-charcoal/60">
                  Upload a 15-60 second walk-through video reel directly from your device (Max 50MB):
                </p>

                <input
                  ref={videoInputRef}
                  type="file"
                  accept="video/mp4,video/quicktime,video/webm"
                  onChange={handleVideoUpload}
                  className="hidden"
                />

                {introVideo ? (
                  <div className="relative rounded-xl overflow-hidden bg-black aspect-video max-h-48 border border-gold/20">
                    <video src={introVideo} controls className="w-full h-full object-contain" />
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => videoInputRef.current?.click()}
                    disabled={uploadingVideo}
                    className="w-full py-4 rounded-xl border border-dashed border-[#0F4C45]/40 hover:border-[#0F4C45] bg-white text-xs font-bold text-[#0F4C45] flex items-center justify-center gap-2 cursor-pointer transition-all hover:bg-gold/5"
                  >
                    {uploadingVideo ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Uploading Video Reel...</span>
                      </>
                    ) : (
                      <>
                        <Video className="w-4 h-4 text-[#C8A96A]" />
                        <span>Choose Video from Device</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Social Links */}
              <div className="space-y-3 pt-2">
                <span className="text-xs font-bold text-charcoal block">Social Media & Online Presence:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="flex items-center bg-[#FAF7F2] border border-gold/20 rounded-xl px-3 py-2">
                    <InstagramIcon className="w-4 h-4 text-[#E1306C] mr-2 shrink-0" />
                    <input
                      type="text"
                      placeholder="Instagram profile or handle"
                      value={instagram}
                      onChange={(e) => setInstagram(e.target.value)}
                      className="w-full bg-transparent text-xs text-charcoal focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center bg-[#FAF7F2] border border-gold/20 rounded-xl px-3 py-2">
                    <FacebookIcon className="w-4 h-4 text-[#1877F2] mr-2 shrink-0" />
                    <input
                      type="text"
                      placeholder="Facebook page link"
                      value={facebook}
                      onChange={(e) => setFacebook(e.target.value)}
                      className="w-full bg-transparent text-xs text-charcoal focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center bg-[#FAF7F2] border border-gold/20 rounded-xl px-3 py-2">
                    <Globe className="w-4 h-4 text-[#0F4C45] mr-2 shrink-0" />
                    <input
                      type="text"
                      placeholder="Official website URL"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      className="w-full bg-transparent text-xs text-charcoal focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center bg-[#FAF7F2] border border-gold/20 rounded-xl px-3 py-2">
                    <YoutubeIcon className="w-4 h-4 text-[#FF0000] mr-2 shrink-0" />
                    <input
                      type="text"
                      placeholder="YouTube channel / tour video"
                      value={youtube}
                      onChange={(e) => setYoutube(e.target.value)}
                      className="w-full bg-transparent text-xs text-charcoal focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Save Action Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleSaveStore}
              disabled={isSaving}
              className="w-full bg-[#0F4C45] hover:bg-[#072B27] text-white font-bold text-sm py-4 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin text-[#C8A96A]" /> : <Save className="w-4 h-4 text-[#C8A96A]" />}
              <span>Save & Publish Venue Customization</span>
            </button>
          </div>
        </div>

        {/* Right Column: Real-Time Live Preview (5 Cols, Sticky) */}
        <div className="lg:col-span-5 sticky top-6 space-y-4">
          <div className="bg-white rounded-3xl p-5 border border-gold/20 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-gold/10 pb-3">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#0F4C45]" />
                <h3 className="font-serif text-sm font-bold text-charcoal">Live Storefront Preview</h3>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                Real-Time
              </span>
            </div>

            {/* Mobile / Storefront Preview Card */}
            <div className="rounded-2xl border border-gold/20 overflow-hidden bg-[#FAF7F2] shadow-inner text-xs space-y-3">
              {/* Cover Photo & Floating Header */}
              <div className="relative h-44 bg-charcoal/10 overflow-hidden">
                {coverUrl ? (
                  <img src={coverUrl} alt="Venue Cover" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-charcoal/40 font-serif italic">
                    Venue Cover Photo
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

                {/* Logo & Venue Name */}
                <div className="absolute bottom-3 left-3 right-3 flex items-end gap-2.5">
                  <div className="w-12 h-12 rounded-xl bg-white p-1 shadow-md shrink-0 border border-white/40 overflow-hidden">
                    {logoUrl ? (
                      <img src={logoUrl} alt="Logo" className="w-full h-full object-contain rounded-lg" />
                    ) : (
                      <div className="w-full h-full bg-[#0F4C45] text-white flex items-center justify-center font-bold text-xs rounded-lg">
                        {venueName.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="text-white min-w-0 flex-1">
                    <h4 className="font-serif font-bold text-sm leading-tight truncate">{venueName}</h4>
                    <span className="text-[10px] text-white/80 block truncate">
                      {tagline || "Luxury Wedding Venue"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-3.5 space-y-3">
                {/* Location & Operating Experience */}
                <div className="flex items-center justify-between text-[11px] text-charcoal/70 border-b border-gold/10 pb-2">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#0F4C45]" />
                    <span>{locationStr}</span>
                  </span>
                  <span className="font-bold text-[#0F4C45]">
                    {yearsInBusiness} Years Exp.
                  </span>
                </div>

                {/* Highlights Strip */}
                {venueHighlights.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {venueHighlights.slice(0, 4).map((badge) => (
                      <span
                        key={badge}
                        className="text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-2xs"
                        style={{ backgroundColor: activeTheme.badgeBg, color: activeTheme.badgeText }}
                      >
                        <Sparkles className="w-2.5 h-2.5 text-[#C8A96A]" /> {badge}
                      </span>
                    ))}
                    {venueHighlights.length > 4 && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-charcoal/10 text-charcoal/60">
                        +{venueHighlights.length - 4} more
                      </span>
                    )}
                  </div>
                )}

                {/* Capacity Stats Card */}
                <div className="grid grid-cols-2 gap-2 text-[10px] bg-white p-2.5 rounded-xl border border-gold/15">
                  <div>
                    <span className="text-charcoal/50 block font-semibold">Max Guests</span>
                    <span className="font-bold text-[#0F4C45]">{guestCapacity}</span>
                  </div>
                  <div>
                    <span className="text-charcoal/50 block font-semibold">Halls & Lawns</span>
                    <span className="font-bold text-[#0F4C45]">{numberOfHalls}</span>
                  </div>
                </div>

                {/* Facilities Pill List */}
                {facilities.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-charcoal/60 uppercase tracking-wider block">
                      Venue Facilities ({facilities.length})
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {facilities.slice(0, 6).map((f) => (
                        <span key={f} className="text-[9px] font-bold bg-white text-charcoal px-2 py-0.5 rounded-lg border border-gold/15">
                          ✓ {f}
                        </span>
                      ))}
                      {facilities.length > 6 && (
                        <span className="text-[9px] font-bold bg-white text-charcoal/50 px-2 py-0.5 rounded-lg border border-gold/15">
                          +{facilities.length - 6} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* About Preview */}
                {about && (
                  <div className="space-y-1 pt-1">
                    <span className="text-[10px] font-bold text-charcoal/60 uppercase tracking-wider block">
                      About Venue
                    </span>
                    <p className="text-[10px] text-charcoal/80 leading-relaxed line-clamp-3">
                      {about}
                    </p>
                  </div>
                )}

                {/* Timings & Visit Notice */}
                <div className="p-2.5 rounded-xl bg-[#FAF5EA] border border-gold/20 text-[10px] space-y-0.5">
                  <span className="font-bold text-[#0F4C45] block">Venue Visit Timings:</span>
                  <span className="text-charcoal/80 block">{venueVisitTimings}</span>
                </div>

                {/* Action Buttons Mockup */}
                <div className="pt-2 flex flex-wrap gap-1.5">
                  {contactActions.includes("Call Now") && (
                    <span className="flex-1 py-1.5 rounded-lg text-center font-bold text-[10px] text-white shadow-xs" style={{ backgroundColor: activeTheme.primary }}>
                      📞 Call Now
                    </span>
                  )}
                  {contactActions.includes("WhatsApp") && (
                    <span className="flex-1 py-1.5 rounded-lg text-center font-bold text-[10px] text-white bg-emerald-600 shadow-xs">
                      💬 WhatsApp
                    </span>
                  )}
                  {contactActions.includes("Book Venue Visit") && (
                    <span className="w-full py-1.5 rounded-lg text-center font-bold text-[10px] text-white shadow-xs" style={{ backgroundColor: activeTheme.secondary }}>
                      📅 Book Venue Visit
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
