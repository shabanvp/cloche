import { NextResponse } from "next/server";
import { hashPassword, signJwtToken, hashSessionToken, AUTH_COOKIE_NAME, SESSION_EXPIRY_DAYS } from "@/lib/auth";
import { getSupabaseConfig } from "@/lib/supabase";
import { sendVerificationMail } from "@/lib/email";

export async function POST(req: Request) {
  const logPrefix = "[AUTH_SIGNUP_API]";
  let insertedUserId: string | null = null;
  let insertedRoleId: string | null = null;
  const { url, serviceKey, anonKey } = getSupabaseConfig();
  const apiKey = serviceKey || anonKey;

  try {
    const body = await req.json();
    const { email, password, fullName, phone, role = "customer" } = body;

    if (!email || !password || !fullName) {
      return NextResponse.json(
        {
          success: false,
          statusCode: 400,
          error: { code: "VALIDATION_ERROR", message: "Email, password, and full name are required." },
        },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = fullName.trim();
    const cleanPhone = phone ? phone.trim() : null;
    const assignedRole = "customer";

    if (!url || !apiKey) {
      return NextResponse.json(
        { success: false, statusCode: 500, error: { code: "CONFIG_ERROR", message: "Database credentials unconfigured." } },
        { status: 500 }
      );
    }

    // 1. Check if user already exists
    const checkEmailRes = await fetch(`${url}/rest/v1/users?email=eq.${encodeURIComponent(cleanEmail)}&select=id,is_verified,user_roles(roles(name))`, {
      headers: { apikey: apiKey, Authorization: `Bearer ${apiKey}` },
    });

    let existingUser: any = null;

    if (checkEmailRes.ok) {
      const existingUsers = await checkEmailRes.json();
      if (Array.isArray(existingUsers) && existingUsers.length > 0) {
        existingUser = existingUsers[0];
        const roles = Array.isArray(existingUser.user_roles)
          ? existingUser.user_roles.map((ur: any) => ur.roles?.name)
          : [];

        if (roles.includes("customer")) {
          console.warn(`${logPrefix} Signup rejected: Customer account already exists -> ${cleanEmail}`);
          return NextResponse.json(
            {
              success: false,
              statusCode: 409,
              error: { code: "EMAIL_EXISTS", message: "A customer account with this email address already exists. Please log in instead." },
            },
            { status: 409 }
          );
        }
      }
    }

    const passwordHash = hashPassword(password);
    const verificationToken = crypto.randomUUID();
    let targetUserId: string = "";

    if (existingUser) {
      // Single Gmail dual-role support: Reuse existing user record, update verification token and set to unverified until email clicked
      targetUserId = existingUser.id;
      console.log(`${logPrefix} Reusing existing user record (${targetUserId}) for customer account signup...`);

      await fetch(`${url}/rest/v1/users?id=eq.${encodeURIComponent(targetUserId)}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          apikey: apiKey,
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          full_name: cleanName,
          name: cleanName,
          phone: cleanPhone || undefined,
          verification_token: verificationToken,
          is_verified: false,
        }),
      });
    } else {
      // Create new User record
      const userPayload = {
        email: cleanEmail,
        password_hash: passwordHash,
        full_name: cleanName,
        name: cleanName,
        phone: cleanPhone,
        verification_token: verificationToken,
        is_active: true,
        is_verified: false,
      };

      console.log(`${logPrefix} Inserting new user record into users table...`);
      const insertUserRes = await fetch(`${url}/rest/v1/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: apiKey,
          Authorization: `Bearer ${apiKey}`,
          Prefer: "return=representation",
        },
        body: JSON.stringify(userPayload),
      });

      if (!insertUserRes.ok) {
        const errText = await insertUserRes.text();
        return NextResponse.json(
          { success: false, statusCode: 500, error: { code: "USER_INSERT_FAILED", message: errText } },
          { status: 500 }
        );
      }

      const insertedUsers = await insertUserRes.json();
      targetUserId = insertedUsers[0].id;
      insertedUserId = targetUserId;
    }

    // 2. Resolve Role ID for customer
    let roleId: string | null = null;
    const roleLookupRes = await fetch(`${url}/rest/v1/roles?name=eq.customer&select=id`, {
      headers: { apikey: apiKey, Authorization: `Bearer ${apiKey}` },
    });

    if (roleLookupRes.ok) {
      const roles = await roleLookupRes.json();
      if (Array.isArray(roles) && roles.length > 0) {
        roleId = roles[0].id;
      }
    }

    if (roleId) {
      await fetch(`${url}/rest/v1/user_roles`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: apiKey,
          Authorization: `Bearer ${apiKey}`,
          Prefer: "resolution=merge-duplicates",
        },
        body: JSON.stringify({ user_id: targetUserId, role_id: roleId }),
      }).catch(() => null);
    }

    // 3. Dispatch Verification Email via Brevo from cloche.luxury@gmail.com
    await sendVerificationMail({
      email: cleanEmail,
      name: cleanName,
      verificationToken,
      role: "customer",
    });

    return NextResponse.json(
      {
        success: true,
        statusCode: 201,
        message: "Customer account created successfully! Please check your Gmail inbox (from cloche.luxury@gmail.com) and click the verification link to log in.",
        user: {
          id: targetUserId,
          email: cleanEmail,
          fullName: cleanName,
          isVerified: false,
        },
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error(`${logPrefix} CRITICAL ERROR:`, err);
    return NextResponse.json(
      { success: false, statusCode: 500, error: { code: "SERVER_ERROR", message: err.message } },
      { status: 500 }
    );
  }
}
