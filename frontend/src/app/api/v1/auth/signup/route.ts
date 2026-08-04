import { NextResponse } from "next/server";
import { hashPassword, signJwtToken, hashSessionToken, AUTH_COOKIE_NAME, SESSION_EXPIRY_DAYS } from "@/lib/auth";
import { getSupabaseConfig } from "@/lib/supabase";

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
      console.error(`${logPrefix} Missing required fields: email, password, or fullName.`);
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
    const allowedRoles = ["customer", "vendor", "admin", "super_admin"];
    const assignedRole = allowedRoles.includes(role) ? role : "customer";

    if (!url || !apiKey) {
      console.error(`${logPrefix} Supabase credentials unconfigured.`);
      return NextResponse.json(
        { success: false, statusCode: 500, error: { code: "CONFIG_ERROR", message: "Database credentials unconfigured." } },
        { status: 500 }
      );
    }

    // 1. Check for Duplicate User
    const checkRes = await fetch(`${url}/rest/v1/users?email=eq.${encodeURIComponent(cleanEmail)}&select=id`, {
      headers: { apikey: apiKey, Authorization: `Bearer ${apiKey}` },
    });

    if (checkRes.ok) {
      const existing = await checkRes.json();
      if (Array.isArray(existing) && existing.length > 0) {
        console.warn(`${logPrefix} Signup rejected: Email already exists -> ${cleanEmail}`);
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

    // 2. Hash Password using PBKDF2 & Insert into users table
    const passwordHash = hashPassword(password);
    const userPayload = {
      email: cleanEmail,
      password_hash: passwordHash,
      full_name: cleanName,
      name: cleanName,
      phone: cleanPhone,
      is_active: true,
      is_verified: false,
    };

    console.log(`${logPrefix} Inserting user record into users table...`);
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
      console.error(`${logPrefix} FAILED to insert user into users table: ${errText}`);
      return NextResponse.json(
        { success: false, statusCode: 500, error: { code: "USER_INSERT_FAILED", message: errText } },
        { status: 500 }
      );
    }

    const insertedUsers = await insertUserRes.json();
    if (!Array.isArray(insertedUsers) || insertedUsers.length === 0) {
      console.error(`${logPrefix} FAILED to retrieve inserted user representation.`);
      return NextResponse.json(
        { success: false, statusCode: 500, error: { code: "USER_INSERT_FAILED", message: "Empty representation returned." } },
        { status: 500 }
      );
    }

    const newUser = insertedUsers[0];
    insertedUserId = newUser.id;
    console.log(`${logPrefix} SUCCESS: User inserted into users table with ID: ${insertedUserId}`);

    // 3. Look up Role in roles table (or insert default role if missing)
    let roleId: string | null = null;
    const roleLookupRes = await fetch(`${url}/rest/v1/roles?name=eq.${encodeURIComponent(assignedRole)}&select=id`, {
      headers: { apikey: apiKey, Authorization: `Bearer ${apiKey}` },
    });

    if (roleLookupRes.ok) {
      const roles = await roleLookupRes.json();
      if (Array.isArray(roles) && roles.length > 0) {
        roleId = roles[0].id;
      }
    }

    // Fallback: Check 'customer' role if assignedRole lookup failed
    if (!roleId && assignedRole !== "customer") {
      const fallbackRoleRes = await fetch(`${url}/rest/v1/roles?name=eq.customer&select=id`, {
        headers: { apikey: apiKey, Authorization: `Bearer ${apiKey}` },
      });
      if (fallbackRoleRes.ok) {
        const fallbacks = await fallbackRoleRes.json();
        if (Array.isArray(fallbacks) && fallbacks.length > 0) {
          roleId = fallbacks[0].id;
        }
      }
    }

    // If role record doesn't exist in roles table, seed it dynamically to ensure foreign key constraint passes
    if (!roleId) {
      console.log(`${logPrefix} Role '${assignedRole}' not found in roles table. Creating role record...`);
      const createRoleRes = await fetch(`${url}/rest/v1/roles`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: apiKey,
          Authorization: `Bearer ${apiKey}`,
          Prefer: "return=representation",
        },
        body: JSON.stringify({
          name: assignedRole,
          description: `${assignedRole.toUpperCase()} role`,
        }),
      });

      if (createRoleRes.ok) {
        const newRoles = await createRoleRes.json();
        if (Array.isArray(newRoles) && newRoles.length > 0) {
          roleId = newRoles[0].id;
        }
      }
    }

    if (!roleId) {
      console.error(`${logPrefix} FAILED to resolve or create role '${assignedRole}'. Initiating rollback...`);
      // Rollback user
      await fetch(`${url}/rest/v1/users?id=eq.${encodeURIComponent(insertedUserId!)}`, {
        method: "DELETE",
        headers: { apikey: apiKey, Authorization: `Bearer ${apiKey}` },
      });
      return NextResponse.json(
        { success: false, statusCode: 500, error: { code: "ROLE_LOOKUP_FAILED", message: "Could not resolve user role." } },
        { status: 500 }
      );
    }

    insertedRoleId = roleId;

    // 4. Insert into user_roles table
    console.log(`${logPrefix} Linking user ${insertedUserId} with role ${insertedRoleId} in user_roles table...`);
    const insertUserRoleRes = await fetch(`${url}/rest/v1/user_roles`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: apiKey,
        Authorization: `Bearer ${apiKey}`,
        Prefer: "return=representation",
      },
      body: JSON.stringify({ user_id: insertedUserId, role_id: insertedRoleId }),
    });

    if (!insertUserRoleRes.ok) {
      const roleErrText = await insertUserRoleRes.text();
      console.error(`${logPrefix} FAILED to insert user_roles record: ${roleErrText}. Initiating ROLLBACK...`);
      // Rollback user
      await fetch(`${url}/rest/v1/users?id=eq.${encodeURIComponent(insertedUserId!)}`, {
        method: "DELETE",
        headers: { apikey: apiKey, Authorization: `Bearer ${apiKey}` },
      });
      return NextResponse.json(
        { success: false, statusCode: 500, error: { code: "USER_ROLE_INSERT_FAILED", message: roleErrText } },
        { status: 500 }
      );
    }
    console.log(`${logPrefix} SUCCESS: Record inserted into user_roles table.`);

    // 5. Issue JWT Token & Create Hashed Session in sessions table
    const token = signJwtToken({
      userId: newUser.id,
      email: newUser.email,
      fullName: newUser.full_name,
      roles: [assignedRole],
    });

    const tokenHash = hashSessionToken(token);
    const expiresAt = new Date(Date.now() + SESSION_EXPIRY_DAYS * 24 * 60 * 60 * 1000).toISOString();
    const userAgent = req.headers.get("user-agent") || "Web Browser";
    const ipAddress = req.headers.get("x-forwarded-for") || "127.0.0.1";

    console.log(`${logPrefix} Creating active session record in sessions table...`);
    const insertSessionRes = await fetch(`${url}/rest/v1/sessions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: apiKey,
        Authorization: `Bearer ${apiKey}`,
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        user_id: newUser.id,
        token_hash: tokenHash,
        user_agent: userAgent,
        ip_address: ipAddress,
        expires_at: expiresAt,
      }),
    });

    if (!insertSessionRes.ok) {
      const sessionErrText = await insertSessionRes.text();
      console.error(`${logPrefix} FAILED to insert session record into sessions table: ${sessionErrText}. Initiating ROLLBACK...`);
      // Rollback user_roles and users
      await fetch(`${url}/rest/v1/user_roles?user_id=eq.${encodeURIComponent(insertedUserId!)}`, {
        method: "DELETE",
        headers: { apikey: apiKey, Authorization: `Bearer ${apiKey}` },
      });
      await fetch(`${url}/rest/v1/users?id=eq.${encodeURIComponent(insertedUserId!)}`, {
        method: "DELETE",
        headers: { apikey: apiKey, Authorization: `Bearer ${apiKey}` },
      });

      return NextResponse.json(
        { success: false, statusCode: 500, error: { code: "SESSION_INSERT_FAILED", message: sessionErrText } },
        { status: 500 }
      );
    }
    console.log(`${logPrefix} SUCCESS: Record inserted into sessions table.`);

    // 6. Return Final Verified Signup Response with Cookies
    const responseData = {
      success: true,
      statusCode: 201,
      message: "User registered successfully",
      user: {
        id: newUser.id,
        email: newUser.email,
        fullName: newUser.full_name,
        name: newUser.full_name,
        phone: newUser.phone,
        isActive: newUser.is_active,
      },
      roles: [assignedRole],
      session: {
        token,
        tokenHash,
        expiresAt,
      },
    };

    const response = NextResponse.json(responseData, { status: 201 });

    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_EXPIRY_DAYS * 24 * 60 * 60,
      path: "/",
    });

    response.cookies.set({
      name: "auth_token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_EXPIRY_DAYS * 24 * 60 * 60,
      path: "/",
    });

    response.cookies.set({
      name: "user_role",
      value: assignedRole,
      path: "/",
      maxAge: SESSION_EXPIRY_DAYS * 24 * 60 * 60,
    });

    response.cookies.set({
      name: "user_data",
      value: JSON.stringify(responseData.user),
      path: "/",
      maxAge: SESSION_EXPIRY_DAYS * 24 * 60 * 60,
    });

    return response;
  } catch (err: any) {
    console.error(`${logPrefix} CRITICAL UNHANDLED ERROR:`, err);
    if (insertedUserId) {
      // Clean rollback attempt
      try {
        await fetch(`${url}/rest/v1/user_roles?user_id=eq.${encodeURIComponent(insertedUserId)}`, {
          method: "DELETE",
          headers: { apikey: apiKey, Authorization: `Bearer ${apiKey}` },
        });
        await fetch(`${url}/rest/v1/users?id=eq.${encodeURIComponent(insertedUserId)}`, {
          method: "DELETE",
          headers: { apikey: apiKey, Authorization: `Bearer ${apiKey}` },
        });
      } catch (e) {}
    }

    return NextResponse.json(
      { success: false, statusCode: 500, error: { code: "SERVER_ERROR", message: err.message } },
      { status: 500 }
    );
  }
}
