import {
  fetchPublicVendorProfileFromDb,
  getSupabaseConfig,
  recalculateVendorRatingInDb,
  supabaseFetch,
} from "@/lib/supabase";
import { isPhotographerCategory, type PhotographerAuthContext } from "@/lib/photographerAuth";

export async function resolvePhotographerVendorByIdentifier(identifier: string) {
  const { data: profile } = await fetchPublicVendorProfileFromDb(identifier, {
    includeNonActive: true,
  });
  if (!profile?.id) return null;

  const { data: vRows } = await supabaseFetch<any[]>(
    `vendors?id=eq.${encodeURIComponent(profile.id)}&deleted_at=is.null&select=id,user_id,status,publication_status,category_id,vendor_categories(slug,name)&limit=1`
  );
  const vRow = Array.isArray(vRows) ? vRows[0] : null;
  if (!vRow) return null;

  const cat = Array.isArray(vRow.vendor_categories)
    ? vRow.vendor_categories[0]
    : vRow.vendor_categories;
  if (!isPhotographerCategory(cat?.slug) && !isPhotographerCategory(cat?.name)) {
    return null;
  }

  return vRow;
}

export type CrmLeadStage =
  | "New"
  | "Contacted"
  | "Interested"
  | "Follow-up Required"
  | "Converted"
  | "Lost";

export const CRM_LEAD_STAGES: CrmLeadStage[] = [
  "New",
  "Contacted",
  "Interested",
  "Follow-up Required",
  "Converted",
  "Lost",
];

export const PHOTOGRAPHY_CATEGORIES = [
  "Wedding",
  "Engagement",
  "Pre-wedding",
  "Haldi",
  "Reception",
  "Candid",
  "Traditional",
  "Cinematic",
] as const;

export const PHOTOGRAPHY_SERVICE_PRESETS = [
  {
    key: "wedding_photography",
    name: "Wedding Photography",
    description: "Full wedding day editorial and ceremony photography coverage.",
    priceUnit: "per event",
  },
  {
    key: "wedding_videography",
    name: "Wedding Videography",
    description: "Complete wedding video documentation with clean audio and multi-cam angles.",
    priceUnit: "per event",
  },
  {
    key: "candid",
    name: "Candid Photography",
    description: "Unscripted emotional storytelling capturing natural moments and expressions.",
    priceUnit: "per day",
  },
  {
    key: "traditional",
    name: "Traditional Photography",
    description: "Classic ritual, portrait, and family group photography across ceremonies.",
    priceUnit: "per day",
  },
  {
    key: "pre_wedding",
    name: "Pre-wedding Shoot",
    description: "Destination or studio couple portrait session ahead of the wedding.",
    priceUnit: "per session",
  },
  {
    key: "engagement",
    name: "Engagement Coverage",
    description: "Ring ceremony and couple portraits covered by candid and traditional photographers.",
    priceUnit: "per event",
  },
  {
    key: "drone",
    name: "Drone Coverage",
    description: "4K aerial cinematography for venue scale, baraat, and outdoor ceremonies.",
    priceUnit: "per day",
  },
  {
    key: "cinematic_films",
    name: "Cinematic Wedding Films",
    description: "Color-graded highlight teaser and feature wedding film with licensed score.",
    priceUnit: "per project",
  },
  {
    key: "album_design",
    name: "Album Design",
    description: "Bespoke archival lay-flat coffee table albums printed on museum-grade paper.",
    priceUnit: "per album",
  },
  {
    key: "reception",
    name: "Reception Coverage",
    description: "Evening celebration, couple stage portraits, and reception highlights.",
    priceUnit: "per event",
  },
  {
    key: "haldi",
    name: "Haldi & Mehendi",
    description: "Vibrant daytime coverage for Haldi, Mehendi, and Sangeet festivities.",
    priceUnit: "per event",
  },
] as const;

export interface PhotographerPortfolioMeta {
  albumCategories?: Record<string, string>;
  galleryAlbums?: Record<string, string>;
  galleryCategories?: Record<string, string>;
  galleryDescriptions?: Record<string, string>;
  videoCategories?: Record<string, string>;
  hiddenPhotoIds?: string[];
  hiddenAlbumIds?: string[];
  hiddenVideoIds?: string[];
}

export interface PhotographerPackageExtra {
  priceOnRequest?: boolean;
  photographersCount?: number | null;
  coverageDuration?: string;
  albumDetails?: string;
  videoDetails?: string;
  imageUrl?: string | null;
}

export interface CustomerQuestionRecord {
  id: string;
  customerName: string;
  customerEmail?: string;
  question: string;
  answer: string;
  status: "pending" | "published" | "draft" | "rejected";
  faqId?: string | null;
  createdAt: string;
  answeredAt?: string | null;
}

export interface PhotographerFaqMeta {
  faqHiddenIds?: string[];
  customerQuestions?: CustomerQuestionRecord[];
}

export interface PhotographerBasicInfoMeta {
  intro?: string;
  ownerName?: string;
  experienceYears?: number | null;
  areasServed?: string[];
  equipment?: string[];
  styles?: string[];
  specializations?: string[];
  contactName?: string;
  whatsapp?: string;
}

export interface ReviewReportRecord {
  id: string;
  reviewId: string;
  reason: string;
  details: string;
  reportedAt: string;
  status: "submitted";
}

export interface PhotographerCategoryMeta {
  leadStageMap?: Record<string, CrmLeadStage>;
  reviewReports?: ReviewReportRecord[];
}

export function normalizeUrl(url?: string | null): string {
  const trimmed = (url || "").trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export function mapCrmStageToDbLeadStatus(stage: CrmLeadStage): string {
  switch (stage) {
    case "New":
      return "new";
    case "Contacted":
    case "Follow-up Required":
      return "contacted";
    case "Interested":
      return "quoted";
    case "Converted":
      return "converted";
    case "Lost":
      return "declined";
    default:
      return "new";
  }
}

export function mapDbLeadStatusToDefaultStage(status?: string | null): CrmLeadStage {
  switch ((status || "").toLowerCase()) {
    case "contacted":
      return "Contacted";
    case "quoted":
      return "Interested";
    case "converted":
      return "Converted";
    case "declined":
      return "Lost";
    default:
      return "New";
  }
}

export async function getOrCreateProfileVersionId(
  vendorId: string,
  userId?: string | null
): Promise<string | null> {
  const { data: versions } = await supabaseFetch<any[]>(
    `vendor_profile_versions?vendor_id=eq.${encodeURIComponent(vendorId)}&order=version_number.desc&limit=1`
  );
  if (Array.isArray(versions) && versions.length > 0 && versions[0]?.id) {
    return versions[0].id;
  }

  let creatorId = userId || null;
  if (!creatorId) {
    const { data: vRows } = await supabaseFetch<any[]>(
      `vendors?id=eq.${encodeURIComponent(vendorId)}&select=user_id&limit=1`
    );
    creatorId = Array.isArray(vRows) && vRows[0]?.user_id ? vRows[0].user_id : null;
  }
  if (!creatorId) return null;

  const { data: inserted } = await supabaseFetch<any[]>("vendor_profile_versions", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({
      vendor_id: vendorId,
      version_number: 1,
      status: "published",
      change_summary: "Photographer workspace initialized",
      created_by: creatorId,
    }),
  });
  return Array.isArray(inserted) && inserted[0]?.id ? inserted[0].id : null;
}

export async function readVersionSection<T = Record<string, any>>(
  vendorId: string,
  sectionName: "basic_info" | "services" | "packages" | "portfolio" | "faqs" | "category_details"
): Promise<T> {
  const { data: versions } = await supabaseFetch<any[]>(
    `vendor_profile_versions?vendor_id=eq.${encodeURIComponent(vendorId)}&order=version_number.desc&limit=1`
  );
  const versionId = Array.isArray(versions) && versions[0]?.id ? versions[0].id : null;
  if (!versionId) return {} as T;

  const { data: sections } = await supabaseFetch<any[]>(
    `vendor_profile_version_sections?version_id=eq.${encodeURIComponent(versionId)}&section_name=eq.${encodeURIComponent(sectionName)}&limit=1`
  );
  if (Array.isArray(sections) && sections[0]?.section_payload && typeof sections[0].section_payload === "object") {
    return sections[0].section_payload as T;
  }
  return {} as T;
}

export async function upsertVersionSection(
  vendorId: string,
  sectionName: "basic_info" | "services" | "packages" | "portfolio" | "faqs" | "category_details",
  payload: Record<string, any>,
  userId?: string | null
): Promise<boolean> {
  const versionId = await getOrCreateProfileVersionId(vendorId, userId);
  if (!versionId) return false;

  const { data: existing } = await supabaseFetch<any[]>(
    `vendor_profile_version_sections?version_id=eq.${encodeURIComponent(versionId)}&section_name=eq.${encodeURIComponent(sectionName)}&select=id,section_payload&limit=1`
  );

  if (Array.isArray(existing) && existing[0]?.id) {
    const merged = { ...(existing[0].section_payload || {}), ...payload };
    const res = await supabaseFetch(
      `vendor_profile_version_sections?id=eq.${encodeURIComponent(existing[0].id)}`,
      {
        method: "PATCH",
        body: JSON.stringify({
          section_payload: merged,
          updated_at: new Date().toISOString(),
        }),
      }
    );
    return !res.error;
  }

  const res = await supabaseFetch("vendor_profile_version_sections", {
    method: "POST",
    body: JSON.stringify({
      version_id: versionId,
      section_name: sectionName,
      section_payload: payload,
      updated_at: new Date().toISOString(),
    }),
  });
  return !res.error;
}

export async function replaceVersionSection(
  vendorId: string,
  sectionName: "basic_info" | "services" | "packages" | "portfolio" | "faqs" | "category_details",
  payload: Record<string, any>,
  userId?: string | null
): Promise<boolean> {
  const versionId = await getOrCreateProfileVersionId(vendorId, userId);
  if (!versionId) return false;

  const { data: existing } = await supabaseFetch<any[]>(
    `vendor_profile_version_sections?version_id=eq.${encodeURIComponent(versionId)}&section_name=eq.${encodeURIComponent(sectionName)}&select=id&limit=1`
  );

  if (Array.isArray(existing) && existing[0]?.id) {
    const res = await supabaseFetch(
      `vendor_profile_version_sections?id=eq.${encodeURIComponent(existing[0].id)}`,
      {
        method: "PATCH",
        body: JSON.stringify({
          section_payload: payload,
          updated_at: new Date().toISOString(),
        }),
      }
    );
    return !res.error;
  }

  const res = await supabaseFetch("vendor_profile_version_sections", {
    method: "POST",
    body: JSON.stringify({
      version_id: versionId,
      section_name: sectionName,
      section_payload: payload,
      updated_at: new Date().toISOString(),
    }),
  });
  return !res.error;
}

export function isLeadThreadUnread(activities: any[]): boolean {
  if (!Array.isArray(activities) || activities.length === 0) return false;
  let lastCustomerTime = 0;
  let lastVendorAckTime = 0;
  for (const act of activities) {
    const ts = new Date(act.created_at || 0).getTime();
    if (act.activity_type === "client_message" || act.activity_type === "inquiry_created") {
      if (ts > lastCustomerTime) lastCustomerTime = ts;
    }
    if (
      act.activity_type === "vendor_reply" ||
      act.activity_type === "vendor_message" ||
      act.activity_type === "vendor_read"
    ) {
      if (ts > lastVendorAckTime) lastVendorAckTime = ts;
    }
  }
  return lastCustomerTime > lastVendorAckTime;
}

