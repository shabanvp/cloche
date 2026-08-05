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

    // Step 1: Authenticate against Supabase Auth or fallback user lookup
    const authResult = await signInWithSupabaseAuth(cleanEmail, password);
    let authUser = authResult.user;
    let customUserId = authUser?.id;

    // Fetch custom user profile and roles
    const userRes = await fetch(
      `${url}/rest/v1/users?email=eq.${encodeURIComponent(cleanEmail)}&select=id,email,password_hash,full_name,is_active,user_roles(roles(name))`,
      {
        headers: { apikey: apiKey, Authorization: `Bearer ${apiKey}` },
      }
    );

    let displayName = cleanEmail.split("@")[0];
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

    const sessionToken = authResult.session?.access_token || customUserId || "session-" + Date.now();

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
          token: sessionToken,
        },
      },
      { status: 200 }
    );

    response.cookies.set(AUTH_COOKIE_NAME, sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_EXPIRY_DAYS * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (err: any) {
    console.error("[LOGIN_API] Server error:", err);
    return NextResponse.json(
      { success: false, statusCode: 500, error: { code: "SERVER_ERROR", message: err.message } },
      { status: 500 }
    );
  }
}
