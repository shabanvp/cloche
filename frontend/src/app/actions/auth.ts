"use server";

import { cookies } from "next/headers";
import { verifyJwtToken, hashPassword, verifyPassword, signJwtToken, hashSessionToken, AUTH_COOKIE_NAME, SESSION_EXPIRY_DAYS } from "@/lib/auth";
import { getSupabaseConfig, signInWithSupabaseAuth } from "@/lib/supabase";
import { prisma } from "@/lib/database";
import type { UserRole, Role } from "@prisma/client";
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
    // 1. Primary Authentication: Check custom database users table first via Prisma
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        userRoles: {
          include: {
            role: true
          }
        }
      }
    });

    if (user) {
      if (user.passwordHash && verifyPassword(password, user.passwordHash)) {
        let userRoles: string[] = [role];
        if (user.userRoles && user.userRoles.length > 0) {
          const rolesList = user.userRoles.map((ur: UserRole & { role: Role | null }) => ur.role?.name).filter((name): name is string => typeof name === "string");
          if (rolesList.length > 0) userRoles = rolesList;
        }

        const displayName = user.fullName || user.name || email.split("@")[0];
        const token = signJwtToken({
          userId: user.id,
          email: user.email,
          fullName: displayName,
          roles: userRoles,
        });

        // Create a Session row in the PostgreSQL database!
        const tokenHash = hashSessionToken(token);
        const expiresAt = new Date(Date.now() + SESSION_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
        await prisma.session.create({
          data: {
            userId: user.id,
            tokenHash,
            userAgent: "Next.js Server Action (Login)",
            ipAddress: "127.0.0.1",
            expiresAt,
          }
        }).catch((err) => {
          console.error("[LOGIN:SESSION_CREATE_ERROR]", err);
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
        cookieStore.set("user_role", userRoles.includes("vendor") ? "vendor" : role, { path: "/", maxAge: SESSION_EXPIRY_DAYS * 24 * 60 * 60 });
        cookieStore.set("user_data", JSON.stringify(userObj), { path: "/", maxAge: SESSION_EXPIRY_DAYS * 24 * 60 * 60 });

        return { success: true, user: userObj };
      } else if (user.passwordHash) {
        return { error: "Invalid email or password." };
      }
    }

    // 2. Supabase GoTrue Auth Fallback (left for backward compatibility if user is not in postgres yet)
    const authResult = await signInWithSupabaseAuth(email, password);
    if (!authResult.error && authResult.user) {
      const authUser = authResult.user;
      let userRoles: string[] = [role];
      let displayName = authUser.user_metadata?.full_name || email.split("@")[0];
      let customUserId = authUser.id;

      const token = authResult.session?.access_token || authUser.id;
      const cookieStore = await cookies();
      const userObj = { id: customUserId, email: authUser.email, full_name: displayName, name: displayName, fullName: displayName, roles: userRoles };

      cookieStore.set(AUTH_COOKIE_NAME, token, { httpOnly: true, path: "/", maxAge: SESSION_EXPIRY_DAYS * 24 * 60 * 60 });
      cookieStore.set("auth_token", token, { path: "/", maxAge: SESSION_EXPIRY_DAYS * 24 * 60 * 60 });
      cookieStore.set("user_role", role, { path: "/", maxAge: SESSION_EXPIRY_DAYS * 24 * 60 * 60 });
      cookieStore.set("user_data", JSON.stringify(userObj), { path: "/", maxAge: SESSION_EXPIRY_DAYS * 24 * 60 * 60 });

      return { success: true, user: userObj };
    }

    // 3. Fallback to Render API endpoint
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

    if (data.token) {
      fallbackCookieStore.set("auth_token", data.token, { path: "/", maxAge: 7 * 24 * 60 * 60 });
      fallbackCookieStore.set(AUTH_COOKIE_NAME, data.token, { path: "/", maxAge: 7 * 24 * 60 * 60 });
    }
    fallbackCookieStore.set("user_role", role, { path: "/", maxAge: 7 * 24 * 60 * 60 });
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

    // 1. Insert into PostgreSQL database via Prisma
    const passwordHash = hashPassword(password);
    
    // Find or create role first
    let dbRole = await prisma.role.findUnique({
      where: { name: role }
    });
    if (!dbRole) {
      dbRole = await prisma.role.create({
        data: { name: role, description: `${role} role` }
      });
    }

    const newUser = await prisma.user.create({
      data: {
        email,
        passwordHash,
        fullName: name,
        name: name,
        phone: phone || null,
        isActive: true,
        isVerified: false,
        userRoles: {
          create: {
            roleId: dbRole.id
          }
        }
      }
    });

    const token = signJwtToken({
      userId: newUser.id,
      email: newUser.email,
      fullName: name,
      roles: [role],
    });

    // Create session in PostgreSQL
    const tokenHash = hashSessionToken(token);
    const expiresAt = new Date(Date.now() + SESSION_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
    await prisma.session.create({
      data: {
        userId: newUser.id,
        tokenHash,
        userAgent: "Next.js Server Action (Signup)",
        ipAddress: "127.0.0.1",
        expiresAt,
      }
    }).catch((err) => {
      console.error("[SIGNUP:SESSION_CREATE_ERROR]", err);
    });

    const cookieStore = await cookies();
    const userObj = { id: newUser.id, email: newUser.email, full_name: name, name: name, fullName: name, roles: [role] };
    
    cookieStore.set(AUTH_COOKIE_NAME, token, { httpOnly: true, path: "/", maxAge: SESSION_EXPIRY_DAYS * 24 * 60 * 60 });
    cookieStore.set("auth_token", token, { path: "/", maxAge: SESSION_EXPIRY_DAYS * 24 * 60 * 60 });
    cookieStore.set("user_role", role, { path: "/", maxAge: SESSION_EXPIRY_DAYS * 24 * 60 * 60 });
    cookieStore.set("user_data", JSON.stringify(userObj), { path: "/", maxAge: SESSION_EXPIRY_DAYS * 24 * 60 * 60 });

    return { success: true, user: userObj, token };
  } catch (error: any) {
    console.error("[SIGNUP_ERROR]", error);
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

  // 3. Query PostgreSQL database directly by email or userId to fetch fresh name via Prisma
  if (email || userId) {
    const user = await prisma.user.findFirst({
      where: userId ? { id: userId } : { email: email! },
      select: {
        id: true,
        email: true,
        fullName: true,
        name: true
      }
    }).catch(() => null);

    if (user) {
      const dbName = user.fullName || user.name || (user.email ? user.email.split("@")[0] : "User");
      return {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          full_name: dbName,
          name: dbName,
          fullName: dbName,
        },
      };
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