export async function getPhotographerProfile(vendorId: string, context?: PhotographerAuthContext) {
  const [
    { data: vendorRows },
    { data: profileRows },
    { data: contactRows },
    { data: addressRows },
    { data: socialRows },
    { data: detailRows },
    basicMeta,
  ] = await Promise.all([
    supabaseFetch<any[]>(
      `vendors?id=eq.${encodeURIComponent(vendorId)}&deleted_at=is.null&select=id,user_id,vendor_code,status,publication_status,profile_completion_percentage,is_verified&limit=1`
    ),
    supabaseFetch<any[]>(
      `vendor_profiles?vendor_id=eq.${encodeURIComponent(vendorId)}&limit=1`
    ),
    supabaseFetch<any[]>(
      `vendor_contacts?vendor_id=eq.${encodeURIComponent(vendorId)}&order=is_primary.desc,created_at.asc`
    ),
    supabaseFetch<any[]>(
      `vendor_addresses?vendor_id=eq.${encodeURIComponent(vendorId)}&order=created_at.asc&limit=1`
    ),
    supabaseFetch<any[]>(
      `vendor_social_links?vendor_id=eq.${encodeURIComponent(vendorId)}`
    ),
    supabaseFetch<any[]>(
      `photographer_details?vendor_id=eq.${encodeURIComponent(vendorId)}&limit=1`
    ),
    readVersionSection<PhotographerBasicInfoMeta>(vendorId, "basic_info"),
  ]);

  const vendor = Array.isArray(vendorRows) ? vendorRows[0] : null;
  const profile = Array.isArray(profileRows) ? profileRows[0] : null;
  const primaryContact = Array.isArray(contactRows) ? contactRows[0] : null;
  const address = Array.isArray(addressRows) ? addressRows[0] : null;
  const details = Array.isArray(detailRows) ? detailRows[0] : null;

  let userRow: any = null;
  const userId = vendor?.user_id || context?.userId;
  if (userId) {
    const { data: uRows } = await supabaseFetch<any[]>(
      `users?id=eq.${encodeURIComponent(userId)}&select=id,email,full_name,name,phone&limit=1`
    );
    userRow = Array.isArray(uRows) ? uRows[0] : null;
  }

  // Resolve logo and cover media URLs
  const mediaIds = [profile?.logo_media_id, profile?.cover_media_id].filter(Boolean);
  const mediaMap = new Map<string, string>();
  if (mediaIds.length > 0) {
    const { data: mediaRows } = await supabaseFetch<any[]>(
      `media?id=in.(${mediaIds.map((m) => `"${m}"`).join(",")})&select=id,cdn_url`
    );
    if (Array.isArray(mediaRows)) {
      for (const m of mediaRows) {
        if (m.id && m.cdn_url) mediaMap.set(m.id, m.cdn_url);
      }
    }
  }

  const socials: Record<string, string> = {
    instagram: "",
    website: "",
    youtube: "",
    facebook: "",
  };
  if (Array.isArray(socialRows)) {
    for (const row of socialRows) {
      const p = (row.platform || "").toLowerCase();
      if (p in socials && row.url) socials[p] = row.url;
    }
  }

  const ownerName =
    basicMeta.ownerName ||
    userRow?.full_name ||
    userRow?.name ||
    primaryContact?.contact_name ||
    context?.ownerName ||
    "Photographer";

  return {
    vendorId,
    vendorCode: vendor?.vendor_code || null,
    status: vendor?.status || "active",
    publicationStatus: vendor?.publication_status || "published",
    isVerified: Boolean(vendor?.is_verified),
    businessName: profile?.business_name || context?.businessName || "",
    slug: profile?.slug || context?.slug || vendorId,
    ownerName,
    tagline: profile?.tagline || "",
    intro: basicMeta.intro || "",
    about: profile?.about || "",
    experienceYears: basicMeta.experienceYears ?? null,
    startingPrice: profile?.starting_price != null ? Number(profile.starting_price) : null,
    logoMediaId: profile?.logo_media_id || null,
    logoUrl: profile?.logo_media_id ? mediaMap.get(profile.logo_media_id) || "" : "",
    coverMediaId: profile?.cover_media_id || null,
    coverUrl: profile?.cover_media_id ? mediaMap.get(profile.cover_media_id) || "" : "",
    city: profile?.city || address?.city || "",
    state: profile?.state || address?.state || "",
    pincode: profile?.pincode || address?.pincode || "",
    addressLine1: address?.address_line1 || "",
    addressLine2: address?.address_line2 || "",
    areasServed: Array.isArray(basicMeta.areasServed) ? basicMeta.areasServed : [],
    phone: primaryContact?.phone || userRow?.phone || "",
    whatsapp: primaryContact?.whatsapp || basicMeta.whatsapp || primaryContact?.phone || "",
    email: primaryContact?.email || userRow?.email || "",
    instagram: socials.instagram,
    website: socials.website,
    youtube: socials.youtube,
    facebook: socials.facebook,
    candidPhotography: details ? Boolean(details.candid_photography) : true,
    cinematicVideo: details ? Boolean(details.cinematic_video) : true,
    droneCoverage: details ? Boolean(details.drone_coverage) : false,
    deliveryDays: details?.delivery_days ?? 30,
    albumPages: details?.album_pages ?? null,
    equipment: Array.isArray(basicMeta.equipment) ? basicMeta.equipment : [],
    styles: Array.isArray(basicMeta.styles) ? basicMeta.styles : [],
    specializations: Array.isArray(basicMeta.specializations) ? basicMeta.specializations : [],
    rating: Number(profile?.rating || 0),
    reviewCount: Number(profile?.review_count || 0),
  };
}

export async function calculateAndSyncCompletion(vendorId: string): Promise<number> {
  const [profileData, services, portfolio, packages, faqs] = await Promise.all([
    getPhotographerProfile(vendorId),
    listPhotographerServices(vendorId),
    listPhotographerPortfolio(vendorId),
    listPhotographerPackages(vendorId),
    listPhotographerFaqs(vendorId),
  ]);

  let score = 0;
  if (profileData.businessName.trim().length > 1) score += 10;
  if (profileData.ownerName.trim().length > 1) score += 5;
  if (profileData.logoUrl) score += 10;
  if (profileData.coverUrl) score += 10;
  if (profileData.tagline.trim() || profileData.intro.trim()) score += 5;
  if (profileData.about.trim().length >= 30) score += 10;
  if (profileData.city.trim() && profileData.state.trim()) score += 10;
  if (profileData.phone.trim() && profileData.email.trim()) score += 10;
  if (services.some((s) => s.is_active)) score += 10;
  if (portfolio.photos.length + portfolio.videos.length >= 3) score += 10;
  if (packages.some((p) => p.isActive)) score += 5;
  if (faqs.photographerFaqs.filter((f) => f.isPublished).length >= 1) score += 5;

  const pct = Math.min(100, Math.max(0, score));
  await supabaseFetch(`vendors?id=eq.${encodeURIComponent(vendorId)}`, {
    method: "PATCH",
    body: JSON.stringify({
      profile_completion_percentage: pct,
      updated_at: new Date().toISOString(),
    }),
  });
  return pct;
}

