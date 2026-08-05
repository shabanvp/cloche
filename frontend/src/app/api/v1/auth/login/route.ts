import { NextResponse } from "next/server";
import { getSupabaseConfig, signInWithSupabaseAuth } from "@/lib/supabase";
import { AUTH_COOKIE_NAME, SESSION_EXPIRY_DAYS } from "@/lib/auth";

export async function POST(req: Request) {
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

    // Step 1: Authenticate against Supabase Auth (Single Source of Truth)
    const authResult = await signInWithSupabaseAuth(cleanEmail, password);
    if (authResult.error || !authResult.user) {
      const errMsg = authResult.error?.message || "Invalid email or password.";
      return NextResponse.json(
        { success: false, statusCode: 401, error: { code: "INVALID_CREDENTIALS", message: errMsg } },
        { status: 401 }
      );
    }

    const authUser = authResult.user;

    // Step 2: Check email confirmation status from auth.users (email_confirmed_at)
    if (!authUser.email_confirmed_at && authUser.confirmed_at === null) {
      return NextResponse.json(
        {
          success: false,
          statusCode: 403,
          error: {
            code: "EMAIL_NOT_VERIFIED",
            message: "Please verify your email address before logging in. Check your inbox for the confirmation link.",
          },
        },
        { status: 403 }
      );
    }

    // Step 3: Fetch application profile and RBAC roles from custom database
    const userRes = await fetch(
      `${url}/rest/v1/users?email=eq.${encodeURIComponent(cleanEmail)}&select=id,email,full_name,is_active,is_verified,user_roles(roles(name))`,
      {
        headers: { apikey: apiKey, Authorization: `Bearer ${apiKey}` },
      }
    );

    let customUserId = authUser.id;
    let displayName = authUser.user_metadata?.full_name || cleanEmail.split("@")[0];
    let userRoles: string[] = ["customer"];

    if (userRes.ok) {
      const users = await userRes.json();
      if (Array.isArray(users) && users.length > 0) {
        const customUser = users[0];
        customUserId = customUser.id;
        displayName = customUser.full_name || displayName;

        if (Array.isArray(customUser.user_roles) && customUser.user_roles.length > 0) {
          userRoles = customUser.user_roles
            .map((ur: any) => ur.roles?.name)
            .filter((rName: any) => typeof rName === "string");
        }
      }
    }

    const sessionToken = authResult.session?.access_token || authUser.id;

    // Step 4: Construct Response and set HTTP-Only Session Cookie
    const response = NextResponse.json(
      {
        success: true,
        statusCode: 200,
        message: "Login successful",
        data: {
          user: {
            id: customUserId,
            supabaseUserId: authUser.id,
            email: authUser.email,
            fullName: displayName,
            roles: userRoles.length > 0 ? userRoles : ["customer"],
          },
          token: sessionToken,
        },
      },
      { status: 200 }
    );

    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: sessionToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_EXPIRY_DAYS * 24 * 60 * 60,
      path: "/",
    });
    response.cookies.set({
      name: "auth_token",
      value: sessionToken,
      path: "/",
      maxAge: SESSION_EXPIRY_DAYS * 24 * 60 * 60,
    });

    return response;
  } catch (err: any) {
    return NextResponse.json(
      { success: false, statusCode: 500, error: { code: "SERVER_ERROR", message: err.message } },
      { status: 500 }
    );
  }
}
