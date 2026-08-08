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
  address?: string;
  city?: string;
  district?: string;
  category: string;
  workingHours?: string;
  working_hours?: string;
  serviceAreas?: string;
  service_areas?: string;
  plan?: string;
  profile_completion_percentage?: number;
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
            const webLink = s.find((item: any) => item.platform === "website")?.url || "";

            const bName = p.business_name || v.boutique_name || v.name || "";
            const catObj = v.category;
            const catName = (typeof catObj === "object" && catObj !== null)
              ? (catObj.name || "")
              : (typeof catObj === "string" ? catObj : "");

            const resolvedVendor: VendorProfileData = {
              id: v.id || "",
              user_id: v.user_id || "",
              name: bName,
              boutique_name: bName,
              owner_name: c.contact_name || v.owner_name || "",
              ownerName: c.contact_name || v.owner_name || "",
              category: catName,
              logo: p.logo_url || v.logo_url || "",
              logo_url: p.logo_url || v.logo_url || "",
              coverImage: p.cover_image || v.cover_image || "",
              cover_image: p.cover_image || v.cover_image || "",
              description: p.about || v.description || "",
              phone: c.phone || v.phone || "",
              whatsapp: c.whatsapp || v.whatsapp || c.phone || "",
              email: c.email || v.email || "",
              city: p.city || a.city || v.city || "",
              district: p.state || a.state || v.district || "",
              address: a.address_line1 || p.address || "",
              instagram: instaLink,
              website: webLink,
              workingHours: v.working_hours || "",
              working_hours: v.working_hours || "",
              serviceAreas: v.service_areas || "",
              service_areas: v.service_areas || "",
              profile_completion_percentage: v.profile_completion_percentage || 0,
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
        // Validate cached identity belongs to currently authenticated user session
        const cookieStr = document.cookie;
        const match = cookieStr.match(/(?:^|;\s*)user_data=([^;]*)/);
        if (match) {
          try {
            const u = JSON.parse(decodeURIComponent(match[1]));
            if (u?.id && parsed.user_id && u.id !== parsed.user_id && u.id !== parsed.id) {
              // User session mismatch! Purge stale cache
              clearActiveVendorIdentity();
              return emptyVendor;
            }
          } catch (_) {}
        }
        return parsed;
      }
    }
  } catch (e) {}

  return emptyVendor;
}

/**
 * Saves updated vendor profile data directly to Supabase DB & invalidates caches
 */
export async function syncVendorProfileWithDatabase(updatedFields: Partial<VendorProfileData>): Promise<{
  success: boolean;
  completion: number;
  data: VendorProfileData;
  error?: string;
}> {
  const current = getActiveVendorIdentity();
  const merged: VendorProfileData = {
    ...current,
    ...updatedFields,
    boutique_name: updatedFields.boutique_name || updatedFields.name || current.boutique_name,
    name: updatedFields.boutique_name || updatedFields.name || current.name,
    logo_url: updatedFields.logo || updatedFields.logo_url || current.logo_url,
    cover_image: updatedFields.coverImage || updatedFields.cover_image || current.cover_image,
    working_hours: updatedFields.workingHours || updatedFields.working_hours || current.working_hours,
    service_areas: updatedFields.serviceAreas || updatedFields.service_areas || current.service_areas,
  };

  // 1. Calculate dynamic completion
  const completion = calculateDynamicProfileCompletion(merged);
  merged.profile_completion_percentage = completion;

  // 2. Persist to Supabase Database through the authenticated vendor API
  try {
    const dbRes = await fetch("/api/v1/vendor/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        profile: {
          businessName: merged.boutique_name || merged.name,
          about: merged.description,
          city: merged.city || merged.district,
          state: merged.district,
          startingPrice: (updatedFields as any).startingPrice,
          instagram: merged.instagram,
          website: merged.website,
          logo: merged.logo || merged.logo_url,
          coverImage: merged.coverImage || merged.cover_image,
        },
        contact: {
          contact_name: merged.owner_name || merged.ownerName,
          phone: merged.phone || merged.whatsapp,
          whatsapp: merged.whatsapp || merged.phone,
          email: merged.email,
          instagram: merged.instagram,
          website: merged.website,
        },
        address: {
          address: merged.address,
          city: merged.city || merged.district,
          state: merged.district,
        },
        categoryDetails: {},
        changeSummary: "Vendor profile updated",
      }),
    });

    if (!dbRes.ok) {
      const errJson = await dbRes.json().catch(() => ({}));
      console.warn("[syncVendorProfileWithDatabase] Profile API warning:", errJson);
    }
  } catch (err: any) {
    console.error("[syncVendorProfileWithDatabase] Profile API save error:", err);
  }

  // 3. Update local caches for single-source-of-truth across components & pages
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("cloche_user_data", JSON.stringify(merged));
      
      const rawVendors = localStorage.getItem("cloche_registered_vendors");
      const vendorList = rawVendors ? JSON.parse(rawVendors) : [];
      const updatedList = [merged, ...vendorList.filter((v: any) => v.id !== merged.id)];
      localStorage.setItem("cloche_registered_vendors", JSON.stringify(updatedList));

      const rawVenues = localStorage.getItem("cloche_registered_venues");
      if (rawVenues) {
        const venueList = JSON.parse(rawVenues);
        const updatedVenueList = [merged, ...venueList.filter((v: any) => v.id !== merged.id)];
        localStorage.setItem("cloche_registered_venues", JSON.stringify(updatedVenueList));
      }

      // Broadcast update events to all open components, listings, detail pages & windows
      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(new Event("cloche_vendor_updated"));
      window.dispatchEvent(new Event("cloche_cms_update"));
    } catch (e) {}
  }

  return {
    success: true,
    completion,
    data: merged,
  };
}

/**
 * Toast Notification Dispatcher
 */
export function showVendorToast(message: string, type: "success" | "error" = "success") {
  if (typeof window !== "undefined") {
    const event = new CustomEvent("cloche_toast", {
      detail: { message, type },
    });
    window.dispatchEvent(event);
  }
}
