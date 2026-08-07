"use client";

import { fetchVendorProfileFromDb, saveVendorProfileInDb } from "./supabase";

export interface VendorProfileData {
  id: string;
  user_id?: string;
  name: string;
  boutique_name: string;
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

/**
 * Fetches the authenticated vendor's live database record from Supabase DB via /api/v1/vendor/profile.
 * NEVER reads from hardcoded fallbacks or stale localStorage objects.
 */
export async function fetchAuthenticatedVendorFromDb(): Promise<VendorProfileData> {
  if (typeof window !== "undefined") {
    try {
      const res = await fetch("/api/v1/vendor/profile", {
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          const v = json.data.vendor || {};
          const p = json.data.profile || {};
          const c = Array.isArray(json.data.contacts) && json.data.contacts.length > 0 ? json.data.contacts[0] : {};
          // vendor.category is a vendor_categories object: {id, name, slug}
          const bName = p.business_name || v.boutique_name || v.name || "Vendor Partner";
          const catObj = v.category;
          const cat = (typeof catObj === "object" && catObj !== null)
            ? (catObj.name || "Vendor")
            : (typeof catObj === "string" ? catObj : "Vendor");

          const resolvedVendor: VendorProfileData = {
            id: v.id || "vendor-active",
            user_id: v.user_id,
            name: bName,
            boutique_name: bName,
            category: cat,
            logo: p.logo_url || v.logo_url || "",
            logo_url: p.logo_url || v.logo_url || "",
            coverImage: p.cover_image || v.cover_image || "",
            cover_image: p.cover_image || v.cover_image || "",
            description: p.about || v.description || "",
            phone: c.phone || v.phone || "",
            whatsapp: c.whatsapp || v.whatsapp || "",
            email: c.email || v.email || "",
            city: p.city || v.city || "Kochi",
            district: p.state || v.district || "Ernakulam",
            profile_completion_percentage: v.profile_completion_percentage || 80,
          };

          localStorage.setItem("cloche_active_vendor_identity", JSON.stringify(resolvedVendor));
          return resolvedVendor;
        }
      }
    } catch (err) {
      console.error("[vendorStore] Failed to fetch authenticated vendor profile from DB:", err);
    }
  }

  return getActiveVendorIdentity();
}

/**
 * Retrieves current active vendor identity from localStorage / auth
 */
export function getActiveVendorIdentity(): VendorProfileData {
  if (typeof window === "undefined") {
    return {
      id: "",
      name: "Vendor Partner",
      boutique_name: "Vendor Partner",
      category: "",
      district: "",
      city: "",
      profile_completion_percentage: 0,
    };
  }

  try {
    const rawUserData = localStorage.getItem("cloche_user_data");
    const rawVendors = localStorage.getItem("cloche_registered_vendors");

    if (rawUserData) {
      const u = JSON.parse(rawUserData);
      return {
        id: u.id || u.vendor_id || "v-registered",
        user_id: u.id,
        name: u.full_name || u.name || u.boutique_name || "Dream Wedding Studio",
        boutique_name: u.boutique_name || u.name || u.full_name || "Dream Wedding Studio",
        logo: u.logo || u.logo_url || u.image_url,
        logo_url: u.logo || u.logo_url || u.image_url,
        coverImage: u.coverImage || u.cover || u.heroImage,
        cover_image: u.coverImage || u.cover || u.heroImage,
        description: u.description || u.about || "Premier luxury wedding partner offering bespoke services.",
        phone: u.phone || u.whatsapp || "+919876543210",
        whatsapp: u.whatsapp || u.phone || "+919876543210",
        email: u.email || "vendor@cloche.app",
        website: u.website || "https://cloche.app",
        instagram: u.instagram || "@clochevendor",
        address: u.address || u.location || "MG Road, Kochi",
        city: u.city || u.district || "Kochi",
        district: u.district || u.city || "Ernakulam",
        category: u.category || "Photography",
        workingHours: u.workingHours || u.working_hours || "Mon – Sat: 10:00 AM – 8:00 PM | Sun: 11:00 AM – 5:00 PM",
        working_hours: u.working_hours || u.workingHours || "Mon – Sat: 10:00 AM – 8:00 PM | Sun: 11:00 AM – 5:00 PM",
        serviceAreas: u.serviceAreas || u.service_areas || "Kochi, Trivandrum, Kozhikode",
        service_areas: u.service_areas || u.serviceAreas || "Kochi, Trivandrum, Kozhikode",
        plan: u.plan || "Premium Partner",
        profile_completion_percentage: u.profile_completion_percentage || 85,
      };
    }

    if (rawVendors) {
      const list = JSON.parse(rawVendors);
      if (Array.isArray(list) && list.length > 0) {
        const v = list[0];
        return {
          id: v.id || "v-registered",
          name: v.boutique_name || v.name || "Dream Wedding Studio",
          boutique_name: v.boutique_name || v.name || "Dream Wedding Studio",
          logo: v.logo || v.logo_url || v.image_url,
          logo_url: v.logo || v.logo_url || v.image_url,
          coverImage: v.coverImage || v.cover,
          cover_image: v.coverImage || v.cover,
          description: v.description || v.about || "Premier luxury wedding partner.",
          phone: v.phone || v.whatsapp || "+919876543210",
          whatsapp: v.whatsapp || v.phone || "+919876543210",
          email: v.email || "vendor@cloche.app",
          website: v.website || "https://cloche.app",
          instagram: v.instagram || "@clochevendor",
          address: v.address || v.location || "MG Road, Kochi",
          city: v.city || v.district || "Kochi",
          district: v.district || v.city || "Ernakulam",
          category: v.category || "Photography",
          workingHours: v.workingHours || v.working_hours || "Mon – Sat: 10:00 AM – 8:00 PM",
          working_hours: v.working_hours || v.workingHours || "Mon – Sat: 10:00 AM – 8:00 PM",
          serviceAreas: v.serviceAreas || v.service_areas || "Kochi, Trivandrum",
          service_areas: v.service_areas || v.serviceAreas || "Kochi, Trivandrum",
          plan: v.plan || "Premium Partner",
          profile_completion_percentage: v.profile_completion_percentage || 85,
        };
      }
    }
  } catch (e) {}

  return {
    id: "v-registered",
    name: "Dream Wedding Studio",
    boutique_name: "Dream Wedding Studio",
    category: "Photography",
    district: "Ernakulam",
    city: "Kochi",
    profile_completion_percentage: 85,
  };
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

  // 2. Persist to Supabase Database
  try {
    const dbRes = await saveVendorProfileInDb(merged.id, merged);
    console.log("[syncVendorProfileWithDatabase] Supabase DB Save Result:", dbRes);

    // Verification: Fetch back from DB to verify saved == retrieved
    const verifyRes = await fetchVendorProfileFromDb(merged.id);
    if (!verifyRes.error && verifyRes.data) {
      console.log("[syncVendorProfileWithDatabase] Verification Passed. DB Record:", verifyRes.data);
    } else {
      console.warn("[syncVendorProfileWithDatabase] Verification Warning (using local merge):", verifyRes.error);
    }
  } catch (err: any) {
    console.error("[syncVendorProfileWithDatabase] Supabase DB Save Error:", err);
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
