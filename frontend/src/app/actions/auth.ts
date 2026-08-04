"use server";

import { cookies } from "next/headers";

const rawBaseUrl = process.env.NEXT_PUBLIC_API_URL || "https://cloche-backend.onrender.com";
const API_BASE_URL = rawBaseUrl.endsWith('/api') ? rawBaseUrl : `${rawBaseUrl}/api`;

export async function login(formData: FormData) {
  const email = (formData.get("email") as string || "").trim().toLowerCase();
  const password = formData.get("password") as string;
  const role = (formData.get("role") as string) || "customer";

  try {
    // 1. Try native Next.js API route first
    const nativeRes = await fetch("http://localhost:3000/api/v1/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
    }).catch(() => null);

    if (nativeRes && nativeRes.ok) {
      const data = await nativeRes.json();
      if (data.success && data.data?.token) {
        const cookieStore = await cookies();
        cookieStore.set("cloche_auth_token", data.data.token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 30 * 24 * 60 * 60,
        });
        cookieStore.set("auth_token", data.data.token, { path: "/" });
        cookieStore.set("user_role", role, { path: "/" });
        if (data.data.user) {
          cookieStore.set("user_data", JSON.stringify(data.data.user), { path: "/" });
        }
        return { success: true };
      }
    }

    // 2. Fallback to Render API endpoint
    let endpoint = `${API_BASE_URL}/auth/login-user`;
    const payload: any = { password };
    
    if (role === 'vendor' || role === 'partner') {
      endpoint = `${API_BASE_URL}/auth/login`;
      payload.identifier = email;
    } else if (role === 'admin') {
      endpoint = `${API_BASE_URL}/admin/login`;
      payload.email = email;
    } else {
      endpoint = `${API_BASE_URL}/auth/login-user`;
      payload.email = email;
    }

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      return { error: data.message || "Login failed" };
    }

    const cookieStore = await cookies();
    cookieStore.set("auth_token", data.token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });
    cookieStore.set("cloche_auth_token", data.token, { path: "/" });
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
    const name = (formData.get("name") as string || "").trim();
    const email = (formData.get("email") as string || "").trim().toLowerCase();
    const phone = (formData.get("phone") as string || "").trim();
    const password = formData.get("password") as string;
    const role = (formData.get("account_type") as string) === "vendor" ? "vendor" : "customer";

    // 1. Try native Next.js API route first
    const nativeRes = await fetch("http://localhost:3000/api/v1/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
        fullName: name,
        phone,
        role,
      }),
      cache: "no-store",
    }).catch(() => null);

    if (nativeRes && nativeRes.ok) {
      const data = await nativeRes.json();
      if (data.success && data.data?.token) {
        const cookieStore = await cookies();
        cookieStore.set("cloche_auth_token", data.data.token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 30 * 24 * 60 * 60,
        });
        cookieStore.set("auth_token", data.data.token, { path: "/" });
        cookieStore.set("user_role", role, { path: "/" });
        if (data.data.user) {
          cookieStore.set("user_data", JSON.stringify(data.data.user), { path: "/" });
        }
        return { success: true, ...data };
      }
    }

    // 2. Fallback to Render API endpoint
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
  cookieStore.delete("cloche_auth_token");
  cookieStore.delete("user_role");
  cookieStore.delete("user_data");
  return { success: true };
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("cloche_auth_token")?.value || cookieStore.get("auth_token")?.value;
  const role = cookieStore.get("user_role")?.value;
  
  if (!token) return null;
  return { token, role };
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("cloche_auth_token")?.value || cookieStore.get("auth_token")?.value;
  const userDataCookie = cookieStore.get("user_data")?.value;

  let cachedUser: any = null;
  if (userDataCookie) {
    try {
      cachedUser = JSON.parse(userDataCookie);
    } catch (e) {}
  }

  if (token) {
    try {
      const res = await fetch("http://localhost:3000/api/v1/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      }).catch(() => null);

      if (res && res.ok) {
        const data = await res.json();
        if (data.success && data.data?.user) {
          return { success: true, user: data.data.user };
        }
      }
    } catch (err) {
      // Fallback below
    }
  }

  if (cachedUser) {
    return { success: true, user: cachedUser };
  }

  return { success: false, user: null };
}
