import { NextResponse } from "next/server";
import { verifyPassword, signJwtToken, hashSessionToken, AUTH_COOKIE_NAME, SESSION_EXPIRY_DAYS } from "@/lib/auth";
import { getSupabaseConfig } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, role } = body;

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

    // 1. Fetch user by email including is_verified status and roles
    const userRes = await fetch(
      `${url}/rest/v1/users?email=eq.${encodeURIComponent(cleanEmail)}&select=id,email,password_hash,full_name,is_active,is_verified,user_roles(roles(name))`,
      {
        headers: { apikey: apiKey, Authorization: `Bearer ${apiKey}` },
      }
    );

    if (!userRes.ok) {
      return NextResponse.json(
        { success: false, statusCode: 401, error: { code: "INVALID_CREDENTIALS", message: "Invalid email or password." } },
        { status: 401 }
      );
    }

    const users = await userRes.json();
    if (!Array.isArray(users) || users.length === 0) {
      return NextResponse.json(
        { success: false, statusCode: 401, error: { code: "INVALID_CREDENTIALS", message: "Invalid email or password." } },
        { status: 401 }
      );
    }

    const user = users[0];

    // 2. Check if account is active
    if (!user.is_active) {
      return NextResponse.json(
        { success: false, statusCode: 403, error: { code: "ACCOUNT_DISABLED", message: "This account has been disabled." } },
        { status: 403 }
      );
    }



    // 4. Verify password
    const isPasswordValid = verifyPassword(password, user.password_hash);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, statusCode: 401, error: { code: "INVALID_CREDENTIALS", message: "Invalid email or password." } },
        { status: 401 }
      );
    }

    // Extract user roles
    let userRoles: string[] = ["customer"];
    if (Array.isArray(user.user_roles) && user.user_roles.length > 0) {
      userRoles = user.user_roles
        .map((ur: any) => ur.roles?.name)
        .filter((rName: any) => typeof rName === "string");
    }

    // 5. Issue JWT & Create Session record
    const token = signJwtToken({
      userId: user.id,
      email: user.email,
      fullName: user.full_name,
      roles: userRoles.length > 0 ? userRoles : ["customer"],
    });

    const tokenHash = hashSessionToken(token);
    const expiresAt = new Date(Date.now() + SESSION_EXPIRY_DAYS * 24 * 60 * 60 * 1000).toISOString();

    await fetch(`${url}/rest/v1/sessions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: apiKey,
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        user_id: user.id,
        token_hash: tokenHash,
        expires_at: expiresAt,
      }),
    });

    // 6. Return response and set cookies
    const response = NextResponse.json(
      {
        success: true,
        statusCode: 200,
        message: "Login successful",
        data: {
          user: {
            id: user.id,
            email: user.email,
            fullName: user.full_name,
            roles: userRoles.length > 0 ? userRoles : ["customer"],
          },
          token,
        },
      },
      { status: 200 }
    );

    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_EXPIRY_DAYS * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (err: any) {
    return NextResponse.json(
      { success: false, statusCode: 500, error: { code: "SERVER_ERROR", message: err.message } },
      { status: 500 }
    );
  }
}
