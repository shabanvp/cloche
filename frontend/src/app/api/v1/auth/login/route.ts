import { NextResponse } from "next/server";
import { getSupabaseConfig, signInWithSupabaseAuth } from "@/lib/supabase";
import { AUTH_COOKIE_NAME, SESSION_EXPIRY_DAYS, signJwtToken, verifyPassword, hashPassword } from "@/lib/auth";

export async function POST(req: Request) {
  const startTime = Date.now();
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

    const cleanEmail = email.trim().toLowerCase();
    const { url, serviceKey, anonKey } = getSupabaseConfig();
    const apiKey = serviceKey || anonKey;

    if (!url || !apiKey) {
      return NextResponse.json(
        { success: false, statusCode: 500, error: { code: "CONFIG_ERROR", message: "Database credentials unconfigured." } },
        { status: 500 }
      );
    }

    console.log(`[LOGIN_API:ATTEMPT] email="${cleanEmail}" requestedRole="${requestedRole}" timestamp=${new Date().toISOString()}`);

    let customUser: any = null;
    let authResult: any = null;
    let userRoles: string[] = [];
    let isVendorAccount = false;
    let vendorRecord: any = null;

    // 1. Query custom database users table
    const userRes = await fetch(
      `${url}/rest/v1/users?email=eq.${encodeURIComponent(cleanEmail)}&select=id,email,password_hash,full_name,name,phone,city,wedding_date,is_active,is_verified,vendors(id,business_name,publication_status),user_roles(roles(name))`,
      {
        headers: { apikey: apiKey, Authorization: `Bearer ${apiKey}` },
        cache: "no-store",
      }
    ).catch(() => null);

    if (userRes && userRes.ok) {
      const users = await userRes.json();
      if (Array.isArray(users) && users.length > 0) {
        customUser = users[0];
      }
    }

    // 2. Parallel check against Supabase GoTrue Auth
    authResult = await signInWithSupabaseAuth(cleanEmail, password);

    // Evaluate Password Authenticity
    let isPasswordValid = false;
    if (customUser?.password_hash && verifyPassword(password, customUser.password_hash)) {
      isPasswordValid = true;
      console.log(`[LOGIN_API:PASS_VERIFY] Password verified via public.users hash match.`);

      // Sync Supabase Auth user password if out of sync
      if (authResult.error && (serviceKey || apiKey) && customUser.id) {
        await fetch(`${url}/auth/v1/admin/users/${customUser.id}`, {
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
      console.log(`[LOGIN_API:PASS_VERIFY] Password verified via Supabase Auth.`);

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
    if (!customUser && (authResult.error || !authResult.user)) {
      console.warn(`[LOGIN_API:FAIL] email=${cleanEmail} reason=USER_NOT_FOUND`);
      return NextResponse.json(
        { success: false, statusCode: 404, error: { code: "USER_NOT_FOUND", message: "No account found with this email address. Please sign up first." } },
        { status: 404 }
      );
    }

    // SCENARIO 2: Password Mismatch
    if (!isPasswordValid) {
      console.warn(`[LOGIN_API:FAIL] email=${cleanEmail} reason=INCORRECT_PASSWORD`);
      return NextResponse.json(
        { success: false, statusCode: 401, error: { code: "INVALID_CREDENTIALS", message: "Incorrect password. Please check your password and try again." } },
        { status: 401 }
      );
    }

    // Refetch user record if initially absent
    if (!customUser) {
      const reFetchRes = await fetch(
        `${url}/rest/v1/users?email=eq.${encodeURIComponent(cleanEmail)}&select=id,email,password_hash,full_name,name,phone,city,wedding_date,is_active,is_verified,vendors(id,business_name,publication_status),user_roles(roles(name))`,
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
      console.warn(`[LOGIN_API:FAIL] userId=${userId} email=${cleanEmail} reason=ACCOUNT_DISABLED`);
      return NextResponse.json(
        { success: false, statusCode: 403, error: { code: "ACCOUNT_DISABLED", message: "Your account has been deactivated. Please contact customer support." } },
        { status: 403 }
      );
    }

    // Role Resolution
    if (customUser) {
      if (Array.isArray(customUser.user_roles) && customUser.user_roles.length > 0) {
        userRoles = customUser.user_roles.map((ur: any) => ur.roles?.name).filter(Boolean);
      }
      if (Array.isArray(customUser.vendors) && customUser.vendors.length > 0) {
        isVendorAccount = true;
        vendorRecord = customUser.vendors[0];
        if (!userRoles.includes("vendor")) userRoles.push("vendor");
      }
    }

    if (userRoles.length === 0) {
      userRoles = [requestedRole === "vendor" || requestedRole === "partner" ? "vendor" : "customer"];
    }

    if (!userRoles.includes("customer") && !userRoles.includes("user")) {
      userRoles.push("customer");
    }

    console.log(`[LOGIN_API:ROLE_RESOLVED] userId=${userId} email=${cleanEmail} roles=[${userRoles.join(",")}] requestedRole="${requestedRole}"`);

    // SCENARIO 4: Role/Portal Authorization Checks
    if (requestedRole === "vendor" || requestedRole === "partner") {
      if (!userRoles.includes("vendor") && !isVendorAccount) {
        console.warn(`[LOGIN_API:FAIL] userId=${userId} email=${cleanEmail} reason=ROLE_MISMATCH_NOT_VENDOR`);
        return NextResponse.json(
          { success: false, statusCode: 403, error: { code: "ROLE_MISMATCH", message: "This email is registered as a customer account. Please log in through the user portal or register as a vendor." } },
          { status: 403 }
        );
      }
      if (vendorRecord && vendorRecord.publication_status === "suspended") {
        console.warn(`[LOGIN_API:FAIL] userId=${userId} email=${cleanEmail} reason=VENDOR_SUSPENDED`);
        return NextResponse.json(
          { success: false, statusCode: 403, error: { code: "VENDOR_SUSPENDED", message: "Your vendor account is suspended. Please contact support." } },
          { status: 403 }
        );
      }
    } else if (requestedRole === "admin") {
      if (!userRoles.includes("admin") && !userRoles.includes("super_admin")) {
        console.warn(`[LOGIN_API:FAIL] userId=${userId} email=${cleanEmail} reason=ROLE_MISMATCH_NOT_ADMIN`);
        return NextResponse.json(
          { success: false, statusCode: 403, error: { code: "UNAUTHORIZED_ROLE", message: "Access denied. Admin authorization required." } },
          { status: 403 }
        );
      }
    }

    // SCENARIO 5: Successful Response & Session Cookie Generation
    const primaryRole = (requestedRole === "vendor" || requestedRole === "partner")
      ? "vendor"
      : (requestedRole === "admin" ? "admin" : "user");

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

    console.log(`[LOGIN_API:SUCCESS] userId=${userId} email=${cleanEmail} roles=[${userRoles.join(",")}] ms=${Date.now() - startTime}`);

    const response = NextResponse.json(
      {
        success: true,
        statusCode: 200,
        message: "Login successful.",
        data: {
          user: userObj,
          token: jwtToken,
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
    console.error("[LOGIN_API:CRITICAL_ERROR]", err);
    return NextResponse.json(
      { success: false, statusCode: 500, error: { code: "SERVER_ERROR", message: "An unexpected server error occurred." } },
      { status: 500 }
    );
  }
}
