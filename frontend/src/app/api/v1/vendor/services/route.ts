import { NextResponse } from "next/server";
import { getSupabaseConfig, fetchVendorServicesFromDb, saveVendorServiceToDb, softDeleteVendorServiceFromDb, supabaseFetch } from "@/lib/supabase";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const DEFAULT_VENDOR_UUID = "7a51b1c0-c15b-42ed-aec2-fd5caf6b471c";

async function resolveVendorUuid(rawId?: string | null): Promise<string> {
  if (rawId && UUID_REGEX.test(rawId)) {
    return rawId;
  }

  // Query vendors table to try resolving by user_id or slug if non-UUID string was passed
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

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const rawVendorId = searchParams.get("vendor_id");
    const vendorId = await resolveVendorUuid(rawVendorId);

    const { data, error } = await fetchVendorServicesFromDb(vendorId);

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
    const { vendor_id, category_id, name, description, base_price, pricing_type, duration, status, is_active, images } = body;

    if (!name || base_price === undefined || base_price < 0) {
      return NextResponse.json(
        { success: false, statusCode: 400, error: { code: "VALIDATION_ERROR", message: "Service name and valid non-negative base price are required." } },
        { status: 400 }
      );
    }

    const resolvedVendorId = await resolveVendorUuid(vendor_id);

    const payload: Record<string, any> = {
      vendor_id: resolvedVendorId,
      name: name.trim(),
      description: description ? description.trim() : null,
      base_price: Number(base_price),
      pricing_type: pricing_type || "fixed",
      status: status ? status.toLowerCase() : "published",
      is_active: is_active !== undefined ? Boolean(is_active) : true,
      updated_at: new Date().toISOString(),
    };

    if (category_id && UUID_REGEX.test(category_id)) {
      payload.category_id = category_id;
    }
    if (duration) {
      payload.duration = Number(duration);
    }
    if (body.id && UUID_REGEX.test(body.id)) {
      payload.id = body.id;
    }

    let { data, error } = await saveVendorServiceToDb(payload);

    // Fallback retry without category_id if foreign key or schema cache error occurs
    if (error && (error.message.includes("category") || error.message.includes("uuid"))) {
      delete payload.category_id;
      const retryRes = await saveVendorServiceToDb(payload);
      data = retryRes.data;
      error = retryRes.error;
    }

    if (error) {
      return NextResponse.json(
        { success: false, statusCode: 500, error: { code: "SAVE_FAILED", message: error.message } },
        { status: 500 }
      );
    }

    const createdService = Array.isArray(data) ? data[0] : data;

    // Save image gallery if provided
    if (Array.isArray(images) && images.length > 0 && createdService?.id) {
      const { url, serviceKey, anonKey } = getSupabaseConfig();
      const apiKey = serviceKey || anonKey;
      if (url && apiKey) {
        for (let i = 0; i < images.length; i++) {
          const imgUrl = typeof images[i] === "string" ? images[i] : images[i].image_url;
          if (imgUrl) {
            await fetch(`${url}/rest/v1/vendor_service_images`, {
              method: "POST",
              headers: { "Content-Type": "application/json", apikey: apiKey, Authorization: `Bearer ${apiKey}` },
              body: JSON.stringify({
                service_id: createdService.id,
                image_url: imgUrl,
                sort_order: i,
              }),
            }).catch(() => null);
          }
        }
      }
    }

    return NextResponse.json(
      { success: true, statusCode: body.id ? 200 : 201, message: body.id ? "Service updated successfully" : "Service saved successfully.", data: createdService },
      { status: body.id ? 200 : 201 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, statusCode: 500, error: { code: "SERVER_ERROR", message: err.message } },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  return POST(req);
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, statusCode: 400, error: { code: "MISSING_ID", message: "Service ID parameter is required." } },
        { status: 400 }
      );
    }

    const { error } = await softDeleteVendorServiceFromDb(id);

    if (error) {
      return NextResponse.json(
        { success: false, statusCode: 500, error: { code: "DELETE_FAILED", message: error.message } },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, statusCode: 200, message: "Service deleted successfully." },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, statusCode: 500, error: { code: "SERVER_ERROR", message: err.message } },
      { status: 500 }
    );
  }
}
