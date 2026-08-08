import { NextResponse } from "next/server";
import { fetchVendorBookingsFromDb, supabaseFetch } from "@/lib/supabase";
import { requireAuthenticatedVendor } from "@/lib/vendorAuth";

export async function GET(req: Request) {
  try {
    const auth = await requireAuthenticatedVendor(req);
    if (auth.response) return auth.response;
    const { searchParams } = new URL(req.url);
    const vendorId = auth.vendorId;
    const status = searchParams.get("status") || "all";

    const { data, error } = await fetchVendorBookingsFromDb(vendorId, status);

    if (error) {
      return NextResponse.json(
        { success: false, statusCode: 500, error: { code: "FETCH_FAILED", message: error.message } },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, statusCode: 200, data: data || [] },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, statusCode: 500, error: { code: "SERVER_ERROR", message: err.message } },
      { status: 500 }
    );
  }
}
