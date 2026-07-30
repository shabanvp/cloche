import { Boutique, Product } from "@/types";

const rawBaseUrl = process.env.NEXT_PUBLIC_API_URL || "https://cloche-backend.onrender.com";
const API_BASE_URL = rawBaseUrl.endsWith('/api') ? rawBaseUrl : `${rawBaseUrl}/api`;

export async function getFeaturedBoutiques(): Promise<Boutique[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/boutiques?limit=8&cache_bust=${Date.now()}`, {
      next: { revalidate: 3600 } 
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
      next: { revalidate: 3600 }
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
      next: { revalidate: 3600 }
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
    const res = await fetch(`${API_BASE_URL}/boutiques?cache_bust=${Date.now()}`, {
      next: { revalidate: 3600 }
    });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
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
      next: { revalidate: 3600 }
    });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getBoutiqueProducts(boutiqueId: string): Promise<Product[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/products/boutique/${boutiqueId}?cache_bust=${Date.now()}`, {
      next: { revalidate: 3600 }
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
      next: { revalidate: 3600 }
    });
    if (res.ok) {
      const data = await res.json();
      if (data) return data;
    }
  } catch (error) {
    console.error("getProductDetails fetch error:", error);
  }

  // Fallback to searching all products
  try {
    const allProds = await getAllProducts();
    const found = allProds.find(p => String(p.id) === String(id));
    if (found) return found as any;
  } catch (e) {}

  // Fallback mock object if product ID is temporary
  return {
    id: id,
    boutique_id: id.split('-col-')[0] || id.split('-prod-')[0] || "kalki-couture",
    boutique_name: "Bridal Couture Partner",
    product_name: "Signature Royal Bridal Outfit",
    category: "Bridal Wear",
    price: 45000,
    description: "Bespoke handcrafted bridal wear ensemble featuring intricate hand zardozi and silk embroidery.",
    image_url: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1594938298596-70f594f74246?auto=format&fit=crop&w=800&q=80",
    ]
  };
}
