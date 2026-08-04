import { NextResponse } from "next/server";
import { verifyPassword, signJwtToken, hashSessionToken, AUTH_COOKIE_NAME, SESSION_EXPIRY_DAYS } from "@/lib/auth";
import { getSupabaseConfig } from "@/lib/supabase";

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
    const { url, anonKey } = getSupabaseConfig();
    if (!url || !anonKey) {
      return NextResponse.json(
        { success: false, statusCode: 500, error: { code: "CONFIG_ERROR", message: "Database credentials unconfigured." } },
        { status: 500 }
      );
    }

    // 1. Fetch user by email
    const userRes = await fetch(
      `${url}/rest/v1/users?email=eq.${encodeURIComponent(cleanEmail)}&select=id,email,password_hash,full_name,is_active,user_roles(roles(name))`,
      {
        headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` },
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

    if (!user.is_active) {
      return NextResponse.json(
        { success: false, statusCode: 403, error: { code: "ACCOUNT_DISABLED", message: "This user account has been disabled." } },
        { status: 403 }
      );
    }

    // 2. Verify password
    const isPasswordValid = verifyPassword(password, user.password_hash);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, statusCode: 401, error: { code: "INVALID_CREDENTIALS", message: "Invalid email or password." } },
        { status: 401 }
      );
    }

    // Extract roles from bridge join
    let userRoles: string[] = ["customer"];
    if (Array.isArray(user.user_roles) && user.user_roles.length > 0) {
      userRoles = user.user_roles
        .map((ur: any) => ur.roles?.name)
        .filter((rName: any) => typeof rName === "string");
    }

    // 3. Issue JWT & Create Session record
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
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
      },
      body: JSON.stringify({
        user_id: user.id,
        token_hash: tokenHash,
        expires_at: expiresAt,
      }),
    });

    // 4. Create Response & Set HTTP-Only Cookie
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
