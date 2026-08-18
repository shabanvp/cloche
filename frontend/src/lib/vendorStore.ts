"use client";

export interface VendorProfileData {
  id: string;
  user_id?: string;
  name: string;
  boutique_name: string;
  owner_name?: string;
  ownerName?: string;
  logo?: string;
  logo_url?: string;
  coverImage?: string;
  cover_image?: string;
  description?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  website?: string;
  instagram?: string;
  facebook?: string;
  youtube?: string;
  tagline?: string;
  about?: string;
  color_theme?: string;
  colorTheme?: string;
  gallery_layout?: string;
  galleryLayout?: string;
  intro_video?: string;
  intro_video_url?: string;
  address?: string;
  city?: string;
  district?: string;
  location?: string;
  category: string;
  workingHours?: string;
  working_hours?: string;
  serviceAreas?: string;
  service_areas?: string;
  experience?: string;
  experience_years?: string;
  experienceYears?: string;
  plan?: string;
  planCode?: string;
  isSubscribed?: boolean;
  is_verified?: boolean;
  isVerified?: boolean;
  profile_completion_percentage?: number;
  cuisineTypes?: string[];
  cuisine_types?: string[];
  serviceTypes?: string[];
  service_types?: string[];
  serviceLocations?: string[];
  service_locations?: string[];
  guestCapacity?: string;
  guest_capacity?: string;
  cateringSpecialities?: string[];
  catering_specialities?: string[];
  storeHighlights?: string[];
  store_highlights?: string[];
  featuredCollections?: string[];
  featured_collections?: string[];
  rentalAvailable?: boolean;
  rental_available?: boolean;
  homeTrialAvailable?: boolean;
  home_trial_available?: boolean;
  homeDeliveryAvailable?: boolean;
  home_delivery_available?: boolean;
  customJewelleryAvailable?: boolean;
  custom_jewellery_available?: boolean;
  collectionsCount?: string;
  collections_count?: string;
  citiesServed?: string;
  cities_served?: string;
  actionButtons?: {
    callNow?: boolean;
    whatsapp?: boolean;
    bookAppointment?: boolean;
    viewCollection?: boolean;
    getQuote?: boolean;
    visitStore?: boolean;
  };
  action_buttons?: {
    callNow?: boolean;
    whatsapp?: boolean;
    bookAppointment?: boolean;
    viewCollection?: boolean;
    getQuote?: boolean;
    visitStore?: boolean;
  };
  openingTime?: string;
  opening_time?: string;
  closingTime?: string;
  closing_time?: string;
  workingDays?: string;
  working_days?: string;
  weeklyOff?: string;
  weekly_off?: string;
  holidayNotice?: string;
  holiday_notice?: string;
  rentalPolicy?: string;
  rental_policy?: string;
  returnPolicy?: string;
  return_policy?: string;
  cancellationPolicy?: string;
  cancellation_policy?: string;
  securityDepositPolicy?: string;
  security_deposit_policy?: string;
  damagePolicy?: string;
  damage_policy?: string;
  // Venue specific attributes (matching Supabase venue_details columns)
  facilities?: string[];
  venue_facilities?: string[];
  venueHighlights?: string[];
  venue_highlights?: string[];
  featuredHalls?: string[];
  featured_halls?: string[];
  yearsInBusiness?: string;
  years_in_business?: string;
  minGuestCapacity?: string;
  min_guest_capacity?: string;
  numberOfHalls?: string;
  number_of_halls?: string;
  indoorCapacity?: string;
  indoor_capacity?: string;
  outdoorCapacity?: string;
  outdoor_capacity?: string;
  diningCapacity?: string;
  dining_capacity?: string;
  parkingCapacity?: string;
  parking_capacity?: string;
  languagesSpoken?: string;
  languages_spoken?: string;
  contactActions?: string[];
  contact_actions?: string[];
  weeklyHolidays?: string;
  weekly_holidays?: string;
  publicHolidayAvailability?: string;
  public_holiday_availability?: string;
  venueVisitTimings?: string;
  venue_visit_timings?: string;
  advanceAppointmentRequired?: boolean | string;
  advance_appointment_required?: boolean | string;
  advanceBookingRequired?: string;
  advance_booking_required?: string;
  advancePaymentPolicy?: string;
  advance_payment_policy?: string;
  refundPolicy?: string;
  refund_policy?: string;
  overtimeCharges?: string;
  overtime_charges?: string;
  decorationRules?: string;
  decoration_rules?: string;
  outsideCateringPolicy?: string;
  outside_catering_policy?: string;
  outsidePhotographyPolicy?: string;
  outside_photography_policy?: string;
  noiseRestrictions?: string;
  noise_restrictions?: string;
  alcoholPolicy?: string;
  alcohol_policy?: string;
  eventTimingRules?: string;
  event_timing_rules?: string;
  hallImages?: string[];
  hall_images?: string[];

