import { NextResponse } from "next/server";
import { fetchPublicVendorProfileFromDb } from "@/lib/supabase";

export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    if (!slug) {
      return NextResponse.json(
        { success: false, statusCode: 400, error: { code: "VALIDATION_ERROR", message: "Slug is required." } },
        { status: 400 }
      );
    }

    const { data, error } = await fetchPublicVendorProfileFromDb(slug);

    if (error || !data) {
      return NextResponse.json(
        { success: false, statusCode: 404, error: { code: "VENDOR_NOT_FOUND", message: "Vendor profile not found in database." } },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        statusCode: 200,
        data,
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("[PUBLIC_VENDOR_SLUG_API] Error:", err);
    return NextResponse.json(
      { success: false, statusCode: 500, error: { code: "SERVER_ERROR", message: err.message } },
      { status: 500 }
    );
  }
}
