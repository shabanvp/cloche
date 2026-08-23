"use server";

import { cookies } from "next/headers";
import { verifyJwtToken, hashPassword, verifyPassword, signJwtToken, hashSessionToken, AUTH_COOKIE_NAME, SESSION_EXPIRY_DAYS } from "@/lib/auth";
import { getSupabaseConfig, signInWithSupabaseAuth } from "@/lib/supabase";

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
    const { url, anonKey, serviceKey } = getSupabaseConfig();
    const apiKey = serviceKey || anonKey;
    
    // 1. Primary Authentication: Check custom database users table first
    if (url && apiKey) {
      const userRes = await fetch(
        `${url}/rest/v1/users?email=eq.${encodeURIComponent(email)}&select=id,email,password_hash,full_name,name,is_active,user_roles(roles(name))`,
        {
          headers: { apikey: apiKey, Authorization: `Bearer ${apiKey}` },
          cache: "no-store",
        }
      ).catch(() => null);

      if (userRes && userRes.ok) {
        const users = await userRes.json();
        if (Array.isArray(users) && users.length > 0) {
          const user = users[0];

          if (user.password_hash && verifyPassword(password, user.password_hash)) {
            let userRoles: string[] = [role];
            if (Array.isArray(user.user_roles) && user.user_roles.length > 0) {
              const rolesList = user.user_roles.map((ur: any) => ur.roles?.name).filter(Boolean);
              if (rolesList.length > 0) userRoles = rolesList;
            }

            const displayName = user.full_name || user.name || email.split("@")[0];
            const token = signJwtToken({
              userId: user.id,
              email: user.email,
              fullName: displayName,
              roles: userRoles,
            });

            const cookieStore = await cookies();
            const userObj = {
              id: user.id,
              email: user.email,
              full_name: displayName,
              name: displayName,
              fullName: displayName,
              roles: userRoles,
            };

            cookieStore.set(AUTH_COOKIE_NAME, token, { httpOnly: true, path: "/", maxAge: SESSION_EXPIRY_DAYS * 24 * 60 * 60 });
            cookieStore.set("auth_token", token, { path: "/", maxAge: SESSION_EXPIRY_DAYS * 24 * 60 * 60 });
            cookieStore.set("user_role", userRoles.includes("vendor") ? "vendor" : (role === "customer" ? "user" : role), { path: "/", maxAge: SESSION_EXPIRY_DAYS * 24 * 60 * 60 });
            cookieStore.set("user_data", JSON.stringify(userObj), { path: "/", maxAge: SESSION_EXPIRY_DAYS * 24 * 60 * 60 });

            return { success: true, user: userObj };
          } else if (user.password_hash) {
            return { error: "Invalid email or password." };
          }
        }
      }
    }

    // 2. Supabase GoTrue Auth Fallback
    const authResult = await signInWithSupabaseAuth(email, password);
    if (!authResult.error && authResult.user) {
      const authUser = authResult.user;
      let userRoles: string[] = [role];
      let displayName = authUser.user_metadata?.full_name || email.split("@")[0];
      let customUserId = authUser.id;

      const token = authResult.session?.access_token || authUser.id;
      const cookieStore = await cookies();
      const normalizedRole = role === "customer" ? "user" : role;
      const userObj = { id: customUserId, email: authUser.email, full_name: displayName, name: displayName, fullName: displayName, roles: [normalizedRole] };

      cookieStore.set(AUTH_COOKIE_NAME, token, { httpOnly: true, path: "/", maxAge: SESSION_EXPIRY_DAYS * 24 * 60 * 60 });
      cookieStore.set("auth_token", token, { path: "/", maxAge: SESSION_EXPIRY_DAYS * 24 * 60 * 60 });
      cookieStore.set("user_role", normalizedRole, { path: "/", maxAge: SESSION_EXPIRY_DAYS * 24 * 60 * 60 });
      cookieStore.set("user_data", JSON.stringify(userObj), { path: "/", maxAge: SESSION_EXPIRY_DAYS * 24 * 60 * 60 });

      return { success: true, user: userObj };
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

    const fallbackCookieStore = await cookies();
    const fetchedUser = data.user || data.data?.user || { email };
    if (!fetchedUser.full_name && !fetchedUser.name) {
      fetchedUser.name = email.split("@")[0];
      fetchedUser.full_name = email.split("@")[0];
    }

    const normalizedRole = role === "customer" ? "user" : role;
    if (data.token) {
      fallbackCookieStore.set("auth_token", data.token, { path: "/", maxAge: 7 * 24 * 60 * 60 });
      fallbackCookieStore.set(AUTH_COOKIE_NAME, data.token, { path: "/", maxAge: 7 * 24 * 60 * 60 });
    }
    fallbackCookieStore.set("user_role", normalizedRole, { path: "/", maxAge: 7 * 24 * 60 * 60 });
    fallbackCookieStore.set("user_data", JSON.stringify(fetchedUser), { path: "/", maxAge: 7 * 24 * 60 * 60 });

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

    const { url, anonKey, serviceKey } = getSupabaseConfig();

    // 1. Insert into Supabase database if configured
    if (url && (serviceKey || anonKey)) {
      const apiKey = serviceKey || anonKey;
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
          apikey: apiKey,
          Authorization: `Bearer ${apiKey}`,
          Prefer: "return=representation",
        },
        body: JSON.stringify(userPayload),
      }).catch(() => null);

      if (insertRes && insertRes.ok) {
        const inserted = await insertRes.json();
        if (Array.isArray(inserted) && inserted.length > 0) {
          const newUser = inserted[0];
          
          // Role lookup & insertion
          let roleId: string | null = null;
          const roleRes = await fetch(`${url}/rest/v1/roles?name=eq.${encodeURIComponent(role)}&select=id`, {
            headers: { apikey: apiKey, Authorization: `Bearer ${apiKey}` },
          }).catch(() => null);
          if (roleRes && roleRes.ok) {
            const roles = await roleRes.json();
            if (Array.isArray(roles) && roles.length > 0) roleId = roles[0].id;
          }
          if (!roleId) {
            const customerRoleRes = await fetch(`${url}/rest/v1/roles?name=eq.customer&select=id`, {
              headers: { apikey: apiKey, Authorization: `Bearer ${apiKey}` },
            }).catch(() => null);
            if (customerRoleRes && customerRoleRes.ok) {
              const customerRoles = await customerRoleRes.json();
              if (Array.isArray(customerRoles) && customerRoles.length > 0) roleId = customerRoles[0].id;
            }
          }
          if (!roleId) {
            const newRoleRes = await fetch(`${url}/rest/v1/roles`, {
              method: "POST",
              headers: { "Content-Type": "application/json", apikey: apiKey, Authorization: `Bearer ${apiKey}`, Prefer: "return=representation" },
              body: JSON.stringify({ name: role, description: `${role} role` }),
            }).catch(() => null);
            if (newRoleRes && newRoleRes.ok) {
              const newRoles = await newRoleRes.json();
              if (Array.isArray(newRoles) && newRoles.length > 0) roleId = newRoles[0].id;
            }
          }

          if (roleId) {
            await fetch(`${url}/rest/v1/user_roles`, {
              method: "POST",
              headers: { "Content-Type": "application/json", apikey: apiKey, Authorization: `Bearer ${apiKey}` },
              body: JSON.stringify({ user_id: newUser.id, role_id: roleId }),
            }).catch(() => null);
          }

          const token = signJwtToken({
            userId: newUser.id,
            email: newUser.email,
            fullName: name,
            roles: [role],
          });

          // Session creation
          const tokenHash = hashSessionToken(token);
          const expiresAt = new Date(Date.now() + SESSION_EXPIRY_DAYS * 24 * 60 * 60 * 1000).toISOString();
          await fetch(`${url}/rest/v1/sessions`, {
            method: "POST",
            headers: { "Content-Type": "application/json", apikey: apiKey, Authorization: `Bearer ${apiKey}` },
            body: JSON.stringify({
              user_id: newUser.id,
              token_hash: tokenHash,
              user_agent: "Next.js Server Action",
              ip_address: "127.0.0.1",
              expires_at: expiresAt,
            }),
          }).catch(() => null);

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