  // Mehendi Artist specific attributes (matching Supabase mehndi_details columns)
  mehendiHighlights?: string[];
  mehendi_highlights?: string[];
  featuredPackages?: string[];
  featured_packages?: string[];
  maxBridesPerDay?: string;
  max_brides_per_day?: string;
  organicHennaCertified?: boolean;
  organic_henna_certified?: boolean;
  teamSize?: string;
  team_size?: string;
  outstationAvailable?: boolean;
  outstation_available?: boolean;
  stainCarePolicy?: string;
  stain_care_policy?: string;
  groupBookingPolicy?: string;
  group_booking_policy?: string;
  travelPolicy?: string;
  travel_policy?: string;

  // Wedding Decorator specific attributes (matching Supabase decor_details columns)
  decorHighlights?: string[];
  decor_highlights?: string[];
  featuredThemes?: string[];
  featured_themes?: string[];
  eventsCompleted?: string;
  events_completed?: string;
  decorServices?: string[];
  decor_services?: string[];
  setupTeardownPolicy?: string;
  setup_teardown_policy?: string;
  propertyDamagePolicy?: string;
  property_damage_policy?: string;
  siteSurveyAvailable?: boolean;
  site_survey_available?: boolean;
}

/**
 * Normalizes raw category string from DB/API into canonical category key
 */
export function normalizeVendorCategoryKey(rawCategory: string): string {
  const slug = (rawCategory || "").toLowerCase().trim();
  if (slug.includes("bride") && (slug.includes("story") || slug.includes("studio"))) return "brides-story";
  if (slug.includes("groom") && (slug.includes("story") || slug.includes("studio"))) return "grooms-story";
  if (slug.includes("wedding") && (slug.includes("story") || slug.includes("studio"))) return "wedding-story";
  if (slug.includes("photo") || slug.includes("camera") || slug.includes("video")) return "photographers";
  if (slug.includes("mehendi") || slug.includes("henna") || slug.includes("mehndi")) return "mehendi";
  if (slug.includes("venue") || slug.includes("palace") || slug.includes("lawn") || slug.includes("banquet") || slug.includes("car")) return "venues";
  if (slug.includes("makeup") || slug.includes("glam") || slug.includes("beauty")) return "makeup";
  if (slug.includes("cater") || slug.includes("food") || slug.includes("dining") || slug.includes("cake") || slug.includes("baker") || slug.includes("dessert")) return "caterers";
  if (slug.includes("invite") || slug.includes("card") || slug.includes("papyrus") || slug.includes("gift")) return "invitations";
  if (slug.includes("jewel") || slug.includes("polki") || slug.includes("gold") || slug.includes("ornament")) return "jewellery";
  if (slug.includes("decor") || slug.includes("planner") || slug.includes("flower") || slug.includes("rental") || slug.includes("choreo") || slug.includes("dj") || slug.includes("band") || slug.includes("entertain")) return "planners";
  if (slug.includes("boutique") || slug.includes("bridal") || slug.includes("wear") || slug.includes("groom") || slug.includes("sherwani") || slug.includes("suit")) return "boutiques";
  return "caterers";
}

/**
 * Helper to display toast notifications across vendor pages.
 */
export function showVendorToast(message: string, type: "success" | "error" | "info" = "success") {
  if (typeof window !== "undefined") {
    console.log(`[VendorToast ${type}]:`, message);
    try {
      const event = new CustomEvent("vendor_toast", { detail: { message, type } });
      window.dispatchEvent(event);
    } catch (_) {}
  }
}

