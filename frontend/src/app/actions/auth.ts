"use server";

import { cookies } from "next/headers";
import { verifyJwtToken, hashPassword, verifyPassword, signJwtToken, hashSessionToken, AUTH_COOKIE_NAME, SESSION_EXPIRY_DAYS } from "@/lib/auth";
import { getSupabaseConfig, signInWithSupabaseAuth, signUpWithSupabaseAuth } from "@/lib/supabase";

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
  const requestedRole = ((formData.get("role") as string) || "customer").toLowerCase();

  console.log(`[AUTH:LOGIN_ATTEMPT] email="${email}" requestedRole="${requestedRole}" timestamp=${new Date().toISOString()}`);

  if (!email || !password) {
    return { success: false, error: "Email and password are required." };
  }

  try {
    const { url, anonKey, serviceKey } = getSupabaseConfig();
    const apiKey = serviceKey || anonKey;
    
    let user: any = null;
    let authResult: any = null;
    let userRoles: string[] = [];
    let isVendorAccount = false;
    let vendorRecord: any = null;

    // 1. Primary Authentication: Query custom database users table
    if (url && apiKey) {
      const userRes = await fetch(
        `${url}/rest/v1/users?email=eq.${encodeURIComponent(email)}&select=id,email,password_hash,full_name,name,phone,city,wedding_date,is_active,is_verified,vendors(id,business_name,publication_status),user_roles(roles(name))`,
        {
          headers: { apikey: apiKey, Authorization: `Bearer ${apiKey}` },
          cache: "no-store",
        }
      ).catch((err) => {
        console.error("[AUTH:DB_ERROR] Failed to query users table:", err);
        return null;
      });

      if (userRes && userRes.ok) {
        const users = await userRes.json();
        if (Array.isArray(users) && users.length > 0) {
          user = users[0];
          console.log(`[AUTH:USER_FOUND] user_id=${user.id} email=${user.email} is_active=${user.is_active} is_verified=${user.is_verified}`);
        }
      }
    }

    // 2. Parallel check against Supabase GoTrue Auth
    authResult = await signInWithSupabaseAuth(email, password);

    // Evaluate Password Authenticity across DB hash & Supabase Auth
    let isPasswordValid = false;
    if (user?.password_hash && verifyPassword(password, user.password_hash)) {
      isPasswordValid = true;
      console.log(`[AUTH:PASS_VERIFY] Password verified via public.users hash match.`);

      // If Supabase Auth failed (out of sync), sync Supabase Auth user password
      if (authResult.error && url && (serviceKey || apiKey) && user.id) {
        console.log(`[AUTH:SYNC] Syncing Supabase Auth user password for id=${user.id}`);
        await fetch(`${url}/auth/v1/admin/users/${user.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            apikey: serviceKey || apiKey,
            Authorization: `Bearer ${serviceKey || apiKey}`,
          },
          body: JSON.stringify({ password: password, email_confirm: true }),
        }).catch(() => null);
      }
    } else if (!authResult.error && authResult.user) {
      isPasswordValid = true;
      console.log(`[AUTH:PASS_VERIFY] Password verified via Supabase Auth.`);

      // If public.users password_hash was out of sync or missing, update it
      if (url && apiKey) {
        const syncHash = hashPassword(password);
        console.log(`[AUTH:SYNC] Syncing public.users password_hash for email=${email}`);
        await fetch(`${url}/rest/v1/users?email=eq.${encodeURIComponent(email)}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            apikey: apiKey,
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({ password_hash: syncHash, is_active: true, is_verified: true }),
        }).catch(() => null);
      }
    }

    // SCENARIO 1: User exists nowhere
    if (!user && (authResult.error || !authResult.user)) {
      console.warn(`[AUTH:FAIL] email=${email} reason=USER_NOT_FOUND`);
      return { success: false, error: "No account found with this email address. Please sign up first." };
    }

    // SCENARIO 2: User exists but password is incorrect
    if (!isPasswordValid) {
      console.warn(`[AUTH:FAIL] email=${email} reason=INCORRECT_PASSWORD`);
      return { success: false, error: "Incorrect password. Please check your password and try again." };
    }

    // If user record wasn't found in DB originally but Supabase Auth succeeded, attempt refetch
    if (!user && url && apiKey) {
      const reFetchRes = await fetch(
        `${url}/rest/v1/users?email=eq.${encodeURIComponent(email)}&select=id,email,password_hash,full_name,name,phone,city,wedding_date,is_active,is_verified,vendors(id,business_name,publication_status),user_roles(roles(name))`,
        { headers: { apikey: apiKey, Authorization: `Bearer ${apiKey}` }, cache: "no-store" }
      ).catch(() => null);
      if (reFetchRes && reFetchRes.ok) {
        const rows = await reFetchRes.json();
        if (Array.isArray(rows) && rows.length > 0) user = rows[0];
      }
    }

    const userId = user?.id || authResult?.user?.id;
    const userEmail = user?.email || email;
    const displayName = user?.full_name || user?.name || authResult?.user?.user_metadata?.full_name || email.split("@")[0];

    // SCENARIO 3: Account is inactive/disabled
    if (user && user.is_active === false) {
      console.warn(`[AUTH:FAIL] userId=${userId} email=${userEmail} reason=ACCOUNT_DISABLED`);
      return { success: false, error: "Your account has been deactivated. Please contact customer support." };
    }

    // Resolve Roles and Vendor Profile
    if (user) {
      if (Array.isArray(user.user_roles) && user.user_roles.length > 0) {
        userRoles = user.user_roles.map((ur: any) => ur.roles?.name).filter(Boolean);
      }
      if (Array.isArray(user.vendors) && user.vendors.length > 0) {
        isVendorAccount = true;
        vendorRecord = user.vendors[0];
        if (!userRoles.includes("vendor")) userRoles.push("vendor");
      }
    }

    if (userRoles.length === 0) {
      userRoles = [requestedRole === "vendor" || requestedRole === "partner" ? "vendor" : "customer"];
    }

    // Ensure all authenticated users have customer access
    if (!userRoles.includes("customer") && !userRoles.includes("user")) {
      userRoles.push("customer");
    }

    console.log(`[AUTH:ROLE_RESOLVED] userId=${userId} email=${userEmail} roles=[${userRoles.join(",")}] requestedRole="${requestedRole}"`);

    // SCENARIO 4: Role/Portal Authorization Checks
    if (requestedRole === "vendor" || requestedRole === "partner") {
      if (!userRoles.includes("vendor") && !isVendorAccount) {
        console.warn(`[AUTH:FAIL] userId=${userId} email=${userEmail} reason=ROLE_MISMATCH_NOT_VENDOR`);
        return {
          success: false,
          error: "This email is registered as a customer account. Please log in through the user portal or register as a vendor.",
        };
      }
      if (vendorRecord && vendorRecord.publication_status === "suspended") {
        console.warn(`[AUTH:FAIL] userId=${userId} email=${userEmail} reason=VENDOR_SUSPENDED`);
        return {
          success: false,
          error: "Your vendor account is suspended. Please contact support.",
        };
      }
    } else if (requestedRole === "admin") {
      if (!userRoles.includes("admin") && !userRoles.includes("super_admin")) {
        console.warn(`[AUTH:FAIL] userId=${userId} email=${userEmail} reason=ROLE_MISMATCH_NOT_ADMIN`);
        return {
          success: false,
          error: "Access denied. Admin authorization required.",
        };
      }
    }

    // SCENARIO 5: Successful Authentication & Session Cookie Creation
    const activeRole = (requestedRole === "vendor" || requestedRole === "partner")
      ? "vendor"
      : (requestedRole === "admin" ? "admin" : "user");

    const token = signJwtToken({
      userId,
      email: userEmail,
      fullName: displayName,
      roles: userRoles,
    });

    const cookieStore = await cookies();
    const userObj = {
      id: userId,
      email: userEmail,
      full_name: displayName,
      name: displayName,
      fullName: displayName,
      phone: user?.phone || "",
      city: user?.city || "",
      wedding_date: user?.wedding_date || "",
      weddingDate: user?.wedding_date || "",
      roles: userRoles,
      role: activeRole,
    };

    // Clean up stale cookies & write fresh session cookies
    cookieStore.set(AUTH_COOKIE_NAME, token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: SESSION_EXPIRY_DAYS * 24 * 60 * 60 });
    cookieStore.set("auth_token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: SESSION_EXPIRY_DAYS * 24 * 60 * 60 });
    cookieStore.set("user_role", activeRole, { httpOnly: false, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: SESSION_EXPIRY_DAYS * 24 * 60 * 60 });
    cookieStore.set("user_data", encodeURIComponent(JSON.stringify(userObj)), { httpOnly: false, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: SESSION_EXPIRY_DAYS * 24 * 60 * 60 });

    console.log(`[AUTH:SUCCESS] userId=${userId} email=${userEmail} activeRole=${activeRole}`);
    return { success: true, user: userObj, token };
  } catch (error: any) {
    console.error("[AUTH:CRITICAL_ERROR]", error);
    return { success: false, error: "An unexpected server error occurred during login. Please try again." };
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
    const apiKey = serviceKey || anonKey;

    // Check if user already exists
    if (url && apiKey) {
      const checkRes = await fetch(`${url}/rest/v1/users?email=eq.${encodeURIComponent(email)}&select=id`, {
        headers: { apikey: apiKey, Authorization: `Bearer ${apiKey}` },
      });
      if (checkRes.ok) {
        const existing = await checkRes.json();
        if (Array.isArray(existing) && existing.length > 0) {
          return { success: false, error: "An account with this email address already exists. Please log in instead." };
        }
      }
    }

    if (url && apiKey) {
      const passwordHash = hashPassword(password);

      let authUserId: string | null = null;
      const authAdminRes = await fetch(`${url}/auth/v1/admin/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: apiKey,
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          email,
          password,
          email_confirm: true,
          user_metadata: { full_name: name, role },
        }),
      }).catch(() => null);

      if (authAdminRes && authAdminRes.ok) {
        const authData = await authAdminRes.json().catch(() => null);
        if (authData?.id) authUserId = authData.id;
      }
      if (!authUserId) {
        const authResult = await signUpWithSupabaseAuth(email, password, { full_name: name, role });
        if (authResult.user?.id) authUserId = authResult.user.id;
      }

      const userPayload: any = {
        email,
        password_hash: passwordHash,
        full_name: name,
        name: name,
        phone: phone || null,
        is_active: true,
        is_verified: true,
      };

      if (authUserId) {
        userPayload.id = authUserId;
      }

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
          
          let roleId: string | null = null;
          const roleRes = await fetch(`${url}/rest/v1/roles?name=eq.${encodeURIComponent(role)}&select=id`, {
            headers: { apikey: apiKey, Authorization: `Bearer ${apiKey}` },
          }).catch(() => null);
          if (roleRes && roleRes.ok) {
            const roles = await roleRes.json();
            if (Array.isArray(roles) && roles.length > 0) roleId = roles[0].id;
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

          const cookieStore = await cookies();
          const userObj = { id: newUser.id, email: newUser.email, full_name: name, name: name, fullName: name, phone: phone || newUser.phone || "", roles: [role] };
          
          cookieStore.set(AUTH_COOKIE_NAME, token, { httpOnly: true, path: "/", maxAge: SESSION_EXPIRY_DAYS * 24 * 60 * 60 });
          cookieStore.set("auth_token", token, { path: "/", maxAge: SESSION_EXPIRY_DAYS * 24 * 60 * 60 });
          cookieStore.set("user_role", role, { path: "/", maxAge: SESSION_EXPIRY_DAYS * 24 * 60 * 60 });
          cookieStore.set("user_data", encodeURIComponent(JSON.stringify(userObj)), { path: "/", maxAge: SESSION_EXPIRY_DAYS * 24 * 60 * 60 });

          return { success: true, user: userObj, token };
        }
      }
    }

    return { success: false, error: "Failed to create account. Please try again." };
  } catch (error: any) {
    return { success: false, error: "An unexpected error occurred during signup." };
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

  if (userDataCookie) {
    try {
      const decodedCookie = decodeURIComponent(userDataCookie);
      const parsed = JSON.parse(decodedCookie);
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

  const { url, anonKey } = getSupabaseConfig();
  if (url && anonKey && (email || userId)) {
    const filter = userId ? `id=eq.${encodeURIComponent(userId)}` : `email=eq.${encodeURIComponent(email!)}`;
    const dbRes = await fetch(`${url}/rest/v1/users?${filter}&select=id,email,full_name,name,phone`, {
      headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` },
      cache: "no-store",
    }).catch(() => null);

    if (dbRes && dbRes.ok) {
      const rows = await dbRes.json();
      if (Array.isArray(rows) && rows.length > 0) {
        const u = rows[0];
        const dbName = u.full_name || u.name || (u.email ? u.email.split("@")[0] : "User");

        let userCity = "";
        let userWeddingDate = "";
        try {
          const prefRes = await fetch(`${url}/rest/v1/user_preferences?user_id=eq.${encodeURIComponent(u.id)}&select=preferred_city,wedding_date`, {
            headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` },
            cache: "no-store",
          });
          if (prefRes.ok) {
            const prefRows = await prefRes.json();
            if (Array.isArray(prefRows) && prefRows.length > 0) {
              userCity = prefRows[0].preferred_city || "";
              userWeddingDate = prefRows[0].wedding_date || "";
            }
          }
        } catch (e) {}

        return {
          success: true,
          user: {
            id: u.id,
            email: u.email,
            full_name: dbName,
            name: dbName,
            fullName: dbName,
            phone: u.phone || "",
            city: userCity,
            wedding_date: userWeddingDate,
            weddingDate: userWeddingDate,
          },
        };
      }
    }
  }

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

export async function resetPasswordAction(email: string, newPassword?: string) {
  const cleanEmail = email.trim().toLowerCase();
  const { url, serviceKey, anonKey } = getSupabaseConfig();
  const apiKey = serviceKey || anonKey;

  if (!cleanEmail) {
    return { success: false, error: "Email address is required." };
  }

  if (!url || !apiKey) {
    return { success: false, error: "Authentication service unconfigured." };
  }

  try {
    const passwordToSet = newPassword || "ClochePass2026!";
    const newHash = hashPassword(passwordToSet);

    await fetch(`${url}/rest/v1/users?email=eq.${encodeURIComponent(cleanEmail)}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        apikey: apiKey,
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ password_hash: newHash, is_active: true, is_verified: true }),
    }).catch(() => null);

    const authLookupRes = await fetch(`${url}/auth/v1/admin/users`, {
      headers: { apikey: apiKey, Authorization: `Bearer ${apiKey}` },
    }).catch(() => null);

    if (authLookupRes && authLookupRes.ok) {
      const authData = await authLookupRes.json().catch(() => null);
      const usersList = authData.users || authData || [];
      const matched = usersList.find((u: any) => (u.email || "").toLowerCase() === cleanEmail);

      if (matched?.id) {
        await fetch(`${url}/auth/v1/admin/users/${matched.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            apikey: apiKey,
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({ password: passwordToSet, email_confirm: true }),
        }).catch(() => null);
      }
    }

    return { success: true, message: `Password reset instructions and temp password set for ${cleanEmail}.` };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to reset password." };
  }
}
