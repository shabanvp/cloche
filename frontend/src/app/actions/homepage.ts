"use server";

import { cookies } from "next/headers";

const rawBaseUrl = process.env.NEXT_PUBLIC_API_URL || "https://cloche-backend.onrender.com";
const API_BASE_URL = rawBaseUrl.endsWith('/api') ? rawBaseUrl : `${rawBaseUrl}/api`;
async function getAdminToken() {
  const cookieStore = await cookies();
  return cookieStore.get("auth_token")?.value || "";
}

export async function getHomepageSections() {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/homepage`, {
      cache: "no-store"
    });
    return await res.json();
  } catch (err) {
    return { success: false, data: [] };
  }
}

export async function createHomepageSection(formData: FormData) {
  const token = await getAdminToken();
  try {
    const res = await fetch(`${API_BASE_URL}/admin/homepage`, {
      method: "POST",
      headers: {
        "x-admin-token": token
      },
      body: formData
    });
    return await res.json();
  } catch (err) {
    return { success: false, message: "Server error" };
  }
}

export async function updateHomepageSection(id: number, formData: FormData) {
  const token = await getAdminToken();
  try {
    const res = await fetch(`${API_BASE_URL}/admin/homepage/${id}`, {
      method: "PUT",
      headers: {
        "x-admin-token": token
      },
      body: formData
    });
    return await res.json();
  } catch (err) {
    return { success: false, message: "Server error" };
  }
}

export async function deleteHomepageSection(id: number) {
  const token = await getAdminToken();
  try {
    const res = await fetch(`${API_BASE_URL}/admin/homepage/${id}`, {
      method: "DELETE",
      headers: {
        "x-admin-token": token
      }
    });
    return await res.json();
  } catch (err) {
    return { success: false, message: "Server error" };
  }
}

export async function reorderHomepageSections(items: { id: number, display_order: number }[]) {
  const token = await getAdminToken();
  try {
    const res = await fetch(`${API_BASE_URL}/admin/homepage/reorder`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-admin-token": token
      },
      body: JSON.stringify({ items })
    });
    return await res.json();
  } catch (err) {
    return { success: false, message: "Server error" };
  }
}
