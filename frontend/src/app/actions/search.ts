"use server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

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
