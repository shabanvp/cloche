import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/rbac";
import { getSupabaseConfig } from "@/lib/supabase";

export async function GET(req: Request) {
  try {
    const authUser = getAuthenticatedUser(req as any);

    if (!authUser) {
      return NextResponse.json(
        {
          success: false,
          statusCode: 401,
          error: { code: "UNAUTHORIZED", message: "Not authenticated or session expired." },
        },
        { status: 401 }
      );
    }

    const { url, anonKey } = getSupabaseConfig();
    if (!url || !anonKey) {
      return NextResponse.json(
        {
          success: true,
          statusCode: 200,
          data: { user: authUser },
        },
        { status: 200 }
      );
    }

    // Fetch fresh user profile from DB
    const userRes = await fetch(
      `${url}/rest/v1/users?id=eq.${encodeURIComponent(authUser.userId)}&select=id,email,full_name,phone,avatar_url,is_verified,created_at,user_roles(roles(name))`,
      {
        headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` },
      }
    );

    if (userRes.ok) {
      const users = await userRes.json();
      if (Array.isArray(users) && users.length > 0) {
        const u = users[0];
        let roles = authUser.roles;
        if (Array.isArray(u.user_roles) && u.user_roles.length > 0) {
          roles = u.user_roles.map((ur: any) => ur.roles?.name).filter(Boolean);
        }

        return NextResponse.json(
          {
            success: true,
            statusCode: 200,
            data: {
              user: {
                id: u.id,
                email: u.email,
                fullName: u.full_name,
                phone: u.phone,
                avatarUrl: u.avatar_url,
                isVerified: u.is_verified,
                roles: roles.length > 0 ? roles : ["customer"],
                createdAt: u.created_at,
              },
            },
          },
          { status: 200 }
        );
      }
    }

    return NextResponse.json(
      {
        success: true,
        statusCode: 200,
        data: { user: authUser },
      },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, statusCode: 500, error: { code: "SERVER_ERROR", message: err.message } },
      { status: 500 }
    );
  }
}