export async function savePhotographerProfile(
  context: PhotographerAuthContext,
  body: Record<string, any>
) {
  const { vendorId, userId } = context;

  const current = await getPhotographerProfile(vendorId, context);

  const nextBusinessName =
    typeof body.businessName === "string" ? body.businessName.trim() : current.businessName;
  const nextOwnerName =
    typeof body.ownerName === "string" ? body.ownerName.trim() : current.ownerName;

  if (!nextBusinessName) {
    throw new Error("Business / Studio name is required.");
  }

  // Update users full_name / name if changed
  if (nextOwnerName && userId) {
    await supabaseFetch(`users?id=eq.${encodeURIComponent(userId)}`, {
      method: "PATCH",
      body: JSON.stringify({
        full_name: nextOwnerName,
        name: nextOwnerName,
        updated_at: new Date().toISOString(),
      }),
    });
  }

  // Update vendor_profiles
  const profilePatch: Record<string, any> = {
    business_name: nextBusinessName,
    tagline: typeof body.tagline === "string" ? body.tagline.trim() : current.tagline,
    about: typeof body.about === "string" ? body.about.trim() : current.about,
    city: typeof body.city === "string" ? body.city.trim() || current.city || "India" : current.city,
    state: typeof body.state === "string" ? body.state.trim() || current.state || "India" : current.state,
    pincode: typeof body.pincode === "string" ? body.pincode.trim() : current.pincode,
    starting_price:
      body.startingPrice !== undefined
        ? body.startingPrice === null || body.startingPrice === ""
          ? null
          : Number(body.startingPrice)
        : current.startingPrice,
    updated_at: new Date().toISOString(),
  };

  if (body.logoMediaId !== undefined) {
    profilePatch.logo_media_id = body.logoMediaId || null;
  }
  if (body.coverMediaId !== undefined) {
    profilePatch.cover_media_id = body.coverMediaId || null;
  }

  await supabaseFetch(`vendor_profiles?vendor_id=eq.${encodeURIComponent(vendorId)}`, {
    method: "PATCH",
    body: JSON.stringify(profilePatch),
  });

  // Upsert vendor_contacts primary
  const phoneVal = typeof body.phone === "string" ? body.phone.trim() : current.phone;
  const whatsappVal = typeof body.whatsapp === "string" ? body.whatsapp.trim() : current.whatsapp;
  const emailVal = typeof body.email === "string" ? body.email.trim().toLowerCase() : current.email;

  const { data: existingContacts } = await supabaseFetch<any[]>(
    `vendor_contacts?vendor_id=eq.${encodeURIComponent(vendorId)}&limit=1`
  );
  if (Array.isArray(existingContacts) && existingContacts[0]?.id) {
    await supabaseFetch(`vendor_contacts?id=eq.${encodeURIComponent(existingContacts[0].id)}`, {
      method: "PATCH",
      body: JSON.stringify({
        contact_name: nextOwnerName,
        phone: phoneVal,
        whatsapp: whatsappVal,
        email: emailVal,
        is_primary: true,
        updated_at: new Date().toISOString(),
      }),
    });
  } else {
    await supabaseFetch("vendor_contacts", {
      method: "POST",
      body: JSON.stringify({
        vendor_id: vendorId,
        contact_name: nextOwnerName,
        phone: phoneVal,
        whatsapp: whatsappVal,
        email: emailVal,
        is_primary: true,
      }),
    });
  }

  // Upsert vendor_addresses
  const addressLine1 =
    typeof body.addressLine1 === "string" ? body.addressLine1.trim() : current.addressLine1;
  const addressLine2 =
    typeof body.addressLine2 === "string" ? body.addressLine2.trim() : current.addressLine2;
  const { data: existingAddr } = await supabaseFetch<any[]>(
    `vendor_addresses?vendor_id=eq.${encodeURIComponent(vendorId)}&limit=1`
  );
  if (Array.isArray(existingAddr) && existingAddr[0]?.id) {
    await supabaseFetch(`vendor_addresses?id=eq.${encodeURIComponent(existingAddr[0].id)}`, {
      method: "PATCH",
      body: JSON.stringify({
        address_line1: addressLine1 || profilePatch.city,
        address_line2: addressLine2 || null,
        city: profilePatch.city,
        state: profilePatch.state,
        pincode: profilePatch.pincode || null,
        updated_at: new Date().toISOString(),
      }),
    });
  } else if (addressLine1 || profilePatch.city) {
    await supabaseFetch("vendor_addresses", {
      method: "POST",
      body: JSON.stringify({
        vendor_id: vendorId,
        address_line1: addressLine1 || profilePatch.city || "Studio Address",
        address_line2: addressLine2 || null,
        city: profilePatch.city || "India",
        state: profilePatch.state || "India",
        pincode: profilePatch.pincode || null,
      }),
    });
  }

  // Sync vendor_social_links
  const socialPlatforms: Array<["instagram" | "website" | "youtube" | "facebook", string]> = [
    ["instagram", normalizeUrl(body.instagram !== undefined ? body.instagram : current.instagram)],
    ["website", normalizeUrl(body.website !== undefined ? body.website : current.website)],
    ["youtube", normalizeUrl(body.youtube !== undefined ? body.youtube : current.youtube)],
    ["facebook", normalizeUrl(body.facebook !== undefined ? body.facebook : current.facebook)],
  ];

  await supabaseFetch(`vendor_social_links?vendor_id=eq.${encodeURIComponent(vendorId)}`, {
    method: "DELETE",
  });
  const socialRows = socialPlatforms
    .filter(([, url]) => Boolean(url))
    .map(([platform, url]) => ({ vendor_id: vendorId, platform, url }));
  if (socialRows.length > 0) {
    await supabaseFetch("vendor_social_links", {
      method: "POST",
      body: JSON.stringify(socialRows),
    });
  }

  // Upsert photographer_details
  const candidPhotography =
    body.candidPhotography !== undefined ? Boolean(body.candidPhotography) : current.candidPhotography;
  const cinematicVideo =
    body.cinematicVideo !== undefined ? Boolean(body.cinematicVideo) : current.cinematicVideo;
  const droneCoverage =
    body.droneCoverage !== undefined ? Boolean(body.droneCoverage) : current.droneCoverage;
  const deliveryDays =
    body.deliveryDays !== undefined && body.deliveryDays !== ""
      ? Math.max(1, Math.min(365, Number(body.deliveryDays) || 30))
      : current.deliveryDays;
  const albumPages =
    body.albumPages !== undefined
      ? body.albumPages === "" || body.albumPages === null
        ? null
        : Number(body.albumPages)
      : current.albumPages;

  const { data: existingDet } = await supabaseFetch<any[]>(
    `photographer_details?vendor_id=eq.${encodeURIComponent(vendorId)}&select=vendor_id&limit=1`
  );
  if (Array.isArray(existingDet) && existingDet.length > 0) {
    await supabaseFetch(`photographer_details?vendor_id=eq.${encodeURIComponent(vendorId)}`, {
      method: "PATCH",
      body: JSON.stringify({
        candid_photography: candidPhotography,
        cinematic_video: cinematicVideo,
        drone_coverage: droneCoverage,
        delivery_days: deliveryDays,
        album_pages: albumPages,
        updated_at: new Date().toISOString(),
      }),
    });
  } else {
    await supabaseFetch("photographer_details", {
      method: "POST",
      body: JSON.stringify({
        vendor_id: vendorId,
        candid_photography: candidPhotography,
        cinematic_video: cinematicVideo,
        drone_coverage: droneCoverage,
        delivery_days: deliveryDays,
        album_pages: albumPages,
      }),
    });
  }

  // Save extended studio info into basic_info version section
  const parseList = (v: any, fallback: string[]) => {
    if (Array.isArray(v)) return v.map((x) => String(x).trim()).filter(Boolean);
    if (typeof v === "string") {
      return v
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean);
    }
    return fallback;
  };

  await upsertVersionSection(
    vendorId,
    "basic_info",
    {
      ownerName: nextOwnerName,
      contactName: nextOwnerName,
      whatsapp: whatsappVal,
      intro: typeof body.intro === "string" ? body.intro.trim() : current.intro,
      experienceYears:
        body.experienceYears !== undefined
          ? body.experienceYears === "" || body.experienceYears === null
            ? null
            : Math.max(0, Number(body.experienceYears))
          : current.experienceYears,
      areasServed: parseList(body.areasServed, current.areasServed),
      equipment: parseList(body.equipment, current.equipment),
      styles: parseList(body.styles, current.styles),
      specializations: parseList(body.specializations, current.specializations),
    },
    userId
  );

  // Sync publication_status if requested
  if (body.publicationStatus === "draft" || body.publicationStatus === "published") {
    await setPhotographerPublicationStatus(vendorId, body.publicationStatus, userId);
  }

  const completion = await calculateAndSyncCompletion(vendorId);
  const updatedProfile = await getPhotographerProfile(vendorId, context);
  return { profile: updatedProfile, completion };
}

export async function setPhotographerPublicationStatus(
  vendorId: string,
  publicationStatus: "draft" | "published",
  userId?: string | null
) {
  await supabaseFetch(`vendors?id=eq.${encodeURIComponent(vendorId)}`, {
    method: "PATCH",
    body: JSON.stringify({
      publication_status: publicationStatus,
      status: "active",
      updated_at: new Date().toISOString(),
    }),
  });

  const versionId = await getOrCreateProfileVersionId(vendorId, userId);
  if (versionId) {
    await supabaseFetch(`vendor_profile_versions?id=eq.${encodeURIComponent(versionId)}`, {
      method: "PATCH",
      body: JSON.stringify({
        status: publicationStatus,
        published_at: publicationStatus === "published" ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      }),
    });
  }
}

export async function uploadPhotographerMediaFile(
  vendorId: string,
  userId: string,
  file: File,
  kind: "logo" | "cover" | "gallery" | "service" | "package" | "album" = "gallery"
): Promise<{ mediaId: string; url: string }> {
  const allowedMimes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  const mime = (file.type || "").toLowerCase();
  if (!allowedMimes.includes(mime)) {
    throw new Error("Unsupported image format. Please upload JPG, PNG, or WebP.");
  }
  if (file.size > 10 * 1024 * 1024) {
    throw new Error("Image exceeds the 10MB file size limit.");
  }

  const { url: supabaseUrl, serviceKey, anonKey } = getSupabaseConfig();
  const apiKey = serviceKey || anonKey;
  if (!supabaseUrl || !apiKey) {
    throw new Error("Storage service is not configured.");
  }

  const normalizedMime = mime === "image/jpg" ? "image/jpeg" : mime;
  const rawExt = (file.name.split(".").pop() || "jpg")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
  const ext = rawExt === "png" || rawExt === "webp" || rawExt === "jpeg" ? rawExt : "jpg";
  const storagePath = `photographers/${vendorId}/${kind}-${crypto.randomUUID()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  let publicUrl = "";

  // Attempt Supabase Storage upload first
  try {
    const uploadRes = await fetch(
      `${supabaseUrl}/storage/v1/object/partner-media/${storagePath}`,
      {
        method: "POST",
        headers: {
          "Content-Type": normalizedMime,
          apikey: apiKey,
          Authorization: `Bearer ${apiKey}`,
          "x-upsert": "true",
        },
        body: buffer,
      }
    );

    if (uploadRes.ok) {
      publicUrl = `${supabaseUrl}/storage/v1/object/public/partner-media/${storagePath}`;
    } else {
      // Retry as JPEG if bucket mime filter rejects webp
      const errText = await uploadRes.text();
      if (normalizedMime === "image/webp" && errText.toLowerCase().includes("mime")) {
        const retryRes = await fetch(
          `${supabaseUrl}/storage/v1/object/partner-media/${storagePath}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "image/jpeg",
              apikey: apiKey,
              Authorization: `Bearer ${apiKey}`,
              "x-upsert": "true",
            },
            body: buffer,
          }
        );
        if (retryRes.ok) {
          publicUrl = `${supabaseUrl}/storage/v1/object/public/partner-media/${storagePath}`;
        }
      }
      if (!publicUrl) {
        console.warn("[PHOTOGRAPHER_UPLOAD] Supabase Storage failed:", errText);
      }
    }
  } catch (err) {
    console.warn("[PHOTOGRAPHER_UPLOAD] Storage upload error:", err);
  }

  if (!publicUrl) {
    throw new Error("Could not upload image to cloud storage. Please try a JPG or PNG image under 10MB.");
  }

  const { data: mediaRows, error } = await supabaseFetch<any[]>("media", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({
      user_id: userId,
      vendor_id: vendorId,
      media_type: "image",
      bucket_name: "partner-media",
      file_path: storagePath,
      original_name: file.name || `${kind}.${ext}`,
      mime_type: normalizedMime,
      file_size_bytes: file.size,
      cdn_url: publicUrl,
      metadata: { kind, source: "photographer-dashboard" },
    }),
  });

  if (error || !Array.isArray(mediaRows) || !mediaRows[0]?.id) {
    throw new Error(error?.message || "Failed to record uploaded media in database.");
  }

  return {
    mediaId: mediaRows[0].id,
    url: publicUrl,
  };
}

// ---------- SERVICES ----------
export async function listPhotographerServices(vendorId: string) {
  const { data: rows } = await supabaseFetch<any[]>(
    `vendor_services?vendor_id=eq.${encodeURIComponent(vendorId)}&deleted_at=is.null&order=sort_order.asc,created_at.asc`
  );
  const list = Array.isArray(rows) ? rows : [];
  if (list.length === 0) return [];

  const serviceIds = list.map((s) => `"${s.id}"`).join(",");
  const { data: imgRows } = await supabaseFetch<any[]>(
    `vendor_service_images?service_id=in.(${serviceIds})&order=sort_order.asc`
  );
  const imageByService = new Map<string, string>();
  if (Array.isArray(imgRows)) {
    for (const img of imgRows) {
      if (img.service_id && img.image_url && !imageByService.has(img.service_id)) {
        imageByService.set(img.service_id, img.image_url);
      }
    }
  }

  return list.map((s) => ({
    id: s.id,
    name: s.name,
    description: s.description || "",
    price: s.price != null ? Number(s.price) : null,
    price_unit: s.price_unit || "per event",
    is_active: s.is_active !== false,
    is_popular: Boolean(s.is_popular),
    sort_order: Number(s.sort_order ?? 0),
    imageUrl: imageByService.get(s.id) || "",
    created_at: s.created_at,
  }));
}

export async function createPhotographerService(
  vendorId: string,
  payload: {
    name: string;
    description?: string;
    price?: number | null;
    price_unit?: string;
    is_active?: boolean;
    imageUrl?: string;
  }
) {
  const cleanName = (payload.name || "").trim();
  if (!cleanName) throw new Error("Service name is required.");

  const { data: existing } = await supabaseFetch<any[]>(
    `vendor_services?vendor_id=eq.${encodeURIComponent(vendorId)}&deleted_at=is.null&select=id`
  );
  const nextOrder = Array.isArray(existing) ? existing.length : 0;

  const { data, error } = await supabaseFetch<any[]>("vendor_services", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({
      vendor_id: vendorId,
      name: cleanName,
      description: (payload.description || "").trim(),
      price: payload.price !== undefined && payload.price !== null && String(payload.price) !== ""
        ? Number(payload.price)
        : null,
      base_price: payload.price !== undefined && payload.price !== null && String(payload.price) !== ""
        ? Number(payload.price)
        : null,
      price_unit: (payload.price_unit || "per event").trim(),
      is_active: payload.is_active !== undefined ? Boolean(payload.is_active) : true,
      sort_order: nextOrder,
      status: "active",
    }),
  });

  if (error || !Array.isArray(data) || !data[0]?.id) {
    throw new Error(error?.message || "Failed to create photography service.");
  }

  const created = data[0];
  if (payload.imageUrl && payload.imageUrl.trim()) {
    await supabaseFetch("vendor_service_images", {
      method: "POST",
      body: JSON.stringify({
        service_id: created.id,
        image_url: payload.imageUrl.trim(),
        sort_order: 0,
      }),
    });
  }

  await calculateAndSyncCompletion(vendorId);
  return {
    ...created,
    imageUrl: payload.imageUrl?.trim() || "",
  };
}

