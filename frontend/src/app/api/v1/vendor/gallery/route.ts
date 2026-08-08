import { NextResponse } from "next/server";
import { fetchVendorGalleryFromDb, saveVendorGalleryItemInDb, deleteVendorGalleryItemInDb } from "@/lib/supabase";
import { requireAuthenticatedVendor } from "@/lib/vendorAuth";

export async function GET(req: Request) {
  try {
    const auth = await requireAuthenticatedVendor(req);
    if (auth.response) return auth.response;
    const vendorId = auth.vendorId;

    const { data, error } = await fetchVendorGalleryFromDb(vendorId);

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
    const auth = await requireAuthenticatedVendor(req);
    if (auth.response) return auth.response;
    const body = await req.json();
    const { title, image_url, is_cover } = body;

    if (!image_url) {
      return NextResponse.json(
        { success: false, statusCode: 400, error: { code: "VALIDATION_ERROR", message: "Image URL or data is required." } },
        { status: 400 }
      );
    }

    const res = await saveVendorGalleryItemInDb({
      vendor_id: auth.vendorId,
      title: title || "Studio Showcase Photo",
      image_url: image_url,
      is_cover: Boolean(is_cover),
    });

    if (res.error) {
      return NextResponse.json(
        { success: false, statusCode: 500, error: { code: "SAVE_FAILED", message: res.error.message } },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, statusCode: 201, message: "Gallery photo saved successfully.", data: res.data },
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
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, statusCode: 400, error: { code: "MISSING_ID", message: "Photo ID is required." } },
        { status: 400 }
      );
    }

    const auth = await requireAuthenticatedVendor(req);
    if (auth.response) return auth.response;

    const { error } = await deleteVendorGalleryItemInDb(id, auth.vendorId);

    if (error) {
      return NextResponse.json(
        { success: false, statusCode: 500, error: { code: "DELETE_FAILED", message: error.message } },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, statusCode: 200, message: "Photo deleted successfully." },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, statusCode: 500, error: { code: "SERVER_ERROR", message: err.message } },
      { status: 500 }
    );
  }
}
