"use server";

import { cookies } from "next/headers";
import { verifyJwtToken, hashPassword, verifyPassword, signJwtToken, AUTH_COOKIE_NAME, SESSION_EXPIRY_DAYS } from "@/lib/auth";
import { getSupabaseConfig } from "@/lib/supabase";

const rawBaseUrl = process.env.NEXT_PUBLIC_API_URL || "https://cloche-backend.onrender.com";
const API_BASE_URL = rawBaseUrl.endsWith('/api') ? rawBaseUrl : `${rawBaseUrl}/api`;

function decodeJwtUnsafe(token: string): any {
  try {
    const parts = token.split('.');
    if (parts.length >= 2) {
      const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const jsonStr = Buffer.from(base64, 'base64').toString('utf8');
      return JSON.parse(jsonStr);
    }
  } catch (e) {}
  return null;
}

export async function login(formData: FormData) {
  const email = (formData.get("email") as string || "").trim().toLowerCase();
  const password = formData.get("password") as string;
  const role = (formData.get("role") as string) || "customer";

  try {
    const { url, anonKey } = getSupabaseConfig();
    
    // 1. Authenticate against Supabase DB
    if (url && anonKey) {
      const userRes = await fetch(
        `${url}/rest/v1/users?email=eq.${encodeURIComponent(email)}&select=id,email,password_hash,full_name,name,is_active,user_roles(roles(name))`,
        {
          headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` },
          cache: "no-store",
        }
      ).catch(() => null);

      if (userRes && userRes.ok) {
        const users = await userRes.json();
        if (Array.isArray(users) && users.length > 0) {
          const user = users[0];
          if (user.password_hash && verifyPassword(password, user.password_hash)) {
            const displayName = user.full_name || user.name || email.split("@")[0];
            let userRoles: string[] = [role];
            if (Array.isArray(user.user_roles) && user.user_roles.length > 0) {
              userRoles = user.user_roles.map((ur: any) => ur.roles?.name).filter(Boolean);
            }

            const token = signJwtToken({
              userId: user.id,
              email: user.email,
              fullName: displayName,
              roles: userRoles.length > 0 ? userRoles : [role],
            });

            const cookieStore = await cookies();
            const userObj = { id: user.id, email: user.email, full_name: displayName, name: displayName, fullName: displayName, roles: userRoles };
            
            cookieStore.set(AUTH_COOKIE_NAME, token, { httpOnly: true, path: "/", maxAge: SESSION_EXPIRY_DAYS * 24 * 60 * 60 });
            cookieStore.set("auth_token", token, { path: "/", maxAge: SESSION_EXPIRY_DAYS * 24 * 60 * 60 });
            cookieStore.set("user_role", role, { path: "/", maxAge: SESSION_EXPIRY_DAYS * 24 * 60 * 60 });
            cookieStore.set("user_data", JSON.stringify(userObj), { path: "/", maxAge: SESSION_EXPIRY_DAYS * 24 * 60 * 60 });

            return { success: true, user: userObj };
          }
        }
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
      return { error: data.message || "Invalid email or password" };
    }

    const cookieStore = await cookies();
    const fetchedUser = data.user || data.data?.user || { email };
    if (!fetchedUser.full_name && !fetchedUser.name) {
      fetchedUser.name = email.split("@")[0];
      fetchedUser.full_name = email.split("@")[0];
    }

    if (data.token) {
      cookieStore.set("auth_token", data.token, { path: "/", maxAge: 7 * 24 * 60 * 60 });
      cookieStore.set(AUTH_COOKIE_NAME, data.token, { path: "/", maxAge: 7 * 24 * 60 * 60 });
    }
    cookieStore.set("user_role", role, { path: "/", maxAge: 7 * 24 * 60 * 60 });
    cookieStore.set("user_data", JSON.stringify(fetchedUser), { path: "/", maxAge: 7 * 24 * 60 * 60 });

    return { success: true, user: fetchedUser };
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

    const { url, anonKey } = getSupabaseConfig();

    // 1. Insert directly into Supabase database if configured
    if (url && anonKey) {
      const passwordHash = hashPassword(password);
      const userPayload = {
        email,
        password_hash: passwordHash,
        full_name: name,
        name: name,
        phone: phone || null,
        is_active: true,
        is_verified: false,
      };

      const insertRes = await fetch(`${url}/rest/v1/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: anonKey,
          Authorization: `Bearer ${anonKey}`,
          Prefer: "return=representation",
        },
        body: JSON.stringify(userPayload),
      }).catch(() => null);

      if (insertRes && insertRes.ok) {
        const inserted = await insertRes.json();
        if (Array.isArray(inserted) && inserted.length > 0) {
          const newUser = inserted[0];
          const token = signJwtToken({
            userId: newUser.id,
            email: newUser.email,
            fullName: name,
            roles: [role],
          });

          const cookieStore = await cookies();
          const userObj = { id: newUser.id, email: newUser.email, full_name: name, name: name, fullName: name, roles: [role] };
          
          cookieStore.set(AUTH_COOKIE_NAME, token, { httpOnly: true, path: "/", maxAge: SESSION_EXPIRY_DAYS * 24 * 60 * 60 });
          cookieStore.set("auth_token", token, { path: "/", maxAge: SESSION_EXPIRY_DAYS * 24 * 60 * 60 });
          cookieStore.set("user_role", role, { path: "/", maxAge: SESSION_EXPIRY_DAYS * 24 * 60 * 60 });
          cookieStore.set("user_data", JSON.stringify(userObj), { path: "/", maxAge: SESSION_EXPIRY_DAYS * 24 * 60 * 60 });

          return { success: true, user: userObj, token };
        }
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

    const cookieStore = await cookies();
    const newUserObj = data.user || data.data?.user || { full_name: name, name: name, fullName: name, email, role };
    if (data.token) {
      cookieStore.set("auth_token", data.token, { path: "/", maxAge: 30 * 24 * 60 * 60 });
      cookieStore.set(AUTH_COOKIE_NAME, data.token, { path: "/", maxAge: 30 * 24 * 60 * 60 });
    }
    cookieStore.set("user_data", JSON.stringify(newUserObj), { path: "/", maxAge: 30 * 24 * 60 * 60 });
    cookieStore.set("user_role", role, { path: "/", maxAge: 30 * 24 * 60 * 60 });

    return { success: true, user: newUserObj, ...data };
  } catch (error: any) {
    return { error: "An unexpected error occurred." };
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("auth_token");
  cookieStore.delete(AUTH_COOKIE_NAME);
  cookieStore.delete("user_role");
  cookieStore.delete("user_data");
  return { success: true };
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value || cookieStore.get("auth_token")?.value;
  const role = cookieStore.get("user_role")?.value;
  
  if (!token) return null;
  return { token, role };
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value || cookieStore.get("auth_token")?.value;
  const userDataCookie = cookieStore.get("user_data")?.value;

  let email: string | null = null;
  let userId: string | null = null;

  // 1. Try local verified JWT token
  if (token) {
    const verified = verifyJwtToken(token);
    if (verified && verified.fullName) {
      return {
        success: true,
        user: {
          id: verified.userId,
          email: verified.email,
          full_name: verified.fullName,
          name: verified.fullName,
          fullName: verified.fullName,
          roles: verified.roles,
        },
      };
    }

    const unverified = decodeJwtUnsafe(token);
    if (unverified) {
      email = unverified.email || unverified.sub;
      userId = unverified.userId || unverified.id || unverified.sub;
      if (unverified.fullName || unverified.name || unverified.full_name) {
        const nameVal = unverified.fullName || unverified.name || unverified.full_name;
        return {
          success: true,
          user: {
            id: userId,
            email,
            full_name: nameVal,
            name: nameVal,
            fullName: nameVal,
          },
        };
      }
    }
  }

  // 2. Try parsing user_data cookie
  if (userDataCookie) {
    try {
      const parsed = JSON.parse(userDataCookie);
      const nameVal = parsed.full_name || parsed.fullName || parsed.name || parsed.owner_name;
      if (nameVal && typeof nameVal === "string" && nameVal.trim() && nameVal !== "User") {
        return {
          success: true,
          user: {
            ...parsed,
            full_name: nameVal.trim(),
            name: nameVal.trim(),
            fullName: nameVal.trim(),
          },
        };
      }
      if (parsed.email && parsed.email.includes("@")) {
        email = parsed.email;
      }
    } catch (e) {}
  }

  // 3. Query Supabase database directly by email or userId to fetch fresh name
  const { url, anonKey } = getSupabaseConfig();
  if (url && anonKey && (email || userId)) {
    const filter = userId ? `id=eq.${encodeURIComponent(userId)}` : `email=eq.${encodeURIComponent(email!)}`;
    const dbRes = await fetch(`${url}/rest/v1/users?${filter}&select=id,email,full_name,name`, {
      headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` },
      cache: "no-store",
    }).catch(() => null);

    if (dbRes && dbRes.ok) {
      const rows = await dbRes.json();
      if (Array.isArray(rows) && rows.length > 0) {
        const u = rows[0];
        const dbName = u.full_name || u.name || (u.email ? u.email.split("@")[0] : "User");
        return {
          success: true,
          user: {
            id: u.id,
            email: u.email,
            full_name: dbName,
            name: dbName,
            fullName: dbName,
          },
        };
      }
    }
  }

  // 4. Email fallback
  if (email && email.includes("@")) {
    const emailName = email.split("@")[0];
    const formatted = emailName.charAt(0).toUpperCase() + emailName.slice(1);
    return {
      success: true,
      user: {
        email,
        full_name: formatted,
        name: formatted,
        fullName: formatted,
      },
    };
  }

  return { success: false, user: null };
}
