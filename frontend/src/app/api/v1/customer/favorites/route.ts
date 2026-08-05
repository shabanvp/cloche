import { NextResponse } from "next/server";
import { fetchCustomerFavoritesFromDb, saveFavoriteVendorInDb, removeFavoriteVendorInDb } from "@/lib/supabase";
import { getAuthenticatedCustomerUser } from "@/lib/customerAuth";

export async function GET(req: Request) {
  try {
    const authUser = await getAuthenticatedCustomerUser(req);
    if (!authUser) {
      console.log("[WISHLIST API GET] Unauthorized request - customer login required.");
      return NextResponse.json(
        { success: false, statusCode: 401, error: { code: "UNAUTHORIZED", message: "Customer login required." } },
        { status: 401 }
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
      console.log("[WISHLIST API POST] Unauthorized request - customer login required.");
      return NextResponse.json(
        { success: false, statusCode: 401, error: { code: "UNAUTHORIZED", message: "Customer login required." } },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { vendor_id } = body;

    console.log("-----------------------------------------");
    console.log("Authenticated User ID:", authUser.userId);
    console.log("Vendor ID:", vendor_id);

    if (!vendor_id) {
      console.log("Validation Error: Vendor ID is required.");
      return NextResponse.json(
        { success: false, statusCode: 400, error: { code: "VALIDATION_ERROR", message: "Vendor ID required." } },
        { status: 400 }
      );
    }

    const { data, error } = await saveFavoriteVendorInDb(authUser.userId, vendor_id, authUser.email);

    console.log("Insert Result:", data);
    console.log("Database Error (if any):", error);
    console.log("-----------------------------------------");

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
      console.log("[WISHLIST API DELETE] Unauthorized request - customer login required.");
      return NextResponse.json(
        { success: false, statusCode: 401, error: { code: "UNAUTHORIZED", message: "Customer login required." } },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const vendorId = searchParams.get("vendor_id");

    console.log("-----------------------------------------");
    console.log("[WISHLIST API DELETE] Authenticated User ID:", authUser.userId);
    console.log("[WISHLIST API DELETE] Vendor ID:", vendorId);

    if (!vendorId) {
      return NextResponse.json(
        { success: false, statusCode: 400, error: { code: "VALIDATION_ERROR", message: "Vendor ID is required." } },
        { status: 400 }
      );
    }

    const { error } = await removeFavoriteVendorInDb(authUser.userId, vendorId);
    console.log("[WISHLIST API DELETE] Delete Result Error (if any):", error);
    console.log("-----------------------------------------");

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