export async function updatePhotographerService(
  vendorId: string,
  serviceId: string,
  payload: {
    name?: string;
    description?: string;
    price?: number | null | "";
    price_unit?: string;
    is_active?: boolean;
    imageUrl?: string;
  }
) {
  const updateBody: Record<string, any> = { updated_at: new Date().toISOString() };
  if (payload.name !== undefined) {
    const clean = payload.name.trim();
    if (!clean) throw new Error("Service name cannot be empty.");
    updateBody.name = clean;
  }
  if (payload.description !== undefined) updateBody.description = payload.description.trim();
  if (payload.price !== undefined) {
    const parsed =
      payload.price === null || payload.price === "" ? null : Number(payload.price);
    updateBody.price = parsed;
    updateBody.base_price = parsed;
  }
  if (payload.price_unit !== undefined) updateBody.price_unit = payload.price_unit.trim() || "per event";
  if (payload.is_active !== undefined) updateBody.is_active = Boolean(payload.is_active);

  const { error } = await supabaseFetch(
    `vendor_services?id=eq.${encodeURIComponent(serviceId)}&vendor_id=eq.${encodeURIComponent(vendorId)}`,
    {
      method: "PATCH",
      body: JSON.stringify(updateBody),
    }
  );
  if (error) throw new Error(error.message || "Failed to update service.");

  if (payload.imageUrl !== undefined) {
    await supabaseFetch(`vendor_service_images?service_id=eq.${encodeURIComponent(serviceId)}`, {
      method: "DELETE",
    });
    if (payload.imageUrl.trim()) {
      await supabaseFetch("vendor_service_images", {
        method: "POST",
        body: JSON.stringify({
          service_id: serviceId,
          image_url: payload.imageUrl.trim(),
          sort_order: 0,
        }),
      });
    }
  }

  await calculateAndSyncCompletion(vendorId);
}

export async function softDeletePhotographerService(vendorId: string, serviceId: string) {
  await supabaseFetch(
    `vendor_services?id=eq.${encodeURIComponent(serviceId)}&vendor_id=eq.${encodeURIComponent(vendorId)}`,
    {
      method: "PATCH",
      body: JSON.stringify({ deleted_at: new Date().toISOString() }),
    }
  );
  await calculateAndSyncCompletion(vendorId);
}

// ---------- PORTFOLIO & GALLERY ----------
export async function listPhotographerPortfolio(vendorId: string) {
  const [{ data: galleryRows }, { data: albumRows }, { data: videoRows }, meta] = await Promise.all([
    supabaseFetch<any[]>(
      `vendor_gallery?vendor_id=eq.${encodeURIComponent(vendorId)}&order=sort_order.asc,created_at.desc`
    ),
    supabaseFetch<any[]>(
      `vendor_portfolio?vendor_id=eq.${encodeURIComponent(vendorId)}&order=created_at.desc`
    ),
    supabaseFetch<any[]>(
      `vendor_videos?vendor_id=eq.${encodeURIComponent(vendorId)}&order=sort_order.asc,created_at.desc`
    ),
    readVersionSection<PhotographerPortfolioMeta>(vendorId, "portfolio"),
  ]);

  const gList = Array.isArray(galleryRows) ? galleryRows : [];
  const aList = Array.isArray(albumRows) ? albumRows : [];
  const vList = Array.isArray(videoRows) ? videoRows : [];

  const mediaIds = new Set<string>();
  for (const g of gList) if (g.media_id) mediaIds.add(g.media_id);
  for (const a of aList) if (a.cover_media_id) mediaIds.add(a.cover_media_id);

  const mediaMap = new Map<string, string>();
  if (mediaIds.size > 0) {
    const idList = Array.from(mediaIds).map((id) => `"${id}"`).join(",");
    const { data: mRows } = await supabaseFetch<any[]>(`media?id=in.(${idList})&select=id,cdn_url`);
    if (Array.isArray(mRows)) {
      for (const m of mRows) {
        if (m.id && m.cdn_url) mediaMap.set(m.id, m.cdn_url);
      }
    }
  }

  const galleryAlbums = meta.galleryAlbums || {};
  const galleryCategories = meta.galleryCategories || {};
  const galleryDescriptions = meta.galleryDescriptions || {};
  const albumCategories = meta.albumCategories || {};
  const videoCategories = meta.videoCategories || {};
  const hiddenPhotos = new Set(Array.isArray(meta.hiddenPhotoIds) ? meta.hiddenPhotoIds : []);
  const hiddenAlbums = new Set(Array.isArray(meta.hiddenAlbumIds) ? meta.hiddenAlbumIds : []);
  const hiddenVideos = new Set(Array.isArray(meta.hiddenVideoIds) ? meta.hiddenVideoIds : []);

  const photos = gList
    .map((g) => ({
      id: g.id,
      mediaId: g.media_id,
      imageUrl: mediaMap.get(g.media_id) || "",
      caption: g.caption || "",
      description: galleryDescriptions[g.id] || "",
      sortOrder: Number(g.sort_order ?? 0),
      isCover: Boolean(g.is_cover),
      isPublic: !hiddenPhotos.has(g.id),
      albumId: galleryAlbums[g.id] || null,
      category: galleryCategories[g.id] || "Wedding",
      createdAt: g.created_at,
    }))
    .filter((p) => Boolean(p.imageUrl));

  const albums = aList.map((a) => ({
    id: a.id,
    title: a.title,
    description: a.description || "",
    eventDate: a.event_date || null,
    location: a.location || "",
    coverMediaId: a.cover_media_id || null,
    coverUrl:
      (a.cover_media_id ? mediaMap.get(a.cover_media_id) : "") ||
      photos.find((p) => p.albumId === a.id)?.imageUrl ||
      "",
    category: albumCategories[a.id] || "Wedding",
    isPublic: !hiddenAlbums.has(a.id),
    photoCount: photos.filter((p) => p.albumId === a.id).length,
    createdAt: a.created_at,
  }));

  const videos = vList.map((v) => ({
    id: v.id,
    title: v.title,
    videoUrl: v.video_url,
    thumbnailUrl: v.thumbnail_url || "",
    platform: v.platform || "youtube",
    category: videoCategories[v.id] || "Cinematic",
    isPublic: !hiddenVideos.has(v.id),
    sortOrder: Number(v.sort_order ?? 0),
    createdAt: v.created_at,
  }));

  return { photos, albums, videos };
}

export async function addGalleryPhotoItem(
  vendorId: string,
  userId: string,
  payload: {
    mediaId: string;
    caption?: string;
    description?: string;
    category?: string;
    albumId?: string | null;
    isCover?: boolean;
  }
) {
  const { data: existing } = await supabaseFetch<any[]>(
    `vendor_gallery?vendor_id=eq.${encodeURIComponent(vendorId)}&select=id`
  );
  const sortOrder = Array.isArray(existing) ? existing.length : 0;

  if (payload.isCover) {
    await supabaseFetch(`vendor_gallery?vendor_id=eq.${encodeURIComponent(vendorId)}`, {
      method: "PATCH",
      body: JSON.stringify({ is_cover: false }),
    });
  }

  const { data, error } = await supabaseFetch<any[]>("vendor_gallery", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({
      vendor_id: vendorId,
      media_id: payload.mediaId,
      caption: (payload.caption || "").trim(),
      sort_order: sortOrder,
      is_cover: Boolean(payload.isCover),
    }),
  });

  if (error || !Array.isArray(data) || !data[0]?.id) {
    throw new Error(error?.message || "Failed to save gallery photo.");
  }

  const created = data[0];
  const meta = await readVersionSection<PhotographerPortfolioMeta>(vendorId, "portfolio");
  const galleryCategories = { ...(meta.galleryCategories || {}), [created.id]: payload.category || "Wedding" };
  const galleryAlbums = { ...(meta.galleryAlbums || {}) };
  const galleryDescriptions = { ...(meta.galleryDescriptions || {}) };
  if (payload.albumId) galleryAlbums[created.id] = payload.albumId;
  if (payload.description?.trim()) galleryDescriptions[created.id] = payload.description.trim();

  await upsertVersionSection(
    vendorId,
    "portfolio",
    { galleryCategories, galleryAlbums, galleryDescriptions },
    userId
  );

  // If marked cover & album exists, update album cover if none
  if (payload.albumId && payload.isCover) {
    await supabaseFetch(
      `vendor_portfolio?id=eq.${encodeURIComponent(payload.albumId)}&vendor_id=eq.${encodeURIComponent(vendorId)}`,
      {
        method: "PATCH",
        body: JSON.stringify({ cover_media_id: payload.mediaId, updated_at: new Date().toISOString() }),
      }
    );
  }

  await calculateAndSyncCompletion(vendorId);
  return created;
}

export async function updateGalleryPhotoItem(
  vendorId: string,
  userId: string,
  galleryId: string,
  payload: {
    caption?: string;
    description?: string;
    category?: string;
    albumId?: string | null;
    isCover?: boolean;
    isPublic?: boolean;
    sortOrder?: number;
  }
) {
  const patch: Record<string, any> = {};
  if (payload.caption !== undefined) patch.caption = payload.caption.trim();
  if (payload.sortOrder !== undefined) patch.sort_order = Number(payload.sortOrder);
  if (payload.isCover !== undefined) {
    if (payload.isCover) {
      await supabaseFetch(`vendor_gallery?vendor_id=eq.${encodeURIComponent(vendorId)}`, {
        method: "PATCH",
        body: JSON.stringify({ is_cover: false }),
      });
    }
    patch.is_cover = Boolean(payload.isCover);
  }

  if (Object.keys(patch).length > 0) {
    await supabaseFetch(
      `vendor_gallery?id=eq.${encodeURIComponent(galleryId)}&vendor_id=eq.${encodeURIComponent(vendorId)}`,
      { method: "PATCH", body: JSON.stringify(patch) }
    );
  }

  if (
    payload.category !== undefined ||
    payload.albumId !== undefined ||
    payload.description !== undefined ||
    payload.isPublic !== undefined
  ) {
    const meta = await readVersionSection<PhotographerPortfolioMeta>(vendorId, "portfolio");
    const galleryCategories = { ...(meta.galleryCategories || {}) };
    const galleryAlbums = { ...(meta.galleryAlbums || {}) };
    const galleryDescriptions = { ...(meta.galleryDescriptions || {}) };
    const hiddenSet = new Set(Array.isArray(meta.hiddenPhotoIds) ? meta.hiddenPhotoIds : []);

    if (payload.category !== undefined) galleryCategories[galleryId] = payload.category;
    if (payload.albumId !== undefined) {
      if (payload.albumId) galleryAlbums[galleryId] = payload.albumId;
      else delete galleryAlbums[galleryId];
    }
    if (payload.description !== undefined) {
      if (payload.description.trim()) galleryDescriptions[galleryId] = payload.description.trim();
      else delete galleryDescriptions[galleryId];
    }
    if (payload.isPublic !== undefined) {
      if (payload.isPublic) hiddenSet.delete(galleryId);
      else hiddenSet.add(galleryId);
    }

    await upsertVersionSection(
      vendorId,
      "portfolio",
      {
        galleryCategories,
        galleryAlbums,
        galleryDescriptions,
        hiddenPhotoIds: Array.from(hiddenSet),
      },
      userId
    );
  }
}

