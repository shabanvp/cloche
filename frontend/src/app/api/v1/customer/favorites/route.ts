import { NextResponse } from "next/server";
import { fetchCustomerFavoritesFromDb, saveFavoriteVendorInDb, removeFavoriteVendorInDb } from "@/lib/supabase";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const customerId = searchParams.get("customer_id") || "c-demo-user";
    const { data, error } = await fetchCustomerFavoritesFromDb(customerId);

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

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { customer_id, vendor_id } = body;

    if (!customer_id || !vendor_id) {
      return NextResponse.json(
        { success: false, statusCode: 400, error: { code: "VALIDATION_ERROR", message: "Customer ID and Vendor ID required." } },
        { status: 400 }
      );
    }

    const { data, error } = await saveFavoriteVendorInDb(customer_id, vendor_id);

    if (error) {
      return NextResponse.json(
        { success: false, statusCode: 500, error: { code: "SAVE_FAILED", message: error.message } },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, statusCode: 201, message: "Vendor saved to favorites!", data },
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
    const { searchParams } = new URL(req.url);
    const customerId = searchParams.get("customer_id") || "c-demo-user";
    const vendorId = searchParams.get("vendor_id");

    if (!vendorId) {
      return NextResponse.json(
        { success: false, statusCode: 400, error: { code: "VALIDATION_ERROR", message: "Vendor ID is required." } },
        { status: 400 }
      );
    }

    await removeFavoriteVendorInDb(customerId, vendorId);

    return NextResponse.json(
      { success: true, statusCode: 200, message: "Vendor removed from favorites." },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, statusCode: 500, error: { code: "SERVER_ERROR", message: err.message } },
      { status: 500 }
    );
  }
}
