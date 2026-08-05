import { NextResponse } from "next/server";
import {
  fetchComparisonsFromDb,
  addVendorToComparisonInDb,
  removeVendorFromComparisonInDb,
} from "@/lib/supabase";
import { getAuthenticatedCustomerUser } from "@/lib/customerAuth";

export async function GET(req: Request) {
  try {
    const authUser = await getAuthenticatedCustomerUser(req);
    if (!authUser) {
      return NextResponse.json(
        { success: false, statusCode: 401, error: { code: "UNAUTHORIZED", message: "Customer login required." } },
        { status: 401 }
      );
    }

    const { data, error } = await fetchComparisonsFromDb(authUser.userId);

    if (error) {
      return NextResponse.json(
        { success: false, statusCode: 500, error: { code: "FETCH_FAILED", message: error.message } },
        { status: 500 }
      );
    }

    const items = data && data.length > 0 ? data[0].vendor_comparison_items || [] : [];
    const vendors = items.map((i: any) => i.vendors).filter(Boolean);

    return NextResponse.json(
      { success: true, statusCode: 200, data: vendors },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, statusCode: 500, error: { code: "SERVER_ERROR", message: err.message } },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const authUser = await getAuthenticatedCustomerUser(req);
    if (!authUser) {
      return NextResponse.json(
        { success: false, statusCode: 401, error: { code: "UNAUTHORIZED", message: "Customer login required." } },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { vendor_id } = body;

    if (!vendor_id) {
      return NextResponse.json(
        { success: false, statusCode: 400, error: { code: "VALIDATION_ERROR", message: "Vendor ID required." } },
        { status: 400 }
      );
    }

    const { data, error } = await addVendorToComparisonInDb(authUser.userId, vendor_id);

    if (error) {
      return NextResponse.json(
        { success: false, statusCode: 400, error: { code: "LIMIT_EXCEEDED", message: error.message } },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: true, statusCode: 201, message: "Vendor added to comparison matrix.", data },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, statusCode: 500, error: { code: "SERVER_ERROR", message: err.message } },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const authUser = await getAuthenticatedCustomerUser(req);
    if (!authUser) {
      return NextResponse.json(
        { success: false, statusCode: 401, error: { code: "UNAUTHORIZED", message: "Customer login required." } },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const vendorId = searchParams.get("vendor_id");

    if (!vendorId) {
      return NextResponse.json(
        { success: false, statusCode: 400, error: { code: "VALIDATION_ERROR", message: "Vendor ID required." } },
        { status: 400 }
      );
    }

    await removeVendorFromComparisonInDb(authUser.userId, vendorId);

    return NextResponse.json(
      { success: true, statusCode: 200, message: "Vendor removed from comparison matrix." },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, statusCode: 500, error: { code: "SERVER_ERROR", message: err.message } },
      { status: 500 }
    );
  }
}
