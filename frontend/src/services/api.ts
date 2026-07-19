import { Boutique, Product } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://cloche-backend.onrender.com/api";

export async function getFeaturedBoutiques(): Promise<Boutique[]> {
  try {
    // Adding revalidate tag for Next.js caching
    const res = await fetch(`${API_BASE_URL}/boutiques?limit=8`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    if (!res.ok) throw new Error("Failed to fetch boutiques");
    return res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getTrendingCollections(): Promise<Product[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/products`, {
      next: { revalidate: 3600 }
    });
    if (!res.ok) throw new Error("Failed to fetch products");
    const data = await res.json();
    return Array.isArray(data) ? data.slice(0, 8) : [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getAllProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/products`, {
      next: { revalidate: 3600 }
    });
    if (!res.ok) throw new Error("Failed to fetch products");
    return res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getAllBoutiques(): Promise<Boutique[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/boutiques`, {
      next: { revalidate: 3600 }
    });
    if (!res.ok) throw new Error("Failed to fetch boutiques");
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
      next: { revalidate: 60 }
    });
    if (!res.ok) throw new Error("Failed to fetch admin analytics");
    return res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getBoutiqueDetails(id: string): Promise<Boutique | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/boutiques/${id}`, {
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
    const res = await fetch(`${API_BASE_URL}/products/boutique/${boutiqueId}`, {
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
    const res = await fetch(`${API_BASE_URL}/products/${id}`, {
      next: { revalidate: 3600 }
    });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}
