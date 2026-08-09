import { NextResponse } from "next/server";
import { updateReviewStatusByAdminInDb, supabaseFetch } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const vendorId = searchParams.get("vendor_id");
    const status = searchParams.get("status");

    let query = "reviews?order=created_at.desc&select=id,rating,title,review_text,status,created_at,vendor_id,customer_id,vendors(id,vendor_code,vendor_profiles(business_name))";
    if (vendorId) query += `&vendor_id=eq.${encodeURIComponent(vendorId)}`;
    if (status) query += `&status=eq.${encodeURIComponent(status)}`;

    const res = await supabaseFetch(query);

    return NextResponse.json({
      success: true,
      statusCode: 200,
      data: res.data || [],
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, statusCode: 500, error: { code: "SERVER_ERROR", message: err.message } },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, status } = body;

    if (!id || !["published", "flagged", "hidden"].includes(status)) {
      return NextResponse.json(
        {
          success: false,
          statusCode: 400,
          error: {
            code: "VALIDATION_ERROR",
            message: "Review ID and valid status ('published', 'flagged', 'hidden') are required.",
          },
        },
        { status: 400 }
      );
    }

    const res = await updateReviewStatusByAdminInDb(id, status);

    if (res.error) {
      return NextResponse.json(
        { success: false, statusCode: 400, error: { code: "UPDATE_FAILED", message: res.error.message } },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      statusCode: 200,
      message: `Review status updated to ${status}. Vendor rating recalculated.`,
      data: res.data,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, statusCode: 500, error: { code: "SERVER_ERROR", message: err.message } },
      { status: 500 }
    );
  }
}