export async function deleteGalleryPhotoItem(vendorId: string, userId: string, galleryId: string) {
  const { data: gRows } = await supabaseFetch<any[]>(
    `vendor_gallery?id=eq.${encodeURIComponent(galleryId)}&vendor_id=eq.${encodeURIComponent(vendorId)}&select=id,media_id&limit=1`
  );
  const mediaId = Array.isArray(gRows) && gRows[0]?.media_id ? gRows[0].media_id : null;

  await supabaseFetch(
    `vendor_gallery?id=eq.${encodeURIComponent(galleryId)}&vendor_id=eq.${encodeURIComponent(vendorId)}`,
    { method: "DELETE" }
  );

  // Clean metadata maps
  const meta = await readVersionSection<PhotographerPortfolioMeta>(vendorId, "portfolio");
  const galleryCategories = { ...(meta.galleryCategories || {}) };
  const galleryAlbums = { ...(meta.galleryAlbums || {}) };
  delete galleryCategories[galleryId];
  delete galleryAlbums[galleryId];
  await upsertVersionSection(vendorId, "portfolio", { galleryCategories, galleryAlbums }, userId);

  // Best-effort cleanup of Supabase Storage object if media is not logo/cover
  if (mediaId) {
    const { data: pRows } = await supabaseFetch<any[]>(
      `vendor_profiles?vendor_id=eq.${encodeURIComponent(vendorId)}&select=logo_media_id,cover_media_id&limit=1`
    );
    const prof = Array.isArray(pRows) ? pRows[0] : null;
    if (prof?.logo_media_id !== mediaId && prof?.cover_media_id !== mediaId) {
      const { data: mRows } = await supabaseFetch<any[]>(
        `media?id=eq.${encodeURIComponent(mediaId)}&select=id,bucket_name,file_path&limit=1`
      );
      const m = Array.isArray(mRows) ? mRows[0] : null;
      if (m?.file_path && m?.bucket_name === "partner-media") {
        const { url, serviceKey, anonKey } = getSupabaseConfig();
        const apiKey = serviceKey || anonKey;
        await fetch(`${url}/storage/v1/object/partner-media/${m.file_path}`, {
          method: "DELETE",
          headers: { apikey: apiKey, Authorization: `Bearer ${apiKey}` },
        }).catch(() => {});
      }
    }
  }

  await calculateAndSyncCompletion(vendorId);
}

// ---------- PACKAGES ----------
export async function listPhotographerPackages(vendorId: string) {
  const [{ data: rows }, pkgSection] = await Promise.all([
    supabaseFetch<any[]>(
      `vendor_service_packages?vendor_id=eq.${encodeURIComponent(vendorId)}&deleted_at=is.null&order=sort_order.asc,created_at.asc`
    ),
    readVersionSection<{ packageExtras?: Record<string, PhotographerPackageExtra> }>(vendorId, "packages"),
  ]);

  const list = Array.isArray(rows) ? rows : [];
  const extrasMap = pkgSection.packageExtras || {};

  return list.map((p) => {
    const ext = extrasMap[p.id] || {};
    const featuresArr = Array.isArray(p.features)
      ? p.features
      : typeof p.features === "string"
        ? (() => {
            try {
              const parsed = JSON.parse(p.features);
              return Array.isArray(parsed) ? parsed : [];
            } catch {
              return [];
            }
          })()
        : [];
    const priceNum = Number(p.price || 0);
    return {
      id: p.id,
      name: p.name,
      tagline: p.tagline || "",
      description: p.description || "",
      price: priceNum,
      priceOnRequest: Boolean(ext.priceOnRequest ?? priceNum <= 0),
      features: featuresArr,
      photographersCount: ext.photographersCount ?? null,
      coverageDuration: ext.coverageDuration || "",
      albumDetails: ext.albumDetails || "",
      videoDetails: ext.videoDetails || "",
      imageUrl: ext.imageUrl || "",
      isPopular: Boolean(p.is_popular),
      isActive: p.is_active !== false,
      sortOrder: Number(p.sort_order ?? 0),
      createdAt: p.created_at,
    };
  });
}

export async function createPhotographerPackage(
  vendorId: string,
  userId: string,
  payload: {
    name: string;
    price?: number | null;
    priceOnRequest?: boolean;
    description?: string;
    features?: string[];
    photographersCount?: number | null;
    coverageDuration?: string;
    albumDetails?: string;
    videoDetails?: string;
    imageUrl?: string;
    isPopular?: boolean;
    isActive?: boolean;
  }
) {
  const cleanName = (payload.name || "").trim();
  if (!cleanName) throw new Error("Package name is required.");

  const isPoR = Boolean(payload.priceOnRequest);
  const priceValue = isPoR ? 0 : Math.max(0, Number(payload.price || 0));

  const { data: existing } = await supabaseFetch<any[]>(
    `vendor_service_packages?vendor_id=eq.${encodeURIComponent(vendorId)}&deleted_at=is.null&select=id`
  );
  const sortOrder = Array.isArray(existing) ? existing.length : 0;

  const { data, error } = await supabaseFetch<any[]>("vendor_service_packages", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({
      vendor_id: vendorId,
      name: cleanName,
      tagline: isPoR ? "Price on Request" : (payload.coverageDuration || "").trim(),
      description: (payload.description || "").trim(),
      price: priceValue,
      features: Array.isArray(payload.features)
        ? payload.features.map((f) => f.trim()).filter(Boolean)
        : [],
      is_popular: Boolean(payload.isPopular),
      is_active: payload.isActive !== undefined ? Boolean(payload.isActive) : true,
      sort_order: sortOrder,
      status: "active",
    }),
  });

  if (error || !Array.isArray(data) || !data[0]?.id) {
    throw new Error(error?.message || "Failed to create package.");
  }

  const created = data[0];
  const pkgSection = await readVersionSection<{ packageExtras?: Record<string, PhotographerPackageExtra> }>(
    vendorId,
    "packages"
  );
  const packageExtras = {
    ...(pkgSection.packageExtras || {}),
    [created.id]: {
      priceOnRequest: isPoR,
      photographersCount:
        payload.photographersCount !== undefined && payload.photographersCount !== null
          ? Number(payload.photographersCount)
          : null,
      coverageDuration: (payload.coverageDuration || "").trim(),
      albumDetails: (payload.albumDetails || "").trim(),
      videoDetails: (payload.videoDetails || "").trim(),
      imageUrl: (payload.imageUrl || "").trim(),
    },
  };
  await upsertVersionSection(vendorId, "packages", { packageExtras }, userId);
  await calculateAndSyncCompletion(vendorId);
  return created;
}

export async function updatePhotographerPackage(
  vendorId: string,
  userId: string,
  packageId: string,
  payload: {
    name?: string;
    price?: number | null;
    priceOnRequest?: boolean;
    description?: string;
    features?: string[];
    photographersCount?: number | null;
    coverageDuration?: string;
    albumDetails?: string;
    videoDetails?: string;
    imageUrl?: string;
    isPopular?: boolean;
    isActive?: boolean;
  }
) {
  const pkgSection = await readVersionSection<{ packageExtras?: Record<string, PhotographerPackageExtra> }>(
    vendorId,
    "packages"
  );
  const currentExt = pkgSection.packageExtras?.[packageId] || {};

  const patch: Record<string, any> = { updated_at: new Date().toISOString() };
  if (payload.name !== undefined) {
    const clean = payload.name.trim();
    if (!clean) throw new Error("Package name cannot be empty.");
    patch.name = clean;
  }
  if (payload.description !== undefined) patch.description = payload.description.trim();
  if (payload.features !== undefined) {
    patch.features = Array.isArray(payload.features)
      ? payload.features.map((f) => f.trim()).filter(Boolean)
      : [];
  }
  if (payload.isPopular !== undefined) patch.is_popular = Boolean(payload.isPopular);
  if (payload.isActive !== undefined) patch.is_active = Boolean(payload.isActive);

  const nextPoR =
    payload.priceOnRequest !== undefined ? Boolean(payload.priceOnRequest) : Boolean(currentExt.priceOnRequest);
  if (payload.priceOnRequest !== undefined || payload.price !== undefined) {
    patch.price = nextPoR ? 0 : Math.max(0, Number(payload.price || 0));
  }

  const { error } = await supabaseFetch(
    `vendor_service_packages?id=eq.${encodeURIComponent(packageId)}&vendor_id=eq.${encodeURIComponent(vendorId)}`,
    { method: "PATCH", body: JSON.stringify(patch) }
  );
  if (error) throw new Error(error.message || "Failed to update package.");

  const nextExt: PhotographerPackageExtra = {
    priceOnRequest: nextPoR,
    photographersCount:
      payload.photographersCount !== undefined
        ? payload.photographersCount === null
          ? null
          : Number(payload.photographersCount)
        : currentExt.photographersCount ?? null,
    coverageDuration:
      payload.coverageDuration !== undefined
        ? payload.coverageDuration.trim()
        : currentExt.coverageDuration || "",
    albumDetails:
      payload.albumDetails !== undefined ? payload.albumDetails.trim() : currentExt.albumDetails || "",
    videoDetails:
      payload.videoDetails !== undefined ? payload.videoDetails.trim() : currentExt.videoDetails || "",
    imageUrl: payload.imageUrl !== undefined ? payload.imageUrl.trim() : currentExt.imageUrl || "",
  };

  await upsertVersionSection(
    vendorId,
    "packages",
    { packageExtras: { ...(pkgSection.packageExtras || {}), [packageId]: nextExt } },
    userId
  );
  await calculateAndSyncCompletion(vendorId);
}

export async function deletePhotographerPackage(vendorId: string, userId: string, packageId: string) {
  await supabaseFetch(
    `vendor_service_packages?id=eq.${encodeURIComponent(packageId)}&vendor_id=eq.${encodeURIComponent(vendorId)}`,
    {
      method: "PATCH",
      body: JSON.stringify({ deleted_at: new Date().toISOString() }),
    }
  );
  const pkgSection = await readVersionSection<{ packageExtras?: Record<string, PhotographerPackageExtra> }>(
    vendorId,
    "packages"
  );
  const nextExtras = { ...(pkgSection.packageExtras || {}) };
  delete nextExtras[packageId];
  await upsertVersionSection(vendorId, "packages", { packageExtras: nextExtras }, userId);
  await calculateAndSyncCompletion(vendorId);
}

