import { NextResponse } from "next/server";
import { getSupabaseConfig, getSupabaseConfigError, signInWithSupabaseAuth } from "@/lib/supabase";
import { AUTH_COOKIE_NAME, SESSION_EXPIRY_DAYS, signJwtToken, verifyPassword, hashPassword } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, role } = body;
    const requestedRole = (role || "customer").toString().toLowerCase();

    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          statusCode: 400,
          error: { code: "VALIDATION_ERROR", message: "Email and password are required." },
        },
        { status: 400 }
      );
    }

    let cleanEmail = email.trim().toLowerCase();
    const { url, serviceKey } = getSupabaseConfig();
    const configError = getSupabaseConfigError({ anon: true, serviceRole: true });
    const apiKey = serviceKey;

    if (configError || !apiKey) {
      return NextResponse.json(
        { success: false, statusCode: 503, error: { code: "CONFIG_ERROR", message: configError || "Missing SUPABASE_SERVICE_ROLE_KEY." } },
        { status: 503 }
      );
    }

    let customUser: any = null;
    let authResult: any = null;
    let userRoles: string[] = [];
    let isVendorAccount = false;
    let vendorRecord: any = null;

    // Handle mobile number format vs email format
    const isEmail = cleanEmail.includes("@");
    if (!isEmail) {
      const digits = cleanEmail.replace(/\D/g, "").slice(-10);
      if (digits.length >= 10) {
        // Query users by phone
        const phoneRes = await fetch(
          `${url}/rest/v1/users?phone=ilike.%25${digits}%25&select=id,email,password_hash,full_name,name,phone,is_active,is_verified,vendors(id,status,publication_status),user_roles(roles(name))`,
          {
            headers: { apikey: apiKey, Authorization: `Bearer ${apiKey}` },
            cache: "no-store",
          }
        ).catch(() => null);
        if (phoneRes && phoneRes.ok) {
          const pUsers = await phoneRes.json();
          if (Array.isArray(pUsers) && pUsers.length > 0) {
            customUser = pUsers[0];
            cleanEmail = (customUser.email || "").toLowerCase();
          }
        }

        // Also check vendor_contacts by phone if user not found yet
        if (!customUser) {
          const vcRes = await fetch(
            `${url}/rest/v1/vendor_contacts?phone=ilike.%25${digits}%25&select=email,vendor_id&limit=1`,
            {
              headers: { apikey: apiKey, Authorization: `Bearer ${apiKey}` },
              cache: "no-store",
            }
          ).catch(() => null);
          if (vcRes && vcRes.ok) {
            const vcList = await vcRes.json();
            if (Array.isArray(vcList) && vcList.length > 0 && vcList[0]?.email) {
              cleanEmail = vcList[0].email.toLowerCase();
            }
          }
        }

        if (!customUser && !cleanEmail.includes("@")) {
          cleanEmail = `${digits}@partner.cloche.luxury`;
        }
      }
    }

    // 1. Query custom database users table by email (case-insensitive lookup)
    if (!customUser && cleanEmail.includes("@")) {
      let userRes = await fetch(
        `${url}/rest/v1/users?email=eq.${encodeURIComponent(cleanEmail)}&select=id,email,password_hash,full_name,name,phone,is_active,is_verified,vendors(id,status,publication_status),user_roles(roles(name))`,
        {
          headers: { apikey: apiKey, Authorization: `Bearer ${apiKey}` },
          cache: "no-store",
        }
      ).catch(() => null);

      if (!userRes || !userRes.ok) {
        userRes = await fetch(
          `${url}/rest/v1/users?email=ilike.${encodeURIComponent(cleanEmail)}&select=id,email,password_hash,full_name,name,phone,is_active,is_verified,vendors(id,status,publication_status),user_roles(roles(name))`,
          {
            headers: { apikey: apiKey, Authorization: `Bearer ${apiKey}` },
            cache: "no-store",
          }
        ).catch(() => null);
      }

      if (userRes && userRes.ok) {
        const users = await userRes.json();
        if (Array.isArray(users) && users.length > 0) {
          customUser = users[0];
        }
      }
    }

    // 2. Parallel check against Supabase GoTrue Auth
    authResult = await signInWithSupabaseAuth(cleanEmail, password);

    // System admin fallback configuration
    const SYSTEM_ADMIN_EMAIL = (process.env.ADMIN_EMAIL || "admin@cloche.com").trim().toLowerCase();
    const SYSTEM_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
    const rawAdminEmails = process.env.ADMIN_EMAILS ? process.env.ADMIN_EMAILS.split(",") : [];
    const ADMIN_EMAILS = [
      SYSTEM_ADMIN_EMAIL,
      (process.env.GMAIL_USER || "cloche.luxury@gmail.com").trim().toLowerCase(),
      ...rawAdminEmails.map((e) => e.trim().toLowerCase()),
    ].filter(Boolean);

    const isSystemAdminLogin = cleanEmail === SYSTEM_ADMIN_EMAIL && password === SYSTEM_ADMIN_PASSWORD;

    // Evaluate Password Authenticity
    let isPasswordValid = false;
    if (isSystemAdminLogin) {
      isPasswordValid = true;
      if (!customUser) {
        customUser = {
          id: "4c5fcac7-d7c1-4447-89d7-2b017c504847",
          email: SYSTEM_ADMIN_EMAIL,
          full_name: "Cloche Admin",
          name: "Cloche Admin",
          is_active: true,
          is_verified: true,
          vendors: [],
          user_roles: [{ roles: { name: "super_admin" } }, { roles: { name: "admin" } }],
        };
      }
    } else if (customUser?.password_hash && verifyPassword(password, customUser.password_hash)) {
      isPasswordValid = true;

      // Sync Supabase Auth user password if out of sync
      if (authResult.error && serviceKey && customUser.id) {
        await fetch(`${url}/auth/v1/admin/users/${customUser.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            apikey: serviceKey,
            Authorization: `Bearer ${serviceKey}`,
          },
          body: JSON.stringify({ password: password, email_confirm: true }),
        }).catch(() => null);

        // Retry Supabase Auth login to obtain valid session tokens
        const retryAuth = await signInWithSupabaseAuth(cleanEmail, password);
        if (!retryAuth.error && retryAuth.user) {
          authResult = retryAuth;
        }
      }
    } else if (!authResult.error && authResult.user) {
      isPasswordValid = true;

      // Sync public.users password_hash if out of sync
      const syncHash = hashPassword(password);
      await fetch(`${url}/rest/v1/users?email=eq.${encodeURIComponent(cleanEmail)}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          apikey: apiKey,
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({ password_hash: syncHash, is_active: true, is_verified: true }),
      }).catch(() => null);
    }

    // SCENARIO 1: Account Not Found
    if (!isSystemAdminLogin && !customUser && (authResult.error || !authResult.user)) {
      return NextResponse.json(
        { success: false, statusCode: 404, error: { code: "USER_NOT_FOUND", message: "No account found with this email address or mobile number. Please sign up first." } },
        { status: 404 }
      );
    }

    // SCENARIO 2: Password Mismatch
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, statusCode: 401, error: { code: "INVALID_CREDENTIALS", message: "Incorrect password. Please check your password and try again." } },
        { status: 401 }
      );
    }

    // Refetch user record if initially absent
    if (!customUser && cleanEmail.includes("@")) {
      const reFetchRes = await fetch(
        `${url}/rest/v1/users?email=ilike.${encodeURIComponent(cleanEmail)}&select=id,email,password_hash,full_name,name,phone,is_active,is_verified,vendors(id,status,publication_status),user_roles(roles(name))`,
        { headers: { apikey: apiKey, Authorization: `Bearer ${apiKey}` }, cache: "no-store" }
      ).catch(() => null);
      if (reFetchRes && reFetchRes.ok) {
        const rows = await reFetchRes.json();
        if (Array.isArray(rows) && rows.length > 0) customUser = rows[0];
      }
    }

    const userId = customUser?.id || authResult?.user?.id;
    const displayName = customUser?.full_name || customUser?.name || authResult?.user?.user_metadata?.full_name || cleanEmail.split("@")[0];

    // SCENARIO 3: Deactivated Account
    if (customUser && customUser.is_active === false) {
      return NextResponse.json(
        { success: false, statusCode: 403, error: { code: "ACCOUNT_DISABLED", message: "Your account has been deactivated. Please contact customer support." } },
        { status: 403 }
      );
    }

    // Resolve Roles from DB user_roles
    if (customUser && Array.isArray(customUser.user_roles)) {
      for (const ur of customUser.user_roles) {
        const roleName = ur?.roles?.name;
        if (roleName && !userRoles.includes(roleName)) {
          userRoles.push(roleName);
        }
      }
    }

    // Resolve Roles from Supabase Auth metadata
    if (authResult?.user?.user_metadata?.role) {
      const metaRole = authResult.user.user_metadata.role;
      if (!userRoles.includes(metaRole)) userRoles.push(metaRole);
    }

    // Role Resolution
    if (customUser) {
      if (Array.isArray(customUser.vendors) && customUser.vendors.length > 0) {
        isVendorAccount = true;
        vendorRecord = customUser.vendors[0];
        if (!userRoles.includes("vendor")) userRoles.push("vendor");
      }
    }

    // Designate Admin roles if configured in ADMIN_EMAILS or system admin
    if (isSystemAdminLogin || ADMIN_EMAILS.includes(cleanEmail)) {
      if (!userRoles.includes("super_admin")) userRoles.push("super_admin");
      if (!userRoles.includes("admin")) userRoles.push("admin");
    }

    // Query vendors table directly if not resolved via relation
    if (!vendorRecord && userId) {
      const vRes = await fetch(
        `${url}/rest/v1/vendors?user_id=eq.${encodeURIComponent(userId)}&deleted_at=is.null&select=id,vendor_code,status,publication_status,category_id,onboarding_stage,vendor_profiles(business_name,slug,city,state)&limit=1`,
        { headers: { apikey: apiKey, Authorization: `Bearer ${apiKey}` }, cache: "no-store" }
      ).catch(() => null);
      if (vRes && vRes.ok) {
        const vRows = await vRes.json();
        if (Array.isArray(vRows) && vRows.length > 0) {
          vendorRecord = vRows[0];
          isVendorAccount = true;
          if (!userRoles.includes("vendor")) userRoles.push("vendor");
        }
      }
    }

    // Reject customer accounts attempting to use the vendor portal.
    if ((requestedRole === "vendor" || requestedRole === "partner") && !userRoles.includes("vendor") && !isVendorAccount) {
      return NextResponse.json(
        { success: false, statusCode: 403, error: { code: "ROLE_MISMATCH", message: "This email is registered as a customer account. Please log in through the user portal or register as a vendor." } },
        { status: 403 }
      );
    }

    // Partner/Vendor portal specific role assignment
    if (requestedRole === "vendor" || requestedRole === "partner") {
      if (!userRoles.includes("vendor")) userRoles.push("vendor");
      isVendorAccount = true;

      if (vendorRecord && vendorRecord.publication_status === "suspended") {
        return NextResponse.json(
          { success: false, statusCode: 403, error: { code: "VENDOR_SUSPENDED", message: "Your vendor account is suspended. Please contact support." } },
          { status: 403 }
        );
      }
    } else if (requestedRole === "admin") {
      if (!userRoles.includes("admin") && !userRoles.includes("super_admin")) {
        return NextResponse.json(
          { success: false, statusCode: 403, error: { code: "UNAUTHORIZED_ROLE", message: "Access denied. Admin authorization required." } },
          { status: 403 }
        );
      }
    }

    if (userRoles.length === 0) {
      userRoles = [requestedRole === "vendor" || requestedRole === "partner" ? "vendor" : "customer"];
    }

    if (!userRoles.includes("customer") && !userRoles.includes("user")) {
      userRoles.push("customer");
    }

    // SCENARIO 5: Successful Response & Session Cookie Generation
    const isAdmin = userRoles.includes("admin") || userRoles.includes("super_admin");
    const primaryRole = (requestedRole === "vendor" || requestedRole === "partner")
      ? "vendor"
      : (requestedRole === "admin" || (isAdmin && requestedRole !== "customer") ? "admin" : "user");

    const jwtToken = signJwtToken({
      userId,
      email: cleanEmail,
      fullName: displayName,
      roles: userRoles,
    });

    const userObj = {
      id: userId,
      email: cleanEmail,
      fullName: displayName,
      name: displayName,
      full_name: displayName,
      roles: userRoles,
      role: primaryRole,
    };

    let redirectTo = "/vendor/dashboard";
    let vendorCategory: string | null = null;
    if ((requestedRole === "vendor" || requestedRole === "partner") && userId) {
      const catRes = await fetch(
        `${url}/rest/v1/vendors?user_id=eq.${encodeURIComponent(userId)}&deleted_at=is.null&select=id,vendor_categories(slug,name)&limit=1`,
        { headers: { apikey: apiKey, Authorization: `Bearer ${apiKey}` }, cache: "no-store" }
      ).catch(() => null);
      if (catRes && catRes.ok) {
        const rows = await catRes.json();
        const row = Array.isArray(rows) ? rows[0] : null;
        const catObj = Array.isArray(row?.vendor_categories) ? row.vendor_categories[0] : row?.vendor_categories;
        const tok = `${catObj?.slug || ""} ${catObj?.name || ""}`.toLowerCase();
        if (tok.includes("photograph")) {
          vendorCategory = "photographers";
          redirectTo = "/vendor/photographer";
        }
      }
    }

    const response = NextResponse.json(
      {
        success: true,
        statusCode: 200,
        message: "Login successful.",
        data: {
          user: userObj,
          token: jwtToken,
          supabaseSession: authResult?.session || null,
          vendor: vendorRecord || null,
          redirectTo,
          vendorCategory,
        },
      },
      { status: 200 }
    );

    const maxAge = SESSION_EXPIRY_DAYS * 24 * 60 * 60;

    response.cookies.set(AUTH_COOKIE_NAME, jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge,
      path: "/",
    });

    response.cookies.set("auth_token", jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge,
      path: "/",
    });

    response.cookies.set("user_role", primaryRole, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge,
      path: "/",
    });

    if (isAdmin) {
      const adminTokenVal = process.env.ADMIN_TOKEN || "admin-session-secure-token";
      response.cookies.set("adminToken", adminTokenVal, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge,
        path: "/",
      });
    }

    response.cookies.set(
      "user_data",
      encodeURIComponent(JSON.stringify(userObj)),
      {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge,
        path: "/",
      }
    );

    return response;
  } catch (err: any) {
    return NextResponse.json(
      { success: false, statusCode: 500, error: { code: "SERVER_ERROR", message: "An unexpected server error occurred." } },
      { status: 500 }
    );
  }
}
