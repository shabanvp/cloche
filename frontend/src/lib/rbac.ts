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

  // 1. Try Bearer token from headers
  if ("headers" in request && typeof request.headers?.get === "function") {
    const authHeader = request.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7).trim();
    }
  }

  // 2. Try auth cookie
  if (!token && "cookies" in request) {
    if (typeof request.cookies?.get === "function") {
      const cookieObj = request.cookies.get("cloche_auth_token");
      token = cookieObj ? cookieObj.value : null;
    } else if (typeof request.cookies === "string") {
      const match = request.cookies.match(/cloche_auth_token=([^;]+)/);
      if (match) token = match[1];
    }
  }

  if (!token) return null;

  const payload = verifyJwtToken(token);
  if (!payload) return null;

  return {
    ...payload,
    id: payload.userId,
  };
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