// ---------- LEADS & INQUIRIES ----------
export async function listPhotographerLeads(vendorId: string) {
  const [{ data: leadRows }, categoryMeta] = await Promise.all([
    supabaseFetch<any[]>(
      `leads?vendor_id=eq.${encodeURIComponent(vendorId)}&deleted_at=is.null&order=updated_at.desc,created_at.desc`
    ),
    readVersionSection<PhotographerCategoryMeta>(vendorId, "category_details"),
  ]);

  const leads = Array.isArray(leadRows) ? leadRows : [];
  if (leads.length === 0) return [];

  const leadIds = leads.map((l) => `"${l.id}"`).join(",");
  const [{ data: activitiesRows }, { data: notesRows }] = await Promise.all([
    supabaseFetch<any[]>(
      `lead_activities?lead_id=in.(${leadIds})&order=created_at.asc`
    ),
    supabaseFetch<any[]>(
      `lead_notes?lead_id=in.(${leadIds})&order=created_at.desc`
    ),
  ]);

  const activitiesByLead = new Map<string, any[]>();
  if (Array.isArray(activitiesRows)) {
    for (const a of activitiesRows) {
      if (!activitiesByLead.has(a.lead_id)) activitiesByLead.set(a.lead_id, []);
      activitiesByLead.get(a.lead_id)!.push(a);
    }
  }

  const notesByLead = new Map<string, any[]>();
  if (Array.isArray(notesRows)) {
    for (const n of notesRows) {
      if (!notesByLead.has(n.lead_id)) notesByLead.set(n.lead_id, []);
      notesByLead.get(n.lead_id)!.push(n);
    }
  }

  const stageMap = categoryMeta.leadStageMap || {};

  // Deduplicate leads per ongoing customer thread if duplicate customer_id / phone+email exist
  const deduped: any[] = [];
  const seenKeys = new Set<string>();

  for (const lead of leads) {
    const dedupKey = lead.customer_id
      ? `cust:${lead.customer_id}`
      : `contact:${(lead.customer_email || "").toLowerCase()}|${(lead.customer_phone || "").replace(/\D/g, "").slice(-10)}`;

    const acts = activitiesByLead.get(lead.id) || [];
    const messageActs = acts.filter(
      (a) =>
        a.activity_type === "client_message" ||
        a.activity_type === "vendor_message" ||
        a.activity_type === "vendor_reply" ||
        a.activity_type === "vendor_auto_reply"
    );

    // Keep unique per contact key unless it's a genuinely separate event inquiry with its own thread
    if (seenKeys.has(dedupKey) && messageActs.length === 0) {
      continue;
    }
    seenKeys.add(dedupKey);

    const lastMsgAct =
      messageActs.length > 0 ? messageActs[messageActs.length - 1] : null;
    const stage: CrmLeadStage =
      stageMap[lead.id] || mapDbLeadStatusToDefaultStage(lead.status);

    deduped.push({
      id: lead.id,
      customerId: lead.customer_id || null,
      customerName: lead.customer_name || "Wedding Client",
      customerPhone: lead.customer_phone || "",
      customerEmail: lead.customer_email || "",
      eventType: lead.event_type || "Wedding Photography",
      eventDate: lead.event_date || null,
      location: lead.city || lead.venue_name || "",
      guestCount: lead.guest_count ?? null,
      estimatedBudget: lead.estimated_budget != null ? Number(lead.estimated_budget) : null,
      message: lead.message || "",
      latestMessage: lastMsgAct?.description || lead.message || "",
      latestMessageAt: lastMsgAct?.created_at || lead.updated_at || lead.created_at,
      messageCount: messageActs.length,
      isUnread: isLeadThreadUnread(acts),
      stage,
      dbStatus: lead.status || "new",
      source: lead.source || "profile_inquiry",
      notes: notesByLead.get(lead.id) || [],
      createdAt: lead.created_at,
      updatedAt: lead.updated_at,
    });
  }

  return deduped;
}

export async function updatePhotographerLeadStage(
  vendorId: string,
  userId: string,
  leadId: string,
  stage: CrmLeadStage
) {
  if (!CRM_LEAD_STAGES.includes(stage)) {
    throw new Error("Invalid lead stage.");
  }

  const dbStatus = mapCrmStageToDbLeadStatus(stage);
  await supabaseFetch(
    `leads?id=eq.${encodeURIComponent(leadId)}&vendor_id=eq.${encodeURIComponent(vendorId)}`,
    {
      method: "PATCH",
      body: JSON.stringify({
        status: dbStatus,
        updated_at: new Date().toISOString(),
        updated_by: userId,
      }),
    }
  );

  const meta = await readVersionSection<PhotographerCategoryMeta>(vendorId, "category_details");
  await upsertVersionSection(
    vendorId,
    "category_details",
    { leadStageMap: { ...(meta.leadStageMap || {}), [leadId]: stage } },
    userId
  );

  await supabaseFetch("lead_activities", {
    method: "POST",
    body: JSON.stringify({
      lead_id: leadId,
      activity_type: "status_changed",
      description: `Lead stage updated to ${stage}`,
      performed_by: userId,
    }),
  });
}

// ---------- REVIEWS ----------
export async function listPhotographerReviews(vendorId: string) {
  const [{ data: reviewRows }, { data: replyRows }, { data: bookingRows }, { data: leadRows }, categoryMeta] =
    await Promise.all([
      supabaseFetch<any[]>(
        `reviews?vendor_id=eq.${encodeURIComponent(vendorId)}&status=eq.published&order=created_at.desc`
      ),
      supabaseFetch<any[]>(`vendor_replies?vendor_id=eq.${encodeURIComponent(vendorId)}`),
      supabaseFetch<any[]>(`bookings?vendor_id=eq.${encodeURIComponent(vendorId)}&select=id,customer_id`),
      supabaseFetch<any[]>(
        `leads?vendor_id=eq.${encodeURIComponent(vendorId)}&deleted_at=is.null&select=id,customer_id`
      ),
      readVersionSection<PhotographerCategoryMeta>(vendorId, "category_details"),
    ]);

  const reviews = Array.isArray(reviewRows) ? reviewRows : [];
  const replies = Array.isArray(replyRows) ? replyRows : [];
  const replyByReview = new Map<string, any>();
  for (const r of replies) replyByReview.set(r.review_id, r);

  const verifiedCustomers = new Set<string>();
  if (Array.isArray(bookingRows)) {
    for (const b of bookingRows) if (b.customer_id) verifiedCustomers.add(b.customer_id);
  }
  if (Array.isArray(leadRows)) {
    for (const l of leadRows) if (l.customer_id) verifiedCustomers.add(l.customer_id);
  }

  const customerIds = Array.from(new Set(reviews.map((r) => r.customer_id).filter(Boolean)));
  const customerMap = new Map<string, string>();
  if (customerIds.length > 0) {
    const idList = customerIds.map((id) => `"${id}"`).join(",");
    const { data: users } = await supabaseFetch<any[]>(
      `users?id=in.(${idList})&select=id,full_name,name,email`
    );
    if (Array.isArray(users)) {
      for (const u of users) {
        customerMap.set(u.id, u.full_name || u.name || u.email?.split("@")[0] || "Client");
      }
    }
  }

  // Review images
  const reviewImagesMap = new Map<string, string[]>();
  if (reviews.length > 0) {
    const reviewIdList = reviews.map((r) => `"${r.id}"`).join(",");
    const { data: riRows } = await supabaseFetch<any[]>(
      `review_images?review_id=in.(${reviewIdList})&select=review_id,media_id`
    );
    if (Array.isArray(riRows) && riRows.length > 0) {
      const mIds = Array.from(new Set(riRows.map((x) => x.media_id).filter(Boolean)));
      const { data: mRows } = await supabaseFetch<any[]>(
        `media?id=in.(${mIds.map((m) => `"${m}"`).join(",")})&select=id,cdn_url`
      );
      const mUrlMap = new Map<string, string>();
      if (Array.isArray(mRows)) {
        for (const m of mRows) if (m.id && m.cdn_url) mUrlMap.set(m.id, m.cdn_url);
      }
      for (const ri of riRows) {
        const u = mUrlMap.get(ri.media_id);
        if (u) {
          if (!reviewImagesMap.has(ri.review_id)) reviewImagesMap.set(ri.review_id, []);
          reviewImagesMap.get(ri.review_id)!.push(u);
        }
      }
    }
  }

  const reports = categoryMeta.reviewReports || [];
  const reportedIds = new Set(reports.map((r) => r.reviewId));

  const distribution: Record<1 | 2 | 3 | 4 | 5, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  let sum = 0;

  const items = reviews.map((rev) => {
    const rating = Math.min(5, Math.max(1, Number(rev.rating || 5))) as 1 | 2 | 3 | 4 | 5;
    distribution[rating] += 1;
    sum += rating;
    const reply = replyByReview.get(rev.id);
    return {
      id: rev.id,
      customerId: rev.customer_id,
      customerName: customerMap.get(rev.customer_id) || "Verified Client",
      rating,
      title: rev.title || "",
      reviewText: rev.review_text || "",
      images: reviewImagesMap.get(rev.id) || [],
      isVerified: Boolean(rev.booking_id) || verifiedCustomers.has(rev.customer_id),
      createdAt: rev.created_at,
      vendorReply: reply
        ? {
            id: reply.id,
            replyText: reply.reply_text,
            createdAt: reply.created_at,
            updatedAt: reply.updated_at,
          }
        : null,
      isReported: reportedIds.has(rev.id),
    };
  });

  const totalReviews = items.length;
  const averageRating = totalReviews > 0 ? Number((sum / totalReviews).toFixed(2)) : 0;

  return {
    averageRating,
    totalReviews,
    distribution,
    reviews: items,
    reports,
  };
}

export async function replyToPhotographerReview(
  vendorId: string,
  reviewId: string,
  replyText: string
) {
  const clean = (replyText || "").trim();
  if (!clean) throw new Error("Reply text cannot be empty.");

  // Verify review belongs to this vendor
  const { data: revRows } = await supabaseFetch<any[]>(
    `reviews?id=eq.${encodeURIComponent(reviewId)}&vendor_id=eq.${encodeURIComponent(vendorId)}&select=id&limit=1`
  );
  if (!Array.isArray(revRows) || revRows.length === 0) {
    throw new Error("Review not found for this photographer.");
  }

  const { data: existing } = await supabaseFetch<any[]>(
    `vendor_replies?review_id=eq.${encodeURIComponent(reviewId)}&vendor_id=eq.${encodeURIComponent(vendorId)}&select=id&limit=1`
  );

  if (Array.isArray(existing) && existing[0]?.id) {
    await supabaseFetch(`vendor_replies?id=eq.${encodeURIComponent(existing[0].id)}`, {
      method: "PATCH",
      body: JSON.stringify({
        reply_text: clean,
        updated_at: new Date().toISOString(),
      }),
    });
  } else {
    await supabaseFetch("vendor_replies", {
      method: "POST",
      body: JSON.stringify({
        review_id: reviewId,
        vendor_id: vendorId,
        reply_text: clean,
      }),
    });
  }
}

export async function reportPhotographerReview(
  vendorId: string,
  userId: string,
  reviewId: string,
  reason: string,
  details: string
) {
  const { data: revRows } = await supabaseFetch<any[]>(
    `reviews?id=eq.${encodeURIComponent(reviewId)}&vendor_id=eq.${encodeURIComponent(vendorId)}&select=id&limit=1`
  );
  if (!Array.isArray(revRows) || revRows.length === 0) {
    throw new Error("Review not found for this photographer.");
  }

  const meta = await readVersionSection<PhotographerCategoryMeta>(vendorId, "category_details");
  const currentReports = Array.isArray(meta.reviewReports) ? meta.reviewReports : [];
  const nextReports: ReviewReportRecord[] = [
    ...currentReports.filter((r) => r.reviewId !== reviewId),
    {
      id: `rep_${Date.now()}`,
      reviewId,
      reason: (reason || "Flagged for moderation").trim(),
      details: (details || "").trim(),
      reportedAt: new Date().toISOString(),
      status: "submitted",
    },
  ];
  await upsertVersionSection(vendorId, "category_details", { reviewReports: nextReports }, userId);
}

