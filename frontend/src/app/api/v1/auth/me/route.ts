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

    // Fetch fresh user profile from DB (using valid PostgREST select string)
    const userRes = await fetch(
      `${url}/rest/v1/users?id=eq.${encodeURIComponent(authUser.userId)}&select=id,email,full_name,name,phone,avatar_url,is_verified,created_at`,
      {
        headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` },
      }
    ).catch(() => null);

    if (userRes && userRes.ok) {
      const users = await userRes.json();
      if (Array.isArray(users) && users.length > 0) {
        const u = users[0];
        const displayName = u.full_name || u.name || authUser.fullName || u.email.split("@")[0];

        return NextResponse.json(
          {
            success: true,
            statusCode: 200,
            data: {
              user: {
                id: u.id,
                email: u.email,
                fullName: displayName,
                phone: u.phone,
                avatarUrl: u.avatar_url,
                isVerified: u.is_verified,
                roles: authUser.roles && authUser.roles.length > 0 ? authUser.roles : ["customer"],
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
