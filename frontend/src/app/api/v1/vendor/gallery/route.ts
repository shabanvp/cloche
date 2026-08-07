import { NextResponse } from "next/server";
import { fetchVendorGalleryFromDb, saveVendorGalleryItemInDb, deleteVendorGalleryItemInDb } from "@/lib/supabase";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const vendorId = searchParams.get("vendor_id") || "7a51b1c0-c15b-42ed-aec2-fd5caf6b471c";

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
    const body = await req.json();
    const { vendor_id, title, image_url, is_cover } = body;

    if (!image_url) {
      return NextResponse.json(
        { success: false, statusCode: 400, error: { code: "VALIDATION_ERROR", message: "Image URL or data is required." } },
        { status: 400 }
      );
    }

    const res = await saveVendorGalleryItemInDb({
      vendor_id: vendor_id || "7a51b1c0-c15b-42ed-aec2-fd5caf6b471c",
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

    const { error } = await deleteVendorGalleryItemInDb(id);

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
