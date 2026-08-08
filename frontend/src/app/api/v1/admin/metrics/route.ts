import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/rbac";
import { supabaseFetch } from "@/lib/supabase";

export async function GET(req: Request) {
  const startTime = Date.now();
  try {
    const { response } = requireAuth(req, ["admin", "super_admin"]);
    if (response) return response;

    const [vendorsRes, usersRes, leadsRes, bookingsRes, reviewsRes] = await Promise.all([
      supabaseFetch(`vendors?deleted_at=is.null&select=id,status`),
      supabaseFetch(`users?deleted_at=is.null&select=id`),
      supabaseFetch(`leads?deleted_at=is.null&select=id,status`),
      supabaseFetch(`bookings?deleted_at=is.null&select=id,status,total_amount`),
      supabaseFetch(`reviews?select=id`),
    ]);

    console.log(`[DB:FETCH] admin_metrics ms=${Date.now() - startTime}`);

    const vendors = Array.isArray(vendorsRes.data) ? vendorsRes.data : [];
    const users = Array.isArray(usersRes.data) ? usersRes.data : [];
    const leads = Array.isArray(leadsRes.data) ? leadsRes.data : [];
    const bookings = Array.isArray(bookingsRes.data) ? bookingsRes.data : [];
    const reviews = Array.isArray(reviewsRes.data) ? reviewsRes.data : [];

    const activeVendors = vendors.filter((v: any) => v.status === "active").length;
    const pendingVendors = vendors.filter((v: any) => v.status === "pending").length;
    const totalRevenue = bookings.reduce((sum: number, b: any) => sum + Number(b.total_amount || 0), 0);

    return NextResponse.json(
      {
        success: true,
        statusCode: 200,
        data: {
          totalVendors: vendors.length,
          activeVendors,
          pendingVendors,
          totalUsers: users.length,
          totalLeads: leads.length,
          newLeads: leads.filter((l: any) => l.status === "new").length,
          totalBookings: bookings.length,
          totalReviews: reviews.length,
          totalRevenue,
        },
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("[ADMIN_METRICS_API] Error:", err);
    return NextResponse.json(
      { success: false, statusCode: 500, error: { code: "SERVER_ERROR", message: err.message } },
      { status: 500 }
    );
  }
}
