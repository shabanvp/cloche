import { NextResponse } from "next/server";
import { saveVendorServiceToDb, softDeleteVendorServiceFromDb, supabaseFetch } from "@/lib/supabase";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { data, error } = await supabaseFetch(`vendor_services?id=eq.${encodeURIComponent(id)}&select=*,vendor_service_images(*)`);

    if (error || !data || data.length === 0) {
      return NextResponse.json(
        { success: false, statusCode: 404, error: { code: "NOT_FOUND", message: "Service not found." } },
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

    const payload: Record<string, any> = {
      id,
      vendor_id: body.vendor_id || "v-demo-vendor",
      name: body.name ? body.name.trim() : "Service Title",
      description: body.description ? body.description.trim() : null,
      base_price: Number(body.base_price || 0),
      pricing_type: body.pricing_type || "fixed",
      status: body.status ? body.status.toLowerCase() : "published",
      is_active: body.is_active !== undefined ? Boolean(body.is_active) : true,
      updated_at: new Date().toISOString(),
    };

    if (body.category_id) {
      payload.category_id = body.category_id;
    }
    if (body.duration) {
      payload.duration = Number(body.duration);
    }

    let { data, error } = await saveVendorServiceToDb(payload);

    if (error && error.message.includes("category")) {
      delete payload.category_id;
      const retryRes = await saveVendorServiceToDb(payload);
      data = retryRes.data;
      error = retryRes.error;
    }

    if (error) {
      return NextResponse.json(
        { success: false, statusCode: 500, error: { code: "UPDATE_FAILED", message: error.message } },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, statusCode: 200, message: "Service updated successfully", data },
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
    const { error } = await softDeleteVendorServiceFromDb(id);

    if (error) {
      return NextResponse.json(
        { success: false, statusCode: 500, error: { code: "DELETE_FAILED", message: error.message } },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, statusCode: 200, message: "Service deleted successfully" },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, statusCode: 500, error: { code: "SERVER_ERROR", message: err.message } },
      { status: 500 }
    );
  }
}
