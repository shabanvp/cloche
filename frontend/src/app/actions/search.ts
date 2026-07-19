"use server";

const rawBaseUrl = process.env.NEXT_PUBLIC_API_URL || "https://cloche-backend.onrender.com";
const API_BASE_URL = rawBaseUrl.endsWith('/api') ? rawBaseUrl : `${rawBaseUrl}/api`;
export async function searchProducts(params: Record<string, any>) {
  try {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value && value !== "All") {
        query.append(key, String(value));
      }
    });

    const res = await fetch(`${API_BASE_URL}/products/search?${query.toString()}`, {
      cache: "no-store"
    });
    return await res.json();
  } catch (err) {
    return { success: false, data: [], pagination: {} };
  }
}

export async function searchBoutiques(params: Record<string, any>) {
  try {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value && value !== "All") {
        query.append(key, String(value));
      }
    });

    const res = await fetch(`${API_BASE_URL}/boutiques/search?${query.toString()}`, {
      cache: "no-store"
    });
    return await res.json();
  } catch (err) {
    return { success: false, data: [], pagination: {} };
  }
}
