"use server";

import { cookies } from "next/headers";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

async function getAdminToken() {
  const cookieStore = await cookies();
  return cookieStore.get("admin_token")?.value || "admin-session-secure-token";
}

/* =======================================
   ARTICLES
======================================= */

export async function getArticles(isPublishedOnly = false) {
  try {
    const res = await fetch(`${API_BASE_URL}/content/articles${isPublishedOnly ? '?is_published=true' : ''}`, {
      cache: "no-store"
    });
    return await res.json();
  } catch (err) {
    return { success: false, data: [] };
  }
}

export async function getArticleBySlug(slug: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/content/articles/${slug}`, {
      cache: "no-store"
    });
    return await res.json();
  } catch (err) {
    return { success: false, data: null };
  }
}

export async function createArticle(formData: FormData) {
  const token = await getAdminToken();
  try {
    const res = await fetch(`${API_BASE_URL}/content/articles`, {
      method: "POST",
      headers: { "x-admin-token": token },
      body: formData
    });
    return await res.json();
  } catch (err) {
    return { success: false, message: "Server error" };
  }
}

export async function updateArticle(id: number, formData: FormData) {
  const token = await getAdminToken();
  try {
    const res = await fetch(`${API_BASE_URL}/content/articles/${id}`, {
      method: "PUT",
      headers: { "x-admin-token": token },
      body: formData
    });
    return await res.json();
  } catch (err) {
    return { success: false, message: "Server error" };
  }
}

export async function deleteArticle(id: number) {
  const token = await getAdminToken();
  try {
    const res = await fetch(`${API_BASE_URL}/content/articles/${id}`, {
      method: "DELETE",
      headers: { "x-admin-token": token }
    });
    return await res.json();
  } catch (err) {
    return { success: false, message: "Server error" };
  }
}

/* =======================================
   REAL WEDDINGS
======================================= */

export async function getRealWeddings(isPublishedOnly = false) {
  try {
    const res = await fetch(`${API_BASE_URL}/content/weddings${isPublishedOnly ? '?is_published=true' : ''}`, {
      cache: "no-store"
    });
    return await res.json();
  } catch (err) {
    return { success: false, data: [] };
  }
}

export async function getRealWeddingBySlug(slug: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/content/weddings/${slug}`, {
      cache: "no-store"
    });
    return await res.json();
  } catch (err) {
    return { success: false, data: null };
  }
}

export async function createRealWedding(formData: FormData) {
  const token = await getAdminToken();
  try {
    const res = await fetch(`${API_BASE_URL}/content/weddings`, {
      method: "POST",
      headers: { "x-admin-token": token },
      body: formData
    });
    return await res.json();
  } catch (err) {
    return { success: false, message: "Server error" };
  }
}

export async function updateRealWedding(id: number, formData: FormData) {
  const token = await getAdminToken();
  try {
    const res = await fetch(`${API_BASE_URL}/content/weddings/${id}`, {
      method: "PUT",
      headers: { "x-admin-token": token },
      body: formData
    });
    return await res.json();
  } catch (err) {
    return { success: false, message: "Server error" };
  }
}

export async function deleteRealWedding(id: number) {
  const token = await getAdminToken();
  try {
    const res = await fetch(`${API_BASE_URL}/content/weddings/${id}`, {
      method: "DELETE",
      headers: { "x-admin-token": token }
    });
    return await res.json();
  } catch (err) {
    return { success: false, message: "Server error" };
  }
}

/* =======================================
   NEWSLETTER
======================================= */

export async function subscribeNewsletter(email: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/content/newsletter`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });
    return await res.json();
  } catch (err) {
    return { success: false, message: "Server error" };
  }
}
