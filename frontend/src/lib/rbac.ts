/**
 * CLOCHE WEDDING PLATFORM - ROLE-BASED ACCESS CONTROL (RBAC) GUARDS
 * File: frontend/src/lib/rbac.ts
 */

import { verifyJwtToken, TokenPayload } from "./auth";

export type RoleName = "super_admin" | "admin" | "vendor" | "customer";

export interface AuthenticatedUser extends TokenPayload {
  id: string;
}

/**
 * Extract authenticated user from Authorization header or auth cookie
 */
export function getAuthenticatedUser(request: Request | { cookies?: any; headers?: any }): AuthenticatedUser | null {
  let token: string | null = null;
  let rawUserData: string | null = null;

  // 1. Try Bearer token from headers
  if ("headers" in request && typeof request.headers?.get === "function") {
    const authHeader = request.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7).trim();
    }
  }

  // 2. Try auth cookie
  if ("cookies" in request) {
    if (typeof request.cookies?.get === "function") {
      const c1 = request.cookies.get("cloche_auth_token");
      const c2 = request.cookies.get("auth_token");
      const c3 = request.cookies.get("user_data");
      token = token || (c1 ? c1.value : null) || (c2 ? c2.value : null);
      rawUserData = c3 ? c3.value : null;
    } else if (typeof request.cookies === "string") {
      const m1 = request.cookies.match(/cloche_auth_token=([^;]+)/);
      const m2 = request.cookies.match(/auth_token=([^;]+)/);
      const m3 = request.cookies.match(/user_data=([^;]+)/);
      token = token || (m1 ? m1[1] : null) || (m2 ? m2[1] : null);
      rawUserData = m3 ? decodeURIComponent(m3[1]) : null;
    }
  }

  if (token) {
    const payload = verifyJwtToken(token);
    if (payload) {
      return {
        ...payload,
        id: payload.userId,
      };
    }
  }

  // Fallback to user_data cookie parsing
  if (rawUserData) {
    try {
      const u = JSON.parse(rawUserData);
      if (u && (u.id || u.userId)) {
        const uId = u.id || u.userId;
        return {
          userId: uId,
          id: uId,
          email: u.email || "",
          fullName: u.full_name || u.name || u.boutique_name || "Vendor",
          roles: u.roles || ["vendor"],
          iat: Math.floor(Date.now() / 1000),
          exp: Math.floor(Date.now() / 1000) + 86400 * 7,
        };
      }
    } catch (e) {}
  }

  return null;
}

/**
 * Check if authenticated user has any of the target roles
 */
export function hasRole(user: AuthenticatedUser | null, allowedRoles: RoleName[]): boolean {
  if (!user || !user.roles || !Array.isArray(user.roles)) return false;
  // Super admin has all role permissions
  if (user.roles.includes("super_admin")) return true;
  return allowedRoles.some((role) => user.roles.includes(role));
}

/**
 * RBAC Guard for API routes. Returns null if authorized, or a 401/403 Response if rejected.
 */
export function requireAuth(
  request: Request,
  allowedRoles?: RoleName[]
): { user: AuthenticatedUser | null; response: Response | null } {
  const user = getAuthenticatedUser(request);

  if (!user) {
    return {
      user: null,
      response: new Response(
        JSON.stringify({
          success: false,
          statusCode: 401,
          error: {
            code: "UNAUTHORIZED",
            message: "Authentication token missing or invalid. Please log in.",
          },
        }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      ),
    };
  }

  if (allowedRoles && allowedRoles.length > 0 && !hasRole(user, allowedRoles)) {
    return {
      user,
      response: new Response(
        JSON.stringify({
          success: false,
          statusCode: 403,
          error: {
            code: "FORBIDDEN",
            message: `Access denied. Requires one of the following roles: [${allowedRoles.join(", ")}]`,
          },
        }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      ),
    };
  }

  return { user, response: null };
}
