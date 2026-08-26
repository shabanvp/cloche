import { NextResponse } from "next/server";
import { fetchCustomerFavoritesFromDb, saveFavoriteVendorInDb, removeFavoriteVendorInDb } from "@/lib/supabase";
import { getAuthenticatedCustomerUser } from "@/lib/customerAuth";

export async function GET(req: Request) {
  try {
    const authUser = await getAuthenticatedCustomerUser(req);
    if (!authUser) {
      return NextResponse.json(
        { success: true, statusCode: 200, data: [] },
        { status: 200 }
      );
    }

    console.log("[WISHLIST API GET] Authenticated User ID:", authUser.userId);
    const { data, error } = await fetchCustomerFavoritesFromDb(authUser.userId);

    if (error) {
      console.error("[WISHLIST API GET] Database Error:", error);
      return NextResponse.json(
        { success: false, statusCode: 500, error: { code: "FETCH_FAILED", message: error.message } },
        { status: 500 }
      );
    }

    console.log("[WISHLIST API GET] Successfully returned favorites count:", Array.isArray(data) ? data.length : 0);
    return NextResponse.json(
      { success: true, statusCode: 200, data: data || [] },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("[WISHLIST API GET] Server Error:", err.message);
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

    const { data, error } = await saveFavoriteVendorInDb(authUser.userId, vendor_id, authUser.email);

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
    console.error("[WISHLIST API POST] Exception:", err.message);
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
        { success: false, statusCode: 400, error: { code: "VALIDATION_ERROR", message: "Vendor ID is required." } },
        { status: 400 }
      );
    }

    const { error } = await removeFavoriteVendorInDb(authUser.userId, vendorId);

    return NextResponse.json(
      { success: true, statusCode: 200, message: "Vendor removed from favorites." },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("[WISHLIST API DELETE] Exception:", err.message);
    return NextResponse.json(
      { success: false, statusCode: 500, error: { code: "SERVER_ERROR", message: err.message } },
      { status: 500 }
    );
  }
}
