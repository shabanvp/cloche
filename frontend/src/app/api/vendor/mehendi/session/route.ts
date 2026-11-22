import { NextResponse } from "next/server";
import { getSupabaseConfig, supabaseFetch } from "@/lib/supabase";
import { AUTH_COOKIE_NAME, SESSION_EXPIRY_DAYS, signJwtToken } from "@/lib/auth";
import { isMehendiCategory } from "@/lib/mehendiAuth";

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

    const { url, serviceKey, anonKey } = getSupabaseConfig();
    const apiKey = serviceKey || anonKey;
    if (!url || !apiKey) {
      return NextResponse.json({ error: "Supabase configuration missing." }, { status: 500 });
    }

    // Verify Supabase session token
    const authUserRes = await fetch(`${url}/auth/v1/user`, {
      headers: {
        apikey: anonKey || apiKey,
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

    // Resolve matching public.users row
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

    const cat = Array.isArray(vendorRow.vendor_categories)
      ? vendorRow.vendor_categories[0]
      : vendorRow.vendor_categories;

    if (!isMehendiCategory(cat?.slug) && !isMehendiCategory(cat?.name)) {
      return NextResponse.json(
        { error: "Forbidden: Mehendi session bridge is restricted to Mehendi Artist accounts." },
        { status: 403 }
      );
    }

    const [{ data: pRows }] = await Promise.all([
      supabaseFetch<any[]>(
        `vendor_profiles?vendor_id=eq.${encodeURIComponent(vendorRow.id)}&select=business_name,slug&limit=1`
      ),
    ]);
    const pRow = Array.isArray(pRows) && pRows[0] ? pRows[0] : null;

    const payload = {
      userId: resolvedUserId,
      email: cleanEmail || userRow?.email || authUser.email,
      fullName: userRow?.full_name || userRow?.name || authUser?.user_metadata?.full_name || "Mehendi Artist",
      roles: ["vendor", "customer"],
      role: "vendor",
      vendorId: vendorRow.id,
      vendorCategory: "mehendi",
      vendorSlug: pRow?.slug || vendorRow.id,
    };

    const token = signJwtToken(payload, SESSION_EXPIRY_DAYS);
    const maxAgeSec = SESSION_EXPIRY_DAYS * 24 * 60 * 60;
    const isProduction = process.env.NODE_ENV === "production";
    const cookieBase = `Path=/; Max-Age=${maxAgeSec}; SameSite=Lax${isProduction ? "; Secure" : ""}`;

    const headers = new Headers();
    headers.append("Set-Cookie", `${AUTH_COOKIE_NAME}=${token}; ${cookieBase}`);
    headers.append("Set-Cookie", `cloche_auth_token=${token}; ${cookieBase}`);
    headers.append("Set-Cookie", `user_role=vendor; ${cookieBase}`);
    headers.append(
      "Set-Cookie",
      `user_data=${encodeURIComponent(
        JSON.stringify({
          userId: resolvedUserId,
          email: payload.email,
          name: payload.fullName,
          fullName: payload.fullName,
          role: "vendor",
          vendorId: vendorRow.id,
          vendorCategory: "mehendi",
        })
      )}; ${cookieBase}`
    );

    return new NextResponse(
      JSON.stringify({
        success: true,
        vendorId: vendorRow.id,
        userId: resolvedUserId,
        businessName: pRow?.business_name || payload.fullName,
        slug: pRow?.slug || vendorRow.id,
        category: "mehendi",
      }),
      { status: 200, headers }
    );
  } catch (err: any) {
    console.error("[MEHENDI_SESSION_POST]", err);
    return NextResponse.json(
      { error: err?.message || "Failed to establish Mehendi vendor session." },
      { status: 500 }
    );
  }
}

