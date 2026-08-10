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
 * Normalizes raw category string from DB/API into canonical category key
 */
export function normalizeVendorCategoryKey(rawCategory: string): string {
  const slug = (rawCategory || "").toLowerCase().trim();
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
  profileData: Partial<VendorProfileData>
): Promise<{ success: boolean; data?: any }> {
  if (typeof window !== "undefined") {
    try {
      const res = await fetch("/api/v1/vendor/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      });
      return { success: res.ok };
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
            const webLink = s.find((item: any) => item.platform === "website")?.url || "";

            const bName = p.business_name || v.boutique_name || v.name || "";
            const catObj = v.category;
            const catName = (typeof catObj === "object" && catObj !== null)
              ? (catObj.name || catObj.slug || "")
              : (typeof catObj === "string" ? catObj : (v.vendor_categories?.name || ""));

            const ownerNameVal = c.contact_name || v.owner_name || v.ownerName || p.owner_name || "";

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
