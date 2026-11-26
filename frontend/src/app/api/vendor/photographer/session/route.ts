import { NextResponse } from "next/server";
import { getSupabaseConfig, supabaseFetch } from "@/lib/supabase";
import { AUTH_COOKIE_NAME, SESSION_EXPIRY_DAYS, signJwtToken } from "@/lib/auth";
import { isPhotographerCategory } from "@/lib/photographerAuth";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const headerAuth = req.headers.get("authorization") || "";
    const accessToken = String(
      body?.accessToken || (headerAuth.toLowerCase().startsWith("bearer ") ? headerAuth.slice(7) : "")
    ).trim();

    if (!accessToken) {
      return NextResponse.json({ error: "Supabase accessToken is required." }, { status: 400 });
    }

    const { url, anonKey } = getSupabaseConfig();
    if (!url || !anonKey) {
      return NextResponse.json({ error: "Missing required Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (or legacy anon-key equivalent)." }, { status: 503 });
    }

    // Cryptographically verify Supabase session token against Supabase Auth
    const authUserRes = await fetch(`${url}/auth/v1/user`, {
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });

    if (!authUserRes.ok) {
      return NextResponse.json({ error: "Invalid or expired Supabase session." }, { status: 401 });
    }

    const authUser = await authUserRes.json();
    const authUserId = String(authUser?.id || "").trim();
    const cleanEmail = String(authUser?.email || "").trim().toLowerCase();
    if (!authUserId) {
      return NextResponse.json({ error: "Authenticated user not found." }, { status: 401 });
    }

    // Resolve matching public.users row (handles both supabase_user_id and direct id match)
    let userRow: any = null;
    const uById = await supabaseFetch<any[]>(
      `users?or=(id.eq.${encodeURIComponent(authUserId)},supabase_user_id.eq.${encodeURIComponent(authUserId)})&select=id,email,full_name,name,phone,is_active&limit=1`
    );
    if (Array.isArray(uById.data) && uById.data.length > 0) {
      userRow = uById.data[0];
    } else if (cleanEmail) {
      const uByEmail = await supabaseFetch<any[]>(
        `users?email=ilike.${encodeURIComponent(cleanEmail)}&select=id,email,full_name,name,phone,is_active&limit=1`
      );
      if (Array.isArray(uByEmail.data) && uByEmail.data.length > 0) {
        userRow = uByEmail.data[0];
      }
    }

    if (userRow && userRow.is_active === false) {
      return NextResponse.json({ error: "Account is deactivated." }, { status: 403 });
    }

    const resolvedUserId = String(userRow?.id || authUserId);

    // Resolve vendor owned by this user
    let vendorRow: any = null;
    const vRes = await supabaseFetch<any[]>(
      `vendors?or=(user_id.eq.${encodeURIComponent(resolvedUserId)},user_id.eq.${encodeURIComponent(authUserId)})&deleted_at=is.null&select=id,user_id,vendor_code,status,publication_status,category_id,vendor_categories(id,name,slug)&limit=1`
    );
    if (Array.isArray(vRes.data) && vRes.data.length > 0) {
      vendorRow = vRes.data[0];
    } else if (cleanEmail) {
      const cRes = await supabaseFetch<any[]>(
        `vendor_contacts?email=ilike.${encodeURIComponent(cleanEmail)}&select=vendor_id&limit=1`
      );
      const vid = Array.isArray(cRes.data) ? cRes.data[0]?.vendor_id : null;
      if (vid) {
        const vRes2 = await supabaseFetch<any[]>(
          `vendors?id=eq.${encodeURIComponent(vid)}&deleted_at=is.null&select=id,user_id,vendor_code,status,publication_status,category_id,vendor_categories(id,name,slug)&limit=1`
        );
        if (Array.isArray(vRes2.data) && vRes2.data.length > 0) {
          vendorRow = vRes2.data[0];
        }
      }
    }

    if (!vendorRow) {
      return NextResponse.json({ error: "No vendor record linked to this account." }, { status: 404 });
    }

    const vendorOwnerId = String(vendorRow.user_id || "");
    if (vendorOwnerId !== resolvedUserId && vendorOwnerId !== authUserId) {
      return NextResponse.json({ error: "This vendor profile is not linked to the authenticated account." }, { status: 403 });
    }

    const cat = Array.isArray(vendorRow.vendor_categories)
      ? vendorRow.vendor_categories[0]
      : vendorRow.vendor_categories;

    if (!isPhotographerCategory(cat?.slug) && !isPhotographerCategory(cat?.name)) {
      return NextResponse.json(
        { error: "Forbidden: Photographer session bridge is restricted to Photographer vendor accounts." },
        { status: 403 }
      );
    }

    const { data: profileRows } = await supabaseFetch<any[]>(
      `vendor_profiles?vendor_id=eq.${encodeURIComponent(vendorRow.id)}&select=business_name,slug&limit=1`
    );
    const profileRow = Array.isArray(profileRows) && profileRows.length > 0 ? profileRows[0] : null;

    const fullName =
      userRow?.full_name ||
      userRow?.name ||
      profileRow?.business_name ||
      cleanEmail.split("@")[0] ||
      "Photographer Partner";
    const resolvedEmail = String(userRow?.email || cleanEmail);
    const roles = ["vendor", "customer"];

    const jwtToken = signJwtToken({
      userId: resolvedUserId,
      email: resolvedEmail,
      fullName,
      roles,
    });

    const userObj = {
      id: resolvedUserId,
      email: resolvedEmail,
      fullName,
      name: fullName,
      full_name: fullName,
      roles,
      role: "vendor",
    };

    const res = NextResponse.json({
      success: true,
      data: {
        userId: resolvedUserId,
        vendorId: vendorRow.id,
        slug: profileRow?.slug || vendorRow.vendor_code || vendorRow.id,
        businessName: profileRow?.business_name || fullName,
        category: "photographers",
        redirectTo: "/vendor/photographer",
      },
    });

    const maxAge = SESSION_EXPIRY_DAYS * 24 * 60 * 60;
    const isProd = process.env.NODE_ENV === "production";

    res.cookies.set(AUTH_COOKIE_NAME, jwtToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      maxAge,
      path: "/",
    });
    res.cookies.set("auth_token", jwtToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      maxAge,
      path: "/",
    });
    res.cookies.set("user_role", "vendor", {
      httpOnly: false,
      secure: isProd,
      sameSite: "lax",
      maxAge,
      path: "/",
    });
    res.cookies.set("user_data", encodeURIComponent(JSON.stringify(userObj)), {
      httpOnly: false,
      secure: isProd,
      sameSite: "lax",
      maxAge,
      path: "/",
    });

    return res;
  } catch (err: any) {
    console.error("[PHOTOGRAPHER_SESSION_BRIDGE]", err);
    return NextResponse.json(
      { error: err?.message || "Failed to establish photographer session." },
      { status: 500 }
    );
  }
}

