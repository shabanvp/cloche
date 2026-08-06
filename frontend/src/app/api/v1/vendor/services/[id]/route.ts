import { NextResponse } from "next/server";
import { saveVendorServiceToDb, softDeleteVendorServiceFromDb, supabaseFetch } from "@/lib/supabase";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const DEFAULT_VENDOR_UUID = "7a51b1c0-c15b-42ed-aec2-fd5caf6b471c";

async function resolveVendorUuid(rawId?: string | null): Promise<string> {
  if (rawId && UUID_REGEX.test(rawId)) {
    return rawId;
  }

  if (rawId && rawId !== "v-registered" && rawId !== "v-demo-vendor") {
    try {
      const res = await supabaseFetch(`vendors?or=(id.eq.${encodeURIComponent(rawId)},user_id.eq.${encodeURIComponent(rawId)})&select=id`);
      if (!res.error && Array.isArray(res.data) && res.data.length > 0 && res.data[0].id) {
        return res.data[0].id;
      }
    } catch (e) {}
  }

  return DEFAULT_VENDOR_UUID;
}

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

    const resolvedVendorId = await resolveVendorUuid(body.vendor_id);

    const payload: Record<string, any> = {
      vendor_id: resolvedVendorId,
      name: body.name ? body.name.trim() : "Service Title",
      description: body.description ? body.description.trim() : null,
      base_price: Number(body.base_price || 0),
      pricing_type: body.pricing_type || "fixed",
      status: body.status ? body.status.toLowerCase() : "published",
      is_active: body.is_active !== undefined ? Boolean(body.is_active) : true,
      updated_at: new Date().toISOString(),
    };

    if (UUID_REGEX.test(id)) {
      payload.id = id;
    }
    if (body.category_id && UUID_REGEX.test(body.category_id)) {
      payload.category_id = body.category_id;
    }
    if (body.duration) {
      payload.duration = Number(body.duration);
    }

    let { data, error } = await saveVendorServiceToDb(payload);

    if (error && (error.message.includes("category") || error.message.includes("uuid"))) {
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
