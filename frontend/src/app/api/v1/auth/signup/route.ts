import { NextResponse } from "next/server";
import { hashPassword, signJwtToken, hashSessionToken, AUTH_COOKIE_NAME, SESSION_EXPIRY_DAYS } from "@/lib/auth";
import { getSupabaseConfig } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, fullName, phone, role = "customer" } = body;

    if (!email || !password || !fullName) {
      return NextResponse.json(
        {
          success: false,
          statusCode: 400,
          error: {
            code: "VALIDATION_ERROR",
            message: "Email, password, and full name are required.",
          },
        },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const allowedRoles = ["customer", "vendor"];
    const assignedRole = allowedRoles.includes(role) ? role : "customer";

    const { url, anonKey } = getSupabaseConfig();
    if (!url || !anonKey) {
      return NextResponse.json(
        { success: false, statusCode: 500, error: { code: "CONFIG_ERROR", message: "Database credentials unconfigured." } },
        { status: 500 }
      );
    }

    // 1. Check if user already exists
    const checkRes = await fetch(`${url}/rest/v1/users?email=eq.${encodeURIComponent(cleanEmail)}&select=id`, {
      headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` },
    });
    
    if (checkRes.ok) {
      const existing = await checkRes.json();
      if (Array.isArray(existing) && existing.length > 0) {
        return NextResponse.json(
          {
            success: false,
            statusCode: 409,
            error: { code: "EMAIL_EXISTS", message: "An account with this email address already exists." },
          },
          { status: 409 }
        );
      }
    }

    // 2. Hash password & insert into users table
    const passwordHash = hashPassword(password);
    const userPayload = {
      email: cleanEmail,
      password_hash: passwordHash,
      full_name: fullName.trim(),
      phone: phone ? phone.trim() : null,
      is_active: true,
      is_verified: false,
    };

    const insertUserRes = await fetch(`${url}/rest/v1/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
        Prefer: "return=representation",
      },
      body: JSON.stringify(userPayload),
    });

    if (!insertUserRes.ok) {
      const errText = await insertUserRes.text();
      return NextResponse.json(
        { success: false, statusCode: 500, error: { code: "DATABASE_ERROR", message: errText } },
        { status: 500 }
      );
    }

    const insertedUsers = await insertUserRes.json();
    const newUser = insertedUsers[0];

    // 3. Look up role_id and link in user_roles table
    const roleLookupRes = await fetch(`${url}/rest/v1/roles?name=eq.${encodeURIComponent(assignedRole)}&select=id`, {
      headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` },
    });

    if (roleLookupRes.ok) {
      const roleData = await roleLookupRes.json();
      if (Array.isArray(roleData) && roleData.length > 0) {
        const roleId = roleData[0].id;
        await fetch(`${url}/rest/v1/user_roles`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: anonKey,
            Authorization: `Bearer ${anonKey}`,
          },
          body: JSON.stringify({ user_id: newUser.id, role_id: roleId }),
        });
      }
    }

    // 4. Issue JWT & Create Session record
    const token = signJwtToken({
      userId: newUser.id,
      email: newUser.email,
      fullName: newUser.full_name,
      roles: [assignedRole],
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
        user_id: newUser.id,
        token_hash: tokenHash,
        expires_at: expiresAt,
      }),
    });

    // 5. Create Response & Set HTTP-Only Cookie
    const response = NextResponse.json(
      {
        success: true,
        statusCode: 201,
        message: "User registered successfully",
        data: {
          user: {
            id: newUser.id,
            email: newUser.email,
            fullName: newUser.full_name,
            roles: [assignedRole],
          },
          token,
        },
      },
      { status: 201 }
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
