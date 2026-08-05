import { NextResponse } from "next/server";
import { getSupabaseConfig, fetchVendorServicesFromDb, saveVendorServiceToDb, softDeleteVendorServiceFromDb } from "@/lib/supabase";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const vendorId = searchParams.get("vendor_id") || "v-demo-vendor";

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

    const payload: Record<string, any> = {
      vendor_id: vendor_id || "v-demo-vendor",
      category_id: category_id || null,
      name: name.trim(),
      description: description ? description.trim() : null,
      base_price: Number(base_price),
      pricing_type: pricing_type || "starting_from",
      duration: duration ? Number(duration) : null,
      status: status || "published",
      is_active: is_active !== undefined ? Boolean(is_active) : true,
      updated_at: new Date().toISOString(),
    };

    if (body.id) {
      payload.id = body.id;
    }

    const { data, error } = await saveVendorServiceToDb(payload);

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
      { success: true, statusCode: body.id ? 200 : 201, message: body.id ? "Service updated successfully" : "Service created successfully", data: createdService },
      { status: body.id ? 200 : 201 }
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
      { success: true, statusCode: 200, message: "Service soft deleted successfully." },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, statusCode: 500, error: { code: "SERVER_ERROR", message: err.message } },
      { status: 500 }
    );
  }
}