/**
 * Helper to sync updated vendor profile fields with database.
 * Returns an object with { success: boolean } to match calling client pages.
 */
export async function syncVendorProfileWithDatabase(
  profileData: Partial<VendorProfileData> & Record<string, any>
): Promise<{ success: boolean; data?: any }> {
  if (typeof window !== "undefined") {
    try {
      const extraHeaders: Record<string, string> = { "Content-Type": "application/json" };
      try {
        const cookieStr = document.cookie;
        const match = cookieStr.match(/(?:^|;\s*)user_data=([^;]*)/);
        if (match) {
          const parsed = JSON.parse(decodeURIComponent(match[1]));
          if (parsed?.id) extraHeaders["x-user-id"] = parsed.id;
          if (parsed?.email) extraHeaders["x-user-email"] = parsed.email;
        }
        const tokenMatch = cookieStr.match(/(?:^|;\s*)auth_token=([^;]*)/);
        if (tokenMatch && tokenMatch[1]) extraHeaders["x-auth-token"] = tokenMatch[1];
      } catch (_) {}

      const payload = {
        profile: {
          business_name: profileData.boutique_name || profileData.name,
          boutique_name: profileData.boutique_name || profileData.name,
          about: profileData.description,
          city: profileData.city,
          address: profileData.address,
          state: profileData.district,
          logo: profileData.logo || profileData.logo_url,
          logo_url: profileData.logo_url || profileData.logo,
          coverImage: profileData.coverImage || profileData.cover_image,
          cover_image: profileData.cover_image || profileData.coverImage,
          working_hours: profileData.working_hours || profileData.workingHours,
          service_areas: profileData.service_areas || profileData.serviceAreas,
          experience_years: profileData.experience,
          tagline: profileData.tagline,
          ...profileData,
        },
        contact: {
          contact_name: profileData.owner_name || profileData.ownerName,
          phone: profileData.phone,
          whatsapp: profileData.whatsapp || profileData.phone,
          email: profileData.email,
        },
        address: {
          address_line1: profileData.address,
          city: profileData.city,
          state: profileData.district,
        },
        socialLinks: [
          { platform: "instagram", url: profileData.instagram || "" },
          { platform: "facebook", url: profileData.facebook || "" },
          { platform: "youtube", url: profileData.youtube || "" },
          { platform: "website", url: profileData.website || "" },
        ],
        ...profileData,
      };

      const res = await fetch("/api/v1/vendor/profile", {
        method: "PUT",
        headers: extraHeaders,
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        inFlightProfileFetch = null;
        try {
          const raw = localStorage.getItem("cloche_active_vendor_identity");
          const existing = raw ? JSON.parse(raw) : {};
          const updated = {
            ...existing,
            ...profileData,
            logo: profileData.logo || profileData.logo_url || existing.logo || existing.logo_url,
            logo_url: profileData.logo || profileData.logo_url || existing.logo_url || existing.logo,
            coverImage: profileData.coverImage || profileData.cover_image || existing.coverImage || existing.cover_image,
            cover_image: profileData.coverImage || profileData.cover_image || existing.cover_image || existing.coverImage,
          };
          localStorage.setItem("cloche_active_vendor_identity", JSON.stringify(updated));
          window.dispatchEvent(new CustomEvent("cloche_vendor_profile_updated", { detail: updated }));
        } catch (_) {}

        await fetchAuthenticatedVendorFromDb();
        return { success: true };
      }
    } catch (e) {
      console.error("[vendorStore] Sync error:", e);
    }
  }
  return { success: false };
}

/**
 * Dynamic Calculation of Profile Completion Percentage
 */
export function calculateDynamicProfileCompletion(
  profile: Partial<VendorProfileData>,
  servicesCount: number = 0,
  packagesCount: number = 0,
  galleryCount: number = 0
): number {
  const fields = [
    Boolean(profile.boutique_name || profile.name),
    Boolean(profile.logo || profile.logo_url),
    Boolean(profile.coverImage || profile.cover_image),
    Boolean(profile.description && profile.description.length > 10),
    Boolean(profile.phone || profile.whatsapp),
    Boolean(profile.email),
    Boolean(profile.address),
    Boolean(profile.category),
    Boolean(profile.workingHours || profile.working_hours),
    Boolean(profile.instagram || profile.website),
    servicesCount > 0,
    packagesCount > 0 || galleryCount > 0,
  ];

  const completed = fields.filter(Boolean).length;
  const percentage = Math.round((completed / fields.length) * 100);
  return Math.max(10, Math.min(100, percentage));
}

let inFlightProfileFetch: Promise<VendorProfileData> | null = null;

/**
 * Fetches the authenticated vendor's live database record from Supabase DB via /api/v1/vendor/profile.
 * NEVER reads from hardcoded fallbacks or stale localStorage objects.
 */
export async function fetchAuthenticatedVendorFromDb(): Promise<VendorProfileData> {
  if (inFlightProfileFetch) {
    return inFlightProfileFetch;
  }

  inFlightProfileFetch = (async () => {
    if (typeof window !== "undefined") {
      try {
        const extraHeaders: Record<string, string> = { "Content-Type": "application/json" };
        try {
          const cookieStr = document.cookie;
          const match = cookieStr.match(/(?:^|;\s*)user_data=([^;]*)/);
          if (match) {
            const parsed = JSON.parse(decodeURIComponent(match[1]));
            if (parsed?.id) extraHeaders["x-user-id"] = parsed.id;
            if (parsed?.email) extraHeaders["x-user-email"] = parsed.email;
          }
          const tokenMatch = cookieStr.match(/(?:^|;\s*)auth_token=([^;]*)/);
          if (tokenMatch && tokenMatch[1]) extraHeaders["x-auth-token"] = tokenMatch[1];
        } catch (_) {}

        const res = await fetch("/api/v1/vendor/profile", {
          headers: extraHeaders,
          credentials: "include",
          cache: "no-store",
        });

        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            const v = json.data.vendor || {};
            const p = json.data.profile || {};
            const c = Array.isArray(json.data.contacts) && json.data.contacts.length > 0 ? json.data.contacts[0] : {};
            const a = Array.isArray(json.data.addresses) && json.data.addresses.length > 0 ? json.data.addresses[0] : {};
            const s = Array.isArray(json.data.socialLinks) ? json.data.socialLinks : [];

            const instaLink = s.find((item: any) => item.platform === "instagram")?.url || "";
            const facebookLink = s.find((item: any) => item.platform === "facebook")?.url || "";
            const youtubeLink = s.find((item: any) => item.platform === "youtube")?.url || "";
            const webLink = s.find((item: any) => item.platform === "website")?.url || "";

            const bName = p.business_name || v.boutique_name || v.name || "";
            const catObj = v.category;
            const catName = (typeof catObj === "object" && catObj !== null)
              ? (catObj.name || catObj.slug || "")
              : (typeof catObj === "string" ? catObj : (v.vendor_categories?.name || ""));

            const ownerNameVal = c.contact_name || v.owner_name || v.ownerName || p.owner_name || "";

            const catDetails = json.data.categoryDetails || {};
            const cuisineTypesVal = catDetails.cuisine_types || p.cuisine_types || p.cuisineTypes || [];
            const serviceTypesVal = catDetails.service_types || p.service_types || p.serviceTypes || [];
            const serviceLocationsVal = catDetails.service_locations || p.service_locations || p.serviceLocations || [];
            const guestCapacityVal = catDetails.guest_capacity || p.guest_capacity || p.guestCapacity || "";
            const cateringSpecialitiesVal = catDetails.catering_specialities || p.catering_specialities || p.cateringSpecialities || [];

            const resolvedVendor: VendorProfileData = {
              id: v.id || "",
              user_id: v.user_id || "",
              name: bName,
              boutique_name: bName,
              owner_name: ownerNameVal,
              ownerName: ownerNameVal,
              category: catName,
              logo: p.logo_url || v.logo_url || "",
              logo_url: p.logo_url || v.logo_url || "",
              coverImage: p.cover_image || v.cover_image || "",
              cover_image: p.cover_image || v.cover_image || "",
              description: p.about || v.description || "",
              tagline: p.tagline || v.tagline || "",
              color_theme: p.color_theme || "emerald",
              colorTheme: p.color_theme || "emerald",
              gallery_layout: p.gallery_layout || "grid",
              galleryLayout: p.gallery_layout || "grid",
              intro_video: p.intro_video_url || p.intro_video || "",
              intro_video_url: p.intro_video_url || p.intro_video || "",
              phone: c.phone || v.phone || "",
              whatsapp: c.whatsapp || v.whatsapp || c.phone || "",
              email: c.email || v.email || "",
              city: p.city || a.city || v.city || "",
              district: p.state || a.state || v.district || "",
              address: a.address_line1 || p.address || "",
              instagram: instaLink,
              facebook: facebookLink,
              youtube: youtubeLink,
              website: webLink,
              workingHours: v.working_hours || p.working_hours || "",
              working_hours: v.working_hours || p.working_hours || "",
              serviceAreas: v.service_areas || p.service_areas || "",
              service_areas: v.service_areas || p.service_areas || "",
              experience: v.experience_years || p.experience_years || "",
              experience_years: v.experience_years || p.experience_years || "",
              experienceYears: v.experience_years || p.experience_years || "",
              profile_completion_percentage: v.profile_completion_percentage || 0,
              cuisineTypes: Array.isArray(cuisineTypesVal) ? cuisineTypesVal : [],
              cuisine_types: Array.isArray(cuisineTypesVal) ? cuisineTypesVal : [],
              serviceTypes: Array.isArray(serviceTypesVal) ? serviceTypesVal : [],
              service_types: Array.isArray(serviceTypesVal) ? serviceTypesVal : [],
              serviceLocations: Array.isArray(serviceLocationsVal) ? serviceLocationsVal : [],
              service_locations: Array.isArray(serviceLocationsVal) ? serviceLocationsVal : [],
              guestCapacity: guestCapacityVal,
              guest_capacity: guestCapacityVal,
              cateringSpecialities: Array.isArray(cateringSpecialitiesVal) ? cateringSpecialitiesVal : [],
              catering_specialities: Array.isArray(cateringSpecialitiesVal) ? cateringSpecialitiesVal : [],
              storeHighlights: p.store_highlights || p.storeHighlights || [],
              store_highlights: p.store_highlights || p.storeHighlights || [],
              featuredCollections: p.featured_collections || p.featuredCollections || [],
              featured_collections: p.featured_collections || p.featuredCollections || [],
              rentalAvailable: Boolean(p.rental_available ?? p.rentalAvailable ?? true),
              rental_available: Boolean(p.rental_available ?? p.rentalAvailable ?? true),
              homeTrialAvailable: Boolean(p.home_trial_available ?? p.homeTrialAvailable ?? false),
              home_trial_available: Boolean(p.home_trial_available ?? p.homeTrialAvailable ?? false),
              homeDeliveryAvailable: Boolean(p.home_delivery_available ?? p.homeDeliveryAvailable ?? true),
              home_delivery_available: Boolean(p.home_delivery_available ?? p.homeDeliveryAvailable ?? true),
              customJewelleryAvailable: Boolean(p.custom_jewellery_available ?? p.customJewelleryAvailable ?? true),
              custom_jewellery_available: Boolean(p.custom_jewellery_available ?? p.customJewelleryAvailable ?? true),
              collectionsCount: p.collections_count || p.collectionsCount || "50+ Sets",
              collections_count: p.collections_count || p.collectionsCount || "50+ Sets",
              citiesServed: p.cities_served || p.citiesServed || "Kochi, Calicut, Trivandrum",
              cities_served: p.cities_served || p.citiesServed || "Kochi, Calicut, Trivandrum",
              actionButtons: p.action_buttons || p.actionButtons || { callNow: true, whatsapp: true, bookAppointment: true, viewCollection: true, getQuote: true, visitStore: true },
              action_buttons: p.action_buttons || p.actionButtons || { callNow: true, whatsapp: true, bookAppointment: true, viewCollection: true, getQuote: true, visitStore: true },
              openingTime: p.opening_time || p.openingTime || "10:00 AM",
              opening_time: p.opening_time || p.openingTime || "10:00 AM",
              closingTime: p.closing_time || p.closingTime || "08:00 PM",
              closing_time: p.closing_time || p.closingTime || "08:00 PM",
              workingDays: p.working_days || p.workingDays || "Monday - Saturday",
              working_days: p.working_days || p.workingDays || "Monday - Saturday",
              weeklyOff: p.weekly_off || p.weeklyOff || "Sunday",
              weekly_off: p.weekly_off || p.weeklyOff || "Sunday",
              holidayNotice: p.holiday_notice || p.holidayNotice || "Open on festive wedding dates by appointment",
              holiday_notice: p.holiday_notice || p.holidayNotice || "Open on festive wedding dates by appointment",
              rentalPolicy: p.rental_policy || p.rentalPolicy || "Minimum 2-day rental with valid government ID verification.",
              rental_policy: p.rental_policy || p.rentalPolicy || "Minimum 2-day rental with valid government ID verification.",
              returnPolicy: p.return_policy || p.returnPolicy || "Return by 05:00 PM on designated date. Late fee applies.",
              return_policy: p.return_policy || p.returnPolicy || "Return by 05:00 PM on designated date. Late fee applies.",
              cancellationPolicy: p.cancellation_policy || p.cancellationPolicy || "Full refund 7+ days prior to event date.",
              cancellation_policy: p.cancellation_policy || p.cancellationPolicy || "Full refund 7+ days prior to event date.",
              securityDepositPolicy: p.security_deposit_policy || p.securityDepositPolicy || "100% refundable within 24 hours of safe return inspection.",
              security_deposit_policy: p.security_deposit_policy || p.securityDepositPolicy || "100% refundable within 24 hours of safe return inspection.",
              damagePolicy: p.damage_policy || p.damagePolicy || "Normal wear & tear accepted. Missing stones/breakage deducted at actuals.",
              damage_policy: p.damage_policy || p.damagePolicy || "Normal wear & tear accepted. Missing stones/breakage deducted at actuals.",
              plan: v.plan || (v.isVerified ? "Verified Partner" : "Registered Partner"),
              planCode: v.planCode || "free",
              isSubscribed: Boolean(v.isSubscribed),
              is_verified: Boolean(v.isVerified),
              isVerified: Boolean(v.isVerified),
            };

            if (typeof window !== "undefined") {
              localStorage.setItem("cloche_active_vendor_identity", JSON.stringify(resolvedVendor));
            }
            return resolvedVendor;
          }
        } else {
          const errJson = await res.json().catch(() => ({}));
          console.error("[vendorStore] Profile API error:", res.status, errJson);
        }
      } catch (err) {
        console.error("[vendorStore] Failed to fetch authenticated vendor profile from DB:", err);
      } finally {
        inFlightProfileFetch = null;
      }
    }

    return getActiveVendorIdentity();
  })();

  return inFlightProfileFetch;
}

/**
 * Clears cached active vendor identity and user session caches on logout.
 */
export function clearActiveVendorIdentity() {
  inFlightProfileFetch = null;
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem("cloche_active_vendor_identity");
      localStorage.removeItem("cloche_user_data");
      localStorage.removeItem("cloche_registered_vendors");
      sessionStorage.clear();
    } catch (e) {}
  }
}

/**
 * Retrieves current active vendor identity from session storage / auth
 */
export function getActiveVendorIdentity(): VendorProfileData {
  const emptyVendor: VendorProfileData = {
    id: "",
    name: "",
    boutique_name: "",
    category: "",
    district: "",
    city: "",
    profile_completion_percentage: 0,
  };

  if (typeof window === "undefined") {
    return emptyVendor;
  }

  try {
    const rawActive = localStorage.getItem("cloche_active_vendor_identity");
    if (rawActive) {
      const parsed = JSON.parse(rawActive);
      if (parsed && parsed.id) {
        return parsed;
      }
    }
  } catch (e) {}

  return emptyVendor;
}
