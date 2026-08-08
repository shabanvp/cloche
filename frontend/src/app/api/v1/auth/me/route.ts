import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/rbac";
import { getSupabaseConfig } from "@/lib/supabase";
import { prisma } from "@/lib/database";

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

    // Fetch fresh user profile from PostgreSQL DB via Prisma
    const user = await prisma.user.findUnique({
      where: { id: authUser.userId },
      include: {
        userRoles: {
          include: {
            role: true
          }
        }
      }
    });

    if (user) {
      let roles = authUser.roles;
      if (user.userRoles && user.userRoles.length > 0) {
        roles = user.userRoles.map(ur => ur.role?.name).filter((name): name is string => typeof name === "string");
      }

      return NextResponse.json(
        {
          success: true,
          statusCode: 200,
          data: {
            user: {
              id: user.id,
              email: user.email,
              fullName: user.fullName || user.name,
              phone: user.phone,
              avatarUrl: user.avatarUrl,
              isVerified: user.isVerified,
              roles: roles.length > 0 ? roles : ["customer"],
              createdAt: user.createdAt,
            },
          },
        },
        { status: 200 }
      );
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
