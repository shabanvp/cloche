import { NextResponse } from "next/server";
import { getSupabaseConfig, signInWithSupabaseAuth } from "@/lib/supabase";
import { AUTH_COOKIE_NAME, SESSION_EXPIRY_DAYS, signJwtToken, verifyPassword, hashSessionToken } from "@/lib/auth";
import { prisma } from "@/lib/database";

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

    // Step 1: Query users table in PostgreSQL via Prisma
    const fetchStart = Date.now();
    const dbUser = await prisma.user.findUnique({
      where: { email: cleanEmail },
      include: {
        userRoles: {
          include: {
            role: true
          }
        }
      }
    });

    console.log(`[DB:FETCH] table=users email=${cleanEmail} found=${!!dbUser} ms=${Date.now() - fetchStart}`);

    let customUserId: string | null = null;
    let displayName = cleanEmail.split("@")[0];
    let userRoles: string[] = ["customer"];

    if (dbUser) {
      if (dbUser.passwordHash && verifyPassword(password, dbUser.passwordHash)) {
        customUserId = dbUser.id;
        displayName = dbUser.fullName || dbUser.name || displayName;
        if (dbUser.userRoles && dbUser.userRoles.length > 0) {
          userRoles = dbUser.userRoles.map(ur => ur.role?.name).filter((name): name is string => typeof name === "string");
        }
      } else if (dbUser.passwordHash) {
        console.warn(`[AUTH:FAIL] Invalid credentials for email=${cleanEmail}`);
        return NextResponse.json(
          { success: false, statusCode: 401, error: { code: "INVALID_CREDENTIALS", message: "Invalid email or password." } },
          { status: 401 }
        );
      }
    }

    // Step 2: Fallback to Supabase GoTrue Auth for backward compatibility (if user not in PostgreSQL yet)
    if (!customUserId) {
      const authResult = await signInWithSupabaseAuth(cleanEmail, password);
      if (authResult.error || !authResult.user) {
        console.warn(`[AUTH:FAIL] User not found or invalid credentials for email=${cleanEmail}`);
        return NextResponse.json(
          { success: false, statusCode: 401, error: { code: "INVALID_CREDENTIALS", message: "Invalid email or password." } },
          { status: 401 }
        );
      }
      customUserId = authResult.user.id;
      displayName = authResult.user.user_metadata?.full_name || displayName;
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

    // Create session in PostgreSQL
    const tokenHash = hashSessionToken(jwtToken);
    const expiresAt = new Date(Date.now() + SESSION_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
    await prisma.session.create({
      data: {
        userId: customUserId,
        tokenHash,
        userAgent: "Next.js API Route (Login)",
        ipAddress: "127.0.0.1",
        expiresAt,
      }
    }).catch((err) => {
      console.error("[LOGIN_ROUTE:SESSION_CREATE_ERROR]", err);
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