// ---------- FAQS & CUSTOMER QUESTIONS ----------
export async function listPhotographerFaqs(vendorId: string) {
  const [{ data: rows }, faqMeta] = await Promise.all([
    supabaseFetch<any[]>(
      `vendor_faqs?vendor_id=eq.${encodeURIComponent(vendorId)}&order=sort_order.asc,created_at.asc`
    ),
    readVersionSection<PhotographerFaqMeta>(vendorId, "faqs"),
  ]);

  const hiddenSet = new Set(Array.isArray(faqMeta.faqHiddenIds) ? faqMeta.faqHiddenIds : []);
  const photographerFaqs = (Array.isArray(rows) ? rows : []).map((f) => ({
    id: f.id,
    question: f.question,
    answer: f.answer,
    sortOrder: Number(f.sort_order ?? 0),
    isPublished: !hiddenSet.has(f.id),
    createdAt: f.created_at,
    updatedAt: f.updated_at,
  }));

  const customerQuestions = Array.isArray(faqMeta.customerQuestions)
    ? [...faqMeta.customerQuestions].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    : [];

  return {
    photographerFaqs,
    customerQuestions,
  };
}

export async function createPhotographerFaqItem(
  vendorId: string,
  userId: string,
  payload: { question: string; answer: string; isPublished?: boolean }
) {
  const q = (payload.question || "").trim();
  const a = (payload.answer || "").trim();
  if (!q || !a) throw new Error("Both question and answer are required.");

  const { data: existing } = await supabaseFetch<any[]>(
    `vendor_faqs?vendor_id=eq.${encodeURIComponent(vendorId)}&select=id`
  );
  const sortOrder = Array.isArray(existing) ? existing.length : 0;

  const { data, error } = await supabaseFetch<any[]>("vendor_faqs", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({
      vendor_id: vendorId,
      question: q,
      answer: a,
      sort_order: sortOrder,
    }),
  });
  if (error || !Array.isArray(data) || !data[0]?.id) {
    throw new Error(error?.message || "Failed to save FAQ.");
  }

  const created = data[0];
  if (payload.isPublished === false) {
    const meta = await readVersionSection<PhotographerFaqMeta>(vendorId, "faqs");
    const nextHidden = Array.from(new Set([...(meta.faqHiddenIds || []), created.id]));
    await upsertVersionSection(vendorId, "faqs", { faqHiddenIds: nextHidden }, userId);
  }
  await calculateAndSyncCompletion(vendorId);
  return created;
}

export async function updatePhotographerFaqItem(
  vendorId: string,
  userId: string,
  faqId: string,
  payload: { question?: string; answer?: string; isPublished?: boolean; sortOrder?: number }
) {
  const patch: Record<string, any> = { updated_at: new Date().toISOString() };
  if (payload.question !== undefined) {
    const q = payload.question.trim();
    if (!q) throw new Error("Question cannot be empty.");
    patch.question = q;
  }
  if (payload.answer !== undefined) {
    const a = payload.answer.trim();
    if (!a) throw new Error("Answer cannot be empty.");
    patch.answer = a;
  }
  if (payload.sortOrder !== undefined) patch.sort_order = Number(payload.sortOrder);

  await supabaseFetch(
    `vendor_faqs?id=eq.${encodeURIComponent(faqId)}&vendor_id=eq.${encodeURIComponent(vendorId)}`,
    { method: "PATCH", body: JSON.stringify(patch) }
  );

  if (payload.isPublished !== undefined) {
    const meta = await readVersionSection<PhotographerFaqMeta>(vendorId, "faqs");
    const hidden = new Set(meta.faqHiddenIds || []);
    if (payload.isPublished) hidden.delete(faqId);
    else hidden.add(faqId);
    await upsertVersionSection(vendorId, "faqs", { faqHiddenIds: Array.from(hidden) }, userId);
  }
}

export async function reorderPhotographerFaqs(
  vendorId: string,
  orderedIds: string[]
) {
  await Promise.all(
    orderedIds.map((id, idx) =>
      supabaseFetch(
        `vendor_faqs?id=eq.${encodeURIComponent(id)}&vendor_id=eq.${encodeURIComponent(vendorId)}`,
        {
          method: "PATCH",
          body: JSON.stringify({ sort_order: idx, updated_at: new Date().toISOString() }),
        }
      )
    )
  );
}

export async function deletePhotographerFaqItem(vendorId: string, userId: string, faqId: string) {
  await supabaseFetch(
    `vendor_faqs?id=eq.${encodeURIComponent(faqId)}&vendor_id=eq.${encodeURIComponent(vendorId)}`,
    { method: "DELETE" }
  );
  const meta = await readVersionSection<PhotographerFaqMeta>(vendorId, "faqs");
  const nextHidden = (meta.faqHiddenIds || []).filter((id) => id !== faqId);
  const nextQuestions = (meta.customerQuestions || []).map((cq) =>
    cq.faqId === faqId ? { ...cq, faqId: null, status: cq.status === "published" ? ("draft" as const) : cq.status } : cq
  );
  await upsertVersionSection(
    vendorId,
    "faqs",
    { faqHiddenIds: nextHidden, customerQuestions: nextQuestions },
    userId
  );
  await calculateAndSyncCompletion(vendorId);
}

export async function submitCustomerQuestionPublic(
  vendorId: string,
  payload: { customerName: string; customerEmail?: string; question: string }
): Promise<CustomerQuestionRecord> {
  const questionText = (payload.question || "").trim();
  const customerName = (payload.customerName || "Wedding Client").trim();
  if (questionText.length < 5) {
    throw new Error("Please enter a question (at least 5 characters).");
  }

  const meta = await readVersionSection<PhotographerFaqMeta>(vendorId, "faqs");
  const record: CustomerQuestionRecord = {
    id: `cq_${crypto.randomUUID()}`,
    customerName,
    customerEmail: (payload.customerEmail || "").trim(),
    question: questionText,
    answer: "",
    status: "pending",
    faqId: null,
    createdAt: new Date().toISOString(),
    answeredAt: null,
  };

  const nextQuestions = [record, ...(meta.customerQuestions || [])];
  await upsertVersionSection(vendorId, "faqs", { customerQuestions: nextQuestions }, null);
  return record;
}

export async function moderateCustomerQuestion(
  vendorId: string,
  userId: string,
  questionId: string,
  action: "publish" | "draft" | "reject" | "delete",
  answerText?: string
) {
  const meta = await readVersionSection<PhotographerFaqMeta>(vendorId, "faqs");
  const list = [...(meta.customerQuestions || [])];
  const idx = list.findIndex((q) => q.id === questionId);
  if (idx === -1) throw new Error("Customer question not found.");

  const target = list[idx];

  if (action === "delete") {
    if (target.faqId) {
      await supabaseFetch(
        `vendor_faqs?id=eq.${encodeURIComponent(target.faqId)}&vendor_id=eq.${encodeURIComponent(vendorId)}`,
        { method: "DELETE" }
      );
    }
    const nextList = list.filter((q) => q.id !== questionId);
    await upsertVersionSection(vendorId, "faqs", { customerQuestions: nextList }, userId);
    return;
  }

  const finalAnswer = (answerText !== undefined ? answerText : target.answer || "").trim();
  if (action === "publish" && !finalAnswer) {
    throw new Error("Please write an answer before publishing this FAQ.");
  }

  let linkedFaqId = target.faqId || null;

  if (action === "publish") {
    if (linkedFaqId) {
      await supabaseFetch(
        `vendor_faqs?id=eq.${encodeURIComponent(linkedFaqId)}&vendor_id=eq.${encodeURIComponent(vendorId)}`,
        {
          method: "PATCH",
          body: JSON.stringify({
            question: target.question,
            answer: finalAnswer,
            updated_at: new Date().toISOString(),
          }),
        }
      );
    } else {
      const { data: existingFaqs } = await supabaseFetch<any[]>(
        `vendor_faqs?vendor_id=eq.${encodeURIComponent(vendorId)}&select=id`
      );
      const { data: inserted } = await supabaseFetch<any[]>("vendor_faqs", {
        method: "POST",
        headers: { Prefer: "return=representation" },
        body: JSON.stringify({
          vendor_id: vendorId,
          question: target.question,
          answer: finalAnswer,
          sort_order: Array.isArray(existingFaqs) ? existingFaqs.length : 0,
        }),
      });
      if (Array.isArray(inserted) && inserted[0]?.id) {
        linkedFaqId = inserted[0].id;
      }
    }

    // Ensure published FAQ is not hidden
    const hidden = new Set(meta.faqHiddenIds || []);
    if (linkedFaqId) hidden.delete(linkedFaqId);
    list[idx] = {
      ...target,
      answer: finalAnswer,
      status: "published",
      faqId: linkedFaqId,
      answeredAt: new Date().toISOString(),
    };
    await upsertVersionSection(
      vendorId,
      "faqs",
      { customerQuestions: list, faqHiddenIds: Array.from(hidden) },
      userId
    );
    await calculateAndSyncCompletion(vendorId);
    return;
  }

  // draft or reject -> ensure removed from public faq list
  if (linkedFaqId) {
    const hidden = Array.from(new Set([...(meta.faqHiddenIds || []), linkedFaqId]));
    list[idx] = {
      ...target,
      answer: finalAnswer,
      status: action === "draft" ? "draft" : "rejected",
      answeredAt: finalAnswer ? new Date().toISOString() : target.answeredAt,
    };
    await upsertVersionSection(vendorId, "faqs", { customerQuestions: list, faqHiddenIds: hidden }, userId);
  } else {
    list[idx] = {
      ...target,
      answer: finalAnswer,
      status: action === "draft" ? "draft" : "rejected",
      answeredAt: finalAnswer ? new Date().toISOString() : target.answeredAt,
    };
    await upsertVersionSection(vendorId, "faqs", { customerQuestions: list }, userId);
  }
}

