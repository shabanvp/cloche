"use server";

import { cookies } from "next/headers";
const rawBaseUrl = process.env.NEXT_PUBLIC_API_URL || "https://cloche-backend.onrender.com";
const API_BASE_URL = rawBaseUrl.endsWith('/api') ? rawBaseUrl : `${rawBaseUrl}/api`;
export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as string; // 'customer', 'vendor', 'admin'

  try {
    let endpoint = `${API_BASE_URL}/auth/login`;
    
    // Depending on role, the backend might have different login endpoints or unified.
    // Assuming unified or specific based on Phase 9 structure.
    if (role === 'vendor') {
      endpoint = `${API_BASE_URL}/auth/partner-login`;
    } else if (role === 'admin') {
      endpoint = `${API_BASE_URL}/admin/login`;
    }

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      return { error: data.message || "Login failed" };
    }

    const cookieStore = await cookies();
    // Store the JWT token in an HttpOnly secure cookie
    cookieStore.set("auth_token", data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    // Store role for client-side UI logic (not secure for auth, but good for UI)
    cookieStore.set("user_role", role, { path: "/" });
    if (data.user) {
       cookieStore.set("user_data", JSON.stringify(data.user), { path: "/" });
    }

    return { success: true };
  } catch (error: any) {
    return { error: "An unexpected error occurred." };
  }
}

export async function signup(formData: FormData) {
  try {
    const endpoint = `${API_BASE_URL}/auth/signup`;
    
    const res = await fetch(endpoint, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      return { error: data.message || "Signup failed" };
    }

    return { success: true, ...data };
  } catch (error: any) {
    return { error: "An unexpected error occurred." };
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("auth_token");
  cookieStore.delete("user_role");
  cookieStore.delete("user_data");
  return { success: true };
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  const role = cookieStore.get("user_role")?.value;
  
  if (!token) return null;
  return { token, role };
}
