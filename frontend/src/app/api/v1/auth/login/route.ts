import { NextResponse } from "next/server";
import { getSupabaseConfig, signInWithSupabaseAuth } from "@/lib/supabase";
import { AUTH_COOKIE_NAME, SESSION_EXPIRY_DAYS, signJwtToken, verifyPassword } from "@/lib/auth";

export async function POST(req: Request) {
  const startTime = Date.now();
  try {
    const body = await req.json();
    const { email, password } = body;

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

    // Step 1: Authenticate against Supabase Auth or custom user database lookup
    const authResult = await signInWithSupabaseAuth(cleanEmail, password);
    let authUser = authResult.user;
    let customUserId = authUser?.id;

    // Fetch custom user profile and roles
    const fetchStart = Date.now();
    const userRes = await fetch(
      `${url}/rest/v1/users?email=eq.${encodeURIComponent(cleanEmail)}&select=id,email,password_hash,full_name,is_active,user_roles(roles(name))`,
      {
        headers: { apikey: apiKey, Authorization: `Bearer ${apiKey}` },
      }
    );

    let displayName = cleanEmail.split("@")[0];
    let userRoles: string[] = ["customer"];
    let customUser: any = null;

    if (userRes.ok) {
      const users = await userRes.json();
      console.log(`[DB:FETCH] table=users email=${cleanEmail} rows=${Array.isArray(users) ? users.length : 0} ms=${Date.now() - fetchStart}`);
      if (Array.isArray(users) && users.length > 0) {
        customUser = users[0];
        customUserId = customUser.id;
        displayName = customUser.full_name || displayName;

        if (Array.isArray(customUser.user_roles) && customUser.user_roles.length > 0) {
          userRoles = customUser.user_roles
            .map((ur: any) => ur.roles?.name)
            .filter((rName: any) => typeof rName === "string");
        }
      }
    }

    // If Supabase Auth failed, check custom password hash from users table
    if (authResult.error && customUser?.password_hash) {
      const isValidPassword = verifyPassword(password, customUser.password_hash);
      if (!isValidPassword) {
        console.warn(`[AUTH:FAIL] Invalid credentials for email=${cleanEmail}`);
        return NextResponse.json(
          { success: false, statusCode: 401, error: { code: "INVALID_CREDENTIALS", message: "Invalid email or password." } },
          { status: 401 }
        );
      }
    } else if (authResult.error && !customUser) {
      console.warn(`[AUTH:FAIL] User not found for email=${cleanEmail}`);
      return NextResponse.json(
        { success: false, statusCode: 401, error: { code: "INVALID_CREDENTIALS", message: "Invalid email or password." } },
        { status: 401 }
      );
    }

    if (!customUserId) {
      return NextResponse.json(
        { success: false, statusCode: 401, error: { code: "USER_NOT_FOUND", message: "User identity resolution failed." } },
        { status: 401 }
      );
    }

    // Generate valid signed HMAC-SHA256 JWT Token
    const jwtToken = signJwtToken({
      userId: customUserId,
      email: cleanEmail,
      fullName: displayName,
      roles: userRoles.length > 0 ? userRoles : ["customer"],
    });

    const primaryRole = userRoles.includes("super_admin")
      ? "admin"
      : userRoles.includes("admin")
      ? "admin"
      : userRoles.includes("vendor")
      ? "vendor"
      : "customer";

    console.log(`[AUTH:SUCCESS] user_id=${customUserId} email=${cleanEmail} roles=[${userRoles.join(",")}] ms=${Date.now() - startTime}`);

    const response = NextResponse.json(
      {
        success: true,
        statusCode: 200,
        message: "Login successful.",
        data: {
          user: {
            id: customUserId,
            email: cleanEmail,
            fullName: displayName,
            roles: userRoles,
          },
          token: jwtToken,
        },
      },
      { status: 200 }
    );

    const maxAge = SESSION_EXPIRY_DAYS * 24 * 60 * 60;

    // Set cloche_auth_token HTTP-Only cookie
    response.cookies.set(AUTH_COOKIE_NAME, jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge,
      path: "/",
    });

    // Set fallback auth_token cookie
    response.cookies.set("auth_token", jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge,
      path: "/",
    });

    // Set user_role cookie for middleware routing
    response.cookies.set("user_role", primaryRole, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge,
      path: "/",
    });

    // Set user_data cookie for lightweight client state
    response.cookies.set(
      "user_data",
      encodeURIComponent(JSON.stringify({ id: customUserId, email: cleanEmail, name: displayName, roles: userRoles })),
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
    console.error("[LOGIN_API] Server error:", err);
    return NextResponse.json(
      { success: false, statusCode: 500, error: { code: "SERVER_ERROR", message: err.message } },
      { status: 500 }
    );
  }
}