// ---------- OVERVIEW METRICS ----------
export async function getPhotographerOverviewData(context: PhotographerAuthContext) {
  const { vendorId } = context;

  const [profile, services, portfolio, packages, leads, reviewsData, faqsData, viewsRes] =
    await Promise.all([
      getPhotographerProfile(vendorId, context),
      listPhotographerServices(vendorId),
      listPhotographerPortfolio(vendorId),
      listPhotographerPackages(vendorId),
      listPhotographerLeads(vendorId),
      listPhotographerReviews(vendorId),
      listPhotographerFaqs(vendorId),
      supabaseFetch<any[]>(
        `analytics_profile_views?vendor_id=eq.${encodeURIComponent(vendorId)}&select=id`
      ),
    ]);

  const unreadMessagesCount = leads.filter((l) => l.isUnread).length;
  const pendingInquiriesCount = leads.filter(
    (l) => l.isUnread || l.stage === "New" || l.stage === "Follow-up Required"
  ).length;
  const profileViewsCount = Array.isArray(viewsRes.data) ? viewsRes.data.length : 0;
  const publishedPortfolioCount =
    portfolio.photos.filter((p) => p.isPublic !== false).length +
    portfolio.videos.filter((v) => v.isPublic !== false).length;
  const activeServicesCount = services.filter((s) => s.is_active).length;
  const activePackagesCount = packages.filter((p) => p.isActive).length;
  const pendingQuestionsCount = faqsData.customerQuestions.filter((q) => q.status === "pending").length;

  const missingSteps: Array<{ label: string; tab: string }> = [];
  if (!profile.coverUrl) missingSteps.push({ label: "Upload a studio cover photo", tab: "profile" });
  if (!profile.logoUrl) missingSteps.push({ label: "Upload your studio logo / portrait", tab: "profile" });
  if (profile.about.trim().length < 30) missingSteps.push({ label: "Complete your studio bio", tab: "profile" });
  if (portfolio.photos.length + portfolio.videos.length < 3) {
    missingSteps.push({ label: "Add at least 3 portfolio items", tab: "portfolio" });
  }
  if (!services.some((s) => s.is_active)) missingSteps.push({ label: "Add a photography service", tab: "services" });
  if (!packages.some((p) => p.isActive)) missingSteps.push({ label: "Create a pricing package", tab: "packages" });

  const completion = await calculateAndSyncCompletion(vendorId);

  return {
    ownerName: profile.ownerName,
    businessName: profile.businessName,
    slug: profile.slug,
    vendorId,
    logoUrl: profile.logoUrl,
    coverUrl: profile.coverUrl,
    intro: profile.intro,
    tagline: profile.tagline,
    publicationStatus: profile.publicationStatus,
    profileCompletion: completion,
    completionHints: missingSteps.slice(0, 3),
    metrics: {
      uniqueLeadsCount: leads.length,
      pendingInquiriesCount,
      totalInquiriesCount: leads.length,
      unreadMessagesCount,
      profileViewsCount,
      publishedPortfolioCount,
      albumsCount: portfolio.albums.length,
      photosCount: portfolio.photos.length,
      videosCount: portfolio.videos.length,
      activeServicesCount,
      activePackagesCount,
      averageRating: reviewsData.averageRating,
      totalReviews: reviewsData.totalReviews,
      pendingQuestionsCount,
    },
    recentInquiries: leads.slice(0, 6),
  };
}

// ---------- PUBLIC STOREFRONT ENRICHMENT ----------
export async function getPublicPhotographerExtras(vendorId: string) {
  const [profile, services, portfolio, packages, reviewsData, faqsData] = await Promise.all([
    getPhotographerProfile(vendorId),
    listPhotographerServices(vendorId),
    listPhotographerPortfolio(vendorId),
    listPhotographerPackages(vendorId),
    listPhotographerReviews(vendorId),
    listPhotographerFaqs(vendorId),
  ]);

  const visiblePhotos = portfolio.photos.filter((p) => p.isPublic !== false);
  const visibleAlbums = portfolio.albums.filter((a) => a.isPublic !== false);
  const visibleVideos = portfolio.videos.filter((v) => v.isPublic !== false);

  return {
    profileExtras: {
      ownerName: profile.ownerName,
      intro: profile.intro,
      experienceYears: profile.experienceYears,
      areasServed: profile.areasServed,
      equipment: profile.equipment,
      styles: profile.styles,
      specializations: profile.specializations,
      whatsapp: profile.whatsapp,
      candidPhotography: profile.candidPhotography,
      cinematicVideo: profile.cinematicVideo,
      droneCoverage: profile.droneCoverage,
      deliveryDays: profile.deliveryDays,
      albumPages: profile.albumPages,
      youtube: profile.youtube,
      instagram: profile.instagram,
      facebook: profile.facebook,
      website: profile.website,
    },
    services: services.filter((s) => s.is_active),
    albums: visibleAlbums,
    photos: visiblePhotos,
    videos: visibleVideos,
    packages: packages.filter((p) => p.isActive),
    reviewsSummary: {
      averageRating: reviewsData.averageRating,
      totalReviews: reviewsData.totalReviews,
      distribution: reviewsData.distribution,
    },
    reviewsList: reviewsData.reviews,
    faqs: faqsData.photographerFaqs
      .filter((f) => f.isPublished)
      .map((f) => ({ id: f.id, question: f.question, answer: f.answer })),
  };
}

export async function recalculateRatingAfterCustomerReview(vendorId: string) {
  return recalculateVendorRatingInDb(vendorId);
}

export async function enrichPhotographerPublicProfile(
  existingProfile: any,
  options?: { isDraftPreview?: boolean }
) {
  const extras = await getPublicPhotographerExtras(existingProfile.id);
  const p = extras.profileExtras as any;
  const galleryPhotos = extras.photos.map((photo) => ({
    id: photo.id,
    url: photo.imageUrl,
    image_url: photo.imageUrl,
    caption: photo.caption,
    category: photo.category,
    albumId: photo.albumId,
  }));

  const coverFromPhoto = extras.photos.find((photo) => photo.isCover)?.imageUrl;
  const resolvedCover =
    p.coverUrl || existingProfile.cover_image || coverFromPhoto || existingProfile.storefront?.coverImage || "";
  const resolvedLogo =
    p.logoUrl || existingProfile.logo_url || existingProfile.logo || "";
  const resolvedAbout =
    p.about || existingProfile.about || p.intro || existingProfile.intro || "";
  const resolvedCity = p.city || existingProfile.city || "";
  const resolvedState = p.state || existingProfile.state || "";
  const resolvedLocation =
    [resolvedCity, resolvedState].filter(Boolean).join(", ") || existingProfile.location || "";

  const mappedReviews = extras.reviewsList.map((r) => ({
    id: r.id,
    customerName: r.customerName || "Verified Client",
    author: r.customerName || "Verified Client",
    rating: r.rating || 5,
    text: r.reviewText || "",
    reviewText: r.reviewText || "",
    verified: r.isVerified ?? true,
    date: r.createdAt
      ? new Date(r.createdAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" })
      : "Recent",
    reply: r.vendorReply ? r.vendorReply.replyText : null,
  }));

  const mappedFaqs = extras.faqs.map((f) => ({
    id: f.id,
    q: f.question,
    question: f.question,
    a: f.answer,
    answer: f.answer,
  }));

  const mappedVideos = extras.videos.map((v) => ({
    id: v.id,
    title: v.title || "Wedding Film",
    videoUrl: v.videoUrl || "",
    thumbnail: v.thumbnailUrl || (galleryPhotos[0]?.url || ""),
    duration: (v as any).duration || "",
  }));

  const resolvedStyles = (Array.isArray(p.styles) && p.styles.length > 0)
    ? p.styles
    : ["Candid Photography", "Cinematic Films", "Traditional Portraits", "Pre-wedding", "Drone Cinematics"];

  const resolvedEquipment = (Array.isArray(p.equipment) && p.equipment.length > 0)
    ? p.equipment
    : ["Sony FX3 Cinema Bodies", "Canon EOS R5 Full-Frame", "DJI Mavic 3 Cine 5.1K Drone", "Prime 85mm & 24-70mm f/1.4 Lenses"];

  const resolvedServices = (Array.isArray(extras.services) && extras.services.length > 0)
    ? extras.services
    : [
        {
          id: "svc-candid",
          name: "Candid Photography",
          description: "Natural unscripted emotional storytelling capturing spontaneous expressions.",
          price: p.startingPrice || existingProfile.starting_price || 65000,
          price_unit: "per day",
          is_active: true,
          imageUrl: galleryPhotos[0]?.url || "",
        },
        {
          id: "svc-films",
          name: "Cinematic Wedding Films",
          description: "4K multi-camera coverage, licensed sound design, color-graded highlight teaser.",
          price: (p.startingPrice || existingProfile.starting_price) ? Math.round((p.startingPrice || existingProfile.starting_price) * 1.35) : 85000,
          price_unit: "per event",
          is_active: true,
          imageUrl: galleryPhotos[1]?.url || galleryPhotos[0]?.url || "",
        },
        {
          id: "svc-traditional",
          name: "Traditional Photography",
          description: "Classic rituals, family portraits, and comprehensive ceremony album coverage.",
          price: (p.startingPrice || existingProfile.starting_price) ? Math.round((p.startingPrice || existingProfile.starting_price) * 0.75) : 45000,
          price_unit: "per day",
          is_active: true,
          imageUrl: galleryPhotos[0]?.url || "",
        },
      ];

  return {
    ...existingProfile,
    ...(options?.isDraftPreview !== undefined ? { isDraftPreview: options.isDraftPreview } : {}),
    name: existingProfile.business_name || existingProfile.name || p.ownerName || "Wedding Photographer",
    business_name: existingProfile.business_name || existingProfile.name || p.ownerName || "Wedding Photographer",
    brandName: existingProfile.business_name || existingProfile.name || p.ownerName || "Wedding Photographer",
    about: resolvedAbout,
    description: resolvedAbout,
    intro: p.intro || existingProfile.intro || "",
    tagline: p.tagline || existingProfile.tagline || "",
    experienceYears: p.experienceYears ?? existingProfile.experienceYears ?? null,
    startingPrice: p.startingPrice != null ? p.startingPrice : existingProfile.starting_price,
    starting_price: p.startingPrice != null ? p.startingPrice : existingProfile.starting_price,
    phone: p.phone || existingProfile.phone || existingProfile.contact_phone || "",
    whatsapp: p.whatsapp || existingProfile.whatsapp || p.phone || existingProfile.phone || "",
    email: p.email || existingProfile.email || existingProfile.contact_email || "",
    city: resolvedCity,
    state: resolvedState,
    pincode: p.pincode || existingProfile.pincode || "",
    location: resolvedLocation,
    areasServed: p.areasServed || [],
    styles: resolvedStyles,
    equipment: resolvedEquipment,
    specializations: p.specializations || [],
    candidPhotography: p.candidPhotography,
    cinematicVideo: p.cinematicVideo,
    droneCoverage: p.droneCoverage,
    deliveryDays: p.deliveryDays,
    albumPages: p.albumPages,
    instagram: p.instagram,
    youtube: p.youtube,
    facebook: p.facebook,
    website: p.website,
    logo_url: resolvedLogo,
    logo: resolvedLogo,
    cover_image: resolvedCover,
    coverImage: resolvedCover,
    photographerExtras: extras,
    photographerProfile: {
      ...p,
      styles: resolvedStyles,
      equipment: resolvedEquipment,
    },
    services: resolvedServices,
    vendor_services: resolvedServices,
    packages: extras.packages,
    vendor_packages: extras.packages,
    vendor_service_packages: extras.packages,
    servicePackages: extras.packages,
    films: mappedVideos,
    videos: mappedVideos,
    wedding_films: mappedVideos,
    faqs: mappedFaqs,
    faqList: mappedFaqs,
    reviews: mappedReviews,
    userReviews: mappedReviews,
    reviewsList: mappedReviews,
    rating:
      extras.reviewsSummary.totalReviews > 0
        ? extras.reviewsSummary.averageRating
        : existingProfile.rating || 0,
    reviewCount: extras.reviewsSummary.totalReviews,
    reviewsCount: extras.reviewsSummary.totalReviews,
    galleryPhotos,
    gallery: galleryPhotos,
    highlights: galleryPhotos.map((photo) => ({
      name: photo.caption || "Showcase Photo",
      image: photo.url,
    })),
    galleryImages: galleryPhotos.map((photo) => photo.url).filter(Boolean),
    images: galleryPhotos.map((photo) => photo.url).filter(Boolean),
    portfolio: galleryPhotos,
    storefront: {
      ...(existingProfile.storefront || {}),
      brandName: existingProfile.business_name || existingProfile.name,
      coverImage: resolvedCover,
      gallery: galleryPhotos,
      services: resolvedServices,
      packages: extras.packages,
      films: mappedVideos,
      faqs: mappedFaqs,
      reviews: mappedReviews,
      styles: resolvedStyles,
      equipment: resolvedEquipment,
    },
  };
}
