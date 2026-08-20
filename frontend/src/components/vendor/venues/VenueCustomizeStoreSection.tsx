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
  Building2,
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
  HelpCircle,
  Compass,
  Users,
  Car,
  Utensils
} from "lucide-react";
import { VendorCategoryConfig } from "@/lib/vendor-categories";
import { uploadImageToCloudinaryDetailed } from "@/lib/cloudinary";
import { VendorStorefront } from "@/components/VendorStorefront";
import {
  fetchAuthenticatedVendorFromDb,
  getActiveVendorIdentity,
  syncVendorProfileWithDatabase,
  showVendorToast,
  VendorProfileData
} from "@/lib/vendorStore";

export interface VenueCustomizeStoreSectionProps {
  vendorName?: string;
  categoryConfig?: VendorCategoryConfig;
  onBack?: () => void;
}

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

export const COLOR_THEMES: ColorThemeOption[] = [
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
  "Indoor AC Hall",
  "Outdoor Lawn",
  "Banquet Hall",
  "Destination Wedding",
  "Beach Venue",
  "Bridal Suite",
  "Parking Available",
  "Catering Available",
  "Decoration Included",
  "Wheelchair Accessible",
  "Verified Partner",
];

export const ALL_VENUE_HALL_OPTIONS = [
  "Grand Ballroom",
  "Royal Hall",
  "Emerald Hall",
  "Crystal Hall",
  "Garden Lawn",
  "Banquet Hall",
  "Outdoor Lawn",
  "Poolside Venue",
];

