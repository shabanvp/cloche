import { Boutique, Product } from "@/types";

const rawBaseUrl = process.env.NEXT_PUBLIC_API_URL || "https://cloche-backend.onrender.com";
const API_BASE_URL = rawBaseUrl.endsWith('/api') ? rawBaseUrl : `${rawBaseUrl}/api`;

export async function getFeaturedBoutiques(): Promise<Boutique[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/boutiques?limit=8&cache_bust=${Date.now()}`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getTrendingCollections(): Promise<Product[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/products?cache_bust=${Date.now()}`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data.slice(0, 8) : [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getAllProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/products?cache_bust=${Date.now()}`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getAllBoutiques(): Promise<Boutique[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/boutiques`, {
      next: { revalidate: 60 },
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch (error) {
    console.error("getAllBoutiques backend fetch error:", error);
  }

  // Direct Supabase database fallback for server-side rendering
  try {
    const { supabaseFetch } = await import("@/lib/supabase");
    const { data, error } = await supabaseFetch("boutiques?select=*&order=created_at.desc");
    if (!error && Array.isArray(data) && data.length > 0) {
      return data.map((b: any) => {
        const logo = b.logo_url || b.logo || b.profile_logo || "";
        return {
          ...b,
          id: b.id,
          boutique_name: b.boutique_name || b.name || "Wedding Vendor",
          logo_url: logo,
          logo: logo,
          profile_logo: logo,
          image_url: logo,
          city: b.city || "Kochi",
          area: b.area || b.district || "Kerala",
          tags: b.tags || b.category || "Bridal Wear",
          rating: b.rating ? Number(b.rating) : 4.8,
          starting_price: b.starting_price || b.startingPrice || "₹50,000",
        };
      });
    }
  } catch (dbErr) {
    console.error("getAllBoutiques Supabase fetch error:", dbErr);
  }

  return [];
}

export async function getAdminAnalytics(token: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/analytics`, {
      headers: {
        "x-admin-token": token
      },
      cache: "no-store"
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error("getAdminAnalytics error:", error);
    return null;
  }
}

export async function getBoutiqueDetails(id: string): Promise<Boutique | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/boutiques/${id}?cache_bust=${Date.now()}`, {
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      if (data && (data.id || data.boutique_name)) return data;
    }
  } catch (error) {
    console.error("getBoutiqueDetails fetch error:", error);
  }

  return null;
}

export async function getBoutiqueProducts(boutiqueId: string): Promise<Product[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/products/boutique/${boutiqueId}?cache_bust=${Date.now()}`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getProductDetails(id: string): Promise<Product & { gallery?: string[], boutique_name?: string, boutique_city?: string, store_location?: string } | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/products/${id}?cache_bust=${Date.now()}`, {
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      if (data) return data;
    }
  } catch (error) {
    console.error("getProductDetails fetch error:", error);
  }

  try {
    const allProds = await getAllProducts();
    const found = allProds.find(p => String(p.id) === String(id));
    if (found) return found;
  } catch {}

  return null;
}
