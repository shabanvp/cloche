import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/rbac";
import { supabaseFetch } from "@/lib/supabase";

type VendorProfile = {
  business_name?: string;
  city?: string;
  state?: string;
};

type VendorUser = {
  email?: string;
  full_name?: string;
  phone?: string;
};

type VendorCategory = {
  name?: string;
};

type AdminVendorRow = {
  id: string;
  vendor_code?: string;
  status?: string;
  publication_status?: string;
  created_at?: string;
  vendor_profiles?: VendorProfile | VendorProfile[];
  users?: VendorUser;
  vendor_categories?: VendorCategory;
};

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Unexpected server error";
}

export async function GET(req: Request) {
  const startTime = Date.now();
  try {
    const { response } = requireAuth(req, ["admin", "super_admin"]);
    if (response) return response;

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "pending";
    const limit = Number(searchParams.get("limit") || 50);

    const endpoint = `vendors?status=eq.${encodeURIComponent(status)}&deleted_at=is.null&select=*,users(id,email,full_name,phone),vendor_profiles(business_name,city,state,starting_price),vendor_categories(name,slug)&order=created_at.desc&limit=${limit}`;

    const res = await supabaseFetch<AdminVendorRow[]>(endpoint);
    console.log(`[DB:FETCH] admin_vendors status=${status} rows=${Array.isArray(res.data) ? res.data.length : 0} ms=${Date.now() - startTime}`);

    if (res.error || !Array.isArray(res.data)) {
      return NextResponse.json(
        { success: true, statusCode: 200, data: [] },
        { status: 200 }
      );
    }

    const applications = res.data.map((v) => {
      // PostgREST returns a to-one embedded relation as an object in some
      // deployments and as a single-item array in others. Both forms refer to
      // the same canonical, editable vendor_profiles.business_name field.
      const profile = Array.isArray(v.vendor_profiles)
        ? (v.vendor_profiles[0] || {})
        : (v.vendor_profiles || {});
      const userObj = v.users || {};

      return {
        id: v.id,
        vendorCode: v.vendor_code,
        boutique: profile.business_name || "Vendor Partner",
        ownerName: userObj.full_name || "N/A",
        email: userObj.email || "",
        phone: userObj.phone || "",
        origin: [profile.city, profile.state].filter(Boolean).join(", ") || "Kerala",
        category: v.vendor_categories?.name || "Vendor",
        date: v.created_at ? new Date(v.created_at).toLocaleDateString("en-IN") : new Date().toLocaleDateString("en-IN"),
        status: v.status,
        publicationStatus: v.publication_status,
      };
    });

    return NextResponse.json(
      {
        success: true,
        statusCode: 200,
        data: applications,
      },
      { status: 200, headers: { "Cache-Control": "no-store, max-age=0" } }
    );
  } catch (err: unknown) {
    console.error("[ADMIN_VENDORS_API] Error:", err);
    return NextResponse.json(
      { success: false, statusCode: 500, error: { code: "SERVER_ERROR", message: getErrorMessage(err) } },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  const startTime = Date.now();
  try {
    const { user, response } = requireAuth(req, ["admin", "super_admin"]);
    if (response) return response;

    const body: { vendorId?: string; action?: "approve" | "reject" | "suspend"; reason?: string } = await req.json();
    const { vendorId, action, reason } = body;

    if (!vendorId || !action || !["approve", "reject", "suspend"].includes(action)) {
      return NextResponse.json(
        { success: false, statusCode: 400, error: { code: "VALIDATION_ERROR", message: "Valid vendorId and action (approve, reject, suspend) required." } },
        { status: 400 }
      );
    }

    const newStatus = action === "approve" ? "active" : action === "reject" ? "rejected" : "suspended";
    const newPubStatus = action === "approve" ? "published" : "draft";

    const patchRes = await supabaseFetch(`vendors?id=eq.${encodeURIComponent(vendorId)}`, {
      method: "PATCH",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({
        status: newStatus,
        publication_status: newPubStatus,
        updated_at: new Date().toISOString(),
      }),
    });

    if (patchRes.error) {
      throw patchRes.error;
    }

    const updatedVendors = Array.isArray(patchRes.data) ? patchRes.data : [];
    if (updatedVendors.length !== 1) {
      return NextResponse.json(
        { success: false, statusCode: 404, error: { code: "VENDOR_NOT_FOUND", message: "Vendor application was not found." } },
        { status: 404 }
      );
    }

    console.log(`[DB:PATCH] table=vendors id=${vendorId} status=${newStatus} by=${user?.userId} ms=${Date.now() - startTime}`);

    // Log admin action to admin_logs table
    if (user?.userId) {
      await supabaseFetch(`admin_logs`, {
        method: "POST",
        headers: { Prefer: "return=representation" },
        body: JSON.stringify({
          admin_user_id: user.userId,
          action: `vendor_${action}`,
          target_type: "vendor",
          target_id: vendorId,
          details: { status: newStatus, reason: reason || null },
        }),
      }).catch(() => null);
    }

    return NextResponse.json(
      {
        success: true,
        statusCode: 200,
        message: `Vendor application ${action}d successfully.`,
        data: updatedVendors[0],
      },
      { status: 200, headers: { "Cache-Control": "no-store, max-age=0" } }
    );
  } catch (err: unknown) {
    console.error("[ADMIN_VENDORS_PATCH_API] Error:", err);
    return NextResponse.json(
      { success: false, statusCode: 500, error: { code: "SERVER_ERROR", message: getErrorMessage(err) } },
      { status: 500 }
    );
  }
}
