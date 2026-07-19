"use server";

import { cookies } from "next/headers";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://cloche-backend.onrender.com/api";

async function getAuthToken() {
  const cookieStore = await cookies();
  return cookieStore.get("auth_token")?.value;
}

export async function getWishlist() {
  const token = await getAuthToken();
  if (!token) return { success: false, data: [] };

  try {
    const res = await fetch(`${API_BASE_URL}/wishlist`, {
      headers: {
        "Authorization": `Bearer ${token}`
      },
      cache: "no-store"
    });
    const data = await res.json();
    return data;
  } catch (err) {
    return { success: false, data: [] };
  }
}

export async function addToWishlist(productId: number) {
  const token = await getAuthToken();
  if (!token) return { success: false, message: "Please login to save items" };

  try {
    const res = await fetch(`${API_BASE_URL}/wishlist`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ product_id: productId })
    });
    return await res.json();
  } catch (err) {
    return { success: false, message: "Server error" };
  }
}

export async function removeFromWishlist(wishlistId: number) {
  const token = await getAuthToken();
  if (!token) return { success: false };

  try {
    const res = await fetch(`${API_BASE_URL}/wishlist/${wishlistId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    return await res.json();
  } catch (err) {
    return { success: false };
  }
}
