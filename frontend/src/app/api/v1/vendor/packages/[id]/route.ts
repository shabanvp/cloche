import { NextResponse } from "next/server";
import { saveVendorPackageToDb, softDeleteVendorPackageFromDb, supabaseFetch } from "@/lib/supabase";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { data, error } = await supabaseFetch(`vendor_service_packages?id=eq.${encodeURIComponent(id)}&select=*`);

    if (error || !data || data.length === 0) {
      return NextResponse.json(
        { success: false, statusCode: 404, error: { code: "NOT_FOUND", message: "Package not found." } },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, statusCode: 200, data: data[0] },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, statusCode: 500, error: { code: "SERVER_ERROR", message: err.message } },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();

    const payload = {
      id,
      ...body,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await saveVendorPackageToDb(payload);

    if (error) {
      return NextResponse.json(
        { success: false, statusCode: 500, error: { code: "UPDATE_FAILED", message: error.message } },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, statusCode: 200, message: "Package updated successfully", data },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, statusCode: 500, error: { code: "SERVER_ERROR", message: err.message } },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { error } = await softDeleteVendorPackageFromDb(id);

    if (error) {
      return NextResponse.json(
        { success: false, statusCode: 500, error: { code: "DELETE_FAILED", message: error.message } },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, statusCode: 200, message: "Package deleted successfully" },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, statusCode: 500, error: { code: "SERVER_ERROR", message: err.message } },
      { status: 500 }
    );
  }
}