export function VenueCustomizeStoreSection({
  vendorName,
  categoryConfig,
  onBack,
}: VenueCustomizeStoreSectionProps = {}) {
  const [vendorData, setVendorData] = useState<VendorProfileData | null>(null);

  // 1. Branding & Identity
  const [logoUrl, setLogoUrl] = useState<string>("");
  const [coverUrl, setCoverUrl] = useState<string>("");
  const [tagline, setTagline] = useState<string>("");
  const [about, setAbout] = useState<string>("");
  const [colorTheme, setColorTheme] = useState<string>("emerald");
  const [galleryLayout, setGalleryLayout] = useState<string>("grid");
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [hallImages, setHallImages] = useState<string[]>([]);

  // 2. Social Links
  const [instagram, setInstagram] = useState<string>("");
  const [facebook, setFacebook] = useState<string>("");
  const [youtube, setYoutube] = useState<string>("");
  const [website, setWebsite] = useState<string>("");

  // 3. Venue Highlights
  const [venueHighlights, setVenueHighlights] = useState<string[]>([
    "Premium Wedding Venue",
    "Indoor AC Hall",
    "Outdoor Lawn",
    "Bridal Suite",
    "Parking Available",
  ]);

  // 4. Featured Halls (with reordering)
  const [featuredHalls, setFeaturedHalls] = useState<string[]>([
    "Grand Ballroom",
    "Royal Hall",
    "Garden Lawn",
    "Outdoor Lawn",
  ]);

  // 5. Venue Information
  const [yearsInBusiness, setYearsInBusiness] = useState<string>("12");
  const [guestCapacity, setGuestCapacity] = useState<string>("1,500 Guests");
  const [minGuestCapacity, setMinGuestCapacity] = useState<string>("150 Guests");
  const [numberOfHalls, setNumberOfHalls] = useState<string>("3 Halls & 2 Lawns");
  const [diningCapacity, setDiningCapacity] = useState<string>("600 Seated");
  const [parkingCapacity, setParkingCapacity] = useState<string>("350 Cars & Valet");
  const [serviceAreas, setServiceAreas] = useState<string>("Golf Course Road, Gurgaon, Delhi NCR");
  const [languagesSpoken, setLanguagesSpoken] = useState<string>("English, Hindi, Punjabi");

  // 6. Contact Action Buttons
  const [actionButtons, setActionButtons] = useState({
    callNow: true,
    whatsapp: true,
    bookVenueVisit: true,
    requestQuote: true,
    getDirections: true,
    website: true,
  });

  // 7. Working Hours & Venue Visit Timings
  const [openingTime, setOpeningTime] = useState<string>("09:00 AM");
  const [closingTime, setClosingTime] = useState<string>("09:00 PM");
  const [weeklyHolidays, setWeeklyHolidays] = useState<string>("Open All 7 Days");
  const [venueVisitTimings, setVenueVisitTimings] = useState<string>("10:00 AM - 06:00 PM (Daily)");
  const [publicHolidayAvailability, setPublicHolidayAvailability] = useState<string>("Open for guided tours by prior appointment");
  const [advanceAppointmentRequired, setAdvanceAppointmentRequired] = useState<boolean>(true);

  // 8. Booking Policies & Venue Guidelines
  const [advanceBookingRequired, setAdvanceBookingRequired] = useState<string>(
    "Minimum 30 to 90 days advance booking recommended for peak wedding dates."
  );
  const [advancePaymentPolicy, setAdvancePaymentPolicy] = useState<string>(
    "25% on booking confirmation, 50% 30 days prior, remaining 25% 7 days before event."
  );
  const [cancellationPolicy, setCancellationPolicy] = useState<string>(
    "Full refund of advance if cancelled 60+ days prior to scheduled event date."
  );
  const [refundPolicy, setRefundPolicy] = useState<string>(
    "100% security damage deposit refunded within 24 hours of successful post-event inspection."
  );
  const [decorationRules, setDecorationRules] = useState<string>(
    "Empaneled luxury decorator list available. External decorators subject to venue approval & safety guidelines."
  );
  const [outsideCateringPolicy, setOutsideCateringPolicy] = useState<string>(
    "In-house 5-star culinary team available. Outside catering permitted with kitchen utility charges."
  );
  const [outsidePhotographyPolicy, setOutsidePhotographyPolicy] = useState<string>(
    "Unrestricted professional wedding photography & 4K drone videography permitted across all spaces."
  );
  const [noiseRestrictions, setNoiseRestrictions] = useState<string>(
    "Indoor halls: 01:00 AM cutoff. Outdoor lawns: DJ / amplified sound permitted until 10:00 PM per city noise regulations."
  );
  const [alcoholPolicy, setAlcoholPolicy] = useState<string>(
    "Permitted with standard 1-day excise license. Bartending counter setup & glassware support provided."
  );
  const [overtimeCharges, setOvertimeCharges] = useState<string>(
    "₹15,000 per additional hour beyond booked slot time, subject to next slot availability."
  );
  const [eventTimingRules, setEventTimingRules] = useState<string>(
    "Morning Slot: 06:00 AM - 03:00 PM | Evening Slot: 05:00 PM - 11:30 PM | Full Day: 06:00 AM - 11:30 PM"
  );

  // Accordion State
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({
    highlights: true,
    featuredHalls: true,
    venueInfo: true,
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

  // Initial Data Fetch & Hydration
  useEffect(() => {
    const localVendor = getActiveVendorIdentity();
    setVendorData(localVendor);

    async function loadDbVendor() {
      try {
        const dbVendor = await fetchAuthenticatedVendorFromDb();
        if (dbVendor) {
          setVendorData(dbVendor);
          hydrateFields(dbVendor);
        } else if (localVendor) {
          hydrateFields(localVendor);
        }
      } catch (e) {
        console.error("[VenueCustomizeStore] Error loading vendor:", e);
        if (localVendor) hydrateFields(localVendor);
      }
    }

    loadDbVendor();
  }, []);

  const hydrateFields = (data: Partial<VendorProfileData> & Record<string, any>) => {
    // Branding
    if (data.logo || data.logo_url) setLogoUrl(data.logo || data.logo_url || "");
    if (data.coverImage || data.cover_image) setCoverUrl(data.coverImage || data.cover_image || "");
    if (data.tagline) setTagline(data.tagline || "");
    if (data.about || data.description) setAbout(data.about || data.description || "");
    if (data.colorTheme || data.color_theme) setColorTheme(data.colorTheme || data.color_theme || "emerald");
    const gallery = Array.isArray(data.galleryImages) ? data.galleryImages : Array.isArray(data.gallery_images) ? data.gallery_images : null;
    if (gallery) setGalleryImages(gallery);

    const halls = Array.isArray(data.hallImages) ? data.hallImages : Array.isArray(data.hall_images) ? data.hall_images : null;
    if (halls) setHallImages(halls);

    // Social Links
    if (data.instagram) setInstagram(data.instagram || "");
    if (data.facebook) setFacebook(data.facebook || "");
    if (data.website) setWebsite(data.website || "");
    if (data.youtube) setYoutube(data.youtube || "");

    // Venue Highlights
    const rawHighlights = data.venueHighlights || data.venue_highlights || data.storeHighlights || data.store_highlights;
    if (Array.isArray(rawHighlights) && rawHighlights.length > 0) setVenueHighlights(rawHighlights);

    // Featured Halls
    const rawHalls = data.featuredHalls || data.featured_halls;
    if (Array.isArray(rawHalls) && rawHalls.length > 0) setFeaturedHalls(rawHalls);

    // Venue Information
    if (data.yearsInBusiness || data.years_in_business || data.experience_years || data.experience) {
      setYearsInBusiness(String(data.yearsInBusiness || data.years_in_business || data.experience_years || data.experience || ""));
    }
    if (data.guestCapacity || data.guest_capacity) setGuestCapacity(data.guestCapacity || data.guest_capacity || "");
    if (data.minGuestCapacity || data.min_guest_capacity) setMinGuestCapacity(data.minGuestCapacity || data.min_guest_capacity || "");
    if (data.numberOfHalls || data.number_of_halls) setNumberOfHalls(data.numberOfHalls || data.number_of_halls || "");
    if (data.diningCapacity || data.dining_capacity) setDiningCapacity(data.diningCapacity || data.dining_capacity || "");
    if (data.parkingCapacity || data.parking_capacity) setParkingCapacity(data.parkingCapacity || data.parking_capacity || "");
    if (data.serviceAreas || data.service_areas) setServiceAreas(data.serviceAreas || data.service_areas || "");
    if (data.languagesSpoken || data.languages_spoken) setLanguagesSpoken(data.languagesSpoken || data.languages_spoken || "");

    // Contact Action Buttons
    if (data.actionButtons || data.action_buttons) {
      const act: Record<string, any> = (data.actionButtons || data.action_buttons || {}) as Record<string, any>;
      setActionButtons({
        callNow: Boolean(act.callNow ?? true),
        whatsapp: Boolean(act.whatsapp ?? true),
        bookVenueVisit: Boolean(act.bookVenueVisit ?? act.bookAppointment ?? true),
        requestQuote: Boolean(act.requestQuote ?? act.getQuote ?? true),
        getDirections: Boolean(act.getDirections ?? act.visitStore ?? true),
        website: Boolean(act.website ?? true),
      });
    }

    // Working Hours & Visit Timings
    if (data.openingTime || data.opening_time) setOpeningTime(data.openingTime || data.opening_time || "");
    if (data.closingTime || data.closing_time) setClosingTime(data.closingTime || data.closing_time || "");
    if (data.weeklyHolidays || data.weekly_holidays) setWeeklyHolidays(data.weeklyHolidays || data.weekly_holidays || "");
    if (data.venueVisitTimings || data.venue_visit_timings) setVenueVisitTimings(data.venueVisitTimings || data.venue_visit_timings || "");
    if (data.publicHolidayAvailability || data.public_holiday_availability) {
      setPublicHolidayAvailability(data.publicHolidayAvailability || data.public_holiday_availability || "");
    }
    if (data.advanceAppointmentRequired !== undefined || data.advance_appointment_required !== undefined) {
      setAdvanceAppointmentRequired(Boolean(data.advanceAppointmentRequired ?? data.advance_appointment_required));
    }

    // Booking Policies
    if (data.advanceBookingRequired || data.advance_booking_required) {
      setAdvanceBookingRequired(data.advanceBookingRequired || data.advance_booking_required || "");
    }
    if (data.advancePaymentPolicy || data.advance_payment_policy) {
      setAdvancePaymentPolicy(data.advancePaymentPolicy || data.advance_payment_policy || "");
    }
    if (data.cancellationPolicy || data.cancellation_policy) {
      setCancellationPolicy(data.cancellationPolicy || data.cancellation_policy || "");
    }
    if (data.refundPolicy || data.refund_policy) {
      setRefundPolicy(data.refundPolicy || data.refund_policy || "");
    }
    if (data.decorationRules || data.decoration_rules) {
      setDecorationRules(data.decorationRules || data.decoration_rules || "");
    }
    if (data.outsideCateringPolicy || data.outside_catering_policy) {
      setOutsideCateringPolicy(data.outsideCateringPolicy || data.outside_catering_policy || "");
    }
    if (data.outsidePhotographyPolicy || data.outside_photography_policy) {
      setOutsidePhotographyPolicy(data.outsidePhotographyPolicy || data.outside_photography_policy || "");
    }
    if (data.noiseRestrictions || data.noise_restrictions) {
      setNoiseRestrictions(data.noiseRestrictions || data.noise_restrictions || "");
    }
    if (data.alcoholPolicy || data.alcohol_policy) {
      setAlcoholPolicy(data.alcoholPolicy || data.alcohol_policy || "");
    }
    if (data.overtimeCharges || data.overtime_charges) {
      setOvertimeCharges(data.overtimeCharges || data.overtime_charges || "");
    }
    if (data.eventTimingRules || data.event_timing_rules) {
      setEventTimingRules(data.eventTimingRules || data.event_timing_rules || "");
    }
  };

  const activeTheme = COLOR_THEMES.find((t) => t.id === colorTheme) || COLOR_THEMES[0];
  const currentDisplayName = vendorName || vendorData?.name || vendorData?.boutique_name || "Wedding Venue";
  const currentLocation = [vendorData?.city, vendorData?.district, vendorData?.address].filter(Boolean).join(", ");

  const initials = currentDisplayName
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .join("")
    .slice(0, 2)
    .toUpperCase() || "VP";

  // Handlers for Highlights
  const toggleHighlight = (badge: string) => {
    setVenueHighlights((prev) =>
      prev.includes(badge) ? prev.filter((b) => b !== badge) : [...prev, badge]
    );
  };

  // Handlers for Featured Halls
  const toggleFeaturedHall = (hall: string) => {
    setFeaturedHalls((prev) =>
      prev.includes(hall) ? prev.filter((h) => h !== hall) : [...prev, hall]
    );
  };

  const moveHall = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= featuredHalls.length) return;
    const newHalls = [...featuredHalls];
    const temp = newHalls[index];
    newHalls[index] = newHalls[targetIndex];
    newHalls[targetIndex] = temp;
    setFeaturedHalls(newHalls);
  };

  // File Upload Handlers
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploadingLogo(true);
      const res = await uploadImageToCloudinaryDetailed(file);
      setLogoUrl(res.secure_url);
      showVendorToast("✓ Venue Logo uploaded successfully", "success");
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
      const res = await uploadImageToCloudinaryDetailed(file);
      setCoverUrl(res.secure_url);
      showVendorToast("✓ Venue Cover photo uploaded successfully", "success");
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
      const uploadPromises = Array.from(files).map((f) => uploadImageToCloudinaryDetailed(f));
      const results = await Promise.all(uploadPromises);
      const newUrls = results.map((r) => r.secure_url);
      setGalleryImages((prev) => [...prev, ...newUrls]);
      showVendorToast(`✓ Added ${newUrls.length} photos to Venue Gallery`, "success");
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

      const contactActionsArray = [
        ...(actionButtons.callNow ? ["Call Now"] : []),
        ...(actionButtons.whatsapp ? ["WhatsApp"] : []),
        ...(actionButtons.bookVenueVisit ? ["Book Venue Visit"] : []),
        ...(actionButtons.requestQuote ? ["Request Quote"] : []),
        ...(actionButtons.getDirections ? ["Get Directions"] : []),
        ...(actionButtons.website ? ["Website"] : []),
      ];

      const payload: Partial<VendorProfileData> & Record<string, any> = {
        // Branding & Identity
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
        hallImages,
        hall_images: hallImages,

        // Social Links
        instagram: instagram.trim(),
        facebook: facebook.trim(),
        youtube: youtube.trim(),
        website: website.trim(),

        // Venue Highlights
        venueHighlights,
        venue_highlights: venueHighlights,
        storeHighlights: venueHighlights,
        store_highlights: venueHighlights,

        // Featured Halls
        featuredHalls,
        featured_halls: featuredHalls,

        // Venue Information
        yearsInBusiness: yearsInBusiness.trim(),
        years_in_business: yearsInBusiness.trim(),
        guestCapacity: guestCapacity.trim(),
        guest_capacity: guestCapacity.trim(),
        minGuestCapacity: minGuestCapacity.trim(),
        min_guest_capacity: minGuestCapacity.trim(),
        numberOfHalls: numberOfHalls.trim(),
        number_of_halls: numberOfHalls.trim(),
        diningCapacity: diningCapacity.trim(),
        dining_capacity: diningCapacity.trim(),
        parkingCapacity: parkingCapacity.trim(),
        parking_capacity: parkingCapacity.trim(),
        serviceAreas: serviceAreas.trim(),
        service_areas: serviceAreas.trim(),
        languagesSpoken: languagesSpoken.trim(),
        languages_spoken: languagesSpoken.trim(),

        // Contact Action Buttons
        actionButtons,
        action_buttons: actionButtons,
        contactActions: contactActionsArray,
        contact_actions: contactActionsArray,

        // Working Hours & Visit Timings
        openingTime: openingTime.trim(),
        opening_time: openingTime.trim(),
        closingTime: closingTime.trim(),
        closing_time: closingTime.trim(),
        weeklyHolidays: weeklyHolidays.trim(),
        weekly_holidays: weeklyHolidays.trim(),
        venueVisitTimings: venueVisitTimings.trim(),
        venue_visit_timings: venueVisitTimings.trim(),
        publicHolidayAvailability: publicHolidayAvailability.trim(),
        public_holiday_availability: publicHolidayAvailability.trim(),
        advanceAppointmentRequired,
        advance_appointment_required: advanceAppointmentRequired,

        // Booking Policies & Guidelines
        advanceBookingRequired: advanceBookingRequired.trim(),
        advance_booking_required: advanceBookingRequired.trim(),
        advancePaymentPolicy: advancePaymentPolicy.trim(),
        advance_payment_policy: advancePaymentPolicy.trim(),
        cancellationPolicy: cancellationPolicy.trim(),
        cancellation_policy: cancellationPolicy.trim(),
        refundPolicy: refundPolicy.trim(),
        refund_policy: refundPolicy.trim(),
        decorationRules: decorationRules.trim(),
        decoration_rules: decorationRules.trim(),
        outsideCateringPolicy: outsideCateringPolicy.trim(),
        outside_catering_policy: outsideCateringPolicy.trim(),
        outsidePhotographyPolicy: outsidePhotographyPolicy.trim(),
        outside_photography_policy: outsidePhotographyPolicy.trim(),
        noiseRestrictions: noiseRestrictions.trim(),
        noise_restrictions: noiseRestrictions.trim(),
        alcoholPolicy: alcoholPolicy.trim(),
        alcohol_policy: alcoholPolicy.trim(),
        overtimeCharges: overtimeCharges.trim(),
        overtime_charges: overtimeCharges.trim(),
        eventTimingRules: eventTimingRules.trim(),
        event_timing_rules: eventTimingRules.trim(),

        storefront: {
          theme: colorTheme,
          brandColors: activeTheme,
          coverImage: coverUrl,
          logo: logoUrl,
          tagline: tagline.trim(),
          about: about.trim(),
          storeHighlights: venueHighlights,
          featuredCollections: featuredHalls,
          galleryLayout: galleryLayout,
          gallery: [...galleryImages, ...hallImages].map((url, i) => ({ url, caption: `Venue Photo ${i + 1}` })),
          actionButtons,
          businessInfo: {
            experienceYears: yearsInBusiness.trim(),
            guestCapacity: guestCapacity.trim(),
            numberOfHalls: numberOfHalls.trim(),
            parkingCapacity: parkingCapacity.trim(),
            citiesServed: serviceAreas.trim(),
          },
          workingHours: {
            workingDays: "All Days",
            openingTime: openingTime.trim(),
            closingTime: closingTime.trim(),
            weeklyOff: weeklyHolidays.trim(),
            holidayNotice: publicHolidayAvailability.trim(),
          },
          policies: {
            rentalPolicy: advanceBookingRequired.trim(),
            securityDepositPolicy: advancePaymentPolicy.trim(),
            cancellationPolicy: cancellationPolicy.trim(),
            refundPolicy: refundPolicy.trim(),
            damagePolicy: decorationRules.trim(),
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
        showVendorToast("✓ Venue storefront customization saved & synchronized!", "success");
        setTimeout(() => setSaved(false), 3500);
      } else {
        showVendorToast("Unable to save storefront customization. Please try again.", "error");
      }
    } catch (err) {
      console.error("[VenueCustomizeStore] Save error:", err);
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
              Customize Venue Storefront &amp; Spaces
            </h2>
          </div>
          <p className="text-xs text-charcoal/70">
            Real-time visual editor. Colors, banner, hall highlights, capacity, and booking rules update immediately on your public storefront.
          </p>
        </div>

        <button
          type="button"
          disabled={isSaving || isUploadingLogo || isUploadingCover || isUploadingGallery}
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
            id: "preview-venue",
            name: currentDisplayName,
            business_name: currentDisplayName,
            boutique_name: currentDisplayName,
            category: "wedding-venues",
            categoryLabel: "Wedding Venue",
            location: currentLocation,
            city: vendorData?.city || "Kochi",
            state: "Kerala",
            rating: 5.0,
            reviews: 24,
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
            hallImages: hallImages,
            gallery: [...galleryImages, ...hallImages].map((url, i) => ({ url, caption: `Venue Photo ${i + 1}` })),
            startingPrice: "₹1,800 per plate",
            phone: "+91 98470 12345",
            whatsapp: "+91 98470 12345",
            email: "venue@cloche.com",
            address: `${currentLocation}, Kerala`,
            storeHighlights: venueHighlights,
            venueHighlights: venueHighlights,
            featuredCollections: featuredHalls,
            featuredHalls: featuredHalls,
            actionButtons: actionButtons,
            businessInfo: {
              experienceYears: yearsInBusiness,
              guestCapacity: guestCapacity,
              numberOfHalls: numberOfHalls,
              parkingCapacity: parkingCapacity,
              citiesServed: serviceAreas,
            },
            workingHours: {
              workingDays: "All Days",
              openingTime: openingTime,
              closingTime: closingTime,
              weeklyOff: weeklyHolidays,
              holidayNotice: publicHolidayAvailability,
            },
            policies: {
              rentalPolicy: advanceBookingRequired,
              securityDepositPolicy: advancePaymentPolicy,
              cancellationPolicy: cancellationPolicy,
              refundPolicy: refundPolicy,
              damagePolicy: decorationRules,
            },
          }}
          storefront={{
            theme: colorTheme,
            brandColors: activeTheme,
            coverImage: coverUrl,
            logo: logoUrl,
            tagline: tagline,
            about: about,
            storeHighlights: venueHighlights,
            featuredCollections: featuredHalls,
            galleryLayout: galleryLayout,
            gallery: [...galleryImages, ...hallImages].map((url, i) => ({ url, caption: `Venue Photo ${i + 1}` })),
            actionButtons: actionButtons,
            businessInfo: {
              experienceYears: yearsInBusiness,
              guestCapacity: guestCapacity,
              numberOfHalls: numberOfHalls,
              parkingCapacity: parkingCapacity,
              citiesServed: serviceAreas,
            },
            workingHours: {
              workingDays: "All Days",
              openingTime: openingTime,
              closingTime: closingTime,
              weeklyOff: weeklyHolidays,
              holidayNotice: publicHolidayAvailability,
            },
            policies: {
              rentalPolicy: advanceBookingRequired,
              securityDepositPolicy: advancePaymentPolicy,
              cancellationPolicy: cancellationPolicy,
              refundPolicy: refundPolicy,
              damagePolicy: decorationRules,
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
        {/* Section 1: Venue Highlights Badges */}
        <div className="bg-white rounded-2xl border border-gold/15 overflow-hidden shadow-xs">
          <button
            type="button"
            onClick={() => toggleAccordion("highlights")}
            className="w-full p-5 text-left font-serif font-bold text-base text-charcoal flex items-center justify-between bg-[#FAF7F2]/60 hover:bg-[#FAF7F2] transition-colors"
          >
            <div className="flex items-center gap-3">
              <Award style={{ color: activeTheme.primary }} className="w-5 h-5" />
              <div>
                <span className="block">1. Venue Highlights</span>
                <span className="text-xs font-sans font-normal text-charcoal/60">
                  Select key venue badges to display under your venue name
                </span>
              </div>
            </div>
            {openAccordions.highlights ? <ChevronUp className="w-4 h-4 text-charcoal/40" /> : <ChevronDown className="w-4 h-4 text-charcoal/40" />}
          </button>

          {openAccordions.highlights && (
            <div className="p-5 border-t border-gold/10 space-y-4 text-xs animate-in fade-in duration-200">
              <p className="text-charcoal/70 leading-relaxed">
                Click to toggle venue highlight badges on your public storefront:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                {VENUE_HIGHLIGHT_OPTIONS.map((badge) => {
                  const isSelected = venueHighlights.includes(badge);
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

        {/* Section 2: Featured Halls (Reorderable) */}
        <div className="bg-white rounded-2xl border border-gold/15 overflow-hidden shadow-xs">
          <button
            type="button"
            onClick={() => toggleAccordion("featuredHalls")}
            className="w-full p-5 text-left font-serif font-bold text-base text-charcoal flex items-center justify-between bg-[#FAF7F2]/60 hover:bg-[#FAF7F2] transition-colors"
          >
            <div className="flex items-center gap-3">
              <Building2 style={{ color: activeTheme.primary }} className="w-5 h-5" />
              <div>
                <span className="block">2. Featured Halls</span>
                <span className="text-xs font-sans font-normal text-charcoal/60">
                  Select and pin banquet halls & lawns in your preferred display order
                </span>
              </div>
            </div>
            {openAccordions.featuredHalls ? <ChevronUp className="w-4 h-4 text-charcoal/40" /> : <ChevronDown className="w-4 h-4 text-charcoal/40" />}
          </button>

          {openAccordions.featuredHalls && (
            <div className="p-5 border-t border-gold/10 space-y-4 text-xs animate-in fade-in duration-200">
              <div>
                <span className="font-bold text-charcoal block mb-2">Available Halls & Spaces (Click to Pin/Unpin):</span>
                <div className="flex flex-wrap gap-2">
                  {ALL_VENUE_HALL_OPTIONS.map((hall) => {
                    const isPinned = featuredHalls.includes(hall);
                    return (
                      <button
                        key={hall}
                        type="button"
                        onClick={() => toggleFeaturedHall(hall)}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                          isPinned
                            ? "bg-[#0F4C45] text-white border-[#0F4C45]"
                            : "bg-[#FAF7F2] text-charcoal border-gold/20 hover:bg-gold/15"
                        }`}
                      >
                        {hall} {isPinned ? "✓" : "+"}
                      </button>
                    );
                  })}
                </div>
              </div>

              {featuredHalls.length > 0 && (
                <div className="pt-3 border-t border-gold/10 space-y-2">
                  <span className="font-bold text-charcoal block">Pinned Order (Use arrows to reorder):</span>
                  <div className="space-y-1.5">
                    {featuredHalls.map((hall, idx) => (
                      <div
                        key={hall}
                        className="p-3 bg-[#FAF7F2] rounded-xl border border-gold/15 flex items-center justify-between text-xs"
                      >
                        <span className="font-bold text-charcoal flex items-center gap-2">
                          <Building2 className="w-3.5 h-3.5 text-[#0F4C45]" /> {idx + 1}. {hall}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => moveHall(idx, "up")}
                            className="p-1 rounded bg-white text-charcoal hover:bg-gray-100 disabled:opacity-30 cursor-pointer"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={idx === featuredHalls.length - 1}
                            onClick={() => moveHall(idx, "down")}
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

        {/* Section 3: Venue Information */}
        <div className="bg-white rounded-2xl border border-gold/15 overflow-hidden shadow-xs">
          <button
            type="button"
            onClick={() => toggleAccordion("venueInfo")}
            className="w-full p-5 text-left font-serif font-bold text-base text-charcoal flex items-center justify-between bg-[#FAF7F2]/60 hover:bg-[#FAF7F2] transition-colors"
          >
            <div className="flex items-center gap-3">
              <Layers style={{ color: activeTheme.primary }} className="w-5 h-5" />
              <div>
                <span className="block">3. Venue Information</span>
                <span className="text-xs font-sans font-normal text-charcoal/60">
                  Capacities, hall counts, operating districts & languages spoken
                </span>
              </div>
            </div>
            {openAccordions.venueInfo ? <ChevronUp className="w-4 h-4 text-charcoal/40" /> : <ChevronDown className="w-4 h-4 text-charcoal/40" />}
          </button>

          {openAccordions.venueInfo && (
            <div className="p-5 border-t border-gold/10 space-y-4 text-xs animate-in fade-in duration-200">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="block font-bold text-charcoal">About Venue / Description</label>
                  <span className={`text-[10px] ${about.length > 500 ? "text-red-500 font-bold" : "text-charcoal/50"}`}>
                    {about.length}/500 chars
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  placeholder="Describe the architectural luxury, lawn ambiance, and 5-star hospitality of your wedding venue..."
                  className="w-full p-2.5 bg-[#FAF7F2] border border-gold/15 rounded-xl outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-charcoal mb-1">Years in Business</label>
                  <input
                    type="text"
                    value={yearsInBusiness}
                    onChange={(e) => setYearsInBusiness(e.target.value)}
                    placeholder="e.g. 12"
                    className="w-full p-2.5 bg-[#FAF7F2] border border-gold/15 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-charcoal mb-1">Maximum Guest Capacity</label>
                  <input
                    type="text"
                    value={guestCapacity}
                    onChange={(e) => setGuestCapacity(e.target.value)}
                    placeholder="e.g. 1,500 Guests"
                    className="w-full p-2.5 bg-[#FAF7F2] border border-gold/15 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-charcoal mb-1">Minimum Guest Capacity</label>
                  <input
                    type="text"
                    value={minGuestCapacity}
                    onChange={(e) => setMinGuestCapacity(e.target.value)}
                    placeholder="e.g. 150 Guests"
                    className="w-full p-2.5 bg-[#FAF7F2] border border-gold/15 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-charcoal mb-1">Number of Halls & Spaces</label>
                  <input
                    type="text"
                    value={numberOfHalls}
                    onChange={(e) => setNumberOfHalls(e.target.value)}
                    placeholder="e.g. 3 Halls & 2 Lawns"
                    className="w-full p-2.5 bg-[#FAF7F2] border border-gold/15 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-charcoal mb-1">Dining / Seated Capacity</label>
                  <input
                    type="text"
                    value={diningCapacity}
                    onChange={(e) => setDiningCapacity(e.target.value)}
                    placeholder="e.g. 600 Seated"
                    className="w-full p-2.5 bg-[#FAF7F2] border border-gold/15 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-charcoal mb-1">Parking & Valet Capacity</label>
                  <input
                    type="text"
                    value={parkingCapacity}
                    onChange={(e) => setParkingCapacity(e.target.value)}
                    placeholder="e.g. 350 Cars & Valet"
                    className="w-full p-2.5 bg-[#FAF7F2] border border-gold/15 rounded-xl outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-charcoal mb-1">Operating Districts & Service Areas</label>
                  <input
                    type="text"
                    value={serviceAreas}
                    onChange={(e) => setServiceAreas(e.target.value)}
                    placeholder="e.g. Golf Course Road, Gurgaon, South Delhi, NCR"
                    className="w-full p-2.5 bg-[#FAF7F2] border border-gold/15 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-charcoal mb-1">Languages Spoken by Staff</label>
                  <input
                    type="text"
                    value={languagesSpoken}
                    onChange={(e) => setLanguagesSpoken(e.target.value)}
                    placeholder="e.g. English, Hindi, Punjabi"
                    className="w-full p-2.5 bg-[#FAF7F2] border border-gold/15 rounded-xl outline-none"
                  />
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
                Enable or disable action buttons for visitors viewing your venue profile:
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
                    <Calendar className="w-3.5 h-3.5 text-[#0F4C45]" /> Book Venue Visit
                  </span>
                  <input
                    type="checkbox"
                    checked={actionButtons.bookVenueVisit}
                    onChange={(e) => setActionButtons((prev) => ({ ...prev, bookVenueVisit: e.target.checked }))}
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

        {/* Section 5: Working Hours & Venue Visit Timings */}
        <div className="bg-white rounded-2xl border border-gold/15 overflow-hidden shadow-xs">
          <button
            type="button"
            onClick={() => toggleAccordion("timings")}
            className="w-full p-5 text-left font-serif font-bold text-base text-charcoal flex items-center justify-between bg-[#FAF7F2]/60 hover:bg-[#FAF7F2] transition-colors"
          >
            <div className="flex items-center gap-3">
              <Clock style={{ color: activeTheme.primary }} className="w-5 h-5" />
              <div>
                <span className="block">5. Working Hours & Venue Visit Timings</span>
                <span className="text-xs font-sans font-normal text-charcoal/60">
                  Office timings, weekly holidays & guided venue tour slots
                </span>
              </div>
            </div>
            {openAccordions.timings ? <ChevronUp className="w-4 h-4 text-charcoal/40" /> : <ChevronDown className="w-4 h-4 text-charcoal/40" />}
          </button>

          {openAccordions.timings && (
            <div className="p-5 border-t border-gold/10 space-y-4 text-xs animate-in fade-in duration-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-charcoal mb-1">Office Opening Time</label>
                  <input
                    type="text"
                    value={openingTime}
                    onChange={(e) => setOpeningTime(e.target.value)}
                    placeholder="e.g. 09:00 AM"
                    className="w-full p-2.5 bg-[#FAF7F2] border border-gold/15 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-charcoal mb-1">Office Closing Time</label>
                  <input
                    type="text"
                    value={closingTime}
                    onChange={(e) => setClosingTime(e.target.value)}
                    placeholder="e.g. 09:00 PM"
                    className="w-full p-2.5 bg-[#FAF7F2] border border-gold/15 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-charcoal mb-1">Weekly Holidays / Off Days</label>
                  <input
                    type="text"
                    value={weeklyHolidays}
                    onChange={(e) => setWeeklyHolidays(e.target.value)}
                    placeholder="e.g. Open All 7 Days or Tuesday Off"
                    className="w-full p-2.5 bg-[#FAF7F2] border border-gold/15 rounded-xl outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-charcoal mb-1">Guided Venue Visit Timings</label>
                  <input
                    type="text"
                    value={venueVisitTimings}
                    onChange={(e) => setVenueVisitTimings(e.target.value)}
                    placeholder="e.g. 10:00 AM - 06:00 PM (Daily by appointment)"
                    className="w-full p-2.5 bg-[#FAF7F2] border border-gold/15 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-charcoal mb-1">Public Holiday Availability</label>
                  <input
                    type="text"
                    value={publicHolidayAvailability}
                    onChange={(e) => setPublicHolidayAvailability(e.target.value)}
                    placeholder="e.g. Open for tours by appointment"
                    className="w-full p-2.5 bg-[#FAF7F2] border border-gold/15 rounded-xl outline-none"
                  />
                </div>

                <div className="sm:col-span-3 pt-1">
                  <label className="p-3 bg-[#FAF7F2] rounded-xl border border-gold/15 flex items-center justify-between cursor-pointer">
                    <div>
                      <span className="font-bold text-charcoal block">Prior Appointment Required for Guided Visits</span>
                      <span className="text-[11px] text-charcoal/60">Couples must schedule a visit time before visiting the venue grounds</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={advanceAppointmentRequired}
                      onChange={(e) => setAdvanceAppointmentRequired(e.target.checked)}
                      className="rounded accent-[#0F4C45] w-4 h-4 shrink-0"
                    />
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Section 6: Booking Policies & Venue Guidelines */}
        <div className="bg-white rounded-2xl border border-gold/15 overflow-hidden shadow-xs">
          <button
            type="button"
            onClick={() => toggleAccordion("policies")}
            className="w-full p-5 text-left font-serif font-bold text-base text-charcoal flex items-center justify-between bg-[#FAF7F2]/60 hover:bg-[#FAF7F2] transition-colors"
          >
            <div className="flex items-center gap-3">
              <ShieldCheck style={{ color: activeTheme.primary }} className="w-5 h-5" />
              <div>
                <span className="block">6. Booking Policies & Venue Guidelines</span>
                <span className="text-xs font-sans font-normal text-charcoal/60">
                  Advance booking, payments, catering, decor & noise guidelines
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
                    placeholder="e.g. Minimum 30 to 90 days advance booking recommended"
                    className="w-full p-2.5 bg-[#FAF7F2] border border-gold/15 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-charcoal mb-1">Advance Payment Schedule</label>
                  <input
                    type="text"
                    value={advancePaymentPolicy}
                    onChange={(e) => setAdvancePaymentPolicy(e.target.value)}
                    placeholder="e.g. 25% on booking, 50% 30 days prior, 25% 7 days prior"
                    className="w-full p-2.5 bg-[#FAF7F2] border border-gold/15 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-charcoal mb-1">Cancellation Policy</label>
                  <input
                    type="text"
                    value={cancellationPolicy}
                    onChange={(e) => setCancellationPolicy(e.target.value)}
                    placeholder="e.g. Full refund 60+ days prior to event"
                    className="w-full p-2.5 bg-[#FAF7F2] border border-gold/15 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-charcoal mb-1">Security Deposit & Refund Policy</label>
                  <input
                    type="text"
                    value={refundPolicy}
                    onChange={(e) => setRefundPolicy(e.target.value)}
                    placeholder="e.g. 100% deposit refunded within 24 hours of inspection"
                    className="w-full p-2.5 bg-[#FAF7F2] border border-gold/15 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-charcoal mb-1">Decoration Policy</label>
                  <input
                    type="text"
                    value={decorationRules}
                    onChange={(e) => setDecorationRules(e.target.value)}
                    placeholder="e.g. Empaneled decorators available; outside decor by approval"
                    className="w-full p-2.5 bg-[#FAF7F2] border border-gold/15 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-charcoal mb-1">Outside Catering Policy</label>
                  <input
                    type="text"
                    value={outsideCateringPolicy}
                    onChange={(e) => setOutsideCateringPolicy(e.target.value)}
                    placeholder="e.g. In-house catering team; outside caterers subject to royalty"
                    className="w-full p-2.5 bg-[#FAF7F2] border border-gold/15 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-charcoal mb-1">Photography & Drone Policy</label>
                  <input
                    type="text"
                    value={outsidePhotographyPolicy}
                    onChange={(e) => setOutsidePhotographyPolicy(e.target.value)}
                    placeholder="e.g. Unrestricted drone videography and professional cameras allowed"
                    className="w-full p-2.5 bg-[#FAF7F2] border border-gold/15 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-charcoal mb-1">Music & Noise Timing Restrictions</label>
                  <input
                    type="text"
                    value={noiseRestrictions}
                    onChange={(e) => setNoiseRestrictions(e.target.value)}
                    placeholder="e.g. Indoor: 01:00 AM; Outdoor lawn DJ cutoff: 10:00 PM"
                    className="w-full p-2.5 bg-[#FAF7F2] border border-gold/15 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-charcoal mb-1">Alcohol Policy & Bar License</label>
                  <input
                    type="text"
                    value={alcoholPolicy}
                    onChange={(e) => setAlcoholPolicy(e.target.value)}
                    placeholder="e.g. Allowed with standard 1-day excise bar permit"
                    className="w-full p-2.5 bg-[#FAF7F2] border border-gold/15 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-charcoal mb-1">Overtime Charges</label>
                  <input
                    type="text"
                    value={overtimeCharges}
                    onChange={(e) => setOvertimeCharges(e.target.value)}
                    placeholder="e.g. ₹15,000 per extra hour beyond slot cutoff"
                    className="w-full p-2.5 bg-[#FAF7F2] border border-gold/15 rounded-xl outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-charcoal mb-1">Available Event Slot Rules</label>
                  <input
                    type="text"
                    value={eventTimingRules}
                    onChange={(e) => setEventTimingRules(e.target.value)}
                    placeholder="e.g. Morning (06 AM - 03 PM) | Evening (05 PM - 11:30 PM) | Full Day (06 AM - 11:30 PM)"
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
                  Select a cohesive luxury palette for buttons, badges, and accents
                </span>
              </div>
            </div>
            {openAccordions.theme ? <ChevronUp className="w-4 h-4 text-charcoal/40" /> : <ChevronDown className="w-4 h-4 text-charcoal/40" />}
          </button>

          {openAccordions.theme && (
            <div className="p-5 border-t border-gold/10 space-y-4 text-xs animate-in fade-in duration-200">
              <p className="text-charcoal/70">
                Choose a signature theme that highlights your venue's aesthetic:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                {COLOR_THEMES.map((theme) => {
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

        {/* Section 8: Logo, Cover Image & Branding */}
        <div className="bg-white rounded-2xl border border-gold/15 overflow-hidden shadow-xs">
          <button
            type="button"
            onClick={() => toggleAccordion("branding")}
            className="w-full p-5 text-left font-serif font-bold text-base text-charcoal flex items-center justify-between bg-[#FAF7F2]/60 hover:bg-[#FAF7F2] transition-colors"
          >
            <div className="flex items-center gap-3">
              <ImageIcon style={{ color: activeTheme.primary }} className="w-5 h-5" />
              <div>
                <span className="block">8. Logo, Cover Image & Branding Media</span>
                <span className="text-xs font-sans font-normal text-charcoal/60">
                  Venue logo, banner cover, tagline & social connections
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
                      <Building2 className="w-8 h-8 text-charcoal/30" />
                    )}
                  </div>
                  <div>
                    <span className="font-bold text-charcoal block">Venue Logo</span>
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

                {/* Cover Photo Upload Card */}
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
                <label className="block font-bold text-charcoal mb-1">Venue Tagline / Subtitle</label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="e.g. Royal Palaces, Majestic Lawns & Unforgettable Grand Celebrations"
                  className="w-full p-2.5 bg-[#FAF7F2] border border-gold/15 rounded-xl outline-none"
                />
              </div>

              {/* Venue Gallery Images */}
              <div className="space-y-3 pt-2 border-t border-gold/10">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-charcoal block">Venue Gallery Photos ({galleryImages.length})</span>
                    <span className="text-[10px] text-charcoal/60">Upload high-resolution banquet and lawn photography</span>
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
                        <img src={img} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover" />
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
                      placeholder="Instagram URL (e.g. instagram.com/royalorchid)"
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
